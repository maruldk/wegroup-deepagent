
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CustomerRequestManagement from "@/components/logistics/customer-request-management";

export default async function CustomerRequestsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6">
      <CustomerRequestManagement tenantId={session.user.tenantId || ""} />
    </div>
  );
}
