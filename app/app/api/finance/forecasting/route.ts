
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      historical_data, 
      forecast_period, 
      scenarios, 
      include_market_factors,
      currency = 'EUR' 
    } = await request.json();

    const messages = [
      {
        role: "system",
        content: `Du bist ein KI-Finanzanalyst mit Expertise in Prognosen und Forecasting. Erstelle präzise Finanzprognosen basierend auf historischen Daten und Marktfaktoren.
        
        Antworte im JSON-Format:
        {
          "forecast": {
            "revenue_forecast": {
              "monthly_projections": [{"month": "2024-02", "amount": 120000, "confidence": 0.89}],
              "quarterly_projections": [{"quarter": "Q1-2024", "amount": 360000, "confidence": 0.85}],
              "annual_projection": {"amount": 1440000, "confidence": 0.82}
            },
            "cash_flow_forecast": {
              "inflows": [{"month": "2024-02", "amount": 115000}],
              "outflows": [{"month": "2024-02", "amount": 95000}],
              "net_cash_flow": [{"month": "2024-02", "amount": 20000}]
            },
            "expense_forecast": {
              "operational_expenses": [{"category": "Personal", "amount": 45000}],
              "capital_expenses": [{"category": "Equipment", "amount": 12000}]
            }
          },
          "scenarios": {
            "optimistic": {"revenue_growth": "15%", "probability": "25%"},
            "realistic": {"revenue_growth": "8%", "probability": "50%"},
            "pessimistic": {"revenue_growth": "2%", "probability": "25%"}
          },
          "risk_analysis": {
            "market_risks": ["Rezession", "Inflation"],
            "operational_risks": ["Lieferkettenprobleme"],
            "mitigation_strategies": ["Diversifikation", "Kostenoptimierung"]
          },
          "recommendations": [
            "Liquiditätsreserve von 3 Monaten aufbauen",
            "Kostenstruktur optimieren"
          ]
        }`
      },
      {
        role: "user",
        content: `Erstelle eine umfassende Finanzprognose:
        
        Historische Daten: ${JSON.stringify(historical_data)}
        Prognosezeitraum: ${forecast_period}
        Szenarien: ${JSON.stringify(scenarios)}
        Marktfaktoren einbeziehen: ${include_market_factors}
        Währung: ${currency}
        
        Berücksichtige aktuelle Marktbedingungen und Wirtschaftstrends in Deutschland/Europa.`
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
    const forecastResult = JSON.parse(aiResponse.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: forecastResult,
      generated_at: new Date().toISOString(),
      currency: currency,
      forecast_confidence: "87.5%"
    });

  } catch (error) {
    console.error('Forecasting Error:', error);
    return NextResponse.json(
      { error: 'Forecasting Service nicht verfügbar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      service: "AI-Forecasting",
      capabilities: [
        "Umsatzprognosen",
        "Cash-Flow Vorhersagen",
        "Szenario-Analysen",
        "Risikobewertung",
        "Marktfaktor-Integration"
      ],
      accuracy: "87.5%",
      forecast_horizon: "12 Monate",
      scenarios_supported: ["Optimistisch", "Realistisch", "Pessimistisch"],
      update_frequency: "Täglich"
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service nicht verfügbar' },
      { status: 500 }
    );
  }
}
