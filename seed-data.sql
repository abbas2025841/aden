-- إدراج البيانات الوهمية لتطبيق عدن لايف
-- Seed Data for Aden Live App

-- ===== 1. إدراج مستخدمين تجريبيين =====

INSERT INTO users (id, email, phone, name, avatar) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@adenlive.com', '+967777123456', 'مدير النظام', 'https://via.placeholder.com/150'),
('550e8400-e29b-41d4-a716-446655440002', 'ahmed@example.com', '+967777123457', 'أحمد محمد', 'https://via.placeholder.com/150'),
('550e8400-e29b-41d4-a716-446655440003', 'fatima@example.com', '+967777123458', 'فاطمة علي', 'https://via.placeholder.com/150'),
('550e8400-e29b-41d4-a716-446655440004', 'omar@example.com', '+967777123459', 'عمر حسن', 'https://via.placeholder.com/150'),
('550e8400-e29b-41d4-a716-446655440005', 'aisha@example.com', '+967777123460', 'عائشة أحمد', 'https://via.placeholder.com/150')
ON CONFLICT (id) DO NOTHING;

-- ===== 2. إدراج وظائف تجريبية =====

INSERT INTO jobs (id, title, description, location, category, salary, company, company_name, type, job_type, posted_date, experience, experience_level, education, requirements, responsibilities, benefits, contact, is_featured, featured, is_urgent, is_remote, is_active, views, applicants, tags, rating, working_hours, gender, age_range, languages) VALUES
('job-001', 'مطور ويب - React', 'مطلوب مطور ويب متخصص في React.js لتطوير تطبيقات ويب حديثة', 
 '{"city": "عدن", "district": "كريتر", "address": "شارع الجمهورية"}', 
 'تكنولوجيا', 
 '{"min": 300000, "max": 500000, "currency": "YER", "isNegotiable": true, "includesBenefits": true}',
 'شركة عدن التقنية', 'شركة عدن التقنية', 'دوام كامل', 'دوام كامل', '2025-01-28T08:00:00Z',
 'متوسط', 'متوسط', 'بكالوريوس', 
 '["خبرة في React.js", "معرفة بـ TypeScript", "خبرة في Git", "مهارات حل المشاكل"]',
 '["تطوير واجهات المستخدم", "كتابة كود نظيف", "المشاركة في مراجعة الكود"]',
 '["راتب تنافسي", "تأمين صحي", "إجازات مدفوعة", "بيئة عمل مرنة"]',
 '{"phone": "+967777111222", "email": "hr@aden-tech.com", "whatsapp": "+967777111222"}',
 true, true, false, false, true, 45, 8,
 '["React", "JavaScript", "TypeScript", "Frontend"]', 4, '8:00 ص - 4:00 م', 'غير محدد',
 '{"min": 25, "max": 35}', '["العربية", "الإنجليزية"]'),

('job-002', 'معلم لغة إنجليزية', 'مطلوب معلم لغة إنجليزية للمرحلة الثانوية في إحدى أفضل مدارس عدن',
 '{"city": "عدن", "district": "المعلا", "address": "شارع الملك فيصل"}',
 'تعليم',
 '{"min": 180000, "max": 280000, "currency": "YER", "isNegotiable": true, "includesBenefits": true}',
 'مدارس عدن النموذجية', 'مدارس عدن النموذجية', 'دوام كامل', 'دوام كامل', '2025-01-28T08:00:00Z',
 'متوسط', 'متوسط', 'بكالوريوس',
 '["بكالوريوس في اللغة الإنجليزية", "خبرة لا تقل عن 3 سنوات", "إجادة كاملة للغة الإنجليزية"]',
 '["تدريس اللغة الإنجليزية", "إعداد الخطط التعليمية", "تقييم أداء الطلاب"]',
 '["راتب تنافسي مع بدلات", "تأمين صحي شامل", "إجازات مدفوعة الأجر"]',
 '{"phone": "+967777111333", "email": "hr@adenmodel.edu.ye", "whatsapp": "+967777111333"}',
 true, true, false, false, true, 32, 5,
 '["تدريس", "إنجليزية", "عدن", "مدارس"]', 5, '7:30 ص - 2:30 م', 'غير محدد',
 '{"min": 25, "max": 45}', '["العربية", "الإنجليزية"]'),

