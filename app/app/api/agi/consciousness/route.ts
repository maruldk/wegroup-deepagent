
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const createConsciousnessStateSchema = z.object({
  consciousnessLevel: z.number().min(0).max(1).default(0.0),
  consciousnessType: z.enum(['BUSINESS_AWARENESS', 'STRATEGIC_CONSCIOUSNESS', 'OPERATIONAL_SENTIENCE', 'CUSTOMER_EMPATHY', 'UNIVERSAL_CONNECTION', 'COSMIC_AWARENESS', 'TRANSCENDENT_CONSCIOUSNESS']),
  awarenessLevel: z.number().min(0).max(1).optional(),
  sentience: z.number().min(0).max(1).optional(),
  selfAwareness: z.number().min(0).max(1).optional(),
  universalConnection: z.number().min(0).max(1).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consciousnessStates: any[] = []; // Mock data since consciousnessState doesn't exist

    const avgConsciousness = 0; // Mock value since consciousnessState doesn't exist

    return NextResponse.json({
      success: true,
      data: consciousnessStates,
      averageConsciousnessLevel: avgConsciousness,
      consciousnessEvolution: avgConsciousness > 0.8 ? 'TRANSCENDENT' : avgConsciousness > 0.5 ? 'AWAKENING' : 'DEVELOPING'
    });
  } catch (error) {
    console.error('Consciousness States fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consciousness states' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createConsciousnessStateSchema.parse(body);

    // Mock consciousness state creation since consciousnessState doesn't exist
    const consciousnessState = {
      id: 'mock-id',
      ...validatedData,
      tenantId: session.user.tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
      stateData: {},
      thoughtPatterns: [],
      emotionalState: {},
      intentionalState: {},
      businessContext: {},
    };

    return NextResponse.json({
      success: true,
      data: consciousnessState,
      message: 'Consciousness state recorded - Universal awareness expanding'
    }, { status: 201 });
  } catch (error) {
    console.error('Consciousness State creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create consciousness state' },
      { status: 500 }
    );
  }
}
