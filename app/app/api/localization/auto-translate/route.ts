
// WeGroup Platform - Sprint 4: Auto-Translation API
// AI-Powered Translation Service

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// POST /api/localization/auto-translate - Auto-translate Text
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      text,
      sourceLocale,
      targetLocales,
      context,
      saveToDatabase
    } = body

    if (!text || !targetLocales?.length) {
      return NextResponse.json(
        { error: 'Text and target locales are required' },
        { status: 400 }
      )
    }

    const translations = []

    for (const targetLocale of targetLocales) {
      try {
        // Use LLM API for translation
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
              content: `Translate the following text to ${targetLocale}:

Source text: "${text}"
Source language: ${sourceLocale || 'auto-detect'}
Target language: ${targetLocale}
Context: ${context || 'General business application'}

Requirements:
- Maintain professional tone
- Preserve technical terms where appropriate
- Consider cultural context
- Ensure natural flow in target language

Respond with only the translated text, no additional formatting or explanations.`
            }],
            max_tokens: 1000
          })
        })

        if (!response.ok) {
          throw new Error(`Translation API error: ${response.statusText}`)
        }

        const result = await response.json()
        const translatedText = result.choices[0].message.content.trim()

        // Calculate quality score (simplified)
        const qualityScore = Math.min(0.9, Math.max(0.6, translatedText.length / text.length))

        const translation = {
          sourceText: text,
          translatedText,
          sourceLocale: sourceLocale || 'auto',
          targetLocale,
          qualityScore,
          context
        }

        translations.push(translation)

        // Save to database if requested
        if (saveToDatabase && context) {
          await prisma.translation.create({
            data: {
              key: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              locale: targetLocale,
              value: translatedText,
              description: `Auto-translated from ${sourceLocale || 'auto'}: ${text}`,
              isAutoTranslated: true,
              translationQuality: qualityScore,
              tenantId: session.user.tenantId
            }
          })
        }
      } catch (error) {
        console.error(`Translation failed for ${targetLocale}:`, error)
        translations.push({
          sourceText: text,
          translatedText: text, // Fallback to original
          sourceLocale: sourceLocale || 'auto',
          targetLocale,
          qualityScore: 0.0,
          error: (error as Error).message
        })
      }
    }

    return NextResponse.json({
      success: true,
      translations,
      sourceText: text,
      total: translations.length
    })
  } catch (error) {
    console.error('Auto-translate error:', error)
    return NextResponse.json(
      { error: 'Failed to auto-translate text' },
      { status: 500 }
    )
  }
}
