import { prisma } from '@/lib/prisma'
import { Users, Briefcase, FileText, Building2, Activity } from 'lucide-react'
import Link from 'next/link'
import { AnalyticsCharts } from './components/AnalyticsCharts'

export const dynamic = 'force-dynamic'

function getPast7Days() {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
  }
  return dates
}

export default async function AdminDashboardPage() {
  const [totalApplicants, totalRecruiters, totalJobs, totalApplications, recentUsers, recentJobs] = await Promise.all([
    prisma.user.count({ where: { role: 'APPLICANT' } }),
    prisma.user.count({ where: { role: 'RECRUITER' } }),
    prisma.job.count(),
    prisma.application.count(),
    
    // Fetch users created in the last 7 days
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      select: { role: true, createdAt: true }
    }),
    
    // Fetch jobs created in the last 7 days
    prisma.job.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      select: { createdAt: true }
    })
  ])

  // Process User Data for Chart
  const days = getPast7Days()
  const userGrowthData = days.map(day => ({
    date: day,
    applicants: recentUsers.filter(u => u.role === 'APPLICANT' && new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) === day).length,
    recruiters: recentUsers.filter(u => u.role === 'RECRUITER' && new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) === day).length,
  }))

  // Process Job Data for Chart
  const jobActivityData = days.map(day => ({
    date: day,
    jobs: recentJobs.filter(j => new Date(j.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) === day).length,
  }))

  const stats = [
    { name: 'Total Applicants', value: totalApplicants, icon: Users, color: 'blue', href: '/admin/dashboard/applicants' },
    { name: 'Total Recruiters', value: totalRecruiters, icon: Building2, color: 'purple', href: '/admin/dashboard/recruiters' },
    { name: 'Total Job Postings', value: totalJobs, icon: Briefcase, color: 'amber', href: '/admin/dashboard/jobs' },
    { name: 'Total Applications', value: totalApplications, icon: FileText, color: 'emerald', href: '#' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Platform Overview</h1>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">Real-time metrics for your AI Hiring Assistance platform.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full">
          <Activity size={14} className="animate-pulse" />
          System Normal
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        {stats.map((stat, i) => {
          const CardContent = (
            <div 
              className={`stat-card ${stat.color} hover:-translate-y-1 transition-all duration-300`}
              style={{ animationDelay: `${i * 100}ms`, height: '100%', cursor: stat.href !== '#' ? 'pointer' : 'default' }}
            >
              <div className={`stat-icon ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              
              <div>
                <div className="stat-value">{stat.value.toLocaleString()}</div>
                <div className="stat-label">{stat.name}</div>
              </div>
            </div>
          )

          if (stat.href !== '#') {
            return (
              <Link href={stat.href} key={stat.name} style={{ textDecoration: 'none' }}>
                {CardContent}
              </Link>
            )
          }

          return <div key={stat.name}>{CardContent}</div>
        })}
      </div>

      {/* Render the Analytics Charts */}
      <AnalyticsCharts userGrowthData={userGrowthData} jobActivityData={jobActivityData} />

    </div>
  )
}
