
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { UserGuideModal } from "./user-guide-modal"

export function UserGuideTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        title="User Guide öffnen"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Hilfe</span>
      </Button>
      
      <UserGuideModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
