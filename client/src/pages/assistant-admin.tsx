import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  MessageSquare,
  Settings,
  RefreshCw
} from 'lucide-react';
import { 
  AssistantMessage, 
  getAllMessages, 
  addMessage, 
  updateMessage, 
  deleteMessage,
  getActiveMessages 
} from '@/assistant/messages';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import MobileNavigation from '@/components/MobileNavigation';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';

export default function AssistantAdminPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // تحميل الرسائل
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const allMessages = getAllMessages();
    setMessages(allMessages);
  };

  // فلترة الرسائل
  const filteredMessages = messages.filter(msg => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && msg.active) || 
      (filter === 'inactive' && !msg.active);
    
    const matchesSearch = msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // إضافة رسالة جديدة
  const handleAddMessage = () => {
    if (!newMessage.trim()) return;
    
    const addedMessage = addMessage(newMessage.trim());
    setMessages([...messages, addedMessage]);
    setNewMessage('');
    setIsAdding(false);
  };

  // بدء تعديل رسالة
  const handleEditStart = (message: AssistantMessage) => {
    setEditingId(message.id);
    setEditingMessage(message.message);
  };

  // حفظ التعديل
  const handleEditSave = () => {
    if (!editingMessage.trim() || editingId === null) return;
    
    const success = updateMessage(editingId, editingMessage.trim(), true);
    if (success) {
      loadMessages();
      setEditingId(null);
      setEditingMessage('');
    }
  };

  // إلغاء التعديل
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingMessage('');
  };

  // حذف رسالة
  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const success = deleteMessage(id);
      if (success) {
        loadMessages();
      }
    }
  };

  // تبديل حالة الرسالة (نشط/غير نشط)
  const handleToggleActive = (id: number, currentActive: boolean) => {
    const message = messages.find(msg => msg.id === id);
    if (message) {
      updateMessage(id, message.message, !currentActive);
      loadMessages();
    }
  };

  // إحصائيات سريعة
  const stats = {
    total: messages.length,
    active: messages.filter(msg => msg.active).length,
    inactive: messages.filter(msg => !msg.active).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* الهيدر */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المساعد</h1>
              <p className="text-lg text-gray-600">إدارة رسائل عدني التفاعلية</p>
            </div>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center p-4">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">إجمالي الرسائل</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </Card>
          
          <Card className="text-center p-4">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">الرسائل النشطة</h3>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </Card>
          
          <Card className="text-center p-4">
            <EyeOff className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">الرسائل المعطلة</h3>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </Card>
        </div>

        {/* أدوات التحكم */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* البحث */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="البحث في الرسائل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* الفلتر */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">جميع الرسائل</option>
                <option value="active">النشطة فقط</option>
                <option value="inactive">المعطلة فقط</option>
              </select>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة رسالة
              </Button>
              
              <Button
                onClick={loadMessages}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </Button>
            </div>
          </div>
        </Card>

        {/* إضافة رسالة جديدة */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">إضافة رسالة جديدة</h3>
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="اكتب الرسالة الجديدة..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
                  />
                  <Button onClick={handleAddMessage} disabled={!newMessage.trim()}>
                    <Save className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                  <Button onClick={() => setIsAdding(false)} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    إلغاء
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* قائمة الرسائل */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">رسائل المساعد</h3>
          
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد رسائل تطابق البحث</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    message.active 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingId === message.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editingMessage}
                            onChange={(e) => setEditingMessage(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                          />
                          <Button onClick={handleEditSave} size="sm">
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button onClick={handleEditCancel} variant="outline" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className={`text-sm ${message.active ? 'text-gray-800' : 'text-gray-500'}`}>
                          {message.message}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>ID: {message.id}</span>
                        <span>تم الإنشاء: {message.createdAt.toLocaleDateString('ar-YE')}</span>
                        <span>آخر تحديث: {message.updatedAt.toLocaleDateString('ar-YE')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleToggleActive(message.id, message.active)}
                        variant="outline"
                        size="sm"
                        className={message.active ? 'text-green-600' : 'text-gray-500'}
                      >
                        {message.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        onClick={() => handleEditStart(message)}
                        variant="outline"
                        size="sm"
                        disabled={editingId === message.id}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(message.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </main>

      <AppFooter />
      <MobileNavigation />
    </div>
  );
}
