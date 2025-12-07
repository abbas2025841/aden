const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// إعدادات الاختبار
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'interactive',
      'max-potential-fid',
      'uses-responsive-images',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-text-compression',
      'uses-rel-preconnect',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'efficient-animated-content',
      'preload-lcp-image',
      'color-contrast',
      'image-alt',
      'label',
      'link-name',
      'button-name',
      'html-has-lang',
      'html-lang-valid',
      'meta-description',
      'document-title',
    ],
  },
};

// URLs للاختبار
const urls = [
  {
    name: 'الصفحة الرئيسية',
    url: 'http://localhost:5000',
  },
  {
    name: 'أسعار العملات',
    url: 'http://localhost:5000/currency-rates',
  },
  {
    name: 'المرافق الصحية',
    url: 'http://localhost:5000/health-facilities',
  },
  {
    name: 'نظام التصميم',
    url: 'http://localhost:5000/design-system',
  },
  {
    name: 'إعدادات إمكانية الوصول',
    url: 'http://localhost:5000/accessibility-settings',
  },
  {
    name: 'لوحة تحكم الأداء',
    url: 'http://localhost:5000/performance-dashboard',
  },
];

// دالة تشغيل Lighthouse
async function runLighthouse(url, name) {
  console.log(`\n🔍 اختبار ${name}...`);
  console.log(`URL: ${url}`);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);
    
    // حفظ النتائج
    const reportHtml = runnerResult.report;
    const reportJson = JSON.parse(reportHtml);
    
    // إنشاء مجلد النتائج
    const resultsDir = path.join(__dirname, '../lighthouse-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    // حفظ التقرير HTML
    const htmlFileName = `${name.replace(/\s+/g, '-')}-report.html`;
    fs.writeFileSync(path.join(resultsDir, htmlFileName), reportHtml);
    
    // حفظ التقرير JSON
    const jsonFileName = `${name.replace(/\s+/g, '-')}-report.json`;
    fs.writeFileSync(path.join(resultsDir, jsonFileName), JSON.stringify(reportJson, null, 2));
    
    // عرض النتائج
    const scores = reportJson.categories;
    console.log(`\n📊 نتائج ${name}:`);
    console.log(`  الأداء: ${Math.round(scores.performance.score * 100)}/100`);
    console.log(`  إمكانية الوصول: ${Math.round(scores.accessibility.score * 100)}/100`);
    console.log(`  أفضل الممارسات: ${Math.round(scores['best-practices'].score * 100)}/100`);
    console.log(`  SEO: ${Math.round(scores.seo.score * 100)}/100`);
    
    // عرض التوصيات
    const audits = reportJson.audits;
    const failedAudits = Object.values(audits).filter(audit => audit.score !== null && audit.score < 0.9);
    
    if (failedAudits.length > 0) {
      console.log(`\n⚠️  التوصيات للتحسين:`);
      failedAudits.forEach(audit => {
        console.log(`  - ${audit.title}: ${audit.description}`);
      });
    }
    
    return {
      name,
      url,
      scores: {
        performance: Math.round(scores.performance.score * 100),
        accessibility: Math.round(scores.accessibility.score * 100),
        bestPractices: Math.round(scores['best-practices'].score * 100),
        seo: Math.round(scores.seo.score * 100),
      },
      failedAudits: failedAudits.length,
    };
    
  } catch (error) {
    console.error(`❌ خطأ في اختبار ${name}:`, error.message);
    return {
      name,
      url,
      error: error.message,
    };
  } finally {
    await chrome.kill();
  }
}

// دالة إنشاء تقرير شامل
function generateSummaryReport(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    successfulTests: results.filter(r => !r.error).length,
    failedTests: results.filter(r => r.error).length,
    averageScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    },
    results: results,
  };
  
  // حساب المتوسطات
  const successfulResults = results.filter(r => !r.error && r.scores);
  if (successfulResults.length > 0) {
    summary.averageScores.performance = Math.round(
      successfulResults.reduce((sum, r) => sum + r.scores.performance, 0) / successfulResults.length
    );
    summary.averageScores.accessibility = Math.round(
      successfulResults.reduce((sum, r) => sum + r.scores.accessibility, 0) / successfulResults.length
    );
    summary.averageScores.bestPractices = Math.round(
      successfulResults.reduce((sum, r) => sum + r.scores.bestPractices, 0) / successfulResults.length
    );
    summary.averageScores.seo = Math.round(
      successfulResults.reduce((sum, r) => sum + r.scores.seo, 0) / successfulResults.length
    );
  }
  
  return summary;
}

// الدالة الرئيسية
async function main() {
  console.log('🚀 بدء اختبارات Lighthouse لتطبيق عدن لايف');
  console.log('=' .repeat(50));
  
  const results = [];
  
  for (const test of urls) {
    const result = await runLighthouse(test.url, test.name);
    results.push(result);
    
    // انتظار قصير بين الاختبارات
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // إنشاء التقرير الشامل
  const summary = generateSummaryReport(results);
  
  // حفظ التقرير الشامل
  const resultsDir = path.join(__dirname, '../lighthouse-results');
  fs.writeFileSync(
    path.join(resultsDir, 'summary-report.json'),
    JSON.stringify(summary, null, 2)
  );
  
  // عرض التقرير النهائي
  console.log('\n' + '='.repeat(50));
  console.log('📋 التقرير النهائي');
  console.log('='.repeat(50));
  console.log(`إجمالي الاختبارات: ${summary.totalTests}`);
  console.log(`الاختبارات الناجحة: ${summary.successfulTests}`);
  console.log(`الاختبارات الفاشلة: ${summary.failedTests}`);
  console.log('\n📊 المتوسطات:');
  console.log(`  الأداء: ${summary.averageScores.performance}/100`);
  console.log(`  إمكانية الوصول: ${summary.averageScores.accessibility}/100`);
  console.log(`  أفضل الممارسات: ${summary.averageScores.bestPractices}/100`);
  console.log(`  SEO: ${summary.averageScores.seo}/100`);
  
  // تقييم عام
  const overallScore = Math.round(
    (summary.averageScores.performance + 
     summary.averageScores.accessibility + 
     summary.averageScores.bestPractices + 
     summary.averageScores.seo) / 4
  );
  
  console.log(`\n🎯 النتيجة العامة: ${overallScore}/100`);
  
  if (overallScore >= 90) {
    console.log('🎉 ممتاز! التطبيق يحقق معايير عالية');
  } else if (overallScore >= 80) {
    console.log('✅ جيد! التطبيق يحقق معايير جيدة');
  } else if (overallScore >= 70) {
    console.log('⚠️  مقبول، لكن يحتاج تحسين');
  } else {
    console.log('❌ يحتاج تحسين كبير');
  }
  
  console.log(`\n📁 تم حفظ التقارير في: ${resultsDir}`);
  console.log('🔗 افتح ملفات HTML لعرض التقارير التفصيلية');
}

// تشغيل الاختبارات
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runLighthouse, generateSummaryReport };
