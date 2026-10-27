"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { clearAuthToken } from "@/lib/auth"
import { Briefcase, Users, Loader2, TrendingUp, DollarSign, ArrowLeft, Menu, X, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from "@/navigation"
import { useTranslations } from 'next-intl'
import AppNavbar from "@/components/AppNavbar"

export default function EmployerAnalyticsPage() {
  const t = useTranslations('Dashboard.employer')
  const tAnalytics = useTranslations('Dashboard.employer.analyticsPage')
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const analytics = await apiClient.getEmployerAnalytics()
      setAnalyticsData(analytics)
    } catch (err: any) {
      setError(err.message || tAnalytics('errorFetch'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "employer")) {
      router.push("/auth/login")
      return
    }

    if (!authLoading && user && user.role === "employer") {
      fetchAnalyticsData()
    }
  }, [user, authLoading, router])

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

  if (!user || user.role !== "employer") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNavbar user={user} showBack backHref="/dashboard/employer" backText={tAnalytics('backToDashboard')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{tAnalytics('title')}</h1>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/20 border border-destructive/50 text-sm text-destructive">
            {error}
          </div>
        )}

        {analyticsData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.activeJobs')}</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.activeJobs || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.totalApplicants')}</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.totalApplicants || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.openApplications')}</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.openApplications || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.closedApplications')}</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.closedApplications || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.hireRequests')}</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.hireRequests || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.lifetimeHireRequests')}</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.totalLifetimeHireRequests || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.hires')}</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">{analyticsData.hires || 0}</div></CardContent>
              </Card>
              <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0"><CardTitle className="text-sm font-medium">{t('stats.totalSpent')}</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent className="p-0"><div className="text-2xl font-bold">₹{analyticsData.totalSpent || 0}</div></CardContent>
              </Card>
            </div>

            <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">{tAnalytics('hiresByJob')}</h3>
              {analyticsData.jobBreakdown && analyticsData.jobBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.jobBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hires" fill="#8884d8" name={tAnalytics('charts.numberOfHires')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground">{tAnalytics('noData.hiresByJob')}</div>
              )}
            </Card>

            <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">{tAnalytics('hiresBySkill')}</h3>
              {analyticsData.hiresBySkill && analyticsData.hiresBySkill.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.hiresBySkill}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name={tAnalytics('charts.numberOfHires')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground">{tAnalytics('noData.hiresBySkill')}</div>
              )}
            </Card>

            <Card className="p-4 sm:p-6 bg-card/80 border-border/50 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">{tAnalytics('jobBreakdown')}</h3>
              {analyticsData.jobBreakdown && analyticsData.jobBreakdown.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{tAnalytics('table.jobTitle')}</TableHead>
                        <TableHead>{tAnalytics('table.totalOpenings')}</TableHead>
                        <TableHead>{tAnalytics('table.status')}</TableHead>
                        <TableHead>{tAnalytics('table.applicants')}</TableHead>
                        <TableHead>{tAnalytics('table.hired')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData.jobBreakdown.map((job: any) => (
                        <TableRow key={job._id}>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.totalOpenings}</TableCell>
                          <TableCell>{job.status}</TableCell>
                          <TableCell>{job.applicants}</TableCell>
                          <TableCell>{job.hires}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground">{tAnalytics('noData.jobBreakdown')}</div>
              )}
            </Card>

          </div>
        )}
      </div>
    </div>
  )
}