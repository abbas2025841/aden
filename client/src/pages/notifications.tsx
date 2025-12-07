import React, { useState, useEffect } from 'react'
import { Bell, BellOff, CheckCircle, Trash2, Star, Clock, Search, Filter, Settings, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Switch } from '../components/ui/switch'
// import { Sidebar } from '../components/Sidebar' // تم تعطيله مؤقتاً
// import { useLocation } from '../hooks/useLocation' // تم تعطيله مؤقتاً

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  isImportant: boolean
  category: string
  type: 'currency' | 'weather' | 'health' | 'education' | 'transport' | 'emergency' | 'success' | 'warning' | 'error' | 'info'
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'تحديث أسعار العملات',
    message: 'تم تحديث أسعار العملات الأجنبية. الدولار الأمريكي: 1,500 ريال يمني',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    isImportant: true,
    category: 'عملات',
    type: 'currency'
  },
  {
    id: '2',
    title: 'تنبيه طقس',
    message: 'توقعات بهطول أمطار غزيرة في عدن خلال الساعات القادمة',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    isImportant: false,
    category: 'طقس',
    type: 'weather'
  }
]

function NotificationsPage() {
  // const [, setLocation] = useLocation() // تم تعطيله مؤقتاً
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')
  // const [sidebarOpen, setSidebarOpen] = useState(false) // تم تعطيله مؤقتاً
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // تم تعطيله مؤقتاً

  // const handleToggleCollapse = () => {
  //   setSidebarCollapsed(!sidebarCollapsed)
  // } // تم تعطيله مؤقتاً

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'unread') return matchesSearch && !notification.isRead
    if (filter === 'important') return matchesSearch && notification.isImportant
    return matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length
  const importantCount = notifications.filter(n => n.isImportant).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
      setNotifications([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 page-transition">
      <div className="flex">
        <main className="container mx-auto px-4 py-4 max-w-md safe-area-bottom">
          <div className="text-center mb-6 animate-fade-in">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              الإشعارات
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              إدارة جميع إشعاراتك وتحديثات التطبيق
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{notifications.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">المجموع</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BellOff className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{unreadCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">غير مقروءة</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{importantCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">مهمة</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في الإشعارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
                className="whitespace-nowrap"
              >
                الكل ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
                size="sm"
                className="whitespace-nowrap"
              >
                غير مقروءة ({unreadCount})
              </Button>
              <Button
                variant={filter === 'important' ? 'default' : 'outline'}
                onClick={() => setFilter('important')}
                size="sm"
                className="whitespace-nowrap"
              >
                مهمة ({importantCount})
              </Button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {filteredNotifications.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    لا توجد إشعارات
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {searchQuery ? 'لم يتم العثور على إشعارات تطابق البحث' : 'جميع إشعاراتك محدثة'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </h3>
                          {notification.isImportant && (
                            <Star className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            منذ 5 دقائق
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notification.isRead && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 p-1 h-8 w-8"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 p-1 h-8 w-8"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-2 mb-6">
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={unreadCount === 0}
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                تحديد الكل كمقروء
              </Button>
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                حذف الكل
              </Button>
            </div>
          )}
        </main>

        {/* <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        /> */} // تم تعطيله مؤقتاً
      </div>
    </div>
  )
}

export default NotificationsPage;