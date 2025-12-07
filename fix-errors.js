const fs = require('fs');
const path = require('path');

// قائمة الملفات التي تحتاج إصلاح
const filesToFix = [
  'client/src/pages/emergency.tsx',
  'client/src/pages/flights.tsx',
  'client/src/pages/digital-library.tsx',
  'client/src/pages/electricity/calculator.tsx',
  'client/src/pages/electricity/charging-points.tsx',
  'client/src/pages/electricity/electrician.tsx',
  'client/src/pages/electricity/power-converters.tsx',
  'client/src/pages/water/bulk-water.tsx',
  'client/src/pages/water/consumption-calculator.tsx',
  'client/src/pages/water/emergency-pumps.tsx',
  'client/src/pages/water/home-tanks.tsx',
  'client/src/pages/water/mobile-tankers.tsx',
  'client/src/pages/water/tank-maintenance.tsx',
  'client/src/pages/water/water-points.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // إصلاح الأخطاء الشائعة
    content = content
      // إصلاح missing closing braces
      .replace(/(\s+)(\}, \[\]\);\s*$)/gm, '$1$2\n}')
      // إصلاح missing semicolons
      .replace(/(\s+)(\}, \[\]\);\s*$)/gm, '$1$2;')
      // إصلاح JSX structure
      .replace(/(\s+)(<\/main>\s*<AppFooter \/>\s*<\/div>\s*$)/gm, '$1$2')
      // إصلاح missing closing tags
      .replace(/(\s+)(<\/div>\s*$)/gm, '$1$2');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// إصلاح جميع الملفات
filesToFix.forEach(fixFile);
console.log('All files fixed!');
