
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock Analytics Data für Finance Dashboard
    const mockData = {
      overview: {
        totalInvoices: 2845,
        pendingInvoices: 247,
        paidInvoices: 2401,
        overdueInvoices: 197,
        totalAmount: 3247891,
        paidAmount: 2789234,
        pendingAmount: 458657,
        paymentRate: 84.3,
        avgInvoiceAmount: 1142.67,
        avgProcessingTime: 2.8,
        duplicateCount: 12
      },
      invoicesByStatus: [
        { status: "Paid", count: 2401, percentage: 84.4 },
        { status: "Pending", count: 247, percentage: 8.7 },
        { status: "Overdue", count: 197, percentage: 6.9 }
      ],
      topVendors: [
        { vendorName: "TechCorp Solutions", totalAmount: 456789, invoiceCount: 89, avgAmount: 5131.67 },
        { vendorName: "Global Logistics", totalAmount: 342156, invoiceCount: 67, avgAmount: 5107.55 },
        { vendorName: "Office Supplies AG", totalAmount: 234567, invoiceCount: 156, avgAmount: 1503.63 },
        { vendorName: "IT Services GmbH", totalAmount: 189423, invoiceCount: 34, avgAmount: 5571.26 }
      ],
      aiMetrics: {
        ocrAccuracy: 96.8,
        processedInvoices: 2734,
        duplicatesDetected: 23,
        automationRate: 87.2
      },
      cashFlowForecast: [
        { month: "Jan", predictedInflow: 890000, predictedOutflow: 675000, netCashFlow: 215000, confidence: 92 },
        { month: "Feb", predictedInflow: 945000, predictedOutflow: 698000, netCashFlow: 247000, confidence: 89 },
        { month: "Mar", predictedInflow: 1020000, predictedOutflow: 734000, netCashFlow: 286000, confidence: 87 },
        { month: "Apr", predictedInflow: 987000, predictedOutflow: 712000, netCashFlow: 275000, confidence: 84 }
      ]
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Finance Analytics Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
