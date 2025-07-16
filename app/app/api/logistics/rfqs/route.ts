
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
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    if (status) where.status = status;

    const [rfqs, total] = await Promise.all([
      prisma.logisticsRFQ.findMany({
        where,
        include: {
          customerRequest: {
            include: {
              customer: {
                select: {
                  id: true,
                  customerNumber: true,
                  companyName: true,
                  firstName: true,
                  lastName: true,
                  email: true,
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
                  performanceScore: true,
                },
              },
            },
          },
          comparison: true,
          _count: {
            select: {
              quotes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.logisticsRFQ.count({ where }),
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
      customerRequestId,
      title,
      description,
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

    const rfq = await prisma.logisticsRFQ.create({
      data: {
        tenantId: session.user.tenantId || "",
        customerRequestId,
        rfqNumber,
        title,
        description,
        requirements,
        criteria,
        criteriaWeights,
        targetSuppliers,
        deadline: new Date(deadline),
        budget,
        currency,
        evaluationCriteria,
        automaticEvaluation,
        status: "DRAFT",
        createdBy: session.user.id,
      },
      include: {
        customerRequest: {
          include: {
            customer: {
              select: {
                id: true,
                customerNumber: true,
                companyName: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
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
