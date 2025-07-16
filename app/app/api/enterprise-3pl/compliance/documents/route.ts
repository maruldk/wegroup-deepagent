
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const documentType = searchParams.get('documentType');
    const regulationType = searchParams.get('regulationType');
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');
    const onlyValid = searchParams.get('onlyValid') === 'true';

    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;
    if (documentType) whereClause.documentType = documentType;
    if (regulationType) whereClause.regulationType = regulationType;
    if (status) whereClause.status = status;
    if (riskLevel) whereClause.aiRiskLevel = riskLevel;
    
    if (onlyValid) {
      whereClause.AND = [
        { validFrom: { lte: new Date() } },
        { validTo: { gte: new Date() } }
      ];
    }

    // Mock compliance documents data
    const documents: any[] = [
      {
        id: '1',
        status: 'APPROVED',
        aiRiskLevel: 'LOW',
        aiCompliance: 95,
        isVerified: true,
        createdAt: new Date()
      },
      {
        id: '2',
        status: 'PENDING',
        aiRiskLevel: 'MEDIUM',
        aiCompliance: 75,
        isVerified: false,
        createdAt: new Date()
      },
      {
        id: '3',
        status: 'EXPIRED',
        aiRiskLevel: 'HIGH',
        aiCompliance: 45,
        isVerified: true,
        createdAt: new Date()
      }
    ];

    // Compliance-Statistiken berechnen
    const complianceStats = {
      totalDocuments: documents.length,
      approvedDocuments: documents.filter((doc: any) => doc.status === 'APPROVED').length,
      pendingDocuments: documents.filter((doc: any) => doc.status === 'PENDING').length,
      expiredDocuments: documents.filter((doc: any) => doc.status === 'EXPIRED').length,
      highRiskDocuments: documents.filter((doc: any) => doc.aiRiskLevel === 'HIGH' || doc.aiRiskLevel === 'CRITICAL').length,
      averageCompliance: documents.reduce((sum: number, doc: any) => sum + (doc.aiCompliance || 0), 0) / documents.length,
      verificationRate: documents.filter((doc: any) => doc.isVerified).length / documents.length
    };

    return NextResponse.json({
      success: true,
      data: documents,
      statistics: complianceStats,
      total: documents.length,
      message: 'Compliance-Dokumente erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden der Compliance-Dokumente:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden der Compliance-Dokumente' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const {
      documentType,
      title,
      description,
      documentNumber,
      regulationType,
      issuingAuthority,
      validFrom,
      validTo,
      filePath,
      fileUrl,
      content,
      tenantId
    } = data;

    // Validierung
    if (!documentType || !title || !regulationType || !tenantId) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: documentType, title, regulationType, tenantId' 
      }, { status: 400 });
    }

    // KI-basierte Compliance-Analyse
    const aiAnalysis = await performAIComplianceAnalysis({
      documentType,
      regulationType,
      content,
      issuingAuthority,
      validFrom,
      validTo
    });

    // Mock document creation
    const newDocument: any = {
      id: `doc-${Date.now()}`,
      documentType,
      title,
      description,
      documentNumber,
      regulationType,
      issuingAuthority,
      validFrom: validFrom ? new Date(validFrom) : null,
      validTo: validTo ? new Date(validTo) : null,
      filePath,
      fileUrl,
      content,
      aiCompliance: aiAnalysis.complianceScore,
      aiRiskLevel: aiAnalysis.riskLevel as any,
      aiRecommendations: aiAnalysis.recommendations,
      status: 'PENDING',
      isVerified: false,
      createdAt: new Date(),
      tenantId: session.user.tenantId
    };

    return NextResponse.json({
      success: true,
      data: newDocument,
      aiAnalysis: aiAnalysis,
      message: 'Compliance-Dokument erfolgreich erstellt'
    });

  } catch (error) {
    console.error('Fehler beim Erstellen des Compliance-Dokuments:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Erstellen des Compliance-Dokuments' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const { id, action, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Dokument-ID fehlt' }, { status: 400 });
    }

    let updatedDocument;

    if (action === 'verify') {
      // Mock document verification
      updatedDocument = {
        id,
        isVerified: true,
        verifiedBy: session.user.id,
        verificationDate: new Date(),
        status: 'APPROVED',
        updatedAt: new Date()
      };
    } else if (action === 'reject') {
      // Mock document rejection
      updatedDocument = {
        id,
        status: 'REJECTED',
        updatedAt: new Date()
      };
    } else {
      // Mock standard update
      updatedDocument = {
        id,
        ...updateData,
        updatedAt: new Date()
      };
    }

    return NextResponse.json({
      success: true,
      data: updatedDocument,
      message: 'Compliance-Dokument erfolgreich aktualisiert'
    });

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Compliance-Dokuments:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Aktualisieren des Compliance-Dokuments' 
    }, { status: 500 });
  }
}

