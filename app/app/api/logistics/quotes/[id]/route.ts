
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quote = await prisma.logisticsSupplierQuote.findUnique({
      where: { id: params.id },
      include: {
        supplier: {
          select: {
            id: true,
            supplierNumber: true,
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
            website: true,
            address: true,
            performanceScore: true,
            qualityScore: true,
            reliabilityScore: true,
            servicesOffered: true,
            geographicalCoverage: true,
            certifications: true,
          },
        },
        rfq: {
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
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      status,
      aiScore,
      aiRanking,
      aiRecommendation,
      aiAnalysis,
      isWinning,
      rejectionReason,
      customerFeedback,
      ...updateData
    } = body;

    const quote = await prisma.logisticsSupplierQuote.update({
      where: { id: params.id },
      data: {
        ...updateData,
        status,
        aiScore,
        aiRanking,
        aiRecommendation,
        aiAnalysis,
        isWinning,
        rejectionReason,
        customerFeedback,
        submittedAt: status === "SUBMITTED" ? new Date() : undefined,
        reviewedAt: status === "UNDER_REVIEW" ? new Date() : undefined,
        reviewedBy: status === "UNDER_REVIEW" ? session.user.id : undefined,
      },
      include: {
        supplier: {
          select: {
            id: true,
            supplierNumber: true,
            companyName: true,
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

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.logisticsSupplierQuote.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
