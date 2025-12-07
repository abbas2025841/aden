import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { jobs, healthFacilities, bloodBanks, currencyRates, systemStats } from './schema';
import { mockJobs } from '../../client/src/data/jobs-enhanced';

// إعداد الاتصال بقاعدة البيانات
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/adenlive';
const client = postgres(connectionString);
const db = drizzle(client);

// بيانات وهمية للمرافق الصحية
const mockHealthFacilities = [
  {
    id: 'hf-001',
    name: 'مستشفى الجمهورية التعليمي',
    type: 'hospital' as const,
    location: 'شارع الجمهورية، كريتر',
    district: 'كريتر',
    contact: '+967-2-234567',
    services: ['طوارئ', 'جراحة', 'أطفال', 'نساء وولادة', 'عيون', 'أنف وأذن وحنجرة'],
    status: 'operational' as const,
    workingHours: '24/7',
    emergency: true,
    coordinates: { lat: 12.7794, lng: 45.0367 },
    rating: 4.5
  },
  {
    id: 'hf-002',
    name: 'مستشفى الصداقة اليمني الألماني',
    type: 'hospital' as const,
    location: 'منطقة المطار، خور مكسر',
    district: 'خور مكسر',
    contact: '+967-2-345678',
    services: ['طوارئ', 'جراحة', 'أطفال', 'نساء وولادة', 'قلب', 'عظام'],
    status: 'operational' as const,
    workingHours: '24/7',
    emergency: true,
    coordinates: { lat: 12.8294, lng: 45.0267 },
    rating: 4.8
  },
  {
    id: 'hf-003',
    name: 'مستشفى عدن العام',
    type: 'hospital' as const,
    location: 'شارع الصحة، المنصورة',
    district: 'المنصورة',
    contact: '+967-2-456789',
    services: ['طوارئ', 'جراحة', 'أطفال', 'نساء وولادة', 'باطنية', 'جلدية'],
    status: 'operational' as const,
    workingHours: '24/7',
    emergency: true,
    coordinates: { lat: 12.7894, lng: 45.0467 },
    rating: 4.2
  },
  {
    id: 'hf-004',
    name: 'عيادة عدن التخصصية',
    type: 'clinic' as const,
    location: 'شارع الملكة أروى، المعلا',
    district: 'المعلا',
    contact: '+967-2-567890',
    services: ['باطنية', 'عيون', 'أنف وأذن وحنجرة', 'جلدية', 'أطفال'],
    status: 'operational' as const,
    workingHours: '8:00 ص - 10:00 م',
    emergency: false,
    coordinates: { lat: 12.7594, lng: 45.0567 },
    rating: 4.3
  },
  {
    id: 'hf-005',
    name: 'صيدلية عدن المركزية',
    type: 'pharmacy' as const,
    location: 'شارع الجمهورية، كريتر',
    district: 'كريتر',
    contact: '+967-2-678901',
    services: ['أدوية', 'مستلزمات طبية', 'استشارات صيدلانية'],
    status: 'operational' as const,
    workingHours: '8:00 ص - 12:00 م',
    emergency: false,
    coordinates: { lat: 12.7794, lng: 45.0367 },
    rating: 4.0
  }
];

// بيانات وهمية لبنوك الدم
const mockBloodBanks = [
  {
    id: 'bb-001',
    name: 'بنك الدم - مستشفى الجمهورية',
    location: 'مستشفى الجمهورية التعليمي، كريتر',
    district: 'كريتر',
    contact: '+967-2-234567',
    bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    status: 'available' as const,
    workingHours: '24/7',
    capacity: 1000,
    currentStock: 750,
    aPosStock: 120,
    aNegStock: 80,
    bPosStock: 100,
    bNegStock: 70,
    abPosStock: 60,
    abNegStock: 40,
    oPosStock: 200,
    oNegStock: 80,
    coordinates: { lat: 12.7794, lng: 45.0367 }
  },
  {
    id: 'bb-002',
    name: 'بنك الدم - مستشفى الصداقة',
    location: 'مستشفى الصداقة اليمني الألماني، خور مكسر',
    district: 'خور مكسر',
    contact: '+967-2-345678',
    bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    status: 'available' as const,
    workingHours: '24/7',
    capacity: 800,
    currentStock: 600,
    aPosStock: 90,
    aNegStock: 60,
    bPosStock: 80,
    bNegStock: 50,
    abPosStock: 45,
    abNegStock: 30,
    oPosStock: 150,
    oNegStock: 60,
    coordinates: { lat: 12.8294, lng: 45.0267 }
  }
];

