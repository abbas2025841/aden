# Implementation Plan - Greeting Card Enhancement

- [x] 1. إعداد البنية الأساسية والأدوات


  - إنشاء مجلد GreetingSection مع الملفات الأساسية
  - إعداد ملفات الأنواع (types.ts) والتكوينات (animations.ts, styles.ts)
  - إضافة CSS animations في ملف منفصل
  - _Requirements: جميع المتطلبات_



- [ ] 2. تطوير دالة اختيار التحية حسب الوقت
  - إنشاء دالة getGreetingData التي تأخذ الساعة وترجع التحية والأيقونة المناسبة
  - تطبيق منطق اختيار التحية للأوقات المختلفة (صباح، ظهر، مساء، ليل)
  - _Requirements: 1.2_

- [x]* 2.1 كتابة property test لدالة التحية


  - **Property 1: Time-based greeting accuracy**
  - **Validates: Requirements 1.2**

- [ ] 3. بناء مكون GreetingHeader
  - إنشاء مكون GreetingHeader مع الأيقونة المتحركة
  - تطبيق تأثير pulse على الأيقونة
  - إضافة gradient text effect للعنوان
  - _Requirements: 1.2, 3.1_



- [ ]* 3.1 كتابة unit tests لمكون GreetingHeader
  - اختبار عرض التحية الصحيحة حسب الوقت
  - اختبار وجود الأيقونة المناسبة
  - _Requirements: 1.2_

- [x] 4. بناء مكون InfoCards

  - إنشاء مكون InfoCards مع البطاقات الثلاث (موقع، وقت، طقس)
  - تطبيق stagger animation للبطاقات
  - إضافة hover effects (scale 1.05)
  - تطبيق glassmorphism effect مع backdrop-blur
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 4.1 إضافة تحديث تلقائي للوقت
  - إنشاء hook useTime لتحديث الوقت كل دقيقة
  - ربط الـ hook بمكون TimeCard
  - _Requirements: 2.4_

- [ ]* 4.2 كتابة property test للتحديث التلقائي
  - **Property 5: Time auto-update**


  - **Validates: Requirements 2.4**

- [ ]* 4.3 كتابة unit tests لمكون InfoCards
  - اختبار عرض البطاقات الثلاث
  - اختبار hover effects
  - اختبار stagger animation timing
  - _Requirements: 2.1, 2.2_

- [ ] 5. بناء مكون MessageCard
  - إنشاء مكون MessageCard مع أيقونة القلب
  - تطبيق pulse animation على الأيقونة
  - إضافة gradient background (red to pink)
  - تطبيق shimmer effect كل 3 ثواني
  - إضافة hover bounce effect
  - _Requirements: 3.1, 3.2, 3.3, 3.4_



- [ ]* 5.1 كتابة property test لتوقيت shimmer
  - **Property 6: Shimmer effect timing**
  - **Validates: Requirements 3.3**

- [ ]* 5.2 كتابة unit tests لمكون MessageCard
  - اختبار وجود أيقونة القلب
  - اختبار gradient background
  - اختبار hover effects
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 6. بناء المكون الرئيسي GreetingSection
  - دمج جميع المكونات الفرعية
  - تطبيق fade-in animation عند التحميل
  - إضافة hover lift effect للبطاقة الرئيسية
  - تطبيق glassmorphism effect
  - إضافة دعم Dark Mode
  - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [ ]* 6.1 كتابة property test لمدة التأثيرات
  - **Property 2: Animation duration constraint**
  - **Validates: Requirements 5.1**


- [ ]* 6.2 كتابة property test لـ FCP
  - **Property 11: First Contentful Paint performance**
  - **Validates: Requirements 8.1**

- [ ]* 6.3 كتابة unit tests للمكون الرئيسي
  - اختبار عرض جميع المكونات الفرعية
  - اختبار fade-in animation
  - اختبار hover effects
  - اختبار Dark Mode
  - _Requirements: 1.1, 1.3, 1.5_

- [ ] 7. تطبيق التصميم المتجاوب (Responsive Design)
  - إضافة breakpoints للموبايل (320px)
  - إضافة breakpoints للتابلت (768px)
  - إضافة breakpoints لسطح المكتب (1024px+)
  - تطبيق max-width 800px على سطح المكتب

  - ضبط أحجام الخطوط والأيقونات حسب الشاشة
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 7.1 كتابة property test للحفاظ على النسب
  - **Property 7: Aspect ratio preservation**
  - **Validates: Requirements 4.5**

- [ ]* 7.2 كتابة unit tests للتصميم المتجاوب
  - اختبار عرض البطاقة على موبايل
  - اختبار عرض البطاقة على تابلت
  - اختبار عرض البطاقة على سطح المكتب
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8. تطبيق دعم إمكانية الوصول (Accessibility)
  - إضافة ARIA labels لجميع العناصر
  - إضافة focus indicators واضحة
  - استخدام semantic HTML (h1, section, time)
  - إضافة alt text للأيقونات
  - التأكد من نسبة التباين >= 4.5:1
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x]* 8.1 كتابة property test للتباين اللوني

  - **Property 4: Color contrast compliance**
  - **Validates: Requirements 1.5, 3.5, 6.1**

