
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { MessageCircle, Sparkles, TrendingUp, Users } from "lucide-react"

interface Message {
  id: string
  user: string
  avatar: string
  message: string
  timestamp: string
  type: "user" | "ai"
}

export function DreamGenerator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Anna M.",
      avatar: "A",
      message: "Unser Logistik-KI hat heute 15% Effizienzsteigerung erreicht!",
      timestamp: "vor 2 Min",
      type: "user"
    },
    {
      id: "2", 
      user: "WeGroup AI",
      avatar: "AI",
      message: "Herzlichen Glückwunsch! Das sind 32% mehr als letzten Monat. Möchten Sie die Optimierungen auf andere Bereiche ausweiten?",
      timestamp: "vor 1 Min",
      type: "ai"
    },
    {
      id: "3",
      user: "Marcus K.",
      avatar: "M",
      message: "Fantastisch! Können wir das auch für HR implementieren?",
      timestamp: "gerade eben",
      type: "user"
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-full p-3 mr-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Dream Generator</h3>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Erfahren Sie, wie andere Teams mit WeGroup AI ihre Träume verwirklichen
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center p-4">
          <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">85%</div>
          <div className="text-sm text-gray-600">Effizienz</div>
        </Card>
        <Card className="text-center p-4">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">1.2K</div>
          <div className="text-sm text-gray-600">Aktive Teams</div>
        </Card>
        <Card className="text-center p-4">
          <MessageCircle className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">24/7</div>
          <div className="text-sm text-gray-600">KI Support</div>
        </Card>
      </div>

      {/* Chat Timeline */}
      <Card className="h-80 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
            Live Team-Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={message.id}
              className={`flex items-start space-x-3 transition-all duration-500 ${
                index <= currentIndex ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform translate-y-2'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                message.type === 'ai' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {message.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {message.user}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">
          Bereit, Ihre Träume zu verwirklichen?
        </h4>
        <p className="text-sm text-gray-600">
          Verbinden Sie sich mit unserem KI-gestützten Plattform-Ökosystem
        </p>
      </div>
    </div>
  )
}
