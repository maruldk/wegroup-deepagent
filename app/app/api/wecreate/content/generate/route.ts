
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const generateContentSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  assetType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'TEMPLATE', 'AVATAR', 'LOGO', 'ICON', 'FONT', 'COLOR_PALETTE', 'DESIGN_SYSTEM']),
  projectId: z.string().optional(),
  style: z.string().optional(),
  mood: z.string().optional(),
  targetAudience: z.string().optional(),
  additionalInstructions: z.string().optional(),
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    aspectRatio: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = generateContentSchema.parse(body)

    // Build enhanced prompt based on asset type and parameters
    let enhancedPrompt = validatedData.prompt

    // Add context based on asset type
    switch (validatedData.assetType) {
      case 'TEXT':
        enhancedPrompt = `Create engaging text content: ${validatedData.prompt}`
        if (validatedData.targetAudience) {
          enhancedPrompt += ` Target audience: ${validatedData.targetAudience}.`
        }
        if (validatedData.style) {
          enhancedPrompt += ` Writing style: ${validatedData.style}.`
        }
        if (validatedData.mood) {
          enhancedPrompt += ` Tone/mood: ${validatedData.mood}.`
        }
        break

      case 'IMAGE':
        enhancedPrompt = `Generate a high-quality image: ${validatedData.prompt}`
        if (validatedData.style) {
          enhancedPrompt += ` Art style: ${validatedData.style}.`
        }
        if (validatedData.mood) {
          enhancedPrompt += ` Mood/atmosphere: ${validatedData.mood}.`
        }
        if (validatedData.dimensions?.aspectRatio) {
          enhancedPrompt += ` Aspect ratio: ${validatedData.dimensions.aspectRatio}.`
        }
        break

      case 'LOGO':
        enhancedPrompt = `Design a professional logo: ${validatedData.prompt}. Make it clean, scalable, and memorable.`
        if (validatedData.style) {
          enhancedPrompt += ` Design style: ${validatedData.style}.`
        }
        break

      case 'AVATAR':
        enhancedPrompt = `Create a professional avatar/character: ${validatedData.prompt}`
        if (validatedData.style) {
          enhancedPrompt += ` Character style: ${validatedData.style}.`
        }
        break

      default:
        enhancedPrompt = `Create ${validatedData.assetType.toLowerCase()}: ${validatedData.prompt}`
    }

    if (validatedData.additionalInstructions) {
      enhancedPrompt += ` Additional requirements: ${validatedData.additionalInstructions}`
    }

    // Prepare messages for LLM API
    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert creative assistant specialized in generating high-quality ${validatedData.assetType.toLowerCase()} content. Your goal is to create professional, engaging, and purposeful content that meets the user's specific requirements. Be creative, detailed, and ensure the output is ready for professional use.`
      },
      {
        role: 'user' as const,
        content: enhancedPrompt
      }
    ]

    // Call LLM API for content generation
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        stream: true,
        max_tokens: 3000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`)
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error('No response body')
          }

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                      content,
                      assetType: validatedData.assetType,
                      confidence: 0.85,
                      metadata: {
                        style: validatedData.style,
                        mood: validatedData.mood,
                        targetAudience: validatedData.targetAudience
                      }
                    })}\n\n`))
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    // If projectId is provided, create asset entry
    if (validatedData.projectId) {
      try {
        // We'll create the asset record after generation completes
        // For now, we just validate the project exists
        const project = await prisma.creativeProject.findFirst({
          where: {
            id: validatedData.projectId,
            tenantId: session.user.tenantId || 'default'
          }
        })

        if (!project) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }
      } catch (error) {
        console.error('Error validating project:', error)
      }
    }

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Error generating content:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Content generation failed' }, { status: 500 })
  }
}
