
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Euro, Calendar, Eye, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface Quote {
  id: string;
  quoteNumber: string;
  rfqTitle: string;
  customerName: string;
  totalPrice: number;
  status: string;
  submittedAt: string;
  validUntil: string;
}

export function SupplierQuoteInterface() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setQuotes([
        {
          id: '1',
          quoteNumber: 'QUO-2024-001',
          rfqTitle: 'Website-Entwicklung',
          customerName: 'TechStart GmbH',
          totalPrice: 28500,
          status: 'SUBMITTED',
          submittedAt: '2024-01-15',
          validUntil: '2024-02-15'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'ACCEPTED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="space-y-6"><Card className="animate-pulse"><CardContent className="p-6"><div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div></CardContent></Card></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meine Angebote</h1>
        <p className="text-gray-600">Verwalten Sie Ihre abgegebenen Angebote</p>
      </div>
      <div className="space-y-4">
        {quotes.map((quote, index) => (
          <motion.div key={quote.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{quote.rfqTitle}</h3>
                      <Badge className={getStatusColor(quote.status)} variant="secondary">{quote.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{quote.customerName}</span>
                      <span className="flex items-center"><Euro className="h-4 w-4 mr-1" />€{quote.totalPrice.toLocaleString()}</span>
                      <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{quote.validUntil}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-6">
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-2" />Details</Button>
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" />Bearbeiten</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
