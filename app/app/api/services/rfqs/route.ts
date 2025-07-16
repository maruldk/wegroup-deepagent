
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
    const serviceType = url.searchParams.get("serviceType");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {
      tenantId: session.user.tenantId || ""
    };
    if (status) where.status = status;
    if (category) where.category = category;
    if (serviceType) where.serviceType = serviceType;

    const [rfqs, total] = await Promise.all([
      prisma.serviceRFQ.findMany({
        where,
        include: {
          serviceRequest: {
            include: {
              customer: {
                select: {
                  id: true,
                  customerNumber: true,
                  companyName: true,
                  contactPerson: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          quotes: {
            include: {
              supplier: {
                select: {
                  id: true,
                  supplierNumber: true,
                  companyName: true,
                  email: true,
                  performanceScore: true,
                  qualityScore: true,
                },
              },
            },
          },
          comparison: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceRFQ.count({ where }),
    ]);

    return NextResponse.json({
      rfqs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching RFQs:", error);
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
      serviceRequestId,
      title,
      description,
      category,
      serviceType,
      requirements,
      criteria,
      criteriaWeights,
      targetSuppliers,
      deadline,
      budget,
      currency,
      evaluationCriteria,
      automaticEvaluation,
    } = body;

    // Generate unique RFQ number
    const rfqNumber = `RFQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const rfq = await prisma.serviceRFQ.create({
      data: {
        tenantId: session.user.tenantId || "",
        serviceRequestId,
        rfqNumber,
        title,
        description,
        category,
        serviceType,
        requirements: requirements || {},
        criteria: criteria || {},
        criteriaWeights: criteriaWeights || {},
        targetSuppliers: targetSuppliers || [],
        deadline: new Date(deadline),
        budget: budget ? parseFloat(budget) : null,
        currency: currency || "EUR",
        evaluationCriteria: evaluationCriteria || {},
        automaticEvaluation: automaticEvaluation !== false,
        status: "DRAFT",
        createdBy: session.user.id,
      },
      include: {
        serviceRequest: {
          include: {
            customer: true,
          },
        },
      },
    });

    return NextResponse.json(rfq, { status: 201 });
  } catch (error) {
    console.error("Error creating RFQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
