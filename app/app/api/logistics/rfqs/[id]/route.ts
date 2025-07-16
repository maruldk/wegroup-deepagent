
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

    const rfq = await prisma.logisticsRFQ.findUnique({
      where: { id: params.id },
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
                industry: true,
                address: true,
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
                email: true,
                phone: true,
                performanceScore: true,
                qualityScore: true,
                reliabilityScore: true,
                servicesOffered: true,
                geographicalCoverage: true,
                certifications: true,
              },
            },
          },
          orderBy: [
            { aiScore: "desc" },
            { totalPrice: "asc" },
          ],
        },
        comparison: true,
      },
    });

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    return NextResponse.json(rfq);
  } catch (error) {
    console.error("Error fetching RFQ:", error);
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
      winningQuoteId,
      extendedDeadline,
      ...updateData
    } = body;

    const rfq = await prisma.logisticsRFQ.update({
      where: { id: params.id },
      data: {
        ...updateData,
        status,
        winningQuoteId,
        extendedDeadline: extendedDeadline ? new Date(extendedDeadline) : null,
        publishedAt: status === "PUBLISHED" ? new Date() : undefined,
        awardedAt: status === "AWARDED" ? new Date() : undefined,
        awardedBy: status === "AWARDED" ? session.user.id : undefined,
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
      },
    });

    return NextResponse.json(rfq);
  } catch (error) {
    console.error("Error updating RFQ:", error);
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

    await prisma.logisticsRFQ.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "RFQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting RFQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
