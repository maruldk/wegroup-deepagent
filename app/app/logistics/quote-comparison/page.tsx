
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuoteComparisonInterface from "@/components/logistics/quote-comparison-interface";

export default async function QuoteComparisonPage({ 
  searchParams 
}: { 
  searchParams: { rfqId?: string } 
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  const rfqId = searchParams.rfqId;
  
  if (!rfqId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Angebots-Vergleich</h1>
          <p className="text-gray-600">Bitte wählen Sie eine RFQ für den Vergleich aus.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <QuoteComparisonInterface rfqId={rfqId} />
    </div>
  );
}
