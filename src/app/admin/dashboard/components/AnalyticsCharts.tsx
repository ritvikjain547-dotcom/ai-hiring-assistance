'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

type AnalyticsChartsProps = {
  userGrowthData: any[]
  jobActivityData: any[]
}

export function AnalyticsCharts({ userGrowthData, jobActivityData }: AnalyticsChartsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
      
      {/* User Growth Chart */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>User Growth (Last 7 Days)</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="applicants" name="Applicants" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recruiters" name="Recruiters" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Job Activity Chart */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Job Postings (Last 7 Days)</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={jobActivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)' }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="jobs" name="New Jobs" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
