
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeGroup Platform - KI-gestützte 3PL/Fulfillment-Plattform",
  description: "Multi-Tenant-Plattform mit 85% KI-Autonomie für HR, Finanzen, Logistik, weCREATE und weSELL",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