// بيانات وهمية لأسعار العملات
const mockCurrencyRates = [
  {
    id: 'cr-001',
    currency: 'USD',
    name: 'الدولار الأمريكي',
    buy: 530,
    sell: 535,
    change: 5,
    source: 'البنك المركزي اليمني'
  },
  {
    id: 'cr-002',
    currency: 'SAR',
    name: 'الريال السعودي',
    buy: 140,
    sell: 142,
    change: 2,
    source: 'البنك المركزي اليمني'
  },
  {
    id: 'cr-003',
    currency: 'AED',
    name: 'الدرهم الإماراتي',
    buy: 144,
    sell: 146,
    change: 1,
    source: 'البنك المركزي اليمني'
  },
  {
    id: 'cr-004',
    currency: 'EUR',
    name: 'اليورو الأوروبي',
    buy: 580,
    sell: 585,
    change: -3,
    source: 'البنك المركزي اليمني'
  }
];

// بيانات وهمية لإحصائيات النظام
const mockSystemStats = [
  {
    id: 'stats-001',
    totalUsers: 1250,
    activeUsers: 890,
    totalJobs: 156,
    activeJobs: 142,
    totalFacilities: 45,
    operationalFacilities: 42,
    systemUptime: '99.8%'
  }
];

// دالة لتحويل بيانات الوظائف إلى تنسيق قاعدة البيانات
function convertJobToDbFormat(job: any) {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    location: JSON.stringify(job.location),
    category: job.category,
    salary: job.salary ? JSON.stringify(job.salary) : null,
    company: job.company,
    companyName: job.companyName || null,
    type: job.type,
    jobType: job.jobType || null,
    postedDate: job.postedDate,
    experience: job.experience,
    experienceLevel: job.experienceLevel || null,
    education: job.education || null,
    requirements: JSON.stringify(job.requirements),
    responsibilities: job.responsibilities ? JSON.stringify(job.responsibilities) : null,
    benefits: job.benefits ? JSON.stringify(job.benefits) : null,
    contact: job.contact ? JSON.stringify(job.contact) : null,
    isFeatured: job.isFeatured || false,
    featured: job.featured || false,
    isUrgent: job.isUrgent || false,
    isRemote: job.isRemote || false,
    isActive: job.isActive !== undefined ? job.isActive : true,
    views: job.views || 0,
    applicants: job.applicants || 0,
    tags: job.tags ? JSON.stringify(job.tags) : null,
    rating: job.rating || null,
    workingHours: job.workingHours || null,
    gender: job.gender || null,
    ageRange: job.ageRange ? JSON.stringify(job.ageRange) : null,
    languages: job.languages ? JSON.stringify(job.languages) : null
  };
}

// دالة البذر الرئيسية
export async function seedDatabase() {
  try {
    console.log('🌱 بدء عملية بذر قاعدة البيانات...');

    // بذر الوظائف
    console.log('📝 بذر الوظائف...');
    const dbJobs = mockJobs.map(convertJobToDbFormat);
    await db.insert(jobs).values(dbJobs);
    console.log(`✅ تم بذر ${dbJobs.length} وظيفة`);

    // بذر المرافق الصحية
    console.log('🏥 بذر المرافق الصحية...');
    await db.insert(healthFacilities).values(mockHealthFacilities);
    console.log(`✅ تم بذر ${mockHealthFacilities.length} مرفق صحي`);

    // بذر بنوك الدم
    console.log('🩸 بذر بنوك الدم...');
    await db.insert(bloodBanks).values(mockBloodBanks);
    console.log(`✅ تم بذر ${mockBloodBanks.length} بنك دم`);

    // بذر أسعار العملات
    console.log('💰 بذر أسعار العملات...');
    await db.insert(currencyRates).values(mockCurrencyRates);
    console.log(`✅ تم بذر ${mockCurrencyRates.length} عملة`);

    // بذر إحصائيات النظام
    console.log('📊 بذر إحصائيات النظام...');
    await db.insert(systemStats).values(mockSystemStats);
    console.log(`✅ تم بذر إحصائيات النظام`);

    console.log('🎉 تم بذر قاعدة البيانات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في بذر قاعدة البيانات:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// تشغيل البذر إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ تم إكمال عملية البذر');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ فشل في عملية البذر:', error);
      process.exit(1);
    });
}
