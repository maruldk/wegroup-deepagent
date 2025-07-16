
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

    const serviceRequest = await prisma.serviceRequest.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId || "",
      },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      serviceRequest,
      message: "Service request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting service request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
