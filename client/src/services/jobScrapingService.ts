// خدمة استخراج الوظائف من المواقع المختلفة
import { realJobScrapingService } from './realJobScrapingService';

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  deadline?: string;
  category: string;
  description?: string;
  salary?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  source: string;
  url: string;
  isAden: boolean;
}

export interface JobCategory {
  id: string;
  name: string;
  jobs: ScrapedJob[];
  count: number;
}

export class JobScrapingService {
  private baseUrl = 'https://yemenhr.com';
  private tanqeebUrl = 'https://yemen.tanqeeb.com';
  private adenhrUrl = 'https://adenhr.com';
  private opensooqUrl = 'https://ye.opensooq.com';
  private tendersUrl = 'https://www.tendersofyemen.com';
  private telegramUrl = 'https://t.me/s/ChancesPlatform';

  // تصنيف الوظائف حسب الأقسام مع تحسينات
  private categorizeJob(title: string, description?: string): string {
    const titleLower = title.toLowerCase();
    const descLower = (description || '').toLowerCase();
    const fullText = `${titleLower} ${descLower}`;
    
    // الوظائف الطبية والصحية
    if (fullText.includes('طبيب') || fullText.includes('ممرض') || 
        fullText.includes('صيدلي') || fullText.includes('أخصائي') ||
        fullText.includes('طبي') || fullText.includes('صحة') ||
        fullText.includes('مستشفى') || fullText.includes('عيادة') ||
        fullText.includes('doctor') || fullText.includes('nurse') ||
        fullText.includes('medical') || fullText.includes('health') ||
        fullText.includes('physician') || fullText.includes('clinic') ||
        fullText.includes('anaesthetist') || fullText.includes('surgeon') ||
        fullText.includes('paediatrician') || fullText.includes('psychiatrist')) {
      return 'medical';
    }
    
    // الوظائف التعليمية والأكاديمية
    if (fullText.includes('مدرس') || fullText.includes('معلم') ||
        fullText.includes('أستاذ') || fullText.includes('تعليم') ||
        fullText.includes('مدرسة') || fullText.includes('جامعة') ||
        fullText.includes('أكاديمي') || fullText.includes('تدريس') ||
        fullText.includes('teacher') || fullText.includes('education') ||
        fullText.includes('academic') || fullText.includes('school') ||
        fullText.includes('university') || fullText.includes('instructor')) {
      return 'education';
    }
    
    // الوظائف التقنية وتكنولوجيا المعلومات
    if (fullText.includes('مطور') || fullText.includes('برمجة') ||
        fullText.includes('تقني') || fullText.includes('كمبيوتر') ||
        fullText.includes('برمجيات') || fullText.includes('أنظمة') ||
        fullText.includes('developer') || fullText.includes('programmer') ||
        fullText.includes('technical') || fullText.includes('it') ||
        fullText.includes('software') || fullText.includes('angular') ||
        fullText.includes('frontend') || fullText.includes('backend') ||
        fullText.includes('fullstack') || fullText.includes('web')) {
      return 'technical';
    }
    
    // الوظائف الهندسية
    if (fullText.includes('مهندس') || fullText.includes('هندسة') ||
        fullText.includes('مشاريع') || fullText.includes('بناء') ||
        fullText.includes('كهرباء') || fullText.includes('طاقة') ||
        fullText.includes('engineer') || fullText.includes('engineering') ||
        fullText.includes('civil') || fullText.includes('electrical') ||
        fullText.includes('mechanical') || fullText.includes('construction') ||
        fullText.includes('renewable') || fullText.includes('solar')) {
      return 'engineering';
    }
    
    // الوظائف المالية والمحاسبية
    if (fullText.includes('محاسب') || fullText.includes('مالي') ||
        fullText.includes('حسابات') || fullText.includes('مصرفي') ||
        fullText.includes('مستشار مالي') || fullText.includes('مراجع') ||
        fullText.includes('accountant') || fullText.includes('finance') ||
        fullText.includes('financial') || fullText.includes('audit') ||
        fullText.includes('banking') || fullText.includes('accounting')) {
      return 'finance';
    }
    
    // الوظائف الإدارية والإشرافية
    if (fullText.includes('مدير') || fullText.includes('إدارة') ||
        fullText.includes('مشرف') || fullText.includes('منسق') ||
        fullText.includes('رئيس') || fullText.includes('تنفيذي') ||
        fullText.includes('manager') || fullText.includes('supervisor') ||
        fullText.includes('administrative') || fullText.includes('director') ||
        fullText.includes('executive') || fullText.includes('coordinator') ||
        fullText.includes('procurement') || fullText.includes('managing')) {
      return 'administration';
    }
    
    // الوظائف التجارية والتسويقية
    if (fullText.includes('تسويق') || fullText.includes('مبيعات') ||
        fullText.includes('تجاري') || fullText.includes('مندوب') ||
        fullText.includes('تسويقي') || fullText.includes('تجارة') ||
        fullText.includes('marketing') || fullText.includes('sales') ||
        fullText.includes('commercial') || fullText.includes('promotion') ||
        fullText.includes('outreach') || fullText.includes('business')) {
      return 'sales';
    }
    
    // الوظائف الأمنية والحماية
    if (fullText.includes('أمن') || fullText.includes('حارس') ||
        fullText.includes('حماية') || fullText.includes('أمني') ||
        fullText.includes('security') || fullText.includes('guard') ||
        fullText.includes('protection') || fullText.includes('safety')) {
      return 'security';
    }
    
    // الوظائف الخدمية والعمالية
    if (fullText.includes('خدمة') || fullText.includes('عامل') ||
        fullText.includes('نظافة') || fullText.includes('سائق') ||
        fullText.includes('عامل نظافة') || fullText.includes('خدمات') ||
        fullText.includes('service') || fullText.includes('cleaner') ||
        fullText.includes('driver') || fullText.includes('maintenance') ||
        fullText.includes('hygiene') || fullText.includes('worker')) {
      return 'service';
    }
    
    // الوظائف الإنسانية والتنموية
    if (fullText.includes('إنساني') || fullText.includes('تطوع') ||
        fullText.includes('تنمية') || fullText.includes('مجتمع') ||
        fullText.includes('humanitarian') || fullText.includes('volunteer') ||
        fullText.includes('development') || fullText.includes('community') ||
        fullText.includes('ngo') || fullText.includes('social')) {
      return 'humanitarian';
    }
    
    // الوظائف القانونية
    if (fullText.includes('محامي') || fullText.includes('قانوني') ||
        fullText.includes('قانون') || fullText.includes('عدالة') ||
        fullText.includes('lawyer') || fullText.includes('legal') ||
        fullText.includes('law') || fullText.includes('justice')) {
      return 'legal';
    }
    
    // الوظائف الإعلامية والاتصالات
    if (fullText.includes('إعلام') || fullText.includes('صحفي') ||
        fullText.includes('إذاعة') || fullText.includes('تلفزيون') ||
        fullText.includes('media') || fullText.includes('journalist') ||
        fullText.includes('communication') || fullText.includes('broadcast')) {
      return 'media';
    }
    
    return 'other';
  }

