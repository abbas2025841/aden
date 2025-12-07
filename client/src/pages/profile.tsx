import React, { useState, useEffect } from 'react'
import { User, Edit, Save, X, Star, Calendar, MapPin, Phone, Mail, Settings, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
// import { Sidebar } from '../components/Sidebar' // تم تعطيله مؤقتاً
// import { useLocation } from '../hooks/useLocation' // تم تعطيله مؤقتاً

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: Date
  avatar: string
  bio: string
  preferences: {
    notifications: boolean
    darkMode: boolean
    language: 'ar' | 'en'
    currency: string
  }
  stats: {
    totalServices: number
    favoriteServices: number
    notificationsReceived: number
    lastActive: Date
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    earnedDate: Date
  }>
}

const mockProfile: UserProfile = {
  id: '1',
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+967 123 456 789',
  location: 'عدن، اليمن',
  joinDate: new Date('2024-01-15'),
  avatar: '/api/placeholder/150/150',
  bio: 'مطور تطبيقات ومهتم بالتكنولوجيا والخدمات الذكية في عدن',
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'ar',
    currency: 'YER'
  },
  stats: {
    totalServices: 12,
    favoriteServices: 5,
    notificationsReceived: 48,
    lastActive: new Date()
  },
  achievements: [
    {
      id: '1',
      title: 'مستخدم نشط',
      description: 'استخدم التطبيق لأكثر من 30 يوم',
      icon: '🏆',
      earnedDate: new Date('2024-02-15')
    },
    {
      id: '2',
      title: 'محب للعملات',
      description: 'استخدم خدمة أسعار العملات 50 مرة',
      icon: '💰',
      earnedDate: new Date('2024-03-01')
    }
  ]
}

export default function ProfilePage() {
  // const [, setLocation] = useLocation() // تم تعطيله مؤقتاً
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    bio: profile.bio
  })
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // const handleToggleCollapse = () => {
  //   setSidebarCollapsed(!sidebarCollapsed)
  // }

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio
    })
  }

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      ...editForm
    }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 page-transition">
      <div className="flex">
        <main className="container mx-auto px-4 py-4 max-w-md safe-area-bottom">
          <div className="text-center mb-6 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{profile.stats.totalServices}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">الخدمات</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{profile.stats.favoriteServices}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">المفضلة</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{profile.achievements.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">الإنجازات</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">المعلومات الشخصية</CardTitle>
              <Button
                onClick={isEditing ? handleSave : handleEdit}
                variant="outline"
                size="sm"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموقع</label>
                    <Input
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نبذة شخصية</label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      انضم في {profile.joinDate.toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                الإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {achievement.earnedDate.toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        /> */}
      </div>
    </div>
  )
}