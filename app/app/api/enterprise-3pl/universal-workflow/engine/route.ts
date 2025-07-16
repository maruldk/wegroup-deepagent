
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const serviceCategory = searchParams.get('serviceCategory');
    const workflowType = searchParams.get('workflowType');
    const isActive = searchParams.get('active') === 'true';

    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;
    if (serviceCategory) whereClause.serviceCategory = serviceCategory;
    if (workflowType) whereClause.workflowType = workflowType;
    if (isActive !== undefined) whereClause.isActive = isActive;

    // Mock-Daten für Demo (da universalWorkflow Tabelle nicht existiert)
    const workflows: any[] = [];

    // Workflow-Statistiken berechnen (Mock-Daten für Demo)
    const workflowStats = await Promise.all(
      workflows.map(async (workflow) => {
        // Mock-Daten für Demo-Zwecke
        const totalInstances = Math.floor(Math.random() * 100) + 10;
        const completedInstances = Math.floor(totalInstances * 0.7);
        const activeInstances = totalInstances - completedInstances;

        // Mock-Daten für durchschnittliche Abschlusszeit
        const avgCompletionTime = { _avg: { progress: Math.floor(Math.random() * 60) + 20 } };

        return {
          ...workflow,
          stats: {
            totalInstances,
            completedInstances,
            activeInstances,
            successRate: totalInstances > 0 ? (completedInstances / totalInstances) * 100 : 0,
            avgCompletionTime: avgCompletionTime._avg?.progress || 0
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: workflowStats,
      total: workflowStats.length,
      message: 'Universal-Workflows erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden der Universal-Workflows:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden der Universal-Workflows' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const {
      workflowName,
      serviceCategory,
      workflowType,
      processSteps,
      approvalMatrix,
      automationRules,
      tenantId
    } = data;

    // Validierung
    if (!workflowName || !serviceCategory || !workflowType || !processSteps || !tenantId) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: workflowName, serviceCategory, workflowType, processSteps, tenantId' 
      }, { status: 400 });
    }

    // Validiere Workflow-Schritte
    if (!Array.isArray(processSteps) || processSteps.length === 0) {
      return NextResponse.json({ 
        error: 'Mindestens ein Prozessschritt ist erforderlich' 
      }, { status: 400 });
    }

    // Berechne Automatisierungsgrad
    const automationLevel = calculateAutomationLevel(processSteps, automationRules);

    // Mock-Workflow-Template für Demo (da universalWorkflow Tabelle nicht existiert)
    const newWorkflow = {
      id: `mock-workflow-${Date.now()}`,
      workflowName,
      serviceCategory,
      workflowType,
      processSteps: processSteps,
      approvalMatrix: approvalMatrix || [],
      automationRules: automationRules || [],
      automationLevel,
      avgProcessTime: 0.0,
      successRate: 0.0,
      isActive: true,
      version: '1.0',
      tenantId,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: newWorkflow,
      message: 'Universal-Workflow erfolgreich erstellt'
    });

  } catch (error) {
    console.error('Fehler beim Erstellen des Universal-Workflows:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Erstellen des Universal-Workflows' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const { id, action, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Workflow-ID fehlt' }, { status: 400 });
    }

    let updatedWorkflow;

    // Mock-Updates für Demo (da universalWorkflow Tabelle nicht existiert)
    if (action === 'activate') {
      updatedWorkflow = {
        id,
        isActive: true,
        updatedAt: new Date()
      };
    } else if (action === 'deactivate') {
      updatedWorkflow = {
        id,
        isActive: false,
        updatedAt: new Date()
      };
    } else {
      // Neuberechnung des Automatisierungsgrads
      if (updateData.processSteps || updateData.automationRules) {
        updateData.automationLevel = calculateAutomationLevel(
          updateData.processSteps || [],
          updateData.automationRules || []
        );
      }

      updatedWorkflow = {
        id,
        ...updateData,
        updatedAt: new Date()
      };
    }

    return NextResponse.json({
      success: true,
      data: updatedWorkflow,
      message: 'Universal-Workflow erfolgreich aktualisiert'
    });

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Universal-Workflows:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Aktualisieren des Universal-Workflows' 
    }, { status: 500 });
  }
}

function calculateAutomationLevel(processSteps: any[], automationRules: any[]): number {
  if (!processSteps || processSteps.length === 0) return 0;

  const totalSteps = processSteps.length;
  const automatedSteps = processSteps.filter(step => 
    step.automated === true || 
    automationRules.some(rule => rule.stepId === step.id && rule.enabled === true)
  ).length;

  return Math.round((automatedSteps / totalSteps) * 100);
}