  // استخراج الوظائف من YemenHR
  async scrapeYemenHR(): Promise<ScrapedJob[]> {
    try {
      // محاكاة البيانات المستخرجة من الموقع
      const jobs: ScrapedJob[] = [
        {
          id: 'yemenhr-1',
          title: 'مدير مشاريع',
          company: 'Al-Mokbily Energy',
          location: 'Yemen',
          postedDate: '18 Sep, 25',
          deadline: '11 Oct, 25',
          category: 'administration',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/mdyr-msharyaa-al-mokbily-energy-yemen-638b0b6b',
          isAden: false
        },
        {
          id: 'yemenhr-2',
          title: 'مهندس مشاريع طاقة متجددة',
          company: 'Al-Mokbily Energy',
          location: 'Yemen',
          postedDate: '18 Sep, 25',
          deadline: '11 Oct, 25',
          category: 'engineering',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/mhnds-msharyaa-tak-mtgdd-al-mokbily-energy-yemen-b5da8d3e',
          isAden: false
        },
        {
          id: 'yemenhr-3',
          title: 'موظف تسويق',
          company: 'Al-Mokbily Energy',
          location: 'Yemen',
          postedDate: '18 Sep, 25',
          deadline: '11 Oct, 25',
          category: 'sales',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/mothf-tsoyk-al-mokbily-energy-yemen-989dceed',
          isAden: false
        },
        {
          id: 'yemenhr-4',
          title: 'First aid and Prehospital Emergency Care Officer',
          company: 'YRCS',
          location: 'Sana\'a',
          postedDate: '10 Sep, 25',
          deadline: '24 Sep, 25',
          category: 'medical',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/first-aid-and-prehospital-emergency-care-faphec-officer-yrcs-sanaa-15b1f69e',
          isAden: false
        },
        {
          id: 'yemenhr-5',
          title: 'Procurement Officer',
          company: 'YRCS',
          location: 'Sana\'a',
          postedDate: '07 Sep, 25',
          deadline: '21 Sep, 25',
          category: 'administration',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/procurement-officer-yrcs-sanaa-59dccbdc',
          isAden: false
        },
        {
          id: 'yemenhr-6',
          title: 'Senior Procurement Assistant',
          company: 'FAO',
          location: 'Sana\'a',
          postedDate: '09 Sep, 25',
          deadline: '25 Sep, 25',
          category: 'administration',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/senior-procurement-assistant-fao-sanaa-76d4c505',
          isAden: false
        },
        {
          id: 'yemenhr-7',
          title: 'مراجع حسابات',
          company: 'Confidential',
          location: 'Sana\'a',
          postedDate: '08 Sep, 25',
          deadline: '22 Sep, 25',
          category: 'finance',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/mrjy-hsabat-confidential-sanaa-8e9f2a1b',
          isAden: false
        },
        {
          id: 'yemenhr-8',
          title: 'Doctor Anaesthetist',
          company: 'MSF',
          location: 'Sa\'adah',
          postedDate: '14 Sep, 25',
          deadline: '28 Sep, 25',
          category: 'medical',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/doctor-anaesthetist-msf-saadah-3f7e8c2d',
          isAden: false
        },
        {
          id: 'yemenhr-9',
          title: 'Surgeon',
          company: 'MSF',
          location: 'Sa\'adah',
          postedDate: '14 Sep, 25',
          deadline: '28 Sep, 25',
          category: 'medical',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/surgeon-msf-saadah-7a2b9e4f',
          isAden: false
        },
        {
          id: 'yemenhr-10',
          title: 'Senior Angular Developer',
          company: 'SMA',
          location: 'Remote',
          postedDate: '26 Aug, 25',
          deadline: '10 Sep, 25',
          category: 'technical',
          type: 'full-time',
          source: 'YemenHR',
          url: 'https://yemenhr.com/jobs/senior-angular-developer-sma-remote-1c5d8a3e',
          isAden: false
        }
      ];

      return jobs;
    } catch (error) {
      console.error('Error scraping YemenHR:', error);
      return [];
    }
  }

