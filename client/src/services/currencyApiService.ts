// خدمة جلب أسعار العملات من ye-rial.com
export interface CurrencyRate {
  id: string;
  name: string;
  flag: string;
  code: string;
  buyRate: number;
  sellRate: number;
  change: number;
  changePercent: number;
  lastUpdated?: Date;
}

export interface YeRialApiResponse {
  [key: string]: {
    buy: number;
    sell: number;
    change?: number;
    changePercent?: number;
  };
}

class CurrencyApiService {
  private readonly API_URL = 'https://ye-rial.com/data.json';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق
  private cache: { data: CurrencyRate[]; timestamp: number } | null = null;

  // تحويل بيانات API إلى تنسيق التطبيق
  private mapApiDataToCurrencies(apiData: YeRialApiResponse): CurrencyRate[] {
    const currencyMap: { [key: string]: CurrencyRate } = {
      'YER_ADEN': {
        id: 'YER_ADEN',
        name: 'الريال اليمني (عدن)',
        flag: '🇾🇪',
        code: 'YER',
        buyRate: 1.0,
        sellRate: 1.0,
        change: 0,
        changePercent: 0
      },
      'YER_SANAA': {
        id: 'YER_SANAA',
        name: 'الريال اليمني (صنعاء)',
        flag: '🇾🇪',
        code: 'YER',
        buyRate: 0.95,
        sellRate: 0.98,
        change: -0.02,
        changePercent: -2.1
      }
    };

    // تحويل العملات من API
    if (apiData.USD) {
      currencyMap['USD'] = {
        id: 'USD',
        name: 'الدولار الأمريكي',
        flag: '🇺🇸',
        code: 'USD',
        buyRate: apiData.USD.buy,
        sellRate: apiData.USD.sell,
        change: apiData.USD.change || 0,
        changePercent: apiData.USD.changePercent || 0
      };
    }

    if (apiData.SAR) {
      currencyMap['SAR'] = {
        id: 'SAR',
        name: 'الريال السعودي',
        flag: '🇸🇦',
        code: 'SAR',
        buyRate: apiData.SAR.buy,
        sellRate: apiData.SAR.sell,
        change: apiData.SAR.change || 0,
        changePercent: apiData.SAR.changePercent || 0
      };
    }

    if (apiData.AED) {
      currencyMap['AED'] = {
        id: 'AED',
        name: 'الدرهم الإماراتي',
        flag: '🇦🇪',
        code: 'AED',
        buyRate: apiData.AED.buy,
        sellRate: apiData.AED.sell,
        change: apiData.AED.change || 0,
        changePercent: apiData.AED.changePercent || 0
      };
    }

    if (apiData.EUR) {
      currencyMap['EUR'] = {
        id: 'EUR',
        name: 'اليورو الأوروبي',
        flag: '🇪🇺',
        code: 'EUR',
        buyRate: apiData.EUR.buy,
        sellRate: apiData.EUR.sell,
        change: apiData.EUR.change || 0,
        changePercent: apiData.EUR.changePercent || 0
      };
    }

    if (apiData.GBP) {
      currencyMap['GBP'] = {
        id: 'GBP',
        name: 'الجنيه الإسترليني',
        flag: '🇬🇧',
        code: 'GBP',
        buyRate: apiData.GBP.buy,
        sellRate: apiData.GBP.sell,
        change: apiData.GBP.change || 0,
        changePercent: apiData.GBP.changePercent || 0
      };
    }

    if (apiData.KWD) {
      currencyMap['KWD'] = {
        id: 'KWD',
        name: 'الدينار الكويتي',
        flag: '🇰🇼',
        code: 'KWD',
        buyRate: apiData.KWD.buy,
        sellRate: apiData.KWD.sell,
        change: apiData.KWD.change || 0,
        changePercent: apiData.KWD.changePercent || 0
      };
    }

    if (apiData.QAR) {
      currencyMap['QAR'] = {
        id: 'QAR',
        name: 'الريال القطري',
        flag: '🇶🇦',
        code: 'QAR',
        buyRate: apiData.QAR.buy,
        sellRate: apiData.QAR.sell,
        change: apiData.QAR.change || 0,
        changePercent: apiData.QAR.changePercent || 0
      };
    }

    if (apiData.OMR) {
      currencyMap['OMR'] = {
        id: 'OMR',
        name: 'الريال العماني',
        flag: '🇴🇲',
        code: 'OMR',
        buyRate: apiData.OMR.buy,
        sellRate: apiData.OMR.sell,
        change: apiData.OMR.change || 0,
        changePercent: apiData.OMR.changePercent || 0
      };
    }

    if (apiData.BHD) {
      currencyMap['BHD'] = {
        id: 'BHD',
        name: 'الدينار البحريني',
        flag: '🇧🇭',
        code: 'BHD',
        buyRate: apiData.BHD.buy,
        sellRate: apiData.BHD.sell,
        change: apiData.BHD.change || 0,
        changePercent: apiData.BHD.changePercent || 0
      };
    }

    if (apiData.JOD) {
      currencyMap['JOD'] = {
        id: 'JOD',
        name: 'الدينار الأردني',
        flag: '🇯🇴',
        code: 'JOD',
        buyRate: apiData.JOD.buy,
        sellRate: apiData.JOD.sell,
        change: apiData.JOD.change || 0,
        changePercent: apiData.JOD.changePercent || 0
      };
    }

    if (apiData.EGP) {
      currencyMap['EGP'] = {
        id: 'EGP',
        name: 'الجنيه المصري',
        flag: '🇪🇬',
        code: 'EGP',
        buyRate: apiData.EGP.buy,
        sellRate: apiData.EGP.sell,
        change: apiData.EGP.change || 0,
        changePercent: apiData.EGP.changePercent || 0
      };
    }

    // إضافة timestamp للبيانات
    const now = new Date();
    Object.values(currencyMap).forEach(currency => {
      currency.lastUpdated = now;
    });

    return Object.values(currencyMap);
  }