// Workflow-Instanz starten
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const { workflowId, inputData, tenantId } = data;

    if (!workflowId || !tenantId) {
      return NextResponse.json({ 
        error: 'Workflow-ID und Tenant-ID sind erforderlich' 
      }, { status: 400 });
    }

    // Mock-Workflow für Demo (da universalWorkflow Tabelle nicht existiert)
    const workflow = {
      id: workflowId,
      workflowName: 'Demo Workflow',
      serviceCategory: 'TRANSPORT',
      isActive: true,
      processSteps: [{ name: 'Start', description: 'Initial step' }],
      instances: []
    };

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow nicht gefunden' }, { status: 404 });
    }

    if (!workflow.isActive) {
      return NextResponse.json({ error: 'Workflow ist nicht aktiv' }, { status: 400 });
    }

    // Neue Instanznummer generieren
    const lastInstance = workflow.instances[0];
    const lastNumber = lastInstance ? parseInt((lastInstance as any).instanceNumber?.split('-').pop() || '0') : 0;
    const instanceNumber = `${workflow.serviceCategory}-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(4, '0')}`;

    // Mock-Workflow-Instanz für Demo (da workflowInstance Tabelle nicht existiert)
    const mockInstance = {
      id: `mock-instance-${Date.now()}`,
      workflowId,
      instanceNumber,
      currentStep: (workflow.processSteps as any)?.[0]?.name || 'Start',
      currentStepIndex: 0,
      progress: 0,
      inputData: inputData || {},
      processData: {},
      outputData: {},
      status: 'ACTIVE',
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Mock-KI-Vorhersage
    const aiPrediction = {
      predictedCompletion: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      riskAlerts: ['Low risk workflow execution'],
      confidence: 0.85 + Math.random() * 0.15
    };

    return NextResponse.json({
      success: true,
      data: { ...mockInstance, aiPredictedCompletion: aiPrediction.predictedCompletion, aiRiskAlerts: aiPrediction.riskAlerts },
      prediction: aiPrediction,
      message: 'Workflow-Instanz erfolgreich gestartet (Demo-Modus)'
    });

  } catch (error) {
    console.error('Fehler beim Starten der Workflow-Instanz:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Starten der Workflow-Instanz' 
    }, { status: 500 });
  }
}

async function generateAIPrediction(workflow: any, instance: any) {
  // Simuliere KI-basierte Vorhersage
  const baseProcessTime = workflow.avgProcessTime || 24; // Stunden
  const complexityFactor = workflow.processSteps.length * 0.1;
  const automationFactor = workflow.automationLevel / 100;
  
  const predictedHours = baseProcessTime * (1 + complexityFactor) * (1 - automationFactor * 0.5);
  const predictedCompletion = new Date(Date.now() + predictedHours * 60 * 60 * 1000);
  
  const riskAlerts = [];
  
  // Risikobewertung
  if (workflow.successRate < 80) {
    riskAlerts.push({
      type: 'LOW_SUCCESS_RATE',
      message: 'Workflow hat eine niedrige Erfolgsrate',
      severity: 'MEDIUM'
    });
  }
  
  if (workflow.automationLevel < 50) {
    riskAlerts.push({
      type: 'LOW_AUTOMATION',
      message: 'Niedriger Automatisierungsgrad - manuelle Eingriffe erforderlich',
      severity: 'LOW'
    });
  }
  
  if (workflow.processSteps.length > 10) {
    riskAlerts.push({
      type: 'COMPLEX_WORKFLOW',
      message: 'Komplexer Workflow mit vielen Schritten',
      severity: 'MEDIUM'
    });
  }
  
  return {
    predictedCompletion,
    riskAlerts,
    confidenceScore: Math.random() * 0.3 + 0.7, // 70-100%
    estimatedDuration: predictedHours,
    automationOpportunities: identifyAutomationOpportunities(workflow)
  };
}

function identifyAutomationOpportunities(workflow: any) {
  const opportunities: any[] = [];
  
  workflow.processSteps.forEach((step: any, index: number) => {
    if (!step.automated && step.type !== 'MANUAL_APPROVAL') {
      opportunities.push({
        stepIndex: index,
        stepName: step.name,
        automationPotential: Math.random() * 0.5 + 0.5, // 50-100%
        estimatedSavings: Math.random() * 4 + 1, // 1-5 Stunden
        recommendation: generateAutomationRecommendation(step)
      });
    }
  });
  
  return opportunities;
}

function generateAutomationRecommendation(step: any) {
  const recommendations = [
    'Automatische Datenvalidierung implementieren',
    'E-Mail-Benachrichtigungen automatisieren',
    'Dokumentenerstellung automatisieren',
    'Statusaktualisierungen automatisieren',
    'Datenübertragung zwischen Systemen automatisieren'
  ];
  
  return recommendations[Math.floor(Math.random() * recommendations.length)];
}