  // استخراج الوظائف من Tanqeeb
  async scrapeTanqeeb(): Promise<ScrapedJob[]> {
    try {
      // محاكاة البيانات المستخرجة من الموقع
      const jobs: ScrapedJob[] = [
        {
          id: 'tanqeeb-1',
          title: 'مطور ويب Frontend',
          company: 'شركة تقنية عدن',
          location: 'عدن',
          postedDate: '20 Sep, 25',
          category: 'technical',
          type: 'full-time',
          source: 'Tanqeeb',
          url: 'https://yemen.tanqeeb.com/ar/s/وظائف/وظائف-في-عدن',
          isAden: true
        },
        {
          id: 'tanqeeb-2',
          title: 'مدرس لغة إنجليزية',
          company: 'مدرسة عدن الدولية',
          location: 'عدن',
          postedDate: '19 Sep, 25',
          category: 'education',
          type: 'full-time',
          source: 'Tanqeeb',
          url: 'https://yemen.tanqeeb.com/ar/s/وظائف/وظائف-في-عدن',
          isAden: true
        },
        {
          id: 'tanqeeb-3',
          title: 'مهندس مدني',
          company: 'شركة البناء الحديث',
          location: 'عدن',
          postedDate: '18 Sep, 25',
          category: 'engineering',
          type: 'full-time',
          source: 'Tanqeeb',
          url: 'https://yemen.tanqeeb.com/ar/s/وظائف/وظائف-في-عدن',
          isAden: true
        },
        {
          id: 'tanqeeb-4',
          title: 'طبيب أطفال',
          company: 'مستشفى عدن التخصصي',
          location: 'عدن',
          postedDate: '17 Sep, 25',
          category: 'medical',
          type: 'full-time',
          source: 'Tanqeeb',
          url: 'https://yemen.tanqeeb.com/ar/s/وظائف/وظائف-في-عدن',
          isAden: true
        },
        {
          id: 'tanqeeb-5',
          title: 'محاسب مالي',
          company: 'شركة المحاسبة المتقدمة',
          location: 'عدن',
          postedDate: '16 Sep, 25',
          category: 'finance',
          type: 'full-time',
          source: 'Tanqeeb',
          url: 'https://yemen.tanqeeb.com/ar/s/وظائف/وظائف-في-عدن',
          isAden: true
        },
        {
          id: 'tanqeeb-6',
          title: 'مدير تسويق رقمي',
          company: 'وكالة الإعلان الحديثة',
          location: 'عدن',
          postedDate: '15 Sep, 25',
          category: 'sales',
          type: 'full-time',
          source: 'Tanqeeb',
          url: 'https://yemen.tanqeeb.com/ar/s/وظائف/وظائف-في-عدن',
          isAden: true
        }
      ];

      return jobs;
    } catch (error) {
      console.error('Error scraping Tanqeeb:', error);
      return [];
    }
  }

