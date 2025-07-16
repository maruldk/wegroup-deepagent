
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Create or update approval workflow
export async function POST(request: NextRequest) {
  try {
    const { invoiceId, tenantId, approvalType = 'HYBRID' } = await request.json();

    if (!invoiceId || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get invoice and related data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        confidenceScores: true,
        threeWayMatches: true
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Determine approval workflow based on amount and confidence
    const amount = parseFloat(invoice.totalAmount.toString());
    const confidence = invoice.confidenceScores?.[0]?.overallConfidence || 0;

    let workflowConfig = {
      workflowType: approvalType,
      maxApprovalLevel: 1,
      stage1Approver: null,
      stage2Approver: null,
      stage3Approver: null,
      aiRecommendation: 'REVIEW'
    };

    // Define approval rules based on amount thresholds
    if (amount < 500 && confidence > 0.9) {
      workflowConfig.workflowType = 'AUTOMATIC';
      workflowConfig.maxApprovalLevel = 0;
      workflowConfig.aiRecommendation = 'APPROVE';
    } else if (amount < 5000) {
      workflowConfig.maxApprovalLevel = 1;
      workflowConfig.aiRecommendation = confidence > 0.7 ? 'APPROVE' : 'REVIEW';
    } else if (amount < 25000) {
      workflowConfig.maxApprovalLevel = 2;
      workflowConfig.aiRecommendation = confidence > 0.8 ? 'APPROVE' : 'REVIEW';
    } else {
      workflowConfig.maxApprovalLevel = 3;
      workflowConfig.aiRecommendation = confidence > 0.9 ? 'APPROVE' : 'REVIEW';
    }

    // Use AI to determine optimal approval workflow
    const messages = [
      {
        role: 'user',
        content: `Analyze this invoice and recommend an optimal approval workflow:

INVOICE DATA:
- Invoice Number: ${invoice.invoiceNumber}
- Vendor: ${invoice.vendorName}
- Amount: ${invoice.totalAmount} ${invoice.currency}
- Confidence Score: ${confidence}
- Processing Status: ${invoice.processingStatus}

CONFIDENCE ANALYSIS:
${JSON.stringify(invoice.confidenceScores?.[0] || {}, null, 2)}

THREE-WAY MATCH RESULTS:
${JSON.stringify(invoice.threeWayMatches?.[0] || {}, null, 2)}

Based on the following approval thresholds:
- < €500: Automatic approval (if confidence > 90%)
- €500 - €5,000: Sachbearbeiter approval
- €5,000 - €25,000: Abteilungsleiter approval
- > €25,000: Geschäftsführung approval

Recommend:
1. Workflow type (AUTOMATIC, MANUAL, HYBRID)
2. Required approval levels
3. Risk assessment
4. Escalation conditions
5. AI processing recommendation

Please respond in JSON format:
{
  "workflowType": "AUTOMATIC, MANUAL, or HYBRID",
  "maxApprovalLevel": "number (0-3)",
  "aiRecommendation": "APPROVE, REJECT, or REVIEW",
  "aiConfidenceScore": "number between 0 and 1",
  "riskAssessment": {
    "riskLevel": "LOW, MEDIUM, or HIGH",
    "riskFactors": ["list of risk factors"],
    "mitigationActions": ["list of mitigation actions"]
  },
  "escalationRules": [
    {
      "condition": "string",
      "action": "string",
      "triggerAfter": "number of hours"
    }
  ],
  "approvalStages": [
    {
      "stage": "number",
      "role": "string",
      "authority": "string",
      "maxAmount": "number",
      "required": "boolean"
    }
  ]
}

Respond with raw JSON only.`
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
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });

    const aiResponse = await response.json();
    const workflowRecommendation = JSON.parse(aiResponse.choices[0].message.content);

    // Find existing approval workflow or create new one
    let approvalWorkflow = await prisma.approvalWorkflow.findFirst({
      where: { invoiceId }
    });

    if (approvalWorkflow) {
      approvalWorkflow = await prisma.approvalWorkflow.update({
        where: { id: approvalWorkflow.id },
        data: {
          workflowType: workflowRecommendation.workflowType,
          maxApprovalLevel: workflowRecommendation.maxApprovalLevel,
          currentStage: workflowRecommendation.workflowType === 'AUTOMATIC' ? 'AUTO_APPROVED' : 'PENDING',
          aiRecommendation: workflowRecommendation.aiRecommendation,
          aiConfidenceScore: workflowRecommendation.aiConfidenceScore,
          aiRiskAssessment: workflowRecommendation.riskAssessment,
          escalationRules: workflowRecommendation.escalationRules,
          stage1Amount: amount,
          stage2Amount: amount,
          stage3Amount: amount
        }
      });
    } else {
      approvalWorkflow = await prisma.approvalWorkflow.create({
        data: {
          invoiceId,
          tenantId,
          workflowType: workflowRecommendation.workflowType,
          maxApprovalLevel: workflowRecommendation.maxApprovalLevel,
          currentStage: workflowRecommendation.workflowType === 'AUTOMATIC' ? 'AUTO_APPROVED' : 'PENDING',
          aiRecommendation: workflowRecommendation.aiRecommendation,
          aiConfidenceScore: workflowRecommendation.aiConfidenceScore,
          aiRiskAssessment: workflowRecommendation.riskAssessment,
          escalationRules: workflowRecommendation.escalationRules,
          stage1Amount: amount,
          stage2Amount: amount,
          stage3Amount: amount
        }
      });
    }

    // Update invoice status
    const newStatus = workflowRecommendation.workflowType === 'AUTOMATIC' ? 'APPROVED' : 'VALIDATION_PENDING';
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        processingStatus: newStatus,
        approvalStatus: workflowRecommendation.workflowType === 'AUTOMATIC' ? 'APPROVED' : 'PENDING'
      }
    });

    // Send notification if manual approval required
    if (workflowRecommendation.workflowType !== 'AUTOMATIC') {
      await prisma.invoiceNotification.create({
        data: {
          invoiceId,
          tenantId,
          notificationType: 'APPROVAL_REQUEST',
          recipientId: 'system', // This would be determined by business logic
          recipientRole: 'APPROVER',
          subject: `Invoice ${invoice.invoiceNumber} requires approval`,
          message: `Invoice from ${invoice.vendorName} for ${invoice.totalAmount} ${invoice.currency} requires your approval.`,
          priority: workflowRecommendation.riskAssessment.riskLevel === 'HIGH' ? 'HIGH' : 'NORMAL'
        }
      });
    }

    return NextResponse.json({
      success: true,
      approvalWorkflow,
      recommendation: workflowRecommendation
    });

  } catch (error) {
    console.error('Approval workflow error:', error);
    return NextResponse.json({ error: 'Approval workflow failed' }, { status: 500 });
  }
}

