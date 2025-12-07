// اختبار قاعدة البيانات - عدن لايف
// Database Test Script for Aden Live App

const { createClient } = require('@supabase/supabase-js');

// إعداد Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yyscldfxdfhequxcyiao.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5c2NsZGZ4ZGZoZXF1eGN5aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjAxODMsImV4cCI6MjA3MzA5NjE4M30.9ZOmfO_35b_ls4AgGUqS-FEsSch2Qw3HhodrqobkiTw';

const supabase = createClient(supabaseUrl, supabaseKey);

// اختبارات قاعدة البيانات
class DatabaseTester {
    constructor() {
        this.results = {
            connection: false,
            tables: {},
            data: {},
            errors: []
        };
    }

    // اختبار الاتصال
    async testConnection() {
        try {
            console.log('🔌 اختبار الاتصال بقاعدة البيانات...');
            const { data, error } = await supabase.from('users').select('count').limit(1);
            
            if (error) {
                this.results.errors.push(`خطأ في الاتصال: ${error.message}`);
                console.log('❌ فشل الاتصال:', error.message);
                return false;
            }
            
            this.results.connection = true;
            console.log('✅ نجح الاتصال بقاعدة البيانات');
            return true;
        } catch (err) {
            this.results.errors.push(`خطأ في الاتصال: ${err.message}`);
            console.log('❌ خطأ في الاتصال:', err.message);
            return false;
        }
    }

