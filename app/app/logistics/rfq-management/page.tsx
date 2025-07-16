
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RFQManagementInterface from "@/components/logistics/rfq-management-interface";

export default async function RFQManagementPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6">
      <RFQManagementInterface tenantId={session.user.tenantId || ""} />
    </div>
  );
}
