
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/permission-engine/menu-permissions - Get hierarchical menu permissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleFilter = searchParams.get('module');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const where: any = {};
    
    if (moduleFilter) {
      where.module = moduleFilter;
    }
    
    if (!includeInactive) {
      where.isVisible = true;
    }

    // Get menu permissions with hierarchical structure
    const menuPermissions = await prisma.menuPermission.findMany({
      where,
      include: {
        permission: true,
        parentMenu: true,
        childMenus: {
          include: {
            permission: true,
            childMenus: true
          }
        },
        roleMenuPermissions: {
          include: {
            role: true
          }
        }
      },
      orderBy: [
        { module: 'asc' },
        { sortOrder: 'asc' },
        { menuTitle: 'asc' }
      ]
    });

    // Build hierarchical structure
    const hierarchy = buildMenuHierarchy(menuPermissions);

    return NextResponse.json({
      menuPermissions: hierarchy,
      modules: await getAvailableModules()
    });

  } catch (error) {
    console.error('Error fetching menu permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/permission-engine/menu-permissions - Create new menu permission
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      menuKey,
      menuPath,
      menuTitle,
      parentMenuId,
      module,
      requiredActions,
      iconName,
      description,
      sortOrder
    } = body;

    // Create base permission first
    const permission = await prisma.permission.create({
      data: {
        name: `${module.toLowerCase()}.${menuKey}`,
        description: description || `Permission for ${menuTitle}`,
        module: module,
        action: 'access',
        resource: menuKey
      }
    });

    // Create menu permission
    const menuPermission = await prisma.menuPermission.create({
      data: {
        menuKey,
        menuPath,
        menuTitle,
        parentMenuId,
        permissionId: permission.id,
        module,
        requiredActions: requiredActions || ['read'],
        iconName,
        description,
        sortOrder: sortOrder || 0,
        tenantId: session.user.tenantId
      },
      include: {
        permission: true,
        parentMenu: true,
        childMenus: true
      }
    });

    return NextResponse.json({ 
      menuPermission, 
      message: 'Menu permission created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating menu permission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function buildMenuHierarchy(menuPermissions: any[]): any[] {
  const rootItems = menuPermissions.filter(item => !item.parentMenuId);
  
  function attachChildren(item: any): any {
    const children = menuPermissions.filter(child => child.parentMenuId === item.id);
    return {
      ...item,
      children: children.map(attachChildren)
    };
  }
  
  return rootItems.map(attachChildren);
}

async function getAvailableModules() {
  const modules = await prisma.menuPermission.groupBy({
    by: ['module'],
    _count: {
      id: true
    }
  });
  
  return modules.map(m => ({
    name: m.module,
    count: m._count.id
  }));
}
