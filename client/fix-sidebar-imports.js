const fs = require('fs');
const path = require('path');

// قائمة الملفات التي تحتوي على مراجع Sidebar
const files = [
  'src/pages/maps.tsx',
  'src/pages/water/home-tanks.tsx',
  'src/pages/health-news.tsx',
  'src/pages/profile.tsx',
  'src/pages/adeni-assistant.tsx',
  'src/pages/health-alerts.tsx',
  'src/pages/motorcycle-taxi.tsx',
  'src/pages/health-evaluation.tsx',
  'src/pages/scholarships.tsx',
  'src/pages/education-news.tsx',
  'src/pages/private-tutors.tsx',
  'src/pages/digital-library.tsx',
  'src/pages/parent-services.tsx',
  'src/pages/schools-directory.tsx',
  'src/pages/flights.tsx',
  'src/pages/notifications.tsx',
  'src/pages/settings.tsx',
  'src/pages/health-appointments.tsx',
  'src/pages/restaurants.tsx',
  'src/pages/donations.tsx',
  'src/pages/universities-directory.tsx',
  'src/pages/emergency.tsx',
  'src/pages/online-registration.tsx',
  'src/pages/phone-consultation.tsx',
  'src/pages/health-facilities.tsx',
  'src/pages/water/consumption-calculator.tsx',
  'src/pages/jobs/JobListingsPage.tsx',
  'src/pages/electricity/power-converters.tsx',
  'src/pages/electricity/electrician.tsx',
  'src/pages/electricity/charging-points.tsx',
  'src/pages/electricity/calculator.tsx',
  'src/pages/blood-donors.tsx',
  'src/pages/blood-bank.tsx',
  'src/pages/register-donor.tsx',
  'src/pages/water/mobile-tankers.tsx',
  'src/pages/water/emergency-pumps.tsx',
  'src/pages/blood-requests.tsx',
  'src/pages/water/tank-maintenance.tsx',
  'src/pages/water/bulk-water.tsx',
  'src/pages/water/water-points.tsx',
  'src/pages/not-found.tsx',
  'src/pages/jobs/QuickPostJob.tsx',
  'src/pages/health-maps.tsx',
  'src/pages/education.tsx',
  'src/pages/health.tsx',
  'src/pages/currency-rates.tsx'
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // إزالة import Sidebar
    content = content.replace(/import Sidebar from "@\/components\/Sidebar";\n?/g, '');
    
    // إزالة مراجع Sidebar في JSX
    content = content.replace(/<Sidebar[^>]*\/>/g, '');
    content = content.replace(/<Sidebar[^>]*>[\s\S]*?<\/Sidebar>/g, '');
    
    // إزالة متغيرات sidebar
    content = content.replace(/const \[sidebarOpen, setSidebarOpen\] = useState\(false\);\n?/g, '');
    content = content.replace(/const \[sidebarCollapsed, setSidebarCollapsed\] = useState\(false\);\n?/g, '');
    content = content.replace(/const handleToggleCollapse = \(\) => \{\n\s*setSidebarCollapsed\(!sidebarCollapsed\);\n\s*\};\n?/g, '');
    
    // إزالة Menu من imports
    content = content.replace(/, Menu/g, '');
    content = content.replace(/Menu, /g, '');
    content = content.replace(/Menu/g, '');
    
    // إزالة sidebar toggle buttons
    content = content.replace(/{\/\* Sidebar Toggle Button[^}]*\}/g, '');
    content = content.replace(/<div[^>]*sidebar.*?<\/div>/gs, '');
    
    // إزالة sidebar classes من main content
    content = content.replace(/className=\{`flex-1 transition-all duration-300 \$\{sidebarCollapsed \? 'lg:ml-16' : 'lg:ml-80'\}`\}/g, 'className="flex-1"');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All Sidebar references removed!');

















