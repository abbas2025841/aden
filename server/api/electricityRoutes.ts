// API routes للكهرباء والتأكيد الجماعي - Cursor الأسطوري
import { Router } from 'express';
import { supabaseCollectiveConfirmationService } from '../../client/src/services/supabaseCollectiveConfirmationService';
import { Request, Response } from 'express';

const router = Router();

// إرسال بلاغ كهرباء
router.post('/report', async (req: Request, res: Response) => {
  try {
    const { district, status, userAgent, deviceFingerprint, location } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!district || !status || !deviceFingerprint) {
      return res.status(400).json({
        success: false,
        message: 'البيانات المطلوبة مفقودة'
      });
    }

    // التحقق من صحة الحالة
    const validStatuses = ['on', 'off', 'partial', 'unknown'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة'
      });
    }

    // إرسال البلاغ
    const result = await supabaseCollectiveConfirmationService.submitReport({
      district,
      status,
      userAgent: userAgent || req.get('User-Agent') || '',
      deviceFingerprint,
      ipAddress: req.ip || req.connection.remoteAddress,
      location
    });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('خطأ في إرسال البلاغ:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// الحصول على حالة التأكيد
router.get('/confirmation/:district', async (req: Request, res: Response) => {
  try {
    const { district } = req.params;
    
    const confirmationStatus = await supabaseCollectiveConfirmationService.getConfirmationStatus(district);
    
    if (confirmationStatus) {
      res.json({
        success: true,
        data: confirmationStatus
      });
    } else {
      // التحقق من البلاغات الحالية
      const currentStatus = await supabaseCollectiveConfirmationService.checkCollectiveConfirmation(district, 'on');
      const offStatus = await supabaseCollectiveConfirmationService.checkCollectiveConfirmation(district, 'off');
      
      res.json({
        success: true,
        data: {
          district,
          status: 'unknown',
          isConfirmed: false,
          confirmationCount: Math.max(currentStatus.confirmationCount, offStatus.confirmationCount),
          uniqueUsers: Math.max(currentStatus.uniqueUsers, offStatus.uniqueUsers),
          timeRemaining: Math.max(currentStatus.timeRemaining || 0, offStatus.timeRemaining || 0)
        }
      });
    }

  } catch (error) {
    console.error('خطأ في الحصول على حالة التأكيد:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// الحصول على إحصائيات البلاغات
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const { district } = req.query;
    
    const statistics = await supabaseCollectiveConfirmationService.getReportStatistics(
      district as string
    );
    
    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('خطأ في الحصول على الإحصائيات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// الحصول على جميع حالات التأكيد
router.get('/confirmations', async (req: Request, res: Response) => {
  try {
    const districts = ['كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 'خور مكسر'];
    
    const confirmations = await Promise.all(
      districts.map(async (district) => {
        const status = await supabaseCollectiveConfirmationService.getConfirmationStatus(district);
        return {
          district,
          ...status
        };
      })
    );
    
    res.json({
      success: true,
      data: confirmations
    });

  } catch (error) {
    console.error('خطأ في الحصول على حالات التأكيد:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// تنظيف البيانات المنتهية الصلاحية
router.post('/cleanup', async (req: Request, res: Response) => {
  try {
    await supabaseCollectiveConfirmationService.cleanupExpiredData();
    
    res.json({
      success: true,
      message: 'تم تنظيف البيانات بنجاح'
    });

  } catch (error) {
    console.error('خطأ في تنظيف البيانات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// الحصول على تفاصيل البلاغ
router.get('/report/:reportId', async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    // هنا يمكن إضافة منطق للحصول على تفاصيل البلاغ
    // من قاعدة البيانات
    
    res.json({
      success: true,
      message: 'تفاصيل البلاغ',
      data: { reportId }
    });

  } catch (error) {
    console.error('خطأ في الحصول على تفاصيل البلاغ:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

// تحديث حالة التأكيد
router.put('/confirmation/:district', async (req: Request, res: Response) => {
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
    const confirmationResult = await supabaseCollectiveConfirmationService.checkCollectiveConfirmation(district, status);
    
    res.json({
      success: true,
      data: confirmationResult
    });

  } catch (error) {
    console.error('خطأ في تحديث حالة التأكيد:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

export default router;
