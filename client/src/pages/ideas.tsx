import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { 
  Lightbulb, Plus, Star, Users, Heart, TrendingUp, 
  MessageSquare, ThumbsUp, Share2, Filter, Search, Menu
} from "lucide-react";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'implemented';
  tags: string[];
}

interface IdeaComment {
  id: string;
  idea_id: string;
  author: string;
  content: string;
  created_at: string;
}

function IdeasPage() {
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // const [sidebarOpen, setSidebarOpen] = useState(false); // تم تعطيله مؤقتاً
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // تم تعطيله مؤقتاً

  // const handleToggleCollapse = () => {
  //   setSidebarCollapsed(!sidebarCollapsed);
  // }; // تم تعطيله مؤقتاً
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    category: "",
    tags: ""
  });
  const [likedIdeas, setLikedIdeas] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [commentsByIdea, setCommentsByIdea] = useState<Record<string, IdeaComment[]>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // أفكار مجتمعية افتراضية (تستخدم كنسخة احتياطية أو أمثلة)
  const mockIdeas: Idea[] = [
    {
      id: "1",
      title: "مبادرة النظافة المجتمعية",
      description: "انضم إلى حملة تنظيف شوارع عدن واجعل مدينتك أكثر جمالاً. نهدف لتنظيف 10 شوارع رئيسية شهرياً مع مشاركة المجتمع المحلي.",
      category: "مجتمعي",
      author: "أحمد محمد",
      likes: 45,
      comments: 12,
      shares: 8,
      createdAt: "2024-01-15",
      status: 'approved',
      tags: ["نظافة", "مجتمع", "بيئة"]
    },
    {
      id: "2",
      title: "ورشة البرمجة للشباب",
      description: "تعلم البرمجة وتطوير التطبيقات مع أفضل المطورين في عدن. ورشة مجانية لمدة 3 أشهر مع شهادات معتمدة.",
      category: "تعليمي",
      author: "فاطمة علي",
      likes: 67,
      comments: 23,
      shares: 15,
      createdAt: "2024-01-14",
      status: 'approved',
      tags: ["برمجة", "تعليم", "شباب"]
    },
    {
      id: "3",
      title: "مشروع دعم الأسر المحتاجة",
      description: "ساهم في توفير الغذاء والملابس للأسر المحتاجة في عدن. مبادرة إنسانية تهدف لمساعدة 100 أسرة شهرياً.",
      category: "إنساني",
      author: "محمد سالم",
      likes: 89,
      comments: 34,
      shares: 22,
      createdAt: "2024-01-13",
      status: 'approved',
      tags: ["إنساني", "دعم", "أسر"]
    },
    {
      id: "4",
      title: "مهرجان التراث العدني",
      description: "احتفل بتراث عدن العريق من خلال فعاليات ثقافية متنوعة. مهرجان سنوي يعرض الأزياء والمأكولات التقليدية.",
      category: "ثقافي",
      author: "سارة أحمد",
      likes: 56,
      comments: 18,
      shares: 11,
      createdAt: "2024-01-12",
      status: 'approved',
      tags: ["تراث", "ثقافة", "مهرجان"]
    },
    {
      id: "5",
      title: "حديقة عامة للأطفال",
      description: "إنشاء حديقة عامة مجهزة بألعاب آمنة للأطفال في منطقة المنصورة. مساحة خضراء للترفيه والتعلم.",
      category: "تنموي",
      author: "علي حسن",
      likes: 78,
      comments: 29,
      shares: 19,
      createdAt: "2024-01-11",
      status: 'pending',
      tags: ["حديقة", "أطفال", "ترفيه"]
    }
  ];

  // جلب الأفكار المعتمدة من Supabase
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("ideas")
          .select("*")
          .eq("approval_status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: Idea[] = data.map((row: any) => ({
            id: String(row.id),
            title: row.title,
            description: row.description,
            category: row.category || "مجتمعي",
            author: row.author || "مستخدم",
            likes: typeof row.likes === "number" ? row.likes : 0,
            comments: typeof row.comments === "number" ? row.comments : 0,
            shares: typeof row.shares === "number" ? row.shares : 0,
            createdAt: row.created_at || "",
            status: (row.approval_status as Idea["status"]) || "approved",
            tags: Array.isArray(row.tags)
              ? row.tags
              : typeof row.tags === "string" && row.tags.trim().length
              ? row.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
              : []
          }));
          setIdeas(mapped);
        } else {
          // لا توجد بيانات في القاعدة، نستخدم الأمثلة الافتراضية
          setIdeas(mockIdeas);
        }
      } catch (err: any) {
        console.error("Error fetching ideas:", err);
        setError(err.message || "حدث خطأ أثناء جلب الأفكار");
        // في حال الخطأ، نعرض الأفكار الافتراضية حتى لا تبقى الصفحة فارغة
        setIdeas(mockIdeas);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // جلب التعليقات لكل فكرة من Supabase بعد جلب الأفكار
  useEffect(() => {
    const fetchComments = async () => {
      if (!ideas.length) return;

      const numericIds = ideas
        .map((idea) => Number(idea.id))
        .filter((id) => !Number.isNaN(id));

      if (!numericIds.length) return;

      try {
        const { data, error } = await supabase
          .from('idea_comments')
          .select('*')
          .in('idea_id', numericIds)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && Array.isArray(data)) {
          const grouped: Record<string, IdeaComment[]> = {};
          data.forEach((row: any) => {
            const ideaId = String(row.idea_id);
            const comment: IdeaComment = {
              id: String(row.id),
              idea_id: ideaId,
              author: row.author || 'مستخدم',
              content: row.content,
              created_at: row.created_at || ''
            };
            if (!grouped[ideaId]) grouped[ideaId] = [];
            grouped[ideaId].push(comment);
          });
          setCommentsByIdea(grouped);
        }
      } catch (err) {
        console.error('Error fetching idea comments:', err);
      }
    };

    fetchComments();
  }, [ideas]);

  // فلترة الأفكار
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title || !newIdea.description || !newIdea.category) {
      alert("يرجى تعبئة عنوان الفكرة، الوصف، وفئة الفكرة.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tagsArray = newIdea.tags
        ? newIdea.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const { error } = await supabase.from("ideas").insert({
        title: newIdea.title,
        description: newIdea.description,
        category: newIdea.category,
        tags: tagsArray,
        author: "مستخدم",
        likes: 0,
        comments: 0,
        shares: 0,
        approval_status: "pending"
      });

      if (error) {
        console.error("Error inserting idea:", error);
        alert("حدث خطأ أثناء إرسال الفكرة، حاول مرة أخرى.");
        return;
      }

      alert("شكراً لك! تم إرسال فكرتك، وستظهر بعد مراجعتها واعتمادها من الإدارة.");
      setNewIdea({ title: "", description: "", category: "", tags: "" });
      setShowAddForm(false);
    } catch (err: any) {
      console.error("Unexpected error inserting idea:", err);
      alert("حدث خطأ غير متوقع أثناء إرسال الفكرة.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    const isLiked = likedIdeas.has(ideaId);
    const newLikes = idea.likes + (isLiked ? -1 : 1);

    // تحديث الحالة المحلية فوراً
    setLikedIdeas((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });

    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, likes: Math.max(newLikes, 0) } : i))
    );

    // تحديث Supabase
    try {
      const numericId = Number(ideaId);
      const { error } = await supabase
        .from('ideas')
        .update({ likes: Math.max(newLikes, 0) })
        .eq(Number.isNaN(numericId) ? 'id' : 'id', Number.isNaN(numericId) ? ideaId : numericId);

      if (error) {
        console.error('Error updating likes:', error);
      }
    } catch (err) {
      console.error('Unexpected error updating likes:', err);
    }
  };

  const toggleComments = (ideaId: string) => {
    setOpenComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  };

  const handleAddComment = async (ideaId: string) => {
    const text = (newCommentText[ideaId] || '').trim();
    if (!text) {
      alert('يرجى كتابة تعليق قبل الإرسال');
      return;
    }

    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    try {
      const numericId = Number(ideaId);
      const { data, error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: Number.isNaN(numericId) ? ideaId : numericId,
          author: 'مستخدم',
          content: text
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting comment:', error);
        alert('حدث خطأ أثناء إرسال التعليق، حاول مرة أخرى.');
        return;
      }

      const newComment: IdeaComment = {
        id: String(data.id),
        idea_id: String(data.idea_id),
        author: data.author || 'مستخدم',
        content: data.content,
        created_at: data.created_at || ''
      };

      setCommentsByIdea((prev) => ({
        ...prev,
        [ideaId]: [...(prev[ideaId] || []), newComment]
      }));

      setNewCommentText((prev) => ({
        ...prev,
        [ideaId]: ''
      }));

      // تحديث عداد التعليقات محلياً وفي Supabase
      const newCommentsCount = idea.comments + 1;
      setIdeas((prev) =>
        prev.map((i) => (i.id === ideaId ? { ...i, comments: newCommentsCount } : i))
      );

      try {
        const { error: updateError } = await supabase
          .from('ideas')
          .update({ comments: newCommentsCount })
          .eq(Number.isNaN(numericId) ? 'id' : 'id', Number.isNaN(numericId) ? ideaId : numericId);

        if (updateError) {
          console.error('Error updating comments count:', updateError);
        }
      } catch (err) {
        console.error('Unexpected error updating comments count:', err);
      }
    } catch (err) {
      console.error('Unexpected error inserting comment:', err);
      alert('حدث خطأ غير متوقع أثناء إرسال التعليق.');
    }
  };

  const handleShare = async (ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    let sharedSuccessfully = false;

    try {
      if (navigator.share) {
        await navigator.share({
          title: idea.title,
          text: idea.description,
          url: window.location.href
        });
        sharedSuccessfully = true;
      } else {
        const shareText = `${idea.title}\n\n${idea.description}\n\nشارك من تطبيق عدن لايف`;
        try {
          await navigator.clipboard.writeText(shareText);
          alert('تم نسخ نص المشاركة إلى الحافظة!');
          sharedSuccessfully = true;
        } catch {
          alert(`شارك هذه الفكرة:\n\n${shareText}`);
          sharedSuccessfully = true;
        }
      }
    } catch (err) {
      console.error('Error sharing idea:', err);
    }

    if (sharedSuccessfully) {
      const newShares = idea.shares + 1;
      setIdeas((prev) =>
        prev.map((i) => (i.id === ideaId ? { ...i, shares: newShares } : i))
      );

      try {
        const numericId = Number(ideaId);
        const { error } = await supabase
          .from('ideas')
          .update({ shares: newShares })
          .eq(Number.isNaN(numericId) ? 'id' : 'id', Number.isNaN(numericId) ? ideaId : numericId);

        if (error) {
          console.error('Error updating shares:', error);
        }
      } catch (err) {
        console.error('Unexpected error updating shares:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'implemented': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمد';
      case 'pending': return 'قيد المراجعة';
      case 'implemented': return 'تم التنفيذ';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <div className="w-full px-3 py-4 sm:py-8" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            💡 أفكار عدن
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            شارك أفكارك ومبادراتك لتنمية مدينة عدن
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                {ideas.length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">فكرة</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                {ideas.filter(i => i.status === 'approved').length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">معتمد</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                {ideas.reduce((sum, idea) => sum + idea.likes, 0)}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">إعجاب</div>
            </CardContent>
          </Card>
        </div>

        {/* البحث والفلترة */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {/* شريط البحث */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="ابحث عن فكرة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              {/* فلتر الفئة */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">جميع الفئات</option>
                <option value="مجتمعي">مجتمعي</option>
                <option value="تعليمي">تعليمي</option>
                <option value="إنساني">إنساني</option>
                <option value="ثقافي">ثقافي</option>
                <option value="تنموي">تنموي</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* زر إضافة فكرة جديدة */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            {showAddForm ? 'إلغاء' : 'أضف فكرتك'}
          </Button>
        </div>

        {/* نموذج إضافة فكرة جديدة */}
        {showAddForm && (
          <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
                💡 شارك فكرتك مع المجتمع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitIdea} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان الفكرة
                  </label>
                  <Input
                    placeholder="اكتب عنوان فكرتك..."
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وصف الفكرة
                  </label>
                  <textarea
                    placeholder="اشرح فكرتك بالتفصيل..."
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    فئة الفكرة
                  </label>
                  <select
                    value={newIdea.category}
                    onChange={(e) => setNewIdea({...newIdea, category: e.target.value})}
                    className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">اختر فئة</option>
                    <option value="مجتمعي">مجتمعي</option>
                    <option value="تعليمي">تعليمي</option>
                    <option value="إنساني">إنساني</option>
                    <option value="ثقافي">ثقافي</option>
                    <option value="تنموي">تنموي</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    كلمات مفتاحية (اختياري)
                  </label>
                  <Input
                    placeholder="مثال: نظافة، مجتمع، بيئة"
                    value={newIdea.tags}
                    onChange={(e) => setNewIdea({...newIdea, tags: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex space-x-3 space-x-reverse">
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    إرسال الفكرة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* بطاقة Uiverse ثابتة (Twitter/X style) */}
        <div className="flex justify-center mb-6">
          <div className="max-w-md w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center p-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
                PG
              </div>
              <div className="ml-4 text-right flex-1">
                <h2 className="font-semibold text-lg">Priyanshu Gupta</h2>
                <p className="text-white/70 text-sm">@28priyanshu2001</p>
              </div>
            </div>

            <div className="px-4 pb-4 text-right">
              <p>
                Just created this amazing Twitter/X card design using Tailwind CSS with
                gradients! 🚀 #WebDevelopment #TailwindCSS
              </p>
            </div>

            <div className="flex justify-between items-center p-4 text-white/70">
              <button className="flex items-center space-x-2 hover:text-blue-200">
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-graph-up-arrow"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
                    fillRule="evenodd"
                  ></path>
                </svg>
                <span>5</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-200">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 00-7.78-.61l-.7.7-.7-.7a5.5 5.5 0 00-7.78.61c-2.19 2.36-2.12 6.14.18 8.55L12 21.35l8.22-8.19c2.3-2.41 2.37-6.19.18-8.55z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
                <span>3</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-200">
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-chat-left"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                  ></path>
                </svg>
                <span>3</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-pink-200">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 00-7.78-.61l-.7.7-.7-.7a5.5 5.5 0 00-7.78.61c-2.19 2.36-2.12 6.14.18 8.55L12 21.35l8.22-8.19c2.3-2.41 2.37-6.19.18-8.55z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
                <span>12</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-white">
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-share"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* قائمة الأفكار */}
        <div className="space-y-4">
          {filteredIdeas.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <Lightbulb className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  لا توجد أفكار متاحة
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  جرب تغيير معايير البحث أو أضف فكرتك الأولى
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredIdeas.map((idea) => (
              <Card key={idea.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          {idea.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(idea.status)}`}>
                          {getStatusText(idea.status)}
                        </span>
                      </div>
                      <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white mb-2">
                        {idea.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {idea.description}
                  </p>
                  
                  {/* الكلمات المفتاحية */}
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {idea.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-1.5 sm:px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* معلومات إضافية */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Heart className="w-4 h-4" />
                        <span>{idea.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <MessageSquare className="w-4 h-4" />
                        <span>{idea.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Share2 className="w-4 h-4" />
                        <span>{idea.shares}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      بواسطة {idea.author}
                    </div>
                  </div>
                  
                  {/* أزرار التفاعل */}
                  <div className="flex space-x-1 sm:space-x-2 space-x-reverse">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`flex-1 ${likedIdeas.has(idea.id) ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : ''}`}
                      onClick={() => handleLike(idea.id)}
                    >
                      <Heart className={`w-4 h-4 ml-1 ${likedIdeas.has(idea.id) ? 'fill-current' : ''}`} />
                      {likedIdeas.has(idea.id) ? 'أعجبني' : 'أعجبني'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toggleComments(idea.id)}
                    >
                      <MessageSquare className="w-4 h-4 ml-1" />
                      تعليق
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleShare(idea.id)}
                    >
                      <Share2 className="w-4 h-4 ml-1" />
                      مشاركة
                    </Button>
                  </div>

                  {/* قسم التعليقات */}
                  {openComments.has(idea.id) && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {(commentsByIdea[idea.id] || []).length === 0 ? (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            لا توجد تعليقات بعد، كن أول من يعلّق على هذه الفكرة.
                          </p>
                        ) : (
                          (commentsByIdea[idea.id] || []).map((comment) => (
                            <div
                              key={comment.id}
                              className="text-xs bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-2"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {comment.author || 'مستخدم'}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {comment.created_at
                                    ? new Date(comment.created_at).toLocaleString('ar-SA')
                                    : ''}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          className="w-full text-xs sm:text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                          placeholder="اكتب تعليقك هنا..."
                          value={newCommentText[idea.id] || ''}
                          onChange={(e) =>
                            setNewCommentText((prev) => ({
                              ...prev,
                              [idea.id]: e.target.value
                            }))
                          }
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                            onClick={() => handleAddComment(idea.id)}
                          >
                            إرسال التعليق
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}

export default IdeasPage;
