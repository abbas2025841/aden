import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Users, 
  Home, 
  Droplets,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

const ConsumptionCalculatorPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [familyMembers, setFamilyMembers] = useState(4);
  const [interruptionHours, setInterruptionHours] = useState(8);
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [usageTypes, setUsageTypes] = useState({
    drinking: true,
    bathing: true,
    washing: true,
    cleaning: false,
    dishes: true,
    cooking: true,
    toilet: true
  });

  // حالة الأجهزة المضافة من المستخدم
  const [customDevices, setCustomDevices] = useState<any[]>([]);

  // تحميل الأجهزة المحفوظة من localStorage
  useEffect(() => {
    const savedDevices = localStorage.getItem('customWaterDevices');
    if (savedDevices) {
      try {
        setCustomDevices(JSON.parse(savedDevices));
      } catch (error) {
        console.error('خطأ في تحميل الأجهزة المحفوظة:', error);
      }
    }
  }, []);

  const defaultUsageData = {
    drinking: { label: 'شرب وطبخ', consumption: 20, unit: 'لتر/شخص يومياً', icon: '💧', category: 'أساسي' },
    bathing: { label: 'استحمام', consumption: 40, unit: 'لتر/شخص يومياً', icon: '🚿', category: 'أساسي' },
    washing: { label: 'غسيل ملابس', consumption: 30, unit: 'لتر/دورة غسيل', icon: '👕', category: 'أساسي' },
    dishes: { label: 'غسيل أطباق', consumption: 15, unit: 'لتر/شخص يومياً', icon: '🍽️', category: 'أساسي' },
    cooking: { label: 'طبخ', consumption: 10, unit: 'لتر/شخص يومياً', icon: '🍳', category: 'أساسي' },
    toilet: { label: 'دورة المياه', consumption: 25, unit: 'لتر/شخص يومياً', icon: '🚽', category: 'أساسي' },
    cleaning: { label: 'تنظيف منزل', consumption: 25, unit: 'لتر/يوم', icon: '🧽', category: 'منزلي' }
  };

  // دمج البيانات الافتراضية مع الأجهزة المخصصة
  const usageData = { ...defaultUsageData, ...customDevices };

  const calculateConsumption = () => {
    let totalConsumption = 0;
    let breakdown = [];
    let dailyConsumption = 0;
    let weeklyConsumption = 0;
    let monthlyConsumption = 0;
    
    // الاستخدامات الأساسية (حسب عدد الأشخاص)
    if (usageTypes.drinking) {
      const consumption = usageData.drinking.consumption * familyMembers;
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.drinking.label, 
        consumption: Math.round(consumption), 
        icon: usageData.drinking.icon,
        percentage: 0 // سيتم حسابها لاحقاً
      });
    }
    if (usageTypes.bathing) {
      const consumption = usageData.bathing.consumption * familyMembers;
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.bathing.label, 
        consumption: Math.round(consumption), 
        icon: usageData.bathing.icon,
        percentage: 0
      });
    }
    if (usageTypes.dishes) {
      const consumption = usageData.dishes.consumption * familyMembers;
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.dishes.label, 
        consumption: Math.round(consumption), 
        icon: usageData.dishes.icon,
        percentage: 0
      });
    }
    if (usageTypes.cooking) {
      const consumption = usageData.cooking.consumption * familyMembers;
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.cooking.label, 
        consumption: Math.round(consumption), 
        icon: usageData.cooking.icon,
        percentage: 0
      });
    }
    if (usageTypes.toilet) {
      const consumption = usageData.toilet.consumption * familyMembers;
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.toilet.label, 
        consumption: Math.round(consumption), 
        icon: usageData.toilet.icon,
        percentage: 0
      });
    }
    
    // الاستخدامات المنزلية (مرة واحدة في اليوم)
    if (usageTypes.washing) {
      const consumption = usageData.washing.consumption * Math.ceil(familyMembers / 2);
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.washing.label, 
        consumption: Math.round(consumption), 
        icon: usageData.washing.icon,
        percentage: 0
      });
    }
    if (usageTypes.cleaning) {
      const consumption = usageData.cleaning.consumption;
      totalConsumption += consumption;
      breakdown.push({ 
        label: usageData.cleaning.label, 
        consumption: Math.round(consumption), 
        icon: usageData.cleaning.icon,
        percentage: 0
      });
    }
    
    // حساب النسب المئوية
    breakdown.forEach(item => {
      item.percentage = Math.round((item.consumption / totalConsumption) * 100);
    });
    
    // حساب الاستهلاك لفترات مختلفة
    dailyConsumption = Math.round(totalConsumption);
    weeklyConsumption = Math.round(dailyConsumption * 7);
    monthlyConsumption = Math.round(dailyConsumption * 30);
    
    // حساب سعة الخزان المطلوبة (1.5x الاستهلاك اليومي + 20% احتياطي)
    const tankCapacity = Math.round(dailyConsumption * 1.7);
    
    
    
    return {
      total: dailyConsumption,
      breakdown: breakdown.sort((a, b) => b.consumption - a.consumption),
      daily: dailyConsumption,
      weekly: weeklyConsumption,
      monthly: monthlyConsumption,
      tankCapacity: tankCapacity,
      familyMembers: familyMembers
    };
  };

  const handleUsageTypeChange = (type: keyof typeof usageTypes) => {
    setUsageTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // دوال إدارة الأجهزة المخصصة
  const handleAddCustomDevice = (deviceData: any) => {
    const newId = `custom_${Date.now()}`;
    const newDevice = {
      id: newId,
      label: deviceData.label,
      consumption: deviceData.consumption,
      unit: deviceData.unit,
      icon: deviceData.icon,
      category: deviceData.category || 'مخصص'
    };
    
    const updatedCustomDevices = [...customDevices, newDevice];
    setCustomDevices(updatedCustomDevices);
    localStorage.setItem('customWaterDevices', JSON.stringify(updatedCustomDevices));
  };

  const handleDeleteCustomDevice = (deviceId: string) => {
    const updatedCustomDevices = customDevices.filter(device => device.id !== deviceId);
    setCustomDevices(updatedCustomDevices);
    localStorage.setItem('customWaterDevices', JSON.stringify(updatedCustomDevices));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/water')}
            className="p-2 text-sky-300 hover:bg-teal-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-xl font-bold text-white">حاسبة استهلاك المياه</h1>
          </div>
        </div>

        {/* عدد أفراد الأسرة */}
        <div className="mb-6 bg-teal-800 bg-opacity-80 rounded-xl p-4 border border-teal-600">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-sky-300" />
            <h3 className="text-lg font-bold text-white">عدد أفراد الأسرة: {familyMembers} أشخاص</h3>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={familyMembers}
            onChange={(e) => setFamilyMembers(parseInt(e.target.value))}
            className="w-full h-2 bg-teal-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(familyMembers - 1) * 7.14}%, #374151 ${(familyMembers - 1) * 7.14}%, #374151 100%)`
            }}
          />
        </div>

        {/* ساعات انقطاع المياه */}
        <div className="mb-6 bg-teal-800 bg-opacity-80 rounded-xl p-4 border border-teal-600">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-sky-300" />
            <h3 className="text-lg font-bold text-white">ساعات انقطاع المياه: {interruptionHours} ساعة يومياً</h3>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            value={interruptionHours}
            onChange={(e) => setInterruptionHours(parseInt(e.target.value))}
            className="w-full h-2 bg-teal-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${interruptionHours * 4.17}%, #374151 ${interruptionHours * 4.17}%, #374151 100%)`
            }}
          />
        </div>

        {/* نوع الاستخدام */}
        <div className="mb-6 bg-teal-800 bg-opacity-80 rounded-xl p-4 border border-teal-600">
          <h3 className="text-lg font-bold text-white mb-4">نوع الاستخدام</h3>
          
          {/* عداد الأجهزة المخصصة */}
          {customDevices.length > 0 && (
            <div className="mb-4 p-3 bg-teal-700 rounded-lg">
              <p className="text-sky-300 text-sm">
                الأجهزة المخصصة: {customDevices.length}
              </p>
            </div>
          )}
          
          {/* الاستخدامات الأساسية */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-cyan-300 mb-3">الاستخدامات الأساسية</h4>
          <div className="space-y-3">
              {Object.entries(usageData).filter(([_, data]) => (data as any).category === 'أساسي').map(([key, data]) => (
                <div key={key} className="flex items-center justify-between bg-teal-700 bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={usageTypes[key as keyof typeof usageTypes]}
                    onChange={() => handleUsageTypeChange(key as keyof typeof usageTypes)}
                    className="w-5 h-5 text-blue-600 bg-teal-700 border-teal-500 rounded focus:ring-blue-500"
                  />
                    <span className="text-2xl">{(data as any).icon}</span>
                  <div>
                    <span className="text-white font-medium">
                      {(data as any).label}
                      {key.startsWith('custom_') && (
                        <span className="text-yellow-400 text-xs mr-2">(مخصص)</span>
                      )}
                    </span>
                    <p className="text-sm text-sky-300">{(data as any).consumption} {(data as any).unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {key.startsWith('custom_') && (
                    <button
                      onClick={() => {
                        if (confirm('هل تريد حذف هذا الجهاز المخصص؟')) {
                          handleDeleteCustomDevice(key);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-1 rounded"
                      title="حذف الجهاز المخصص"
                    >
                      🗑️
                    </button>
                  )}
                  {usageTypes[key as keyof typeof usageTypes] && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>

          {/* الاستخدامات المنزلية */}
          <div className="mb-4">
            <h4 className="text-md font-semibold text-cyan-300 mb-3">الاستخدامات المنزلية</h4>
          <div className="space-y-3">
              {Object.entries(usageData).filter(([_, data]) => (data as any).category === 'منزلي').map(([key, data]) => (
                <div key={key} className="flex items-center justify-between bg-teal-700 bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={usageTypes[key as keyof typeof usageTypes]}
                    onChange={() => handleUsageTypeChange(key as keyof typeof usageTypes)}
                    className="w-5 h-5 text-blue-600 bg-teal-700 border-teal-500 rounded focus:ring-blue-500"
                  />
                    <span className="text-2xl">{(data as any).icon}</span>
                  <div>
                    <span className="text-white font-medium">
                      {(data as any).label}
                      {key.startsWith('custom_') && (
                        <span className="text-yellow-400 text-xs mr-2">(مخصص)</span>
                      )}
                    </span>
                    <p className="text-sm text-sky-300">{(data as any).consumption} {(data as any).unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {key.startsWith('custom_') && (
                    <button
                      onClick={() => {
                        if (confirm('هل تريد حذف هذا الجهاز المخصص؟')) {
                          handleDeleteCustomDevice(key);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-1 rounded"
                      title="حذف الجهاز المخصص"
                    >
                      🗑️
                    </button>
                  )}
                {usageTypes[key as keyof typeof usageTypes] && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                </div>
              </div>
            ))}
          </div>
          </div>

        </div>

        {/* إضافة جهاز مخصص */}
        <div className="mb-6 bg-teal-800 bg-opacity-80 rounded-xl p-4 border border-teal-600">
          <h3 className="text-lg font-bold text-white mb-4">إضافة استخدام مخصص</h3>
          <AddCustomDeviceForm onAdd={handleAddCustomDevice} />
        </div>

        {/* زر الحساب */}
        <div className="mb-6">
          <Button 
            onClick={() => {
              const results = calculateConsumption();
              setCalculationResults(results);
              setShowResults(true);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
          >
            <Calculator className="w-5 h-5 mr-2" />
            احسب الاستهلاك
          </Button>
        </div>

        {/* عرض النتائج */}
        {showResults && calculationResults && (
          <div className="mb-6 bg-gradient-to-r from-blue-900 to-teal-900 rounded-xl p-6 border border-blue-600">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">نتائج الحساب</h3>
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                {calculationResults.total} لتر
              </div>
              <p className="text-sky-300">الاستهلاك اليومي المتوقع</p>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-teal-800 bg-opacity-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{calculationResults.weekly}</div>
                <div className="text-sm text-sky-300">لتر/أسبوع</div>
              </div>
              <div className="bg-teal-800 bg-opacity-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{calculationResults.monthly}</div>
                <div className="text-sm text-sky-300">لتر/شهر</div>
              </div>
            </div>

            {/* تفصيل الاستهلاك مع النسب المئوية */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">تفصيل الاستهلاك:</h4>
              <div className="space-y-2">
                {calculationResults.breakdown.map((item: any, index: number) => (
                  <div key={index} className="bg-teal-800 bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-white font-medium">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">{item.consumption} لتر</div>
                        <div className="text-xs text-sky-300">{item.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-teal-700 rounded-full h-2">
                      <div 
                        className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
          </div>
                ))}
              </div>
            </div>

            {/* توصيات محسنة */}
            <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4 border border-yellow-600 mb-4">
              <h4 className="text-lg font-semibold text-yellow-200 mb-3">توصيات:</h4>
              <div className="grid grid-cols-1 gap-3 text-sm text-yellow-100">
                <div className="flex justify-between items-center">
                  <span>سعة الخزان المطلوبة:</span>
                  <span className="font-bold text-yellow-200">{calculationResults.tankCapacity} لتر</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>الاستهلاك الشهري:</span>
                  <span className="font-bold text-yellow-200">{calculationResults.monthly} لتر</span>
                </div>
              </div>
        </div>


            <Button 
              onClick={() => setShowResults(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
            >
              إغلاق النتائج
            </Button>
          </div>
        )}


        {/* زر العودة */}
        <div className="mt-6">
          <Button 
            onClick={() => setLocation('/water')}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة لخدمات المياه
          </Button>
        </div>
      </main>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  );
};

// مكون إضافة جهاز مخصص
const AddCustomDeviceForm: React.FC<{ onAdd: (device: any) => void }> = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    consumption: '',
    unit: 'لتر/يوم',
    icon: '💧',
    category: 'مخصص'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.label && formData.consumption) {
      onAdd(formData);
      setFormData({
        label: '',
        consumption: '',
        unit: 'لتر/يوم',
        icon: '💧',
        category: 'مخصص'
      });
      setShowForm(false);
    }
  };

  const icons = ['💧', '🚿', '👕', '🍽️', '🍳', '🚽', '🧽', '🏠', '🌱', '🔧'];

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + إضافة استخدام مخصص
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sky-300 mb-2">
              اسم الاستخدام
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="مثال: غسيل السيارة"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sky-300 mb-2">
                الاستهلاك
              </label>
              <input
                type="number"
                value={formData.consumption}
                onChange={(e) => setFormData({ ...formData, consumption: e.target.value })}
                className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-300 mb-2">
                الوحدة
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="لتر/يوم">لتر/يوم</option>
                <option value="لتر/شخص يومياً">لتر/شخص يومياً</option>
                <option value="لتر/دورة">لتر/دورة</option>
                <option value="لتر/ساعة">لتر/ساعة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sky-300 mb-2">
              الأيقونة
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-2 rounded-lg text-2xl ${
                    formData.icon === icon ? 'bg-yellow-400' : 'bg-teal-700 hover:bg-teal-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              إضافة
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ConsumptionCalculatorPage;
