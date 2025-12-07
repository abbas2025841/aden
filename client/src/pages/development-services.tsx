import React, { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { ArrowLeft, CheckCircle, Users, TrendingUp, Award, Clock, BarChart3, Star, Heart, Zap, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DevelopmentServices() {
  const [votes, setVotes] = useState<{[key: string]: number}>({});
  const [userVote, setUserVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [votingHistory, setVotingHistory] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // const [sidebarOpen, setSidebarOpen] = useState(false); // تم تعطيله مؤقتاً
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // تم تعطيله مؤقتاً

  // const handleToggleCollapse = () => {
  //   setSidebarCollapsed(!sidebarCollapsed);
  // }; // تم تعطيله مؤقتاً

  const getOrCreateVoterId = () => {
    let voterId = localStorage.getItem('dev-services-voter-id');
    if (!voterId) {
      voterId = `voter_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('dev-services-voter-id', voterId);
    }
    return voterId;
  };

  // تحميل التصويتات الحقيقية من Supabase
  useEffect(() => {
    const loadVotes = async () => {
      try {
        const voterId = getOrCreateVoterId();

        // جلب جميع التصويتات لحساب النتائج
        const { data, error } = await supabase
          .from('dev_service_votes')
          .select('id, service_id, voter_id');

        if (error) throw error;

        const counts: Record<string, number> = {};
        let total = 0;
        let currentUserVote: string | null = null;

        (data || []).forEach((row: any) => {
          const serviceId = row.service_id as string;
          counts[serviceId] = (counts[serviceId] || 0) + 1;
          total += 1;
          if (row.voter_id === voterId && !currentUserVote) {
            currentUserVote = serviceId;
          }
        });

        setVotes(counts);
        setTotalVotes(total);
        if (currentUserVote) {
          setUserVote(currentUserVote);
          setHasVoted(true);
        }
      } catch (err) {
        console.error('Error loading dev_service_votes:', err);
      }
    };

    loadVotes();
  }, []);

  // دالة التصويت المحسنة
  const handleVote = async (serviceId: string) => {
    if (hasVoted || isAnimating) return;
    
    setIsAnimating(true);
    
    // تأثير صوتي (اختياري)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // تجاهل الأخطاء إذا لم يكن الصوت متاحاً
    } catch (e) {}
    
    // تأخير للأنيميشن
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const voterId = getOrCreateVoterId();

    // حفظ التصويت في Supabase
    try {
      const { data, error } = await supabase
        .from('dev_service_votes')
        .insert({
          service_id: serviceId,
          voter_id: voterId
        })
        .select('id, service_id, voter_id, created_at')
        .single();

      if (error) throw error;

      const newVotes = { ...votes };
      newVotes[serviceId] = (newVotes[serviceId] || 0) + 1;

      const voteRecord = {
        serviceId,
        timestamp: data?.created_at || new Date().toISOString(),
        voterId,
        serviceName: developmentServices.find(s => s.id === serviceId)?.title || 'Unknown'
      };

      setVotes(newVotes);
      setUserVote(serviceId);
      setHasVoted(true);
      setTotalVotes(prev => prev + 1);
      setShowResults(true);
      setVotingHistory(prev => [...prev, voteRecord]);

      // إشعار نجاح
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('تم التصويت بنجاح! 🎉', {
          body: `شكراً لك على اختيار ${voteRecord.serviceName}`,
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.error('Error saving vote to Supabase:', err);
      alert('حدث خطأ أثناء تسجيل التصويت، حاول مرة أخرى.');
    } finally {
      setIsAnimating(false);
    }
  };

  // طلب إذن الإشعارات
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('تم تفعيل الإشعارات');
      }
    }
  };

  // دالة إعادة تعيين التصويت المحسنة
  const resetVotes = async () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع التصويتات؟ (هذا الإجراء خاص بالمطورين)')) {
      try {
        await supabase.from('dev_service_votes').delete().neq('id', 0);
      } catch (err) {
        console.error('Error resetting dev_service_votes:', err);
      }

      setVotes({});
      setUserVote(null);
      setHasVoted(false);
      setTotalVotes(0);
      setShowResults(false);
      setVotingHistory([]);
      setIsAnimating(false);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('تم إعادة تعيين التصويتات', {
          body: 'يمكنك التصويت مرة أخرى',
          icon: '/favicon.ico'
        });
      }
    }
  };

  // ترتيب الخدمات حسب التصويتات
  const getSortedServices = () => {
    return [...developmentServices].sort((a, b) => {
      const votesA = votes[a.id] || 0;
      const votesB = votes[b.id] || 0;
      return votesB - votesA;
    });
  };

  // الحصول على الخدمة الأكثر تصويتاً
  const getTopService = () => {
    const sorted = getSortedServices();
    return sorted.length > 0 && totalVotes > 0 ? sorted[0] : null;
  };

  const developmentServices = [
    {
      id: "adeni-assistant",
      icon: "🤖",
      title: "عدني - المساعد الذكي",
      description: "مساعدك الذكي لجميع الخدمات في عدن",
      status: "قيد التطوير",
      gradientClass: "assistant-gradient",
      borderClass: "border-purple-200",
      titleClass: "text-purple-900",
      descriptionClass: "text-purple-800",
    },
    {
      id: "restaurants",
      icon: "🍽️",
      title: "مطاعم عدن",
      description: "أفضل المطاعم والمقاهي في عدن",
      status: "قيد التطوير",
      gradientClass: "restaurants-gradient",
      borderClass: "border-pink-200",
      titleClass: "text-pink-900",
      descriptionClass: "text-pink-800",
    },
    {
      id: "donations",
      icon: "🤝",
      title: "تبرعات للأسر المحتاجة",
      description: "ساهم في مساعدة الأسر المحتاجة في عدن",
      status: "قيد التطوير",
      gradientClass: "donations-gradient",
      borderClass: "border-teal-200",
      titleClass: "text-teal-900",
      descriptionClass: "text-teal-800",
    },
    {
      id: "starlink",
      icon: "🛰️",
      title: "خدمة ستار لينك",
      description: "إنترنت عالي السرعة عبر الأقمار الصناعية",
      status: "قيد التطوير",
      gradientClass: "starlink-gradient",
      borderClass: "border-cyan-200",
      titleClass: "text-cyan-900",
      descriptionClass: "text-cyan-800",
    },
    {
      id: "entertainment",
      icon: "🎮",
      title: "ترفيه",
      description: "مباريات / كتب / كورسات",
      status: "قيد التطوير",
      gradientClass: "entertainment-gradient",
      borderClass: "border-pink-200",
      titleClass: "text-pink-900",
      descriptionClass: "text-pink-800",
    },
    {
      id: "aden-wallet",
      icon: "💳",
      title: "محفظة عدن",
      description: "نظام دفع إلكتروني محلي",
      status: "قيد التطوير",
      gradientClass: "wallet-gradient",
      borderClass: "border-blue-200",
      titleClass: "text-blue-900",
      descriptionClass: "text-blue-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 page-transition">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .page-transition {
          transition: all 0.3s ease;
        }

        /* تأثير نبض خفيف لبطاقة "خدمات قيد التطوير" */
        @keyframes devCardPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.35);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 18px 0 rgba(249, 115, 22, 0.55);
            transform: translateY(-2px);
          }
        }

        .dev-coming-soon-card {
          animation: devCardPulse 2.4s ease-in-out infinite;
        }
        
        /* مطابقة تدرجات بطاقات التصويت مع بطاقات الرئيسية */
        .service-card.assistant-gradient {
          background: linear-gradient(135deg, hsl(280 100% 95%) 0%, hsl(280 100% 98%) 100%) !important;
          border-color: hsl(280 100% 85%) !important;
        }

        .service-card.restaurants-gradient {
          background: linear-gradient(135deg, hsl(340 100% 95%) 0%, hsl(340 100% 98%) 100%) !important;
          border-color: hsl(340 100% 85%) !important;
        }

        .service-card.donations-gradient {
          background: linear-gradient(135deg, hsl(160 100% 95%) 0%, hsl(160 100% 98%) 100%) !important;
          border-color: hsl(160 100% 85%) !important;
        }

        .service-card.starlink-gradient {
          background: linear-gradient(135deg, hsl(200 100% 95%) 0%, hsl(200 100% 98%) 100%) !important;
          border-color: hsl(200 100% 85%) !important;
        }

        .service-card.entertainment-gradient {
          background: linear-gradient(135deg, hsl(330 100% 95%) 0%, hsl(330 100% 98%) 100%) !important;
          border-color: hsl(330 100% 85%) !important;
        }

        .service-card.wallet-gradient {
          background: linear-gradient(135deg, hsl(120 100% 95%) 0%, hsl(120 100% 98%) 100%) !important;
          border-color: hsl(120 100% 85%) !important;
        }

        /* أوضاع داكنة لنفس البطاقات */
        .dark .service-card.assistant-gradient {
          background: linear-gradient(135deg, hsl(280 70% 25%) 0%, hsl(280 60% 35%) 100%) !important;
          border-color: hsl(280 60% 40%) !important;
        }

        .dark .service-card.restaurants-gradient {
          background: linear-gradient(135deg, hsl(340 70% 25%) 0%, hsl(340 60% 35%) 100%) !important;
          border-color: hsl(340 60% 40%) !important;
        }

        .dark .service-card.donations-gradient {
          background: linear-gradient(135deg, hsl(160 70% 25%) 0%, hsl(160 60% 35%) 100%) !important;
          border-color: hsl(160 60% 40%) !important;
        }

        .dark .service-card.starlink-gradient {
          background: linear-gradient(135deg, hsl(200 70% 25%) 0%, hsl(200 60% 35%) 100%) !important;
          border-color: hsl(200 60% 40%) !important;
        }

        .dark .service-card.entertainment-gradient {
          background: linear-gradient(135deg, hsl(330 70% 25%) 0%, hsl(330 60% 35%) 100%) !important;
          border-color: hsl(330 60% 40%) !important;
        }

        .dark .service-card.wallet-gradient {
          background: linear-gradient(135deg, hsl(120 70% 25%) 0%, hsl(120 60% 35%) 100%) !important;
          border-color: hsl(120 60% 40%) !important;
        }
      `}</style>
      <AppHeader />
      
      <div className="w-full px-3 py-4 sm:py-8" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* Header Section */}
        <div className="mb-6 animate-fade-in">
          <div className="mb-3 flex justify-start">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-sm"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              الرجوع
            </button>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center bg-white/80 dark:bg-gray-900/80 border border-orange-200 dark:border-orange-500 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-xl sm:text-2xl ml-2">🚧</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">خدمات قيد التطوير</h1>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-4 text-center">
            الرئيسية &gt; خدمات قيد التطوير
          </div>
          
          {/* Description */}
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500 rounded-lg p-3 sm:p-4 mb-6 dev-coming-soon-card">
            <div className="flex items-center mb-2">
              <span className="text-xl sm:text-2xl ml-2">🚧</span>
              <h2 className="text-base sm:text-lg font-bold text-orange-900 dark:text-orange-100">خدمات قادمة قريباً</h2>
            </div>
            <p className="text-orange-800 dark:text-orange-100 text-xs sm:text-sm">
              نعمل بجد لتطوير هذه الخدمات المميزة لكم. شكراً لصبركم 🙏
            </p>
          </div>

          {/* Professional Voting Section */}
          <div
            className="bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-blue-300 dark:border-blue-700 rounded-xl p-4 sm:p-6 mb-6 shadow-xl animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg ml-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-950 dark:text-white">نظام التصويت الذكي</h3>
                  <p className="text-blue-900 dark:text-blue-100 text-xs sm:text-sm">اختر الخدمة التي تريد تطويرها أولاً</p>
                </div>
              </div>
              {totalVotes > 0 && (
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-blue-900">{totalVotes}</div>
                  <div className="text-xs sm:text-sm text-blue-600">إجمالي التصويتات</div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-700">أولوية التطوير</div>
                <div className="text-xs text-gray-600">حسب التصويتات</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-700">تصويت فوري</div>
                <div className="text-xs text-gray-600">نتائج مباشرة</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-700">تأثير حقيقي</div>
                <div className="text-xs text-gray-600">على قرارات التطوير</div>
              </div>
            </div>

            {hasVoted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                  <span className="text-green-800 font-semibold">شكراً لك! تم تسجيل صوتك بنجاح</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  صوتك يساعدنا في تحديد أولويات التطوير
                </p>
              </div>
            )}

            {totalVotes > 0 && (
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <BarChart3 className="w-4 h-4 ml-1" />
                  {showResults ? 'إخفاء النتائج' : 'عرض النتائج التفصيلية'}
                </button>
                <button
                  onClick={requestNotificationPermission}
                  className="flex items-center text-purple-600 hover:text-purple-800"
                >
                  <Zap className="w-4 h-4 ml-1" />
                  تفعيل الإشعارات
                </button>
              </div>
            )}

            {hasVoted && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <button
                  onClick={resetVotes}
                  className="text-xs text-red-600 hover:text-red-800 underline bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
                >
                  إعادة تعيين التصويت (للمطورين)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Professional Services Grid */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {getSortedServices().map((service, index) => {
              const voteCount = votes[service.id] || 0;
              const isVoted = userVote === service.id;
              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              const isTopService = index === 0 && totalVotes > 0;
              
              return (
                <div
                  key={service.id}
                  className={`service-card ${service.gradientClass} rounded-xl p-3 sm:p-4 border ${service.borderClass} relative transition-all duration-300 transform hover:scale-105 ${
                    isVoted ? 'ring-2 ring-green-400 shadow-xl scale-105' : 'opacity-90 hover:opacity-100 shadow-lg'
                  } ${isAnimating && isVoted ? 'animate-pulse' : ''}`}
                >
                  {/* Ranking Badge */}
                  {isTopService && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Development Status */}
                  <div className="absolute top-2 right-2 text-yellow-600 text-lg">
                    🚧
                  </div>
                  
                  {/* Vote Confirmation */}
                  {isVoted && (
                    <div className="absolute top-2 left-2 text-green-600 animate-bounce">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 flex justify-center">
                      {service.icon}
                    </div>
                    <h3 className={`font-bold mb-2 text-xs sm:text-sm ${service.titleClass} dark:text-white`}>
                      {service.title}
                    </h3>
                    
                    {/* Status with Animation */}
                    <div className="status-indicator mb-3 status-warning">
                      <span className="w-2 h-2 rounded-full pulse-dot bg-orange-500"></span>
                      <span className="text-white/95 text-xs">{service.status}</span>
                      <span className="text-yellow-400 text-xs mr-1">🚧</span>
                    </div>
                    
                    <p className={`mb-2 sm:mb-3 text-xs leading-relaxed ${service.descriptionClass} dark:text-gray-200`}>
                      {service.description}
                    </p>
                    
                    {/* Advanced Voting Results */}
                    {showResults && totalVotes > 0 && (
                      <div className="mb-3 bg-white/10 rounded-lg p-2">
                        <div className="flex justify-between items-center text-xs text-white/90 mb-2">
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 ml-1" />
                            <span>{voteCount} صوت</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 ml-1" />
                            <span>{percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                          <div 
                            className="bg-gradient-to-r from-white/60 to-white/80 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        {isTopService && (
                          <div className="text-xs text-yellow-300 font-semibold flex items-center justify-center">
                            <TrendingUp className="w-3 h-3 ml-1" />
                            الأكثر طلباً
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Professional Vote Button */}
                    <button
                      onClick={() => handleVote(service.id)}
                      disabled={hasVoted || isAnimating}
                      className={`w-full text-xs font-semibold rounded-lg py-2 px-2 sm:px-3 transition-all duration-300 transform ${
                        hasVoted
                          ? isVoted
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default shadow-lg'
                            : 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                      } ${isAnimating ? 'animate-pulse' : ''}`}
                    >
                      {isAnimating && isVoted ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white ml-2"></div>
                          جاري التصويت...
                        </div>
                      ) : hasVoted ? (
                        isVoted ? (
                          <div className="flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 ml-1" />
                            صوتت لهذه الخدمة
                          </div>
                        ) : (
                          'قريباً'
                        )
                      ) : (
                        <div className="flex items-center justify-center">
                          <Zap className="w-3 h-3 ml-1" />
                          صوت لهذه الخدمة
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Results Section */}
        {showResults && totalVotes > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600 ml-2" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">النتائج التفصيلية</h3>
            </div>
            
            <div className="space-y-3">
              {getSortedServices().map((service, index) => {
                const voteCount = votes[service.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                const isVoted = userVote === service.id;
                
                return (
                  <div key={service.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-xl sm:text-2xl ml-2 sm:ml-3">{service.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{service.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-bold text-blue-600">{voteCount}</div>
                        <div className="text-xs sm:text-sm text-gray-500">صوت</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2 sm:ml-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">{percentage}%</span>
                    </div>
                    
                    {isVoted && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 ml-1" />
                        <span>اختيارك</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Message */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-xl p-4 sm:p-6 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚀</div>
          <h3 className="text-base sm:text-lg font-bold text-orange-900 mb-2">
            قريباً جداً!
          </h3>
          <p className="text-orange-800 text-xs sm:text-sm leading-relaxed">
            نعمل على تطوير هذه الخدمات لتكون في أفضل حالاتها. 
            تابعونا للحصول على آخر التحديثات!
          </p>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
