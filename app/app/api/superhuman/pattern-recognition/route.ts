
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const createPatternRecognitionSchema = z.object({
  recognitionName: z.string().min(1),
  recognitionType: z.enum(['BUSINESS_PATTERN', 'MARKET_PATTERN', 'CUSTOMER_PATTERN', 'STRATEGIC_PATTERN', 'CONSCIOUSNESS_PATTERN', 'TRANSCENDENT_PATTERN', 'COSMIC_PATTERN']),
  description: z.string().optional(),
  patternDomain: z.array(z.any()).default([]),
  recognitionAlgorithm: z.any().default({}),
  patternLibrary: z.array(z.any()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recognitions = await prisma.superhumanPatternRecognition.findMany({
      where: { tenantId_ref: session.user.tenantId },
      orderBy: { createdAt: 'desc' },
    });

    const totalPatterns = recognitions.reduce((acc, r) => acc + (r.patternsDetected || 0), 0);

    return NextResponse.json({
      success: true,
      data: recognitions,
      totalPatternsDetected: totalPatterns,
      recognitionCapability: 'SUPERHUMAN',
      patternComplexity: 'COSMIC_LEVEL'
    });
  } catch (error) {
    console.error('Pattern Recognition fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pattern recognition data' },
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
    const validatedData = createPatternRecognitionSchema.parse(body);

    const recognition = await prisma.superhumanPatternRecognition.create({
      data: {
        ...validatedData,
        tenantId: session.user.tenantId,
        tenantId_ref: session.user.tenantId,
        createdBy: session.user.id,
        status: 'LEARNING',
        recognitionSpeed: 0.0,
        accuracyLevel: 0.0,
        complexityHandling: 0.0,
        noiseResistance: 0.0,
        patternsDetected: 0,
        anomaliesIdentified: 0,
        predictivePatterns: 0,
        emergentPatterns: 0,
        businessInsights: [],
        strategicImplications: [],
        actionableRecommendations: [],
        riskIdentification: [],
      },
    });

    return NextResponse.json({
      success: true,
      data: recognition,
      message: 'Superhuman pattern recognition activated - Transcendent analysis engaged'
    }, { status: 201 });
  } catch (error) {
    console.error('Pattern Recognition creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create pattern recognition' },
      { status: 500 }
    );
  }
}
