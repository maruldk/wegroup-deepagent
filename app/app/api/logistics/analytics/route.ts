
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "30"; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get comprehensive analytics
    const [
      totalCustomers,
      activeCustomers,
      totalSuppliers,
      activeSuppliers,
      totalRequests,
      activeRFQs,
      totalQuotes,
      pendingOrders,
      completedOrders,
      totalRevenue,
      averageQuoteValue,
      avgDeliveryTime,
      customerSatisfaction,
      supplierPerformance,
      recentRequests,
      recentOrders,
      topSuppliers,
      topCustomers,
      rfqStatusDistribution,
      orderStatusDistribution,
      monthlyRevenue,
      monthlyOrders,
    ] = await Promise.all([
      // Customer metrics
      prisma.logisticsCustomer.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.logisticsCustomer.count({
        where: {
          status: "ACTIVE",
          lastActivityAt: { gte: startDate },
        },
      }),
      
      // Supplier metrics
      prisma.logisticsSupplier.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.logisticsSupplier.count({
        where: {
          status: "ACTIVE",
          lastActivityAt: { gte: startDate },
        },
      }),
      
      // Request metrics
      prisma.logisticsCustomerRequest.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.logisticsRFQ.count({
        where: {
          status: "ACTIVE",
          createdAt: { gte: startDate },
        },
      }),
      
      // Quote metrics
      prisma.logisticsSupplierQuote.count({
        where: { createdAt: { gte: startDate } },
      }),
      
      // Order metrics
      prisma.logisticsOrder.count({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
          createdAt: { gte: startDate },
        },
      }),
      prisma.logisticsOrder.count({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate },
        },
      }),
      
      // Revenue metrics
      prisma.logisticsOrder.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate },
        },
        _sum: { orderValue: true },
      }),
      prisma.logisticsSupplierQuote.aggregate({
        where: { createdAt: { gte: startDate } },
        _avg: { totalPrice: true },
      }),
      
      // Performance metrics
      prisma.logisticsOrder.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate },
          actualDeliveryDate: { not: null },
        },
        _avg: { performanceRating: true },
      }),
      prisma.logisticsOrder.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate },
          customerSatisfaction: { not: null },
        },
        _avg: { customerSatisfaction: true },
      }),
      prisma.logisticsSupplier.aggregate({
        where: {
          performanceScore: { not: null },
          lastActivityAt: { gte: startDate },
        },
        _avg: { performanceScore: true },
      }),
      
      // Recent data
      prisma.logisticsCustomerRequest.findMany({
        where: { createdAt: { gte: startDate } },
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
      }),
      prisma.logisticsOrder.findMany({
        where: { createdAt: { gte: startDate } },
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
          supplier: {
            select: {
              id: true,
              supplierNumber: true,
              companyName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      
      // Top performers
      prisma.logisticsSupplier.findMany({
        where: { lastActivityAt: { gte: startDate } },
        orderBy: [
          { performanceScore: "desc" },
          { totalRevenue: "desc" },
        ],
        take: 10,
      }),
      prisma.logisticsCustomer.findMany({
        where: { lastActivityAt: { gte: startDate } },
        orderBy: [
          { totalValue: "desc" },
          { totalOrders: "desc" },
        ],
        take: 10,
      }),
      
      // Status distributions
      prisma.logisticsRFQ.groupBy({
        by: ["status"],
        where: { createdAt: { gte: startDate } },
        _count: { status: true },
      }),
      prisma.logisticsOrder.groupBy({
        by: ["status"],
        where: { createdAt: { gte: startDate } },
        _count: { status: true },
      }),
      
      // Monthly trends
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("orderValue") as revenue,
          COUNT(*) as count
        FROM "logistics_orders"
        WHERE "createdAt" >= ${startDate}
        AND "status" = 'COMPLETED'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 12
      `,
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as count
        FROM "logistics_orders"
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 12
      `,
    ]);

    const analytics = {
      overview: {
        totalCustomers,
        activeCustomers,
        totalSuppliers,
        activeSuppliers,
        totalRequests,
        activeRFQs,
        totalQuotes,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue._sum.orderValue || 0,
        averageQuoteValue: averageQuoteValue._avg.totalPrice || 0,
        avgDeliveryTime: avgDeliveryTime._avg.performanceRating || 0,
        customerSatisfaction: customerSatisfaction._avg.customerSatisfaction || 0,
        supplierPerformance: supplierPerformance._avg.performanceScore || 0,
      },
      recent: {
        requests: recentRequests,
        orders: recentOrders,
      },
      topPerformers: {
        suppliers: topSuppliers,
        customers: topCustomers,
      },
      distributions: {
        rfqStatus: rfqStatusDistribution,
        orderStatus: orderStatusDistribution,
      },
      trends: {
        revenue: monthlyRevenue,
        orders: monthlyOrders,
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
