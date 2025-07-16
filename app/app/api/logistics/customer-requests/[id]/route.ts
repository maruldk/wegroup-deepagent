
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

    const customerRequest = await prisma.logisticsCustomerRequest.findUnique({
      where: { id: params.id },
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
        rfqs: {
          include: {
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
                    reliabilityScore: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!customerRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(customerRequest);
  } catch (error) {
    console.error("Error fetching customer request:", error);
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
      estimatedCost,
      actualCost,
      profitMargin,
      reviewedBy,
      internalNotes,
      ...updateData
    } = body;

    const customerRequest = await prisma.logisticsCustomerRequest.update({
      where: { id: params.id },
      data: {
        ...updateData,
        status,
        estimatedCost,
        actualCost,
        profitMargin,
        reviewedBy,
        internalNotes,
        reviewedAt: status === "UNDER_REVIEW" ? new Date() : undefined,
        submittedAt: status === "SUBMITTED" ? new Date() : undefined,
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

    return NextResponse.json(customerRequest);
  } catch (error) {
    console.error("Error updating customer request:", error);
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

    await prisma.logisticsCustomerRequest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
