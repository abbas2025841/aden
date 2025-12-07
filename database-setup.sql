-- إعداد قاعدة البيانات لتطبيق عدن لايف
-- Aden Live App Database Setup

-- ===== 1. جداول المستخدمين والمصادقة =====

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول جلسات المستخدمين
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 2. جداول الوظائف =====

-- جدول الوظائف
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location JSONB NOT NULL, -- {city, district, address}
    category VARCHAR(100) NOT NULL,
    salary JSONB, -- {min, max, currency, isNegotiable, includesBenefits}
    company VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    job_type VARCHAR(50),
    posted_date VARCHAR(50) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50),
    education VARCHAR(100),
    requirements JSONB NOT NULL, -- array of strings
    responsibilities JSONB, -- array of strings
    benefits JSONB, -- array of strings
    contact JSONB, -- {phone, email, whatsapp}
    is_featured BOOLEAN DEFAULT FALSE,
    featured BOOLEAN,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_remote BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views INTEGER DEFAULT 0,
    applicants INTEGER DEFAULT 0,
    tags JSONB, -- array of strings
    rating INTEGER,
    working_hours VARCHAR(100),
    gender VARCHAR(50),
    age_range JSONB, -- {min, max}
    languages JSONB, -- array of strings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول طلبات الوظائف
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, accepted, rejected
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 3. جداول المرافق الصحية =====

-- جدول المرافق الصحية
CREATE TABLE IF NOT EXISTS health_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- hospital, clinic, pharmacy, lab
    location TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    services JSONB NOT NULL DEFAULT '[]', -- array of strings
    status VARCHAR(20) NOT NULL DEFAULT 'operational', -- operational, closed, maintenance
    working_hours VARCHAR(100) NOT NULL,
    emergency BOOLEAN NOT NULL DEFAULT FALSE,
    coordinates JSONB, -- {lat, lng}
    rating INTEGER DEFAULT 0,
    reviews JSONB DEFAULT '[]', -- array of review objects
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول بنوك الدم
CREATE TABLE IF NOT EXISTS blood_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    blood_types JSONB NOT NULL DEFAULT '[]', -- array of strings
    status VARCHAR(20) NOT NULL DEFAULT 'available', -- available, closed, busy
    working_hours VARCHAR(100) NOT NULL,
    capacity INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    -- مخزون فصائل الدم المختلفة
    a_pos_stock INTEGER DEFAULT 0,
    a_neg_stock INTEGER DEFAULT 0,
    b_pos_stock INTEGER DEFAULT 0,
    b_neg_stock INTEGER DEFAULT 0,
    ab_pos_stock INTEGER DEFAULT 0,
    ab_neg_stock INTEGER DEFAULT 0,
    o_pos_stock INTEGER DEFAULT 0,
    o_neg_stock INTEGER DEFAULT 0,
    coordinates JSONB, -- {lat, lng}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول تقييمات المرافق الصحية
CREATE TABLE IF NOT EXISTS health_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES health_facilities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 4. جداول الكهرباء =====

-- جدول بلاغات الكهرباء
CREATE TABLE IF NOT EXISTS electricity_reports (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(32) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('on', 'off', 'partial', 'unknown')),
    user_agent TEXT,
    device_fingerprint VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45),
    location JSONB, -- {lat, lng}
    report_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- جدول التأكيدات الجماعية
CREATE TABLE IF NOT EXISTS collective_confirmations (
    id SERIAL PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('on', 'off', 'partial', 'unknown')),
    confirmation_hash VARCHAR(64) NOT NULL,
    report_count INTEGER NOT NULL,
    unique_users INTEGER NOT NULL,
    time_window INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    confirmed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- جدول المستخدمين الفريدين
CREATE TABLE IF NOT EXISTS unique_users (
    id SERIAL PRIMARY KEY,
    device_fingerprint VARCHAR(64) UNIQUE NOT NULL,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    total_reports INTEGER DEFAULT 0,
    districts_reported JSONB DEFAULT '[]', -- array of strings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 5. جداول الإحصائيات =====

-- جدول إحصائيات النظام
CREATE TABLE IF NOT EXISTS system_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_users INTEGER DEFAULT 0,
    total_reports INTEGER DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    total_health_facilities INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- جدول تقارير الاستخدام
CREATE TABLE IF NOT EXISTS usage_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    most_visited_pages JSONB DEFAULT '[]', -- array of objects
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 6. إنشاء الفهارس للأداء =====

-- فهارس الوظائف
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);

-- فهارس المرافق الصحية
CREATE INDEX IF NOT EXISTS idx_health_facilities_type ON health_facilities(type);
CREATE INDEX IF NOT EXISTS idx_health_facilities_district ON health_facilities(district);
CREATE INDEX IF NOT EXISTS idx_health_facilities_status ON health_facilities(status);

-- فهارس بنوك الدم
CREATE INDEX IF NOT EXISTS idx_blood_banks_district ON blood_banks(district);
CREATE INDEX IF NOT EXISTS idx_blood_banks_status ON blood_banks(status);

-- فهارس الكهرباء
CREATE INDEX IF NOT EXISTS idx_electricity_reports_district ON electricity_reports(district);
CREATE INDEX IF NOT EXISTS idx_electricity_reports_timestamp ON electricity_reports(timestamp);
CREATE INDEX IF NOT EXISTS idx_electricity_reports_status ON electricity_reports(status);

-- فهارس التأكيدات الجماعية
CREATE INDEX IF NOT EXISTS idx_collective_confirmations_district ON collective_confirmations(district);
CREATE INDEX IF NOT EXISTS idx_collective_confirmations_is_active ON collective_confirmations(is_active);

-- ===== 7. إنشاء الوظائف المساعدة =====

-- وظيفة تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الوظيفة على الجداول
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_facilities_updated_at BEFORE UPDATE ON health_facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_banks_updated_at BEFORE UPDATE ON blood_banks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== 8. إدراج بيانات تجريبية =====

-- إدراج إحصائيات النظام الافتراضية
INSERT INTO system_stats (total_users, total_reports, total_jobs, total_health_facilities) 
VALUES (0, 0, 0, 0) 
ON CONFLICT DO NOTHING;

-- ===== 9. إعداد Row Level Security (RLS) =====

-- تفعيل RLS على الجداول الحساسة
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_evaluations ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان الأساسية
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- ===== 10. إنشاء Views مفيدة =====

-- عرض الوظائف النشطة
CREATE OR REPLACE VIEW active_jobs AS
SELECT 
    id, title, company, location, category, type, 
    posted_date, experience, is_featured, is_urgent,
    views, applicants, created_at
FROM jobs 
WHERE is_active = TRUE 
ORDER BY created_at DESC;

-- عرض المرافق الصحية النشطة
CREATE OR REPLACE VIEW active_health_facilities AS
SELECT 
    id, name, type, location, district, contact,
    services, status, working_hours, emergency,
    rating, created_at
FROM health_facilities 
WHERE status = 'operational'
ORDER BY rating DESC, name;

-- عرض إحصائيات البلاغات
CREATE OR REPLACE VIEW electricity_reports_summary AS
SELECT 
    district,
    status,
    COUNT(*) as report_count,
    MAX(timestamp) as last_report,
    COUNT(DISTINCT device_fingerprint) as unique_reporters
FROM electricity_reports 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY district, status
ORDER BY district, status;

-- ===== تم الانتهاء من إعداد قاعدة البيانات =====
-- Aden Live App Database Setup Complete
