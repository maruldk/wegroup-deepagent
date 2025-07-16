
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Find customer by email
    const customer = await db.customer.findUnique({
      where: { email },
      include: {
        portalAccount: true
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // For demo purposes, we'll create a simple password check
    // In production, you'd want proper password hashing for customers
    const isValidPassword = password === 'customer123' || await bcrypt.compare(password, customer.email) // Simple demo logic

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create or get portal account
    let portalAccount = customer.portalAccount
    if (!portalAccount) {
      portalAccount = await db.customerPortalAccount.create({
        data: {
          customerId: customer.id,
          tenantId: customer.tenantId,
          loginCount: 1,
          lastLoginAt: new Date()
        }
      })
    } else {
      // Update login info
      portalAccount = await db.customerPortalAccount.update({
        where: { id: portalAccount.id },
        data: {
          loginCount: { increment: 1 },
          lastLoginAt: new Date()
        }
      })
    }

    // Generate JWT token for customer portal
    const token = jwt.sign(
      {
        customerId: customer.id,
        portalAccountId: portalAccount.id,
        tenantId: customer.tenantId,
        type: 'customer_portal'
      },
      process.env.NEXTAUTH_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      data: {
        token,
        customer: {
          id: customer.id,
          companyName: customer.companyName,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          customerTier: customer.customerTier
        },
        portalAccount: {
          id: portalAccount.id,
          accessLevel: portalAccount.accessLevel,
          preferredLanguage: portalAccount.preferredLanguage,
          lastLoginAt: portalAccount.lastLoginAt
        }
      }
    })

  } catch (error) {
    console.error('Customer portal auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