('job-003', 'ممرض/ممرضة', 'مطلوب ممرض/ممرضة للعمل في مستشفى خاص في عدن',
 '{"city": "عدن", "district": "التواهي", "address": "شارع الخليج"}',
 'صحة',
 '{"min": 200000, "max": 350000, "currency": "YER", "isNegotiable": false, "includesBenefits": true}',
 'مستشفى عدن التخصصي', 'مستشفى عدن التخصصي', 'دوام كامل', 'دوام كامل', '2025-01-28T08:00:00Z',
 'مبتدئ', 'مبتدئ', 'دبلوم',
 '["دبلوم تمريض", "رخصة مزاولة المهنة", "خبرة في المستشفيات"]',
 '["تقديم الرعاية التمريضية", "مراقبة حالة المرضى", "التعاون مع الفريق الطبي"]',
 '["راتب مجزي", "تأمين صحي", "بدلات نوبات", "تدريب مستمر"]',
 '{"phone": "+967777111444", "email": "hr@aden-hospital.com", "whatsapp": "+967777111444"}',
 false, false, true, false, true, 28, 12,
 '["تمريض", "صحة", "مستشفى", "عدن"]', 4, 'نوبات متناوبة', 'غير محدد',
 '{"min": 22, "max": 40}', '["العربية", "الإنجليزية"]')
ON CONFLICT (id) DO NOTHING;

-- ===== 3. إدراج مرافق صحية =====

INSERT INTO health_facilities (id, name, type, location, district, contact, services, status, working_hours, emergency, coordinates, rating, reviews) VALUES
('health-001', 'مستشفى الجمهورية التعليمي', 'hospital', 'شارع الجمهورية، كريتر، عدن', 'كريتر', '02358260', 
 '["طوارئ", "جراحة عامة", "أطفال", "نساء وولادة", "عظام", "أنف وأذن وحنجرة"]',
 'operational', '24 ساعة', true,
 '{"lat": 12.7794, "lng": 45.0369}', 4,
 '[{"user_id": "550e8400-e29b-41d4-a716-446655440002", "rating": 4, "comment": "خدمة ممتازة", "date": "2025-01-20"}]'),

('health-002', 'مستشفى عدن التخصصي', 'hospital', 'شارع الخليج، التواهي، عدن', 'التواهي', '02358261',
 '["طوارئ", "قلب", "عيون", "أسنان", "جلدية", "نفسية"]',
 'operational', '24 ساعة', true,
 '{"lat": 12.7856, "lng": 45.0123}', 5,
 '[{"user_id": "550e8400-e29b-41d4-a716-446655440003", "rating": 5, "comment": "أفضل مستشفى في عدن", "date": "2025-01-22"}]'),

('health-003', 'عيادة الدكتور أحمد محمد', 'clinic', 'شارع الملك فيصل، المعلا، عدن', 'المعلا', '02358262',
 '["استشارات عامة", "أطفال", "نساء", "تحاليل"]',
 'operational', '8:00 ص - 10:00 م', false,
 '{"lat": 12.7901, "lng": 45.0234}', 4,
 '[{"user_id": "550e8400-e29b-41d4-a716-446655440004", "rating": 4, "comment": "طبيب ممتاز", "date": "2025-01-25"}]'),

('health-004', 'صيدلية النور', 'pharmacy', 'شارع الشيخ عثمان، الشيخ عثمان، عدن', 'الشيخ عثمان', '02358263',
 '["أدوية", "مستلزمات طبية", "استشارات دوائية"]',
 'operational', '8:00 ص - 12:00 م', false,
 '{"lat": 12.7956, "lng": 45.0345}', 3,
 '[{"user_id": "550e8400-e29b-41d4-a716-446655440005", "rating": 3, "comment": "أسعار معقولة", "date": "2025-01-26"}]')
ON CONFLICT (id) DO NOTHING;

-- ===== 4. إدراج بنوك دم =====

INSERT INTO blood_banks (id, name, location, district, contact, blood_types, status, working_hours, capacity, current_stock, a_pos_stock, a_neg_stock, b_pos_stock, b_neg_stock, ab_pos_stock, ab_neg_stock, o_pos_stock, o_neg_stock, coordinates) VALUES
('blood-001', 'بنك الدم المركزي - عدن', 'مستشفى الجمهورية التعليمي، كريتر، عدن', 'كريتر', '02358260',
 '["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]',
 'available', '24 ساعة', 1000, 750,
 150, 50, 120, 40, 80, 30, 200, 80,
 '{"lat": 12.7794, "lng": 45.0369}'),

('blood-002', 'بنك الدم - مستشفى عدن التخصصي', 'شارع الخليج، التواهي، عدن', 'التواهي', '02358261',
 '["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]',
 'available', '24 ساعة', 800, 600,
 120, 40, 100, 35, 60, 25, 180, 70,
 '{"lat": 12.7856, "lng": 45.0123}')
