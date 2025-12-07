// إعداد Supabase - Cursor الأسطوري
import { createClient } from '@supabase/supabase-js';

// كشف بيئة التشغيل
const isBrowser = typeof window !== 'undefined';

// بيانات Supabase - في المتصفح من Vite، في السيرفر من process.env مع قيم افتراضية لمشروعك
let supabaseUrl: string | undefined;
let supabaseAnonKey: string | undefined;

if (isBrowser) {
  // في الواجهة نستخدم قيم مشروعك مباشرة لضمان عدم كونها undefined
  supabaseUrl = 'https://dzawjbsxdycofgmjmpsq.supabase.co';
  supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YXdqYnN4ZHljb2ZnbWptcHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTQxMTEsImV4cCI6MjA3ODg5MDExMX0.VcAm5y2XV-eWz4Z6KNFq3BrKKVZ4HgDMFMIPYy_gOdg';
} else {
  // في السيرفر نسمح بقيم افتراضية حتى لا يتوقف التشغيل أثناء التطوير
  supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dzawjbsxdycofgmjmpsq.supabase.co';
  supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YXdqYnN4ZHljb2ZnbWptcHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTQxMTEsImV4cCI6MjA3ODg5MDExMX0.VcAm5y2XV-eWz4Z6KNFq3BrKKVZ4HgDMFMIPYy_gOdg';
}

