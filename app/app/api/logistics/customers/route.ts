
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
    const customerType = url.searchParams.get("customerType");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    if (status) where.status = status;
    if (customerType) where.customerType = customerType;
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { customerNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.logisticsCustomer.findMany({
        where,
        include: {
          _count: {
            select: {
              requests: true,
              orders: true,
            },
          },
        },
        orderBy: [
          { totalValue: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.logisticsCustomer.count({ where }),
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
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
      customerType,
      companyName,
      firstName,
      lastName,
      email,
      phone,
      website,
      industry,
      address,
      billingAddress,
      taxId,
      vatNumber,
      registrationNumber,
      paymentTerms,
      creditLimit,
      creditRating,
      preferredCurrency,
      preferredLanguage,
      notificationPrefs,
    } = body;

    // Generate unique customer number
    const customerNumber = `CUS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const customer = await prisma.logisticsCustomer.create({
      data: {
        tenantId: session.user.tenantId || "",
        customerNumber,
        customerType,
        companyName,
        firstName,
        lastName,
        email,
        phone,
        website,
        industry,
        address,
        billingAddress,
        taxId,
        vatNumber,
        registrationNumber,
        paymentTerms,
        creditLimit,
        creditRating,
        preferredCurrency,
        preferredLanguage,
        notificationPrefs,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