ON CONFLICT (id) DO NOTHING;

-- ===== 5. إدراج بلاغات كهرباء تجريبية =====

INSERT INTO electricity_reports (report_id, district, status, user_agent, device_fingerprint, ip_address, location, report_hash, timestamp, is_verified, verification_count) VALUES
('RPT_001', 'كريتر', 'on', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'device_001', '192.168.1.1', '{"lat": 12.7794, "lng": 45.0369}', 'hash_001', NOW() - INTERVAL '1 hour', true, 3),
('RPT_002', 'المعلا', 'off', 'Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0', 'device_002', '192.168.1.2', '{"lat": 12.7901, "lng": 45.0234}', 'hash_002', NOW() - INTERVAL '2 hours', true, 5),
('RPT_003', 'التواهي', 'partial', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'device_003', '192.168.1.3', '{"lat": 12.7856, "lng": 45.0123}', 'hash_003', NOW() - INTERVAL '30 minutes', false, 1),
('RPT_004', 'الشيخ عثمان', 'on', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'device_004', '192.168.1.4', '{"lat": 12.7956, "lng": 45.0345}', 'hash_004', NOW() - INTERVAL '15 minutes', true, 2)
ON CONFLICT (report_id) DO NOTHING;

-- ===== 6. إدراج تأكيدات جماعية =====

INSERT INTO collective_confirmations (district, status, confirmation_hash, report_count, unique_users, time_window, is_active, confirmed_at, expires_at) VALUES
('كريتر', 'on', 'conf_hash_001', 15, 12, 30, true, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '23 hours'),
('المعلا', 'off', 'conf_hash_002', 8, 6, 30, true, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '22 hours'),
('التواهي', 'partial', 'conf_hash_003', 3, 2, 30, false, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '29 hours 30 minutes')
ON CONFLICT DO NOTHING;

-- ===== 7. إدراج مستخدمين فريدين =====

INSERT INTO unique_users (device_fingerprint, first_seen_at, last_seen_at, total_reports, districts_reported, is_active) VALUES
('device_001', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour', 5, '["كريتر", "المعلا"]', true),
('device_002', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 hours', 3, '["المعلا", "التواهي"]', true),
('device_003', NOW() - INTERVAL '3 days', NOW() - INTERVAL '30 minutes', 1, '["التواهي"]', true),
('device_004', NOW() - INTERVAL '1 day', NOW() - INTERVAL '15 minutes', 2, '["الشيخ عثمان"]', true)
ON CONFLICT (device_fingerprint) DO NOTHING;

-- ===== 8. تحديث إحصائيات النظام =====

UPDATE system_stats SET 
    total_users = (SELECT COUNT(*) FROM users),
    total_reports = (SELECT COUNT(*) FROM electricity_reports),
    total_jobs = (SELECT COUNT(*) FROM jobs),
    total_health_facilities = (SELECT COUNT(*) FROM health_facilities),
    last_updated = NOW();

-- ===== 9. إدراج تقرير استخدام تجريبي =====

INSERT INTO usage_reports (date, page_views, unique_visitors, most_visited_pages) VALUES
(CURRENT_DATE, 1250, 180, 
 '[{"page": "/", "views": 450}, {"page": "/jobs", "views": 320}, {"page": "/health", "views": 280}, {"page": "/emergency", "views": 200}]'),
(CURRENT_DATE - INTERVAL '1 day', 1180, 165,
 '[{"page": "/", "views": 420}, {"page": "/jobs", "views": 300}, {"page": "/health", "views": 260}, {"page": "/emergency", "views": 200}]')
ON CONFLICT DO NOTHING;

-- ===== تم الانتهاء من إدراج البيانات الوهمية =====
-- Seed Data Insertion Complete

-- عرض ملخص البيانات المُدرجة
SELECT 
    'المستخدمين' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'الوظائف', COUNT(*) FROM jobs
UNION ALL
SELECT 'المرافق الصحية', COUNT(*) FROM health_facilities
UNION ALL
SELECT 'بنوك الدم', COUNT(*) FROM blood_banks
UNION ALL
SELECT 'بلاغات الكهرباء', COUNT(*) FROM electricity_reports
UNION ALL
SELECT 'التأكيدات الجماعية', COUNT(*) FROM collective_confirmations
UNION ALL
SELECT 'المستخدمين الفريدين', COUNT(*) FROM unique_users
ORDER BY table_name;
