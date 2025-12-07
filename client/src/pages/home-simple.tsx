export default function HomeSimple() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          عدن لايف - حلول ذكية لحياة أسهل
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💧</div>
            <h3 className="text-lg font-bold mb-2">ماء</h3>
            <p className="text-gray-600 mb-4">صهاريج وخزانات</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
              أطلب صهريج
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold mb-2">كهرباء</h3>
            <p className="text-gray-600 mb-4">حلول الطاقة</p>
            <button className="w-full bg-yellow-600 text-white py-2 rounded-lg">
              نقاط شحن
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-lg font-bold mb-2">صحة</h3>
            <p className="text-gray-600 mb-4">خدمات طبية</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg">
              خدمات صحية
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-lg font-bold mb-2">تعليم</h3>
            <p className="text-gray-600 mb-4">خدمات تعليمية</p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg">
              خدمات تعليمية
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-lg font-bold mb-2">وظائف</h3>
            <p className="text-gray-600 mb-4">وظائف شاغرة</p>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
              تصفح الوظائف
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-bold mb-2">خرائط</h3>
            <p className="text-gray-600 mb-4">خرائط تفاعلية</p>
            <button className="w-full bg-teal-600 text-white py-2 rounded-lg">
              استكشف عدن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
