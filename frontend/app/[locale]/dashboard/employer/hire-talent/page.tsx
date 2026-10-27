"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { clearAuthToken } from "@/lib/auth"
import { Loader2, Search, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MapPin, Star, IndianRupee, Menu, X, LogOut, Briefcase, GraduationCap, Languages, User as UserIcon } from "lucide-react"
import { Link } from "@/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react"; // Import Filter icon

import AppNavbar from "@/components/AppNavbar"
import { useTranslations } from 'next-intl';
import { calculateDistance, formatDistance } from '@/lib/utils';
import { workerTypeSkills, qualifications, knownLanguages } from "@/lib/worker-data";

export default function HireTalentPage() {
  const t = useTranslations('Dashboard.employer')
  const tHire = useTranslations('Dashboard.employer.hireTalentPage')
  const tCommon = useTranslations('Common')
  const tWT = useTranslations('WorkerTypes');
  const tQual = useTranslations('Qualifications');
  const tLang = useTranslations('Languages');
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkerType, setSelectedWorkerType] = useState<string>("") // State for worker type
  const [selectedQualification, setSelectedQualification] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [location, setLocation] = useState("")
  const [availability, setAvailability] = useState("") // 'available' or 'unavailable'

  // New State for Job-Based Recommendations
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(""); // Default to empty string (no selection)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(workers.length / ITEMS_PER_PAGE));
  const paginatedWorkers = workers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const formatSalary = (worker: any) => {
    if (worker.expectedSalary && (Number(worker.expectedSalary.min) > 0 || Number(worker.expectedSalary.max) > 0)) {
      const minVal = Number(worker.expectedSalary.min);
      const maxVal = Number(worker.expectedSalary.max);
      const period = worker.expectedSalary.period === 'daily' ? 'day' : worker.expectedSalary.period === 'hourly' ? 'hr' : 'mo';
      if (minVal > 0 && maxVal > 0) {
        return `₹${minVal.toLocaleString('en-IN')} – ₹${maxVal.toLocaleString('en-IN')} / ${period}`;
      }
      if (minVal > 0) {
        return `₹${minVal.toLocaleString('en-IN')} / ${period}`;
      }
      return `Up to ₹${maxVal.toLocaleString('en-IN')} / ${period}`;
    }
    if (worker.hourlyRate && Number(worker.hourlyRate) > 0) {
      return tHire('hourlyRateValue', { rate: worker.hourlyRate });
    }
    return tHire.has('negotiable') ? tHire('negotiable') : 'Negotiable';
  };

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
          console.log("Geolocation error or denied in hire-talent:", err.message);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  const getWorkerDistanceText = (worker: any) => {
    if (worker.distance !== undefined && worker.distance !== null) {
      return formatDistance(Number(worker.distance));
    }
    const coords = userCoords || ((user as any)?.location?.coordinates?.length === 2 && ((user as any).location.coordinates[0] !== 0 || (user as any).location.coordinates[1] !== 0) ? { lat: (user as any).location.coordinates[1], lng: (user as any).location.coordinates[0] } : null);
    if (coords && worker.location?.coordinates && worker.location.coordinates.length === 2) {
      const wLon = worker.location.coordinates[0];
      const wLat = worker.location.coordinates[1];
      if (wLat && wLon && (wLat !== 0 || wLon !== 0)) {
        const d = calculateDistance(coords.lat, coords.lng, wLat, wLon);
        return formatDistance(d);
      }
    }
    return null;
  };

  const handleLogout = () => {
    clearAuthToken()
    router.push("/auth/login")
  }


  const fetchWorkers = async () => {
    try {
      setLoading(true)

      // If no job selected and no search params, don't fetch (keep blank)
      if (!selectedJobId && !searchTerm && !location && !availability && !selectedWorkerType && (!selectedQualification || selectedQualification === 'all') && (!selectedLanguage || selectedLanguage === 'all')) {
        setWorkers([]);
        setLoading(false);
        return;
      }

      const params: any = {
        keyword: searchTerm || undefined,
        workerType: selectedWorkerType || undefined,
        location: location || undefined,
        availability: availability || undefined,
        qualification: (selectedQualification && selectedQualification !== 'all') ? selectedQualification : undefined,
        language: (selectedLanguage && selectedLanguage !== 'all') ? selectedLanguage : undefined,
        jobId: (selectedJobId && selectedJobId !== 'all') ? selectedJobId : undefined,
      };

      const activeCoords = userCoords || ((user as any)?.location?.coordinates?.length === 2 && ((user as any).location.coordinates[0] !== 0 || (user as any).location.coordinates[1] !== 0) ? { lat: (user as any).location.coordinates[1], lng: (user as any).location.coordinates[0] } : null);
      if (activeCoords) {
        params.lat = activeCoords.lat;
        params.lng = activeCoords.lng;
      }

      const fetchedWorkers = await apiClient.searchWorkers(params);
      setWorkers(fetchedWorkers as any[]);
    } catch (err: any) {
      setError(err.message || tHire('errorFetch'));
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch Employer's Jobs for Recommendations ON MOUNT
    if (!authLoading && user && user.role === "employer") {
      apiClient.getEmployerJobs().then((res: any) => {
        const jobList = Array.isArray(res) ? res : (res.jobs || []);
        // Filter for active jobs, sort by creation date desc (newest first)
        const activeJobs = jobList
          .filter((j: any) => j.status === 'open' || j.status === 'in-progress')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setJobs(activeJobs);

        // Auto-select the latest job if available
        if (activeJobs.length > 0) {
          setSelectedJobId(activeJobs[0]._id);
        } else {
          // If no jobs, ensure we don't select anything (will show blank/empty state)
          setSelectedJobId("");
        }
      }).catch(err => console.error("Error fetching jobs:", err));
    }
  }, [user, authLoading]) // Run once on load (dependent on user auth)

  // Separate effect to trigger fetch when filters/job changes
  useEffect(() => {
    setCurrentPage(1);
    if (!authLoading && user && user.role === "employer") {
      const timeoutId = setTimeout(() => {
        fetchWorkers();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedJobId, searchTerm, selectedWorkerType, location, availability, selectedQualification, selectedLanguage]);

  const handleWorkerTypeChange = (value: string) => {
    setSelectedWorkerType(value)
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedWorkerType("")
    setLocation("")
    setAvailability("")
    setSelectedQualification("all")
    setSelectedLanguage("all")
  }

  // Reusable Filter Content
  const renderFilterContent = () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">{tHire('workerType')}</p>
        <Select onValueChange={handleWorkerTypeChange} value={selectedWorkerType}>
          <SelectTrigger className="w-full rounded-full bg-input/50 border-border text-foreground placeholder:text-muted-foreground">
            <SelectValue placeholder={tHire('selectWorkerType')} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(workerTypeSkills).map((type) => (
              <SelectItem key={type} value={type}>
                {tWT.has(type) ? tWT(type) : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">{tHire('location')}</p>
        <Input
          placeholder={tHire('locationPlaceholder')}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground rounded-full"
        />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">{tHire.has('qualification') ? tHire('qualification') : 'Education / Qualification'}</p>
        <Select onValueChange={setSelectedQualification} value={selectedQualification}>
          <SelectTrigger className="w-full rounded-full bg-input/50 border-border text-foreground placeholder:text-muted-foreground">
            <SelectValue placeholder="All Qualifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Qualifications</SelectItem>
            {qualifications.map((q) => (
              <SelectItem key={q} value={q}>
                {tQual.has(q) ? tQual(q) : q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">{tHire.has('languages') ? tHire('languages') : 'Language Known'}</p>
        <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
          <SelectTrigger className="w-full rounded-full bg-input/50 border-border text-foreground placeholder:text-muted-foreground">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {knownLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {tLang.has(lang) ? tLang(lang) : lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">{tHire('availability')}</p>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={availability === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAvailability('available')}
            className="rounded-full flex-grow text-xs sm:text-sm"
          >
            {tHire('available')}
          </Button>
          <Button
            variant={availability === 'unavailable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAvailability('unavailable')}
            className="rounded-full flex-grow text-xs sm:text-sm"
          >
            {tHire('unavailable')}
          </Button>
          <Button
            variant={availability === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAvailability('')}
            className="rounded-full flex-grow text-xs sm:text-sm"
          >
            {tHire('any')}
          </Button>
        </div>
      </div>
      <Button onClick={handleResetFilters} variant="outline" className="w-full rounded-full mt-2">{tHire('resetFilters')}</Button>
    </div>
  );


  if (authLoading) { // Only show full-screen loader for authLoading
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      {/* Navigation */}
      <AppNavbar user={user} showBack backHref="/dashboard/employer" backText={tHire('backToDashboard')} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{tHire('title')}</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/20 border border-destructive/50 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Smart Recommendations Section */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              {tHire('smartRecommendations')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{tHire('selectJob')}</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select
                value={selectedJobId}
                onValueChange={(val) => {
                  setSelectedJobId(val);
                  // Optionally reset other filters when selecting a job to avoid confusion
                  if (val !== 'all') {
                    setSearchTerm("");
                    setSelectedWorkerType("");
                    setLocation("");
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[300px] bg-background">
                  <SelectValue placeholder={tHire('selectJobPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tHire('clearSelection')}</SelectItem>
                  {jobs.map(job => (
                    <SelectItem key={job._id} value={job._id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedJobId && selectedJobId !== 'all' && (
                <div className="text-sm text-primary font-medium animate-in fade-in slide-in-from-left-4">
                  ✨ {tHire('recommendationMode')}
                  <p className="text-xs text-muted-foreground font-normal mt-1">{tHire('recommendationDescription')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Helper message if list is blank because no job selected */}
        {!selectedJobId && !searchTerm && !selectedWorkerType && workers.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
            <p className="mb-2">Select a job above or use filters to find workers.</p>
            <p className="text-sm">Post a new job to verify your recommendations automatically.</p>
          </div>
        )}

        <div className="flex gap-2 items-center w-full mb-8">
          <Input
            placeholder={tHire('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground rounded-full flex-grow h-11"
          />

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden rounded-full h-11 w-11 shrink-0">
                <Filter className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-6">
                <SheetTitle>{tHire('filters')}</SheetTitle>
              </SheetHeader>
              {renderFilterContent()}
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <Card className="bg-card/80 border-border/50 backdrop-blur-lg sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{tHire('filters')}</h3>
                {renderFilterContent()}
              </CardContent>
            </Card>
          </div>

          {/* Workers List */}
          <div className="lg:col-span-3 space-y-6 relative min-h-[200px]">
            {loading && ( // Show circular loader when loading
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {workers.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedWorkers.map(worker => {
                    const displayCity = worker.city?.trim() || worker.locationName?.split(',')[0]?.trim() || (typeof worker.location === 'string' ? worker.location.split(',')[0]?.trim() : null) || tHire('notSpecified');
                    const distanceText = getWorkerDistanceText(worker);

                    return (
                      <Card 
                        key={worker._id} 
                        className="group flex flex-col justify-between h-full bg-card/90 hover:bg-card border-border/60 hover:border-primary/40 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <CardContent className="p-5 flex flex-col h-full justify-between gap-3.5">
                          
                          <div>
                            {/* Top Meta Bar: Status on Left, Rating on Right */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span 
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                  worker.availability === 'available' 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${worker.availability === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {worker.availability === 'available' ? (tHire('available') || 'Available') : (tHire('unavailable') || 'Unavailable')}
                              </span>

                              {worker.rating ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {worker.rating.toFixed(1)}
                                  <span className="text-[11px] text-muted-foreground font-normal">({worker.reviews?.length || 0})</span>
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">New Talent</span>
                              )}
                            </div>

                            {/* Profile Header: Avatar + Full Name (no cut off!) + Role Badge */}
                            <div className="flex items-center gap-3.5 mb-3.5">
                              <div className="relative shrink-0">
                                <img 
                                  src={worker.profilePicture || '/placeholder-user.jpg'} 
                                  alt={worker.name} 
                                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/20 shadow-sm aspect-square bg-muted" 
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <Link href={`/profile/${worker._id}`}>
                                  <h4 
                                    className="text-base sm:text-lg font-bold text-foreground capitalize leading-snug group-hover:text-primary transition-colors cursor-pointer break-words"
                                    title={worker.name}
                                  >
                                    {worker.name}
                                  </h4>
                                </Link>
                                
                                <div className="flex items-center flex-wrap gap-1 mt-1">
                                  <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">
                                    {worker.workerType?.join(', ') || tHire('noSkills')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Structured Highlight Box: Expected Pay & Location */}
                            <div className="bg-muted/40 rounded-xl p-3 border border-border/50 space-y-2 mb-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground font-medium shrink-0">Expected Pay</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm text-right whitespace-nowrap">
                                  {formatSalary(worker)}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-2 text-xs pt-1.5 border-t border-border/40">
                                <div className="flex items-center gap-1.5 text-muted-foreground min-w-0 flex-1">
                                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                  <span className="font-medium text-foreground truncate" title={displayCity}>
                                    {displayCity}
                                  </span>
                                </div>
                                {distanceText && (
                                  <span className="shrink-0 font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 text-[11px] whitespace-nowrap">
                                    {distanceText}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Attribute Chips (Experience, Qualification, Age & Gender) */}
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                              {/* Experience */}
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-background border border-border/70 text-foreground">
                                <Briefcase className="w-3 h-3 text-primary shrink-0" />
                                {worker.isFresher ? (tCommon('fresher') || 'Fresher') : worker.experience ? `${worker.experience} yrs exp` : (tHire('notSpecified') || 'Exp N/A')}
                              </span>

                              {/* Qualification */}
                              {worker.qualification && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-background border border-border/70 text-foreground">
                                  <GraduationCap className="w-3 h-3 text-primary shrink-0" />
                                  {tQual.has(worker.qualification) ? tQual(worker.qualification) : worker.qualification}
                                </span>
                              )}

                              {/* Age & Gender */}
                              {(worker.age || worker.gender) && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-background border border-border/70 text-foreground">
                                  <UserIcon className="w-3 h-3 text-muted-foreground shrink-0" />
                                  {[worker.age ? `${worker.age} ${tCommon.has('yrs') ? tCommon('yrs') : 'yrs'}` : null, worker.gender ? (tCommon.has(worker.gender.toLowerCase()) ? tCommon(worker.gender.toLowerCase()) : (worker.gender.charAt(0).toUpperCase() + worker.gender.slice(1))) : null].filter(Boolean).join(' • ')}
                                </span>
                              )}
                            </div>

                            {/* Languages Known */}
                            {worker.languages && worker.languages.length > 0 && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-0.5">
                                <Languages className="w-3.5 h-3.5 text-primary shrink-0" />
                                <div className="flex flex-wrap gap-1">
                                  {worker.languages.slice(0, 3).map((lang: string, idx: number) => (
                                    <span key={idx} className="text-[11px] px-1.5 py-0.5 bg-muted rounded font-medium text-foreground">
                                      {tLang.has(lang) ? tLang(lang) : lang}
                                    </span>
                                  ))}
                                  {worker.languages.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground font-medium">+{worker.languages.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer CTA Button */}
                          <div className="pt-3 border-t border-border/50">
                            <Link href={`/profile/${worker._id}`} className="block w-full">
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="w-full rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group-hover:shadow group-hover:bg-primary"
                              >
                                <span>{tHire('viewProfile') || 'View Profile'}</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </Link>
                          </div>

                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, workers.length)}</span> of <span className="font-medium text-foreground">{workers.length}</span> workers
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="rounded-lg h-9 px-3 gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers(currentPage, totalPages).map((p, idx) => (
                          typeof p === 'number' ? (
                            <Button
                              key={idx}
                              variant={currentPage === p ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setCurrentPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-9 h-9 p-0 rounded-lg font-medium text-xs ${
                                currentPage === p ? 'bg-primary text-primary-foreground' : 'text-foreground'
                              }`}
                            >
                              {p}
                            </Button>
                          ) : (
                            <span key={idx} className="px-1.5 text-muted-foreground text-sm">...</span>
                          )
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="rounded-lg h-9 px-3 gap-1"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-card/50 rounded-3xl border border-border/50 border-dashed">
                <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground">{tHire('noWorkers')}</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
                <Button variant="link" onClick={handleResetFilters} className="mt-4 text-primary">Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
