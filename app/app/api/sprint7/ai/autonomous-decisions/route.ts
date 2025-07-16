
// WeGroup Platform - Sprint 7: Autonomous Decision Making API
// Premium AI-Powered Decision Engine - $1.00 per call

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AutonomousDecisionEngine, Sprint7AutonomousEngine } from '@/lib/sprint7-autonomous-engine';
import { APIMonetizationManager } from '@/lib/sprint7-api-monetization';

const decisionEngine = AutonomousDecisionEngine.getInstance();
const autonomousEngine = new Sprint7AutonomousEngine();
const apiMonetization = APIMonetizationManager.getInstance();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      decisionType, 
      triggerEvent, 
      contextData, 
      tenantId,
      partnerId = 'internal',
      autoImplement = false 
    } = body;

    if (!decisionType || !triggerEvent || !contextData) {
      await apiMonetization.trackAPIUsage(
        partnerId,
        tenantId || null,
        '/api/sprint7/ai/autonomous-decisions',
        'POST',
        Date.now() - startTime,
        false,
        JSON.stringify(body).length
      );

      return NextResponse.json({
        error: 'Missing required fields: decisionType, triggerEvent, contextData'
      }, { status: 400 });
    }

    // AI-Powered Autonomous Decision Making using LLM API
    const llmResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are an autonomous business decision AI for WeGroup Platform. 
            Make intelligent business decisions based on the provided context.
            Always respond in JSON format with this structure:
            {
              "decision": {"action": "string", "parameters": {}},
              "confidence": 0.0-1.0,
              "reasoning": ["reason1", "reason2"],
              "risks": ["risk1", "risk2"],
              "alternatives": ["alt1", "alt2"],
              "impact": "LOW|MEDIUM|HIGH|CRITICAL",
              "priority": "LOW|MEDIUM|HIGH|URGENT|CRITICAL",
              "implementation_steps": ["step1", "step2"],
              "success_probability": 0.0-1.0,
              "estimated_outcome": "detailed outcome prediction"
            }
            Respond with raw JSON only.`
          },
          {
            role: 'user',
            content: `Decision Type: ${decisionType}
            Trigger Event: ${triggerEvent}
            Context Data: ${JSON.stringify(contextData, null, 2)}
            Tenant ID: ${tenantId || 'platform-wide'}
            
            Please analyze this situation and make an autonomous business decision.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    });

    if (!llmResponse.ok) {
      throw new Error(`LLM API error: ${llmResponse.statusText}`);
    }

    const llmData = await llmResponse.json();
    const aiDecision = JSON.parse(llmData.choices[0].message.content);

    // Create autonomous decision record
    const decision = await decisionEngine.makeAutonomousDecision(
      tenantId || null,
      decisionType,
      triggerEvent,
      contextData
    );

    // Auto-implement if requested and confidence is high
    let implementationResult = null;
    if (autoImplement && aiDecision.confidence > 0.8) {
      const implemented = await decisionEngine.implementDecision(decision.id);
      implementationResult = {
        implemented,
        auto_executed: true,
        execution_time: Date.now() - startTime
      };
    }

    // Track API usage for monetization
    await apiMonetization.trackAPIUsage(
      partnerId,
      tenantId || null,
      '/api/sprint7/ai/autonomous-decisions',
      'POST',
      Date.now() - startTime,
      true,
      JSON.stringify(aiDecision).length
    );

    return NextResponse.json({
      success: true,
      data: {
        decision_id: decision.id,
        ai_decision: aiDecision,
        autonomous_recommendation: {
          action: aiDecision.decision.action,
          confidence: aiDecision.confidence,
          priority: aiDecision.priority,
          impact: aiDecision.impact,
          implementation_ready: aiDecision.confidence > 0.8
        },
        implementation: implementationResult,
        meta: {
          response_time_ms: Date.now() - startTime,
          ai_model: 'gpt-4.1-mini',
          autonomy_level: '95%',
          cost_eur: 1.00
        }
      }
    });

  } catch (error: any) {
    console.error('Autonomous decision API error:', error);
    
    // Track failed API usage
    await apiMonetization.trackAPIUsage(
      'internal',
      null,
      '/api/sprint7/ai/autonomous-decisions',
      'POST',
      Date.now() - startTime,
      false
    );

    return NextResponse.json(
      { error: 'Decision making failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent autonomous decisions
    const decisions = await autonomousEngine.getRecentDecisions({
      tenantId: tenantId || undefined,
      status,
      limit
    });

    return NextResponse.json({
      success: true,
      data: {
        decisions,
        autonomy_metrics: await autonomousEngine.getAutonomyMetrics(),
        api_info: {
          endpoint: '/api/sprint7/ai/autonomous-decisions',
          cost_per_call: '€1.00',
          confidence_threshold: 0.8,
          auto_implementation: 'available'
        }
      }
    });

  } catch (error: any) {
    console.error('Get autonomous decisions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decisions', details: error.message },
      { status: 500 }
    );
  }
}
