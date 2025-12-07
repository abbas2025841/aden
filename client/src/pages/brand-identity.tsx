import React, { useState } from 'react';
import { Logo, LogoIcon, LogoWithText } from '@/components/Logo';
import { AdeniCharacter, AdeniCharacterWithStates, InteractiveAdeniCharacter } from '@/components/AdeniCharacter';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import MobileNavigation from '@/components/MobileNavigation';
import { 
  Palette, 
  Type, 
  Image, 
  Download, 
  Eye, 
  Copy, 
  Check,
  Sparkles,
  Star,
  Heart,
  Zap
} from 'lucide-react';

export default function BrandIdentityPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedLogoVariant, setSelectedLogoVariant] = useState<'default' | 'white' | 'monochrome'>('default');
  const [selectedCharacterMood, setSelectedCharacterMood] = useState<'happy' | 'thinking' | 'listening' | 'speaking'>('happy');

  // نسخ الألوان
  const copyColor = (color: string, name: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // ألوان العلامة التجارية
  const brandColors = [
    { name: 'عدن الأزرق', value: '#0066FF', description: 'اللون الأساسي للعلامة التجارية' },
    { name: 'شمس عدن', value: '#FFAB00', description: 'اللون الثانوي للعلامة التجارية' },
    { name: 'البيضاء الناصعة', value: '#FAFAFA', description: 'لون الخلفية الأساسي' },
    { name: 'النجاح', value: '#4CAF50', description: 'لون العمليات الناجحة' },
    { name: 'التحذير', value: '#FF9800', description: 'لون التحذيرات' },
    { name: 'الخطأ', value: '#F44336', description: 'لون الأخطاء' },
    { name: 'المعلومات', value: '#2196F3', description: 'لون المعلومات' },
  ];

  // ألوان الخدمات
  const serviceColors = [
    { name: 'المياه', value: '#00BCD4', icon: '💧' },
    { name: 'الكهرباء', value: '#FFC107', icon: '⚡' },
    { name: 'الصحة', value: '#E91E63', icon: '🏥' },
    { name: 'الوظائف', value: '#9C27B0', icon: '💼' },
    { name: 'الخرائط', value: '#4CAF50', icon: '🗺️' },
    { name: 'العملات', value: '#FF5722', icon: '💰' },
    { name: 'الطوارئ', value: '#F44336', icon: '🚨' },
  ];

  // أحجام الشعار
  const logoSizes = [
    { size: 'sm' as const, name: 'صغير', description: '16x16px - للاستخدام في الأيقونات' },
    { size: 'md' as const, name: 'متوسط', description: '24x24px - للاستخدام في الشريط العلوي' },
    { size: 'lg' as const, name: 'كبير', description: '32x32px - للاستخدام في الصفحات' },
    { size: 'xl' as const, name: 'ضخم', description: '48x48px - للاستخدام في العروض التقديمية' },
  ];

  // أحجام الشخصية
  const characterSizes = [
    { size: 'sm' as const, name: 'صغير', description: '64x64px - للاستخدام في الأيقونات' },
    { size: 'md' as const, name: 'متوسط', description: '96x96px - للاستخدام في الواجهات' },
    { size: 'lg' as const, name: 'كبير', description: '128x128px - للاستخدام في الصفحات' },
    { size: 'xl' as const, name: 'ضخم', description: '192x192px - للاستخدام في العروض' },
  ];

  return (
    <div className="min-h-screen bg-aden-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* الهيدر */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Logo size="xl" animated />
            <div>
              <h1 className="text-4xl font-bold text-aden-primary mb-2">الهوية البصرية</h1>
              <p className="text-xl text-aden-muted">عدن لايف - خدمات عدن الذكية</p>
            </div>
          </div>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            الهوية البصرية الشاملة لتطبيق عدن لايف، مصممة لتعكس روح عدن وثقافتها 
            مع الحفاظ على الحداثة والوضوح في التصميم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* الشعار */}
          <section>
            <h2 className="text-2xl font-bold text-aden-primary mb-6 flex items-center gap-2">
              <Image className="w-6 h-6" />
              الشعار
            </h2>
            
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">معنى الشعار</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">ع</span>
                  <div>
                    <strong>عين عدنية:</strong> رمز المعرفة والحكمة
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">د</span>
                  <div>
                    <strong>درع المدينة:</strong> رمز الأمان والحماية
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">ن</span>
                  <div>
                    <strong>نجمة عدن:</strong> رمز التميز والجودة
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">ي</span>
                  <div>
                    <strong>يد المساعدة:</strong> رمز الخدمة والمساعدة
                  </div>
                </div>
              </div>
            </Card>

            {/* متغيرات الشعار */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">متغيرات الشعار</h3>
              <div className="flex gap-4 mb-4">
                {(['default', 'white', 'monochrome'] as const).map((variant) => (
                  <Button
                    key={variant}
                    variant={selectedLogoVariant === variant ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLogoVariant(variant)}
                  >
                    {variant === 'default' ? 'افتراضي' : 
                     variant === 'white' ? 'أبيض' : 'أحادي اللون'}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <LogoIcon size="lg" variant={selectedLogoVariant} />
                  <p className="text-sm text-gray-600 mt-2">الشعار فقط</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <LogoWithText size="lg" variant={selectedLogoVariant} />
                  <p className="text-sm text-gray-600 mt-2">الشعار مع النص</p>
                </div>
              </div>
            </Card>

            {/* أحجام الشعار */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">الأحجام المختلفة</h3>
              <div className="space-y-4">
                {logoSizes.map(({ size, name, description }) => (
                  <div key={size} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <LogoIcon size={size} variant={selectedLogoVariant} />
                    <div>
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* الشخصية */}
          <section>
            <h2 className="text-2xl font-bold text-aden-primary mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              شخصية عدني
            </h2>
            
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">خصائص الشخصية</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  <div>
                    <strong>وجه بشوش:</strong> مرح ومضياف
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👁️</span>
                  <div>
                    <strong>عينان ذكيتان:</strong> متحركتان وذكيتان
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧔</span>
                  <div>
                    <strong>لحية خفيفة:</strong> أناقة عدنية
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👳</span>
                  <div>
                    <strong>عمامة عدنية:</strong> تراث وتقاليد
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👕</span>
                  <div>
                    <strong>ثوب أزرق:</strong> ألوان عدن
                  </div>
                </div>
              </div>
            </Card>

            {/* حالات الشخصية */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">حالات الشخصية</h3>
              <div className="flex gap-4 mb-4">
                {(['happy', 'thinking', 'listening', 'speaking'] as const).map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedCharacterMood === mood ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCharacterMood(mood)}
                  >
                    {mood === 'happy' ? 'سعيد' : 
                     mood === 'thinking' ? 'يفكر' : 
                     mood === 'listening' ? 'يستمع' : 'يتحدث'}
                  </Button>
                ))}
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <AdeniCharacter 
                  size="lg" 
                  mood={selectedCharacterMood}
                  talking={selectedCharacterMood === 'speaking'}
                  animated
                />
                <p className="text-sm text-gray-600 mt-2">
                  {selectedCharacterMood === 'happy' ? 'حالة سعيدة ومرحبة' : 
                   selectedCharacterMood === 'thinking' ? 'حالة تفكير وتحليل' : 
                   selectedCharacterMood === 'listening' ? 'حالة استماع واهتمام' : 'حالة حديث وتواصل'}
                </p>
              </div>
            </Card>

            {/* أحجام الشخصية */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">الأحجام المختلفة</h3>
              <div className="space-y-4">
                {characterSizes.map(({ size, name, description }) => (
                  <div key={size} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <AdeniCharacter size={size} animated />
                    <div>
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {/* الألوان */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-aden-primary mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6" />
            نظام الألوان
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* الألوان الأساسية */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">الألوان الأساسية</h3>
              <div className="space-y-3">
                {brandColors.map(({ name, value, description }) => (
                  <div key={name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: value }}
                      onClick={() => copyColor(value, name)}
                    >
                      {copiedColor === name && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                      <p className="text-xs text-gray-500 font-mono">{value}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyColor(value, name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* ألوان الخدمات */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ألوان الخدمات</h3>
              <div className="space-y-3">
                {serviceColors.map(({ name, value, icon }) => (
                  <div key={name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: value }}
                      onClick={() => copyColor(value, name)}
                    >
                      {copiedColor === name ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <span className="text-xl">{icon}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{value}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyColor(value, name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* التدرجات */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-aden-primary mb-6 flex items-center gap-2">
            <Star className="w-6 h-6" />
            التدرجات والأساليب
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-full h-24 bg-aden-gradient rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">التدرج الأساسي</h3>
              <p className="text-sm text-gray-600">من الأزرق إلى البرتقالي</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-full h-24 bg-gradient-aden-ocean rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">تدرج المحيط</h3>
              <p className="text-sm text-gray-600">درجات الأزرق</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-full h-24 bg-gradient-aden-fire rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">تدرج النار</h3>
              <p className="text-sm text-gray-600">درجات البرتقالي</p>
            </Card>
          </div>
        </section>

        {/* أمثلة التطبيق */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-aden-primary mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            أمثلة التطبيق
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">الأزرار</h3>
              <div className="space-y-3">
                <Button className="btn-aden-primary w-full">زر أساسي</Button>
                <Button className="btn-aden-secondary w-full">زر ثانوي</Button>
                <Button variant="outline" className="w-full">زر محدد</Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">البطاقات</h3>
              <div className="space-y-3">
                <div className="card-aden p-4">
                  <h4 className="font-semibold text-aden-primary">بطاقة عدن</h4>
                  <p className="text-sm text-gray-600">مثال على استخدام البطاقة</p>
                </div>
                <div className="card-aden aden-hover p-4">
                  <h4 className="font-semibold text-aden-primary">بطاقة تفاعلية</h4>
                  <p className="text-sm text-gray-600">تأثيرات الحركة</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* الشخصية التفاعلية */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-aden-primary mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            شخصية عدني التفاعلية
          </h2>
          
          <Card className="p-8 text-center">
            <div className="mb-6">
              <InteractiveAdeniCharacter size="xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">تفاعل مع عدني</h3>
            <p className="text-gray-600 mb-4">
              مرر الماوس فوق الشخصية أو انقر عليها لرؤية التفاعلات المختلفة
            </p>
            <div className="flex justify-center gap-4">
              <AdeniCharacterWithStates size="lg" />
            </div>
          </Card>
        </section>
      </main>

      <AppFooter />
      <MobileNavigation />
    </div>
  );
}
