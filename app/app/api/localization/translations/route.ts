
// WeGroup Platform - Sprint 4: Multi-Language Translations API
// Translation Management and Localization

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/localization/translations - Get Translations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const locale = searchParams.get('locale')
    const namespace = searchParams.get('namespace')
    const key = searchParams.get('key')

    const where: any = {}
    if (tenantId) where.tenantId = tenantId
    if (locale) where.locale = locale
    if (namespace) where.namespace = namespace
    if (key) where.key = { contains: key, mode: 'insensitive' }

    const translations = await prisma.translation.findMany({
      where,
      orderBy: [
        { namespace: 'asc' },
        { key: 'asc' },
        { locale: 'asc' }
      ]
    })

    // Group by locale for easier frontend consumption
    const groupedTranslations = translations.reduce((acc, translation) => {
      if (!acc[translation.locale]) {
        acc[translation.locale] = {}
      }
      const namespaceKey = translation.namespace || 'default'
      if (!acc[translation.locale][namespaceKey]) {
        acc[translation.locale][namespaceKey] = {}
      }
      acc[translation.locale][namespaceKey][translation.key] = translation.value
      return acc
    }, {} as Record<string, Record<string, Record<string, string>>>)

    return NextResponse.json({
      success: true,
      translations: groupedTranslations,
      raw: translations,
      total: translations.length
    })
  } catch (error) {
    console.error('Translations API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    )
  }
}

// POST /api/localization/translations - Create/Update Translation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      key,
      locale,
      value,
      namespace,
      description,
      isAutoTranslated
    } = body

    if (!key || !locale || !value) {
      return NextResponse.json(
        { error: 'Key, locale, and value are required' },
        { status: 400 }
      )
    }

    // Upsert translation
    const translation = await prisma.translation.upsert({
      where: {
        key_locale_namespace_tenantId: {
          key,
          locale,
          namespace: namespace || 'default',
          tenantId: session.user.tenantId || ''
        }
      },
      update: {
        value,
        description,
        isAutoTranslated: isAutoTranslated || false,
        usageCount: { increment: 1 },
        lastUsedAt: new Date()
      },
      create: {
        key,
        locale,
        value,
        namespace: namespace || 'default',
        description,
        isAutoTranslated: isAutoTranslated || false,
        tenantId: session.user.tenantId
      }
    })

    return NextResponse.json({
      success: true,
      translation,
      message: 'Translation saved successfully'
    })
  } catch (error) {
    console.error('Save Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to save translation' },
      { status: 500 }
    )
  }
}
