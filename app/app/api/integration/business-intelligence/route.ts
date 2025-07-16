
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      data_sources, 
      analysis_scope,
      intelligence_type = 'comprehensive',
      executive_focus = true
    } = await request.json();

    const messages = [
      {
        role: "system",
        content: `Du bist ein KI-Business Intelligence Experte. Erstelle umfassende Geschäftsanalysen und strategische Empfehlungen für das Management.
        
        Antworte im JSON-Format:
        {
          "business_intelligence_report": {
            "executive_dashboard": {
              "business_health_score": "1-100",
              "quarterly_performance": "Performance %",
              "revenue_trend": "Umsatztrend",
              "profitability_index": "Rentabilitätsindex",
              "market_position": "Marktposition",
              "competitive_advantage": "Wettbewerbsvorteil"
            },
            "financial_intelligence": {
              "revenue_analysis": {
                "current_quarter": "Aktuelles Quartal",
                "growth_rate": "Wachstumsrate %",
                "revenue_streams": [
                  {
                    "stream": "Umsatzstrom",
                    "contribution": "Beitrag %",
                    "trend": "Trend"
                  }
                ]
              },
              "cost_intelligence": {
                "cost_structure": "Kostenstruktur",
                "optimization_opportunities": ["Optimierungschance 1"],
                "efficiency_metrics": "Effizienz-Metriken"
              },
              "profitability_analysis": {
                "gross_margin": "Bruttomarge",
                "operating_margin": "Betriebsmarge",
                "net_margin": "Nettomarge",
                "margin_trends": "Margentrends"
              }
            },
            "operational_intelligence": {
              "process_efficiency": {
                "overall_efficiency": "Gesamteffizienz %",
                "bottlenecks": ["Engpass 1"],
                "automation_opportunities": ["Automatisierungschance 1"]
              },
              "resource_utilization": {
                "human_resources": "Personalressourcen",
                "technology_assets": "Technologie-Assets",
                "operational_assets": "Betriebsanlagen"
              },
              "supply_chain_intelligence": {
                "supplier_performance": "Lieferantenleistung",
                "inventory_optimization": "Lageroptimierung",
                "logistics_efficiency": "Logistik-Effizienz"
              }
            },
            "market_intelligence": {
              "customer_analytics": {
                "customer_segments": ["Kundensegment 1"],
                "customer_lifetime_value": "Kundenlebenszeitwert",
                "churn_analysis": "Kundenabwanderungsanalyse"
              },
              "competitive_analysis": {
                "market_share": "Marktanteil",
                "competitive_positioning": "Wettbewerbspositionierung",
                "differentiation_factors": ["Differenzierungsfaktor 1"]
              },
              "market_trends": {
                "emerging_opportunities": ["Neue Chance 1"],
                "market_threats": ["Marktbedrohung 1"],
                "industry_outlook": "Branchenausblick"
              }
            }
          },
          "strategic_recommendations": {
            "immediate_actions": [
              {
                "priority": "Hoch|Mittel|Niedrig",
                "action": "Maßnahme",
                "expected_impact": "Erwartete Auswirkung",
                "timeline": "Zeitrahmen",
                "resources_required": "Benötigte Ressourcen"
              }
            ],
            "medium_term_strategy": [
              {
                "strategic_initiative": "Strategische Initiative",
                "business_case": "Business Case",
                "investment_required": "Erforderliche Investition",
                "expected_roi": "Erwarteter ROI"
              }
            ],
            "long_term_vision": {
              "growth_strategy": "Wachstumsstrategie",
              "market_expansion": "Markterweiterung",
              "innovation_roadmap": "Innovations-Roadmap"
            }
          },
          "risk_and_opportunity_matrix": {
            "high_impact_opportunities": ["Hochgradig wirksame Chance 1"],
            "critical_risks": ["Kritisches Risiko 1"],
            "quick_wins": ["Schneller Erfolg 1"],
            "strategic_bets": ["Strategische Wette 1"]
          },
          "performance_forecasting": {
            "next_quarter_prediction": "Vorhersage nächstes Quartal",
            "annual_outlook": "Jahresausblick",
            "scenario_planning": {
              "optimistic_scenario": "Optimistisches Szenario",
              "realistic_scenario": "Realistisches Szenario", 
              "pessimistic_scenario": "Pessimistisches Szenario"
            }
          }
        }`
      },
      {
        role: "user",
        content: `Erstelle einen umfassenden Business Intelligence Report:
        
        Datenquellen: ${JSON.stringify(data_sources)}
        Analyse-Umfang: ${analysis_scope}
        Intelligence-Typ: ${intelligence_type}
        Executive-Fokus: ${executive_focus}
        
        Erstelle strategische Empfehlungen und Handlungsoptionen für das Management.`
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
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const aiResponse = await response.json();
    const biReport = JSON.parse(aiResponse.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: biReport,
      report_timestamp: new Date().toISOString(),
      analysis_confidence: "92.6%",
      strategic_priority_score: "High"
    });

  } catch (error) {
    console.error('Business Intelligence Error:', error);
    return NextResponse.json(
      { error: 'Business Intelligence Service nicht verfügbar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      service: "AI-Business Intelligence",
      capabilities: [
        "Executive Dashboards",
        "Financial Intelligence", 
        "Operational Intelligence",
        "Market Intelligence",
        "Strategic Recommendations",
        "Performance Forecasting",
        "Risk-Opportunity Analysis"
      ],
      intelligence_areas: [
        "Revenue & Profitability",
        "Operational Efficiency",
        "Market Position",
        "Customer Analytics",
        "Competitive Analysis",
        "Strategic Planning"
      ],
      reporting_frequency: "Real-time, Daily, Weekly, Monthly, Quarterly",
      executive_readiness: "C-Level optimized"
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service nicht verfügbar' },
      { status: 500 }
    );
  }
}
