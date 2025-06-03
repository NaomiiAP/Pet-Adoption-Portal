"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home, Search, Building2, FileText, Database } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/pets", label: "Find Pets", icon: Search },
    { href: "/adopters", label: "Adopters", icon: Heart },
    { href: "/shelters", label: "Shelters", icon: Building2 },
    { href: "/adoptions", label: "Adoptions", icon: FileText },
    { href: "/query", label: "SQL Query", icon: Database },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-lilac rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">PawPal</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                    pathname === item.href
                      ? "bg-purple-600/20 text-purple-300 border border-purple-600/30"
                      : "text-gray-300 hover:text-purple-300 hover:bg-purple-600/10",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    pathname === item.href
                      ? "bg-purple-600/20 text-purple-300"
                      : "text-gray-300 hover:text-purple-300 hover:bg-purple-600/10",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
