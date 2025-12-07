import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea'; // غير موجود
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Heart, 
  Building, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { adenHealthFacilities } from '@/data/aden-health-facilities';
import DetailsModal from '@/components/DetailsModal';

interface HealthEvaluation {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory';
  patientName: string;
  patientPhone: string;
  visitDate: string;
  visitTime: string;
  overallRating: number;
  serviceRatings: {
    cleanliness: number;
    staff: number;
    waitingTime: number;
    treatment: number;
    facilities: number;
  };
  comments: string;
  recommendations: string;
  wouldRecommend: boolean;
  isAnonymous: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockEvaluations: HealthEvaluation[] = [
  {
    id: '1',
    facilityId: '1',
    facilityName: 'مستشفى الجمهورية التعليمي',
    facilityType: 'hospital',
    patientName: 'أحمد محمد',
    patientPhone: '777123456',
    visitDate: '2024-01-15',
    visitTime: '10:30',
    overallRating: 4,
    serviceRatings: {
      cleanliness: 4,
      staff: 5,
      waitingTime: 3,
      treatment: 4,
      facilities: 4
    },
    comments: 'خدمة ممتازة، الطاقم الطبي محترف جداً. فقط وقت الانتظار طويل قليلاً.',
    recommendations: 'تحسين نظام المواعيد لتقليل وقت الانتظار',
    wouldRecommend: true,
    isAnonymous: false,
    createdAt: '2024-01-15T12:00:00Z',
    status: 'approved'
  },
  {
    id: '2',
    facilityId: '2',
    facilityName: 'مستشفى الصداقة اليمني الكوري',
    facilityType: 'hospital',
    patientName: 'فاطمة علي',
    patientPhone: '777654321',
    visitDate: '2024-01-14',
    visitTime: '14:00',
    overallRating: 5,
    serviceRatings: {
      cleanliness: 5,
      staff: 5,
      waitingTime: 5,
      treatment: 5,
      facilities: 5
    },
    comments: 'أفضل مستشفى في عدن، كل شيء منظم ومتطور',
    recommendations: 'الاستمرار على نفس المستوى',
    wouldRecommend: true,
    isAnonymous: false,
    createdAt: '2024-01-14T16:30:00Z',
    status: 'approved'
  }
];

export default function HealthEvaluationPage() {
  const [, setLocation] = useLocation();
  const [evaluations, setEvaluations] = useState<HealthEvaluation[]>(mockEvaluations);
  const [filteredEvaluations, setFilteredEvaluations] = useState<HealthEvaluation[]>(mockEvaluations);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<HealthEvaluation | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<HealthEvaluation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // نموذج التقييم الجديد
  const [newEvaluation, setNewEvaluation] = useState<Partial<HealthEvaluation>>({
    facilityId: '',
    patientName: '',
    patientPhone: '',
    visitDate: '',
    visitTime: '',
    overallRating: 0,
    serviceRatings: {
      cleanliness: 0,
      staff: 0,
      waitingTime: 0,
      treatment: 0,
      facilities: 0
    },
    comments: '',
    recommendations: '',
    wouldRecommend: false,
    isAnonymous: false
  });

  // تصفية التقييمات
  useEffect(() => {
    let filtered = evaluations;

    if (searchQuery) {
      filtered = filtered.filter(evaluation => 
        evaluation.facilityName.includes(searchQuery) ||
        evaluation.patientName.includes(searchQuery) ||
        evaluation.comments.includes(searchQuery)
      );
    }

    if (facilityFilter !== 'all') {
      filtered = filtered.filter(evaluation => evaluation.facilityType === facilityFilter);
    }

    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(evaluation => evaluation.overallRating >= minRating);
    }

    setFilteredEvaluations(filtered);
  }, [evaluations, searchQuery, facilityFilter, ratingFilter]);

