
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
    const supplierId = url.searchParams.get("supplierId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (supplierId) where.supplierId = supplierId;

    const [orders, total] = await Promise.all([
      prisma.logisticsOrder.findMany({
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
          supplier: {
            select: {
              id: true,
              supplierNumber: true,
              companyName: true,
              contactPerson: true,
              email: true,
              phone: true,
              performanceScore: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.logisticsOrder.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
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
      supplierId,
      rfqId,
      quoteId,
      customerOrderNumber,
      title,
      description,
      orderValue,
      currency,
      paymentTerms,
      deliveryTerms,
      requestedDeliveryDate,
      confirmedDeliveryDate,
      orderData,
      customerNotes,
      supplierNotes,
      internalNotes,
    } = body;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.logisticsOrder.create({
      data: {
        tenantId: session.user.tenantId || "",
        customerId,
        supplierId,
        rfqId,
        quoteId,
        orderNumber,
        customerOrderNumber,
        title,
        description,
        orderValue,
        currency,
        paymentTerms,
        deliveryTerms,
        requestedDeliveryDate: requestedDeliveryDate ? new Date(requestedDeliveryDate) : null,
        confirmedDeliveryDate: confirmedDeliveryDate ? new Date(confirmedDeliveryDate) : null,
        orderData,
        customerNotes,
        supplierNotes,
        internalNotes,
        status: "PENDING",
        createdBy: session.user.id,
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
        supplier: {
          select: {
            id: true,
            supplierNumber: true,
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
            performanceScore: true,
          },
        },
      },
    });

    // Update supplier and customer statistics
    await Promise.all([
      prisma.logisticsSupplier.update({
        where: { id: supplierId },
        data: {
          totalOrders: { increment: 1 },
          totalRevenue: { increment: orderValue },
          lastActivityAt: new Date(),
        },
      }),
      prisma.logisticsCustomer.update({
        where: { id: customerId },
        data: {
          totalOrders: { increment: 1 },
          totalValue: { increment: orderValue },
          lastActivityAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
