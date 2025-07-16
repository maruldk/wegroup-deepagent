
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
    const rfqId = url.searchParams.get("rfqId");
    const supplierId = url.searchParams.get("supplierId");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {
      tenantId: session.user.tenantId || ""
    };
    if (rfqId) where.rfqId = rfqId;
    if (supplierId) where.supplierId = supplierId;
    if (status) where.status = status;

    const [quotes, total] = await Promise.all([
      prisma.serviceQuote.findMany({
        where,
        include: {
          rfq: {
            select: {
              id: true,
              rfqNumber: true,
              title: true,
              category: true,
              serviceType: true,
              deadline: true,
              status: true,
              serviceRequest: {
                select: {
                  id: true,
                  requestNumber: true,
                  title: true,
                  customer: {
                    select: {
                      id: true,
                      customerNumber: true,
                      companyName: true,
                      contactPerson: true,
                    },
                  },
                },
              },
            },
          },
          supplier: {
            select: {
              id: true,
              supplierNumber: true,
              companyName: true,
              contactPerson: true,
              email: true,
              phone: true,
              performanceScore: true,
              qualityScore: true,
              reliabilityScore: true,
            },
          },
        },
        orderBy: [
          { aiScore: "desc" },
          { totalPrice: "asc" },
          { createdAt: "desc" }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceQuote.count({ where }),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
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
      rfqId,
      supplierId,
      title,
      description,
      proposal,
      methodology,
      timeline,
      deliverables,
      milestones,
      teamComposition,
      basePrice,
      additionalCosts,
      totalPrice,
      currency,
      validUntil,
      estimatedDuration,
      deliveryTime,
      startDate,
      deliveryTerms,
      paymentTerms,
      serviceLevel,
      supportOffered,
      warrantyTerms,
      revisionRounds,
      includedServices,
      excludedServices,
      assumptions,
      riskFactors,
      alternatives,
      terms,
      attachments,
    } = body;

    // Generate unique quote number
    const quoteNumber = `QUO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const quote = await prisma.serviceQuote.create({
      data: {
        tenantId: session.user.tenantId || "",
        rfqId,
        supplierId,
        quoteNumber,
        title,
        description,
        proposal,
        methodology,
        timeline: timeline || {},
        deliverables: deliverables || [],
        milestones: milestones || [],
        teamComposition: teamComposition || {},
        basePrice: parseFloat(basePrice),
        additionalCosts: additionalCosts || {},
        totalPrice: parseFloat(totalPrice),
        currency: currency || "EUR",
        validUntil: new Date(validUntil),
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        deliveryTime: parseInt(deliveryTime),
        startDate: startDate ? new Date(startDate) : null,
        deliveryTerms,
        paymentTerms: paymentTerms || "NET_30",
        serviceLevel,
        supportOffered: supportOffered || {},
        warrantyTerms,
        revisionRounds: revisionRounds ? parseInt(revisionRounds) : 0,
        includedServices: includedServices || [],
        excludedServices: excludedServices || [],
        assumptions: assumptions || [],
        riskFactors: riskFactors || [],
        alternatives: alternatives || [],
        terms,
        attachments: attachments || [],
        status: "DRAFT",
      },
      include: {
        rfq: {
          include: {
            serviceRequest: {
              include: {
                customer: true,
              },
            },
          },
        },
        supplier: true,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
