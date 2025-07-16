
// WeGroup Platform - Sprint 4: White-Label Customization API
// Tenant Branding and UI Customization

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/white-label/customization - Get Tenant Customization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    const customization = await prisma.tenantCustomization.findUnique({
      where: { tenantId }
    })

    return NextResponse.json({
      success: true,
      customization: customization || null
    })
  } catch (error) {
    console.error('Get Tenant Customization error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tenant customization' },
      { status: 500 }
    )
  }
}

// POST /api/white-label/customization - Create/Update Tenant Customization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      brandName,
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      darkModeEnabled,
      customDomain,
      customSubdomain,
      enabledFeatures,
      disabledFeatures,
      supportEmail,
      supportPhone,
      privacyPolicyUrl,
      termsOfServiceUrl
    } = body

    const tenantId = session.user.tenantId
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    // Upsert customization
    const customization = await prisma.tenantCustomization.upsert({
      where: { tenantId },
      update: {
        brandName,
        logoUrl,
        faviconUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
        darkModeEnabled,
        customDomain,
        customSubdomain,
        enabledFeatures: enabledFeatures || [],
        disabledFeatures: disabledFeatures || [],
        supportEmail,
        supportPhone,
        privacyPolicyUrl,
        termsOfServiceUrl
      },
      create: {
        tenantId,
        brandName,
        logoUrl,
        faviconUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
        darkModeEnabled: darkModeEnabled !== false,
        customDomain,
        customSubdomain,
        enabledFeatures: enabledFeatures || [],
        disabledFeatures: disabledFeatures || [],
        supportEmail,
        supportPhone,
        privacyPolicyUrl,
        termsOfServiceUrl
      }
    })

    return NextResponse.json({
      success: true,
      customization,
      message: 'Tenant customization saved successfully'
    })
  } catch (error) {
    console.error('Save Tenant Customization error:', error)
    return NextResponse.json(
      { error: 'Failed to save tenant customization' },
      { status: 500 }
    )
  }
}
