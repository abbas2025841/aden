// خدمة الاستخراج الحقيقي من المواقع
import { ScrapedJob } from './jobScrapingService';

export class RealJobScrapingService {
  private baseUrl = 'https://api.allorigins.win/get?url=';
  
  // استخراج البيانات من URL مع تجاوز CORS
  private async fetchWithCORS(url: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}${encodeURIComponent(url)}`);
      const data = await response.json();
      return data.contents || '';
    } catch (error) {
      console.error('Error fetching with CORS:', error);
      return '';
    }
  }

  // تحليل HTML واستخراج الوظائف من YemenHR
  async scrapeYemenHRReal(): Promise<ScrapedJob[]> {
    try {
      const html = await this.fetchWithCORS('https://yemenhr.com/jobs?sortCol=location');
      if (!html) return [];

      const jobs: ScrapedJob[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // البحث عن جدول الوظائف
      const jobRows = doc.querySelectorAll('table tbody tr');
      
      jobRows.forEach((row, index) => {
        try {
          const cells = row.querySelectorAll('td');
          if (cells.length < 5) return;

          const titleCell = cells[1];
          const companyCell = cells[0];
          const locationCell = cells[2];
          const postedCell = cells[0];
          const deadlineCell = cells[3];

          const titleLink = titleCell.querySelector('a');
          const title = titleLink?.textContent?.trim() || '';
          const jobUrl = titleLink?.href || '';
          
          const companyImg = companyCell.querySelector('img');
          const companyName = companyImg?.alt || companyCell.textContent?.trim() || '';
          
          const location = locationCell.textContent?.trim() || '';
          const postedDate = postedCell.textContent?.trim() || '';
          const deadline = deadlineCell.textContent?.trim() || '';

          if (title && companyName) {
            jobs.push({
              id: `yemenhr-real-${index}`,
              title,
              company: companyName,
              location,
              postedDate: this.parseDate(postedDate),
              deadline: deadline || undefined,
              category: this.categorizeJob(title),
              type: 'full-time',
              source: 'YemenHR',
              url: jobUrl.startsWith('http') ? jobUrl : `https://yemenhr.com${jobUrl}`,
              isAden: location.toLowerCase().includes('aden') || location.toLowerCase().includes('عدن')
            });
          }
        } catch (error) {
          console.error('Error parsing job row:', error);
        }
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping YemenHR real:', error);
      return [];
    }
  }

  // استخراج من Tanqeeb
  async scrapeTanqeebReal(): Promise<ScrapedJob[]> {
    try {
      const html = await this.fetchWithCORS('https://yemen.tanqeeb.com/ar/s/%D9%88%D8%B8%D8%A7%D8%A6%D9%81/%D9%88%D8%B8%D8%A7%D8%A6%D9%81-%D9%81%D9%8A-%D8%B9%D8%AF%D9%86');
      if (!html) return [];

      const jobs: ScrapedJob[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // البحث عن عناصر الوظائف
      const jobElements = doc.querySelectorAll('.job-item, .job-card, .job-listing');
      
      jobElements.forEach((element, index) => {
        try {
          const titleElement = element.querySelector('h3, .job-title, .title');
          const companyElement = element.querySelector('.company, .employer, .job-company');
          const locationElement = element.querySelector('.location, .job-location');
          const dateElement = element.querySelector('.date, .posted-date, .job-date');
          const linkElement = element.querySelector('a');

          const title = titleElement?.textContent?.trim() || '';
          const company = companyElement?.textContent?.trim() || '';
          const location = locationElement?.textContent?.trim() || '';
          const postedDate = dateElement?.textContent?.trim() || '';
          const jobUrl = linkElement?.href || '';

          if (title && company) {
            jobs.push({
              id: `tanqeeb-real-${index}`,
              title,
              company,
              location: location || 'عدن',
              postedDate: this.parseDate(postedDate),
              category: this.categorizeJob(title),
              type: 'full-time',
              source: 'Tanqeeb',
              url: jobUrl.startsWith('http') ? jobUrl : `https://yemen.tanqeeb.com${jobUrl}`,
              isAden: true // Tanqeeb URL is specifically for Aden
            });
          }
        } catch (error) {
          console.error('Error parsing Tanqeeb job:', error);
        }
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping Tanqeeb real:', error);
      return [];
    }
  }

  // استخراج من OpenSooq
  async scrapeOpenSooqReal(): Promise<ScrapedJob[]> {
    try {
      const html = await this.fetchWithCORS('https://ye.opensooq.com/ar/%D8%B9%D8%AF%D9%86/%D9%88%D8%B8%D8%A7%D8%A6%D9%81/%D9%88%D8%B8%D8%A7%D8%A6%D9%81-%D8%B4%D8%A7%D8%BA%D8%B1%D8%A9');
      if (!html) return [];

      const jobs: ScrapedJob[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // البحث عن عناصر الوظائف في OpenSooq
      const jobElements = doc.querySelectorAll('.post-item, .listing-item, .ad-item');
      
      jobElements.forEach((element, index) => {
        try {
          const titleElement = element.querySelector('h3, .post-title, .listing-title');
          const companyElement = element.querySelector('.poster, .seller, .user');
          const locationElement = element.querySelector('.location, .post-location');
          const dateElement = element.querySelector('.date, .post-date');
          const linkElement = element.querySelector('a');

          const title = titleElement?.textContent?.trim() || '';
          const company = companyElement?.textContent?.trim() || '';
          const location = locationElement?.textContent?.trim() || '';
          const postedDate = dateElement?.textContent?.trim() || '';
          const jobUrl = linkElement?.href || '';

          if (title && company) {
            jobs.push({
              id: `opensooq-real-${index}`,
              title,
              company,
              location: location || 'عدن',
              postedDate: this.parseDate(postedDate),
              category: this.categorizeJob(title),
              type: 'full-time',
              source: 'OpenSooq',
              url: jobUrl.startsWith('http') ? jobUrl : `https://ye.opensooq.com${jobUrl}`,
              isAden: true // OpenSooq URL is specifically for Aden
            });
          }
        } catch (error) {
          console.error('Error parsing OpenSooq job:', error);
        }
      });

      return jobs;
    } catch (error) {
      console.error('Error scraping OpenSooq real:', error);
      return [];
    }
  }

  // تصنيف الوظائف
  private categorizeJob(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('طبيب') || titleLower.includes('ممرض') || 
        titleLower.includes('صيدلي') || titleLower.includes('أخصائي') ||
        titleLower.includes('doctor') || titleLower.includes('nurse') ||
        titleLower.includes('medical') || titleLower.includes('health')) {
      return 'medical';
    }
    
    if (titleLower.includes('مدرس') || titleLower.includes('معلم') ||
        titleLower.includes('أستاذ') || titleLower.includes('تعليم') ||
        titleLower.includes('teacher') || titleLower.includes('education')) {
      return 'education';
    }
    
    if (titleLower.includes('مطور') || titleLower.includes('برمجة') ||
        titleLower.includes('تقني') || titleLower.includes('كمبيوتر') ||
        titleLower.includes('developer') || titleLower.includes('programmer') ||
        titleLower.includes('technical') || titleLower.includes('it')) {
      return 'technical';
    }
    
    if (titleLower.includes('مهندس') || titleLower.includes('هندسة') ||
        titleLower.includes('engineer') || titleLower.includes('engineering')) {
      return 'engineering';
    }
    
    if (titleLower.includes('محاسب') || titleLower.includes('مالي') ||
        titleLower.includes('حسابات') || titleLower.includes('accountant') ||
        titleLower.includes('finance') || titleLower.includes('financial')) {
      return 'finance';
    }
    
    if (titleLower.includes('مدير') || titleLower.includes('إدارة') ||
        titleLower.includes('مشرف') || titleLower.includes('منسق') ||
        titleLower.includes('manager') || titleLower.includes('supervisor')) {
      return 'administration';
    }
    
    if (titleLower.includes('تسويق') || titleLower.includes('مبيعات') ||
        titleLower.includes('تجاري') || titleLower.includes('مندوب') ||
        titleLower.includes('marketing') || titleLower.includes('sales')) {
      return 'sales';
    }
    
    if (titleLower.includes('أمن') || titleLower.includes('حارس') ||
        titleLower.includes('security') || titleLower.includes('guard')) {
      return 'security';
    }
    
    if (titleLower.includes('خدمة') || titleLower.includes('عامل') ||
        titleLower.includes('نظافة') || titleLower.includes('سائق') ||
        titleLower.includes('service') || titleLower.includes('cleaner')) {
      return 'service';
    }
    
    if (titleLower.includes('إنساني') || titleLower.includes('تطوع') ||
        titleLower.includes('humanitarian') || titleLower.includes('volunteer')) {
      return 'humanitarian';
    }
    
    if (titleLower.includes('محامي') || titleLower.includes('قانوني') ||
        titleLower.includes('lawyer') || titleLower.includes('legal')) {
      return 'legal';
    }
    
    if (titleLower.includes('إعلام') || titleLower.includes('صحفي') ||
        titleLower.includes('media') || titleLower.includes('journalist')) {
      return 'media';
    }
    
    return 'other';
  }

  // تحليل التاريخ
  private parseDate(dateStr: string): string {
    if (!dateStr) return new Date().toLocaleDateString('ar-SA');
    
    // محاولة تحليل التواريخ المختلفة
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (dateStr.includes('اليوم') || dateStr.includes('today')) {
      return today.toLocaleDateString('ar-SA');
    }
    
    if (dateStr.includes('أمس') || dateStr.includes('yesterday')) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toLocaleDateString('ar-SA');
    }
    
    // محاولة تحليل التاريخ العادي
    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('ar-SA');
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
    
    return dateStr;
  }

  // استخراج جميع الوظائف الحقيقية
  async scrapeAllJobsReal(): Promise<ScrapedJob[]> {
    try {
      console.log('🔄 بدء الاستخراج الحقيقي من المواقع...');
      
      const [
        yemenhrJobs,
        tanqeebJobs,
        opensooqJobs
      ] = await Promise.all([
        this.scrapeYemenHRReal(),
        this.scrapeTanqeebReal(),
        this.scrapeOpenSooqReal()
      ]);

      const allJobs = [
        ...yemenhrJobs,
        ...tanqeebJobs,
        ...opensooqJobs
      ];

      console.log(`✅ تم استخراج ${allJobs.length} وظيفة حقيقية`);
      return allJobs;
    } catch (error) {
      console.error('Error scraping all jobs real:', error);
      return [];
    }
  }
}

export const realJobScrapingService = new RealJobScrapingService();
