"use client"

import { useState, useEffect } from "react"
import { Link } from "@/navigation"
import { useRouter } from "@/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient, getDocumentUrl, openDocumentSafely } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { clearAuthToken } from "@/lib/auth"
import AppNavbar from "@/components/AppNavbar"
import { Briefcase, Star, Loader2, LogOut, ArrowLeft, Menu, X, CheckCircle, Copy, Check, Lock, MessageCircle, Phone, FileText, GraduationCap, Languages, User as UserIcon, IndianRupee, MapPin, Navigation, ExternalLink } from "lucide-react"
import { useTranslations } from 'next-intl'
import { SubscriptionModal } from "@/components/SubscriptionModal"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { calculateDistance, formatDistance } from "@/lib/utils"

export default function PublicProfilePage() {
  const t = useTranslations('Profile')
  const tCommon = useTranslations('Common')
  const tQual = useTranslations('Qualifications')
  const tLang = useTranslations('Languages')
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()
  const { refreshSubscription } = useSubscription()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<any>(null)
  const [employerJobs, setEmployerJobs] = useState<any[]>([])
  const [isHireDialogOpen, setIsHireDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [isHired, setIsHired] = useState(false)
  const [hiringRequestStatus, setHiringRequestStatus] = useState<'none' | 'requested' | 'hired' | 'rejected'>('none');

  // Context-aware hiring states
  const [contextJobId, setContextJobId] = useState<string | null>(null)
  const [contextJob, setContextJob] = useState<any>(null)
  const [viewContext, setViewContext] = useState<'general' | 'applicant'>('general')
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
  const [completedJobs, setCompletedJobs] = useState<any[]>([])
  const [loadingCompletedJobs, setLoadingCompletedJobs] = useState(false)

  // Subscription unlock states
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [unlockLoading, setUnlockLoading] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [unlockStats, setUnlockStats] = useState<any>(null)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)

  const userId = params.id as string

  // Request browser location permission for distance calculation
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      let cachedCoords: { lat: number; lng: number } | null = null;
      try {
        const saved = sessionStorage.getItem("employer_coords");
        if (saved) cachedCoords = JSON.parse(saved);
      } catch (e) {}

      if (cachedCoords) {
        setUserCoords(cachedCoords);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoords(coords);
          try {
            sessionStorage.setItem("employer_coords", JSON.stringify(coords));
          } catch (e) {}
        },
        (err) => {
          console.log("Geolocation error or denied:", err.message);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  const getDistanceText = () => {
    if (profile?.distance !== undefined && profile?.distance !== null) {
      return formatDistance(Number(profile.distance));
    }
    const coords = userCoords || ((user as any)?.location?.coordinates?.length === 2 && ((user as any).location.coordinates[0] !== 0 || (user as any).location.coordinates[1] !== 0) ? { lat: (user as any).location.coordinates[1], lng: (user as any).location.coordinates[0] } : null);
    if (coords && profile?.location?.coordinates && profile.location.coordinates.length === 2) {
      const wLon = profile.location.coordinates[0];
      const wLat = profile.location.coordinates[1];
      if (wLat && wLon && (wLat !== 0 || wLon !== 0)) {
        const d = calculateDistance(coords.lat, coords.lng, wLat, wLon);
        return formatDistance(d);
      }
    }
    return null;
  };

  const formatExpectedSalary = (salary?: any, hourlyRate?: number) => {
    if (salary && (Number(salary.min) > 0 || Number(salary.max) > 0)) {
      const periodLabel = salary.period === 'daily' ? '/day' : salary.period === 'hourly' ? '/hr' : '/month'
      const minVal = Number(salary.min) || 0
      const maxVal = Number(salary.max) || 0
      if (minVal > 0 && maxVal > 0) {
        return `₹${minVal.toLocaleString('en-IN')} – ₹${maxVal.toLocaleString('en-IN')} ${periodLabel}`
      } else if (minVal > 0) {
        return `₹${minVal.toLocaleString('en-IN')} ${periodLabel}`
      } else if (maxVal > 0) {
        return `Up to ₹${maxVal.toLocaleString('en-IN')} ${periodLabel}`
      }
    }
    if (hourlyRate && Number(hourlyRate) > 0) {
      return `₹${Number(hourlyRate).toLocaleString('en-IN')}/hr`
    }
    return t.has('negotiable') ? t('negotiable') : 'Negotiable'
  }

const handleUnlockProfile = async () => {
      try {
        setUnlockLoading(true)
        const unlockData = await apiClient.unlockWorkerProfile(userId) as any
        setIsUnlocked(true)
        setUnlockStats(unlockData)
        // Update profile with unlocked data if returned
        if (unlockData.worker) {
          setProfile(unlockData.worker)
        }
        // Refresh global subscription state to reflect usage
        if (user?.role === 'employer') {
          refreshSubscription();
        }
      } catch (err: any) {
        // Check if it's a subscription limit error
        if (err.message.includes('limit reached') || err.message.includes('upgrade')) {
          setShowSubscriptionModal(true)
        } else if (!err.message.includes('Active subscription required')) {
          // Don't show error for missing subscription, just show modal
          setError(err.message)
        }
        if (err.message.includes('subscription required')) {
          setShowSubscriptionModal(true)
        }
      } finally {
        setUnlockLoading(false)
      }
    }

    const fetchProfile = async (coords?: { lat: number; lng: number }) => {
    try {
      setLoading(true)
      const activeCoords = coords || userCoords || ((user as any)?.location?.coordinates?.length === 2 && ((user as any).location.coordinates[0] !== 0 || (user as any).location.coordinates[1] !== 0) ? { lat: (user as any).location.coordinates[1], lng: (user as any).location.coordinates[0] } : undefined);
      const queryParams = activeCoords ? { lat: activeCoords.lat, lng: activeCoords.lng } : undefined;
      const data = await apiClient.getPublicUserProfile(userId as string, queryParams) as any
      setProfile(data)

      // If employer viewing worker profile, trigger unlock
      if (user?.role === 'employer' && data.role === 'worker') {
        await handleUnlockProfile()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userCoords && userId && profile && profile.distance === undefined) {
      fetchProfile(userCoords);
    }
  }, [userCoords]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    // Extract context from URL parameters
    const jobIdParam = searchParams.get('jobId')
    const contextParam = searchParams.get('context')

    if (jobIdParam && contextParam === 'applicant') {
      setContextJobId(jobIdParam)
      setViewContext('applicant')
    }

    const fetchContextJob = async () => {
      if (jobIdParam && contextParam === 'applicant') {
        try {
          const jobData = await apiClient.getJobById(jobIdParam)
          setContextJob(jobData)

          // Check application status for this specific job
          const applications = await apiClient.getAllApplicationsForEmployer() as any[]
          const relevantApp = applications.find(
            (app: any) => app.job._id === jobIdParam && app.worker._id === userId
          )
          if (relevantApp) {
            setApplicationStatus(relevantApp.status)
          }
        } catch (err: any) {
          console.error("Failed to fetch context job", err)
          // If job fetch fails, reset context
          setContextJobId(null)
          setViewContext('general')
        }
      }
    }

    const fetchEmployerJobs = async () => {
      if (user?.role === 'employer') {
        try {
          const jobs = await apiClient.getEmployerJobs() as any[]
          setEmployerJobs(jobs)
          console.log('Fetched employer jobs:', jobs);

          const isHiredForAnyJob = jobs.some((job: any) => job.workers.some((w: any) => w.workerId === userId));
          setIsHired(isHiredForAnyJob);
          console.log('isHiredForAnyJob:', isHiredForAnyJob);

          // Check if there's an outstanding offer for this worker from this employer
          const outstandingOffer = jobs.some((job: any) =>
            job.applications && job.applications.some((app: any) => app.worker._id === userId && app.status === 'offered')
          );
          console.log('outstandingOffer:', outstandingOffer);

          // Check if the worker is already hired for any job from this employer
          const alreadyHired = jobs.some((job: any) =>
            job.applications && job.applications.some((app: any) => app.worker._id === userId && app.status === 'hired')
          );
          console.log('alreadyHired:', alreadyHired);

          if (outstandingOffer) {
            setHiringRequestStatus('requested');
            console.log('Setting hiringRequestStatus to requested');
          } else if (alreadyHired) {
            setHiringRequestStatus('hired');
            console.log('Setting hiringRequestStatus to hired');
          } else {
            setHiringRequestStatus('none');
            console.log('Setting hiringRequestStatus to none');
          }
        } catch (err: any) {
          console.error("Failed to fetch employer jobs", err)
        }
      }
    }

    const fetchCompletedJobs = async () => {
      try {
        setLoadingCompletedJobs(true)
        const jobs = await apiClient.getWorkerCompletedJobs(userId)
        setCompletedJobs(jobs as any[])
      } catch (err: any) {
        console.error("Failed to fetch completed jobs", err)
      } finally {
        setLoadingCompletedJobs(false)
      }
    }

    if (!authLoading && user) {
      fetchProfile()
      fetchContextJob()
      fetchEmployerJobs()

      // Fetch completed jobs only if viewing a worker profile
      if (profile?.role === 'worker' || !profile) {
        fetchCompletedJobs()
      }
    }
  }, [user, authLoading, router, userId, searchParams])

  const handleHire = async () => {
    if (!selectedJob) {
      setError(t('selectJobToHire'))
      return
    }
    try {
      await apiClient.hireWorkerForJob(selectedJob, userId as string)
      setIsHireDialogOpen(false)
      setHiringRequestStatus('requested'); // Update status after sending request
      // Optionally, refresh profile data to reflect hired status
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDirectHire = async () => {
    if (!contextJobId) return

    if (!window.confirm(`Are you sure you want to hire ${profile.name} for ${contextJob?.title}?`)) {
      return
    }

    try {
      await apiClient.hireWorkerForJob(contextJobId, userId as string)
      setApplicationStatus('hired')
      setError('')
      // Redirect back to applicants page
      router.push(`/dashboard/employer/jobs/${contextJobId}/applicants`)
    } catch (err: any) {
      setError(err.message)
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

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-destructive">{error || t('errors.loadPublicFailed')}</p>
        <Link href={user?.role === 'employer' ? '/dashboard/employer' : '/dashboard/worker'}>
          <Button variant="link" className="mt-4">
            {t('backToJobs')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-3 rounded-full hover:bg-primary ">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tCommon('buttons.back')}
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t('userProfileTitle', { name: profile.name })}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 sm:p-8 bg-card/90 border-border/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg bg-muted flex items-center justify-center shrink-0 aspect-square">
                  <img
                    src={profile.profilePicture || "/placeholder-user.jpg"}
                    alt={profile.name || "Profile"}
                    className="w-full h-full object-cover aspect-square block"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="break-words">{profile.name}</span>
                    {profile.isVerified && (
                      <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                    )}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base break-words leading-relaxed flex items-center flex-wrap gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-foreground">
                      {profile.city?.trim() || profile.locationName?.split(',')[0]?.trim() || (typeof profile.location === 'string' ? profile.location.split(',')[0]?.trim() : null) || t('locationNotSpecified')}
                    </span>
                    {getDistanceText() && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Navigation className="w-3 h-3" />
                        {getDistanceText()}
                      </span>
                    )}
                  </p>
                  {profile.role === "worker" && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                      {Array.isArray(profile.workerType) && profile.workerType.length > 0 ? (
                        profile.workerType.map((type: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                          >
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            {type}
                          </span>
                        ))
                      ) : typeof profile.workerType === 'string' && profile.workerType ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          {profile.workerType}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              {profile.role === "worker" && (
                <div className="space-y-6">
                  {/* Candidate Quick Stats / Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-muted/30 border border-border/60">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">{t('qualification') || 'Education'}</p>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                        <span className="break-words">
                          {profile.qualification ? (tQual.has(profile.qualification) ? tQual(profile.qualification) : profile.qualification) : (t('notSpecified') || 'Not Specified')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Age & Gender</p>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <UserIcon className="w-4 h-4 text-primary shrink-0" />
                        <span className="break-words">
                          {[
                            profile.age ? `${profile.age} ${tCommon.has('yrs') ? tCommon('yrs') : 'yrs'}` : null,
                            profile.gender ? (tCommon.has(profile.gender.toLowerCase()) ? tCommon(profile.gender.toLowerCase()) : (profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1))) : null
                          ].filter(Boolean).join(' • ') || (t('notSpecified') || 'Not Specified')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Experience</p>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-primary shrink-0" />
                        <span className="break-words">
                          {profile.isFresher ? (tCommon('fresher') || "Fresher") : (profile.experience ? `${profile.experience} yrs` : t('notSpecified'))}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">{t('expectedSalary') || 'Expected Salary'}</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="break-words">{formatExpectedSalary(profile.expectedSalary, profile.hourlyRate)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Full Location & Address Card */}
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Location & Address
                      </h3>
                      {getDistanceText() && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <Navigation className="w-3.5 h-3.5" />
                          {getDistanceText()} from your location
                        </span>
                      )}
                    </div>
                    <p className="text-foreground/90 font-medium text-base mb-3 leading-relaxed">
                      {profile.locationName || profile.location?.address || (typeof profile.location === 'string' ? profile.location : null) || [profile.city, profile.state, profile.pincode].filter(Boolean).join(', ') || t('locationNotSpecified')}
                    </p>

                    {(profile.city || profile.state || profile.pincode) && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border/40">
                        {profile.city && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-background border border-border/60 text-foreground">
                            <span className="text-muted-foreground">City:</span> <strong>{profile.city}</strong>
                          </span>
                        )}
                        {profile.state && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-background border border-border/60 text-foreground">
                            <span className="text-muted-foreground">State:</span> <strong>{profile.state}</strong>
                          </span>
                        )}
                        {profile.pincode && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-background border border-border/60 text-foreground">
                            <span className="text-muted-foreground">Pincode:</span> <strong>{profile.pincode}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4">
                      <a
                        href={
                          profile.location?.coordinates && profile.location.coordinates.length === 2 && (profile.location.coordinates[1] !== 0 || profile.location.coordinates[0] !== 0)
                            ? `https://www.google.com/maps/search/?api=1&query=${profile.location.coordinates[1]},${profile.location.coordinates[0]}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.locationName || profile.city || '')}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        View on Google Maps
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Languages Known Section */}
                  {profile.languages && profile.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Languages className="w-5 h-5 text-primary" />
                        Languages Known
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang: string, idx: number) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 bg-muted border border-border/60 text-foreground rounded-full text-sm font-medium"
                          >
                            {lang}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.languages && profile.languages.length > 0 && (
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                        <Languages className="w-4 h-4 text-primary" />
                        {t('languages') || 'Languages Known'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary font-medium rounded-xl text-xs sm:text-sm"
                          >
                            {tLang.has(lang) ? tLang(lang) : lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.bio && (
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {tCommon('about_me') || "About Me"}
                      </h3>
                      <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-base">{profile.bio}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('skills')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill: string, idx: number) => (
                        <div
                          key={idx}
                          className="px-3 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('workerType')}</h3>
                    <p className="text-muted-foreground">{profile.workerType?.join(', ') || t('notSpecified')}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('experience')}</h3>
                    <p className="text-muted-foreground">
                      {profile.isFresher ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tCommon('fresher') || "Fresher"}
                        </span>
                      ) : (
                        profile.experience ? `${profile.experience} ${tCommon('labels.yearsOfExperience')}` : t('notSpecified')
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('expectedSalary') || 'Expected Salary'}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-base font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
                        <IndianRupee className="w-4 h-4" />
                        {formatExpectedSalary(profile.expectedSalary, profile.hourlyRate)}
                      </span>
                      {profile.hourlyRate > 0 && profile.expectedSalary && (Number(profile.expectedSalary.min) > 0 || Number(profile.expectedSalary.max) > 0) && (
                        <span className="text-sm text-muted-foreground">
                          (Hourly: ₹{profile.hourlyRate}/hr)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{t('availability')}</h3>
                    <p className="text-muted-foreground">{profile.availability || t('notSpecified')}</p>
                  </div>
                  {profile.documents && profile.documents.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{t('documents')}</h3>
                      {(profile.role === "worker") ? (
                        profile.documents
                          .filter((doc: any) => doc.type === "biodata" || doc.name.toLowerCase().includes('biodata') || doc.name.toLowerCase().includes('resume') || doc.name.toLowerCase().includes('cv'))
                          .map((doc: any) => (
                            <div key={doc._id} className="flex items-center gap-2 mb-2">
                              <Button
                                variant="outline"
                                onClick={() => openDocumentSafely(doc.url, { title: doc.name })}
                                disabled={!doc.url}
                                className={`rounded-full ${!doc.url ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {t('viewDoc', { name: doc.name }) || `View ${doc.name}`}
                              </Button>
                            </div>
                          ))
                      ) : (
                        profile.documents.map((doc: any) => (
                          <div key={doc._id} className="flex items-center gap-2 mb-2">
                            <Button
                              variant="outline"
                              onClick={() => openDocumentSafely(doc.url, { title: doc.name })}
                              disabled={!doc.url}
                              className={`rounded-full ${!doc.url ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {t('viewDoc', { name: doc.name }) || `View ${doc.name}`}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {profile.role === "employer" && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{t('companyDetails')}</h3>
                  <p>
                    <span className="font-semibold">{t('companyName')}:</span> {profile.companyName}
                  </p>
                  <p>
                    <span className="font-semibold">{t('businessType')}:</span> {profile.businessType}
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <Card className="p-6 bg-card/90 border-border/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('rating')}</h3>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-primary">{profile.rating || "N/A"}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(profile.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Unlock Stats - Only show for employers viewing workers */}
            {user.role === 'employer' && profile.role === 'worker' && unlockStats && (
              <Card className="p-6 bg-card/90 border-border/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Database Access
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used:</span>
                    <span className="font-semibold">{unlockStats.unlocksUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-semibold text-primary">{unlockStats.unlocksRemaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">{unlockStats.maxUnlocks}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(unlockStats.unlocksUsed / unlockStats.maxUnlocks) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Previous Hires Section - Only for workers */}
            {profile.role === "worker" && completedJobs.length > 0 && (
              <Card className="p-6 bg-card/90 border-border/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Previous Hires ({completedJobs.length})
                </h3>
                {loadingCompletedJobs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedJobs.slice(0, 3).map((job: any) => (
                      <div
                        key={job._id}
                        className="border-b border-border/30 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {job.title}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Briefcase className="w-3 h-3" />
                              {job.employer?.name}
                            </p>
                          </div>
                          {job.rating && (
                            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span className="font-semibold text-sm text-foreground">
                                {job.rating.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        {job.rating?.review && (
                          <div className="bg-muted/30 rounded-lg p-2 mb-2 mt-2">
                            <p className="text-xs text-muted-foreground italic">
                              "{job.rating.review}"
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {job.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                          {job.completedAt && (
                            <span>
                              {new Date(job.completedAt).toLocaleDateString()}
                            </span>
                          )}
                          {!job.completedAt && job.assignedAt && (
                            <span>
                              Started: {new Date(job.assignedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* View All Modal Trigger */}
                    {completedJobs.length > 3 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mt-4 text-xs h-8">
                            View All ({completedJobs.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Briefcase className="w-5 h-5" />
                              Previous Hires ({completedJobs.length})
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-4">
                              {completedJobs.map((job: any) => (
                                <div
                                  key={`modal-${job._id}`}
                                  className="border-b border-border/30 pb-4 last:border-0 last:pb-0"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-foreground">
                                        {job.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <Briefcase className="w-3 h-3" />
                                        {job.employer?.name}
                                      </p>
                                    </div>
                                    {job.rating && (
                                      <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="font-semibold text-sm text-foreground">
                                          {job.rating.rating.toFixed(1)}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {job.rating?.review && (
                                    <div className="bg-muted/30 rounded-lg p-3 mb-2 mt-2">
                                      <p className="text-sm text-muted-foreground italic">
                                        "{job.rating.review}"
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Status: {job.status === 'completed' ? 'Completed' : 'In Progress'}
                                    </span>
                                    {job.completedAt && (
                                      <span>
                                        Completed: {new Date(job.completedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                    {!job.completedAt && job.assignedAt && (
                                      <span>
                                        Started: {new Date(job.assignedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </Card>
            )}

            <Card className="p-6 bg-card/90 border-border/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary/5">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('actions')}</h3>
              {user.role === 'employer' && (
                <div className="space-y-3">
                  {/* Context-aware hire button */}
                  {viewContext === 'applicant' && contextJob ? (
                    // Viewing from applicants page - show direct hire for specific job
                    <>
                      {applicationStatus === 'hired' || applicationStatus === 'offerAccepted' ? (
                        <div className="space-y-2">
                          <Button className="w-full rounded-full" disabled>
                            {applicationStatus === 'hired' ? 'Already Hired' : 'Offer Accepted'}
                          </Button>
                          <Button className="w-full rounded-full" variant="outline" onClick={() => router.push('/messages')}>
                            {t('messageUser', { name: profile.name })}
                          </Button>
                        </div>
                      ) : applicationStatus === 'pending' ? (
                        profile.availability === 'unavailable' ? (
                          <Button className="w-full rounded-full" disabled>
                            Worker Unavailable
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-full"
                            onClick={handleDirectHire}
                          >
                            Hire for "{contextJob.title}"
                          </Button>
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">Application status: {applicationStatus || 'Unknown'}</p>
                      )}
                    </>
                  ) : (
                    // General view from hire-talent - show dialog to select job
                    hiringRequestStatus === 'hired' ? (
                      <Button className="w-full rounded-full" onClick={() => router.push('/messages')}>{t('messageUser', { name: profile.name })}</Button>
                    ) : hiringRequestStatus === 'requested' ? (
                      <div className="flex flex-col gap-2">
                        <Button className="w-full rounded-full" disabled>{t('requestedForHire')}</Button>
                        <Button className="w-full rounded-full" variant="outline" onClick={() => router.push('/messages')}>{t('messageUser', { name: profile.name })}</Button>
                      </div>
                    ) : (
                      <Button className="w-full rounded-full" onClick={() => setIsHireDialogOpen(true)}>{t('hireUser', { name: profile.name })}</Button>
                    )
                  )}

                  {/* Contact copy button - replaced with action buttons */}
                  {profile.mobile && (
                    <div className="flex gap-2 w-full mt-2">
                      <Button
                        className="flex-1 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-0"
                        onClick={() => window.open(`https://wa.me/91${profile.mobile}`, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        className="flex-1 rounded-full"
                        onClick={() => window.location.href = `tel:+91${profile.mobile}`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {isHireDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{t('hireUser', { name: profile.name })}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="job" className="block text-sm font-medium text-muted-foreground mb-2">{t('selectJob')}</label>
                <select
                  id="job"
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full p-2 border rounded-md bg-input text-foreground"
                >
                  <option value="" disabled>{t('selectJob')}</option>
                  {employerJobs.map(job => (
                    <option key={job._id} value={job._id}>{job.title}</option>
                  ))}
                </select>
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsHireDialogOpen(false)}>{tCommon('buttons.cancel')}</Button>
                <Button onClick={handleHire}>{tCommon('buttons.confirm')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  )
}