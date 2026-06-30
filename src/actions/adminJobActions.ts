'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteJob(jobId: string) {
  try {
    const job = await prisma.job.delete({
      where: { id: jobId }
    })
    
    await prisma.auditLog.create({
      data: {
        action: 'JOB_DELETED',
        details: `Job "${job.title}" (${job.id}) was permanently deleted by admin.`,
        adminId: 'ADMIN',
      }
    })

    revalidatePath('/dashboard/admin/jobs')
    revalidatePath('/dashboard/admin')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting job:', error)
    return { error: 'Failed to delete job' }
  }
}

export async function toggleJobStatus(jobId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN'
    
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus as 'OPEN' | 'CLOSED' }
    })
    
    await prisma.auditLog.create({
      data: {
        action: 'JOB_STATUS_CHANGED',
        details: `Job "${job.title}" status was changed to ${newStatus} by admin.`,
        adminId: 'ADMIN',
      }
    })

    revalidatePath('/dashboard/admin/jobs')
    revalidatePath('/dashboard/admin')
    
    return { success: true }
  } catch (error) {
    console.error('Error toggling job status:', error)
    return { error: 'Failed to update job status' }
  }
}