  // استخراج الوظائف من AdenHR
  async scrapeAdenHR(): Promise<ScrapedJob[]> {
    try {
      // محاكاة البيانات المستخرجة من الموقع
      const jobs: ScrapedJob[] = [
        {
          id: 'adenhr-1',
          title: 'مدير مبيعات',
          company: 'شركة عدن التجارية',
          location: 'عدن',
          postedDate: '21 Sep, 25',
          category: 'sales',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        },
        {
          id: 'adenhr-2',
          title: 'محاسب',
          company: 'مكتب محاسبة عدن',
          location: 'عدن',
          postedDate: '20 Sep, 25',
          category: 'finance',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        },
        {
          id: 'adenhr-3',
          title: 'ممرض',
          company: 'مستشفى عدن العام',
          location: 'عدن',
          postedDate: '19 Sep, 25',
          category: 'medical',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        },
        {
          id: 'adenhr-4',
          title: 'مهندس كهرباء',
          company: 'شركة الكهرباء عدن',
          location: 'عدن',
          postedDate: '18 Sep, 25',
          category: 'engineering',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        },
        {
          id: 'adenhr-5',
          title: 'أستاذ جامعي',
          company: 'جامعة عدن',
          location: 'عدن',
          postedDate: '17 Sep, 25',
          category: 'education',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        },
        {
          id: 'adenhr-6',
          title: 'حارس أمن',
          company: 'شركة الأمن المتقدم',
          location: 'عدن',
          postedDate: '16 Sep, 25',
          category: 'security',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        },
        {
          id: 'adenhr-7',
          title: 'محامي',
          company: 'مكتب المحاماة القانوني',
          location: 'عدن',
          postedDate: '15 Sep, 25',
          category: 'legal',
          type: 'full-time',
          source: 'AdenHR',
          url: 'https://adenhr.com/jobs',
          isAden: true
        }
      ];

      return jobs;
    } catch (error) {
      console.error('Error scraping AdenHR:', error);
      return [];
    }
  }

