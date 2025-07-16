
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      workflow_type, 
      trigger_conditions,
      target_modules,
      automation_level = 'high',
      decision_criteria
    } = await request.json();

    const messages = [
      {
        role: "system", 
        content: `Du bist ein KI-Workflow-Orchestrator. Erstelle intelligente, autonome Geschäftsprozesse, die verschiedene Module miteinander verbinden und automatisieren.
        
        Antworte im JSON-Format:
        {
          "workflow_orchestration": {
            "workflow_id": "Workflow ID",
            "workflow_name": "Workflow Name",
            "automation_level": "Niedrig|Mittel|Hoch|Vollautomatisch",
            "process_steps": [
              {
                "step_number": 1,
                "module": "Modul",
                "action": "Aktion",
                "trigger": "Auslöser",
                "decision_point": "Entscheidungspunkt",
                "automation": "Automatisierungsgrad",
                "human_intervention": "Menschliche Intervention nötig",
                "expected_duration": "Erwartete Dauer"
              }
            ],
            "data_flow": [
              {
                "from_module": "Quellmodul",
                "to_module": "Zielmodul",
                "data_type": "Datentyp",
                "transformation": "Transformation"
              }
            ]
          },
          "ai_decision_engine": {
            "decision_rules": [
              {
                "condition": "Bedingung",
                "action": "Aktion", 
                "confidence_threshold": "Vertrauensschwelle",
                "escalation_trigger": "Eskalationsauslöser"
              }
            ],
            "machine_learning_components": [
              {
                "component": "KI-Komponente",
                "purpose": "Zweck",
                "accuracy": "Genauigkeit",
                "training_status": "Trainingsstatus"
              }
            ],
            "autonomous_capabilities": [
              "Autonome Fähigkeit 1",
              "Autonome Fähigkeit 2"
            ]
          },
          "workflow_optimization": {
            "efficiency_metrics": {
              "processing_time": "Verarbeitungszeit",
              "cost_per_transaction": "Kosten pro Transaktion",
              "error_rate": "Fehlerrate",
              "automation_rate": "Automatisierungsgrad"
            },
            "optimization_suggestions": [
              {
                "area": "Bereich",
                "current_performance": "Aktuelle Leistung",
                "optimization_potential": "Optimierungspotenzial",
                "implementation_effort": "Umsetzungsaufwand"
              }
            ]
          },
          "monitoring_and_alerting": {
            "kpi_monitoring": [
              {
                "kpi": "KPI",
                "current_value": "Aktueller Wert",
                "target_value": "Zielwert",
                "status": "Status"
              }
            ],
            "alert_conditions": [
              {
                "condition": "Bedingung",
                "severity": "Schweregrad",
                "notification_method": "Benachrichtigungsmethode",
                "escalation_path": "Eskalationspfad"
              }
            ]
          },
          "compliance_and_audit": {
            "compliance_requirements": ["Compliance-Anforderung 1"],
            "audit_trail": "Prüfpfad",
            "data_governance": "Data Governance",
            "security_measures": ["Sicherheitsmaßnahme 1"]
          }
        }`
      },
      {
        role: "user",
        content: `Erstelle und orchestriere einen intelligenten AI-Workflow:
        
        Workflow-Typ: ${workflow_type}
        Auslösebedingungen: ${JSON.stringify(trigger_conditions)}
        Zielmodule: ${JSON.stringify(target_modules)}
        Automatisierungsgrad: ${automation_level}
        Entscheidungskriterien: ${JSON.stringify(decision_criteria)}
        
        Optimiere für maximale Autonomie und Effizienz bei minimaler menschlicher Intervention.`
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
    const workflowConfig = JSON.parse(aiResponse.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: workflowConfig,
      workflow_created: new Date().toISOString(),
      automation_level: automation_level,
      estimated_efficiency_gain: "35-45%"
    });

  } catch (error) {
    console.error('AI Workflow Orchestration Error:', error);
    return NextResponse.json(
      { error: 'AI-Workflow-Orchestrierung nicht verfügbar' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      service: "AI-Workflow-Orchestrierung",
      capabilities: [
        "Intelligente Prozessautomatisierung",
        "Cross-Module-Integration",
        "Autonome Entscheidungsfindung",
        "Workflow-Optimierung",
        "Real-time Monitoring",
        "Adaptive Learning",
        "Compliance Automation"
      ],
      automation_levels: ["Niedrig (30%)", "Mittel (60%)", "Hoch (85%)", "Vollautomatisch (95%)"],
      supported_triggers: [
        "Zeit-basiert",
        "Event-basiert", 
        "Daten-basiert",
        "Schwellenwert-basiert",
        "ML-Vorhersage-basiert"
      ],
      workflow_types: [
        "HR-Recruiting-Pipeline",
        "Finance-Approval-Chain",
        "Logistics-Optimization",
        "Customer-Journey",
        "Compliance-Monitoring"
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service nicht verfügbar' },
      { status: 500 }
    );
  }
}
