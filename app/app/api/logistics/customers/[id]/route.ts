
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

    const customer = await prisma.logisticsCustomer.findUnique({
      where: { id: params.id },
      include: {
        requests: {
          include: {
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
          take: 10,
        },
        orders: {
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
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            requests: true,
            orders: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
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
      satisfactionScore,
      aiRiskScore,
      aiValueScore,
      aiRecommendations,
      verificationDate,
      ...updateData
    } = body;

    const customer = await prisma.logisticsCustomer.update({
      where: { id: params.id },
      data: {
        ...updateData,
        status,
        satisfactionScore,
        aiRiskScore,
        aiValueScore,
        aiRecommendations,
        verificationDate: status === "ACTIVE" ? new Date() : verificationDate,
        isVerified: status === "ACTIVE",
        lastActivityAt: new Date(),
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
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

    await prisma.logisticsCustomer.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
