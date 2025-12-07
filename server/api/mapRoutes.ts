// API routes للخريطة - Cursor الأسطوري
import { Router } from 'express';
import { supabaseCollectiveConfirmationService } from '../../client/src/services/supabaseCollectiveConfirmationService';
import { Request, Response } from 'express';

const router = Router();

// الحصول على بيانات الخريطة
router.get('/data', async (req: Request, res: Response) => {
  try {
    const districts = ['كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 'خور مكسر'];
    
    // الحصول على حالات التأكيد لجميع المديريات
    const mapData = await Promise.all(
      districts.map(async (district) => {
        const confirmationStatus = await supabaseCollectiveConfirmationService.getConfirmationStatus(district);
        
        // بيانات المديرية الأساسية
        const districtData = {
          id: district.toLowerCase().replace(/\s+/g, '-'),
          name: district,
          nameEn: district,
          coordinates: getDistrictCoordinates(district),
          bounds: getDistrictBounds(district),
          population: getDistrictPopulation(district),
          area: getDistrictArea(district),
          lastUpdate: new Date(),
          confirmationCount: 0,
          uniqueUsers: 0,
          isConfirmed: false,
          status: 'unknown' as const
        };

        if (confirmationStatus) {
          return {
            ...districtData,
            status: confirmationStatus.status as any,
            confirmationCount: confirmationStatus.confirmationCount,
            uniqueUsers: confirmationStatus.uniqueUsers,
            isConfirmed: confirmationStatus.isConfirmed,
            confirmedAt: confirmationStatus.confirmedAt,
            expiresAt: confirmationStatus.expiresAt
          };
        }

        return districtData;
      })
    );

    res.json({
      success: true,
      data: {
        districts: mapData,
        lastUpdated: new Date().toISOString(),
        totalDistricts: mapData.length,
        confirmedDistricts: mapData.filter(d => d.isConfirmed).length
      }
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات الخريطة:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// الحصول على البلاغات للخريطة
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const { limit = 50, district } = req.query;
    
    // هنا يمكن إضافة منطق لجلب البلاغات من قاعدة البيانات
    // حالياً نعيد بيانات تجريبية
    
    const mockReports = [
      {
        id: 'report_001',
        district: 'كريتر',
        status: 'on',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        coordinates: [12.7794, 45.0369],
        deviceFingerprint: 'device_001',
        isNew: false
      },
      {
        id: 'report_002',
        district: 'المعلا',
        status: 'partial',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        coordinates: [12.8000, 45.0000],
        deviceFingerprint: 'device_002',
        isNew: false
      },
      {
        id: 'report_003',
        district: 'التواهي',
        status: 'off',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        coordinates: [12.8200, 45.0200],
        deviceFingerprint: 'device_003',
        isNew: false
      }
    ];

    let filteredReports = mockReports;
    if (district) {
      filteredReports = mockReports.filter(report => report.district === district);
    }

    res.json({
      success: true,
      data: {
        reports: filteredReports.slice(0, Number(limit)),
        total: filteredReports.length,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('خطأ في جلب بلاغات الخريطة:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// الحصول على إحصائيات الخريطة
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const statistics = await collectiveConfirmationService.getReportStatistics();
    
    res.json({
      success: true,
      data: {
        ...statistics,
        mapStats: {
          totalDistricts: 6,
          activeDistricts: 4,
          confirmedDistricts: 3,
          lastUpdated: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('خطأ في جلب إحصائيات الخريطة:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// تحديث حالة المديرية
router.put('/district/:district/status', async (req: Request, res: Response) => {
  try {
    const { district } = req.params;
    const { status } = req.body;
    
    // التحقق من صحة الحالة
    const validStatuses = ['on', 'off', 'partial', 'unknown'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة'
      });
    }

    // التحقق من التأكيد الجماعي
    const confirmationResult = await collectiveConfirmationService.checkCollectiveConfirmation(district, status);
    
    res.json({
      success: true,
      data: {
        district,
        status,
        ...confirmationResult
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث حالة المديرية:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// دوال مساعدة
function getDistrictCoordinates(district: string): [number, number] {
  const coordinates: Record<string, [number, number]> = {
    'كريتر': [12.7794, 45.0369],
    'المعلا': [12.8000, 45.0000],
    'التواهي': [12.8200, 45.0200],
    'المنصورة': [12.8273, 44.9908],
    'الشيخ عثمان': [12.7800, 44.9800],
    'خور مكسر': [12.7800, 44.9800]
  };
  
  return coordinates[district] || [12.8000, 45.0000];
}

function getDistrictBounds(district: string): [[number, number], [number, number]] {
  const bounds: Record<string, [[number, number], [number, number]]> = {
    'كريتر': [[12.7600, 45.0200], [12.8000, 45.0600]],
    'المعلا': [[12.7800, 44.9800], [12.8200, 45.0200]],
    'التواهي': [[12.8000, 45.0000], [12.8400, 45.0400]],
    'المنصورة': [[12.8100, 44.9700], [12.8500, 45.0100]],
    'الشيخ عثمان': [[12.7600, 44.9600], [12.8000, 45.0000]],
    'خور مكسر': [[12.7600, 44.9600], [12.8000, 45.0000]]
  };
  
  return bounds[district] || [[12.7000, 44.9000], [12.9000, 45.1000]];
}

function getDistrictPopulation(district: string): number {
  const populations: Record<string, number> = {
    'كريتر': 150000,
    'المعلا': 120000,
    'التواهي': 80000,
    'المنصورة': 200000,
    'الشيخ عثمان': 180000,
    'خور مكسر': 160000
  };
  
  return populations[district] || 100000;
}

function getDistrictArea(district: string): number {
  const areas: Record<string, number> = {
    'كريتر': 15.2,
    'المعلا': 12.8,
    'التواهي': 8.5,
    'المنصورة': 18.3,
    'الشيخ عثمان': 16.7,
    'خور مكسر': 14.2
  };
  
  return areas[district] || 10.0;
}

export default router;
