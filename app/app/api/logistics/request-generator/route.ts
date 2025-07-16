
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RequestGeneratorRequest {
  tenantId: string;
  requestType: 'ROAD' | 'AIR' | 'SEA' | 'RAIL';
  year?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RequestGeneratorRequest = await request.json();
    const { tenantId, requestType, year } = body;

    const currentYear = year || new Date().getFullYear();
    const requestNumber = await generateRequestNumber(tenantId, requestType, currentYear);

    return NextResponse.json({
      success: true,
      requestNumber,
      requestType,
      year: currentYear
    });
  } catch (error) {
    console.error('Request generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateRequestNumber(tenantId: string, requestType: string, year: number): Promise<string> {
  // Get prefix based on transport type
  const prefix = getRequestPrefix(requestType);
  
  // Mock implementation for request number generation
  const lastRequest = null; // Mock: Always start with number 1

  let nextNumber = 1;
  if (lastRequest) {
    // Extract the number from the last request
    const match = lastRequest.requestNumber.match(/(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  // Format as 4-digit number with leading zeros
  const formattedNumber = nextNumber.toString().padStart(4, '0');
  
  return `${prefix}-${year}-${formattedNumber}`;
}

function getRequestPrefix(requestType: string): string {
  switch (requestType) {
    case 'ROAD': return 'road';
    case 'AIR': return 'air';
    case 'SEA': return 'sea';
    case 'RAIL': return 'rail';
    default: return 'gen';
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const requestType = url.searchParams.get('requestType');

    if (!tenantId || !requestType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const currentYear = new Date().getFullYear();
    const nextRequestNumber = await generateRequestNumber(
      tenantId, 
      requestType as 'ROAD' | 'AIR' | 'SEA' | 'RAIL', 
      currentYear
    );

    return NextResponse.json({
      success: true,
      nextRequestNumber,
      requestType,
      year: currentYear
    });
  } catch (error) {
    console.error('Get request generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
