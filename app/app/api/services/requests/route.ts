
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const customerId = url.searchParams.get("customerId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {
      tenantId: session.user.tenantId || ""
    };
    if (status) where.status = status;
    if (category) where.category = category;
    if (customerId) where.customerId = customerId;

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              customerNumber: true,
              companyName: true,
              contactPerson: true,
              email: true,
              phone: true,
              industry: true,
            },
          },
          rfqs: {
            select: {
              id: true,
              rfqNumber: true,
              status: true,
              totalQuotes: true,
              deadline: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerId,
      category,
      serviceType,
      title,
      description,
      requirements,
      specifications,
      budget,
      currency,
      deadline,
      priority,
      location,
      targetAudience,
      expectedOutcome,
      successCriteria,
      constraints,
      additionalInfo,
      attachments,
      source,
    } = body;

    // Generate unique request number
    const requestNumber = `SRQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        tenantId: session.user.tenantId || "",
        customerId,
        requestNumber,
        category,
        serviceType,
        title,
        description,
        requirements: requirements || {},
        specifications: specifications || {},
        budget: budget ? parseFloat(budget) : null,
        currency: currency || "EUR",
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || "MEDIUM",
        location: location || {},
        targetAudience,
        expectedOutcome,
        successCriteria: successCriteria || {},
        constraints: constraints || {},
        additionalInfo,
        attachments: attachments || [],
        source: source || "PORTAL",
        status: "DRAFT",
      },
      include: {
        customer: {
          select: {
            id: true,
            customerNumber: true,
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
            industry: true,
          },
        },
      },
    });

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating service request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
