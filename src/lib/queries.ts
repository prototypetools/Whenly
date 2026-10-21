/**
 * Query yang selalu ter-scope ke pengguna (isolasi data antar akun).
 * Setiap fungsi di sini WAJIB menerima userId dari sesi server.
 */

import { prisma } from './db';
import { ApiError } from './api';
import type { Subscription, Payment, Budget, ReminderSetting, Category, User } from '@prisma/client';

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: [{ status: 'asc' }, { nextRenewalDate: 'asc' }],
  });
}

export async function getSubscriptionForUser(userId: string, id: string): Promise<Subscription> {
  const sub = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!sub) {
    // 404 (bukan 403) supaya keberadaan data pengguna lain tidak terungkap.
    throw new ApiError(404, 'SUBSCRIPTION_NOT_FOUND', 'Langganan tidak ditemukan.');
  }
  return sub;
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  return prisma.payment.findMany({ where: { userId }, orderBy: { paidAt: 'desc' } });
}

export async function getRecentPayments(userId: string, take = 100): Promise<Payment[]> {
  return prisma.payment.findMany({ where: { userId }, orderBy: { paidAt: 'desc' }, take });
}

export async function getUserCategories(userId: string): Promise<Category[]> {
  return prisma.category.findMany({
    where: { OR: [{ userId }, { isSystem: true }] },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function getCustomCategories(userId: string): Promise<Category[]> {
  return prisma.category.findMany({ where: { userId }, orderBy: { sortOrder: 'asc' } });
}

export async function getBudget(userId: string): Promise<Budget | null> {
  return prisma.budget.findUnique({ where: { userId } });
}

/** Mengambil pengaturan pengingat, membuat default bila belum ada. */
export async function getReminderSettings(userId: string): Promise<ReminderSetting> {
  const existing = await prisma.reminderSetting.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.reminderSetting.create({ data: { userId, defaultDaysBefore: 3, inAppEnabled: true } });
}

export async function getUserById(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
  return user;
}

export async function getStudentVerification(userId: string) {
  return prisma.studentVerification.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLatestStudentVerification(userId: string) {
  return getStudentVerification(userId);
}
