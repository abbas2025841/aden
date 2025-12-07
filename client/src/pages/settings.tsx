import React, { useState, useEffect } from 'react'
import { Bell, Palette, Shield, Smartphone, Settings as SettingsIcon, Save, RotateCcw, Trash2 } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
// import { Sidebar } from '../components/Sidebar' // تم تعطيله مؤقتاً
// import { useLocation } from '../hooks/useLocation' // تم تعطيله مؤقتاً

const defaultSettings = {
  notifications: {
    enabled: true,
    email: true,
    push: true,
    sms: false,
    currency: true,
    weather: true,
    health: true,
    education: true,
  },
  appearance: {
    theme: 'auto' as 'light' | 'dark' | 'auto',
    language: 'ar' as 'ar' | 'en',
    appWidth: 100,
  },
  privacy: {
    analytics: true,
    crashReports: true,
    locationTracking: false,
  },
  app: {
    autoUpdate: true,
    offlineMode: false,
  },
}

function SettingsPage() {
  // const [, setLocation] = useLocation() // تم تعطيله مؤقتاً
  const [settings, setSettings] = useState(defaultSettings)
  // const [sidebarOpen, setSidebarOpen] = useState(false) // تم تعطيله مؤقتاً
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // تم تعطيله مؤقتاً

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings))
    alert('تم حفظ الإعدادات بنجاح!')
  }

  const resetSettings = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      setSettings(defaultSettings)
      localStorage.removeItem('settings')
      alert('تم إعادة تعيين الإعدادات بنجاح!')
    }
  }

  const clearCache = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع البيانات المحفوظة؟')) {
      localStorage.clear()
      alert('تم مسح البيانات بنجاح!')
    }
  }

  // const handleToggleCollapse = () => { // تم تعطيله مؤقتاً
  //   setSidebarCollapsed(!sidebarCollapsed)
  // }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <AppHeader />
        <main className="container mx-auto px-4 py-6 max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">الإعدادات</h1>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">تفعيل الإشعارات</span>
                <Switch
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => updateSetting('notifications', 'enabled', checked)}
                />
              </div>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm">البريد الإلكتروني</span>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">الإشعارات الفورية</span>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">الرسائل النصية</span>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">أسعار العملات</span>
                  <Switch
                    checked={settings.notifications.currency}
                    onCheckedChange={(checked) => updateSetting('notifications', 'currency', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">الطقس</span>
                  <Switch
                    checked={settings.notifications.weather}
                    onCheckedChange={(checked) => updateSetting('notifications', 'weather', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">الصحة</span>
                  <Switch
                    checked={settings.notifications.health}
                    onCheckedChange={(checked) => updateSetting('notifications', 'health', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">التعليم</span>
                  <Switch
                    checked={settings.notifications.education}
                    onCheckedChange={(checked) => updateSetting('notifications', 'education', checked)}
                    disabled={!settings.notifications.enabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5" />
                إعدادات المظهر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">المظهر</label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('appearance', 'theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="auto">تلقائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">اللغة</label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value: 'ar' | 'en') => updateSetting('appearance', 'language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  عرض التطبيق: {settings.appearance.appWidth}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.appearance.appWidth}
                  onChange={(e) => updateSetting('appearance', 'appWidth', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.appearance.appWidth - 50}%, #e5e7eb ${settings.appearance.appWidth - 50}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" />
                إعدادات الخصوصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">تحليلات الاستخدام</span>
                  <p className="text-xs text-gray-500">مساعدة في تحسين التطبيق</p>
                </div>
                <Switch
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">تقارير الأخطاء</span>
                  <p className="text-xs text-gray-500">إرسال تقارير الأخطاء تلقائياً</p>
                </div>
                <Switch
                  checked={settings.privacy.crashReports}
                  onCheckedChange={(checked) => updateSetting('privacy', 'crashReports', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">تتبع الموقع</span>
                  <p className="text-xs text-gray-500">للخدمات المحلية</p>
                </div>
                <Switch
                  checked={settings.privacy.locationTracking}
                  onCheckedChange={(checked) => updateSetting('privacy', 'locationTracking', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone className="w-5 h-5" />
                إعدادات التطبيق
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">التحديث التلقائي</span>
                <Switch
                  checked={settings.app.autoUpdate}
                  onCheckedChange={(checked) => updateSetting('app', 'autoUpdate', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">الوضع غير المتصل</span>
                <Switch
                  checked={settings.app.offlineMode}
                  onCheckedChange={(checked) => updateSetting('app', 'offlineMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <SettingsIcon className="w-5 h-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ الإعدادات
              </Button>
              
              <Button onClick={resetSettings} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين الإعدادات
              </Button>
              
              <Button onClick={clearCache} variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 ml-2" />
                مسح البيانات المحفوظة
              </Button>
            </CardContent>
          </Card>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}

export default SettingsPage;
