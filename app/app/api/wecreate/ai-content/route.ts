
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contentType, prompt, projectId, style, targetAudience, brandVoice } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const tenantId = user.tenant.id

    // Validate project exists if provided
    if (projectId) {
      const project = await db.creativeProject.findFirst({
        where: { id: projectId, tenantId }
      })
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }

    // Prepare AI prompt based on content type
    let aiPrompt = ''
    let responseFormat: any = undefined

    switch (contentType) {
      case 'TEXT':
        aiPrompt = `
Create engaging ${style || 'professional'} content for the following:

Prompt: ${prompt}
Target Audience: ${targetAudience || 'general'}
Brand Voice: ${brandVoice || 'professional'}

Requirements:
- Keep it concise and impactful
- Match the specified brand voice
- Optimize for the target audience
- Include relevant keywords naturally
- Ensure originality and creativity

Provide the content as plain text.
`
        break

      case 'MARKETING_COPY':
        aiPrompt = `
Create compelling marketing copy for:

Campaign Brief: ${prompt}
Style: ${style || 'persuasive'}
Target Audience: ${targetAudience}
Brand Voice: ${brandVoice}

Include:
1. Headline (attention-grabbing)
2. Body copy (persuasive and benefit-focused)
3. Call-to-action (clear and compelling)
4. Optional: Subheadings and bullet points

Respond in JSON format:
{
  "headline": "Main headline",
  "subheadline": "Supporting headline",
  "bodyCopy": "Main marketing copy",
  "callToAction": "CTA text",
  "bulletPoints": ["point 1", "point 2", "point 3"],
  "keywords": ["keyword1", "keyword2"],
  "tone": "Identified tone and style"
}
`
        responseFormat = { type: 'json_object' }
        break

      case 'SOCIAL_MEDIA':
        aiPrompt = `
Create social media content for:

Brief: ${prompt}
Platform: ${style || 'multi-platform'}
Target Audience: ${targetAudience}
Brand Voice: ${brandVoice}

Provide content optimized for engagement including:
- Compelling hook
- Relevant hashtags
- Call-to-action
- Platform-specific formatting

Respond in JSON format:
{
  "content": "Main post content",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "callToAction": "CTA text",
  "platform": "optimized platform",
  "engagementTips": ["tip1", "tip2"]
}
`
        responseFormat = { type: 'json_object' }
        break

      case 'BLOG_POST':
        aiPrompt = `
Create a comprehensive blog post outline and content for:

Topic: ${prompt}
Style: ${style || 'informative'}
Target Audience: ${targetAudience}
Brand Voice: ${brandVoice}

Structure:
1. SEO-optimized title
2. Introduction
3. Main sections with subheadings
4. Conclusion
5. Meta description

Respond in JSON format:
{
  "title": "SEO-optimized title",
  "metaDescription": "150-character meta description",
  "introduction": "Engaging introduction",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content"
    }
  ],
  "conclusion": "Conclusion with CTA",
  "keywords": ["primary keyword", "secondary keywords"],
  "readingTime": "estimated reading time"
}
`
        responseFormat = { type: 'json_object' }
        break

      default:
        aiPrompt = prompt
    }

    // Call AI API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        response_format: responseFormat,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate content')
    }

    const aiResponse = await response.json()
    let generatedContent = aiResponse.choices[0].message.content

    // Parse JSON if structured response
    if (responseFormat?.type === 'json_object') {
      try {
        generatedContent = JSON.parse(generatedContent)
      } catch (e) {
        console.error('Failed to parse AI JSON response:', e)
      }
    }

    // Create asset in database if project is specified
    let asset = null
    if (projectId) {
      asset = await db.creativeAsset.create({
        data: {
          projectId,
          title: `AI Generated ${contentType}`,
          description: `Generated content: ${prompt.substring(0, 100)}...`,
          assetType: 'TEXT',
          aiGeneratedPrompt: prompt,
          aiConfidenceScore: 0.9,
          aiTags: [contentType.toLowerCase(), style || 'general'],
          aiDescription: typeof generatedContent === 'string' 
            ? generatedContent.substring(0, 200) + '...'
            : JSON.stringify(generatedContent).substring(0, 200) + '...',
          aiQualityScore: 0.85,
          tenantId,
          createdBy: userId,
          textContent: typeof generatedContent === 'string' 
            ? generatedContent 
            : JSON.stringify(generatedContent, null, 2)
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent,
        contentType,
        generatedAt: new Date().toISOString(),
        asset: asset,
        metadata: {
          prompt: prompt.substring(0, 100) + '...',
          style,
          targetAudience,
          brandVoice
        }
      }
    })

  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
