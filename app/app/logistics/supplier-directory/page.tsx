
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SupplierDirectoryInterface from "@/components/logistics/supplier-directory-interface";

export default async function SupplierDirectoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6">
      <SupplierDirectoryInterface tenantId={session.user.tenantId || ""} />
    </div>
  );
}