async function performAIComplianceAnalysis(params: any) {
  const { documentType, regulationType, content, issuingAuthority, validFrom, validTo } = params;
  
  // Simuliere KI-basierte Compliance-Analyse
  let complianceScore = Math.random() * 100;
  let riskLevel = 'LOW';
  const recommendations = [];
  
  // Dokumenttyp-spezifische Analyse
  if (documentType === 'DANGEROUS_GOODS') {
    complianceScore *= 0.8; // Gefährliche Güter haben höhere Anforderungen
    riskLevel = complianceScore < 70 ? 'HIGH' : complianceScore < 85 ? 'MEDIUM' : 'LOW';
    recommendations.push('Regelmäßige Überprüfung der Gefahrgutklassifizierung erforderlich');
  }
  
  if (documentType === 'CUSTOMS_DECLARATION') {
    if (!issuingAuthority) {
      complianceScore *= 0.7;
      recommendations.push('Ausstellende Behörde fehlt - kritisch für Zollabfertigung');
    }
    riskLevel = complianceScore < 60 ? 'CRITICAL' : complianceScore < 80 ? 'HIGH' : 'MEDIUM';
  }
  
  // Gültigkeitsprüfung
  if (validFrom && validTo) {
    const now = new Date();
    const validFromDate = new Date(validFrom);
    const validToDate = new Date(validTo);
    
    if (validFromDate > now) {
      recommendations.push('Dokument ist noch nicht gültig');
    }
    
    if (validToDate < now) {
      complianceScore *= 0.3;
      riskLevel = 'CRITICAL';
      recommendations.push('Dokument ist abgelaufen - sofortige Erneuerung erforderlich');
    } else if (validToDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
      recommendations.push('Dokument läuft in den nächsten 30 Tagen ab');
    }
  }
  
  // Regulierungstyp-spezifische Analyse
  if (regulationType === 'CUSTOMS') {
    recommendations.push('ATLAS-Kompatibilität prüfen');
    recommendations.push('EORI-Nummer validieren');
  }
  
  if (regulationType === 'EXPORT_CONTROL') {
    recommendations.push('Exportkontrollbestimmungen des Ziellandes beachten');
    recommendations.push('Dual-Use-Güter-Verordnung prüfen');
  }
  
  // Inhaltsanalyse
  if (content) {
    if (content.length < 100) {
      complianceScore *= 0.9;
      recommendations.push('Dokumentinhalt unvollständig');
    }
    
    // Simuliere Textanalyse auf kritische Begriffe
    const criticalKeywords = ['gefahrgut', 'explosiv', 'toxisch', 'radioaktiv'];
    const hasCriticalContent = criticalKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (hasCriticalContent) {
      riskLevel = riskLevel === 'LOW' ? 'MEDIUM' : 'HIGH';
      recommendations.push('Kritischer Inhalt erkannt - zusätzliche Prüfung erforderlich');
    }
  }
  
  // Finaler Risiko-Score
  if (complianceScore < 50) riskLevel = 'CRITICAL';
  else if (complianceScore < 70) riskLevel = 'HIGH';
  else if (complianceScore < 90) riskLevel = 'MEDIUM';
  else riskLevel = 'LOW';
  
  return {
    complianceScore: Math.round(complianceScore * 100) / 100,
    riskLevel,
    recommendations,
    analysisDetails: {
      documentTypeRisk: documentType === 'DANGEROUS_GOODS' ? 'HIGH' : 'MEDIUM',
      regulationCompliance: regulationType === 'CUSTOMS' ? 'CRITICAL' : 'NORMAL',
      validityStatus: validTo && new Date(validTo) < new Date() ? 'EXPIRED' : 'VALID',
      contentAnalysis: content ? 'ANALYZED' : 'MISSING'
    }
  };
}
