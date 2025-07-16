
# WeGroup Platform - Detaillierte Tabellen-Übersicht

## 📋 TABELLEN-KATEGORIEN

### 1. KERN-SYSTEM (Core System)
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `tenants` | Mandanten-Verwaltung | `id` | - |
| `users` | Benutzer-Verwaltung | `id` | `tenantId`, `lastUsedTenantId` |
| `roles` | Rollen-System | `id` | `tenantId` |
| `permissions` | Permissions-System | `id` | - |
| `user_roles` | User-Role-Zuordnung | `[userId, roleId]` | `userId`, `roleId` |

### 2. AUTHENTICATION (NextAuth.js)
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `accounts` | OAuth-Accounts | `[provider, providerAccountId]` | `userId` |
| `sessions` | User-Sessions | `sessionToken` | `userId` |
| `authenticators` | WebAuthn-Authenticators | `[userId, credentialID]` | `userId` |
| `verificationtokens` | Verifikations-Tokens | `[identifier, token]` | - |

### 3. ERWEITERTE ROLLEN (Enhanced Roles)
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `enhanced_roles` | Erweiterte Rollen | `id` | `tenantId`, `inheritFromRoleId` |
| `user_enhanced_roles` | User-Enhanced-Role-Zuordnung | `[userId, enhancedRoleId]` | `userId`, `enhancedRoleId` |
| `menu_permissions` | Menu-Permissions | `id` | `permissionId`, `parentMenuId` |
| `role_menu_permissions` | Role-Menu-Zuordnung | `id` | `roleId`, `menuPermissionId` |
| `user_permission_overrides` | User-Permission-Overrides | `id` | `userId`, `permissionId` |

### 4. TENANT-MANAGEMENT
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `tenant_modules` | Tenant-Module | `id` | `tenantId` |
| `tenant_managers` | Tenant-Manager | `id` | `tenantId`, `userId` |
| `tenant_activities` | Tenant-Aktivitäten | `id` | `tenantId`, `userId` |
| `tenant_analytics` | Tenant-Analytics | `id` | `tenantId` |
| `tenant_billing` | Tenant-Billing | `id` | `tenantId` |
| `tenant_support_tickets` | Support-Tickets | `id` | `tenantId`, `userId` |

### 5. FINANCE-MODULE
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `invoices` | Rechnungen | `id` | `tenantId` |
| `ocr_results` | OCR-Ergebnisse | `id` | `invoiceId`, `tenantId` |
| `approval_workflows` | Genehmigungsworkflows | `id` | `invoiceId`, `tenantId` |
| `three_way_matches` | Drei-Wege-Abgleich | `id` | `invoiceId`, `tenantId` |
| `confidence_scores` | Vertrauens-Scores | `id` | `invoiceId`, `tenantId` |
| `invoice_notifications` | Rechnungs-Benachrichtigungen | `id` | `invoiceId`, `tenantId` |
| `financial_transactions` | Finanz-Transaktionen | `id` | `tenantId` |
| `cash_flow_forecasts` | Cashflow-Prognosen | `id` | `tenantId` |

### 6. EMAIL-INTEGRATION
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `tenant_email_configs` | Email-Konfigurationen | `id` | `tenantId` |
| `email_invoices` | Email-Rechnungen | `id` | `tenantId`, `emailConfigId` |
| `email_processing_logs` | Email-Verarbeitungs-Logs | `id` | `tenantId`, `emailConfigId` |
| `email_classifications` | Email-Klassifizierungen | `id` | `tenantId` |

### 7. HR-MODULE
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `employees` | Mitarbeiter | `id` | `userId`, `managerId`, `tenantId` |
| `job_applications` | Bewerbungen | `id` | `jobPostingId`, `assignedEmployeeId`, `tenantId` |
| `job_postings` | Stellenausschreibungen | `id` | `tenantId` |
| `performance_reviews` | Leistungsbeurteilungen | `id` | `employeeId`, `tenantId` |
| `onboarding_workflows` | Onboarding-Workflows | `id` | `employeeId`, `tenantId` |
| `skill_assessments` | Kompetenzbewertungen | `id` | `employeeId`, `tenantId` |
| `workforce_analytics` | Workforce-Analytics | `id` | `tenantId` |

