
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SupplierPortalInterface from "@/components/logistics/supplier-portal-interface";

export default async function SupplierPortalPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  // In a real application, you'd get the supplier ID from the session or URL
  // For demo purposes, we'll use a placeholder
  const supplierId = "demo-supplier-id";

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierPortalInterface supplierId={supplierId} />
    </div>
  );
}