// Get approval workflow for an invoice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    const approvalWorkflow = await prisma.approvalWorkflow.findFirst({
      where: { invoiceId },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            vendorName: true,
            totalAmount: true,
            processingStatus: true,
            approvalStatus: true
          }
        }
      }
    });

    if (!approvalWorkflow) {
      return NextResponse.json({ error: 'Approval workflow not found' }, { status: 404 });
    }

    return NextResponse.json(approvalWorkflow);

  } catch (error) {
    console.error('Error fetching approval workflow:', error);
    return NextResponse.json({ error: 'Failed to fetch approval workflow' }, { status: 500 });
  }
}

// Update approval workflow (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const { workflowId, stage, action, comments, approverId } = await request.json();

    if (!workflowId || !stage || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const workflow = await prisma.approvalWorkflow.findUnique({
      where: { id: workflowId },
      include: { invoice: true }
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Update the specific stage
    const updateData: any = {};
    const currentTime = new Date();

    if (stage === 1) {
      updateData.stage1Status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      updateData.stage1ApprovedAt = currentTime;
      updateData.stage1Comments = comments;
      updateData.stage1Approver = approverId;
    } else if (stage === 2) {
      updateData.stage2Status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      updateData.stage2ApprovedAt = currentTime;
      updateData.stage2Comments = comments;
      updateData.stage2Approver = approverId;
    } else if (stage === 3) {
      updateData.stage3Status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      updateData.stage3ApprovedAt = currentTime;
      updateData.stage3Comments = comments;
      updateData.stage3Approver = approverId;
    }

    // Determine next stage or completion
    if (action === 'APPROVE') {
      if (stage < workflow.maxApprovalLevel) {
        updateData.currentStage = `STAGE_${stage + 1}`;
        updateData.approvalLevel = stage + 1;
      } else {
        updateData.currentStage = 'COMPLETED';
        updateData.approvalLevel = workflow.maxApprovalLevel;
      }
    } else {
      updateData.currentStage = 'REJECTED';
    }

    // Update workflow
    const updatedWorkflow = await prisma.approvalWorkflow.update({
      where: { id: workflowId },
      data: updateData
    });

    // Update invoice status
    const invoiceStatus = action === 'APPROVE' && stage === workflow.maxApprovalLevel ? 'APPROVED' : 
                         action === 'REJECT' ? 'REJECTED' : 'VALIDATION_PENDING';
    
    await prisma.invoice.update({
      where: { id: workflow.invoiceId },
      data: {
        processingStatus: invoiceStatus,
        approvalStatus: action === 'APPROVE' && stage === workflow.maxApprovalLevel ? 'APPROVED' : 
                       action === 'REJECT' ? 'REJECTED' : 'PENDING',
        approvedBy: action === 'APPROVE' && stage === workflow.maxApprovalLevel ? approverId : null,
        approvedAt: action === 'APPROVE' && stage === workflow.maxApprovalLevel ? currentTime : null
      }
    });

    // Send notification
    await prisma.invoiceNotification.create({
      data: {
        invoiceId: workflow.invoiceId,
        tenantId: workflow.tenantId,
        notificationType: 'STATUS_UPDATE',
        recipientId: 'system',
        recipientRole: 'FINANCE_TEAM',
        subject: `Invoice ${workflow.invoice.invoiceNumber} ${action.toLowerCase()}d`,
        message: `Invoice has been ${action.toLowerCase()}d at stage ${stage}. ${comments || ''}`,
        priority: 'NORMAL'
      }
    });

    return NextResponse.json({
      success: true,
      workflow: updatedWorkflow,
      invoiceStatus
    });

  } catch (error) {
    console.error('Error updating approval workflow:', error);
    return NextResponse.json({ error: 'Failed to update approval workflow' }, { status: 500 });
  }
}
