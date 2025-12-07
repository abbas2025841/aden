/**
 * Main Entry Point
 * نقطة الدخول الرئيسية للتطبيق
 * 
 * هذا الملف هو نقطة البداية للتطبيق، حيث يتم:
 * 1. استيراد React و ReactDOM
 * 2. استيراد المكون الرئيسي App
 * 3. استيراد الأنماط العامة
 * 4. تهيئة وعرض التطبيق في DOM
 */

// React imports
import { createRoot } from 'react-dom/client';

// Local components
import App from './App';

// Styles
import './index.css';

/**
 * Initialize and render the application
 * تهيئة وعرض التطبيق
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure index.html contains a div with id="root"'
  );
}

createRoot(rootElement).render(<App />);
