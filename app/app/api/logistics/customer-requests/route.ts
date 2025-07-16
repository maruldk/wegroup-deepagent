
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
    const customerId = url.searchParams.get("customerId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const [requests, total] = await Promise.all([
      prisma.logisticsCustomerRequest.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              customerNumber: true,
              companyName: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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
      prisma.logisticsCustomerRequest.count({ where }),
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
    console.error("Error fetching customer requests:", error);
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
      requestType,
      title,
      description,
      origin,
      destination,
      cargoType,
      cargoDetails,
      weight,
      volume,
      dimensions,
      value,
      currency,
      requestedPickupDate,
      requestedDeliveryDate,
      isUrgent,
      requirements,
      specialInstructions,
      source,
    } = body;

    // Generate unique request number
    const requestNumber = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const customerRequest = await prisma.logisticsCustomerRequest.create({
      data: {
        tenantId: session.user.tenantId || "",
        customerId,
        requestNumber,
        requestType,
        title,
        description,
        origin,
        destination,
        cargoType,
        cargoDetails,
        weight,
        volume,
        dimensions,
        value,
        currency,
        requestedPickupDate: requestedPickupDate ? new Date(requestedPickupDate) : null,
        requestedDeliveryDate: requestedDeliveryDate ? new Date(requestedDeliveryDate) : null,
        isUrgent,
        requirements,
        specialInstructions,
        source,
        status: "DRAFT",
      },
      include: {
        customer: {
          select: {
            id: true,
            customerNumber: true,
            companyName: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(customerRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating customer request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
