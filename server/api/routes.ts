// نقاط API المفقودة - Cursor الأسطوري
import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import electricityRoutes from './electricityRoutes';
import mapRoutes from './mapRoutes';

const router = Router();

// ===== أقسام البيانات الأساسية =====

// 1. قسم الكهرباء
router.get('/electricity/status', async (req: Request, res: Response) => {
  try {
    const status = {
      totalCustomers: 150000,
      totalCapacity: 275,
      currentLoad: 220,
      loadPercentage: 80,
      outages: [
        {
          id: 'outage_001',
          area: 'كريتر',
          startTime: '2025-09-09T08:00:00Z',
          endTime: '2025-09-09T12:00:00Z',
          reason: 'صيانة دورية',
          status: 'planned',
          severity: 'medium',
          affectedCustomers: 2500
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: status,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب بيانات الكهرباء',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 2. قسم المياه
router.get('/water/status', async (req: Request, res: Response) => {
  try {
    const status = {
      totalStations: 15,
      operationalStations: 12,
      maintenanceStations: 3,
      waterQuality: 'good',
      pressure: 'normal',
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: status,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب بيانات المياه',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 3. قسم الصحة
router.get('/health/facilities', async (req: Request, res: Response) => {
  try {
    // استيراد البيانات الحقيقية
    const { adenHealthFacilities } = await import('../../client/src/data/aden-health-facilities');
    
    res.json({
      success: true,
      data: adenHealthFacilities,
      total: adenHealthFacilities.length,
      source: 'real-data'
    });
  } catch (error) {
    // في حالة فشل استيراد البيانات الحقيقية، استخدم البيانات الافتراضية
    const facilities = [
      {
        id: 'health_001',
        name: 'مستشفى الجمهورية',
        type: 'hospital',
        location: 'كريتر',
        status: 'operational',
        services: ['طوارئ', 'جراحة', 'أطفال'],
        contact: '+967-2-234567'
      },
      {
        id: 'health_002',
        name: 'مستشفى الشيخ عثمان',
        type: 'hospital',
        location: 'الشيخ عثمان',
        status: 'operational',
        services: ['طوارئ', 'أمراض باطنية'],
        contact: '+967-2-345678'
      }
    ];
    
    res.json({
      success: true,
      data: facilities,
      total: facilities.length,
      source: 'fallback-data'
    });
  }
});

// 4. قسم التعليم
router.get('/education/facilities', async (req: Request, res: Response) => {
  try {
    const facilities = [
      {
        id: 'edu_001',
        name: 'جامعة عدن',
        type: 'university',
        location: 'كريتر',
        status: 'operational',
        programs: ['طب', 'هندسة', 'آداب'],
        contact: '+967-2-456789'
      },
      {
        id: 'edu_002',
        name: 'مدرسة عدن الثانوية',
        type: 'school',
        location: 'خور مكسر',
        status: 'operational',
        programs: ['علمي', 'أدبي'],
        contact: '+967-2-567890'
      }
    ];
    
    res.json({
      success: true,
      data: facilities,
      total: facilities.length,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب بيانات المرافق التعليمية',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 5. قسم الطوارئ
router.get('/emergency/services', async (req: Request, res: Response) => {
  try {
    const services = [
      {
        id: 'emergency_001',
        name: 'الشرطة',
        type: 'police',
        number: '199',
        location: 'عدن',
        status: 'available',
        responseTime: '5-10 دقائق'
      },
      {
        id: 'emergency_002',
        name: 'الإسعاف',
        type: 'ambulance',
        number: '191',
        location: 'عدن',
        status: 'available',
        responseTime: '10-15 دقيقة'
      },
      {
        id: 'emergency_003',
        name: 'الإطفاء',
        type: 'fire',
        number: '198',
        location: 'عدن',
        status: 'available',
        responseTime: '8-12 دقيقة'
      }
    ];
    
    res.json({
      success: true,
      data: services,
      total: services.length,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب بيانات خدمات الطوارئ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 6. قسم الوظائف
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    // محاكاة بيانات الوظائف
    const allJobs = [
      {
        id: 'job_001',
        title: 'مطور ويب',
        company: 'شركة التقنية المتقدمة',
        location: 'عدن',
        category: 'تقني',
        type: 'دوام كامل',
        salary: '500,000 - 800,000 ريال',
        description: 'نبحث عن مطور ويب ذو خبرة في React و Node.js',
        requirements: ['خبرة 2+ سنة', 'React', 'Node.js', 'TypeScript'],
        postedAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'job_002',
        title: 'سائق',
        company: 'شركة النقل السريع',
        location: 'عدن',
        category: 'سائق',
        type: 'دوام كامل',
        salary: '300,000 - 400,000 ريال',
        description: 'نبحث عن سائق ذو خبرة في قيادة الشاحنات',
        requirements: ['رخصة قيادة', 'خبرة 3+ سنة', 'معرفة بالطرق'],
        postedAt: new Date().toISOString(),
        status: 'active'
      }
    ];
    
    // فلترة حسب الفئة
    let filteredJobs = allJobs;
    if (category) {
      filteredJobs = allJobs.filter(job => job.category === category);
    }
    
    // فلترة حسب البحث
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // ترقيم الصفحات
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedJobs,
      total: filteredJobs.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(filteredJobs.length / Number(limit)),
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب بيانات الوظائف',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 7. قسم العملات
router.get('/currency/rates', async (req: Request, res: Response) => {
  try {
    const rates = [
      {
        currency: 'USD',
        name: 'دولار أمريكي',
        buy: 1632,
        sell: 1617,
        change: 0.15,
        lastUpdate: new Date().toISOString(),
        source: 'عدن تايم'
      },
      {
        currency: 'SAR',
        name: 'ريال سعودي',
        buy: 428,
        sell: 425,
        change: 0.05,
        lastUpdate: new Date().toISOString(),
        source: 'عدن تايم'
      }
    ];
    
    res.json({
      success: true,
      data: rates,
      lastUpdated: new Date().toISOString(),
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب أسعار العملات',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 8. قسم الإحصائيات العامة
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const stats = {
      totalUsers: 15000,
      activeUsers: 8500,
      totalJobs: 1250,
      activeJobs: 890,
      totalFacilities: 450,
      operationalFacilities: 420,
      systemUptime: '99.9%',
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: stats,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب الإحصائيات',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 9. قسم البحث العام
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'مطلوب مصطلح البحث'
      });
    }
    
    // محاكاة نتائج البحث
    const searchResults = {
      jobs: [
        {
          id: 'job_001',
          title: 'مطور ويب',
          company: 'شركة التقنية المتقدمة',
          type: 'job',
          relevance: 0.95
        }
      ],
      facilities: [
        {
          id: 'health_001',
          name: 'مستشفى الجمهورية',
          type: 'health',
          relevance: 0.85
        }
      ],
      services: [
        {
          id: 'service_001',
          name: 'خدمة الكهرباء',
          type: 'utility',
          relevance: 0.90
        }
      ]
    };
    
    res.json({
      success: true,
      data: searchResults,
      query: q,
      total: Object.values(searchResults).flat().length,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في البحث',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 10. قسم بنك الدم
router.get('/blood-banks', async (req: Request, res: Response) => {
  try {
    const bloodBanks = [
      {
        id: 'bb_001',
        name: 'بنك الدم الرئيسي - عدن',
        location: 'كريتر، شارع الملك فيصل',
        contact: '+967-2-234567',
        bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        status: 'available',
        workingHours: '24/7',
        capacity: 1000,
        currentStock: 750
      },
      {
        id: 'bb_002',
        name: 'بنك الدم - الشيخ عثمان',
        location: 'الشيخ عثمان، شارع الجمهورية',
        contact: '+967-2-345678',
        bloodTypes: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
        status: 'available',
        workingHours: '8:00 - 20:00',
        capacity: 500,
        currentStock: 320
      }
    ];
    
    res.json({
      success: true,
      data: bloodBanks,
      total: bloodBanks.length,
      source: 'internal-api'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'فشل في جلب بيانات بنوك الدم',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 11. قسم الصحة العامة للـ API
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    uptime: process.uptime()
  });
});

// استخدام routes الكهرباء
router.use('/electricity', electricityRoutes);

// استخدام routes الخريطة
router.use('/map', mapRoutes);

export default router;
