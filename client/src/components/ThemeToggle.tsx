import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon } from 'lucide-react';

const ThemeToggle = () => {
  useEffect(() => {
    // تطبيق الثيم الداكن مباشرة
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    
    // حفظ الثيم الداكن
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 rtl:space-x-reverse cursor-default"
      title="الثيم الداكن مفعل"
    >
      <Moon className="w-4 h-4" />
      <span className="text-xs">داكن</span>
    </Button>
  );
};

export default ThemeToggle;
