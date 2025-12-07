-- إعداد قاعدة البيانات لأسعار العملات
-- Cursor الأسطوري - إعداد شامل

-- ========================================
-- 1. إنشاء جدول أسعار العملات
-- ========================================

CREATE TABLE IF NOT EXISTS public.currency_rates (
    id SERIAL PRIMARY KEY,
    currency VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    buy_rate DECIMAL(10,2) NOT NULL,
    sell_rate DECIMAL(10,2) NOT NULL,
    source VARCHAR(100) DEFAULT 'عدن تايم',
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. إضافة الفهارس للأداء
-- ========================================

CREATE INDEX IF NOT EXISTS idx_currency_rates_currency ON public.currency_rates(currency);
CREATE INDEX IF NOT EXISTS idx_currency_rates_last_updated ON public.currency_rates(last_updated);
CREATE INDEX IF NOT EXISTS idx_currency_rates_created_at ON public.currency_rates(created_at);

-- ========================================
-- 3. إنشاء وظيفة تنظيف البيانات القديمة
-- ========================================

CREATE OR REPLACE FUNCTION cleanup_old_currency_rates()
RETURNS void AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- حذف البيانات الأقدم من 24 ساعة
    DELETE FROM currency_rates 
    WHERE created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- تسجيل عملية الحذف
    INSERT INTO cleanup_log (table_name, deleted_count, cleanup_date)
    VALUES ('currency_rates', deleted_count, NOW())
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'تم حذف % سجل من جدول أسعار العملات', deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 4. جدولة التنظيف التلقائي
-- ========================================

-- جدولة التنظيف كل 24 ساعة
SELECT cron.schedule(
    'cleanup-currency-rates',
    '0 0 * * *',  -- كل يوم في منتصف الليل
    'SELECT cleanup_old_currency_rates();'
);

-- ========================================
-- 5. إدراج البيانات الأولية
-- ========================================

INSERT INTO public.currency_rates (
    currency, name, buy_rate, sell_rate, source, last_updated
) VALUES 
    ('USD', 'دولار أمريكي', 1632.00, 1617.00, 'عدن تايم (احتياطي)', NOW()),
    ('SAR', 'ريال سعودي', 428.00, 425.00, 'عدن تايم (احتياطي)', NOW())
ON CONFLICT (currency) DO UPDATE SET
    buy_rate = EXCLUDED.buy_rate,
    sell_rate = EXCLUDED.sell_rate,
    source = EXCLUDED.source,
    last_updated = EXCLUDED.last_updated,
    updated_at = NOW();

-- ========================================
-- 6. إنشاء وظيفة جلب أحدث الأسعار
-- ========================================

CREATE OR REPLACE FUNCTION get_latest_currency_rates()
RETURNS TABLE (
    currency VARCHAR(10),
    name VARCHAR(100),
    buy_rate DECIMAL(10,2),
    sell_rate DECIMAL(10,2),
    source VARCHAR(100),
    last_updated TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cr.currency,
        cr.name,
        cr.buy_rate,
        cr.sell_rate,
        cr.source,
        cr.last_updated
    FROM currency_rates cr
    ORDER BY cr.last_updated DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. إنشاء وظيفة تحديث الأسعار
-- ========================================

CREATE OR REPLACE FUNCTION update_currency_rate(
    p_currency VARCHAR(10),
    p_name VARCHAR(100),
    p_buy_rate DECIMAL(10,2),
    p_sell_rate DECIMAL(10,2),
    p_source VARCHAR(100) DEFAULT 'عدن تايم'
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO currency_rates (
        currency, name, buy_rate, sell_rate, source, last_updated
    ) VALUES (
        p_currency, p_name, p_buy_rate, p_sell_rate, p_source, NOW()
    )
    ON CONFLICT (currency) DO UPDATE SET
        name = EXCLUDED.name,
        buy_rate = EXCLUDED.buy_rate,
        sell_rate = EXCLUDED.sell_rate,
        source = EXCLUDED.source,
        last_updated = EXCLUDED.last_updated,
        updated_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 8. إنشاء جدول سجل المزامنة
-- ========================================

CREATE TABLE IF NOT EXISTS public.currency_sync_log (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    rates_count INTEGER DEFAULT 0,
    error_message TEXT,
    sync_duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهرس لجدول السجل
CREATE INDEX IF NOT EXISTS idx_currency_sync_log_created_at ON public.currency_sync_log(created_at);
CREATE INDEX IF NOT EXISTS idx_currency_sync_log_status ON public.currency_sync_log(status);

-- ========================================
-- 9. إنشاء وظيفة تسجيل المزامنة
-- ========================================

CREATE OR REPLACE FUNCTION log_currency_sync(
    p_sync_type VARCHAR(50),
    p_status VARCHAR(20),
    p_rates_count INTEGER DEFAULT 0,
    p_error_message TEXT DEFAULT NULL,
    p_sync_duration_ms INTEGER DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO currency_sync_log (
        sync_type, status, rates_count, error_message, sync_duration_ms
    ) VALUES (
        p_sync_type, p_status, p_rates_count, p_error_message, p_sync_duration_ms
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 10. التحقق من النتيجة النهائية
-- ========================================

-- التحقق من الجدول
SELECT 
    'currency_rates' as table_name,
    COUNT(*) as total_records,
    MAX(last_updated) as latest_update
FROM public.currency_rates;

-- التحقق من الفهارس
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'currency_rates'
ORDER BY indexname;

-- التحقق من الوظائف
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name LIKE '%currency%'
ORDER BY routine_name;

-- ========================================
-- 11. رسالة نجاح نهائية
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'تم إعداد قاعدة البيانات لأسعار العملات!';
    RAISE NOTICE 'تم إنشاء جدول currency_rates!';
    RAISE NOTICE 'تم إضافة الفهارس للأداء!';
    RAISE NOTICE 'تم إنشاء الوظائف المطلوبة!';
    RAISE NOTICE 'تم جدولة التنظيف التلقائي!';
    RAISE NOTICE 'النظام جاهز لمزامنة أسعار العملات!';
    RAISE NOTICE '========================================';
END $$;
