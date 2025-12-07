// تكامل Gemini AI مع قاعدة البيانات الشاملة
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS } from '@/config/api-keys';
import { 
  searchHealthFacilities, 
  searchLocations, 
  searchJobs, 
  searchSchools,
  searchUniversities,
  getDistrictInfo, 
  getWaterServices, 
  getElectricityServices, 
  getAdenGeneralInfo,
  comprehensiveSearch 
} from './adenBotData';

// تهيئة Gemini AI
console.log('🔧 تهيئة جيمني...');
console.log('🔑 مفتاح API:', API_KEYS.GEMINI_API_KEY ? 'موجود' : 'غير موجود');

const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log('✅ تم تهيئة جيمني بنجاح');

export async function askAdenBot(question: string): Promise<string> {
  try {
    console.log('🤖 بدء استدعاء جيمني...');
    console.log('📝 السؤال:', question);
    
    // التحقق من وجود مفتاح API
    if (!API_KEYS.GEMINI_API_KEY) {
      throw new Error('مفتاح جيمني غير موجود');
    }
    
    console.log('🔑 مفتاح جيمني موجود:', API_KEYS.GEMINI_API_KEY.substring(0, 10) + '...');
    
    // البحث الشامل في قاعدة البيانات
    const searchResults = comprehensiveSearch(question);
    console.log('🔍 نتائج البحث:', searchResults);
    
    // إعداد البيانات للذكاء الاصطناعي
    const contextData = prepareContextData(searchResults);
    console.log('📊 البيانات المحضرة:', contextData.substring(0, 100) + '...');
    
    // بناء النص المطلوب لـ Gemini
    const prompt = `أنت "عدني" - مساعد ذكي لتطبيق "عدن لايف" - خدمات مدينة عدن، اليمن.

شخصيتك:
- اسمك: عدني
- أنت مساعد ودود ومفيد لخدمات عدن
- تتحدث باللهجة العدنية الأصيلة
- تستخدم عبارات مثل "شبيك لبيك انا بين ايديك"، "حبيبي ياخوي"، "تسلم يا غالي"
- تجيب بطريقة مفيدة ومفصلة

المستخدم يسأل: ${question}

البيانات المتاحة من قاعدة بيانات عدن:
${contextData}

تعليمات:
1. اجب باللهجة العدنية الأصيلة
2. استخدم البيانات المتاحة لتقديم إجابة دقيقة
3. إذا لم تجد معلومات كافية، قل ذلك بطريقة ودودة
4. قدم نصائح مفيدة إضافية إذا أمكن
5. استخدم العبارات العدنية التقليدية

الآن اجب على سؤال المستخدم:`;

    console.log('📤 إرسال الطلب لجيمني...');
    
    // استدعاء Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ تم استلام الرد من جيمني:', text.substring(0, 100) + '...');
    
    return text;
  } catch (error) {
    console.error('❌ خطأ في مساعد عدن الذكي:', error);
    console.error('🔍 تفاصيل الخطأ:', error);
    
    // في حالة الخطأ، استخدم الإجابة المحلية كبديل
    const fallbackResponse = getSmartResponse(question, comprehensiveSearch(question));
    console.log('🔄 استخدام الرد المحلي:', fallbackResponse.substring(0, 100) + '...');
    
    return fallbackResponse;
  }
}

// دالة لإعداد البيانات للذكاء الاصطناعي
function prepareContextData(searchResults: any): string {
  let context = '';
  
  if (searchResults.universities.length > 0) {
    context += '\nالجامعات المتاحة:\n';
    searchResults.universities.slice(0, 5).forEach((university: any) => {
      context += `• ${university.name} - ${university.district} - ${university.type === 'private' ? 'خاصة' : 'حكومية'}\n`;
    });
  }
  
  if (searchResults.schools.length > 0) {
    context += '\nالمدارس المتاحة:\n';
    searchResults.schools.slice(0, 5).forEach((school: any) => {
      context += `• ${school.name} - ${school.district} - ${school.type === 'private' ? 'خاصة' : 'حكومية'}\n`;
    });
  }
  
  if (searchResults.health.length > 0) {
    context += '\nالمرافق الصحية المتاحة:\n';
    searchResults.health.slice(0, 5).forEach((facility: any) => {
      context += `• ${facility.name} - ${facility.district} - ${facility.type}\n`;
    });
  }
  
  if (searchResults.jobs.length > 0) {
    context += '\nالوظائف المتاحة:\n';
    searchResults.jobs.slice(0, 5).forEach((job: any) => {
      context += `• ${job.title} - ${job.location.district} - ${job.companyName}\n`;
    });
  }
  
  if (searchResults.locations.length > 0) {
    context += '\nالمواقع المتاحة:\n';
    searchResults.locations.slice(0, 5).forEach((location: any) => {
      context += `• ${location.name} - ${location.district} - ${location.type}\n`;
    });
  }
  
  return context;
}