  // إحصائيات سريعة
  const stats = {
    total: evaluations.length,
    averageRating: evaluations.reduce((sum, evaluation) => sum + evaluation.overallRating, 0) / evaluations.length,
    highRatings: evaluations.filter(evaluation => evaluation.overallRating >= 4).length,
    recommendations: evaluations.filter(evaluation => evaluation.wouldRecommend).length
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvaluation) {
      // تحديث التقييم الموجود
      setEvaluations(prev => prev.map(evaluation => 
        evaluation.id === editingEvaluation.id 
          ? { ...newEvaluation, id: editingEvaluation.id, createdAt: editingEvaluation.createdAt, status: 'pending' } as HealthEvaluation
          : evaluation
      ));
      setShowEditForm(false);
      setEditingEvaluation(null);
    } else {
      // إضافة تقييم جديد
      const evaluation: HealthEvaluation = {
        ...newEvaluation as HealthEvaluation,
        id: Date.now().toString(),
        facilityName: adenHealthFacilities.find(f => f.id === newEvaluation.facilityId)?.name || '',
        facilityType: (adenHealthFacilities.find(f => f.id === newEvaluation.facilityId)?.type as any) || 'clinic',
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setEvaluations(prev => [evaluation, ...prev]);
      setShowAddForm(false);
    }
    
    // إعادة تعيين النموذج
    setNewEvaluation({
      facilityId: '',
      patientName: '',
      patientPhone: '',
      visitDate: '',
      visitTime: '',
      overallRating: 0,
      serviceRatings: {
        cleanliness: 0,
        staff: 0,
        waitingTime: 0,
        treatment: 0,
        facilities: 0
      },
      comments: '',
      recommendations: '',
      wouldRecommend: false,
      isAnonymous: false
    });
  };

