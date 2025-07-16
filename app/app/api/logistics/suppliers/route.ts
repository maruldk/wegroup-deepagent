
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
    const supplierType = url.searchParams.get("supplierType");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {};
    if (status) where.status = status;
    if (supplierType) where.supplierType = supplierType;
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { supplierNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.logisticsSupplier.findMany({
        where,
        include: {
          performance: {
            orderBy: { periodStart: "desc" },
            take: 1,
          },
          _count: {
            select: {
              quotes: true,
              orders: true,
            },
          },
        },
        orderBy: [
          { performanceScore: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.logisticsSupplier.count({ where }),
    ]);

    return NextResponse.json({
      suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
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
      supplierType,
      companyName,
      contactPerson,
      email,
      phone,
      website,
      address,
      registrationNumber,
      taxId,
      vatNumber,
      bankDetails,
      paymentTerms,
      currencies,
      servicesOffered,
      geographicalCoverage,
      certifications,
      insuranceCoverage,
      capacity,
      workingHours,
      emergencyContact,
    } = body;

    // Generate unique supplier number
    const supplierNumber = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const supplier = await prisma.logisticsSupplier.create({
      data: {
        tenantId: session.user.tenantId || "",
        supplierNumber,
        supplierType,
        companyName,
        contactPerson,
        email,
        phone,
        website,
        address,
        registrationNumber,
        taxId,
        vatNumber,
        bankDetails,
        paymentTerms,
        currencies,
        servicesOffered,
        geographicalCoverage,
        certifications,
        insuranceCoverage,
        capacity,
        workingHours,
        emergencyContact,
        status: "PENDING_VERIFICATION",
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
