// مزامنة سريعة لأسعار العملات
// Cursor الأسطوري - مزامنة فورية

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// إعدادات Supabase
const supabaseUrl = 'https://yyscldfxdfhequxcyiao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5c2NsZGZ4ZGZoZXF1eGN5aWFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUyMDE4MywiZXhwIjoyMDczMDk2MTgzfQ.iCpM9GxO_c7OyezD5X5kaQMNZfdtz6AGrHhctqOn-Dc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncCurrencyRates() {
  try {
    console.log('🚀 بدء مزامنة أسعار العملات...');
    
    // جلب البيانات من عدن تايم
    console.log('📡 جاري الاتصال بـ عدن تايم...');
    const response = await axios.get('https://www.aden-tm.net/news/345502', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    const rates = [];

    // استخراج أسعار الدولار
    const htmlText = $.text();
    const usdMatch = htmlText.match(/دولار\s*امريكي\s*=\s*(\d+)\s*:\s*(\d+)/i);
    
    if (usdMatch) {
      rates.push({
        currency: 'USD',
        name: 'دولار أمريكي',
        buy: parseFloat(usdMatch[1]),
        sell: parseFloat(usdMatch[2]),
        source: 'عدن تايم'
      });
      console.log(`✅ تم استخراج سعر الدولار: ${usdMatch[1]}:${usdMatch[2]}`);
    }

    // استخراج أسعار الريال السعودي
    const sarMatch = htmlText.match(/ريال\s*سعودي\s*=\s*(\d+)\s*:\s*(\d+)/i);
    
    if (sarMatch) {
      rates.push({
        currency: 'SAR',
        name: 'ريال سعودي',
        buy: parseFloat(sarMatch[1]),
        sell: parseFloat(sarMatch[2]),
        source: 'عدن تايم'
      });
      console.log(`✅ تم استخراج سعر الريال: ${sarMatch[1]}:${sarMatch[2]}`);
    }

    // إذا لم يتم العثور على الأسعار، استخدم البيانات الاحتياطية
    if (rates.length === 0) {
      console.log('⚠️ لم يتم العثور على أسعار، استخدام البيانات الاحتياطية');
      rates.push(
        {
          currency: 'USD',
          name: 'دولار أمريكي',
          buy: 1632,
          sell: 1617,
          source: 'عدن تايم (احتياطي)'
        },
        {
          currency: 'SAR',
          name: 'ريال سعودي',
          buy: 428,
          sell: 425,
          source: 'عدن تايم (احتياطي)'
        }
      );
    }

    // حفظ البيانات في قاعدة البيانات
    console.log('💾 جاري حفظ البيانات في قاعدة البيانات...');
    
    for (const rate of rates) {
      const { data, error } = await supabase
        .from('currency_rates')
        .upsert({
          currency: rate.currency,
          name: rate.name,
          buy_rate: rate.buy,
          sell_rate: rate.sell,
          source: rate.source,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'currency'
        });

      if (error) {
        console.error(`❌ خطأ في حفظ ${rate.currency}:`, error.message);
      } else {
        console.log(`✅ تم حفظ ${rate.name}: ${rate.buy}:${rate.sell}`);
      }
    }

    console.log('🎉 تمت المزامنة بنجاح!');
    
    // عرض البيانات المحفوظة
    const { data: savedRates, error: fetchError } = await supabase
      .from('currency_rates')
      .select('*')
      .order('last_updated', { ascending: false });

    if (!fetchError && savedRates) {
      console.log('\n📊 الأسعار المحفوظة:');
      savedRates.forEach(rate => {
        console.log(`  ${rate.name}: ${rate.buy_rate}:${rate.sell_rate} (${rate.source})`);
      });
    }

  } catch (error) {
    console.error('❌ خطأ في المزامنة:', error.message);
    
    // محاولة حفظ البيانات الاحتياطية
    try {
      console.log('🔄 محاولة حفظ البيانات الاحتياطية...');
      
      const fallbackRates = [
        {
          currency: 'USD',
          name: 'دولار أمريكي',
          buy: 1632,
          sell: 1617,
          source: 'عدن تايم (احتياطي)'
        },
        {
          currency: 'SAR',
          name: 'ريال سعودي',
          buy: 428,
          sell: 425,
          source: 'عدن تايم (احتياطي)'
        }
      ];

      for (const rate of fallbackRates) {
        const { error } = await supabase
          .from('currency_rates')
          .upsert({
            currency: rate.currency,
            name: rate.name,
            buy_rate: rate.buy,
            sell_rate: rate.sell,
            source: rate.source,
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          }, {
            onConflict: 'currency'
          });

        if (!error) {
          console.log(`✅ تم حفظ ${rate.name} (احتياطي)`);
        }
      }
    } catch (fallbackError) {
      console.error('❌ فشل في حفظ البيانات الاحتياطية:', fallbackError.message);
    }
  }
}

// تشغيل المزامنة
syncCurrencyRates();
