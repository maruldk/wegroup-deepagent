
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
          },
        },
      },
    });

    if (!customerRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (customerRequest.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Request can only be submitted from DRAFT status" },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.logisticsCustomerRequest.update({
      where: { id: params.id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
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
          },
        },
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error submitting customer request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
