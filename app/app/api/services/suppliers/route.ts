
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
    const category = url.searchParams.get("category");
    const serviceType = url.searchParams.get("serviceType");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const where: any = {
      tenantId: session.user.tenantId || ""
    };
    
    if (category) {
      where.categories = {
        has: category
      };
    }
    
    if (serviceType) {
      where.serviceTypes = {
        has: serviceType
      };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.serviceSupplier.findMany({
        where,
        select: {
          id: true,
          supplierNumber: true,
          companyName: true,
          businessType: true,
          categories: true,
          serviceTypes: true,
          contactPerson: true,
          email: true,
          phone: true,
          website: true,
          status: true,
          isVerified: true,
          performanceScore: true,
          qualityScore: true,
          reliabilityScore: true,
          responseTime: true,
          onTimeDeliveryRate: true,
          customerSatisfaction: true,
          totalQuotes: true,
          totalOrders: true,
          winRate: true,
          averageQuoteValue: true,
          experience: true,
          teamSize: true,
          certifications: true,
          languages: true,
          geographicalCoverage: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { performanceScore: "desc" },
          { qualityScore: "desc" },
          { createdAt: "desc" }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.serviceSupplier.count({ where }),
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
      companyName,
      businessType,
      categories,
      serviceTypes,
      contactPerson,
      email,
      phone,
      website,
      linkedIn,
      address,
      registrationNumber,
      taxId,
      vatNumber,
      bankDetails,
      paymentTerms,
      currencies,
      servicesOffered,
      capabilities,
      capacity,
      workingHours,
      geographicalCoverage,
      languages,
      certifications,
      portfolio,
      clientTestimonials,
      teamSize,
      experience,
      specializations,
      tools,
      technologies,
      insuranceCoverage,
      emergencyContact,
    } = body;

    // Generate unique supplier number
    const supplierNumber = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const supplier = await prisma.serviceSupplier.create({
      data: {
        tenantId: session.user.tenantId || "",
        supplierNumber,
        companyName,
        businessType,
        categories: categories || [],
        serviceTypes: serviceTypes || [],
        contactPerson,
        email,
        phone,
        website,
        linkedIn,
        address: address || {},
        registrationNumber,
        taxId,
        vatNumber,
        bankDetails: bankDetails || {},
        paymentTerms: paymentTerms || "NET_30",
        currencies: currencies || ["EUR"],
        servicesOffered: servicesOffered || [],
        capabilities: capabilities || {},
        capacity: capacity || {},
        workingHours: workingHours || {},
        geographicalCoverage: geographicalCoverage || [],
        languages: languages || ["de"],
        certifications: certifications || [],
        portfolio: portfolio || [],
        clientTestimonials: clientTestimonials || [],
        teamSize: teamSize || 0,
        experience: experience || 0,
        specializations: specializations || [],
        tools: tools || [],
        technologies: technologies || [],
        insuranceCoverage: insuranceCoverage || {},
        emergencyContact: emergencyContact || {},
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
