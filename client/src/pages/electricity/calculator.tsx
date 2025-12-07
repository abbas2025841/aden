import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import { ArrowLeft, Battery, Zap, Search, Filter, Plus, Clock, DollarSign } from "lucide-react";

export default function ElectricityCalculator() {
  const [batteryCapacity, setBatteryCapacity] = useState(3000);
  const [batteryVoltage, setBatteryVoltage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPowerRange, setSelectedPowerRange] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPowerOpen, setIsPowerOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    consumption: '',
    category: '',
    icon: '🔌'
  });
  const [selectedDevices, setSelectedDevices] = useState({
    tv: true,
    fan: true,
    lights: true,
    router: true,
    ac: false,
    washing: false,
    fridge: false,
    microwave: false,
    laptop: false,
    phone: false,
    iron: false,
    heater: false,
    water_heater: false,
    dishwasher: false,
    vacuum: false,
    blender: false,
    coffee_maker: false,
    printer: false,
    monitor: false,
    speaker: false,
  });
  
  // حالة الأجهزة المضافة من المستخدم
  const [customDevices, setCustomDevices] = useState<any[]>([]);

  // تحميل الأجهزة المحفوظة من localStorage
  useEffect(() => {
    const savedDevices = localStorage.getItem('customDevices');
    if (savedDevices) {
      try {
        setCustomDevices(JSON.parse(savedDevices));
      } catch (error) {
        console.error('خطأ في تحميل الأجهزة المحفوظة:', error);
      }
    }
  }, []);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsCategoryOpen(false);
        setIsPowerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const defaultDevices = [
    { id: "tv", name: "تلفزيون", icon: "📺", consumption: 150, unit: "وات", category: "entertainment" },
    { id: "fan", name: "مروحة", icon: "🌀", consumption: 75, unit: "وات", category: "cooling" },
    { id: "lights", name: "لمبات", icon: "💡", consumption: 60, unit: "وات", category: "lighting" },
    { id: "router", name: "راوتر", icon: "📡", consumption: 10, unit: "وات", category: "electronics" },
    { id: "ac", name: "مكيف هواء", icon: "❄️", consumption: 2000, unit: "وات", category: "cooling" },
    { id: "washing", name: "غسالة", icon: "🧺", consumption: 500, unit: "وات", category: "appliances" },
    { id: "fridge", name: "ثلاجة", icon: "🧊", consumption: 200, unit: "وات", category: "appliances" },
    { id: "microwave", name: "ميكروويف", icon: "🔥", consumption: 1000, unit: "وات", category: "appliances" },
    { id: "laptop", name: "لابتوب", icon: "💻", consumption: 50, unit: "وات", category: "electronics" },
    { id: "phone", name: "شحن الهاتف", icon: "📱", consumption: 5, unit: "وات", category: "electronics" },
    { id: "iron", name: "مكواة", icon: "👔", consumption: 1000, unit: "وات", category: "appliances" },
    { id: "heater", name: "سخان", icon: "🔥", consumption: 1500, unit: "وات", category: "heating" },
    { id: "water_heater", name: "سخان ماء", icon: "🚿", consumption: 3000, unit: "وات", category: "heating" },
    { id: "dishwasher", name: "غسالة أطباق", icon: "🍽️", consumption: 1200, unit: "وات", category: "appliances" },
    { id: "vacuum", name: "مكنسة كهربائية", icon: "🧹", consumption: 800, unit: "وات", category: "appliances" },
    { id: "blender", name: "خلاط", icon: "🥤", consumption: 300, unit: "وات", category: "appliances" },
    { id: "coffee_maker", name: "ماكينة قهوة", icon: "☕", consumption: 800, unit: "وات", category: "appliances" },
    { id: "printer", name: "طابعة", icon: "🖨️", consumption: 50, unit: "وات", category: "electronics" },
    { id: "monitor", name: "شاشة", icon: "🖥️", consumption: 25, unit: "وات", category: "electronics" },
    { id: "speaker", name: "مكبر صوت", icon: "🔊", consumption: 20, unit: "وات", category: "entertainment" },
  ];

  // دمج الأجهزة الافتراضية مع الأجهزة المخصصة
  const devices = [...defaultDevices, ...customDevices];

  // خيارات الفلترة
  const categoryOptions = [
    { id: 'all', name: 'جميع الفئات', count: 20, icon: '🔌' },
    { id: 'entertainment', name: 'ترفيه', count: 3, icon: '📺' },
    { id: 'cooling', name: 'تبريد', count: 2, icon: '❄️' },
    { id: 'lighting', name: 'إضاءة', count: 1, icon: '💡' },
    { id: 'electronics', name: 'إلكترونيات', count: 6, icon: '📱' },
    { id: 'appliances', name: 'أجهزة منزلية', count: 6, icon: '🧺' },
    { id: 'heating', name: 'تسخين', count: 2, icon: '🔥' }
  ];

  const powerRangeOptions = [
    { id: 'all', name: 'جميع القدرات', count: 20, icon: '⚡' },
    { id: 'low', name: 'أقل من 100 وات', count: 8, icon: '💡' },
    { id: 'medium', name: '100 - 1000 وات', count: 8, icon: '🔌' },
    { id: 'high', name: 'أكثر من 1000 وات', count: 4, icon: '⚡' }
  ];

  // منطق الفلترة والبحث
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || device.category === selectedCategory;
    
    const matchesPower = (() => {
      switch (selectedPowerRange) {
        case 'low':
          return device.consumption < 100;
        case 'medium':
          return device.consumption >= 100 && device.consumption <= 1000;
        case 'high':
          return device.consumption > 1000;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesCategory && matchesPower;
  });



  const calculateBatteryLife = () => {
    const totalConsumption = devices.reduce((total, device) => {
      return selectedDevices[device.id as keyof typeof selectedDevices] 
        ? total + device.consumption 
        : total;
    }, 0);

    // التحقق من صحة المدخلات
    if (totalConsumption === 0) {
      return { 
        hours: 0, 
        minutes: 0, 
        totalConsumption: 0, 
        error: "لم يتم اختيار أي أجهزة",
        batteryPower: 0
      };
    }

    if (!batteryCapacity || batteryCapacity <= 0) {
      return { 
        hours: 0, 
        minutes: 0, 
        totalConsumption, 
        error: "يرجى إدخال سعة البطارية (أمبير ساعة)",
        batteryPower: 0
      };
    }

    if (!batteryVoltage || batteryVoltage <= 0) {
      return { 
        hours: 0, 
        minutes: 0, 
        totalConsumption, 
        error: "يرجى إدخال فولت البطارية",
        batteryPower: 0
      };
    }

    // حساب الطاقة الإجمالية للبطارية (وات ساعة)
    const batteryPower = batteryCapacity * batteryVoltage; // أمبير × فولت = وات ساعة
    
    // حساب مدة البطارية (بالساعات)
    const batteryLifeHours = batteryPower / totalConsumption;
    
    // التحقق من أن النتيجة منطقية
    if (batteryLifeHours < 0.01) {
      return { 
        hours: 0, 
        minutes: 0, 
        totalConsumption, 
        error: "الاستهلاك أكبر من سعة البطارية",
        batteryPower
      };
    }
    
    const hours = Math.floor(batteryLifeHours);
    const minutes = Math.floor((batteryLifeHours - hours) * 60);
    
    return { 
      hours, 
      minutes, 
      totalConsumption, 
      error: null,
      batteryPower: Math.round(batteryPower)
    };
  };

  const result = calculateBatteryLife();

  // دوال إدارة النموذج
  const handleAddDevice = () => {
    if (newDevice.name && newDevice.consumption && newDevice.category) {
      const newId = `custom_${Date.now()}`;
      const newDeviceData = {
        id: newId,
        name: newDevice.name,
        icon: newDevice.icon,
        consumption: parseInt(newDevice.consumption),
        unit: "وات",
        category: newDevice.category
      };
      
      // إضافة الجهاز الجديد للقائمة المخصصة
      const updatedCustomDevices = [...customDevices, newDeviceData];
      setCustomDevices(updatedCustomDevices);
      
      // حفظ في localStorage
      localStorage.setItem('customDevices', JSON.stringify(updatedCustomDevices));
      
      console.log('جهاز جديد:', newDeviceData);
      alert('تم إضافة الجهاز بنجاح!');
      
      setNewDevice({
        name: '',
        consumption: '',
        category: '',
        icon: '🔌'
      });
      setShowAddForm(false);
    } else {
      alert('يرجى ملء الحقول المطلوبة (الاسم، الاستهلاك، الفئة)');
    }
  };


  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId as keyof typeof prev]
    }));
  };

  // دالة حذف الجهاز المخصص
  const handleDeleteCustomDevice = (deviceId: string) => {
    const updatedCustomDevices = customDevices.filter(device => device.id !== deviceId);
    setCustomDevices(updatedCustomDevices);
    localStorage.setItem('customDevices', JSON.stringify(updatedCustomDevices));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => window.history.back()}
            className="p-2 text-sky-300 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-white">حاسبة الكهرباء</h1>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن جهاز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sky-300">🔍</span>
            </div>
          </div>
        </div>

        {/* أزرار الفلترة */}
        <div className="mb-6 space-y-3">
          {/* فلتر الفئة */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                if (!isCategoryOpen) {
                  setIsPowerOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{categoryOptions.find(opt => opt.id === selectedCategory)?.icon}</span>
                <span>{categoryOptions.find(opt => opt.id === selectedCategory)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedCategory(option.id);
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
            </div>
            )}
          </div>
          
          {/* فلتر القدرة */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsPowerOpen(!isPowerOpen);
                if (!isPowerOpen) {
                  setIsCategoryOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{powerRangeOptions.find(opt => opt.id === selectedPowerRange)?.icon}</span>
                <span>{powerRangeOptions.find(opt => opt.id === selectedPowerRange)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isPowerOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isPowerOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {powerRangeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedPowerRange(option.id);
                      setIsPowerOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {option.count}
                    </span>
            </button>
                ))}
              </div>
            )}
            </div>
          </div>
          
        {/* عدد النتائج */}
        <div className="mb-4 text-center">
          <p className="text-sky-300 text-sm">
            عرض {filteredDevices.length} من {devices.length} جهاز
          </p>
        </div>

        {/* زر إضافة جهاز جديد */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showAddForm ? 'إلغاء إضافة جهاز' : 'إضافة جهاز جديد'}
          </button>
        </div>

        {/* نموذج إضافة جهاز جديد */}
        {showAddForm && (
          <div className="mb-6 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-yellow-400" />
              إضافة جهاز جديد
            </h3>
            
            <div className="space-y-4">
              {/* اسم الجهاز */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  اسم الجهاز *
                </label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: مكيف هواء"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* الاستهلاك والفئة */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    الاستهلاك (وات) *
                  </label>
                  <input
                    type="number"
                    value={newDevice.consumption}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, consumption: e.target.value }))}
                    placeholder="2000"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    الفئة *
                  </label>
                  <select
                    value={newDevice.category}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">اختر الفئة</option>
                    {categoryOptions.filter(opt => opt.id !== 'all').map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
          </div>
        </div>

              {/* الأيقونة */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  الأيقونة
                </label>
                <input
                  type="text"
                  value={newDevice.icon}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="❄️"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddDevice}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  إضافة الجهاز
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* إدخال مواصفات البطارية */}
        <div className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Battery className="w-5 h-5 text-yellow-400" />
            مواصفات البطارية
          </h2>
          
          <div className="space-y-4">
            {/* سعة البطارية */}
            <div>
              <label className="block text-sm font-medium text-sky-300 mb-2">
                سعة البطارية (أمبير ساعة)
              </label>
          <div className="flex items-center">
                <Battery className="w-6 h-6 text-yellow-400 ml-2" />
            <input
              type="number"
                  value={batteryCapacity || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                      setBatteryCapacity(value === '' ? 0 : Number(value));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === '' || Number(value) <= 0) {
                      setBatteryCapacity(3000); // قيمة افتراضية
                    }
                  }}
                  className="flex-1 p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 text-center text-lg font-semibold"
              placeholder="3000"
                  min="1"
                />
                <span className="text-sky-300 mr-2">أمبير ساعة</span>
              </div>
            </div>

            {/* فولت البطارية */}
            <div>
              <label className="block text-sm font-medium text-sky-300 mb-2">
                فولت البطارية
              </label>
              <div className="flex items-center">
                <Zap className="w-6 h-6 text-yellow-400 ml-2" />
                <input
                  type="number"
                  value={batteryVoltage || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                      setBatteryVoltage(value === '' ? 0 : Number(value));
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === '' || Number(value) <= 0) {
                      setBatteryVoltage(12); // قيمة افتراضية
                    }
                  }}
                  className="flex-1 p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 text-center text-lg font-semibold"
                  placeholder="12"
                  min="1"
                />
                <span className="text-sky-300 mr-2">فولت</span>
              </div>
            </div>

            {/* معلومات توضيحية */}
            <div className="bg-teal-700 rounded-lg p-3">
              <p className="text-sky-300 text-sm">
                💡 <strong>نصيحة:</strong> معظم البطاريات المنزلية 12V، والبطاريات السيارات 12V، والبطاريات الصناعية 24V أو 48V
              </p>
            </div>
          </div>
        </div>

        {/* اختيار الأجهزة */}
        <div className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            أي أجهزة تستخدم؟
          </h2>
          
          {/* عداد الأجهزة المختارة */}
          <div className="mb-4 p-3 bg-teal-700 rounded-lg">
            <p className="text-sky-300 text-sm">
              الأجهزة المختارة: {Object.values(selectedDevices).filter(Boolean).length} من {devices.length}
              {customDevices.length > 0 && (
                <span className="text-yellow-400 mr-2">
                  (الأجهزة المخصصة: {customDevices.length})
                </span>
              )}
            </p>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                  selectedDevices[device.id as keyof typeof selectedDevices]
                    ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg'
                    : 'border-teal-600 bg-teal-700 bg-opacity-50 hover:border-teal-400'
                }`}
                onClick={() => toggleDevice(device.id)}
              >
                <div className="flex items-center">
                  <span className="text-2xl ml-3">{device.icon}</span>
                  <div>
                    <p className="font-medium text-white">
                      {device.name}
                      {device.id.startsWith('custom_') && (
                        <span className="text-yellow-400 text-xs mr-2">(مخصص)</span>
                      )}
                    </p>
                    <p className="text-sm text-sky-300">{device.consumption} {device.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.id.startsWith('custom_') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('هل تريد حذف هذا الجهاز المخصص؟')) {
                          handleDeleteCustomDevice(device.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-1 rounded"
                      title="حذف الجهاز المخصص"
                    >
                      🗑️
                    </button>
                  )}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedDevices[device.id as keyof typeof selectedDevices]
                      ? 'border-yellow-400 bg-yellow-400 scale-110'
                      : 'border-teal-400 hover:border-yellow-400'
                }`}>
                  {selectedDevices[device.id as keyof typeof selectedDevices] && (
                      <span className="text-black text-sm font-bold">✓</span>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* النتيجة */}
        <div className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            النتيجة
          </h2>
          
          {result.error ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-xl font-bold text-red-400 mb-2">
                خطأ في الحساب
              </div>
              <p className="text-sky-300 mb-4">{result.error}</p>
              <div className="bg-teal-700 rounded-lg p-3">
                <p className="text-sm text-sky-300">
                  إجمالي الاستهلاك: {result.totalConsumption} وات
                </p>
                {result.batteryPower > 0 && (
                  <p className="text-sm text-sky-300">
                    طاقة البطارية: {result.batteryPower} وات ساعة
                  </p>
                )}
              </div>
            </div>
          ) : (
          <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
              {result.hours} ساعة و {result.minutes} دقيقة
            </div>
              <p className="text-sky-300 mb-4">البطارية تكفي</p>
              
              <div className="space-y-3">
                <div className="bg-teal-700 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-sky-400">إجمالي الاستهلاك:</p>
                      <p className="text-white font-bold">{result.totalConsumption} وات</p>
                    </div>
                    <div>
                      <p className="text-sky-400">طاقة البطارية:</p>
                      <p className="text-white font-bold">{result.batteryPower} وات ساعة</p>
            </div>
          </div>
        </div>

                <div className="bg-green-600 bg-opacity-20 rounded-lg p-3">
                  <p className="text-green-300 text-sm">
                    ✅ الحساب صحيح: {result.batteryPower} وات ساعة ÷ {result.totalConsumption} وات = {((result.hours + result.minutes/60)).toFixed(2)} ساعة
                  </p>
                </div>
              </div>
          </div>
          )}
        </div>

      </main>

    </div>
  );
}
