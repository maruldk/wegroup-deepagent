
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supplier = await prisma.serviceSupplier.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      include: {
        quotes: {
          include: {
            rfq: {
              select: {
                id: true,
                rfqNumber: true,
                title: true,
                category: true,
                serviceType: true,
                deadline: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            title: true,
            category: true,
            serviceType: true,
            totalAmount: true,
            currency: true,
            status: true,
            startDate: true,
            expectedEndDate: true,
            actualEndDate: true,
            progress: true,
            qualityScore: true,
            satisfactionScore: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        performance: {
          orderBy: { periodStart: "desc" },
          take: 5,
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    const supplier = await prisma.serviceSupplier.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.serviceSupplier.delete({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
