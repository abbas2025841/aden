import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  pageLoadTime: number;
  cacheHitRate: number;
  errorRate: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    pageLoadTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // محاكاة قياس الأداء
  const updateMetrics = () => {
    if (!isMonitoring) return;

    setMetrics(prev => ({
      memoryUsage: Math.random() * 100,
      cpuUsage: Math.random() * 100,
      networkLatency: Math.random() * 200 + 50,
      pageLoadTime: Math.random() * 3000 + 500,
      cacheHitRate: Math.random() * 100,
      errorRate: Math.random() * 5,
    }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(updateMetrics, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const getStatusColor = (value: number, type: 'usage' | 'latency' | 'time' | 'rate') => {
    switch (type) {
      case 'usage':
        return value > 80 ? 'text-red-600' : value > 60 ? 'text-yellow-600' : 'text-green-600';
      case 'latency':
        return value > 150 ? 'text-red-600' : value > 100 ? 'text-yellow-600' : 'text-green-600';
      case 'time':
        return value > 2000 ? 'text-red-600' : value > 1000 ? 'text-yellow-600' : 'text-green-600';
      case 'rate':
        return value > 3 ? 'text-red-600' : value > 1 ? 'text-yellow-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (value: number, type: 'usage' | 'latency' | 'time' | 'rate') => {
    switch (type) {
      case 'usage':
        return value > 80 ? 'عالية' : value > 60 ? 'متوسطة' : 'منخفضة';
      case 'latency':
        return value > 150 ? 'بطيء' : value > 100 ? 'متوسط' : 'سريع';
      case 'time':
        return value > 2000 ? 'بطيء' : value > 1000 ? 'متوسط' : 'سريع';
      case 'rate':
        return value > 3 ? 'عالية' : value > 1 ? 'متوسطة' : 'منخفضة';
      default:
        return 'عادي';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">مراقبة الأداء</h3>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isMonitoring
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isMonitoring ? 'إيقاف المراقبة' : 'بدء المراقبة'}
        </button>
      </div>

      {isMonitoring && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* استخدام الذاكرة */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">استخدام الذاكرة</h4>
              <span className={`text-sm font-bold ${getStatusColor(metrics.memoryUsage, 'usage')}`}>
                {metrics.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.memoryUsage > 80 ? 'bg-red-500' : 
                  metrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${metrics.memoryUsage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الحالة: {getStatusText(metrics.memoryUsage, 'usage')}
            </p>
          </div>

          {/* استخدام المعالج */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">استخدام المعالج</h4>
              <span className={`text-sm font-bold ${getStatusColor(metrics.cpuUsage, 'usage')}`}>
                {metrics.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.cpuUsage > 80 ? 'bg-red-500' : 
                  metrics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${metrics.cpuUsage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الحالة: {getStatusText(metrics.cpuUsage, 'usage')}
            </p>
          </div>

          {/* زمن الاستجابة */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">زمن الاستجابة</h4>
              <span className={`text-sm font-bold ${getStatusColor(metrics.networkLatency, 'latency')}`}>
                {metrics.networkLatency.toFixed(0)}ms
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.networkLatency > 150 ? 'bg-red-500' : 
                  metrics.networkLatency > 100 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(metrics.networkLatency / 2, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الحالة: {getStatusText(metrics.networkLatency, 'latency')}
            </p>
          </div>

          {/* وقت تحميل الصفحة */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">وقت تحميل الصفحة</h4>
              <span className={`text-sm font-bold ${getStatusColor(metrics.pageLoadTime, 'time')}`}>
                {metrics.pageLoadTime.toFixed(0)}ms
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.pageLoadTime > 2000 ? 'bg-red-500' : 
                  metrics.pageLoadTime > 1000 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(metrics.pageLoadTime / 30, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الحالة: {getStatusText(metrics.pageLoadTime, 'time')}
            </p>
          </div>

          {/* معدل التخزين المؤقت */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">معدل التخزين المؤقت</h4>
              <span className="text-sm font-bold text-green-600">
                {metrics.cacheHitRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${metrics.cacheHitRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الحالة: {metrics.cacheHitRate > 80 ? 'ممتاز' : 'جيد'}
            </p>
          </div>

          {/* معدل الأخطاء */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">معدل الأخطاء</h4>
              <span className={`text-sm font-bold ${getStatusColor(metrics.errorRate, 'rate')}`}>
                {metrics.errorRate.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metrics.errorRate > 3 ? 'bg-red-500' : 
                  metrics.errorRate > 1 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(metrics.errorRate * 20, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الحالة: {getStatusText(metrics.errorRate, 'rate')}
            </p>
          </div>
        </div>
      )}

      {!isMonitoring && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-gray-500">انقر على "بدء المراقبة" لبدء تتبع أداء التطبيق</p>
        </div>
      )}

      {/* نصائح الأداء */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">نصائح لتحسين الأداء</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• استخدم وضع توفير البيانات لتقليل استهلاك الإنترنت</li>
          <li>• فعّل التخزين المؤقت لتسريع التحميل</li>
          <li>• أغلق التبويبات غير المستخدمة لتوفير الذاكرة</li>
          <li>• استخدم التحميل الكسري للمكونات الثقيلة</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
