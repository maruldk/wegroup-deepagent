
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

    const tenantId = session.user.tenantId || "";

    // Get current date ranges
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const currentYear = new Date(now.getFullYear(), 0, 1);

    // Parallel queries for better performance
    const [
      totalRequests,
      totalRFQs,
      totalQuotes,
      totalOrders,
      totalCustomers,
      totalSuppliers,
      requestsByCategory,
      requestsByStatus,
      rfqsByStatus,
      quotesByStatus,
      ordersByStatus,
      suppliersByCategory,
      recentRequests,
      topPerformingSuppliers,
      customerActivity,
      monthlyTrends,
      categoryPerformance,
    ] = await Promise.all([
      // Basic counts
      prisma.serviceRequest.count({ where: { tenantId } }),
      prisma.serviceRFQ.count({ where: { tenantId } }),
      prisma.serviceQuote.count({ where: { tenantId } }),
      prisma.serviceOrder.count({ where: { tenantId } }),
      prisma.serviceCustomer.count({ where: { tenantId } }),
      prisma.serviceSupplier.count({ where: { tenantId } }),

      // Requests by category
      prisma.serviceRequest.groupBy({
        by: ['category'],
        where: { tenantId },
        _count: { id: true },
      }),

      // Requests by status
      prisma.serviceRequest.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),

      // RFQs by status
      prisma.serviceRFQ.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),

      // Quotes by status
      prisma.serviceQuote.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),

      // Orders by status
      prisma.serviceOrder.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { id: true },
      }),

      // Suppliers by category
      prisma.serviceSupplier.findMany({
        where: { tenantId },
        select: {
          categories: true,
          companyName: true,
        },
      }),

      // Recent requests
      prisma.serviceRequest.findMany({
        where: { tenantId },
        include: {
          customer: {
            select: {
              companyName: true,
              contactPerson: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Top performing suppliers
      prisma.serviceSupplier.findMany({
        where: { 
          tenantId,
          isVerified: true,
        },
        select: {
          id: true,
          companyName: true,
          categories: true,
          performanceScore: true,
          qualityScore: true,
          reliabilityScore: true,
          customerSatisfaction: true,
          totalOrders: true,
          totalRevenue: true,
          winRate: true,
        },
        orderBy: [
          { performanceScore: 'desc' },
          { qualityScore: 'desc' },
        ],
        take: 10,
      }),

      // Customer activity
      prisma.serviceCustomer.findMany({
        where: { tenantId },
        select: {
          id: true,
          companyName: true,
          totalOrders: true,
          totalSpent: true,
          satisfactionScore: true,
          lastActivityAt: true,
          _count: {
            select: {
              requests: true,
            },
          },
        },
        orderBy: { totalSpent: 'desc' },
        take: 10,
      }),

      // Monthly trends
      prisma.serviceRequest.findMany({
        where: {
          tenantId,
          createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 6, 1) },
        },
        select: {
          createdAt: true,
          category: true,
          status: true,
        },
      }),

      // Category performance
      prisma.serviceOrder.groupBy({
        by: ['category'],
        where: { 
          tenantId,
          status: 'COMPLETED',
        },
        _count: { id: true },
        _avg: { 
          totalAmount: true,
          qualityScore: true,
          satisfactionScore: true,
        },
        _sum: { totalAmount: true },
      }),
    ]);

    // Process supplier categories
    const supplierCategoryCount: Record<string, number> = {};
    suppliersByCategory.forEach(supplier => {
      supplier.categories?.forEach(category => {
        supplierCategoryCount[category] = (supplierCategoryCount[category] || 0) + 1;
      });
    });

    // Process monthly trends
    const monthlyData: Record<string, any> = {};
    monthlyTrends.forEach(request => {
      const monthKey = request.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          requests: 0,
          categories: {},
        };
      }
      monthlyData[monthKey].requests++;
      monthlyData[monthKey].categories[request.category] = 
        (monthlyData[monthKey].categories[request.category] || 0) + 1;
    });

    // Calculate conversion rates
    const conversionRates = {
      requestToRFQ: totalRequests > 0 ? (totalRFQs / totalRequests * 100).toFixed(2) : "0",
      rfqToQuote: totalRFQs > 0 ? (totalQuotes / totalRFQs * 100).toFixed(2) : "0",
      quoteToOrder: totalQuotes > 0 ? (totalOrders / totalQuotes * 100).toFixed(2) : "0",
    };

    // Calculate growth metrics (mock data for now)
    const growthMetrics = {
      requestsGrowth: Math.floor(Math.random() * 20) + 5, // 5-25%
      revenueGrowth: Math.floor(Math.random() * 15) + 10, // 10-25%
      customerGrowth: Math.floor(Math.random() * 30) + 5, // 5-35%
      supplierGrowth: Math.floor(Math.random() * 25) + 8, // 8-33%
    };

    return NextResponse.json({
      overview: {
        totalRequests,
        totalRFQs,
        totalQuotes,
        totalOrders,
        totalCustomers,
        totalSuppliers,
      },
      conversionRates,
      growthMetrics,
      distributions: {
        requestsByCategory: requestsByCategory.map(item => ({
          category: item.category,
          count: item._count.id,
        })),
        requestsByStatus: requestsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        rfqsByStatus: rfqsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        quotesByStatus: quotesByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        ordersByStatus: ordersByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        suppliersByCategory: Object.entries(supplierCategoryCount).map(([category, count]) => ({
          category,
          count,
        })),
      },
      recentActivity: {
        recentRequests: recentRequests.map(request => ({
          id: request.id,
          requestNumber: request.requestNumber,
          title: request.title,
          category: request.category,
          serviceType: request.serviceType,
          status: request.status,
          priority: request.priority,
          customer: request.customer,
          createdAt: request.createdAt,
        })),
      },
      performance: {
        topSuppliers: topPerformingSuppliers,
        topCustomers: customerActivity,
        categoryPerformance: categoryPerformance.map(cat => ({
          category: cat.category,
          orderCount: cat._count.id,
          totalRevenue: cat._sum.totalAmount || 0,
          averageOrderValue: cat._avg.totalAmount || 0,
          averageQuality: cat._avg.qualityScore || 0,
          averageSatisfaction: cat._avg.satisfactionScore || 0,
        })),
      },
      trends: {
        monthly: Object.values(monthlyData).sort((a: any, b: any) => 
          a.month.localeCompare(b.month)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
