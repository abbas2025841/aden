// تكامل PostgreSQL - Cursor الأسطوري
import { Pool, PoolClient } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, or, desc, asc } from 'drizzle-orm';
import * as schema from './schema';

// إعداد اتصال PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/adenlive',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// إنشاء Drizzle instance
export const db = drizzle(pool, { schema });

// ===== دوال قاعدة البيانات =====

// 1. المرافق الصحية
export async function getHealthFacilities(filters?: {
  type?: string;
  district?: string;
  status?: string;
}) {
  try {
    let query = db.select().from(schema.healthFacilities);
    
    if (filters?.type) {
      query = query.where(eq(schema.healthFacilities.type, filters.type));
    }
    
    if (filters?.district) {
      query = query.where(eq(schema.healthFacilities.district, filters.district));
    }
    
    if (filters?.status) {
      query = query.where(eq(schema.healthFacilities.status, filters.status));
    }
    
    const facilities = await query.orderBy(asc(schema.healthFacilities.name));
    return { success: true, data: facilities };
  } catch (error) {
    console.error('خطأ في جلب المرافق الصحية:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

export async function createHealthFacility(facility: typeof schema.healthFacilities.$inferInsert) {
  try {
    const [newFacility] = await db.insert(schema.healthFacilities).values(facility).returning();
    return { success: true, data: newFacility };
  } catch (error) {
    console.error('خطأ في إنشاء مرفق صحي:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// 2. بنوك الدم
export async function getBloodBanks(filters?: {
  status?: string;
  bloodType?: string;
}) {
  try {
    let query = db.select().from(schema.bloodBanks);
    
    if (filters?.status) {
      query = query.where(eq(schema.bloodBanks.status, filters.status));
    }
    
    const banks = await query.orderBy(asc(schema.bloodBanks.name));
    return { success: true, data: banks };
  } catch (error) {
    console.error('خطأ في جلب بنوك الدم:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

export async function updateBloodStock(bankId: string, bloodType: string, quantity: number) {
  try {
    const [updated] = await db
      .update(schema.bloodBanks)
      .set({ 
        [`${bloodType.toLowerCase().replace('+', '_pos').replace('-', '_neg')}_stock`]: quantity,
        updatedAt: new Date()
      })
      .where(eq(schema.bloodBanks.id, bankId))
      .returning();
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('خطأ في تحديث مخزون الدم:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// 3. الوظائف
export async function getJobs(filters?: {
  category?: string;
  location?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    let query = db.select().from(schema.jobs);
    
    if (filters?.category) {
      query = query.where(eq(schema.jobs.category, filters.category));
    }
    
    if (filters?.location) {
      query = query.where(eq(schema.jobs.location, filters.location));
    }
    
    if (filters?.status) {
      query = query.where(eq(schema.jobs.status, filters.status));
    }
    
    if (filters?.search) {
      query = query.where(
        or(
          eq(schema.jobs.title, filters.search),
          eq(schema.jobs.company, filters.search),
          eq(schema.jobs.description, filters.search)
        )
      );
    }
    
    const total = await db.select({ count: schema.jobs.id }).from(schema.jobs);
    
    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query = query.limit(filters.limit).offset(offset);
    }
    
    const jobs = await query.orderBy(desc(schema.jobs.postedAt));
    
    return {
      success: true,
      data: jobs,
      total: total.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10
    };
  } catch (error) {
    console.error('خطأ في جلب الوظائف:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

export async function createJob(job: typeof schema.jobs.$inferInsert) {
  try {
    const [newJob] = await db.insert(schema.jobs).values(job).returning();
    return { success: true, data: newJob };
  } catch (error) {
    console.error('خطأ في إنشاء وظيفة:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// 4. حالة الكهرباء
export async function getElectricityStatus() {
  try {
    const [status] = await db.select().from(schema.electricityStatus).limit(1);
    return { success: true, data: status };
  } catch (error) {
    console.error('خطأ في جلب حالة الكهرباء:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

export async function updateElectricityStatus(status: typeof schema.electricityStatus.$inferInsert) {
  try {
    const [updated] = await db
      .update(schema.electricityStatus)
      .set({ ...status, updatedAt: new Date() })
      .returning();
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('خطأ في تحديث حالة الكهرباء:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// 5. أسعار العملات
export async function getCurrencyRates() {
  try {
    const rates = await db.select().from(schema.currencyRates).orderBy(asc(schema.currencyRates.currency));
    return { success: true, data: rates };
  } catch (error) {
    console.error('خطأ في جلب أسعار العملات:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

export async function updateCurrencyRates(rates: typeof schema.currencyRates.$inferInsert[]) {
  try {
    // حذف الأسعار القديمة
    await db.delete(schema.currencyRates);
    
    // إدراج الأسعار الجديدة
    const newRates = await db.insert(schema.currencyRates).values(rates).returning();
    
    return { success: true, data: newRates };
  } catch (error) {
    console.error('خطأ في تحديث أسعار العملات:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// 6. إحصائيات النظام
export async function getSystemStats() {
  try {
    const [stats] = await db.select().from(schema.systemStats).limit(1);
    return { success: true, data: stats };
  } catch (error) {
    console.error('خطأ في جلب إحصائيات النظام:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// ===== دوال الصيانة =====

// فحص اتصال قاعدة البيانات
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('خطأ في اتصال قاعدة البيانات:', error);
    return false;
  }
}

// إعادة تهيئة قاعدة البيانات
export async function initializeDatabase() {
  try {
    // إنشاء الجداول إذا لم تكن موجودة
    await db.execute(`
      CREATE TABLE IF NOT EXISTS health_facilities (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        location VARCHAR NOT NULL,
        district VARCHAR NOT NULL,
        contact VARCHAR NOT NULL,
        services TEXT[],
        status VARCHAR NOT NULL,
        working_hours VARCHAR NOT NULL,
        emergency BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS blood_banks (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        location VARCHAR NOT NULL,
        contact VARCHAR NOT NULL,
        blood_types TEXT[],
        status VARCHAR NOT NULL,
        working_hours VARCHAR NOT NULL,
        capacity INTEGER DEFAULT 0,
        current_stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR PRIMARY KEY,
        title VARCHAR NOT NULL,
        company VARCHAR NOT NULL,
        location VARCHAR NOT NULL,
        category VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        salary VARCHAR,
        description TEXT,
        requirements TEXT[],
        status VARCHAR DEFAULT 'active',
        posted_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('تم تهيئة قاعدة البيانات بنجاح');
    return { success: true };
  } catch (error) {
    console.error('خطأ في تهيئة قاعدة البيانات:', error);
    return { success: false, error: error instanceof Error ? error.message : 'خطأ غير معروف' };
  }
}

// إغلاق اتصال قاعدة البيانات
export async function closeDatabaseConnection() {
  try {
    await pool.end();
    console.log('تم إغلاق اتصال قاعدة البيانات');
  } catch (error) {
    console.error('خطأ في إغلاق اتصال قاعدة البيانات:', error);
  }
}
