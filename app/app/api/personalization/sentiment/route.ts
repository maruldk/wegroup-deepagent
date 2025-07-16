import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const mockSentimentAnalyses = [
      {
        id: 'sent_1',
        tenantId,
        content: 'Sample content analysis',
        sentimentScore: 0.85,
        language: 'en',
        contentLength: 150,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockSentimentAnalyses
    });

  } catch (error) {
    console.error('Error fetching sentiment analyses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, content, language = 'en' } = body;

    if (!tenantId || !content) {
      return NextResponse.json({ 
        error: 'Tenant ID and content are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const sentimentAnalysis = {
      id: `sent_${Date.now()}`,
      tenantId,
      content,
      sentimentScore: 0.85,
      language,
      contentLength: content.length,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: sentimentAnalysis,
      message: 'Sentiment analysis completed successfully'
    });

  } catch (error) {
    console.error('Error creating sentiment analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}