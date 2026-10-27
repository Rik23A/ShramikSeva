import React from "react"
import { Link } from "@/navigation"
import { Card } from "@/components/ui/card"
import { MapPin, Briefcase } from "lucide-react"
import { useTranslations } from "next-intl"

interface AssignedJobCardProps {
  job: any // Define a more specific type for job if possible
}

export const AssignedJobCard: React.FC<AssignedJobCardProps> = ({ job }) => {
  const t = useTranslations("Jobs");
  const tCommon = useTranslations("Common");

  return (
    <Link href={`/dashboard/worker/assigned-jobs/${job._id}`} className="block">
      <Card className="p-4 bg-card border border-border/70 dark:border-border rounded-xl hover:bg-muted/40 transition-all hover:shadow-md cursor-pointer hover:border-primary/40">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-foreground">{job.title}</h3>
          <div
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              job.workType === "temporary"
                ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 dark:border-purple-500/40"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 dark:border-blue-500/40"
            }`}
          >
            {job.workType && t.has(`workType.${job.workType.toLowerCase()}`)
              ? t(`workType.${job.workType.toLowerCase()}`)
              : (job.workType || "Job")}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{job.employer?.companyName || job.employer?.name || tCommon('companyFallback')}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location?.address ? job.location.address.split(',')[0].trim() : t('location')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{job.minExperience !== undefined && job.maxExperience !== undefined ? (
              job.minExperience === 0 && job.maxExperience === 0 ? (
                t('experience.na')
              ) : job.minExperience === 0 ? (
                t('experience.upTo', { max: job.maxExperience })
              ) : job.maxExperience === 0 ? (
                t('experience.from', { min: job.minExperience })
              ) : (
                t('experience.range', { min: job.minExperience, max: job.maxExperience })
              )
            ) : (
              t('experience.na')
            )}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-primary">
              ₹{job.salary.toLocaleString('en-IN')}<span className="text-[10px] text-muted-foreground font-medium ml-1">/ {job.workType === 'permanent' ? 'month' : 'day'}</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