### 8. LOGISTICS-MODULE
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `shipments` | Sendungen | `id` | `tenantId` |
| `tracking_events` | Tracking-Events | `id` | `shipmentId`, `tenantId` |
| `carrier_performance` | Carrier-Performance | `id` | `tenantId` |
| `logistics_customers` | Logistics-Kunden | `id` | `tenantId` |
| `logistics_suppliers` | Logistics-Lieferanten | `id` | `tenantId` |
| `logistics_rfqs` | Logistics-RFQs | `id` | `tenantId` |
| `logistics_supplier_quotes` | Logistics-Angebote | `id` | `tenantId` |
| `logistics_orders` | Logistics-Bestellungen | `id` | `tenantId` |

### 9. INVENTORY-MODULE
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `inventory_items` | Lagerbestände | `id` | `tenantId` |
| `inventory_movements` | Warenbewegungen | `id` | `inventoryItemId`, `tenantId` |
| `purchase_orders` | Bestellungen | `id` | `supplierId`, `inventoryItemId`, `tenantId` |
| `route_optimizations` | Routen-Optimierungen | `id` | `tenantId` |
| `predictive_maintenance` | Predictive Maintenance | `id` | `tenantId` |

### 10. AI & MACHINE LEARNING
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `ai_models` | AI-Modelle | `id` | `tenantId` |
| `ai_decisions` | AI-Entscheidungen | `id` | `modelId`, `tenantId` |
| `ai_model_metrics` | AI-Model-Metriken | `id` | `modelId`, `tenantId` |
| `model_approvals` | Model-Genehmigungen | `id` | `modelId`, `tenantId` |
| `model_test_results` | Model-Test-Ergebnisse | `id` | `modelId`, `tenantId` |
| `model_cost_records` | Model-Kosten-Datensätze | `id` | `modelId`, `tenantId` |

### 11. QUANTUM COMPUTING
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `quantum_processors` | Quantum-Prozessoren | `id` | `tenantId` |
| `quantum_algorithms` | Quantum-Algorithmen | `id` | `processorId`, `tenantId` |
| `quantum_computations` | Quantum-Berechnungen | `id` | `algorithmId`, `processorId`, `tenantId` |
| `quantum_neural_networks` | Quantum-Neural-Networks | `id` | `tenantId` |
| `quantum_optimizations` | Quantum-Optimierungen | `id` | `algorithmId`, `tenantId` |

### 12. ECOSYSTEM & PARTNERS
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `ecosystem_partners` | Ecosystem-Partner | `id` | `tenantId` |
| `cross_company_collaborations` | Cross-Company-Kollaborationen | `id` | `primaryPartnerId`, `tenantId` |
| `ecosystem_orchestrations` | Ecosystem-Orchestrierungen | `id` | `partnerId`, `tenantId` |
| `global_integrations` | Globale Integrationen | `id` | `partnerId`, `tenantId` |
| `ecosystem_intelligence` | Ecosystem-Intelligence | `id` | `orchestrationId`, `tenantId` |

### 13. BUSINESS INNOVATION
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `business_models` | Geschäftsmodelle | `id` | `tenantId` |
| `innovation_pipelines` | Innovations-Pipelines | `id` | `tenantId` |
| `innovation_projects` | Innovations-Projekte | `id` | `tenantId` |
| `innovation_validations` | Innovations-Validierungen | `id` | `tenantId` |
| `market_opportunities` | Marktchancen | `id` | `tenantId` |
| `competitive_analyses` | Wettbewerbsanalysen | `id` | `tenantId` |

### 14. SUSTAINABILITY
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `sustainability_metrics` | Nachhaltigkeits-Metriken | `id` | `tenantId` |
| `carbon_footprint_tracking` | CO2-Fußabdruck-Tracking | `id` | `tenantId` |
| `esg_compliance` | ESG-Compliance | `id` | `tenantId` |
| `environmental_risks` | Umweltrisiken | `id` | `tenantId` |
| `green_processes` | Grüne Prozesse | `id` | `tenantId` |

