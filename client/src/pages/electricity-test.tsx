import React, { useState } from 'react';
import { SimpleElectricityGrid } from '@/components/SimpleElectricityCard';
import { adenElectricityData, type ElectricityStatus } from '@/data/aden-electricity-data';
import { Search, Filter, MapPin, Zap, RefreshCw } from 'lucide-react';

export default function ElectricityTestPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // فلترة البيانات
  const filteredData = adenElectricityData.filter(electricity => {
    const matchesSearch = electricity.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         electricity.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || electricity.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'all' || electricity.status === selectedStatus;
    
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  // الحصول على القيم الفريدة
  const districts = [...new Set(adenElectricityData.map(e => e.district))];
  const statuses = [...new Set(adenElectricityData.map(e => e.status))];

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ اختبار بطاقات الكهرباء
          </h1>
          <p className="text-lg text-gray-600">
            عرض سريع لبطاقات الكهرباء مع جميع الميزات
          </p>
        </div>

        {/* شريط البحث والفلاتر */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* شريط البحث */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مديرية أو ملاحظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* الفلاتر */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* فلتر المديريات */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline ml-1" />
                المديرية
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع المديريات</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* فلتر الحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline ml-1" />
                حالة الكهرباء
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'on' ? 'مشغل' :
                     status === 'off' ? 'مطفأ' :
                     status === 'partial' ? 'جزئي' :
                     status === 'unknown' ? 'غير مؤكد' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            النتائج ({filteredData.length})
          </h2>
        </div>

        {/* البطاقات */}
        <SimpleElectricityGrid 
          electricityData={filteredData}
          onElectricityClick={(electricity) => {
            alert(`تم النقر على: ${electricity.district}\nالحالة: ${electricity.status}\nآخر تحديث: ${electricity.lastUpdate.toLocaleString()}`);
          }}
        />

        {/* معلومات إضافية */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ميزات البطاقات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">⚡ الحالات:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>مشغل - أخضر مع أيقونة ⚡</li>
                <li>مطفأ - أحمر مع أيقونة 🔌</li>
                <li>جزئي - أصفر مع أيقونة ⚡</li>
                <li>غير مؤكد - رمادي مع أيقونة ❓</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎨 التأثيرات:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>حركة pulse للبطاقات المحدثة</li>
                <li>تأثير raise عند النقر</li>
                <li>مؤشر ping للتحديثات الحديثة</li>
                <li>شريط تقدم لحمل الطاقة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
