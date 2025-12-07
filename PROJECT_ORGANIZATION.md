# AdenLive App - Project Organization

## هيكل المشروع المنظم

تم تنظيم المشروع ليكون جميع الملفات والبيانات في مسار `D:\Projects\AdenLiveApp-Complete\`

### المجلدات الرئيسية:

```
D:\Projects\AdenLiveApp-Complete\
├── SourceCode\                 # الكود المصدري للتطبيق
├── Data\                      # جميع البيانات والملفات المؤقتة
│   ├── cache\                 # ملفات التخزين المؤقت
│   │   ├── npm-cache\         # تخزين npm المحلي
│   │   └── vite\              # تخزين Vite
│   ├── temp\                  # الملفات المؤقتة
│   │   └── npm-tmp\           # مجلد npm المؤقت
│   ├── logs\                  # ملفات السجلات
│   ├── database\              # قاعدة البيانات
│   ├── android-studio-cache\  # ملفات Android Studio المنقولة
│   └── typescript-cache\      # ملفات TypeScript المنقولة
├── BuiltApp\                  # التطبيق المبني
└── Documentation\             # الوثائق
```

### الملفات المنقولة من القرص C:

1. **ملفات Android Studio**: تم نقلها من `C:\Users\DELL\AppData\Local\Google\AndroidStudio2025.1.2\`
2. **ملفات npm logs**: تم نقلها من `C:\Users\DELL\AppData\Local\npm-cache\_logs\`
3. **ملفات TypeScript**: تم نقلها من `C:\Users\DELL\AppData\Local\Microsoft\TypeScript\`
4. **ملفات Node.js المؤقتة**: تم نقلها من `C:\Users\DELL\AppData\Local\Temp\`

### التكوين الجديد:

- **`.npmrc`**: توجيه npm لاستخدام المجلدات المحلية
- **`config.local.js`**: تكوين متغيرات البيئة المحلية
- **`scripts/cleanup.js`**: سكريبت تنظيف الملفات المؤقتة

### الأوامر الجديدة:

```bash
npm run clean          # تنظيف الملفات المؤقتة
npm run clean:cache    # تنظيف مجلد التخزين المؤقت
npm run clean:temp     # تنظيف المجلد المؤقت
npm run clean:logs     # تنظيف ملفات السجلات
```

### الفوائد:

1. **تنظيم أفضل**: جميع الملفات في مكان واحد
2. **سهولة النسخ الاحتياطي**: مجلد واحد يحتوي على كل شيء
3. **أداء أفضل**: استخدام مجلدات محلية بدلاً من القرص C
4. **سهولة الصيانة**: سكريبتات تنظيف تلقائية

## كيفية التشغيل:

```bash
cd D:\Projects\AdenLiveApp-Complete\SourceCode
npm install
npm run dev
```

التطبيق سيعمل على: `http://localhost:5000`
