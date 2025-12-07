// خدمة قاعدة البيانات لأسعار العملات
// Cursor الأسطوري - تكامل مع مشروع المزامنة

import { supabase } from '@/lib/supabase';

export interface CurrencyRate {
  id?: number;
  currency: string;
  name: string;
  buy_rate: number;
  sell_rate: number;
  source: string;
  last_updated: string;
  created_at?: string;
}

export interface CurrencySyncLog {
  id?: number;
  sync_type: string;
  status: string;
  rates_count: number;
  error_message?: string;
  sync_duration_ms?: number;
  created_at: string;
}

class CurrencyDatabaseService {
  private static instance: CurrencyDatabaseService;

  public static getInstance(): CurrencyDatabaseService {
    if (!CurrencyDatabaseService.instance) {
      CurrencyDatabaseService.instance = new CurrencyDatabaseService();
    }
    return CurrencyDatabaseService.instance;
  }

  // جلب أحدث أسعار العملات
  async getLatestRates(): Promise<CurrencyRate[]> {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('خطأ في جلب أسعار العملات:', error);
        return this.getFallbackRates();
      }

      return data || [];
    } catch (error) {
      console.error('خطأ في الاتصال بقاعدة البيانات:', error);
      return this.getFallbackRates();
    }
  }

  // جلب أسعار عملة معينة
  async getRateByCurrency(currency: string): Promise<CurrencyRate | null> {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .eq('currency', currency)
        .single();

      if (error) {
        console.error(`خطأ في جلب سعر ${currency}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      return null;
    }
  }

  // جلب سجل المزامنة
  async getSyncLogs(limit: number = 10): Promise<CurrencySyncLog[]> {
    try {
      const { data, error } = await supabase
        .from('currency_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('خطأ في جلب سجل المزامنة:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      return [];
    }
  }

  // إحصائيات المزامنة
  async getSyncStatistics(): Promise<{
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastSync: string | null;
    averageDuration: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('currency_sync_log')
        .select('status, sync_duration_ms, created_at');

      if (error) {
        console.error('خطأ في جلب إحصائيات المزامنة:', error);
        return {
          totalSyncs: 0,
          successfulSyncs: 0,
          failedSyncs: 0,
          lastSync: null,
          averageDuration: 0
        };
      }

      const logs = data || [];
      const totalSyncs = logs.length;
      const successfulSyncs = logs.filter(log => log.status === 'success').length;
      const failedSyncs = logs.filter(log => log.status === 'error').length;
      const lastSync = logs.length > 0 ? logs[0].created_at : null;
      const averageDuration = logs
        .filter(log => log.sync_duration_ms)
        .reduce((sum, log) => sum + (log.sync_duration_ms || 0), 0) / 
        logs.filter(log => log.sync_duration_ms).length || 0;

      return {
        totalSyncs,
        successfulSyncs,
        failedSyncs,
        lastSync,
        averageDuration
      };
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      return {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        lastSync: null,
        averageDuration: 0
      };
    }
  }

  // تحديث سعر عملة
  async updateRate(currency: string, buyRate: number, sellRate: number, source: string = 'عدن تايم'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('currency_rates')
        .upsert({
          currency,
          buy_rate: buyRate,
          sell_rate: sellRate,
          source,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'currency'
        });

      if (error) {
        console.error('خطأ في تحديث السعر:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      return false;
    }
  }

  // تسجيل عملية مزامنة
  async logSync(
    syncType: string,
    status: string,
    ratesCount: number = 0,
    errorMessage?: string,
    syncDurationMs?: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('currency_sync_log')
        .insert({
          sync_type: syncType,
          status,
          rates_count: ratesCount,
          error_message: errorMessage,
          sync_duration_ms: syncDurationMs
        });

      if (error) {
        console.error('خطأ في تسجيل المزامنة:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      return false;
    }
  }

  // البيانات الاحتياطية
  private getFallbackRates(): CurrencyRate[] {
    return [
      {
        currency: 'USD',
        name: 'دولار أمريكي',
        buy_rate: 1632,
        sell_rate: 1617,
        source: 'عدن تايم (احتياطي)',
        last_updated: new Date().toISOString()
      },
      {
        currency: 'SAR',
        name: 'ريال سعودي',
        buy_rate: 428,
        sell_rate: 425,
        source: 'عدن تايم (احتياطي)',
        last_updated: new Date().toISOString()
      }
    ];
  }

  // تحويل البيانات لتنسيق المكون
  convertToComponentFormat(rates: CurrencyRate[]): Array<{
    currency: string;
    name: string;
    buy: number;
    sell: number;
    change: number;
    lastUpdate: string;
    source: string;
  }> {
    return rates.map(rate => ({
      currency: rate.currency,
      name: rate.name,
      buy: rate.buy_rate,
      sell: rate.sell_rate,
      change: 0, // يمكن حساب التغيير من البيانات السابقة
      lastUpdate: rate.last_updated,
      source: rate.source
    }));
  }
}

export default CurrencyDatabaseService;
