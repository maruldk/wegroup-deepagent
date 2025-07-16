
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      report_type,
      modules,
      date_range,
      format = 'json',
      executive_summary = true,
      customizations = {}
    } = await request.json();

    const messages = [
      {
        role: "system",
        content: `Du bist ein KI-Berichtsexperte. Erstelle umfassende, professionelle Geschäftsberichte mit datengestützten Erkenntnissen und Visualisierungsvorschlägen.
        
        Antworte im JSON-Format:
        {
          "advanced_report": {
            "report_metadata": {
              "report_id": "Report ID",
              "title": "Berichtstitel",
              "type": "Berichtstyp",
              "generated_at": "Zeitstempel",
              "period_covered": "Berichtszeitraum",
              "executive_summary": "Zusammenfassung"
            },
            "key_metrics": [
              {
                "metric": "Metrik",
                "current_value": "Aktueller Wert",
                "previous_value": "Vorheriger Wert",
                "change": "Veränderung",
                "trend": "Trend",
                "benchmark": "Benchmark"
              }
            ],
            "performance_analysis": {
              "strengths": ["Stärke 1", "Stärke 2"],
              "weaknesses": ["Schwäche 1"],
              "opportunities": ["Chance 1"],
              "threats": ["Bedrohung 1"],
              "overall_assessment": "Gesamtbewertung"
            },
            "module_insights": {
              "hr_insights": {
                "employee_performance": "Mitarbeiterleistung",
                "recruitment_efficiency": "Recruiting-Effizienz",
                "retention_rate": "Mitarbeiterbindung",
                "training_roi": "Schulungs-ROI"
              },
              "finance_insights": {
                "revenue_analysis": "Umsatzanalyse",
                "cost_optimization": "Kostenoptimierung",
                "profitability_trends": "Rentabilitätstrends",
                "cash_flow_status": "Cash-Flow-Status"
              },
              "logistics_insights": {
                "supply_chain_performance": "Lieferketten-Performance",
                "delivery_efficiency": "Liefereffizienz",
                "inventory_optimization": "Lageroptimierung",
                "carrier_performance": "Versandpartner-Leistung"
              }
            },
            "visualizations": [
              {
                "chart_type": "Diagrammtyp",
                "title": "Diagrammtitel",
                "data_source": "Datenquelle",
                "insights": "Erkenntnisse",
                "recommended_format": "Empfohlenes Format"
              }
            ],
            "recommendations": [
              {
                "priority": "Hoch|Mittel|Niedrig",
                "area": "Bereich",
                "recommendation": "Empfehlung",
                "expected_impact": "Erwartete Auswirkung",
                "implementation_timeline": "Umsetzungszeitplan",
                "resource_requirements": "Ressourcenbedarf"
              }
            ],
            "risk_assessment": {
              "identified_risks": ["Risiko 1"],
              "risk_mitigation": ["Risikominderung 1"],
              "contingency_plans": ["Notfallplan 1"]
            },
            "forecast_and_projections": {
              "short_term_outlook": "Kurzfristige Prognose",
              "medium_term_projection": "Mittelfristige Projektion",
              "long_term_vision": "Langfristige Vision",
              "scenario_analysis": "Szenario-Analyse"
            }
          },
          "report_customization": {
            "format_options": ["PDF", "Excel", "PowerPoint", "Interactive Dashboard"],
            "distribution_list": ["Verteilerliste"],
            "automation_schedule": "Automatisierungsplan",
            "access_controls": "Zugangskontrollen"
          }
        }`
      },
      {
        role: "user",
        content: `Erstelle einen umfassenden Geschäftsbericht:
        
        Berichtstyp: ${report_type}
        Module: ${JSON.stringify(modules)}
        Zeitraum: ${JSON.stringify(date_range)}
        Format: ${format}
        Executive Summary: ${executive_summary}
        Anpassungen: ${JSON.stringify(customizations)}
        
        Erstelle einen professionellen, datengestützten Bericht mit konkreten Handlungsempfehlungen.`
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
    const reportData = JSON.parse(aiResponse.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: reportData,
      report_generated: new Date().toISOString(),
      format: format,
      delivery_status: "ready_for_download"
    });

  } catch (error) {
    console.error('Advanced Reporting Error:', error);
    return NextResponse.json(
      { error: 'Berichtsgenerierung nicht verfügbar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      service: "Advanced Reporting Engine",
      capabilities: [
        "Executive Dashboards",
        "Multi-Module Analytics",
        "Predictive Reporting",
        "Automated Report Generation",
        "Custom Visualizations",
        "Performance Benchmarking",
        "Compliance Reporting"
      ],
      report_types: [
        "Executive Summary",
        "Financial Performance",
        "Operational Efficiency", 
        "HR Analytics",
        "Supply Chain Analysis",
        "Risk Assessment",
        "Strategic Planning"
      ],
      output_formats: ["PDF", "Excel", "PowerPoint", "Interactive Dashboard", "API"],
      automation_features: [
        "Scheduled Generation",
        "Event-triggered Reports",
        "Real-time Updates",
        "Auto-distribution"
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service nicht verfügbar' },
      { status: 500 }
    );
  }
}
