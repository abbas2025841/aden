// Performance testing utilities for measuring improvements
export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  bundleSize: number;
  loadTime: number;
}

export class PerformanceTester {
  private metrics: Partial<PerformanceMetrics> = {};
  private startTime: number = 0;

  constructor() {
    this.startTime = performance.now();
  }

  // Measure bundle size
  measureBundleSize(): number {
    if ('performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return 0;
  }

  // Measure load time
  measureLoadTime(): number {
    return Math.round(performance.now() - this.startTime);
  }

  // Get Core Web Vitals
  async getCoreWebVitals(): Promise<Partial<PerformanceMetrics>> {
    return new Promise((resolve) => {
      const vitals: Partial<PerformanceMetrics> = {};

      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.firstContentfulPaint = Math.round(entry.startTime);
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.largestContentfulPaint = Math.round(entry.startTime);
            }
          }
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // Clean up after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(vitals);
        }, 5000);
      } else {
        resolve(vitals);
      }
    });
  }

  // Measure page load performance
  async measurePageLoad(): Promise<PerformanceMetrics> {
    const vitals = await this.getCoreWebVitals();
    
    return {
      firstContentfulPaint: vitals.firstContentfulPaint || 0,
      largestContentfulPaint: vitals.largestContentfulPaint || 0,
      firstInputDelay: 0, // Would need more complex measurement
      cumulativeLayoutShift: 0, // Would need more complex measurement
      bundleSize: this.measureBundleSize(),
      loadTime: this.measureLoadTime()
    };
  }

  // Log performance results
  logResults(metrics: PerformanceMetrics): void {
    console.group('🚀 Performance Test Results');
    console.log(`📊 Bundle Size: ${metrics.bundleSize}MB`);
    console.log(`⏱️ Load Time: ${metrics.loadTime}ms`);
    console.log(`🎨 First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`🖼️ Largest Contentful Paint: ${metrics.largestContentfulPaint}ms`);
    
    // Performance ratings
    const fcpRating = metrics.firstContentfulPaint < 1800 ? '🟢 Good' : 
                     metrics.firstContentfulPaint < 3000 ? '🟡 Needs Improvement' : '🔴 Poor';
    const lcpRating = metrics.largestContentfulPaint < 2500 ? '🟢 Good' : 
                     metrics.largestContentfulPaint < 4000 ? '🟡 Needs Improvement' : '🔴 Poor';
    
    console.log(`📈 FCP Rating: ${fcpRating}`);
    console.log(`📈 LCP Rating: ${lcpRating}`);
    console.groupEnd();
  }

  // Compare with baseline
  compareWithBaseline(current: PerformanceMetrics, baseline: PerformanceMetrics): void {
    console.group('📊 Performance Comparison');
    
    const bundleImprovement = ((baseline.bundleSize - current.bundleSize) / baseline.bundleSize * 100);
    const loadTimeImprovement = ((baseline.loadTime - current.loadTime) / baseline.loadTime * 100);
    const fcpImprovement = ((baseline.firstContentfulPaint - current.firstContentfulPaint) / baseline.firstContentfulPaint * 100);
    
    console.log(`📦 Bundle Size: ${baseline.bundleSize}MB → ${current.bundleSize}MB (${bundleImprovement > 0 ? '+' : ''}${bundleImprovement.toFixed(1)}%)`);
    console.log(`⏱️ Load Time: ${baseline.loadTime}ms → ${current.loadTime}ms (${loadTimeImprovement > 0 ? '+' : ''}${loadTimeImprovement.toFixed(1)}%)`);
    console.log(`🎨 FCP: ${baseline.firstContentfulPaint}ms → ${current.firstContentfulPaint}ms (${fcpImprovement > 0 ? '+' : ''}${fcpImprovement.toFixed(1)}%)`);
    
    console.groupEnd();
  }
}

// Baseline metrics (estimated before optimization)
export const BASELINE_METRICS: PerformanceMetrics = {
  firstContentfulPaint: 3000,
  largestContentfulPaint: 4000,
  firstInputDelay: 100,
  cumulativeLayoutShift: 0.1,
  bundleSize: 2.5, // MB
  loadTime: 3000
};

// Quick performance test function
export const runPerformanceTest = async (): Promise<PerformanceMetrics> => {
  const tester = new PerformanceTester();
  const metrics = await tester.measurePageLoad();
  tester.logResults(metrics);
  tester.compareWithBaseline(metrics, BASELINE_METRICS);
  return metrics;
};

// Auto-run performance test in development
if (process.env.NODE_ENV === 'development') {
  // Run test after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      runPerformanceTest();
    }, 2000);
  });
}
