
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogisticsAnalyticsDashboard from "@/components/logistics/logistics-analytics-dashboard";

export default async function LogisticsAnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6">
      <LogisticsAnalyticsDashboard tenantId={session.user.tenantId || ""} />
    </div>
  );
}
