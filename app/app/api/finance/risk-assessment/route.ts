
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      financial_data, 
      assessment_type, 
      risk_categories,
      time_horizon = '12_months'
    } = await request.json();

    const messages = [
      {
        role: "system",
        content: `Du bist ein KI-Risikoanalyst mit Expertise in Finanzrisiken. Führe eine umfassende Risikobewertung durch und erstelle Handlungsempfehlungen.
        
        Antworte im JSON-Format:
        {
          "risk_assessment": {
            "overall_risk_score": "1-100",
            "risk_level": "Niedrig|Mittel|Hoch|Kritisch",
            "financial_risks": {
              "liquidity_risk": {
                "score": "1-100",
                "description": "Liquiditätsrisiko Bewertung",
                "factors": ["Faktor1", "Faktor2"],
                "recommendations": ["Empfehlung1"]
              },
              "credit_risk": {
                "score": "1-100", 
                "description": "Kreditrisiko",
                "exposure": "Risikohöhe in EUR",
                "mitigation": ["Maßnahme1"]
              },
              "market_risk": {
                "score": "1-100",
                "volatility": "Marktvolatilität",
                "sensitivity": "Marktempfindlichkeit"
              },
              "operational_risk": {
                "score": "1-100",
                "key_risks": ["Risiko1", "Risiko2"],
                "business_continuity": "Geschäftskontinuität"
              }
            }
          },
          "early_warning_indicators": [
            {
              "indicator": "Cash-Flow Ratio",
              "current_value": "Aktueller Wert",
              "threshold": "Schwellenwert",
              "status": "Grün|Gelb|Rot"
            }
          ],
          "scenario_analysis": {
            "stress_test_results": {
              "mild_recession": "Auswirkung bei leichter Rezession",
              "severe_recession": "Auswirkung bei schwerer Rezession",
              "market_crash": "Auswirkung bei Marktcrash"
            }
          },
          "action_plan": {
            "immediate_actions": ["Sofortmaßnahme1"],
            "short_term_actions": ["Kurzfristige Maßnahme1"],
            "long_term_actions": ["Langfristige Maßnahme1"]
          },
          "compliance_risks": {
            "regulatory_compliance": "Regulatory Status",
            "tax_compliance": "Steuerrechtliches Risiko",
            "audit_readiness": "Prüfungsbereitschaft"
          }
        }`
      },
      {
        role: "user",
        content: `Führe eine umfassende Finanzrisikobewertung durch:
        
        Finanzdaten: ${JSON.stringify(financial_data)}
        Bewertungstyp: ${assessment_type}
        Risikokategorien: ${JSON.stringify(risk_categories)}
        Zeithorizont: ${time_horizon}
        
        Berücksichtige aktuelle deutsche/europäische Regulatorik und Marktbedingungen.`
      }
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        response_format: { type: "json_object" },
        max_tokens: 3000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const aiResponse = await response.json();
    const riskAssessment = JSON.parse(aiResponse.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: riskAssessment,
      assessment_date: new Date().toISOString(),
      validity_period: time_horizon,
      next_review: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('Risk Assessment Error:', error);
    return NextResponse.json(
      { error: 'Risikobewertung Service nicht verfügbar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      service: "AI-Risikobewertung",
      capabilities: [
        "Liquiditätsrisiko-Analyse",
        "Kreditrisiko-Bewertung",
        "Marktrisiko-Monitoring",
        "Operationelle Risiken",
        "Compliance-Risiken",
        "Szenario-Analysen",
        "Stress-Tests"
      ],
      risk_categories: [
        "Finanzrisiken",
        "Operationelle Risiken", 
        "Marktrisiken",
        "Regulatorische Risiken",
        "Strategische Risiken"
      ],
      assessment_frequency: "Wöchentlich",
      early_warning_system: "Aktiviert"
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service nicht verfügbar' },
      { status: 500 }
    );
  }
}
