
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
    const search = url.searchParams.get("search");
    const industry = url.searchParams.get("industry");
    const companySize = url.searchParams.get("companySize");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {
      tenantId: session.user.tenantId || ""
    };
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (industry) {
      where.industry = industry;
    }
    
    if (companySize) {
      where.companySize = companySize;
    }

    const [customers, total] = await Promise.all([
      prisma.serviceCustomer.findMany({
        where,
        select: {
          id: true,
          customerNumber: true,
          companyName: true,
          industry: true,
          companySize: true,
          contactPerson: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          website: true,
          isActive: true,
          totalOrders: true,
          totalSpent: true,
          averageOrderValue: true,
          satisfactionScore: true,
          lastActivityAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              requests: true,
              orders: true,
            },
          },
        },
        orderBy: [
          { totalSpent: "desc" },
          { satisfactionScore: "desc" },
          { createdAt: "desc" }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceCustomer.count({ where }),
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
      companyName,
      industry,
      companySize,
      contactPerson,
      firstName,
      lastName,
      email,
      phone,
      website,
      address,
      registrationNumber,
      taxId,
      vatNumber,
      bankDetails,
      paymentTerms,
      creditLimit,
      currency,
      preferredLanguage,
      timeZone,
    } = body;

    // Generate unique customer number
    const customerNumber = `CUS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const customer = await prisma.serviceCustomer.create({
      data: {
        tenantId: session.user.tenantId || "",
        customerNumber,
        companyName,
        industry,
        companySize,
        contactPerson,
        firstName,
        lastName,
        email,
        phone,
        website,
        address: address || {},
        registrationNumber,
        taxId,
        vatNumber,
        bankDetails: bankDetails || {},
        paymentTerms: paymentTerms || "NET_30",
        creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
        currency: currency || "EUR",
        preferredLanguage: preferredLanguage || "de",
        timeZone: timeZone || "Europe/Berlin",
        isActive: true,
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