  // استخراج الوظائف من OpenSooq
  async scrapeOpenSooq(): Promise<ScrapedJob[]> {
    try {
      // محاكاة البيانات المستخرجة من الموقع
      const jobs: ScrapedJob[] = [
        {
          id: 'opensooq-1',
          title: 'عامل نظافة',
          company: 'شركة خدمات عدن',
          location: 'عدن',
          postedDate: '22 Sep, 25',
          category: 'service',
          type: 'full-time',
          source: 'OpenSooq',
          url: 'https://ye.opensooq.com/ar/عدن/وظائف/وظائف-شاغرة',
          isAden: true
        },
        {
          id: 'opensooq-2',
          title: 'سائق',
          company: 'شركة النقل عدن',
          location: 'عدن',
          postedDate: '21 Sep, 25',
          category: 'service',
          type: 'full-time',
          source: 'OpenSooq',
          url: 'https://ye.opensooq.com/ar/عدن/وظائف/وظائف-شاغرة',
          isAden: true
        },
        {
          id: 'opensooq-3',
          title: 'مطور تطبيقات جوال',
          company: 'استوديو التطبيقات',
          location: 'عدن',
          postedDate: '20 Sep, 25',
          category: 'technical',
          type: 'full-time',
          source: 'OpenSooq',
          url: 'https://ye.opensooq.com/ar/عدن/وظائف/وظائف-شاغرة',
          isAden: true
        },
        {
          id: 'opensooq-4',
          title: 'مدرس رياضيات',
          company: 'معهد عدن التعليمي',
          location: 'عدن',
          postedDate: '19 Sep, 25',
          category: 'education',
          type: 'part-time',
          source: 'OpenSooq',
          url: 'https://ye.opensooq.com/ar/عدن/وظائف/وظائف-شاغرة',
          isAden: true
        },
        {
          id: 'opensooq-5',
          title: 'صحفي',
          company: 'جريدة عدن اليوم',
          location: 'عدن',
          postedDate: '18 Sep, 25',
          category: 'media',
          type: 'full-time',
          source: 'OpenSooq',
          url: 'https://ye.opensooq.com/ar/عدن/وظائف/وظائف-شاغرة',
          isAden: true
        }
      ];

      return jobs;
    } catch (error) {
      console.error('Error scraping OpenSooq:', error);
      return [];
    }
  }

  // استخراج الوظائف من Tenders of Yemen
  async scrapeTendersOfYemen(): Promise<ScrapedJob[]> {
    try {
      // محاكاة البيانات المستخرجة من الموقع
      const jobs: ScrapedJob[] = [
        {
          id: 'tenders-1',
          title: 'مدير مشروع',
          company: 'منظمة إنسانية',
          location: 'عدن',
          postedDate: '23 Sep, 25',
          category: 'administration',
          type: 'contract',
          source: 'Tenders of Yemen',
          url: 'https://www.tendersofyemen.com/index.php/jobs',
          isAden: true
        },
        {
          id: 'tenders-2',
          title: 'أخصائي حماية',
          company: 'منظمة إنسانية',
          location: 'عدن',
          postedDate: '22 Sep, 25',
          category: 'humanitarian',
          type: 'full-time',
          source: 'Tenders of Yemen',
          url: 'https://www.tendersofyemen.com/index.php/jobs',
          isAden: true
        },
        {
          id: 'tenders-3',
          title: 'مشرف ميداني',
          company: 'منظمة تنموية',
          location: 'عدن',
          postedDate: '21 Sep, 25',
          category: 'administration',
          type: 'full-time',
          source: 'Tenders of Yemen',
          url: 'https://www.tendersofyemen.com/index.php/jobs',
          isAden: true
        },
        {
          id: 'tenders-4',
          title: 'منسق برامج',
          company: 'مؤسسة خيرية',
          location: 'عدن',
          postedDate: '20 Sep, 25',
          category: 'humanitarian',
          type: 'full-time',
          source: 'Tenders of Yemen',
          url: 'https://www.tendersofyemen.com/index.php/jobs',
          isAden: true
        },
        {
          id: 'tenders-5',
          title: 'محاسب مشروع',
          company: 'منظمة دولية',
          location: 'عدن',
          postedDate: '19 Sep, 25',
          category: 'finance',
          type: 'contract',
          source: 'Tenders of Yemen',
          url: 'https://www.tendersofyemen.com/index.php/jobs',
          isAden: true
        }
      ];

      return jobs;
    } catch (error) {
      console.error('Error scraping Tenders of Yemen:', error);
      return [];
    }
  }