### 15. UNIVERSAL SERVICES
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `service_requests` | Service-Anfragen | `id` | `tenantId`, `customerId` |
| `service_customers` | Service-Kunden | `id` | `tenantId` |
| `service_suppliers` | Service-Lieferanten | `id` | `tenantId` |
| `service_rfqs` | Service-RFQs | `id` | `serviceRequestId`, `tenantId` |
| `service_quotes` | Service-Angebote | `id` | `rfqId`, `supplierId`, `tenantId` |
| `service_orders` | Service-Bestellungen | `id` | `customerId`, `supplierId`, `tenantId` |
| `service_quote_comparisons` | Service-Angebots-Vergleiche | `id` | `rfqId`, `tenantId` |

### 16. PORTAL-ZUGRIFFE
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `service_customer_portal_access` | Service-Kunden-Portal-Zugang | `id` | `tenantId`, `customerId` |
| `service_supplier_portal_access` | Service-Lieferanten-Portal-Zugang | `id` | `tenantId`, `supplierId` |
| `logistics_customer_portal_access` | Logistics-Kunden-Portal-Zugang | `id` | `tenantId` |
| `logistics_supplier_portal_access` | Logistics-Lieferanten-Portal-Zugang | `id` | `tenantId` |

### 17. ANALYTICS & MONITORING
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `dashboards` | Dashboards | `id` | `tenantId`, `userId` |
| `widgets` | Widgets | `id` | `dashboardId` |
| `tenant_usage_analytics` | Tenant-Nutzungs-Analytics | `id` | `tenantId` |
| `role_performance_metrics` | Role-Performance-Metriken | `id` | `tenantId` |
| `role_hierarchy_analytics` | Role-Hierarchy-Analytics | `id` | `tenantId` |

### 18. AUDIT & COMPLIANCE
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `permission_audit_logs` | Permission-Audit-Logs | `id` | `tenantId` |
| `permission_recommendations` | Permission-Empfehlungen | `id` | `tenantId` |
| `document_processing` | Dokumentenverarbeitung | `id` | `tenantId` |
| `risk_assessments` | Risikobewertungen | `id` | `tenantId` |

### 19. PREFERENCES & CUSTOMIZATION
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `user_preferences` | Benutzer-Einstellungen | `id` | `userId` |
| `tenant_customization` | Tenant-Anpassungen | `id` | `tenantId` |
| `user_tenant_recommendations` | User-Tenant-Empfehlungen | `id` | `userId`, `tenantId` |
| `tenant_region_mappings` | Tenant-Region-Zuordnungen | `id` | `tenantId` |

### 20. DEMO & TESTING
| Tabelle | Beschreibung | Primärschlüssel | Wichtige Fremdschlüssel |
|---------|-------------|-----------------|------------------------|
| `demo_users` | Demo-Benutzer | `id` | - |
| `role_template_usages` | Role-Template-Verwendungen | `id` | `templateRoleId` |

---

## 📊 TABELLEN-STATISTIKEN

### Tabellen pro Kategorie:
- **Kern-System**: 5 Tabellen
- **Authentication**: 4 Tabellen
- **Erweiterte Rollen**: 5 Tabellen
- **Tenant-Management**: 6 Tabellen
- **Finance**: 8 Tabellen
- **Email-Integration**: 4 Tabellen
- **HR-Module**: 7 Tabellen
- **Logistics**: 8 Tabellen
- **Inventory**: 5 Tabellen
- **AI & ML**: 6 Tabellen
- **Quantum Computing**: 5 Tabellen
- **Ecosystem**: 5 Tabellen
- **Business Innovation**: 6 Tabellen
- **Sustainability**: 5 Tabellen
- **Universal Services**: 7 Tabellen
- **Portal-Zugriffe**: 4 Tabellen
- **Analytics**: 5 Tabellen
- **Audit**: 4 Tabellen
- **Preferences**: 4 Tabellen
- **Demo & Testing**: 2 Tabellen

**GESAMT**: ~150 Tabellen

---

## 🔗 WICHTIGE CONSTRAINTS

### Unique Constraints:
- `tenants.domain`
- `tenants.subdomain`
- `users.email`
- `invoices.invoiceNumber`
- `shipments.trackingNumber`
- `service_requests.requestNumber`

### Foreign Key Constraints:
- Alle Tabellen haben `tenantId` → `tenants.id`
- Cascading Deletes bei abhängigen Entitäten
- Referentielle Integrität bei allen Beziehungen

### Check Constraints:
- Enum-Validierungen für Status-Felder
- Positive Werte für Mengen und Preise
- Gültige Email-Formate
- Datum-Validierungen
