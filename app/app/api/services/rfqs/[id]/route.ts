
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

    const rfq = await prisma.serviceRFQ.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      include: {
        serviceRequest: {
          include: {
            customer: true,
          },
        },
        quotes: {
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
                performanceScore: true,
                qualityScore: true,
                reliabilityScore: true,
                customerSatisfaction: true,
                responseTime: true,
                onTimeDeliveryRate: true,
                winRate: true,
                experience: true,
                teamSize: true,
                certifications: true,
                portfolio: true,
              },
            },
          },
          orderBy: [
            { aiScore: "desc" },
            { totalPrice: "asc" }
          ],
        },
        comparison: true,
      },
    });

    if (!rfq) {
      return NextResponse.json(
        { error: "RFQ not found" },
        { status: 404 }
      );
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
    
    const rfq = await prisma.serviceRFQ.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      data: {
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        extendedDeadline: body.extendedDeadline ? new Date(body.extendedDeadline) : undefined,
        budget: body.budget ? parseFloat(body.budget) : undefined,
      },
      include: {
        serviceRequest: {
          include: {
            customer: true,
          },
        },
        quotes: {
          include: {
            supplier: true,
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

    await prisma.serviceRFQ.delete({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting RFQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