  // استخراج الوظائف من Telegram
  async scrapeTelegram(): Promise<ScrapedJob[]> {
    try {
      // محاكاة البيانات المستخرجة من القناة
      const jobs: ScrapedJob[] = [
        {
          id: 'telegram-1',
          title: 'وظيفة إدارية',
          company: 'شركة عدن',
          location: 'عدن',
          postedDate: '24 Sep, 25',
          category: 'administration',
          type: 'full-time',
          source: 'Telegram',
          url: 'https://t.me/s/ChancesPlatform',
          isAden: true
        },
        {
          id: 'telegram-2',
          title: 'مطور Full Stack',
          company: 'استوديو البرمجة',
          location: 'عدن',
          postedDate: '23 Sep, 25',
          category: 'technical',
          type: 'full-time',
          source: 'Telegram',
          url: 'https://t.me/s/ChancesPlatform',
          isAden: true
        },
        {
          id: 'telegram-3',
          title: 'طبيب أسنان',
          company: 'عيادة الأسنان الحديثة',
          location: 'عدن',
          postedDate: '22 Sep, 25',
          category: 'medical',
          type: 'full-time',
          source: 'Telegram',
          url: 'https://t.me/s/ChancesPlatform',
          isAden: true
        },
        {
          id: 'telegram-4',
          title: 'مهندس ميكانيكي',
          company: 'شركة الهندسة الميكانيكية',
          location: 'عدن',
          postedDate: '21 Sep, 25',
          category: 'engineering',
          type: 'full-time',
          source: 'Telegram',
          url: 'https://t.me/s/ChancesPlatform',
          isAden: true
        },
        {
          id: 'telegram-5',
          title: 'مدرس علوم',
          company: 'مدرسة عدن النموذجية',
          location: 'عدن',
          postedDate: '20 Sep, 25',
          category: 'education',
          type: 'part-time',
          source: 'Telegram',
          url: 'https://t.me/s/ChancesPlatform',
          isAden: true
        }
      ];

      return jobs;
    } catch (error) {
      console.error('Error scraping Telegram:', error);
      return [];
    }
  }

  // استخراج جميع الوظائف (حقيقي + وهمي)
  async scrapeAllJobs(): Promise<ScrapedJob[]> {
    try {
      console.log('🔄 بدء استخراج الوظائف...');
      
      // محاولة الاستخراج الحقيقي أولاً
      let realJobs: ScrapedJob[] = [];
      try {
        realJobs = await realJobScrapingService.scrapeAllJobsReal();
        console.log(`✅ تم استخراج ${realJobs.length} وظيفة حقيقية`);
      } catch (error) {
        console.warn('⚠️ فشل الاستخراج الحقيقي، استخدام البيانات الوهمية:', error);
      }

      // إذا لم نحصل على وظائف حقيقية، استخدم البيانات الوهمية
      if (realJobs.length === 0) {
        console.log('🔄 استخدام البيانات الوهمية...');
        const [
          yemenhrJobs,
          tanqeebJobs,
          adenhrJobs,
          opensooqJobs,
          tendersJobs,
          telegramJobs
        ] = await Promise.all([
          this.scrapeYemenHR(),
          this.scrapeTanqeeb(),
          this.scrapeAdenHR(),
          this.scrapeOpenSooq(),
          this.scrapeTendersOfYemen(),
          this.scrapeTelegram()
        ]);

        realJobs = [
          ...yemenhrJobs,
          ...tanqeebJobs,
          ...adenhrJobs,
          ...opensooqJobs,
          ...tendersJobs,
          ...telegramJobs
        ];
      }

      // تصنيف الوظائف
      realJobs.forEach(job => {
        job.category = this.categorizeJob(job.title, job.description);
      });

      console.log(`✅ إجمالي الوظائف: ${realJobs.length}`);
      return realJobs;
    } catch (error) {
      console.error('Error scraping all jobs:', error);
      return [];
    }
  }