// دالة للحصول على إجابة ذكية بناءً على قاعدة البيانات
function getSmartResponse(question: string, searchResults: any): string {
  const lowerQuestion = question.toLowerCase();
  
  // البحث في الجامعات
  if (searchResults.universities.length > 0) {
    return formatUniversitiesResponse(searchResults.universities, searchResults.district);
  }
  
  // البحث في المدارس
  if (searchResults.schools.length > 0) {
    return formatSchoolsResponse(searchResults.schools, searchResults.district);
  }
  
  // البحث في المرافق الصحية
  if (searchResults.health.length > 0) {
    return formatHealthResponse(searchResults.health, searchResults.district);
  }
  
  // البحث في الوظائف
  if (searchResults.jobs.length > 0) {
    return formatJobsResponse(searchResults.jobs, searchResults.district);
  }
  
  // البحث في المواقع
  if (searchResults.locations.length > 0) {
    return formatLocationsResponse(searchResults.locations, searchResults.district);
  }
  
  // البحث في الخدمات العامة
  if (lowerQuestion.includes('مياه') || lowerQuestion.includes('ماء') || lowerQuestion.includes('صهريج')) {
    return getWaterServices(searchResults.district);
  }
  
  if (lowerQuestion.includes('كهرباء') || lowerQuestion.includes('طاقة') || lowerQuestion.includes('شحن')) {
    return getElectricityServices(searchResults.district);
  }
  
  // معلومات المنطقة
  if (searchResults.district) {
    return getDistrictInfo(searchResults.district);
  }
  
  // معلومات عامة عن عدن
  if (lowerQuestion.includes('عدن') || lowerQuestion.includes('مدينة')) {
    return getAdenGeneralInfo();
  }
  
  // إجابة افتراضية
  return getDefaultResponse(question);
}

// دالة لتنسيق إجابة الجامعات
function formatUniversitiesResponse(universities: any[], district?: string): string {
  let response = `🎓 الجامعات والكليات${district ? ` في ${district}` : ''}:\n\n`;
  
  universities.slice(0, 5).forEach(university => {
    response += `• ${university.name}\n`;
    response += `  📍 ${university.address}\n`;
    response += `  📞 ${university.tel}\n`;
    response += `  🏷️ ${university.type === 'private' ? 'خاصة' : 'حكومية'}\n`;
    response += `  ⭐ ${'⭐'.repeat(university.rating)} (${university.reviews} تقييم)\n`;
    if (university.website) {
      response += `  🌐 ${university.website}\n`;
    }
    if (university.specialties && university.specialties.length > 0) {
      response += `  📚 التخصصات: ${university.specialties.slice(0, 3).join(', ')}\n`;
    }
    if (university.fees) {
      response += `  💰 الرسوم: ${university.fees}\n`;
    }
    if (university.established) {
      response += `  📅 تأسست: ${university.established}\n`;
    }
    response += `  📝 ${university.description}\n\n`;
  });
  
  if (universities.length > 5) {
    response += `... و ${universities.length - 5} جامعة أخرى متاحة`;
  }
  
  return response;
}

// دالة لتنسيق إجابة المدارس
function formatSchoolsResponse(schools: any[], district?: string): string {
  let response = `🏫 المدارس${district ? ` في ${district}` : ''}:\n\n`;
  
  schools.slice(0, 5).forEach(school => {
    response += `• ${school.name}\n`;
    response += `  📍 ${school.address || school.district}\n`;
    response += `  📞 ${school.tel}\n`;
    response += `  🏷️ ${school.type === 'private' ? 'خاصة' : 'حكومية'}\n`;
    response += `  ⭐ ${'⭐'.repeat(school.rating)} (${school.reviews} تقييم)\n`;
    if (school.levels) {
      response += `  📚 ${school.levels.join(', ')}\n`;
    }
    if (school.fees) {
      response += `  💰 الرسوم: ${school.fees}\n`;
    }
    response += `  📝 ${school.description}\n\n`;
  });
  
  if (schools.length > 5) {
    response += `... و ${schools.length - 5} مدرسة أخرى متاحة`;
  }
  
  return response;
}

