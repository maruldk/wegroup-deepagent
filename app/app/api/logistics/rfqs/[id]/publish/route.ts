
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetSuppliers, notifySuppliers } = body;

    const rfq = await prisma.logisticsRFQ.findUnique({
      where: { id: params.id },
      include: {
        customerRequest: {
          include: {
            customer: {
              select: {
                id: true,
                companyName: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    if (rfq.status !== "DRAFT") {
      return NextResponse.json(
        { error: "RFQ can only be published from DRAFT status" },
        { status: 400 }
      );
    }

    const updatedRFQ = await prisma.logisticsRFQ.update({
      where: { id: params.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        targetSuppliers: targetSuppliers || rfq.targetSuppliers,
      },
      include: {
        customerRequest: {
          include: {
            customer: {
              select: {
                id: true,
                companyName: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // TODO: Send notifications to suppliers if notifySuppliers is true
    // This would integrate with email/SMS notification system

    return NextResponse.json(updatedRFQ);
  } catch (error) {
    console.error("Error publishing RFQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
