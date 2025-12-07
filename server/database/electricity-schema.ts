// مخطط قاعدة بيانات الكهرباء - Cursor الأسطوري
import { pgTable, serial, text, timestamp, integer, boolean, json, varchar, decimal } from 'drizzle-orm/pg-core';

// جدول البلاغات
export const electricityReports = pgTable('electricity_reports', {
  id: serial('id').primaryKey(),
  reportId: varchar('report_id', { length: 32 }).notNull().unique(),
  district: varchar('district', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'on', 'off', 'partial', 'unknown'
  userAgent: text('user_agent'),
  deviceFingerprint: varchar('device_fingerprint', { length: 64 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  location: json('location'), // { lat: number, lng: number }
  reportHash: varchar('report_hash', { length: 64 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  isVerified: boolean('is_verified').default(false),
  verificationCount: integer('verification_count').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// جدول التأكيدات الجماعية
export const collectiveConfirmations = pgTable('collective_confirmations', {
  id: serial('id').primaryKey(),
  district: varchar('district', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  confirmationHash: varchar('confirmation_hash', { length: 64 }).notNull(),
  reportCount: integer('report_count').notNull(),
  uniqueUsers: integer('unique_users').notNull(),
  timeWindow: integer('time_window').notNull(), // في الثواني
  isActive: boolean('is_active').default(true),
  confirmedAt: timestamp('confirmed_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// جدول المستخدمين الفريدين
export const uniqueUsers = pgTable('unique_users', {
  id: serial('id').primaryKey(),
  deviceFingerprint: varchar('device_fingerprint', { length: 64 }).notNull().unique(),
  firstReport: timestamp('first_report').defaultNow().notNull(),
  lastReport: timestamp('last_report').defaultNow().notNull(),
  totalReports: integer('total_reports').default(1),
  isBlocked: boolean('is_blocked').default(false),
  blockReason: text('block_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// جدول إحصائيات البلاغات
export const reportStatistics = pgTable('report_statistics', {
  id: serial('id').primaryKey(),
  district: varchar('district', { length: 100 }).notNull(),
  date: timestamp('date').notNull(),
  totalReports: integer('total_reports').default(0),
  onReports: integer('on_reports').default(0),
  offReports: integer('off_reports').default(0),
  partialReports: integer('partial_reports').default(0),
  unknownReports: integer('unknown_reports').default(0),
  uniqueUsers: integer('unique_users').default(0),
  confirmations: integer('confirmations').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// جدول سجل الأنشطة
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 50 }).notNull(), // 'report', 'confirmation', 'block', 'unblock'
  district: varchar('district', { length: 100 }),
  status: varchar('status', { length: 20 }),
  deviceFingerprint: varchar('device_fingerprint', { length: 64 }),
  details: json('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

// أنواع البيانات
export type ElectricityReport = typeof electricityReports.$inferSelect;
export type NewElectricityReport = typeof electricityReports.$inferInsert;
export type CollectiveConfirmation = typeof collectiveConfirmations.$inferSelect;
export type NewCollectiveConfirmation = typeof collectiveConfirmations.$inferInsert;
export type UniqueUser = typeof uniqueUsers.$inferSelect;
export type NewUniqueUser = typeof uniqueUsers.$inferInsert;
export type ReportStatistics = typeof reportStatistics.$inferSelect;
export type NewReportStatistics = typeof reportStatistics.$inferInsert;
export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;