// Service Role Key للصلاحيات الكاملة (للمطورين فقط) - اختيارية
const supabaseServiceRoleKey = isBrowser
  ? (typeof import.meta !== 'undefined' ? (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY : undefined)
  : process.env.SUPABASE_SERVICE_ROLE_KEY;

// إنشاء عميل Supabase العادي (للمستخدمين)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// إنشاء عميل Supabase مع Service Role (للمطورين - صلاحيات كاملة) فقط إذا كان المفتاح متوفراً
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : undefined as any;

// أنواع البيانات
export interface ElectricityReport {
  id?: number;
  report_id: string;
  district: string;
  status: 'on' | 'off' | 'partial' | 'unknown';
  user_agent?: string;
  device_fingerprint: string;
  ip_address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  report_hash: string;
  timestamp: string;
  is_verified: boolean;
  verification_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CollectiveConfirmation {
  id?: number;
  district: string;
  status: 'on' | 'off' | 'partial' | 'unknown';
  confirmation_hash: string;
  report_count: number;
  unique_users: number;
  time_window: number;
  is_active: boolean;
  confirmed_at: string;
  expires_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface UniqueUser {
  id?: number;
  device_fingerprint: string;
  first_report: string;
  last_report: string;
  total_reports: number;
  is_blocked: boolean;
  block_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportStatistics {
  id?: number;
  district: string;
  date: string;
  total_reports: number;
  on_reports: number;
  off_reports: number;
  partial_reports: number;
  unknown_reports: number;
  unique_users: number;
  confirmations: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id?: number;
  action: string;
  district?: string;
  status?: string;
  device_fingerprint?: string;
  details?: any;
  ip_address?: string;
  timestamp: string;
}

// دوال مساعدة للتعامل مع Supabase
export class SupabaseService {
  // إرسال بلاغ كهرباء
  static async submitReport(report: Omit<ElectricityReport, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('electricity_reports')
        .insert([report])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('خطأ في إرسال البلاغ:', error);
      return { success: false, error: error.message };
    }
  }

  // الحصول على البلاغات
  static async getReports(filters?: {
    district?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('electricity_reports')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.district) {
        query = query.eq('district', filters.district);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('خطأ في جلب البلاغات:', error);
      return { success: false, error: error.message };
    }
  }

  // الحصول على حالة التأكيد
  static async getConfirmationStatus(district: string) {
    try {
      const { data, error } = await supabase
        .from('collective_confirmations')
        .select('*')
        .eq('district', district)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('confirmed_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data: data || null };
    } catch (error) {
      console.error('خطأ في جلب حالة التأكيد:', error);
      return { success: false, error: error.message };
    }
  }

  // إنشاء تأكيد جماعي
  static async createConfirmation(confirmation: Omit<CollectiveConfirmation, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('collective_confirmations')
        .insert([confirmation])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('خطأ في إنشاء التأكيد:', error);
      return { success: false, error: error.message };
    }
  }

  // إضافة أو تحديث مستخدم فريد
  static async upsertUniqueUser(user: Omit<UniqueUser, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('unique_users')
        .upsert([user], { onConflict: 'device_fingerprint' })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('خطأ في إضافة المستخدم:', error);
      return { success: false, error: error.message };
    }
  }

  // تسجيل النشاط
  static async logActivity(activity: Omit<ActivityLog, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .insert([activity])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('خطأ في تسجيل النشاط:', error);
      return { success: false, error: error.message };
    }
  }

  // الحصول على إحصائيات
  static async getStatistics(district?: string) {
    try {
      let query = supabase
        .from('report_statistics')
        .select('*')
        .order('date', { ascending: false });

      if (district) {
        query = query.eq('district', district);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      return { success: false, error: error.message };
    }
  }

  // تنظيف البيانات المنتهية الصلاحية
  static async cleanupExpiredData() {
    try {
      const now = new Date().toISOString();

      // تعطيل التأكيدات المنتهية الصلاحية
      const { error: confirmationError } = await supabase
        .from('collective_confirmations')
        .update({ is_active: false, updated_at: now })
        .eq('is_active', true)
        .lt('expires_at', now);

      if (confirmationError) throw confirmationError;

      // حذف البلاغات القديمة (أكثر من 30 يوم)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { error: reportError } = await supabase
        .from('electricity_reports')
        .delete()
        .lt('timestamp', thirtyDaysAgo);

      if (reportError) throw reportError;

      return { success: true };
    } catch (error) {
      console.error('خطأ في تنظيف البيانات:', error);
      return { success: false, error: error.message };
    }
  }
}

// فئة للصلاحيات الكاملة (للمطورين فقط)
export class SupabaseAdminService {
  // إنشاء جميع الجداول المطلوبة
  static async createAllTables() {
    try {
      const tables = [
        `CREATE TABLE IF NOT EXISTS public.electricity_reports (
          id SERIAL PRIMARY KEY,
          device_id TEXT NOT NULL,
          report_id TEXT UNIQUE NOT NULL,
          report_number TEXT NOT NULL DEFAULT 'RPT_' || nextval('electricity_reports_id_seq')::text,
          district VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL,
          user_agent TEXT,
          device_fingerprint TEXT NOT NULL,
          ip_address VARCHAR(45),
          location JSONB,
          report_hash VARCHAR(64),
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          is_verified BOOLEAN DEFAULT FALSE,
          verification_count INTEGER DEFAULT 1,
          customer_name TEXT,
          phone_number TEXT,
          problem_type TEXT,
          priority TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        
        `CREATE TABLE IF NOT EXISTS public.collective_confirmations (
          id SERIAL PRIMARY KEY,
          report_id TEXT NOT NULL,
          district VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL,
          confirmation_count INTEGER DEFAULT 1,
          first_confirmation_at TIMESTAMPTZ DEFAULT NOW(),
          last_confirmation_at TIMESTAMPTZ DEFAULT NOW(),
          is_confirmed BOOLEAN DEFAULT FALSE,
          confirmed_at TIMESTAMPTZ,
          device_fingerprints TEXT[] DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        
        `CREATE TABLE IF NOT EXISTS public.unique_users (
          id SERIAL PRIMARY KEY,
          device_fingerprint TEXT UNIQUE NOT NULL,
          first_seen_at TIMESTAMPTZ DEFAULT NOW(),
          last_seen_at TIMESTAMPTZ DEFAULT NOW(),
          total_reports INTEGER DEFAULT 0,
          districts_reported TEXT[] DEFAULT '{}',
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        
        `CREATE TABLE IF NOT EXISTS public.report_statistics (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          district VARCHAR(100) NOT NULL,
          total_reports INTEGER DEFAULT 0,
          on_reports INTEGER DEFAULT 0,
          off_reports INTEGER DEFAULT 0,
          partial_reports INTEGER DEFAULT 0,
          unique_users INTEGER DEFAULT 0,
          confirmed_reports INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(date, district)
        );`,
        
        `CREATE TABLE IF NOT EXISTS public.activity_log (
          id SERIAL PRIMARY KEY,
          action_type VARCHAR(50) NOT NULL,
          table_name VARCHAR(100),
          record_id TEXT,
          old_values JSONB,
          new_values JSONB,
          user_agent TEXT,
          ip_address VARCHAR(45),
          device_fingerprint TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        
        `CREATE TABLE IF NOT EXISTS public.districts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          arabic_name VARCHAR(100) NOT NULL,
          population INTEGER,
          area_km2 DECIMAL(10,2),
          coordinates JSONB,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );`
      ];

      for (const table of tables) {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: table });
        if (error) throw error;
      }

      return { success: true, message: 'تم إنشاء جميع الجداول بنجاح' };
    } catch (error) {
      console.error('خطأ في إنشاء الجداول:', error);
      return { success: false, error: error.message };
    }
  }

  // إصلاح جميع الأعمدة
  static async fixAllColumns() {
    try {
      const fixes = [
        `ALTER TABLE public.electricity_reports ALTER COLUMN report_number SET DEFAULT 'RPT_' || nextval('electricity_reports_id_seq')::text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN report_id TYPE text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN device_id TYPE text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN customer_name TYPE text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN phone_number TYPE text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN problem_type TYPE text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN priority TYPE text;`,
        `ALTER TABLE public.electricity_reports ALTER COLUMN device_fingerprint TYPE text;`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS district VARCHAR(100);`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS status VARCHAR(20);`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS user_agent TEXT;`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS location JSONB;`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS report_hash VARCHAR(64);`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS verification_count INTEGER DEFAULT 1;`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,
        `ALTER TABLE public.electricity_reports ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ DEFAULT NOW();`
      ];

      for (const fix of fixes) {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: fix });
        if (error) throw error;
      }

      return { success: true, message: 'تم إصلاح جميع الأعمدة بنجاح' };
    } catch (error) {
      console.error('خطأ في إصلاح الأعمدة:', error);
      return { success: false, error: error.message };
    }
  }

  // إدراج بيانات المديريات
  static async insertDistricts() {
    try {
      const districts = [
        { name: 'Crater', arabic_name: 'كريتر', population: 150000, area_km2: 12.5, coordinates: { lat: 12.7794, lng: 45.0369 } },
        { name: 'Maalla', arabic_name: 'المعلا', population: 120000, area_km2: 8.2, coordinates: { lat: 12.8000, lng: 45.0000 } },
        { name: 'Tawahi', arabic_name: 'التواهي', population: 95000, area_km2: 6.8, coordinates: { lat: 12.8200, lng: 45.0200 } },
        { name: 'Mansoura', arabic_name: 'المنصورة', population: 110000, area_km2: 9.1, coordinates: { lat: 12.8273, lng: 44.9908 } },
        { name: 'Khormaksar', arabic_name: 'خور مكسر', population: 130000, area_km2: 10.3, coordinates: { lat: 12.7800, lng: 44.9800 } },
        { name: 'Sheikh Othman', arabic_name: 'الشيخ عثمان', population: 140000, area_km2: 11.7, coordinates: { lat: 12.8500, lng: 44.9500 } },
        { name: 'Dar Saad', arabic_name: 'دار سعد', population: 85000, area_km2: 7.4, coordinates: { lat: 12.7500, lng: 45.1000 } },
        { name: 'Al-Buraiqeh', arabic_name: 'البريقة', population: 75000, area_km2: 6.2, coordinates: { lat: 12.7000, lng: 45.1500 } }
      ];

      const { error } = await supabaseAdmin
        .from('districts')
        .upsert(districts, { onConflict: 'name' });

      if (error) throw error;
      return { success: true, message: 'تم إدراج جميع المديريات بنجاح' };
    } catch (error) {
      console.error('خطأ في إدراج المديريات:', error);
      return { success: false, error: error.message };
    }
  }

  // إصلاح شامل للنظام
  static async fixSystem() {
    try {
      console.log('🚀 بدء إصلاح النظام...');
      
      // 1. إنشاء الجداول
      console.log('📋 إنشاء الجداول...');
      const tablesResult = await this.createAllTables();
      if (!tablesResult.success) throw new Error(tablesResult.error);
      
      // 2. إصلاح الأعمدة
      console.log('🔧 إصلاح الأعمدة...');
      const columnsResult = await this.fixAllColumns();
      if (!columnsResult.success) throw new Error(columnsResult.error);
      
      // 3. إدراج المديريات
      console.log('🏘️ إدراج المديريات...');
      const districtsResult = await this.insertDistricts();
      if (!districtsResult.success) throw new Error(districtsResult.error);
      
      console.log('✅ تم إصلاح النظام بالكامل!');
      return { success: true, message: 'تم إصلاح النظام بالكامل بنجاح!' };
    } catch (error) {
      console.error('❌ خطأ في إصلاح النظام:', error);
      return { success: false, error: error.message };
    }
  }
}

export default supabase;
