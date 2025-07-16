
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
    const { extendedDeadline, additionalRequirements } = body;

    // Update RFQ status to published
    const rfq = await prisma.serviceRFQ.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        extendedDeadline: extendedDeadline ? new Date(extendedDeadline) : undefined,
        requirements: additionalRequirements || undefined,
      },
      include: {
        serviceRequest: {
          include: {
            customer: true,
          },
        },
      },
    });

    // Update the related service request status
    await prisma.serviceRequest.update({
      where: {
        id: rfq.serviceRequestId,
      },
      data: {
        status: "RFQ_CREATED",
      },
    });

    return NextResponse.json({
      success: true,
      rfq,
      message: "RFQ published successfully",
    });
  } catch (error) {
    console.error("Error publishing RFQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
