"use client"

import React, { useState, useEffect } from "react"
import { Link, useRouter, usePathname } from "@/navigation"
import { useTranslations } from "next-intl"
import { getUser, clearAuthToken, AuthUser } from "@/lib/auth"
import {
  LayoutDashboard,
  Briefcase,
  Search,
  MessageSquare,
  Plus,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  User,
  CreditCard,
  Building2,
  HardHat
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/NotificationBell"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

export interface AppNavbarProps {
  user?: AuthUser | null
  showBack?: boolean
  backHref?: string
  backText?: string
  title?: string
  className?: string
  rightContent?: React.ReactNode
}

export default function AppNavbar({
  user: initialUser,
  showBack = false,
  backHref,
  backText,
  title,
  className = "",
  rightContent,
}: AppNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const tNav = useTranslations("Common.navigation")
  const tCommon = useTranslations("Common")

  // Bulletproof localized label getter with fallback to English
  const getNavText = (key: string, fallback: string) => {
    try {
      if (tNav.has(key)) return tNav(key)
      if (tCommon.has(`navigation.${key}`)) return tCommon(`navigation.${key}`)
      if (tCommon.has(`buttons.${key}`)) return tCommon(`buttons.${key}`)
    } catch {}
    return fallback
  }

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(initialUser ?? null)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Keep user synchronized with localStorage & events
  useEffect(() => {
    if (initialUser !== undefined && initialUser !== null) {
      setCurrentUser(initialUser)
    } else {
      setCurrentUser(getUser())
    }

    const syncUser = () => {
      setCurrentUser(getUser())
    }

    window.addEventListener("storage", syncUser)
    window.addEventListener("auth-changed", syncUser)
    return () => {
      window.removeEventListener("storage", syncUser)
      window.removeEventListener("auth-changed", syncUser)
    }
  }, [initialUser])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileNavOpen])

  // Handle escape key to close mobile nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileNavOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleLogout = () => {
    clearAuthToken()
    setCurrentUser(null)
    setIsMobileNavOpen(false)
    router.push("/auth/login")
  }

  // Determine home link based on user role
  const homeHref = currentUser?.role === "employer"
    ? "/dashboard/employer"
    : currentUser?.role === "worker"
    ? "/dashboard/worker"
    : currentUser?.role === "admin"
    ? "/admin/dashboard"
    : "/"

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/dashboard/employer" || href === "/dashboard/worker" || href === "/admin/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Role initials/badge
  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <>
      <nav
        className={`sticky top-0 left-0 w-full bg-background/85 backdrop-blur-md border-b border-border/60 z-40 transition-colors shadow-xs ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Left section: Logo & Back Button */}
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={() => (backHref ? router.push(backHref) : router.back())}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/80 border border-transparent hover:border-border/60 transition-all duration-150 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {backText || getNavText("back", "Back")}
                </span>
              </button>
            )}

            <Link href={homeHref} className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Shramik Seva"
                className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-indigo-600 to-violet-600 dark:from-primary dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent tracking-tight leading-tight">
                  {tCommon("appName")}
                </span>
                {title && (
                  <span className="text-xs text-muted-foreground font-medium sm:hidden truncate max-w-[120px]">
                    {title}
                  </span>
                )}
              </div>
            </Link>

            {title && (
              <div className="hidden sm:flex items-center pl-3 border-l border-border/60 ml-2">
                <h1 className="text-sm font-semibold text-foreground truncate max-w-xs">
                  {title}
                </h1>
              </div>
            )}
          </div>

          {/* Center / Middle: Role-based Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {currentUser?.role === "employer" && (
              <>
                <Link href="/dashboard/employer">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/dashboard/employer")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("dashboard", "Dashboard")}
                  </span>
                </Link>
                <Link href="/dashboard/employer/hire-talent">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/dashboard/employer/hire-talent")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("hireTalent", "Hire Talent")}
                  </span>
                </Link>
                <Link href="/messages">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/messages")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("messages", "Messages")}
                  </span>
                </Link>
                <Link href="/subscriptions">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/subscriptions")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("subscriptions", "Subscriptions")}
                  </span>
                </Link>
              </>
            )}

            {currentUser?.role === "worker" && (
              <>
                <Link href="/dashboard/worker">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/dashboard/worker")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("dashboard", "Dashboard")}
                  </span>
                </Link>
                <Link href="/jobs">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/jobs")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("jobs", "Jobs")}
                  </span>
                </Link>
                <Link href="/messages">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/messages")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("messages", "Messages")}
                  </span>
                </Link>
              </>
            )}

            {!currentUser && (
              <>
                <Link href="/jobs">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/jobs")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("jobs", "Jobs")}
                  </span>
                </Link>
                <Link href="/subscriptions">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                      isActive("/subscriptions")
                        ? "bg-primary/15 text-primary font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 active:scale-95"
                    }`}
                  >
                    {getNavText("subscriptions", "Subscriptions")}
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Right section: Actions, Notifications, Language, Theme & Profile/Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Custom rightContent injected by page if any */}
            {rightContent}

            {/* Employer Quick Post Job CTA button */}
            {currentUser?.role === "employer" && (
              <Link href="/jobs/create" className="hidden lg:block">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] px-4 py-1.5 text-xs transition-all duration-150 cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{getNavText("postJob", "Post Job")}</span>
                </span>
              </Link>
            )}

            {/* Notification Bell (Always accessible when logged in) */}
            {currentUser && <NotificationBell />}

            {/* Language Switcher (Desktop) */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle (Desktop & Mobile) */}
            <ThemeToggle />

            {/* Desktop User / Profile / Logout Controls */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-2 pl-1">
                <Link href="/profile">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer border select-none ${
                      isActive("/profile")
                        ? "bg-primary/15 text-primary border-primary/30 font-semibold hover:bg-primary/20 hover:text-primary shadow-xs"
                        : "border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:border-border"
                    }`}
                  >
                    <Avatar className="w-6 h-6 border border-border/80">
                      {currentUser.profilePicture && (
                        <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                      )}
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline max-w-[110px] truncate text-xs font-semibold">
                      {currentUser.name}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/70 hover:border-destructive/30 transition-all duration-150 active:scale-95 cursor-pointer select-none"
                >
                  <LogOut className="w-3.5 h-3.5 transition-colors" />
                  <span>{getNavText("logout", "Logout")}</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login">
                  <span className="inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors duration-150 cursor-pointer select-none">
                    {getNavText("login", "Login")}
                  </span>
                </Link>
                <Link href="/auth/register">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-1.5 text-xs shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer select-none">
                    {getNavText("getStarted", "Get Started")}
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full md:hidden w-9 h-9 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:border-border transition-all duration-150 cursor-pointer"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open mobile navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-[300px] sm:w-[340px] bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top */}
              <div className="space-y-6">
                {/* Header: Logo & Close Button */}
                <div className="flex justify-between items-center pb-4 border-b border-border/60">
                  <Link
                    href={homeHref}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-lg bg-gradient-to-r from-primary via-indigo-600 to-violet-600 dark:from-primary dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                      {tCommon("appName")}
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-8 h-8 transition-colors duration-150 cursor-pointer"
                    onClick={() => setIsMobileNavOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info Card (if logged in) */}
                {currentUser ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`block p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer select-none ${
                      isActive("/profile")
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/40 border-border/60 hover:bg-accent/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        {currentUser.profilePicture && (
                          <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                        )}
                        <AvatarFallback className="text-sm bg-primary/10 text-primary font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {currentUser.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 uppercase tracking-wider font-semibold"
                          >
                            {currentUser.role === "employer" ? (
                              <Building2 className="w-2.5 h-2.5 mr-1 inline" />
                            ) : (
                              <HardHat className="w-2.5 h-2.5 mr-1 inline" />
                            )}
                            {currentUser.role}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {currentUser.mobile || currentUser.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                    <p className="text-xs text-muted-foreground font-medium">
                      Welcome to Shramik Seva
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link href="/auth/login" onClick={() => setIsMobileNavOpen(false)}>
                        <span className="w-full inline-flex items-center justify-center rounded-xl py-2 text-xs font-semibold border border-border/80 text-foreground hover:bg-accent/80 hover:text-foreground transition-colors cursor-pointer select-none">
                          {getNavText("login", "Login")}
                        </span>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsMobileNavOpen(false)}>
                        <span className="w-full inline-flex items-center justify-center rounded-xl py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-xs cursor-pointer select-none">
                          {getNavText("getStarted", "Get Started")}
                        </span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Employer "+ Post a Job" Button (Mobile) */}
                {currentUser?.role === "employer" && (
                  <Link href="/jobs/create" onClick={() => setIsMobileNavOpen(false)}>
                    <span className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md py-3.5 font-semibold text-sm gap-2 transition-all hover:shadow-lg active:scale-[0.99] cursor-pointer select-none">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>{getNavText("postJob", "Post Job")}</span>
                    </span>
                  </Link>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    {getNavText("home", "Navigation")}
                  </p>

                  {currentUser?.role === "employer" && (
                    <>
                      <Link href="/dashboard/employer" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/dashboard/employer")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <LayoutDashboard className={`w-4 h-4 mr-3 transition-colors ${isActive("/dashboard/employer") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("dashboard", "Dashboard")}</span>
                        </div>
                      </Link>
                      <Link
                        href="/dashboard/employer/hire-talent"
                        onClick={() => setIsMobileNavOpen(false)}
                      >
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/dashboard/employer/hire-talent")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <Search className={`w-4 h-4 mr-3 transition-colors ${isActive("/dashboard/employer/hire-talent") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("hireTalent", "Hire Talent")}</span>
                        </div>
                      </Link>
                      <Link href="/messages" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/messages")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <MessageSquare className={`w-4 h-4 mr-3 transition-colors ${isActive("/messages") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("messages", "Messages")}</span>
                        </div>
                      </Link>
                      <Link href="/subscriptions" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/subscriptions")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <CreditCard className={`w-4 h-4 mr-3 transition-colors ${isActive("/subscriptions") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("subscriptions", "Subscriptions")}</span>
                        </div>
                      </Link>
                    </>
                  )}

                  {currentUser?.role === "worker" && (
                    <>
                      <Link href="/dashboard/worker" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/dashboard/worker")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <LayoutDashboard className={`w-4 h-4 mr-3 transition-colors ${isActive("/dashboard/worker") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("dashboard", "Dashboard")}</span>
                        </div>
                      </Link>
                      <Link href="/jobs" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/jobs")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <Briefcase className={`w-4 h-4 mr-3 transition-colors ${isActive("/jobs") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("jobs", "Jobs")}</span>
                        </div>
                      </Link>
                      <Link href="/messages" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/messages")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <MessageSquare className={`w-4 h-4 mr-3 transition-colors ${isActive("/messages") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("messages", "Messages")}</span>
                        </div>
                      </Link>
                    </>
                  )}

                  {currentUser && (
                    <Link href="/profile" onClick={() => setIsMobileNavOpen(false)}>
                      <div
                        className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                          isActive("/profile")
                            ? "bg-primary/15 text-primary font-semibold shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                        }`}
                      >
                        <User className={`w-4 h-4 mr-3 transition-colors ${isActive("/profile") ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{getNavText("profile", "Profile")}</span>
                      </div>
                    </Link>
                  )}

                  {!currentUser && (
                    <>
                      <Link href="/jobs" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/jobs")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <Briefcase className={`w-4 h-4 mr-3 transition-colors ${isActive("/jobs") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("jobs", "Jobs")}</span>
                        </div>
                      </Link>
                      <Link href="/subscriptions" onClick={() => setIsMobileNavOpen(false)}>
                        <div
                          className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
                            isActive("/subscriptions")
                              ? "bg-primary/15 text-primary font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                          }`}
                        >
                          <CreditCard className={`w-4 h-4 mr-3 transition-colors ${isActive("/subscriptions") ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{getNavText("subscriptions", "Subscriptions")}</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>

                {/* Preferences Section (Mobile) */}
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-3">
                    {getNavText("settings", "Settings")}
                  </p>
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-xs font-semibold text-foreground">Language</span>
                    <LanguageSwitcher />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-xs font-semibold text-foreground">Appearance</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              {/* Drawer Footer: Logout */}
              {currentUser && (
                <div className="pt-4 border-t border-border/60 mt-6">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start text-destructive/90 hover:text-destructive hover:bg-destructive/10 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-150 cursor-pointer select-none"
                  >
                    <LogOut className="w-4 h-4 mr-3 transition-colors" />
                    <span>{getNavText("logout", "Logout")}</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