  const handleEdit = (evaluation: HealthEvaluation) => {
    setEditingEvaluation(evaluation);
    setNewEvaluation(evaluation);
    setShowEditForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
    }
  };

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (evaluation: HealthEvaluation) => {
    setSelectedEvaluation(evaluation);
    setIsDetailsModalOpen(true);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />معتمد</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />قيد المراجعة</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />مرفوض</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      <AppHeader />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-md sm:max-w-4xl">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-4 sm:mb-6 shadow-lg">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            تقييم الخدمات الصحية
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
            شاركنا تجربتك مع المستشفيات والعيادات في عدن لنساعد الآخرين في اتخاذ قرارات أفضل
          </p>
        </div>

        {/* شريط قيد التطوير */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <span className="font-bold text-lg">🚧 قيد التطوير - صفحة تقييم الخدمات 🚧</span>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="relative z-10 mt-2">
            <span className="text-sm font-medium opacity-90">هذه الصفحة قيد التطوير وقد تحتوي على ميزات غير مكتملة</span>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-blue-300 mb-1 sm:mb-2">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">إجمالي التقييمات</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-green-300 mb-1 sm:mb-2">{stats.averageRating.toFixed(1)}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">متوسط التقييم</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <ThumbsUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2">{stats.highRatings}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">تقييمات عالية</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-purple-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-purple-300 mb-1 sm:mb-2">{stats.recommendations}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">يوصى بها</div>
            </CardContent>
          </Card>
        </div>

        {/* شريط البحث والفلترة */}
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm border-blue-700 shadow-lg">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة تقييم
            </Button>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger className="w-full border-blue-200 focus:border-blue-500 text-sm sm:text-base">
                  <SelectValue placeholder="نوع المرفق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المرافق</SelectItem>
                  <SelectItem value="hospital">مستشفى</SelectItem>
                  <SelectItem value="clinic">عيادة</SelectItem>
                  <SelectItem value="pharmacy">صيدلية</SelectItem>
                  <SelectItem value="laboratory">مختبر</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full border-blue-200 focus:border-blue-500 text-sm sm:text-base">
                  <SelectValue placeholder="التقييم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التقييمات</SelectItem>
                  <SelectItem value="5">5 نجوم</SelectItem>
                  <SelectItem value="4">4+ نجوم</SelectItem>
                  <SelectItem value="3">3+ نجوم</SelectItem>
                  <SelectItem value="2">2+ نجوم</SelectItem>
                  <SelectItem value="1">1+ نجوم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* قائمة التقييمات */}
        <div className="space-y-3 sm:space-y-4">
          {filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="p-3 sm:p-4 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-blue-700 hover:border-blue-600">
              <div className="flex items-start gap-3 mb-3">
                {/* أيقونة المرفق */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-700 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  <Building className="w-6 h-6 text-white" />
                </div>
                
                {/* البيانات الأساسية */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-white text-base sm:text-lg truncate">
                      {evaluation.facilityName}
                    </h3>
                    <Badge variant="outline" className="text-blue-400 border-blue-500 text-xs">
                      {evaluation.facilityType === 'hospital' ? 'مستشفى' : 
                       evaluation.facilityType === 'clinic' ? 'عيادة' :
                       evaluation.facilityType === 'pharmacy' ? 'صيدلية' : 'مختبر'}
                    </Badge>
                    {getStatusBadge(evaluation.status)}
                  </div>
                  
                  {/* المعلومات الأساسية */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-xs sm:text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-blue-400" />
                      <span className="truncate">{evaluation.isAnonymous ? 'مجهول' : evaluation.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-green-400" />
                      <span>{evaluation.visitDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{evaluation.visitTime}</span>
                    </div>
                  </div>

                  {/* التقييم العام */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-300">التقييم:</span>
                    <div className="flex items-center gap-1">
                      {renderStars(evaluation.overallRating, 'sm')}
                      <span className="text-xs text-gray-400">({evaluation.overallRating}/5)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(evaluation)}
                  className="flex-1 text-xs sm:text-sm border-blue-500 text-blue-400 hover:bg-blue-900/20"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(evaluation.id)}
                  className="flex-1 text-red-400 hover:bg-red-900/20 border-red-500 text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  حذف
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowDetails(evaluation)}
                  className="flex-1 text-green-400 hover:bg-green-900/20 border-green-500 text-xs sm:text-sm"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  التفاصيل
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvaluations.length === 0 && (
          <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-blue-900/90 backdrop-blur-sm border-blue-700 shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد تقييمات</h3>
            <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على تقييمات تطابق معايير البحث</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              إضافة أول تقييم
            </Button>
          </Card>
        )}
      </div>

      {/* نموذج إضافة/تعديل التقييم */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                {showEditForm ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmitEvaluation} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المرفق الصحي</label>
                    <Select 
                      value={newEvaluation.facilityId} 
                      onValueChange={(value) => setNewEvaluation(prev => ({ ...prev, facilityId: value }))}
                    >
                      <SelectTrigger className="text-gray-900">
                        <SelectValue placeholder="اختر المرفق" />
                      </SelectTrigger>
                      <SelectContent>
                        {adenHealthFacilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name} - {facility.type === 'hospital' ? 'مستشفى' : 
                             facility.type === 'clinic' ? 'عيادة' :
                             facility.type === 'pharmacy' ? 'صيدلية' : 'مختبر'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المريض</label>
                    <Input
                      value={newEvaluation.patientName || ''}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="اسم المريض"
                      required
                      className="text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <Input
                      value={newEvaluation.patientPhone || ''}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, patientPhone: e.target.value }))}
                      placeholder="777123456"
                      type="tel"
                      className="text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الزيارة</label>
                    <Input
                      value={newEvaluation.visitDate || ''}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, visitDate: e.target.value }))}
                      type="date"
                      required
                      className="text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">وقت الزيارة</label>
                    <Input
                      value={newEvaluation.visitTime || ''}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, visitTime: e.target.value }))}
                      type="time"
                      required
                      className="text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">التقييم العام</label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewEvaluation(prev => ({ ...prev, overallRating: star }))}
                          className="focus:outline-none p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (newEvaluation.overallRating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-gray-500 mr-2">
                        ({newEvaluation.overallRating || 0}/5)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">تقييم الخدمات</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Object.entries(newEvaluation.serviceRatings || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">
                          {key === 'cleanliness' ? 'النظافة' :
                           key === 'staff' ? 'الطاقم' :
                           key === 'waitingTime' ? 'وقت الانتظار' :
                           key === 'treatment' ? 'العلاج' : 'المرافق'}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewEvaluation(prev => ({
                                  ...prev,
                                  serviceRatings: {
                                    ...prev.serviceRatings!,
                                    [key]: star
                                  }
                                }))}
                                className="focus:outline-none p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= value 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({value}/5)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التعليقات</label>
                  <textarea
                    value={newEvaluation.comments || ''}
                    onChange={(e) => setNewEvaluation(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="شاركنا تجربتك مع هذا المرفق الصحي..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التوصيات</label>
                  <textarea
                    value={newEvaluation.recommendations || ''}
                    onChange={(e) => setNewEvaluation(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="ما هي توصياتك لتحسين الخدمة؟"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newEvaluation.wouldRecommend || false}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">هل تنصح الآخرين بهذا المرفق؟</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newEvaluation.isAnonymous || false}
                      onChange={(e) => setNewEvaluation(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">نشر كتقييم مجهول</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-sm sm:text-base"
                  >
                    {showEditForm ? 'تحديث التقييم' : 'إضافة التقييم'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setShowEditForm(false);
                      setEditingEvaluation(null);
                      setNewEvaluation({
                        facilityId: '',
                        patientName: '',
                        patientPhone: '',
                        visitDate: '',
                        visitTime: '',
                        overallRating: 0,
                        serviceRatings: {
                          cleanliness: 0,
                          staff: 0,
                          waitingTime: 0,
                          treatment: 0,
                          facilities: 0
                        },
                        comments: '',
                        recommendations: '',
                        wouldRecommend: false,
                        isAnonymous: false
                      });
                    }}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 py-3 text-sm sm:text-base"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* نافذة التفاصيل */}
      {selectedEvaluation && (
        <DetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          title={`تقييم ${selectedEvaluation.facilityName}`}
          subtitle={`${selectedEvaluation.facilityType === 'hospital' ? 'مستشفى' : 
                     selectedEvaluation.facilityType === 'clinic' ? 'عيادة' :
                     selectedEvaluation.facilityType === 'pharmacy' ? 'صيدلية' : 'مختبر'}`}
          image="🏥"
          sections={[
            {
              title: 'معلومات الزيارة',
              icon: <Calendar className="w-5 h-5 text-blue-400" />,
              items: [
                { label: 'اسم المريض', value: selectedEvaluation.isAnonymous ? 'مجهول' : selectedEvaluation.patientName, icon: <User className="w-4 h-4 text-blue-400" /> },
                { label: 'تاريخ الزيارة', value: selectedEvaluation.visitDate, icon: <Calendar className="w-4 h-4 text-green-400" /> },
                { label: 'وقت الزيارة', value: selectedEvaluation.visitTime, icon: <Clock className="w-4 h-4 text-orange-400" /> },
                { label: 'رقم الهاتف', value: selectedEvaluation.patientPhone, icon: <Phone className="w-4 h-4 text-green-400" /> },
              ]
            },
            {
              title: 'التقييمات التفصيلية',
              icon: <Star className="w-5 h-5 text-yellow-400" />,
              items: [
                { label: 'التقييم العام', value: selectedEvaluation.overallRating, type: 'rating' },
                { label: 'النظافة', value: selectedEvaluation.serviceRatings.cleanliness, type: 'rating' },
                { label: 'الطاقم الطبي', value: selectedEvaluation.serviceRatings.staff, type: 'rating' },
                { label: 'وقت الانتظار', value: selectedEvaluation.serviceRatings.waitingTime, type: 'rating' },
                { label: 'جودة العلاج', value: selectedEvaluation.serviceRatings.treatment, type: 'rating' },
                { label: 'المرافق', value: selectedEvaluation.serviceRatings.facilities, type: 'rating' },
              ]
            },
            ...(selectedEvaluation.comments || selectedEvaluation.recommendations ? [{
              title: 'التعليقات والتوصيات',
              icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
              items: [
                ...(selectedEvaluation.comments ? [{ label: 'التعليقات', value: selectedEvaluation.comments }] : []),
                ...(selectedEvaluation.recommendations ? [{ label: 'التوصيات', value: selectedEvaluation.recommendations }] : []),
                { label: 'هل توصي بهذا المرفق؟', value: selectedEvaluation.wouldRecommend ? 'نعم' : 'لا', type: 'badge' as const, color: selectedEvaluation.wouldRecommend ? 'bg-green-600 text-white' : 'bg-red-600 text-white' },
              ]
            }] : [])
          ]}
          actions={[
            {
              label: 'تعديل التقييم',
              onClick: () => {
                setIsDetailsModalOpen(false);
                handleEdit(selectedEvaluation);
              },
              icon: <Edit className="w-4 h-4" />,
              variant: 'outline' as const
            },
            {
              label: 'حذف التقييم',
              onClick: () => {
                setIsDetailsModalOpen(false);
                handleDelete(selectedEvaluation.id);
              },
              icon: <Trash2 className="w-4 h-4" />,
              variant: 'destructive' as const
            }
          ]}
        />
      )}

      <AppFooter />
    </div>
  );
}
