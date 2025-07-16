
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

    const supplier = await prisma.logisticsSupplier.findUnique({
      where: { id: params.id },
      include: {
        quotes: {
          include: {
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
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        orders: {
          include: {
            customer: {
              select: {
                id: true,
                customerNumber: true,
                companyName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        performance: {
          orderBy: { periodStart: "desc" },
          take: 5,
        },
        _count: {
          select: {
            quotes: true,
            orders: true,
          },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
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
      performanceScore,
      qualityScore,
      reliabilityScore,
      verificationDate,
      ...updateData
    } = body;

    const supplier = await prisma.logisticsSupplier.update({
      where: { id: params.id },
      data: {
        ...updateData,
        status,
        performanceScore,
        qualityScore,
        reliabilityScore,
        verificationDate: status === "APPROVED" ? new Date() : verificationDate,
        isVerified: status === "APPROVED",
        lastActivityAt: new Date(),
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
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

    await prisma.logisticsSupplier.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