- [ ]* 8.2 كتابة property test لـ ARIA labels
  - **Property 8: ARIA label completeness**
  - **Validates: Requirements 6.2, 6.5**

- [ ]* 8.3 كتابة accessibility tests
  - اختبار ARIA labels باستخدام axe-core
  - اختبار keyboard navigation
  - اختبار focus indicators
  - اختبار semantic HTML
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9. تطبيق دعم RTL
  - استخدام logical properties (margin-inline-start)
  - ضبط موضع الأيقونات في RTL
  - عكس اتجاه التأثيرات الحركية في RTL
  - ترتيب العناصر من اليمين لليسار
  - استخدام text-align: start
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_


- [ ]* 9.1 كتابة property test لموضع الأيقونات في RTL
  - **Property 9: RTL icon positioning**
  - **Validates: Requirements 7.2**

- [ ]* 9.2 كتابة property test لاتجاه التأثيرات في RTL
  - **Property 10: RTL animation direction**
  - **Validates: Requirements 7.3**

- [ ]* 9.3 كتابة unit tests لدعم RTL
  - اختبار استخدام logical properties
  - اختبار موضع الأيقونات
  - اختبار اتجاه التأثيرات
  - اختبار ترتيب العناصر
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. تطبيق تحسينات الأداء
  - إضافة React.memo للمكون الرئيسي
  - استخدام useMemo للحسابات الثقيلة
  - استخدام useCallback للـ event handlers
  - استخدام CSS transforms بدلاً من position
  - إضافة lazy loading للأيقونات إذا لزم الأمر

  - _Requirements: 8.3, 8.4, 8.5_

- [ ]* 10.1 كتابة property test لـ frame rate
  - **Property 12: Animation frame rate**
  - **Validates: Requirements 8.2**

- [ ]* 10.2 كتابة property test لتحسين re-renders
  - **Property 13: Re-render optimization**
  - **Validates: Requirements 8.5**

- [ ]* 10.3 كتابة performance tests
  - اختبار FCP < 500ms
  - اختبار frame rate >= 60 FPS
  - اختبار عدد re-renders

  - _Requirements: 8.1, 8.2, 8.5_

- [ ] 11. تطبيق دعم prefers-reduced-motion
  - إضافة media query للكشف عن reduced motion
  - تعطيل التأثيرات عند تفعيل reduced motion
  - استخدام durations قصيرة جداً (< 10ms) كبديل
  - _Requirements: 5.2_

- [ ]* 11.1 كتابة property test لـ reduced motion
  - **Property 3: Reduced motion compliance**
  - **Validates: Requirements 5.2**

- [ ]* 11.2 كتابة unit tests لـ reduced motion
  - اختبار تعطيل التأثيرات


  - اختبار استخدام durations قصيرة
  - _Requirements: 5.2_


- [ ] 12. إنشاء ملف CSS للتأثيرات الحركية
  - إنشاء animations.css مع جميع keyframes
  - إضافة shimmer animation
  - إضافة gradient-shift animation
  - إضافة bounce animation

  - إضافة pulse animation
  - إضافة stagger animation utilities
  - _Requirements: 1.1, 2.1, 3.1, 3.3_

- [ ] 13. تحديث الصفحة الرئيسية لاستخدام المكون الجديد
  - استبدال GreetingSection القديم بالجديد
  - التأكد من عمل جميع الوظائف
  - اختبار التكامل مع باقي الصفحة
  - _Requirements: جميع المتطلبات_

- [ ]* 13.1 كتابة integration tests
  - اختبار التكامل مع الصفحة الرئيسية


  - اختبار التفاعل مع المكونات الأخرى
  - _Requirements: جميع المتطلبات_

- [ ] 14. Checkpoint - التأكد من نجاح جميع الاختبارات
  - تشغيل جميع الاختبارات والتأكد من نجاحها
  - إصلاح أي مشاكل أو أخطاء
  - التأكد من عدم وجود console errors
  - اسأل المستخدم إذا كانت هناك أي أسئلة

- [ ] 15. المراجعة النهائية والتحسينات
  - مراجعة الكود للتأكد من جودته
  - التأكد من التزام الكود بمعايير المشروع
  - إضافة تعليقات توضيحية حيث لزم الأمر
  - تحسين أي أجزاء تحتاج تحسين
  - _Requirements: جميع المتطلبات_

- [ ]* 15.1 كتابة visual regression tests
  - إنشاء snapshots للمكون في light mode
  - إنشاء snapshots للمكون في dark mode
  - إنشاء snapshots للمكون على أحجام شاشات مختلفة
  - _Requirements: جميع المتطلبات_

- [ ] 16. Checkpoint النهائي - التأكد من اكتمال كل شيء
  - تشغيل جميع الاختبارات مرة أخرى
  - اختبار المكون على متصفحات مختلفة
  - اختبار المكون على أجهزة مختلفة
  - التأكد من عدم وجود أي مشاكل
  - اسأل المستخدم إذا كانت هناك أي أسئلة أو تعديلات نهائية
