import { prisma } from '@/lib/prisma'
import { BarChart3 } from 'lucide-react'
import { ComparisonCharts } from '../components/ComparisonCharts'

export const dynamic = 'force-dynamic'

function getDayName(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export default async function ReviewPage() {
  const today = new Date()
  const fourteenDaysAgo = new Date(today)
  fourteenDaysAgo.setDate(today.getDate() - 14)

  const recentUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: fourteenDaysAgo
      }
    },
    select: { role: true, createdAt: true }
  })

  const applicantData: { dayName: string; last7Days: number; last14Days: number }[] = []
  const recruiterData: { dayName: string; last7Days: number; last14Days: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const currentDay = new Date(today)
    currentDay.setDate(today.getDate() - i)
    
    const previousDay = new Date(currentDay)
    previousDay.setDate(currentDay.getDate() - 7)

    const dayNameStr = getDayName(currentDay)

    const isSameDate = (d1: Date, d2: Date) => 
      d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()

    const applicantsLast7 = recentUsers.filter(u => u.role === 'APPLICANT' && isSameDate(new Date(u.createdAt), currentDay)).length
    const applicantsPrev7 = recentUsers.filter(u => u.role === 'APPLICANT' && isSameDate(new Date(u.createdAt), previousDay)).length
    
    applicantData.push({
      dayName: dayNameStr,
      last7Days: applicantsLast7,
      last14Days: applicantsPrev7
    })

    const recruitersLast7 = recentUsers.filter(u => u.role === 'RECRUITER' && isSameDate(new Date(u.createdAt), currentDay)).length
    const recruitersPrev7 = recentUsers.filter(u => u.role === 'RECRUITER' && isSameDate(new Date(u.createdAt), previousDay)).length
    
    recruiterData.push({
      dayName: dayNameStr,
      last7Days: recruitersLast7,
      last14Days: recruitersPrev7
    })
  }

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
            Compare user registration metrics between the last 7 days and the last 14 days.
          </p>
        </div>
      </div>

      <ComparisonCharts applicantData={applicantData} recruiterData={recruiterData} />
    </div>
  )
}
