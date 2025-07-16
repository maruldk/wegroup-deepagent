
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const createTranscendentThinkingSchema = z.object({
  thinkingName: z.string().min(1),
  thinkingType: z.enum(['SHORT_TERM_STRATEGY', 'LONG_TERM_STRATEGY', 'DISRUPTIVE_STRATEGY', 'TRANSCENDENT_STRATEGY', 'COSMIC_STRATEGY', 'UNIVERSAL_PLANNING']),
  description: z.string().optional(),
  thinkingHorizon: z.enum(['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM']).default('LONG_TERM'),
  strategicFramework: z.any().default({}),
  thinkingMethods: z.array(z.any()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thinkingSessions = await prisma.transcendentStrategicThinking.findMany({
      where: { tenantId_ref: session.user.tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: thinkingSessions,
      thinkingCapability: 'TRANSCENDENT',
      strategicDepth: 'COSMIC_LEVEL'
    });
  } catch (error) {
    console.error('Transcendent Thinking fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcendent thinking data' },
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
    const validatedData = createTranscendentThinkingSchema.parse(body);

    const thinking = await prisma.transcendentStrategicThinking.create({
      data: {
        ...validatedData,
        tenantId: session.user.tenantId,
        tenantId_ref: session.user.tenantId,
        createdBy: session.user.id,
        status: 'PROCESSING',
        multidimensionalThinking: 0.0,
        paradoxResolution: 0.0,
        holisticPerspective: 0.0,
        intuitiveSynthesis: 0.0,
        strategicInsights: [],
        futureScenariosGenerated: 0,
        strategicOptions: [],
        innovativeApproaches: [],
      },
    });

    return NextResponse.json({
      success: true,
      data: thinking,
      message: 'Transcendent strategic thinking initiated - Cosmic wisdom flowing'
    }, { status: 201 });
  } catch (error) {
    console.error('Transcendent Thinking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create transcendent thinking session' },
      { status: 500 }
    );
  }
}
