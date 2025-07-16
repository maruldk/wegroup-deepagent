
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// POST /api/finance/invoices/upload - Upload and process invoice with OCR
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64 for LLM API
    const bytes = await file.arrayBuffer()
    const base64String = Buffer.from(bytes).toString('base64')
    
    // Create initial invoice record
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `TEMP-${Date.now()}`, // Temporary until OCR extracts real number
        vendorName: 'Processing...',
        vendorEmail: '',
        invoiceDate: new Date(),
        dueDate: new Date(),
        totalAmount: 0,
        currency: 'EUR',
        processingStatus: 'OCR_IN_PROGRESS',
        documentUrl: `data:application/pdf;base64,${base64String}`,
        tenantId: session.user.tenantId,
        // Initialize KI fields
        ocrConfidenceScore: 0.0,
        extractedData: {},
        aiValidationScore: 0.0
      }
    })

    // Start OCR processing with LLM API
    const ocrPrompt = `
Please extract the following information from this invoice PDF and return it in JSON format:

{
  "invoiceNumber": "<invoice number>",
  "vendorName": "<vendor/supplier name>",
  "vendorEmail": "<vendor email if available>",
  "invoiceDate": "<invoice date in YYYY-MM-DD format>",
  "dueDate": "<due date in YYYY-MM-DD format>",
  "totalAmount": <total amount as number>,
  "currency": "<currency code like EUR, USD>",
  "lineItems": [
    {
      "description": "<item description>",
      "quantity": <quantity>,
      "unitPrice": <unit price>,
      "totalPrice": <total price>
    }
  ],
  "vatAmount": <VAT amount if available>,
  "vatRate": <VAT rate percentage if available>,
  "paymentTerms": "<payment terms if mentioned>",
  "confidence": <confidence score 0-100>
}

Extract all visible text and structure it according to the schema above. If any field is not found, use null for strings/objects and 0 for numbers.
`

    try {
      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [{
            role: 'user',
            content: [{
              type: 'text',
              text: ocrPrompt
            }, {
              type: 'file',
              file: {
                filename: file.name,
                file_data: `data:application/pdf;base64,${base64String}`
              }
            }]
          }],
          response_format: { type: "json_object" },
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error('OCR processing failed')
      }

      const aiResponse = await response.json()
      const extractedData = JSON.parse(aiResponse.choices[0].message.content)

      // Generate document hash for duplicate detection
      const documentHash = Buffer.from(base64String).toString('base64').slice(0, 32)

      // Check for duplicates
      const duplicateCheck = await prisma.invoice.findFirst({
        where: {
          OR: [
            { documentHash },
            { 
              invoiceNumber: extractedData.invoiceNumber,
              vendorName: extractedData.vendorName,
              tenantId: session.user.tenantId
            }
          ]
        }
      })

      // Update invoice with extracted data
      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          invoiceNumber: extractedData.invoiceNumber || `INV-${Date.now()}`,
          vendorName: extractedData.vendorName || 'Unknown Vendor',
          vendorEmail: extractedData.vendorEmail || '',
          invoiceDate: extractedData.invoiceDate ? new Date(extractedData.invoiceDate) : new Date(),
          dueDate: extractedData.dueDate ? new Date(extractedData.dueDate) : new Date(),
          totalAmount: parseFloat(extractedData.totalAmount) || 0,
          currency: extractedData.currency || 'EUR',
          processingStatus: 'OCR_COMPLETED',
          documentHash,
          ocrConfidenceScore: (extractedData.confidence || 0) / 100,
          extractedData: extractedData,
          isDuplicate: !!duplicateCheck,
          // AI validation based on confidence and completeness
          aiValidationScore: calculateValidationScore(extractedData),
          // Predict GL account based on vendor and description
          predictedGlAccount: await predictGLAccount(extractedData),
          // Forecast payment date
          paymentForecastDate: calculatePaymentForecast(extractedData)
        }
      })

      return NextResponse.json({
        invoice: updatedInvoice,
        extractedData,
        isDuplicate: !!duplicateCheck,
        duplicateMatch: duplicateCheck ? {
          id: duplicateCheck.id,
          invoiceNumber: duplicateCheck.invoiceNumber,
          createdAt: duplicateCheck.createdAt
        } : null
      })

    } catch (ocrError) {
      console.error('OCR Processing Error:', ocrError)
      
      // Update status to indicate OCR failure
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          processingStatus: 'REJECTED',
          extractedData: { error: 'OCR processing failed' }
        }
      })

      return NextResponse.json({ 
        error: 'OCR processing failed',
        invoice: { id: invoice.id, status: 'REJECTED' }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Invoice Upload Error:', error)
    return NextResponse.json({ error: 'Upload processing failed' }, { status: 500 })
  }
}

// Helper function to calculate AI validation score
function calculateValidationScore(data: any): number {
  let score = 0
  const fields = ['invoiceNumber', 'vendorName', 'invoiceDate', 'totalAmount']
  
  fields.forEach(field => {
    if (data[field] && data[field] !== '' && data[field] !== 0) {
      score += 25
    }
  })
  
  // Bonus points for additional fields
  if (data.dueDate) score += 10
  if (data.vendorEmail) score += 10
  if (data.lineItems && data.lineItems.length > 0) score += 10
  
  return Math.min(100, score) / 100
}

// Helper function to predict GL account (simple rule-based for now)
async function predictGLAccount(data: any): Promise<string | null> {
  const vendorName = data.vendorName?.toLowerCase() || ''
  const description = data.lineItems?.[0]?.description?.toLowerCase() || ''
  
  // Simple rule-based prediction
  if (vendorName.includes('office') || description.includes('office')) {
    return '6300' // Office Expenses
  } else if (vendorName.includes('software') || description.includes('software')) {
    return '6400' // Software & IT
  } else if (vendorName.includes('travel') || description.includes('travel')) {
    return '6500' // Travel Expenses
  } else if (vendorName.includes('marketing') || description.includes('marketing')) {
    return '6600' // Marketing
  }
  
  return '6000' // General Expenses
}

// Helper function to calculate payment forecast
function calculatePaymentForecast(data: any): Date | null {
  if (!data.dueDate) return null
  
  const dueDate = new Date(data.dueDate)
  const paymentTerms = data.paymentTerms?.toLowerCase() || ''
  
  // Add buffer based on payment terms
  if (paymentTerms.includes('immediate')) {
    return dueDate
  } else if (paymentTerms.includes('30')) {
    dueDate.setDate(dueDate.getDate() + 3) // 3 days buffer
  } else {
    dueDate.setDate(dueDate.getDate() + 5) // 5 days buffer
  }
  
  return dueDate
}
