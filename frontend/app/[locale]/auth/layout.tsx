import type React from "react"
import { Briefcase } from "lucide-react"
import { Link } from "@/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-background/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Shramik Seva" className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-indigo-600 to-violet-600 dark:from-primary dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Shramik Seva
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