    // اختبار الجداول
    async testTables() {
        const tables = [
            'users', 'jobs', 'health_facilities', 'blood_banks',
            'electricity_reports', 'collective_confirmations', 'unique_users',
            'system_stats', 'usage_reports'
        ];

        console.log('📊 اختبار الجداول...');
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase.from(table).select('count').limit(1);
                
                if (error) {
                    this.results.tables[table] = { exists: false, error: error.message };
                    console.log(`❌ جدول ${table}: ${error.message}`);
                } else {
                    this.results.tables[table] = { exists: true, count: data?.length || 0 };
                    console.log(`✅ جدول ${table}: موجود`);
                }
            } catch (err) {
                this.results.tables[table] = { exists: false, error: err.message };
                console.log(`❌ جدول ${table}: ${err.message}`);
            }
        }
    }

    // اختبار البيانات
    async testData() {
        console.log('📋 اختبار البيانات...');

        // اختبار المستخدمين
        try {
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('id, name, email')
                .limit(5);
            
            if (usersError) {
                this.results.data.users = { error: usersError.message };
                console.log('❌ خطأ في جلب المستخدمين:', usersError.message);
            } else {
                this.results.data.users = { count: users?.length || 0, sample: users };
                console.log(`✅ المستخدمين: ${users?.length || 0} مستخدم`);
            }
        } catch (err) {
            this.results.data.users = { error: err.message };
            console.log('❌ خطأ في المستخدمين:', err.message);
        }

        // اختبار الوظائف
        try {
            const { data: jobs, error: jobsError } = await supabase
                .from('jobs')
                .select('id, title, company, category')
                .limit(5);
            
            if (jobsError) {
                this.results.data.jobs = { error: jobsError.message };
                console.log('❌ خطأ في جلب الوظائف:', jobsError.message);
            } else {
                this.results.data.jobs = { count: jobs?.length || 0, sample: jobs };
                console.log(`✅ الوظائف: ${jobs?.length || 0} وظيفة`);
            }
        } catch (err) {
            this.results.data.jobs = { error: err.message };
            console.log('❌ خطأ في الوظائف:', err.message);
        }

        // اختبار المرافق الصحية
        try {
            const { data: facilities, error: facilitiesError } = await supabase
                .from('health_facilities')
                .select('id, name, type, district')
                .limit(5);
            
            if (facilitiesError) {
                this.results.data.health_facilities = { error: facilitiesError.message };
                console.log('❌ خطأ في جلب المرافق الصحية:', facilitiesError.message);
            } else {
                this.results.data.health_facilities = { count: facilities?.length || 0, sample: facilities };
                console.log(`✅ المرافق الصحية: ${facilities?.length || 0} مرفق`);
            }
        } catch (err) {
            this.results.data.health_facilities = { error: err.message };
            console.log('❌ خطأ في المرافق الصحية:', err.message);
        }

        // اختبار بلاغات الكهرباء
        try {
            const { data: reports, error: reportsError } = await supabase
                .from('electricity_reports')
                .select('id, district, status, timestamp')
                .limit(5);
            
            if (reportsError) {
                this.results.data.electricity_reports = { error: reportsError.message };
                console.log('❌ خطأ في جلب بلاغات الكهرباء:', reportsError.message);
            } else {
                this.results.data.electricity_reports = { count: reports?.length || 0, sample: reports };
                console.log(`✅ بلاغات الكهرباء: ${reports?.length || 0} بلاغ`);
            }
        } catch (err) {
            this.results.data.electricity_reports = { error: err.message };
            console.log('❌ خطأ في بلاغات الكهرباء:', err.message);
        }
    }

    // اختبار Views
    async testViews() {
        console.log('👁️ اختبار Views...');

        const views = ['active_jobs', 'active_health_facilities', 'electricity_reports_summary'];

        for (const view of views) {
            try {
                const { data, error } = await supabase.from(view).select('*').limit(1);
                
                if (error) {
                    console.log(`❌ View ${view}: ${error.message}`);
                } else {
                    console.log(`✅ View ${view}: يعمل بشكل صحيح`);
                }
            } catch (err) {
                console.log(`❌ View ${view}: ${err.message}`);
            }
        }
    }

    // اختبار إدراج بيانات جديدة
    async testInsert() {
        console.log('➕ اختبار إدراج بيانات جديدة...');

        try {
            // إدراج مستخدم تجريبي
            const { data: newUser, error: userError } = await supabase
                .from('users')
                .insert([{
                    name: 'مستخدم تجريبي',
                    email: `test-${Date.now()}@example.com`,
                    phone: `+967777${Math.floor(Math.random() * 1000000)}`
                }])
                .select();

            if (userError) {
                console.log('❌ فشل إدراج مستخدم:', userError.message);
            } else {
                console.log('✅ نجح إدراج مستخدم جديد:', newUser[0]?.name);
                
                // حذف المستخدم التجريبي
                await supabase.from('users').delete().eq('id', newUser[0]?.id);
                console.log('🗑️ تم حذف المستخدم التجريبي');
            }
        } catch (err) {
            console.log('❌ خطأ في اختبار الإدراج:', err.message);
        }
    }

    // تشغيل جميع الاختبارات
    async runAllTests() {
        console.log('🚀 بدء اختبار قاعدة البيانات...\n');
        
        const connectionOk = await this.testConnection();
        if (!connectionOk) {
            console.log('\n❌ فشل الاتصال بقاعدة البيانات. تأكد من:');
            console.log('1. صحة مفاتيح Supabase');
            console.log('2. إنشاء الجداول');
            console.log('3. اتصال الإنترنت');
            return this.results;
        }

        await this.testTables();
        await this.testData();
        await this.testViews();
        await this.testInsert();

        console.log('\n📊 ملخص النتائج:');
        console.log('================');
        console.log(`الاتصال: ${this.results.connection ? '✅ نجح' : '❌ فشل'}`);
        
        const tableCount = Object.keys(this.results.tables).length;
        const workingTables = Object.values(this.results.tables).filter(t => t.exists).length;
        console.log(`الجداول: ${workingTables}/${tableCount} تعمل`);
        
        const dataCount = Object.keys(this.results.data).length;
        const workingData = Object.values(this.results.data).filter(d => !d.error).length;
        console.log(`البيانات: ${workingData}/${dataCount} تعمل`);

        if (this.results.errors.length > 0) {
            console.log('\n🚨 الأخطاء:');
            this.results.errors.forEach(error => console.log(`- ${error}`));
        }

        console.log('\n🎉 انتهى اختبار قاعدة البيانات!');
        return this.results;
    }
}

// تشغيل الاختبارات
async function main() {
    const tester = new DatabaseTester();
    await tester.runAllTests();
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    main().catch(console.error);
}

module.exports = DatabaseTester;
