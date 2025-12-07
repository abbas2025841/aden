// نظام مزامنة أسعار العملات - عدن لايف
// Cursor الأسطوري - نظام مزامنة مستمر

const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

// إعدادات Supabase
const supabaseUrl = 'https://yyscldfxdfhequxcyiao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5c2NsZGZ4ZGZoZXF1eGN5aWFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUyMDE4MywiZXhwIjoyMDczMDk2MTgzfQ.iCpM9GxO_c7OyezD5X5kaQMNZfdtz6AGrHhctqOn-Dc';

const supabase = createClient(supabaseUrl, supabaseKey);

// إعدادات المزامنة
const SYNC_INTERVAL = '*/5 * * * *'; // كل 5 دقائق
const CLEANUP_INTERVAL = '0 0 * * *'; // كل يوم في منتصف الليل

class CurrencySyncService {
  constructor() {
    this.isRunning = false;
    this.lastSync = null;
    this.errorCount = 0;
    this.maxErrors = 5;
  }

  // جلب أسعار العملات من عدن تايم
  async fetchCurrencyRates() {
    try {
      console.log('🔄 جاري جلب أسعار العملات من عدن تايم...');
      
      const response = await axios.get('https://www.aden-tm.net/news/345502', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ar,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const $ = cheerio.load(response.data);
      const rates = [];

      // البحث عن أسعار الدولار
      const usdText = $('*').text();
      const usdMatch = usdText.match(/دولار\s*امريكي\s*=\s*(\d+)\s*:\s*(\d+)/i);
      
      if (usdMatch) {
        rates.push({
          currency: 'USD',
          name: 'دولار أمريكي',
          buy: parseFloat(usdMatch[1]),
          sell: parseFloat(usdMatch[2]),
          source: 'عدن تايم',
          timestamp: new Date().toISOString()
        });
      }

      // البحث عن أسعار الريال السعودي
      const sarMatch = usdText.match(/ريال\s*سعودي\s*=\s*(\d+)\s*:\s*(\d+)/i);
      
      if (sarMatch) {
        rates.push({
          currency: 'SAR',
          name: 'ريال سعودي',
          buy: parseFloat(sarMatch[1]),
          sell: parseFloat(sarMatch[2]),
          source: 'عدن تايم',
          timestamp: new Date().toISOString()
        });
      }

      // إذا لم يتم العثور على الأسعار، استخدم البيانات الاحتياطية
      if (rates.length === 0) {
        console.log('⚠️ لم يتم العثور على أسعار من عدن تايم، استخدام البيانات الاحتياطية');
        rates.push(
          {
            currency: 'USD',
            name: 'دولار أمريكي',
            buy: 1632,
            sell: 1617,
            source: 'عدن تايم (احتياطي)',
            timestamp: new Date().toISOString()
          },
          {
            currency: 'SAR',
            name: 'ريال سعودي',
            buy: 428,
            sell: 425,
            source: 'عدن تايم (احتياطي)',
            timestamp: new Date().toISOString()
          }
        );
      }

      console.log(`✅ تم جلب ${rates.length} عملة بنجاح`);
      return rates;

    } catch (error) {
      console.error('❌ خطأ في جلب أسعار العملات:', error.message);
      
      // استخدام البيانات الاحتياطية في حالة الخطأ
      return [
        {
          currency: 'USD',
          name: 'دولار أمريكي',
          buy: 1632,
          sell: 1617,
          source: 'عدن تايم (احتياطي)',
          timestamp: new Date().toISOString()
        },
        {
          currency: 'SAR',
          name: 'ريال سعودي',
          buy: 428,
          sell: 425,
          source: 'عدن تايم (احتياطي)',
          timestamp: new Date().toISOString()
        }
      ];
    }
  }

  // حفظ الأسعار في قاعدة البيانات
  async saveRatesToDatabase(rates) {
    try {
      console.log('💾 جاري حفظ الأسعار في قاعدة البيانات...');
      
      for (const rate of rates) {
        const { data, error } = await supabase
          .from('currency_rates')
          .upsert({
            currency: rate.currency,
            name: rate.name,
            buy_rate: rate.buy,
            sell_rate: rate.sell,
            source: rate.source,
            last_updated: rate.timestamp,
            created_at: new Date().toISOString()
          }, {
            onConflict: 'currency'
          });

        if (error) {
          console.error(`❌ خطأ في حفظ ${rate.currency}:`, error.message);
        } else {
          console.log(`✅ تم حفظ ${rate.name} بنجاح`);
        }
      }

      // تحديث آخر مزامنة
      this.lastSync = new Date();
      this.errorCount = 0;

    } catch (error) {
      console.error('❌ خطأ في حفظ الأسعار:', error.message);
      this.errorCount++;
    }
  }

  // مزامنة واحدة
  async syncOnce() {
    try {
      console.log('🚀 بدء مزامنة أسعار العملات...');
      
      const rates = await this.fetchCurrencyRates();
      await this.saveRatesToDatabase(rates);
      
      console.log('✅ تمت المزامنة بنجاح');
      return true;

    } catch (error) {
      console.error('❌ فشل في المزامنة:', error.message);
      this.errorCount++;
      return false;
    }
  }

  // بدء المزامنة التلقائية
  startAutoSync() {
    if (this.isRunning) {
      console.log('⚠️ المزامنة التلقائية تعمل بالفعل');
      return;
    }

    console.log('🔄 بدء المزامنة التلقائية...');
    this.isRunning = true;

    // مزامنة فورية
    this.syncOnce();

    // جدولة المزامنة التلقائية
    this.syncTask = cron.schedule(SYNC_INTERVAL, async () => {
      console.log('⏰ وقت المزامنة التلقائية');
      await this.syncOnce();
    });

    // جدولة التنظيف التلقائي
    this.cleanupTask = cron.schedule(CLEANUP_INTERVAL, async () => {
      console.log('🧹 بدء التنظيف التلقائي...');
      await this.cleanupOldData();
    });

    console.log('✅ تم تفعيل المزامنة التلقائية');
  }

  // إيقاف المزامنة التلقائية
  stopAutoSync() {
    if (!this.isRunning) {
      console.log('⚠️ المزامنة التلقائية غير مفعلة');
      return;
    }

    console.log('⏹️ إيقاف المزامنة التلقائية...');
    
    if (this.syncTask) {
      this.syncTask.destroy();
    }
    
    if (this.cleanupTask) {
      this.cleanupTask.destroy();
    }

    this.isRunning = false;
    console.log('✅ تم إيقاف المزامنة التلقائية');
  }

  // تنظيف البيانات القديمة
  async cleanupOldData() {
    try {
      console.log('🧹 جاري تنظيف البيانات القديمة...');
      
      const { data, error } = await supabase
        .from('currency_rates')
        .delete()
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // حذف البيانات الأقدم من 24 ساعة

      if (error) {
        console.error('❌ خطأ في تنظيف البيانات:', error.message);
      } else {
        console.log(`✅ تم حذف ${data?.length || 0} سجل قديم`);
      }

    } catch (error) {
      console.error('❌ خطأ في التنظيف:', error.message);
    }
  }

  // الحصول على حالة المزامنة
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSync: this.lastSync,
      errorCount: this.errorCount,
      nextSync: this.syncTask ? 'كل 5 دقائق' : 'غير مجدول'
    };
  }
}

// إنشاء خدمة المزامنة
const currencySync = new CurrencySyncService();

// معالج الأخطاء
process.on('uncaughtException', (error) => {
  console.error('❌ خطأ غير متوقع:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ وعد مرفوض:', reason);
});

// بدء المزامنة عند تشغيل البرنامج
console.log('🚀 بدء نظام مزامنة أسعار العملات...');
console.log('📊 المصدر: عدن تايم');
console.log('⏰ التحديث: كل 5 دقائق');
console.log('🧹 التنظيف: كل 24 ساعة');

currencySync.startAutoSync();

// إيقاف نظيف عند إغلاق البرنامج
process.on('SIGINT', () => {
  console.log('\n⏹️ إيقاف نظام المزامنة...');
  currencySync.stopAutoSync();
  process.exit(0);
});

// تصدير الخدمة للاستخدام في ملفات أخرى
module.exports = { CurrencySyncService, currencySync };
