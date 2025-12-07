import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Home, 
  Map, 
  Briefcase, 
  Heart, 
  Zap, 
  DollarSign, 
  Bot,
  Menu,
  X
} from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: '/', icon: Home, label: 'الرئيسية' },
    { id: '/map', icon: Map, label: 'الخريطة' },
    { id: '/jobs', icon: Briefcase, label: 'الوظائف' },
    { id: '/health', icon: Heart, label: 'الصحة' },
    { id: '/electricity', icon: Zap, label: 'الكهرباء' },
    { id: '/currency', icon: DollarSign, label: 'العملات' },
    { id: '/adeni-assistant', icon: Bot, label: 'عدني' },
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* زر القائمة */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors md:hidden"
        aria-label="فتح القائمة"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* القائمة المنبثقة */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* الخلفية المعتمة */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* القائمة */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl">
            {/* الرأس */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">القائمة</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* عناصر التنقل */}
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* معلومات إضافية */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>عدن لايف - خدمة محلية لأهل عدن</p>
                <p className="mt-1">إصدار 1.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
