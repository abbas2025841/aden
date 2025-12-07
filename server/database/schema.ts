// مخطط قاعدة البيانات - Cursor الأسطوري
import { pgTable, varchar, text, timestamp, boolean, integer, json, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import * as electricitySchema from './electricity-schema';

// ===== Enums =====
export const healthFacilityTypeEnum = pgEnum('health_facility_type', ['hospital', 'clinic', 'pharmacy', 'lab']);
export const facilityStatusEnum = pgEnum('facility_status', ['operational', 'maintenance', 'closed']);
export const bloodBankStatusEnum = pgEnum('blood_bank_status', ['available', 'busy', 'closed']);
export const jobStatusEnum = pgEnum('job_status', ['active', 'inactive', 'expired']);

// ===== جداول قاعدة البيانات =====

// 1. المرافق الصحية
export const healthFacilities = pgTable('health_facilities', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull(),
  type: healthFacilityTypeEnum('type').notNull(),
  location: text('location').notNull(),
  district: varchar('district', { length: 100 }).notNull(),
  contact: varchar('contact', { length: 20 }).notNull(),
  services: json('services').$type<string[]>().notNull().default([]),
  status: facilityStatusEnum('status').notNull().default('operational'),
  workingHours: varchar('working_hours', { length: 100 }).notNull(),
  emergency: boolean('emergency').notNull().default(false),
  coordinates: json('coordinates').$type<{ lat: number; lng: number }>(),
  rating: integer('rating').default(0),
  reviews: json('reviews').$type<any[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 2. بنوك الدم
export const bloodBanks = pgTable('blood_banks', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull(),
  location: text('location').notNull(),
  district: varchar('district', { length: 100 }).notNull(),
  contact: varchar('contact', { length: 20 }).notNull(),
  bloodTypes: json('blood_types').$type<string[]>().notNull().default([]),
  status: bloodBankStatusEnum('status').notNull().default('available'),
  workingHours: varchar('working_hours', { length: 100 }).notNull(),
  capacity: integer('capacity').default(0),
  currentStock: integer('current_stock').default(0),
  // مخزون فصائل الدم المختلفة
  aPosStock: integer('a_pos_stock').default(0),
  aNegStock: integer('a_neg_stock').default(0),
  bPosStock: integer('b_pos_stock').default(0),
  bNegStock: integer('b_neg_stock').default(0),
  abPosStock: integer('ab_pos_stock').default(0),
  abNegStock: integer('ab_neg_stock').default(0),
  oPosStock: integer('o_pos_stock').default(0),
  oNegStock: integer('o_neg_stock').default(0),
  coordinates: json('coordinates').$type<{ lat: number; lng: number }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 3. الوظائف
export const jobs = pgTable('jobs', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(), // JSON string
  category: varchar('category', { length: 100 }).notNull(),
  salary: text('salary'), // JSON string
  company: varchar('company', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(),
  jobType: varchar('job_type', { length: 50 }),
  postedDate: varchar('posted_date', { length: 50 }).notNull(),
  experience: varchar('experience', { length: 50 }).notNull(),
  experienceLevel: varchar('experience_level', { length: 50 }),
  education: varchar('education', { length: 100 }),
  requirements: text('requirements').notNull(), // JSON string
  responsibilities: text('responsibilities'), // JSON string
  benefits: text('benefits'), // JSON string
  contact: text('contact'), // JSON string
  isFeatured: boolean('is_featured').default(false),
  featured: boolean('featured'),
  isUrgent: boolean('is_urgent').default(false),
  isRemote: boolean('is_remote').default(false),
  isActive: boolean('is_active').default(true),
  views: integer('views').default(0),
  applicants: integer('applicants').default(0),
  tags: text('tags'), // JSON string
  rating: integer('rating'),
  workingHours: varchar('working_hours', { length: 100 }),
  gender: varchar('gender', { length: 50 }),
  ageRange: text('age_range'), // JSON string
  languages: text('languages'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 4. حالة الكهرباء
export const electricityStatus = pgTable('electricity_status', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  totalCustomers: integer('total_customers').notNull().default(0),
  totalCapacity: integer('total_capacity').notNull().default(0), // MW
  currentLoad: integer('current_load').notNull().default(0), // MW
  loadPercentage: integer('load_percentage').notNull().default(0),
  outages: json('outages').$type<any[]>().default([]),
  plannedMaintenance: json('planned_maintenance').$type<any[]>().default([]),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 5. أسعار العملات
export const currencyRates = pgTable('currency_rates', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  currency: varchar('currency', { length: 10 }).notNull(), // USD, SAR, AED
  name: varchar('name', { length: 100 }).notNull(),
  buy: integer('buy').notNull(), // بالريال اليمني
  sell: integer('sell').notNull(), // بالريال اليمني
  change: integer('change').default(0), // التغيير
  source: varchar('source', { length: 100 }).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 6. إحصائيات النظام
export const systemStats = pgTable('system_stats', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  totalUsers: integer('total_users').default(0),
  activeUsers: integer('active_users').default(0),
  totalJobs: integer('total_jobs').default(0),
  activeJobs: integer('active_jobs').default(0),
  totalFacilities: integer('total_facilities').default(0),
  operationalFacilities: integer('operational_facilities').default(0),
  systemUptime: varchar('system_uptime', { length: 10 }).default('99.9%'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 7. المستخدمين
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  location: varchar('location', { length: 100 }),
  preferences: json('preferences').$type<any>().default({}),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 8. الحجوزات
export const appointments = pgTable('appointments', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  facilityId: varchar('facility_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  patientName: varchar('patient_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  appointmentDate: timestamp('appointment_date').notNull(),
  appointmentTime: varchar('appointment_time', { length: 10 }).notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // pending, confirmed, cancelled, completed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 9. طلبات الدم
export const bloodRequests = pgTable('blood_requests', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  bloodBankId: varchar('blood_bank_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  patientName: varchar('patient_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  bloodType: varchar('blood_type', { length: 10 }).notNull(),
  quantity: integer('quantity').notNull(),
  urgency: varchar('urgency', { length: 20 }).notNull(), // low, medium, high
  reason: text('reason').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected, fulfilled
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 10. طلبات الوظائف
export const jobApplications = pgTable('job_applications', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  jobId: varchar('job_id', { length: 255 }).notNull(),
  applicantName: varchar('applicant_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  resume: text('resume').notNull(),
  coverLetter: text('cover_letter'),
  experience: text('experience'),
  education: text('education'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, reviewed, accepted, rejected
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ===== العلاقات =====
// يمكن إضافة العلاقات هنا باستخدام Drizzle Relations

// ===== Types =====
export type HealthFacility = typeof healthFacilities.$inferSelect;
export type NewHealthFacility = typeof healthFacilities.$inferInsert;

export type BloodBank = typeof bloodBanks.$inferSelect;
export type NewBloodBank = typeof bloodBanks.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type ElectricityStatus = typeof electricityStatus.$inferSelect;
export type NewElectricityStatus = typeof electricityStatus.$inferInsert;

export type CurrencyRate = typeof currencyRates.$inferSelect;
export type NewCurrencyRate = typeof currencyRates.$inferInsert;

export type SystemStats = typeof systemStats.$inferSelect;
export type NewSystemStats = typeof systemStats.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export type BloodRequest = typeof bloodRequests.$inferSelect;
export type NewBloodRequest = typeof bloodRequests.$inferInsert;

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

// تصدير مخطط الكهرباء
export * from './electricity-schema';
