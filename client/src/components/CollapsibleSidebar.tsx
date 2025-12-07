import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  ChevronRight, 
  ChevronLeft,
  Home,
  Heart,
  GraduationCap,
  Zap,
  Droplets,
  Trash2,
  MoreHorizontal,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  badgeColor?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: SidebarItem[];
}

interface CollapsibleSidebarProps {
  className?: string;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  onSectionChange?: (sectionId: string) => void;
  items?: SidebarItem[];
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  className = '',
  defaultCollapsed = false,
  onToggle,
  onSectionChange,
  items
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [activeItem, setActiveItem] = useState('');
  const [hoveredItem, setHoveredItem] = useState('');
  const [, setLocation] = useLocation();

  // العناصر الافتراضية
  const defaultItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: <Home className="w-5 h-5" />,
      path: '/'
    },
    {
      id: 'health',
      label: 'الصحة',
      icon: <Heart className="w-5 h-5" />,
      path: '/health',
      badge: 'جديد',
      badgeColor: 'destructive'
    },
    {
      id: 'education',
      label: 'التعليم',
      icon: <GraduationCap className="w-5 h-5" />,
      path: '/education'
    },
    {
      id: 'electricity',
      label: 'الكهرباء',
      icon: <Zap className="w-5 h-5" />,
      path: '/electricity',
      badge: '3',
      badgeColor: 'secondary'
    },
    {
      id: 'water',
      label: 'المياه',
      icon: <Droplets className="w-5 h-5" />,
      path: '/water'
    },
    {
      id: 'sanitation',
      label: 'النظافة',
      icon: <Trash2 className="w-5 h-5" />,
      path: '/sanitation'
    },
    {
      id: 'more',
      label: 'غيرها',
      icon: <MoreHorizontal className="w-5 h-5" />,
      children: [
        {
          id: 'jobs',
          label: 'الوظائف',
          icon: <User className="w-4 h-4" />,
          path: '/jobs'
        },
        {
          id: 'maps',
          label: 'الخرائط',
          icon: <Search className="w-4 h-4" />,
          path: '/maps'
        },
        {
          id: 'emergency',
          label: 'الطوارئ',
          icon: <Bell className="w-4 h-4" />,
          path: '/emergency'
        }
      ]
    }
  ];

  const sidebarItems = items || defaultItems;

  // تبديل حالة الشريط الجانبي
  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  // معالجة النقر على العنصر
  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.id);
    
    // استدعاء دالة تغيير القسم
    if (onSectionChange) {
      onSectionChange(item.id);
    }
    
    // التنقل إذا كان هناك مسار محدد
    if (item.path) {
      setLocation(item.path);
    }
  };

  // تحديد لون الشارة
  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'secondary':
        return 'bg-gray-100 text-gray-800';
      case 'destructive':
        return 'bg-red-100 text-red-800';
      case 'outline':
        return 'bg-transparent text-gray-600 border border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // تحديد العنصر النشط
  const isActive = (itemId: string) => activeItem === itemId;
  const isHovered = (itemId: string) => hoveredItem === itemId;

  return (
    <div className={`
      fixed top-0 right-0 h-full z-50
      bg-gray-800 text-white
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-64'}
      ${className}
    `}>
      {/* زر التبديل */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-white">عدن لايف</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
          title={collapsed ? 'توسيع الشريط الجانبي' : 'طي الشريط الجانبي'}
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* قائمة العناصر */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <div
                className={`
                  flex items-center justify-between p-3 rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${isActive(item.id) 
                    ? 'bg-blue-600 text-white' 
                    : isHovered(item.id)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem('')}
                title={collapsed ? item.label : ''}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </div>
                
                {/* الشارة */}
                {!collapsed && item.badge && (
                  <span className={`
                    text-xs px-2 py-1 rounded-full font-medium
                    ${getBadgeColor(item.badgeColor)}
                  `}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* العناصر الفرعية */}
              {!collapsed && item.children && (
                <ul className="mt-1 space-y-1 pr-4">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <div
                        className={`
                          flex items-center space-x-3 p-2 rounded-lg cursor-pointer
                          transition-all duration-200 ease-in-out
                          ${isActive(child.id) 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                          }
                        `}
                        onClick={() => handleItemClick(child)}
                        onMouseEnter={() => setHoveredItem(child.id)}
                        onMouseLeave={() => setHoveredItem('')}
                      >
                        <div className="flex-shrink-0">
                          {child.icon}
                        </div>
                        <span className="text-sm truncate">
                          {child.label}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* معلومات إضافية */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  المستخدم
                </p>
                <p className="text-xs text-gray-400 truncate">
                  عدن، اليمن
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleSidebar;