// دالة لتنسيق إجابة المرافق الصحية
function formatHealthResponse(healthFacilities: any[], district?: string): string {
  let response = `🏥 المرافق الصحية${district ? ` في ${district}` : ''}:\n\n`;
  
  healthFacilities.slice(0, 5).forEach(facility => {
    response += `• ${facility.name}\n`;
    response += `  📍 ${facility.address}\n`;
    response += `  📞 ${facility.emergencyNumber.join(', ')}\n`;
    response += `  🕐 ${facility.workingHours}\n`;
    if (facility.specialties.length > 0) {
      response += `  🏥 ${facility.specialties.slice(0, 3).join(', ')}\n`;
    }
    response += '\n';
  });
  
  if (healthFacilities.length > 5) {
    response += `... و ${healthFacilities.length - 5} مرافق أخرى متاحة`;
  }
  
  return response;
}

// دالة لتنسيق إجابة الوظائف
function formatJobsResponse(jobs: any[], district?: string): string {
  let response = `💼 الوظائف المتاحة${district ? ` في ${district}` : ''}:\n\n`;
  
  jobs.slice(0, 5).forEach(job => {
    response += `• ${job.title}\n`;
    response += `  🏢 ${job.companyName}\n`;
    response += `  📍 ${job.location.district}\n`;
    response += `  💰 ${job.salary ? `${job.salary.min}-${job.salary.max} ${job.salary.currency}` : 'راتب قابل للتفاوض'}\n`;
    response += `  📞 ${job.contact.phone}\n\n`;
  });
  
  if (jobs.length > 5) {
    response += `... و ${jobs.length - 5} وظيفة أخرى متاحة`;
  }
  
  return response;
}

// دالة لتنسيق إجابة المواقع
function formatLocationsResponse(locations: any[], district?: string): string {
  let response = `📍 المواقع${district ? ` في ${district}` : ''}:\n\n`;
  
  locations.slice(0, 5).forEach(location => {
    response += `• ${location.name}\n`;
    response += `  📍 ${location.district}\n`;
    response += `  🏷️ ${location.category}\n`;
    response += `  📝 ${location.description}\n\n`;
  });
  
  if (locations.length > 5) {
    response += `... و ${locations.length - 5} موقع آخر متاح`;
  }
  
  return response;
}

// دالة للحصول على إجابة افتراضية
function getDefaultResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('مياه') || lowerQuestion.includes('ماء') || lowerQuestion.includes('صهريج')) {
    return "💧 خدمات المياه في عدن:\n\n• صهاريج متنقلة: اتصل بـ 777-123456\n• نقاط مياه نظيفة في كريتر والمعلا\n• خزانات منزلية متوفرة في محلات السباكة\n• محطات تحلية المياه في المنصورة\n• شبكة المياه الحكومية (محدودة)";
  }
  
  if (lowerQuestion.includes('كهرباء') || lowerQuestion.includes('طاقة') || lowerQuestion.includes('شحن')) {
    return "⚡ حلول الكهرباء في عدن:\n\n• نقاط شحن الهواتف في كريتر والمعلا\n• محولات الطاقة متوفرة في السوق\n• بطاريات منزلية في محلات الأجهزة\n• مولدات كهربائية للإيجار\n• ألواح شمسية في محلات الطاقة البديلة";
  }
  
  if (lowerQuestion.includes('صحة') || lowerQuestion.includes('مستشفى') || lowerQuestion.includes('صيدلية')) {
    return getHealthResponse(lowerQuestion);
  }
  
  if (lowerQuestion.includes('وظيفة') || lowerQuestion.includes('عمل') || lowerQuestion.includes('شغل')) {
    return "💼 الوظائف المتاحة في عدن:\n\n• وظائف مبيعات في المحلات التجارية\n• وظائف تقنية في شركات الاتصالات\n• وظائف تعليمية في المدارس\n• وظائف صحية في المستشفيات\n• وظائف في المطاعم والفنادق\n• وظائف في شركات النقل";
  }
  
  if (lowerQuestion.includes('كريتر')) {
    return "🏛️ خدمات كريتر:\n\n• صهاريج المياه متوفرة\n• نقاط شحن في السوق التجاري\n• صيدليات 24 ساعة\n• مستشفى الجمهورية التعليمي\n• محلات تجارية متنوعة\n• خدمات حكومية";
  }
  
  if (lowerQuestion.includes('المعلا')) {
    return "🌊 خدمات المعلا:\n\n• خزانات مياه متوفرة\n• نقاط شحن في الشارع الرئيسي\n• صيدليات متعددة\n• مستشفى الصداقة\n• محلات تجارية\n• خدمات الميناء";
  }
  
  if (lowerQuestion.includes('المنصورة')) {
    return "🏥 خدمات المنصورة:\n\n• المستشفى الأمريكي الحديث (AMH) - 24 ساعة\n• مستشفى المنصورة العام\n• صيدليات متعددة\n• عيادات خاصة\n• مختبرات طبية\n• خدمات طوارئ متوفرة";
  }
  
  return "🤖 مرحباً! أنا مساعد عدن الذكي. يمكنني مساعدتك في:\n\n• 💧 خدمات المياه والكهرباء\n• 🏥 المرافق الصحية\n• 💼 الوظائف المتاحة\n• 🗺️ معلومات عن مناطق عدن\n\nاسأل عن أي خدمة تحتاجها!";
}

