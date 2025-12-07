// اختبار الاتصال بقاعدة البيانات وموقع عدن تايم
// Cursor الأسطوري - اختبار شامل

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// إعدادات Supabase
const supabaseUrl = 'https://yyscldfxdfhequxcyiao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5c2NsZGZ4ZGZoZXF1eGN5aWFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUyMDE4MywiZXhwIjoyMDczMDk2MTgzfQ.iCpM9GxO_c7OyezD5X5kaQMNZfdtz6AGrHhctqOn-Dc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('🔗 اختبار الاتصال بـ Supabase...');
    
    // اختبار الاتصال الأساسي
    const { data, error } = await supabase
      .from('currency_rates')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ خطأ في الاتصال بـ Supabase:', error.message);
      return false;
    }
    
    console.log('✅ تم الاتصال بـ Supabase بنجاح');
    return true;
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    return false;
  }
}

async function testAdenTimeConnection() {
  try {
    console.log('🌐 اختبار الاتصال بـ عدن تايم...');
    
    const response = await axios.get('https://www.aden-tm.net/news/345502', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ تم الاتصال بـ عدن تايم بنجاح');
      console.log(`📄 حجم الصفحة: ${response.data.length} حرف`);
      return true;
    } else {
      console.error(`❌ خطأ في الاتصال: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال بـ عدن تايم:', error.message);
    return false;
  }
}

async function testDatabaseTables() {
  try {
    console.log('🗄️ اختبار جداول قاعدة البيانات...');
    
    // اختبار جدول currency_rates
    const { data: rates, error: ratesError } = await supabase
      .from('currency_rates')
      .select('*')
      .limit(5);
    
    if (ratesError) {
      console.error('❌ خطأ في جدول currency_rates:', ratesError.message);
      return false;
    }
    
    console.log(`✅ جدول currency_rates: ${rates.length} سجل`);
    
    // اختبار جدول currency_sync_log
    const { data: logs, error: logsError } = await supabase
      .from('currency_sync_log')
      .select('*')
      .limit(5);
    
    if (logsError) {
      console.log('⚠️ جدول currency_sync_log غير موجود (سيتم إنشاؤه)');
    } else {
      console.log(`✅ جدول currency_sync_log: ${logs.length} سجل`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ خطأ في اختبار الجداول:', error.message);
    return false;
  }
}

async function testCurrencyExtraction() {
  try {
    console.log('💰 اختبار استخراج أسعار العملات...');
    
    const response = await axios.get('https://www.aden-tm.net/news/345502', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const htmlText = response.data;
    
    // البحث عن أسعار الدولار
    const usdMatch = htmlText.match(/دولار\s*امريكي\s*=\s*(\d+)\s*:\s*(\d+)/i);
    if (usdMatch) {
      console.log(`✅ تم العثور على سعر الدولار: ${usdMatch[1]}:${usdMatch[2]}`);
    } else {
      console.log('⚠️ لم يتم العثور على سعر الدولار');
    }
    
    // البحث عن أسعار الريال السعودي
    const sarMatch = htmlText.match(/ريال\s*سعودي\s*=\s*(\d+)\s*:\s*(\d+)/i);
    if (sarMatch) {
      console.log(`✅ تم العثور على سعر الريال: ${sarMatch[1]}:${sarMatch[2]}`);
    } else {
      console.log('⚠️ لم يتم العثور على سعر الريال');
    }
    
    return usdMatch || sarMatch;
    
  } catch (error) {
    console.error('❌ خطأ في استخراج الأسعار:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 بدء اختبارات النظام...\n');
  
  const results = {
    supabase: false,
    adenTime: false,
    database: false,
    extraction: false
  };
  
  // اختبار الاتصال بـ Supabase
  results.supabase = await testSupabaseConnection();
  console.log('');
  
  // اختبار الاتصال بـ عدن تايم
  results.adenTime = await testAdenTimeConnection();
  console.log('');
  
  // اختبار جداول قاعدة البيانات
  results.database = await testDatabaseTables();
  console.log('');
  
  // اختبار استخراج الأسعار
  results.extraction = await testCurrencyExtraction();
  console.log('');
  
  // عرض النتائج النهائية
  console.log('📊 نتائج الاختبارات:');
  console.log('========================================');
  console.log(`🔗 Supabase: ${results.supabase ? '✅ نجح' : '❌ فشل'}`);
  console.log(`🌐 عدن تايم: ${results.adenTime ? '✅ نجح' : '❌ فشل'}`);
  console.log(`🗄️ قاعدة البيانات: ${results.database ? '✅ نجح' : '❌ فشل'}`);
  console.log(`💰 استخراج الأسعار: ${results.extraction ? '✅ نجح' : '❌ فشل'}`);
  console.log('========================================');
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 النتيجة النهائية: ${successCount}/${totalTests} اختبار نجح`);
  
  if (successCount === totalTests) {
    console.log('🎉 جميع الاختبارات نجحت! النظام جاهز للعمل.');
  } else {
    console.log('⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه.');
  }
  
  return results;
}

// تشغيل الاختبارات
runAllTests().catch(console.error);