  // ترتيب الوظائف داخل كل فئة
  private sortJobsInCategory(jobs: ScrapedJob[]): ScrapedJob[] {
    return jobs.sort((a, b) => {
      // ترتيب حسب التاريخ (الأحدث أولاً)
      const dateA = new Date(a.postedDate);
      const dateB = new Date(b.postedDate);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      
      // إذا كان التاريخ متساوي، ترتيب حسب اسم الشركة
      return a.company.localeCompare(b.company);
    });
  }

  // تصنيف الوظائف حسب الأقسام مع الترتيب
  categorizeJobs(jobs: ScrapedJob[]): JobCategory[] {
    const categories: { [key: string]: ScrapedJob[] } = {};

    jobs.forEach(job => {
      if (!categories[job.category]) {
        categories[job.category] = [];
      }
      categories[job.category].push(job);
    });

    const categoryNames: { [key: string]: string } = {
      medical: '🏥 الوظائف الطبية والصحية',
      education: '🎓 الوظائف التعليمية والأكاديمية',
      technical: '💻 الوظائف التقنية وتكنولوجيا المعلومات',
      engineering: '🔧 الوظائف الهندسية',
      finance: '💰 الوظائف المالية والمحاسبية',
      administration: '📋 الوظائف الإدارية والإشرافية',
      sales: '💼 الوظائف التجارية والتسويقية',
      security: '🛡️ الوظائف الأمنية والحماية',
      service: '🔧 الوظائف الخدمية والعمالية',
      humanitarian: '🤝 الوظائف الإنسانية والتنموية',
      legal: '⚖️ الوظائف القانونية',
      media: '📺 الوظائف الإعلامية والاتصالات',
      other: '📌 وظائف أخرى'
    };

    return Object.entries(categories)
      .map(([id, jobs]) => ({
        id,
        name: categoryNames[id] || 'وظائف أخرى',
        jobs: this.sortJobsInCategory(jobs),
        count: jobs.length
      }))
      .sort((a, b) => b.count - a.count); // ترتيب الفئات حسب عدد الوظائف
  }

  // تصنيف الوظائف حسب عدن فقط
  categorizeAdenJobs(jobs: ScrapedJob[]): JobCategory[] {
    const adenJobs = jobs.filter(job => job.isAden);
    return this.categorizeJobs(adenJobs);
  }

  // تحديث الوظائف تلقائياً
  async updateJobs(): Promise<JobCategory[]> {
    try {
      const jobs = await this.scrapeAllJobs();
      const adenJobs = this.categorizeAdenJobs(jobs);
      
      // حفظ في localStorage
      localStorage.setItem('scrapedJobs', JSON.stringify(jobs));
      localStorage.setItem('adenJobCategories', JSON.stringify(adenJobs));
      
      return adenJobs;
    } catch (error) {
      console.error('Error updating jobs:', error);
      return [];
    }
  }

  // جلب الوظائف المحفوظة
  getSavedJobs(): JobCategory[] {
    try {
      const saved = localStorage.getItem('adenJobCategories');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error getting saved jobs:', error);
      return [];
    }
  }
}

export const jobScrapingService = new JobScrapingService();
