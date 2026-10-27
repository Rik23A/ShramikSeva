"use client"

import { useState, useEffect } from "react"
import { Link } from "@/navigation"
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { clearAuthToken } from "@/lib/auth"
import { Loader2, ArrowLeft, Briefcase, User, LogOut, Menu, X } from "lucide-react"
import { useTranslations } from 'next-intl'
import { NotificationBell } from "@/components/NotificationBell"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ThemeToggle } from "@/components/theme-toggle"
import AppNavbar from "@/components/AppNavbar"

export default function HiringRequestsPage() {
  const t = useTranslations('Dashboard.worker')
  const tHiring = useTranslations('Dashboard.worker.hiringRequests')
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [hiringRequests, setHiringRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchHiringRequests = async () => {
    try {
      setLoading(true)
      const data = (await apiClient.getWorkerHiringRequests()) as any[]
      setHiringRequests(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch hiring requests.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "worker")) {
      router.push("/auth/login")
      return
    }

    if (!authLoading && user && user.role === "worker") {
      fetchHiringRequests()
    }
  }, [user, authLoading, router])

  const handleAccept = async (applicationId: string) => {
    try {
      await apiClient.acceptHiringRequest(applicationId)
      fetchHiringRequests() // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to accept hiring request.")
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      await apiClient.rejectHiringRequest(applicationId)
      fetchHiringRequests() // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to reject hiring request.")
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    router.push("/auth/login")
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar user={user} showBack backHref="/dashboard/worker" backText={tHiring('backToDashboard')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4 leading-tight tracking-tight">
            {tHiring('title')}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto sm:mx-0 font-medium">
            {tHiring('subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-sm font-bold text-destructive animate-shake">
            {error}
          </div>
        )}

        <Card className="bg-card/80 border-border/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden">
          <CardHeader className="p-8 border-b border-border/50 bg-muted/30">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              {tHiring('pendingOffers')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {hiringRequests.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/50">
                  <Briefcase className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground font-bold text-lg">{tHiring('noOffers')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {hiringRequests.map((request) => (
                  <div key={request._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 hover:bg-muted/30 transition-all group gap-6">
                    <div className="min-w-0 flex-grow space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                          {request.job.title}
                        </p>
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest">
                          New Request
                        </span>
                      </div>
                      <p className="text-muted-foreground font-bold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {request.job.employer.companyName || request.job.employer.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <Link href={`/profile/${request.job.employer._id}`} className="flex-1 sm:flex-initial">
                        <Button variant="outline" className="w-full sm:w-auto rounded-xl font-bold border-border/50 hover:bg-muted h-11 px-6">
                          {tHiring('viewEmployer')}
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        onClick={() => handleAccept(request._id)}
                        className="flex-1 sm:flex-initial rounded-xl font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 h-11 px-6 transition-all active:scale-95"
                      >
                        {tHiring('accept')}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleReject(request._id)}
                        className="flex-1 sm:flex-initial rounded-xl font-bold text-destructive hover:bg-destructive/10 h-11 px-6"
                      >
                        {tHiring('reject')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
