import { prisma } from '@/lib/prisma'
import { BarChart3 } from 'lucide-react'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)
  const fourteenDaysAgo = new Date(today)
  fourteenDaysAgo.setDate(today.getDate() - 14)

  // --- Registration data (last 14 days) ---
  const recentUsers = await prisma.user.findMany({
    where: { createdAt: { gte: fourteenDaysAgo } },
    select: { role: true, createdAt: true }
  })

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()

  const applicantData: { dayName: string; last7Days: number; last14Days: number }[] = []
  const recruiterData: { dayName: string; last7Days: number; last14Days: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const currentDay = new Date(today)
    currentDay.setDate(today.getDate() - i)
    const previousDay = new Date(currentDay)
    previousDay.setDate(currentDay.getDate() - 7)
    const dayLabel = `Day ${7 - i}`

    applicantData.push({
      dayName: dayLabel,
      last7Days: recentUsers.filter(u => u.role === 'APPLICANT' && isSameDate(new Date(u.createdAt), currentDay)).length,
      last14Days: recentUsers.filter(u => u.role === 'APPLICANT' && isSameDate(new Date(u.createdAt), previousDay)).length,
    })
    recruiterData.push({
      dayName: dayLabel,
      last7Days: recentUsers.filter(u => u.role === 'RECRUITER' && isSameDate(new Date(u.createdAt), currentDay)).length,
      last14Days: recentUsers.filter(u => u.role === 'RECRUITER' && isSameDate(new Date(u.createdAt), previousDay)).length,
    })
  }

  // --- Total counts ---
  const totalApplicants = await prisma.user.count({ where: { role: 'APPLICANT' } })
  const totalRecruiters = await prisma.user.count({ where: { role: 'RECRUITER' } })
  const totalJobs = await prisma.job.count()
  const totalApplications = await prisma.application.count()

  // --- Job status distribution ---
  const openJobs = await prisma.job.count({ where: { status: 'OPEN' } })
  const closedJobs = await prisma.job.count({ where: { status: 'CLOSED' } })
  const draftJobs = await prisma.job.count({ where: { status: 'DRAFT' } })

  const jobStatusData = [
    { name: 'Open', value: openJobs, color: '#10b981' },
    { name: 'Closed', value: closedJobs, color: '#ef4444' },
    { name: 'Draft', value: draftJobs, color: '#94a3b8' },
  ].filter(d => d.value > 0)

  // --- Application status distribution ---
  const pendingApps = await prisma.application.count({ where: { status: 'PENDING' } })
  const reviewingApps = await prisma.application.count({ where: { status: 'REVIEWING' } })
  const shortlistedApps = await prisma.application.count({ where: { status: 'SHORTLISTED' } })
  const hiredApps = await prisma.application.count({ where: { status: 'HIRED' } })
  const rejectedApps = await prisma.application.count({ where: { status: 'REJECTED' } })

  const appStatusData = [
    { name: 'Pending', value: pendingApps, color: '#f59e0b' },
    { name: 'Reviewing', value: reviewingApps, color: '#3b82f6' },
    { name: 'Shortlisted', value: shortlistedApps, color: '#8b5cf6' },
    { name: 'Hired', value: hiredApps, color: '#10b981' },
    { name: 'Rejected', value: rejectedApps, color: '#ef4444' },
  ].filter(d => d.value > 0)

  // --- AI Classification distribution ---
  const matchingApps = await prisma.application.count({ where: { aiClassification: 'MATCHING' } })
  const nearBoundApps = await prisma.application.count({ where: { aiClassification: 'NEAR_BOUND' } })
  const notMatchingApps = await prisma.application.count({ where: { aiClassification: 'NOT_MATCHING' } })
  const pendingReviewApps = await prisma.application.count({ where: { aiClassification: 'PENDING_REVIEW' } })

  const aiClassData = [
    { name: 'Matching', value: matchingApps, color: '#10b981' },
    { name: 'Near Bound', value: nearBoundApps, color: '#f59e0b' },
    { name: 'Not Matching', value: notMatchingApps, color: '#ef4444' },
    { name: 'Pending Review', value: pendingReviewApps, color: '#94a3b8' },
  ].filter(d => d.value > 0)

  // --- Location type breakdown ---
  const remoteJobs = await prisma.job.count({ where: { locationType: 'REMOTE' } })
  const onsiteJobs = await prisma.job.count({ where: { locationType: 'ONSITE' } })
  const hybridJobs = await prisma.job.count({ where: { locationType: 'HYBRID' } })

  const locationTypeData = [
    { name: 'Remote', value: remoteJobs, color: '#3b82f6' },
    { name: 'On-site', value: onsiteJobs, color: '#f59e0b' },
    { name: 'Hybrid', value: hybridJobs, color: '#8b5cf6' },
  ].filter(d => d.value > 0)

  // --- New registrations this week vs last week ---
  const newApplicantsThisWeek = recentUsers.filter(u => u.role === 'APPLICANT' && new Date(u.createdAt) >= sevenDaysAgo).length
  const newApplicantsLastWeek = recentUsers.filter(u => u.role === 'APPLICANT' && new Date(u.createdAt) < sevenDaysAgo).length
  const newRecruitersThisWeek = recentUsers.filter(u => u.role === 'RECRUITER' && new Date(u.createdAt) >= sevenDaysAgo).length
  const newRecruitersLastWeek = recentUsers.filter(u => u.role === 'RECRUITER' && new Date(u.createdAt) < sevenDaysAgo).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: 'var(--space-2)', background: 'rgba(236, 72, 153, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <BarChart3 color="#ec4899" size={24} />
            </div>
            Review Analytics
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            Platform overview with registration trends, job stats, and AI screening insights.
          </p>
        </div>
      </div>

      <AnalyticsDashboard
        applicantData={applicantData}
        recruiterData={recruiterData}
        totals={{ totalApplicants, totalRecruiters, totalJobs, totalApplications }}
        weeklyChanges={{
          applicantsThisWeek: newApplicantsThisWeek,
          applicantsLastWeek: newApplicantsLastWeek,
          recruitersThisWeek: newRecruitersThisWeek,
          recruitersLastWeek: newRecruitersLastWeek,
        }}
        jobStatusData={jobStatusData}
        appStatusData={appStatusData}
        aiClassData={aiClassData}
        locationTypeData={locationTypeData}
      />
    </div>
  )
}
