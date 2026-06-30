'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleUserBlockStatus(userId: string, currentStatus: boolean) {
  try {
    const newStatus = !currentStatus
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: newStatus },
    })
    
    await prisma.auditLog.create({
      data: {
        action: newStatus ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
        details: `User ${user.email} was ${newStatus ? 'blocked' : 'unblocked'} by admin.`,
        adminId: 'ADMIN',
      }
    })

    revalidatePath('/admin/dashboard/applicants')
    revalidatePath('/admin/dashboard/recruiters')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle block status:', error)
    return { error: 'Failed to update user status' }
  }
}
