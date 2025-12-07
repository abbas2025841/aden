import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, MapPin, Phone, Star, Users, Calendar, 
  Search, Filter, Globe, Award, BookOpen, Clock, 
  CheckCircle, ExternalLink, Map, Navigation, Share2, 
  MessageCircle, Eye, EyeOff, XCircle, Timer, Mail, 
  Car, ArrowLeft, Plus, School as SchoolIcon, Building2,
  FileText, User, Mail as MailIcon, Phone as PhoneIcon,
  AlertCircle, Info, ArrowRight, Shield, CheckCircle2
} from 'lucide-react';
import { schools, universities } from '@/lib/adenBotData';

export default function OnlineRegistrationPage() {
  const [, setLocation] = useLocation();
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [institutionType, setInstitutionType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuidance, setShowGuidance] = useState(false);

  // فلترة المؤسسات التعليمية
  const filteredInstitutions = React.useMemo(() => {
    let institutions = [];
    
    if (institutionType === 'schools' || institutionType === 'all') {
      institutions = [...institutions, ...schools.map(school => ({ ...school, type: 'school' }))];
    }
    
    if (institutionType === 'universities' || institutionType === 'all') {
      institutions = [...institutions, ...universities.map(uni => ({ ...uni, type: 'university' }))];
    }

    if (searchQuery) {
      institutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return institutions;
  }, [institutionType, searchQuery]);

  const getInstitutionIcon = (type: string) => {
    return type === 'school' ? '🏫' : '🏛️';
  };

  const getInstitutionTypeColor = (type: string) => {
    return type === 'school' ? 'bg-green-600' : 'bg-purple-600';
  };

  const getInstitutionTypeText = (type: string) => {
    return type === 'school' ? 'مدرسة' : 'جامعة';
  };

  const handleInstitutionSelect = (institution: any) => {
    setSelectedInstitution(institution.id);
    setShowGuidance(true);
  };

  const handleRedirectToOfficial = () => {
    // توجيه إلى صفحة التسجيل الرسمية في وزارة التربية والتعليم
    window.open('https://www.mohe-ye.org/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">التسجيل الإلكتروني</h1>
          </div>
          <p className="text-blue-300 text-xs sm:text-sm md:text-base">نظام توجيهي للتسجيل في المؤسسات التعليمية</p>
        </div>

        {/* تنبيه مهم */}
        <Card className="mb-4 sm:mb-6 bg-yellow-900/20 border border-yellow-600/50 rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-yellow-300 mb-1">تنبيه مهم</h3>
                <p className="text-xs sm:text-sm text-yellow-200 leading-relaxed">
                  هذا النظام <strong>توجيهي فقط</strong> ولا يقوم بمعالجة طلبات التسجيل. 
                  سيتم توجيهك إلى الموقع الرسمي لوزارة التربية والتعليم لإكمال عملية التسجيل.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إرشادات التسجيل */}
        <Card className="mb-4 sm:mb-6 bg-blue-900/20 border border-blue-600/50 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm sm:text-base flex items-center gap-2">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              خطوات التسجيل
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-800/30 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">1</div>
                <span className="text-xs sm:text-sm text-blue-200">اختر المؤسسة التعليمية</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-800/30 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">2</div>
                <span className="text-xs sm:text-sm text-blue-200">اطلع على المعلومات</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-800/30 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">3</div>
                <span className="text-xs sm:text-sm text-blue-200">انقر على "التسجيل الرسمي"</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-800/30 rounded-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">4</div>
                <span className="text-xs sm:text-sm text-blue-200">أكمل التسجيل في الموقع الرسمي</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* البحث والفلترة */}
        <Card className="mb-3 sm:mb-4 bg-blue-800 bg-opacity-80 border border-blue-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-2 w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن مدرسة أو جامعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-blue-700 border border-blue-600 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
                />
              </div>

              {/* فلتر النوع */}
              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={() => setInstitutionType('all')}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm ${
                    institutionType === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  جميع المؤسسات
                </Button>
                <Button
                  onClick={() => setInstitutionType('schools')}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm ${
                    institutionType === 'schools' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  🏫 المدارس
                </Button>
                <Button
                  onClick={() => setInstitutionType('universities')}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm ${
                    institutionType === 'universities' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  🏛️ الجامعات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة المؤسسات التعليمية */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">المؤسسات التعليمية</h2>
            <Badge className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {filteredInstitutions.length}
            </Badge>
          </div>

          {filteredInstitutions.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-blue-900/90 backdrop-blur-sm border-blue-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد مؤسسات</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على مؤسسات تطابق معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            filteredInstitutions.map((institution) => (
              <Card key={`${institution.type}-${institution.id}`} className="bg-blue-800 bg-opacity-80 border border-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3">
                    {/* الصف الأول: أيقونة + عنوان + badges */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {getInstitutionIcon(institution.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors leading-tight">
                          {institution.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getInstitutionTypeColor(institution.type)} text-white text-xs px-2 py-1`}>
                            {getInstitutionTypeText(institution.type)}
                          </Badge>
                          <Badge variant="outline" className="text-blue-400 border-blue-500 text-xs px-2 py-1">
                            {institution.district}
                          </Badge>
                          {institution.established && (
                            <Badge variant="outline" className="text-green-400 border-green-500 text-xs px-2 py-1">
                              {institution.established}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* شبكة المعلومات المنظمة */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="text-gray-300">التقييم</div>
                          <div className="text-white font-medium">{institution.rating}/5</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-gray-300">المراجعات</div>
                          <div className="text-white font-medium">{institution.reviews}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <PhoneIcon className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-gray-300">الهاتف</div>
                          <div className="text-white font-medium text-xs truncate">{institution.tel}</div>
                        </div>
                      </div>
                      {institution.address && (
                        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <div>
                            <div className="text-gray-300">العنوان</div>
                            <div className="text-white font-medium text-xs truncate">{institution.address}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {institution.description}
                    </p>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleInstitutionSelect(institution)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        معلومات التسجيل
                      </Button>
                      <Button
                        onClick={handleRedirectToOfficial}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        التسجيل الرسمي
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* نافذة التوجيه */}
        {showGuidance && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-gray-900 border border-blue-600 rounded-xl shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    توجيه للتسجيل الرسمي
                  </CardTitle>
                  <Button
                    onClick={() => setShowGuidance(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-300 mb-1">معلومات مهمة</h4>
                      <p className="text-xs text-blue-200 leading-relaxed">
                        سيتم توجيهك إلى الموقع الرسمي لوزارة التربية والتعليم لإكمال عملية التسجيل. 
                        تأكد من إحضار جميع المستندات المطلوبة.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-white">المستندات المطلوبة:</h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      شهادة الميلاد
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      صورة شخصية
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      شهادة نجاح (إن وجدت)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      بطاقة الهوية
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleRedirectToOfficial}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    الانتقال للموقع الرسمي
                  </Button>
                  <Button
                    onClick={() => setShowGuidance(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 text-sm"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
