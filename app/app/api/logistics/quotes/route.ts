
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
    const supplierId = url.searchParams.get("supplierId");
    const rfqId = url.searchParams.get("rfqId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    if (rfqId) where.rfqId = rfqId;

    const [quotes, total] = await Promise.all([
      prisma.logisticsSupplierQuote.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              supplierNumber: true,
              companyName: true,
              email: true,
              phone: true,
              performanceScore: true,
              qualityScore: true,
              reliabilityScore: true,
            },
          },
          rfq: {
            select: {
              id: true,
              rfqNumber: true,
              title: true,
              status: true,
              deadline: true,
              customerRequest: {
                select: {
                  id: true,
                  title: true,
                  customer: {
                    select: {
                      id: true,
                      companyName: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: [
          { aiScore: "desc" },
          { totalPrice: "asc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.logisticsSupplierQuote.count({ where }),
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
      basePrice,
      additionalCosts,
      totalPrice,
      currency,
      validUntil,
      deliveryTime,
      deliveryTerms,
      paymentTerms,
      serviceLevel,
      insuranceCoverage,
      trackingOptions,
      specialServices,
      terms,
      attachments,
    } = body;

    // Generate unique quote number
    const quoteNumber = `QUO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const quote = await prisma.logisticsSupplierQuote.create({
      data: {
        tenantId: session.user.tenantId || "",
        rfqId,
        supplierId,
        quoteNumber,
        title,
        description,
        basePrice,
        additionalCosts,
        totalPrice,
        currency,
        validUntil: new Date(validUntil),
        deliveryTime,
        deliveryTerms,
        paymentTerms,
        serviceLevel,
        insuranceCoverage,
        trackingOptions,
        specialServices,
        terms,
        attachments,
        status: "DRAFT",
      },
      include: {
        supplier: {
          select: {
            id: true,
            supplierNumber: true,
            companyName: true,
            email: true,
            phone: true,
            performanceScore: true,
          },
        },
        rfq: {
          select: {
            id: true,
            rfqNumber: true,
            title: true,
            status: true,
            deadline: true,
          },
        },
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
