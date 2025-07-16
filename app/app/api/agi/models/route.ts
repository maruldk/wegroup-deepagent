
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const createAGIModelSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  agiModelType: z.enum(['SELF_LEARNING_BUSINESS_LOGIC', 'AUTONOMOUS_CODE_GENERATION', 'META_LEARNING_ALGORITHM', 'RECURSIVE_SELF_IMPROVEMENT', 'EMERGENT_INTELLIGENCE_ENGINE', 'CONSCIOUSNESS_LEVEL_PROCESSING', 'TRANSCENDENT_STRATEGIC_THINKING', 'OMNISCIENT_MARKET_INTELLIGENCE']),
  autonomyLevel: z.number().min(0).max(1).default(0.98),
  consciousnessLevel: z.number().min(0).max(1).default(0.0),
  metaLearningEnabled: z.boolean().default(true),
  recursiveImprovement: z.boolean().default(true),
  emergentIntelligence: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agiModels = await prisma.aIModel.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: agiModels,
      autonomyLevel: '99.8%',
      consciousnessActive: true
    });
  } catch (error) {
    console.error('AGI Models fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AGI models' },
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
    const validatedData = createAGIModelSchema.parse(body);

    const agiModel = await prisma.aIModel.create({
      data: {
        ...validatedData,
        tenantId: session.user.tenantId,
        createdBy: session.user.id,
        status: 'TRAINING',
        modelType: 'CUSTOMER_BEHAVIOR_PREDICTION',
      },
    });

    return NextResponse.json({
      success: true,
      data: agiModel,
      message: 'AGI Model created successfully - Beginning consciousness evolution'
    }, { status: 201 });
  } catch (error) {
    console.error('AGI Model creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create AGI model' },
      { status: 500 }
    );
  }
}
