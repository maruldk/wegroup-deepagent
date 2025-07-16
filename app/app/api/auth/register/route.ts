
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { createSystemRoles } from "@/lib/rbac"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, tenantId } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        tenantId: tenantId || null
      }
    })

    // If tenantId is provided, assign default employee role
    if (tenantId) {
      // Ensure system roles exist for this tenant
      await createSystemRoles(tenantId)
      
      // Find employee role
      const employeeRole = await prisma.role.findFirst({
        where: {
          name: "employee",
          tenantId
        }
      })

      if (employeeRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: employeeRole.id
          }
        })
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
