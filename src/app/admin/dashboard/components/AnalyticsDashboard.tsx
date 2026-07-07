'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
} from 'recharts'
import { Users, Briefcase, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react'

type ChartDataItem = { name: string; value: number; color: string }

type AnalyticsDashboardProps = {
  applicantData: { dayName: string; last7Days: number; last14Days: number }[]
  recruiterData: { dayName: string; last7Days: number; last14Days: number }[]
  totals: { totalApplicants: number; totalRecruiters: number; totalJobs: number; totalApplications: number }
  weeklyChanges: {
    applicantsThisWeek: number; applicantsLastWeek: number
    recruitersThisWeek: number; recruitersLastWeek: number
  }
  jobStatusData: ChartDataItem[]
  appStatusData: ChartDataItem[]
  aiClassData: ChartDataItem[]
  locationTypeData: ChartDataItem[]
}

function getChangePercent(current: number, previous: number): { value: string; direction: 'up' | 'down' | 'same' } {
  if (previous === 0 && current === 0) return { value: '0%', direction: 'same' }
  if (previous === 0) return { value: '+100%', direction: 'up' }
  const change = ((current - previous) / previous) * 100
  if (change === 0) return { value: '0%', direction: 'same' }
  return {
    value: `${change > 0 ? '+' : ''}${Math.round(change)}%`,
    direction: change > 0 ? 'up' : 'down',
  }
}

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: any; label: string; value: number; change: { value: string; direction: 'up' | 'down' | 'same' }; color: string
}) {
  return (
    <div className="card" style={{ padding: 'var(--space-5)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-8px', right: '-8px', width: '64px', height: '64px',
        borderRadius: '50%', background: `${color}12`, opacity: 0.6,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
          background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {value.toLocaleString()}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: 'var(--text-xs)', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
          background: change.direction === 'up' ? 'rgba(16, 185, 129, 0.12)' : change.direction === 'down' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(148, 163, 184, 0.12)',
          color: change.direction === 'up' ? '#10b981' : change.direction === 'down' ? '#ef4444' : '#94a3b8',
        }}>
          {change.direction === 'up' ? <TrendingUp size={12} /> : change.direction === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
          {change.value}
        </span>
      </div>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
        vs last week
      </span>
    </div>
  )
}

function DonutChart({ data, title, centerLabel }: { data: ChartDataItem[]; title: string; centerLabel?: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-5)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>{title}</h3>
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 'var(--space-5)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ width: '160px', height: '160px', position: 'relative', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '12px',
                }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
                formatter={(value: number) => [`${value} (${Math.round((value / total) * 100)}%)`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {total}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {centerLabel || 'Total'}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {data.map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0,
              }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', flex: 1 }}>
                {item.name}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {item.value}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', minWidth: '32px', textAlign: 'right' }}>
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)', fontSize: '12px' },
  itemStyle: { color: 'var(--color-text-primary)' },
}

export function AnalyticsDashboard({
  applicantData,
  recruiterData,
  totals,
  weeklyChanges,
  jobStatusData,
  appStatusData,
  aiClassData,
  locationTypeData,
}: AnalyticsDashboardProps) {
  const applicantChange = getChangePercent(weeklyChanges.applicantsThisWeek, weeklyChanges.applicantsLastWeek)
  const recruiterChange = getChangePercent(weeklyChanges.recruitersThisWeek, weeklyChanges.recruitersLastWeek)

  // Combined registration area chart data
  const combinedData = applicantData.map((d, i) => ({
    day: d.dayName,
    applicants: d.last7Days,
    recruiters: recruiterData[i].last7Days,
    total: d.last7Days + recruiterData[i].last7Days,
  }))

  // Cumulative growth line chart data
  const cumulativeData = applicantData.reduce<{ day: string; applicants: number; recruiters: number }[]>((acc, d, i) => {
    const prev = acc[i - 1] || { applicants: 0, recruiters: 0 }
    acc.push({
      day: d.dayName,
      applicants: prev.applicants + d.last7Days,
      recruiters: prev.recruiters + recruiterData[i].last7Days,
    })
    return acc
  }, [])

  // Radar chart data for application status
  const radarData = appStatusData.map(d => ({
    subject: d.name,
    count: d.value,
    fullMark: Math.max(...appStatusData.map(x => x.value), 1),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-6)', overflow: 'hidden' }}>

      {/* ─── Stat Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <StatCard icon={Users} label="Total Applicants" value={totals.totalApplicants} change={applicantChange} color="#3b82f6" />
        <StatCard icon={Users} label="Total Recruiters" value={totals.totalRecruiters} change={recruiterChange} color="#a855f7" />
        <StatCard icon={Briefcase} label="Total Jobs" value={totals.totalJobs} change={{ value: '-', direction: 'same' }} color="#f59e0b" />
        <StatCard icon={FileText} label="Total Applications" value={totals.totalApplications} change={{ value: '-', direction: 'same' }} color="#10b981" />
      </div>

      {/* ─── Registration Trends (Area Chart) ─── */}
      <div className="card" style={{ padding: 'var(--space-6)', overflow: 'hidden', minWidth: 0 }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Registration Trend (Last 7 Days)
        </h3>
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="gradApplicants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRecruiters" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ paddingTop: '12px' }} />
              <Area type="monotone" dataKey="applicants" name="Applicants" stroke="#3b82f6" strokeWidth={2} fill="url(#gradApplicants)" dot={{ r: 4, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="recruiters" name="Recruiters" stroke="#a855f7" strokeWidth={2} fill="url(#gradRecruiters)" dot={{ r: 4, fill: '#a855f7' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── NEW: Cumulative Growth Line Chart ─── */}
      <div className="card" style={{ padding: 'var(--space-6)', overflow: 'hidden', minWidth: 0 }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Cumulative Growth (Last 7 Days)
        </h3>
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ paddingTop: '12px' }} />
              <Line type="monotone" dataKey="applicants" name="Applicants (Cumulative)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="recruiters" name="Recruiters (Cumulative)" stroke="#a855f7" strokeWidth={3} dot={{ r: 5, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── NEW: Combined Stacked Bar + Line (Composed Chart) ─── */}
      <div className="card" style={{ padding: 'var(--space-6)', overflow: 'hidden', minWidth: 0 }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          Daily Registrations Breakdown
        </h3>
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ paddingTop: '12px' }} />
              <Bar dataKey="applicants" name="Applicants" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={28} />
              <Bar dataKey="recruiters" name="Recruiters" stackId="a" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={28} />
              <Line type="monotone" dataKey="total" name="Total" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Donut Charts + Radar Chart Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        <DonutChart data={jobStatusData} title="Job Status Distribution" centerLabel="Jobs" />
        <DonutChart data={appStatusData} title="Application Status" centerLabel="Apps" />
        <DonutChart data={aiClassData} title="AI Classification" centerLabel="Screened" />
        <DonutChart data={locationTypeData} title="Job Location Types" centerLabel="Jobs" />
      </div>

      {/* ─── NEW: Radar Chart for Application Status ─── */}
      {radarData.length > 0 && (
        <div className="card" style={{ padding: 'var(--space-6)', overflow: 'hidden', minWidth: 0 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            Application Status Radar
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--color-text-secondary)" fontSize={12} />
                <PolarRadiusAxis stroke="var(--color-text-muted)" fontSize={10} />
                <Radar name="Applications" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip {...tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