  // جلب أسعار العملات من API
  async fetchCurrencyRates(): Promise<CurrencyRate[]> {
    try {
      // التحقق من الكاش
      if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
        return this.cache.data;
      }

      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // إضافة CORS mode
        // إضافة timeout
        signal: AbortSignal.timeout(15000) // زيادة إلى 15 ثانية
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: YeRialApiResponse = await response.json();

      // التحقق من صحة البيانات
      if (!this.isValidData(apiData)) {
        throw new Error('بيانات API غير صحيحة');
      }

      const currencies = this.mapApiDataToCurrencies(apiData);
      
      // حفظ في الكاش
      this.cache = {
        data: currencies,
        timestamp: Date.now()
      };

      return currencies;
    } catch (error) {
      console.error('خطأ في جلب أسعار العملات:', error);
      
      // إرجاع البيانات المحفوظة في الكاش أو البيانات الافتراضية
      if (this.cache) {
        return this.cache.data;
      }
      
      // إرجاع البيانات الافتراضية في حالة فشل التحميل
      return this.getDefaultCurrencies();
    }
  }

  // البيانات الافتراضية في حالة فشل التحميل
  getDefaultCurrencies(): CurrencyRate[] {
    return [
      {
        id: "YER_ADEN",
        name: "الريال اليمني (عدن)",
        flag: "🇾🇪",
        code: "YER",
        buyRate: 1.0,
        sellRate: 1.0,
        change: 0,
        changePercent: 0
      },
      {
        id: "SAR",
        name: "الريال السعودي",
        flag: "🇸🇦",
        code: "SAR",
        buyRate: 425.00,
        sellRate: 428.00,
        change: 2.50,
        changePercent: 0.59
      },
      {
        id: "AED",
        name: "الدرهم الإماراتي",
        flag: "🇦🇪",
        code: "AED",
        buyRate: 435.00,
        sellRate: 438.00,
        change: 1.20,
        changePercent: 0.28
      },
      {
        id: "USD",
        name: "الدولار الأمريكي",
        flag: "🇺🇸",
        code: "USD",
        buyRate: 1615.00,
        sellRate: 1630.00,
        change: 5.00,
        changePercent: 0.31
      }
    ];
  }

  // مسح الكاش
  clearCache(): void {
    this.cache = null;
  }

  // التحقق من صحة البيانات
  isValidData(data: any): data is YeRialApiResponse {
    return data && typeof data === 'object' && 
           (data.USD || data.SAR || data.AED);
  }
}

export const currencyApiService = new CurrencyApiService();