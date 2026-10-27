"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = resolvedTheme || theme || "light"
  const isDark = currentTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <div 
        className="w-9 h-9 rounded-xl border border-border/60 bg-muted/30"
        aria-hidden="true" 
      />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border/70 bg-card/80 hover:bg-accent/80 text-muted-foreground hover:text-foreground shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.15rem] w-[1.15rem] text-amber-500 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.15rem] w-[1.15rem] text-indigo-400 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
