
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

    const serviceRequest = await prisma.serviceRequest.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      include: {
        customer: true,
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
                    qualityScore: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { error: "Service request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error("Error fetching service request:", error);
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
    
    const serviceRequest = await prisma.serviceRequest.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      data: {
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        budget: body.budget ? parseFloat(body.budget) : undefined,
      },
      include: {
        customer: true,
        rfqs: true,
      },
    });

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error("Error updating service request:", error);
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

    await prisma.serviceRequest.delete({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
