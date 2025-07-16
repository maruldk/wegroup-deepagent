
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Brain,
  TrendingUp,
  Users,
  Euro,
  Truck,
  X,
  Eye,
  Clock
} from 'lucide-react'

interface Notification {
  id: string
  type: 'ai_decision' | 'performance_alert' | 'system_update' | 'approval_request' | 'critical_issue' | 'success_milestone'
  title: string
  message: string
  module: 'HR' | 'Finance' | 'Logistics' | 'AI-Engine' | 'System'
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  read: boolean
  actionRequired: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial notifications
    loadNotifications()

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        addRandomNotification()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const loadNotifications = () => {
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'ai_decision',
        title: 'KI-Entscheidung getroffen',
        message: 'AI hat automatisch den besten Lieferanten für kritischen Auftrag #12345 ausgewählt',
        module: 'Logistics',
        priority: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
        actionUrl: '/logistics/procurement',
        metadata: { orderId: '12345', supplier: 'Supplier ABC GmbH', savings: '€2,450' }
      },
      {
        id: '2',
        type: 'performance_alert',
        title: 'Effizienzsteigerung erkannt',
        message: 'Finance Modul zeigt 15% Effizienzsteigerung im aktuellen Quartal',
        module: 'Finance',
        priority: 'medium',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: false,
        metadata: { improvement: '15%', period: 'Q1 2024' }
      },
      {
        id: '3',
        type: 'system_update',
        title: 'KI-Model Update',
        message: 'HR-KI hat 3 neue Kandidaten für offene Positionen identifiziert',
        module: 'HR',
        priority: 'low',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: true,
        actionRequired: false,
        actionUrl: '/hr/recruiting',
        metadata: { candidates: 3, positions: ['Senior Developer', 'Product Manager'] }
      },
      {
        id: '4',
        type: 'approval_request',
        title: 'Budget-Genehmigung erforderlich',
        message: 'Marketing-Budget für Q2 überschreitet automatische Limits um €5,200',
        module: 'Finance',
        priority: 'high',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        read: false,
        actionRequired: true,
        actionUrl: '/finance/budgeting',
        metadata: { excess: '€5,200', department: 'Marketing', quarter: 'Q2 2024' }
      },
      {
        id: '5',
        type: 'success_milestone',
        title: 'Meilenstein erreicht',
        message: 'KI-Autonomie-Level von 90% in allen Modulen erreicht',
        module: 'AI-Engine',
        priority: 'low',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionRequired: false,
        metadata: { autonomyLevel: '90%', modules: ['HR', 'Finance', 'Logistics'] }
      }
    ]
    setNotifications(initialNotifications)
  }

  const addRandomNotification = () => {
    const randomNotifications = [
      {
        type: 'ai_decision' as const,
        title: 'Automatische Routenoptimierung',
        message: 'KI hat Route Berlin-Hamburg um 22% optimiert - Einsparung: €85',
        module: 'Logistics' as const,
        priority: 'medium' as const,
        metadata: { savings: '€85', improvement: '22%' }
      },
      {
        type: 'performance_alert' as const,
        title: 'Performance-Anomalie',
        message: 'Ungewöhnlich hohe CPU-Auslastung in HR-Modul erkannt',
        module: 'System' as const,
        priority: 'high' as const,
        metadata: { cpuUsage: '87%', module: 'HR' }
      },
      {
        type: 'system_update' as const,
        title: 'Neue KI-Insights verfügbar',
        message: 'Predictive Analytics zeigt 12% Umsatzsteigerung für nächsten Monat',
        module: 'Finance' as const,
        priority: 'low' as const,
        metadata: { prediction: '12%', period: 'Next month' }
      }
    ]

    const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...randomNotif,
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: Math.random() > 0.7
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]) // Keep only 20 notifications
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_decision':
        return <Brain className="w-4 h-4 text-blue-500" />
      case 'performance_alert':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'system_update':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'approval_request':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'critical_issue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'success_milestone':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'HR':
        return <Users className="w-3 h-3" />
      case 'Finance':
        return <Euro className="w-3 h-3" />
      case 'Logistics':
        return <Truck className="w-3 h-3" />
      case 'AI-Engine':
        return <Brain className="w-3 h-3" />
      default:
        return <Info className="w-3 h-3" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Benachrichtigungen</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Alle gelesen
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} ungelesene Benachrichtigung{unreadCount !== 1 ? 'en' : ''}
              </p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Keine Benachrichtigungen</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              <div className="flex items-center space-x-1">
                                {getModuleIcon(notification.module)}
                                <span>{notification.module}</span>
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(notification.timestamp).toLocaleString('de-DE')}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority === 'low' && 'Niedrig'}
                              {notification.priority === 'medium' && 'Mittel'}
                              {notification.priority === 'high' && 'Hoch'}
                              {notification.priority === 'critical' && 'Kritisch'}
                            </Badge>
                          </div>
                          
                          {notification.actionRequired && (
                            <div className="mt-2 flex space-x-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="w-3 h-3 mr-1" />
                                Anzeigen
                              </Button>
                              {notification.actionUrl && (
                                <Button size="sm" className="text-xs">
                                  Aktion
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="flex-shrink-0 ml-2"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                Alle Benachrichtigungen anzeigen
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
