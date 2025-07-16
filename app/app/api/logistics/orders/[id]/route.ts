
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

    const order = await prisma.logisticsOrder.findUnique({
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
            address: true,
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
            website: true,
            address: true,
            performanceScore: true,
            qualityScore: true,
            reliabilityScore: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
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
      trackingNumber,
      trackingUrl,
      actualDeliveryDate,
      performanceRating,
      customerSatisfaction,
      feedback,
      disputeReason,
      resolutionNotes,
      milestones,
      documents,
      ...updateData
    } = body;

    const order = await prisma.logisticsOrder.update({
      where: { id: params.id },
      data: {
        ...updateData,
        status,
        trackingNumber,
        trackingUrl,
        actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : null,
        performanceRating,
        customerSatisfaction,
        feedback,
        disputeReason,
        resolutionNotes,
        milestones,
        documents,
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

    // Update supplier performance if order is completed
    if (status === "COMPLETED" && performanceRating) {
      await prisma.logisticsSupplier.update({
        where: { id: order.supplierId },
        data: {
          performanceScore: performanceRating,
          customerSatisfaction: customerSatisfaction || 0,
          lastActivityAt: new Date(),
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
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

    await prisma.logisticsOrder.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
