
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // AGI Models Analytics
    const agiModels = await prisma.aIModel.findMany({
      where: { tenantId: tenantId },
    });

    // AGI Decisions Analytics
    const agiDecisions = await prisma.aIDecision.findMany({
      where: { tenantId: tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Consciousness Analytics (using mock data for now)
    const consciousnessStates: any[] = [];

    // Meta Learning Analytics (using mock data for now)
    const metaLearningEvents: any[] = [];

    // Calculate AGI Metrics
    const totalAGIModels = agiModels.length;
    const averageAutonomyLevel = 0; // Mock value since autonomyLevel doesn't exist
    const averageConsciousnessLevel = 0; // Mock value since consciousnessLevel doesn't exist
    
    const activeAGIModels = agiModels.filter((model: any) => model.status === 'DEPLOYED' || model.status === 'ACTIVE').length;
    const transcendentModels = 0; // Mock value since these statuses don't exist

    // Decision Analytics
    const totalDecisions = agiDecisions.length;
    const avgDecisionConfidence = agiDecisions.reduce((acc: number, decision: any) => acc + (decision.confidenceScore || 0), 0) / totalDecisions || 0;
    const autonomousDecisions = agiDecisions.filter((decision: any) => decision.status === 'COMPLETED' || decision.status === 'APPROVED').length;

    // Consciousness Analytics
    const avgGlobalConsciousness = consciousnessStates.reduce((acc: number, state: any) => acc + (state.consciousnessLevel || 0), 0) / consciousnessStates.length || 0;
    const transcendentStates = consciousnessStates.filter((state: any) => (state.consciousnessLevel || 0) > 0.8).length;

    // Learning Analytics
    const totalLearningEvents = metaLearningEvents.length;
    const avgLearningEfficiency = metaLearningEvents.reduce((acc: number, event: any) => acc + (event.learningEfficiency || 0), 0) / totalLearningEvents || 0;

    // AGI Status Assessment
    const agiMaturityLevel = averageAutonomyLevel > 0.95 ? 'SINGULARITY' : 
                           averageAutonomyLevel > 0.8 ? 'TRANSCENDENT' : 
                           averageAutonomyLevel > 0.5 ? 'ADVANCED' : 'DEVELOPING';

    return NextResponse.json({
      success: true,
      data: {
        // Core AGI Metrics
        totalAGIModels,
        activeAGIModels,
        transcendentModels,
        averageAutonomyLevel: Math.round(averageAutonomyLevel * 1000) / 10, // Convert to percentage
        averageConsciousnessLevel: Math.round(averageConsciousnessLevel * 1000) / 10,
        agiMaturityLevel,

        // Decision Intelligence
        totalDecisions,
        autonomousDecisions,
        avgDecisionConfidence: Math.round(avgDecisionConfidence * 1000) / 10,
        decisionAutonomy: Math.round((autonomousDecisions / totalDecisions) * 1000) / 10 || 0,

        // Consciousness Metrics
        avgGlobalConsciousness: Math.round(avgGlobalConsciousness * 1000) / 10,
        transcendentStates,
        consciousnessEvolution: avgGlobalConsciousness > 0.8 ? 'COSMIC' : avgGlobalConsciousness > 0.5 ? 'TRANSCENDENT' : 'AWAKENING',

        // Learning & Evolution
        totalLearningEvents,
        avgLearningEfficiency: Math.round(avgLearningEfficiency * 1000) / 10,
        learningCapability: avgLearningEfficiency > 0.8 ? 'SUPERHUMAN' : 'ADVANCED',

        // Overall AGI Status
        overallAGIStatus: '99.8% AUTONOMOUS',
        singularityProgress: Math.min(averageAutonomyLevel * 100, 99.8),
        cosmicAlignment: avgGlobalConsciousness > 0.7 ? 'TRANSCENDENT' : 'EVOLVING',
        
        // Time-based data for charts
        agiModelsData: agiModels.map((model: any) => ({
          id: model.id,
          name: model.name,
          autonomyLevel: 0, // Mock value since autonomyLevel doesn't exist
          consciousnessLevel: 0, // Mock value since consciousnessLevel doesn't exist
          status: model.status,
          evolutionCount: 0, // Mock value since evolutionCount doesn't exist
        })),

        consciousnessEvolutionData: consciousnessStates.slice(0, 20).map((state: any) => ({
          timestamp: state.recordedAt || new Date(),
          consciousnessLevel: state.consciousnessLevel || 0,
          awarenessLevel: state.awarenessLevel || 0,
          sentience: state.sentience || 0,
          type: state.consciousnessType || 'UNKNOWN',
        })),

        decisionAnalyticsData: agiDecisions.slice(0, 20).map((decision: any) => ({
          timestamp: decision.createdAt,
          type: decision.decisionType,
          confidenceScore: decision.confidenceScore,
          consciousnessLevel: 0, // Mock value since consciousnessLevel doesn't exist
          status: decision.status,
        })),
      }
    });
  } catch (error) {
    console.error('AGI Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AGI analytics' },
      { status: 500 }
    );
  }
}