// دالة خاصة للمرافق الصحية
function getHealthResponse(question: string): string {
  if (question.includes('المنصورة')) {
    return "🏥 المرافق الصحية في المنصورة:\n\n• المستشفى الأمريكي الحديث (AMH)\n  📍 شارع التسعين - بجانب مطعم حلب\n  📞 طوارئ: 02386999\n  🕐 24 ساعة\n\n• مستشفى المنصورة العام\n  📍 وسط المنصورة\n  🕐 24 ساعة\n\n• صيدليات متعددة في جميع أنحاء المنصورة\n• عيادات خاصة متخصصة\n• مختبرات طبية";
  }
  
  if (question.includes('كريتر')) {
    return "🏥 المرافق الصحية في كريتر:\n\n• مستشفى الجمهورية التعليمي\n  📍 وسط كريتر\n  🕐 24 ساعة\n\n• مستشفى الصداقة\n  📍 المعلا\n  🕐 24 ساعة\n\n• صيدليات 24 ساعة متعددة\n• عيادات أسنان\n• مختبرات طبية";
  }
  
  if (question.includes('المعلا')) {
    return "🏥 المرافق الصحية في المعلا:\n\n• مستشفى الصداقة\n  📍 المعلا\n  🕐 24 ساعة\n\n• عيادات خاصة متعددة\n• صيدليات 24 ساعة\n• مختبرات طبية\n• عيادات أسنان";
  }
  
  if (question.includes('صيدلية') || question.includes('صيدليات')) {
    return "💊 الصيدليات في عدن:\n\n• صيدليات 24 ساعة في جميع المناطق\n• صيدلية النور - كريتر\n• صيدلية الشفاء - المعلا\n• صيدلية المنصورة - المنصورة\n• صيدليات متعددة في كل حي\n\n📞 للطوارئ: 199";
  }
  
  return "🏥 المرافق الصحية في عدن:\n\n• المستشفى الأمريكي الحديث (AMH) - المنصورة\n• مستشفى الجمهورية التعليمي - كريتر\n• مستشفى الصداقة - المعلا\n• صيدليات 24 ساعة في جميع المناطق\n• عيادات خاصة متعددة\n• مختبرات طبية\n\n📞 طوارئ: 199";
}

// دالة مساعدة للتفاعل مع المستخدم
export async function handleUserQuery(query: string): Promise<string> {
  // تنظيف الاستعلام
  const cleanQuery = query.trim();
  
  if (!cleanQuery) {
    return "مرحباً! كيف يمكنني مساعدتك اليوم؟";
  }
  
  // إضافة سياق إضافي للاستعلام
  const enhancedQuery = `${cleanQuery} - في سياق خدمات مدينة عدن، اليمن`;
  
  return await askAdenBot(enhancedQuery);
}

// دالة للحصول على اقتراحات سريعة
export function getQuickSuggestions(): string[] {
  return [
    "أين أقرب مستشفى؟",
    "كيف أحصل على مياه نظيفة؟",
    "أين أجد وظائف متاحة؟",
    "ما هي مدارس عدن؟",
    "كيف أصلح مشكلة كهربائية؟",
    "أين أقرب صيدلية؟"
  ];
}

// دالة للتحقق من صحة الاستعلام
export function validateQuery(query: string): boolean {
  const minLength = 3;
  const maxLength = 500;
  
  return query.length >= minLength && query.length <= maxLength;
}

