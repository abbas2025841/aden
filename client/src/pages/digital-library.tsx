
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, ArrowLeft, Search, Filter, Users, Calendar, 
  Download, Eye, ExternalLink, XCircle, Timer, Mail, 
  Plus, School as SchoolIcon, Building2, Globe, Award, 
  Clock, CheckCircle, Heart, Info, FileText, GraduationCap,
  MessageSquare, Bell, Settings, HelpCircle, Book, Library,
  Download as DownloadIcon, Bookmark, Share2, ThumbsUp, 
  MessageCircle, BookOpen as BookOpenIcon, PenTool, 
  FileText as FileTextIcon, Video, Image, Music, Archive,
  MoreHorizontal
} from 'lucide-react';

// بيانات المكتبة الرقمية
const digitalLibrary = [
  {
    id: 9,
    title: "القرآن الكريم وعلومه والتربية الإسلامية",
    author: "وزارة التربية والتعليم - عدن",
    category: "islamic",
    subject: "القرآن  الكريم وعلومه والتربية الإسلامية الجزء_الأول",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 98,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يُرسّخ القيم الإسلامية من خلال سور قصيرة، آداب وسلوكيات، وتعاليم الطهارة، مناسب لتلاميذ الصف الأول في اليمن",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/za7ozkfltdtulzlcag1hd/_-_-_-_-_-_-_-_-_2015_-_-_-_-1.pdf?rlkey=bh7oo8f6hf45ay997uy9xwkgf&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/قران واسلاميه الجزء الاول.jpg",
    publishedDate: "2015",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 10,
    title: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الثاني)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 113,
    size: undefined,
    downloads: 554,


    description: "كتاب تعليمي يعزز القيم الإيمانية والتربية السلوكية من خلال سور قرآنية ودروس تربوية مبسطة تناسب الصف الأول الأساسي",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/2rvf4j6q3s8tuq6hi6id4/_-_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=2umjsy3p0hbzvez00oq65k72f&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/قران واسلاميه الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 11,
    title: "القراءة (الجزء الأول)",
    author: "وزارة التربية والتعليم - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الأول)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 194,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تأسيس مهارات القراءة لدى التلاميذ بطريقة مبسطة وتفاعلية، يقدم محتوى متدرجًا يساعد الطالب على التعرف إلى الحروف والكلمات والجمل بشكل تدريجي",
    tags: ["قراءة", "لغة عربية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/s8spqpfgrb5od2nxi6ymc/_-_-_-_-_2014_-_-_-_.pdf?rlkey=m1jbbrf86gn579kuctgjm287j&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/القراءة الجزء الاول.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 12,
    title: "القراءة (الجزء الثاني)",
    author: "وزارة التربية والتعليم - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الثاني)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 161,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات القراءة المبكرة من خلال محتوى تربوي مبسط يتناسب مع أعمار طلاب الصف الأول، يتضمن نصوصًا تعليمية وقصصًا هادفة تعزز حب اللغة العربية وتغرس القيم السلوكية والاجتماعية",
    tags: ["قراءة", "لغة عربية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/s8spqpfgrb5od2nxi6ymc/_-_-_-_-_2014_-_-_-_.pdf?rlkey=m1jbbrf86gn579kuctgjm287j&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/القراءة الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 13,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - عدن وصنعاء",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 98,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية وعي التلاميذ بمفاهيم العلم المرتبطة بالحياة اليومية بأسلوب مبسط يناسب أعمارهم، يعتمد على أسلوب الملاحظة والتجربة لتنمية مهارات التفكير العلمي المبكر",
    tags: ["علوم", "مفاهيم علمية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/33jlaxcbkb5bfni5q0012/_-_-_-_-_2017_-_-_-_.pdf?rlkey=gakcbphnqvl008kwqa8ysfiod&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/العلوم الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن وصنعاء",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 14,
    title: "العلوم (الجزء الثاني)",
    author: "وزارة التربية والتعليم - عدن وصنعاء",
    category: "science",
    subject: "العلوم (الجزء الثاني)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 106,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات الملاحظة والاستكشاف لدى التلميذ بأسلوب مبسط، يتناول موضوعات حياتية قريبة من بيئة الطالب اليومية تجعله أكثر تفاعلًا مع المفاهيم العلمية الأساسية",
    tags: ["علوم", "حيوانات", "نباتات", "مواد", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/g2iuoq6noudkj0e41xkzm/_-_-_-_-_2017_-_-_-_.pdf?rlkey=ku3jwco2qqiujer6eiixekk9y&e=2&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/العلوم الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن وصنعاء",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 15,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - عدن وصنعاء",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 145,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات الحسابية والتفكير المنطقي لدى التلاميذ في مرحلة التأسيس، يقدم مفاهيم رياضية بأسلوب مبسط من خلال أنشطة وتدريبات متدرجة",
    tags: ["رياضيات", "عمليات حسابية", "أشكال هندسية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/q4ymck6htszb298kavkio/_-_-_-_-_2015_-_-_-_.pdf?rlkey=9xtn646jyat37yhqr1rx9nnyn&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الرياضيات الجزء الاول.jpg",
    publishedDate: "2015",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن وصنعاء",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 16,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - عدن وصنعاء",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 146,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يمثل امتدادًا للتأسيس المفاهيمي من الجزء الأول، يهدف إلى تعزيز قدرات الطالب في العد والجمع والطرح والقياس بأسلوب مبسط يتناسب مع المرحلة العمرية",
    tags: ["رياضيات", "عمليات حسابية", "قياس", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/d2s0s8bf157b8z41ra37n/_-_-_-_-_2017_-_-_-_.pdf?rlkey=vo74vr5mvptlew489pcx1mvg5&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن وصنعاء",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 17,
    title: "أقرأ وأتعلم (الجزء الأول)",
    author: "وزارة التربية والتعليم - عدن",
    category: "arabic",
    subject: "أقرأ وأتعلم (الجزء الأول)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 192,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات القراءة والكتابة لدى التلاميذ في مراحلهم الأولى من التعليم، يركز على تعليم الحروف والكلمات والجمل البسيطة بأسلوب تدريجي يعتمد على التكرار والربط بين الحروف والمعاني من خلال صور ونصوص مناسبة لعمر الطالب",
    tags: ["قراءة", "لغة عربية", "كتابة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/m0bh7uu8w50c9ncqkkct1/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=wk9j28apqm8xol22c5hh0i5ok&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/أقرأ وأتعلم الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 18,
    title: "أقرأ وأتعلم (الجزء الثاني)",
    author: "وزارة التربية والتعليم - عدن",
    category: "arabic",
    subject: "أقرأ وأتعلم (الجزء الثاني)",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 192,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات القراءة والكتابة والاستيعاب اللغوي لدى طلاب الصف الأول بأسلوب مبسط وممتع، يعتمد على أسس تربوية حديثة تراعي الفروق الفردية مع التركيز على المفردات المألوفة في بيئة الطفل اليمني",
    tags: ["قراءة", "لغة عربية", "كتابة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/jg7lyld2enrhcnbsze4n7/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=6tfoi5eijmjikkxh19oxd79ff&e=1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/أقرأ وأتعلم الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 19,
    title: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الأول)",
    grade: "الصف الثاني",
    type: "كتاب",
    language: "عربي",
    pages: 124,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعليم الطلاب القرآن الكريم وعلومه والتربية الإسلامية بأسلوب مبسط مناسب لمستوى الصف الثاني",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/spmtzpa914ya2bz8s3e6o/_-_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=cj018a6m96no16brk92ekh8sp&st=9l1vyvwd&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/القرآن الكريم وعلومه والتربية الإسلامية الجزء الاول.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 20,
    title: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الثاني)",
    grade: "الصف الثاني",
    type: "كتاب",
    language: "عربي",
    pages: 116,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعليم الطلاب القرآن الكريم وعلومه والتربية الإسلامية بأسلوب مبسط مناسب لمستوى الصف الثاني",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/nh65jmmfhqy25nxy264ii/_-_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=ljyld8xiavt8hfpxw26mowpm3&st=3zo7e5jg&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/القرآن الكريم وعلومه والتربية الإسلامية الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 21,
    title: "القراءة (العربي) (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "arabic",
    subject: "القراءة (العربي) (الجزء الأول)",
    grade: "الصف الثاني",
    type: "كتاب",
    language: "عربي",
    pages: 162,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات القراءة والفهم لدى طلاب الصف الثاني بأسلوب مبسط ومدرج",
    tags: ["قراءة", "لغة عربية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/q177bxxylto0hxqvyxmmo/_-_-_-_-_2017_-_-_-_.pdf?rlkey=6nzs2foav9si6nqo20w84tble&st=yyw9s7sk&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/القراءة الجزء الاول.jpg",
    publishedDate: "غير محدد",
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn:  "-",
    license: "مجاني",
  color: "green"
},
{
  id: 22,
  title: "القراءة (العربي) (الجزء الثاني)",
  author: "وزارة التربية والتعليم - اليمن - عدن",
  category: "arabic",
  subject: "القراءة (العربي) (الجزء الثاني)",
  grade: "الصف الثاني",
  type: "كتاب",
  language: "عربي",
  pages: 146,
  size: undefined,
  downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات القراءة والفهم لدى طلاب الصف الثاني بأسلوب مبسط ومدرج",
    tags: ["قراءة", "لغة عربية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/wwffdxo18dn1fjn5jfvax/_-_-_-_-_2017_-_-_-_.pdf?rlkey=xoe9k7xrpjlzsm4t10mdc5cje&st=2dfvqg1i&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/القراءة الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 23,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف الثاني",
    type: "كتاب",
    language: "عربي",
    pages: 98,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز المهارات الحسابية الأساسية لدى التلاميذ بطريقة تدريجية ومبسطة، يتناول العد والجمع والطرح والقياس والكسور من خلال أنشطة تعليمية وتدريبات تطبيقية",
    tags: ["رياضيات", "عمليات حسابية", "هندسة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/eacih7k6t68qh9a7mi0xu/_-_-_-_-_2017_-_-_-_.pdf?rlkey=sro6d6uxoxr9alurtck4dzm1m&st=yytni1ra&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/الرياضيات الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 24,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الثاني",
    type: "كتاب",
    language: "عربي",
    pages: 112,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات الحسابية والمنطقية لدى التلاميذ بأسلوب مبسط وتدريجي، يتناول العمليات الحسابية والقياس وحل المشكلات من خلال أنشطة وتدريبات تطبيقية",
    tags: ["رياضيات", "عمليات حسابية", "قياس", "ضرب", "قسمة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/4m2w572blvid32hed6knl/_-_-_-_-_2017_-_-_-_.pdf?rlkey=8suo37m2uu3pepi0mn7bd9woc&st=jii4th7s&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 25,
    title: "العلوم",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم",
    grade: "الصف الثاني",
    type: "كتاب",
    language: "عربي",
    pages: 128,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية الفضول العلمي لدى التلاميذ من خلال دروس مبسطة تجمع بين المعلومة والمعايشة الحياتية، يُقدَّم بأسلوب مشوق يراعي خصائص النمو العقلي للطلاب ويعتمد على الرسوم التوضيحية والأنشطة العملية",
    tags: ["علوم", "جسم الإنسان", "نظافة", "حيوانات", "مادة", "طاقة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/a2yu6solf8soveqdzp8na/_-_-_2014_-_-_-_.pdf?rlkey=wwunlcde0pt38l2g22ki6fq5h&st=b1lmvtfc&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني/العلوم .jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 26,
    title: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الأول)",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 130,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعليم الطلاب القرآن الكريم وعلومه والتربية الإسلامية بأسلوب مبسط مناسب لمستوى الصف الثالث",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/na1b5em04f1lz4aiuwj0o/_-_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=qaa0l4hge0uqvgd26v4jja6d1&st=sb9himu1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/القرآن الكريم وعلومه والتربية الإسلامية الجزء الاول.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 27,
    title: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه والتربية الإسلامية (الجزء الثاني)",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 137,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى غرس القيم الإيمانية والسلوكية في نفوس التلاميذ، وتنمية معارفهم حول سور القرآن الكريم وسيرة النبي ﷺ وأخلاق الإسلام بما يتوافق مع المرحلة العمرية للطلاب",
    tags: ["قرآن كريم", "تربية إسلامية", "سيرة نبوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/39pvr1he6y886w56cse1n/_-_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=d93tleftdwhz2pt0xt8uznajn&st=s7ii7mj2&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/القرآن الكريم وعلومه والتربية الإسلامية الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 28,
    title: "القراءة (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الأول)",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 132,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات التلميذ في القراءة السليمة والفهم اللغوي والتذوق الأدبي المبسط، يقدم محتوى غني يتناسب مع مستوى الطالب الذهني واللغوي ويعزز قيمه التربوية والوطنية",
    tags: ["قراءة", "لغة عربية", "آداب إسلامية", "وطنيات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/ejmrtjbh3yf0waim2r7wz/_-_-_-_-_2017_-_-_-_.pdf?rlkey=y9ecplxxqdkmhof4woa6qp3ig&st=2kff065v&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/القراءة الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 29,
    title: "القراءة (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الثاني)",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 113,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات القراءة والكتابة والفهم اللغوي، يعكس القيم التربوية والثقافية المنبثقة من المجتمع اليمني، يركز على الفهم القرائي وتوسيع مدارك الطالب من خلال نصوص تعليمية شيقة",
    tags: ["قراءة", "لغة عربية", "قيم إسلامية", "وطنيات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/j8a9crx6hgh8umsmh7zyb/_-_-_-_-_2017_-_-_-_.pdf?rlkey=0am4e1t6y2f6qxtz18f0r3yul&st=4gfalvou&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/القراءة الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 30,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 106,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز المهارات الحسابية والرياضية الأساسية لدى طلاب الصف الثالث بطريقة مبسطة ومتدرجة",
    tags: ["رياضيات", "عمليات حسابية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/qskv1jclzsi6tgtpcw8l4/_-_-_-_-_2017_-_-_-_.pdf?rlkey=9xsnnj9xmmdn5t1jfaygw6qle&st=l7g1u6i9&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/الرياضيات الجزء الاول.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 31,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 116,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز مهارات التفكير الرياضي وتطوير قدرات التحليل والاستنتاج، يركز على تقديم المفاهيم الرياضية بأسلوب مبسط مدعوم بالأمثلة والأنشطة التطبيقية",
    tags: ["رياضيات", "قسمة", "ضرب", "هندسة", "كسور", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/63rfvvpn4yrvhuww4s1w8/_-_-_-_-_2017_-_-_-_.pdf?rlkey=srh9pk471gmr3lq4avn0l6y8h&st=rosd7we4&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 32,
    title: "العلوم",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 164,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المعارف العلمية الأساسية لدى طلاب الصف الثالث بطريقة مبسطة وممتعة",
    tags: ["علوم", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/dmq60oisilrndvav7oc4d/_-_-_2017_-_-_-_.pdf?rlkey=hq63rai1zwl9f0s0bp1zljd5m&st=pezu51ba&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/العلوم الصف الثالث.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 33,
    title: "التربية الاجتماعية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "social",
    subject: "التربية الاجتماعية",
    grade: "الصف الثالث",
    type: "كتاب",
    language: "عربي",
    pages: 116,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز القيم الاجتماعية والوطنية لدى التلاميذ وتنمية فهمهم للمحيط الأسري والمدرسي والبيئي، مع تعريفهم بالمناسبات الوطنية والدينية وسيرة النبي محمد ﷺ",
    tags: ["تربية اجتماعية", "الأسرة", "المدرسة", "سيرة نبوية", "وطنيات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/6v9o8bhz7s9j3zjdwm5ir/_-_-_-_2017_-_-_-_.pdf?rlkey=z13ozr0u7q0iajbwwmwgjx6nd&st=myrm6f0r&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث/التربية الاجتماعية الصف الثالث.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 34,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 148,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعليم الطلاب القرآن الكريم وعلومه بأسلوب مبسط مناسب لمستوى الصف الرابع",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/7somz599dc60s07ozee3r/_-_-_-_-_2026_-_-_-_.pdf?rlkey=81skiplgm9btbi5dghymsqrp0&st=3k66um4i&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/القرآن الكريم وعلومه.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 35,
    title: "التربية الإسلامية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 129,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز القيم الدينية والسلوكيات الإيمانية لدى التلاميذ، وتزويدهم بالمعارف الأساسية المتعلقة بالعقيدة والعبادات والسيرة النبوية",
    tags: ["تربية إسلامية", "عقيدة", "فقه", "سيرة نبوية", "أسرة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/hta6i3qx7f531g6msu1xb/_-_-_-_2017_-_-_-_.pdf?rlkey=iypzqkr5650gb99baphtyc1e6&st=tdvru3lx&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/التربية الإسلامية.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 36,
    title: "لغتي العربية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الأول)",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 220,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات اللغة العربية لدى التلاميذ من خلال أنشطة قرائية وتعبيرية وتراكيب لغوية مستمدة من بيئة الطالب اليمني وثقافته",
    tags: ["لغة عربية", "قراءة", "تعبير", "قيم تربوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/bgprm93b82hd9zr8u62j9/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=prehcj66l3hzpwqcyfoav1lhn&st=xi0voey1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/لغتي العربية الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 37,
    title: "لغتي العربية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الثاني)",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 221,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات اللغوية والقرائية والتعبيرية لدى التلاميذ بأسلوب تدريجي، يركز على بناء المفردات وتحسين الفهم والتعبير الشفهي والكتابي",
    tags: ["لغة عربية", "قراءة", "تعبير", "قيم تربوية", "وطنيات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/ytahevneuimen5efubl35/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=fq6hegz13laevjlau65xmb6n0&st=cvc8ed8m&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/لغتي العربية الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 38,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 148,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات التفكير الرياضي والتحليل المنطقي، يقدم محتوى تدريجيًا يعزز من قدرة المتعلمين على استخدام العمليات الرياضية في حياتهم اليومية",
    tags: ["رياضيات", "عمليات حسابية", "جمع وطرح", "ضرب وقسمة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/wqll0xls71qig0inrglby/_-_-_-_-_2017_-_-_-_.pdf?rlkey=tv93stwcfj8oc5ab5nt88y1ea&st=xsmnnh6s&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/الرياضيات الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 39,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 156,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات التفكير الرياضي والتحليل المنطقي، يقدم مفاهيم رياضية مترابطة بطريقة تدريجية تساعد على اكتساب المعرفة وفهم العمليات الحسابية",
    tags: ["رياضيات", "كسور", "هندسة", "قياس", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/65wnvjblmrwelt9fhpntc/_-_-_-_-_2017_-_-_-_.pdf?rlkey=rtievwqfwkqs4tiq65bmizhrm&st=1z1xw15h&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 40,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 140,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية الفضول العلمي لدى الطالب وتعزيز فهمه للبيئة المحيطة به بطريقة منهجية مبسطة، يعتمد على الشرح التدريجي المدعوم بالصور والأنشطة والتجارب",
    tags: ["علوم", "أحياء", "خلايا", "عظام وعضلات", "الجلد", "حيوانات أليفة", "نبات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/f3m5dzzhsbkqou1gysqxs/_-_-_-_-_2017_-_-_-_.pdf?rlkey=3jucpszcjzi90lv9d97p93a13&st=0ibz7j7c&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/العلوم الصف الرابع.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 41,
    title: "التربية الاجتماعية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "social",
    subject: "التربية الاجتماعية",
    grade: "الصف الرابع",
    type: "كتاب",
    language: "عربي",
    pages: 95,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز المعرفة الاجتماعية والجغرافية والتاريخية لدى طلاب الصف الرابع بطريقة مبسطة ومناسبة لعمرهم",
    tags: ["تربية اجتماعية", "جغرافيا", "تاريخ", "اجتماعيات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/j83a0q95l0899tk1xu9wj/_-_-_-_2017_-_-_-_.pdf?rlkey=m7vzcis2ghiayuqnfwijzxe74&st=0wpo52xs&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الرابع/التربية الاجتماعية الصف الرابع.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 42,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 203,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعليم الطلاب القرآن الكريم وعلومه بأسلوب مبسط مناسب لمستوى الصف الخامس",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/pwgrhxvd9oupll2m1p13g/_-_-_-_2017_-_-_-_.pdf?rlkey=lbqa3kj8i7pbixsvuq29daud4&st=mz1r50w1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/القرآن الكريم.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 43,
    title: "التربية الإسلامية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 161,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى ترسيخ المبادئ الإسلامية والقيم التربوية، يجمع بين العقيدة والعبادة والسلوك والسيرة النبوية بطريقة شاملة ومتكاملة",
    tags: ["تربية إسلامية", "عقيدة", "فقه", "سيرة نبوية", "أخلاق", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/fw6vmfneh6qfxee2boib8/_-_-_-_2017_-_-_-_.pdf?rlkey=p29qpzp9ayqtrupq996an415a&st=jsgbs7qq&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/التربية الإسلامية.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 44,
    title: "لغتي العربية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الأول)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 224,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يستهدف تعزيز مهارات اللغة العربية من خلال محتوى متكامل يجمع بين الفهم والاستيعاب والمفردات والتعبير الشفهي والتحريري والإملاء والخط والنصوص الأدبية",
    tags: ["لغة عربية", "قراءة", "تعبير", "إملاء", "خط", "قيم تربوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/1rfz02ddghx55dp8t3lzq/_-_-_-_-_-_2014_-_-_-_.pdf?rlkey=x790c36sr7lmf5phf6pyqa1vp&st=1as01jn4&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/لغتي العربية الجزء الاول.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 45,
    title: "لغتي العربية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الثاني)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 228,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يستهدف تعزيز مهارات اللغة العربية من خلال محتوى متكامل يجمع بين الفهم والاستيعاب والمفردات والتعبير الشفهي والتحريري والإملاء والخط والنصوص الأدبية",
    tags: ["لغة عربية", "قراءة", "تعبير", "إملاء", "خط", "قيم تربوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/k5bbezgm8z8rovk09fokd/_-_-_-_-_-_2014_-_-_-_.pdf?rlkey=uyypymwu4fbjax64jlptwvcw5&st=4ymhuzhn&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/لغتي العربية الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 46,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 131,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز المهارات الرياضية لدى الطلاب بطريقة منهجية تجمع بين المعرفة النظرية والتطبيق العملي، يركز على تنمية الفهم العددي والقدرات التحليلية",
    tags: ["رياضيات", "عمليات حسابية", "جمع وطرح", "ضرب وقسمة", "عوامل وقواسم", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/gxgwlrmfnf5kya0bv3se2/_-_-_-_-_2017_-_-_-_.pdf?rlkey=xsm7o148gz5rpx0j4rkxmakty&st=9hhwygq7&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/الرياضيات الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 47,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 163,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات الحسابية والتفكير المنطقي من خلال محتوى تدريجي منظم يغطي مفاهيم الكسور والقياس والهندسة والرسم الهندسي",
    tags: ["رياضيات", "كسور عادية", "كسور عشرية", "هندسة", "قياس", "رسم هندسي", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/tj5ecbo5zm2dsjxv284vc/_-_-_-_-_2017_-_-_-_.pdf?rlkey=ihpwoybhstp2wvv5whte7y2hk&st=njexkltv&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 48,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 123,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات الملاحظة والاستنتاج لدى التلاميذ، يسهم في تعزيز الوعي البيئي والصحي من خلال محتوى منظم يربط بين العلم والحياة اليومية",
    tags: ["علوم", "أحياء", "جهاز هضمي", "جهاز تنفسي", "كائنات حية", "بيئة", "نباتات", "ماء", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/s8oj2if5ixko5ytqyw4oy/_-_-_-_-_2017_-_-_-_.pdf?rlkey=7i0ykhywoxar84l3iy60u4u6a&st=4bt9g1so&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/العلوم الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 49,
    title: "الجغرافيا (جغرافية الجمهورية اليمنية)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "geography",
    subject: "الجغرافيا (جغرافية الجمهورية اليمنية)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 89,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تزويد التلاميذ بالمعارف الأساسية في الجغرافيا، تنمية مهارات الملاحظة والتفسير والفهم البيئي، يركز على البيئة اليمنية من حيث الطبيعة والسكان والأنشطة الاقتصادية",
    tags: ["جغرافيا", "خرائط", "جغرافيا طبيعية", "سكان", "اقتصاد", "بيئة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/yinxp0fn0xjnnn7opm1pj/_-_-_2017_-_-_-_.pdf?rlkey=nhw64ut7nqlqahaeb1ekppzw1&st=7ckozg3f&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/الجغرافيا.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 50,
    title: "التاريخ (تاريخ اليمن القديم)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (تاريخ اليمن القديم)",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 84,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية وعي الطلاب بتاريخ وطنهم وحضارته العريقة من خلال دروس مبسطة تجمع بين السرد التاريخي والأسلوب التعليمي السهل",
    tags: ["تاريخ", "دول يمنية قديمة", "حضارة يمنية", "مقاومة استعمارية", "تاريخ قديم", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/0938ekkbti1927j51t8sk/_-_-_2017_-_-_-_.pdf?rlkey=h05i4u2hs0o8r6w5lw605afl2&st=voipo8gf&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/التاريخ.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 51,
    title: "التربية الوطنية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "national",
    subject: "التربية الوطنية",
    grade: "الصف الخامس",
    type: "كتاب",
    language: "عربي",
    pages: 84,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز الوعي الوطني والقيم المدنية لدى طلاب الصف الخامس بطريقة مبسطة وملائمة لعمرهم",
    tags: ["تربية وطنية", "قيم مدنية", "انتماء وطني", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/urpu7p8qxmwumy5p1tub5/_-_-_-_2017_-_-_-_.pdf?rlkey=3t63cfrg6cdcr30pf7t46f1o3&st=kezwy1ei&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الخامس/الوطنية.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 52,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 177,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تنمية فهم الطالب لكتاب الله، وتعزيز مهارات التلاوة والتدبر والتجويد، مع ترسيخ مبادئ حفظ سور مختارة من القرآن الكريم، ومهارات تطبيق التجويد",
    tags: ["قرآن كريم", "تفسير", "تجويد", "تلاوة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/s5f0pfyqzwp4urbqlps0q/_-_-_-_-_2017_-_-_-_.pdf?rlkey=aty55vyl9rpjzeuee0uy54v9f&st=jbmz599o&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/القرآن الكريم.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 53,
    title: "التربية الإسلامية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 137,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تعزيز القيم الدينية والأخلاقية، وتنمية فهم الطلاب لمبادئ الإسلام في مجالات الإيمان، الحديث والتهذيب، الفقه، والسيرة النبوية والقصص، بأسلوب مبسط ومتدرج يناسب قدرات المرحلة الأساسية",
    tags: ["تربية إسلامية", "عقيدة", "فقه", "حديث", "سيرة نبوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/onc65hy1hwdi3zm8eyd4y/_-_-_-_2017_-_-_-_.pdf?rlkey=vt64uqiynr4hq25r5k4e12r90&st=p8asntjj&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/التربية الإسلامية.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 54,
    title: "لغتي العربية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الأول)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 215,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز مهارات اللغة العربية لدى الطلاب من خلال محتوى متنوع يشمل القراءة والتعبير والفهم والتذوق الأدبي، ويركز على تنمية القيم الاجتماعية والوطنية والدينية بأسلوب تدريجي وتفاعلي",
    tags: ["لغة عربية", "قراءة", "تعبير", "تفسير أدبي", "إملاء", "خط", "قيم تربوية", "منهج يمني معتمد"],
    fileUrl: "https://www.dropbox.com/scl/fi/tgrlwcbtzh93siehye166/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=43uasxxnno659albw7uag9w4u&st=byoogyir&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/لغتي العربية الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 55,
    title: "لغتي العربية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الثاني)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 209,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات اللغة العربية من خلال محتوى متكامل يجمع بين القراءة والنحو والإملاء والتعبير، مع تعزيز القيم الوطنية والدينية والاجتماعية بأسلوب تدريجي وتطبيقي",
    tags: ["لغة عربية", "قراءة", "نحو", "إملاء", "تعبير", "قيم وطنية", "منهج يمني معتمد"],
    fileUrl: "https://www.dropbox.com/scl/fi/2p25l662q67kjyxh44we5/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=9iuf8wjcoj7e6j2ddkwf239yu&st=h8jw2iyo&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/لغتي العربية الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 56,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 152,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات الحسابية والمنطقية لدى الطلاب من خلال محتوى متكامل يجمع بين الأعداد العشرية والكسور والنسب المئوية، بأسلوب تدريجي يربط بين المفاهيم النظرية والتطبيقات الحياتية",
    tags: ["رياضيات", "أعداد عشرية", "كسور عادية", "كسور عشرية", "نسبة", "نسبة مئوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/eusp8agwq7zifqogltg5o/_-_-_-_-_2014_-_-_-_.pdf?rlkey=n3ldsz1axb5k8xjzmzwwv3p05&st=xo08is7v&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/الرياضيات الجزء الاول.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 57,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 172,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات الرياضية المتقدمة لدى طلاب الصف السادس من خلال محتوى شامل يغطي الهندسة والقياس والإحصاء والاحتمالات، بأسلوب تطبيقي يربط بين المفاهيم النظرية والمواقف الحياتية",
    tags: ["رياضيات", "هندسة", "قياس", "إحصاء", "احتمالات", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/57g402ly8u49uftvjpgtj/_-_-_-_-_2017_-_-_-_.pdf?rlkey=wbfca78uqe23sdzvgp0qrda62&st=ckr1t5fh&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/الرياضيات الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 58,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 147,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية الفهم العلمي لدى الطلاب من خلال محتوى تفاعلي يعزز التفكير النقدي والملاحظة والاستكشاف، يغطي أجهزة جسم الإنسان والكائنات الدقيقة والحيوانات اللافقارية والتكيف البيئي للنباتات",
    tags: ["علوم", "أحياء", "جهاز دوري", "جهاز عصبي", "جهاز بولي", "كائنات دقيقة", "حيوانات لافقارية", "تكيف بيئي", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/oyi9075bhmhasc8d2f240/_-_-_-_-_2017_-_-_-_.pdf?rlkey=a9kj2qplcq38o8yjww1yy8yug&st=fqcdl5jr&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/العلوم الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 59,
    title: "العلوم (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الثاني)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 163,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية التفكير العلمي والمهارات العملية من خلال محتوى غني بالتجارب والأنشطة الصفية والتطبيقات الواقعية، يغطي المادة والطاقة والضوء والكهرباء والقوة بأسلوب تطبيقي يربط بين المفاهيم العلمية والحياة اليومية",
    tags: ["علوم", "فيزياء", "كيمياء", "طاقة", "مادة", "ضوء", "كهرباء", "قوة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/tq9893dxud67wonekx5pi/_-_-_-_-_2017_-_-_-_.pdf?rlkey=v1elzvdwh5imgoqsv2fhk4eb1&st=aklwheqi&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/العلوم الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 60,
    title: "الجغرافيا (جغرافيا الوطن العربي)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "geography",
    subject: "الجغرافيا (جغرافيا الوطن العربي)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 93,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية الفهم الجغرافي للوطن العربي من خلال دراسة شاملة للموقع والمظاهر الطبيعية والسكان والنشاط الاقتصادي والأقاليم الجغرافية والمشكلات البيئية، بأسلوب مبسط يعزز الانتماء الوطني والوعي البيئي",
    tags: ["جغرافيا", "وطن عربي", "أقاليم جغرافية", "مظاهر طبيعية", "سكان", "اقتصاد", "بيئة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/8i2lit8glvrfmeqv22fvg/_-_-_2017_-_-_-_.pdf?rlkey=dd1bjvq4s9u6a1s2vxae8v7t1&st=rcx8s9m1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/الجغرافيا.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 61,
    title: "التاريخ (تاريخ العرب الإسلامي)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (تاريخ العرب الإسلامي)",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية الوعي التاريخي لدى الطلاب من خلال دراسة شاملة للتاريخ الإسلامي، يغطي العهد النبوي والدولة الإسلامية والفتوحات والدويلات المستقلة ومظاهر الحضارة الإسلامية، مع التركيز على دور اليمنيين وإسهاماتهم، بأسلوب تفاعلي يعزز التفكير والانتماء الحضاري",
    tags: ["تاريخ إسلامي", "عهد نبوي", "خلفاء راشدين", "دولة أموية", "دولة عباسية", "دويلات إسلامية", "حضارة إسلامية", "اليمن", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/zx37ieko27hy8ivyijwov/_-_-_2017_-_-_-_.pdf?rlkey=w0eozp9rq3afz126z2j49tbkr&st=mvxzr107&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/التاريخ.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 62,
    title: "التربية الوطنية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "national",
    subject: "التربية الوطنية",
    grade: "الصف السادس",
    type: "كتاب",
    language: "عربي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى ترسيخ القيم الإيمانية وتعزيز فهم الطلاب لآيات القرآن الكريم ومعانيها، يجمع بين التلاوة والتفسير والتجويد بأسلوب منهجي مبسط، يشمل دراسة سور متعددة مع تطبيق أحكام التجويد عمليًا",
    tags: ["قرآن كريم", "تفسير", "تجويد", "تلاوة", "ميم ساكنة", "مدود", "سور قرآنية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/qcf3l0m9pwjh1swfqqtr0/_-_-_-_-_2017_-_-_-_.pdf?rlkey=7z0p24l8lz45pdqxwlxt029q9&st=d488kzvi&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السادس/الوطنية.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 63,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 193,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى ترسيخ القيم الإيمانية وتعزيز فهم الطلاب لآيات القرآن الكريم ومعانيها، يجمع بين التلاوة والتفسير والتجويد بأسلوب منهجي مبسط، يشمل دراسة سور متعددة مع تطبيق أحكام التجويد عمليًا",
    tags: ["قرآن كريم", "تفسير", "تجويد", "تلاوة", "ميم ساكنة", "مدود", "سور قرآنية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/qcf3l0m9pwjh1swfqqtr0/_-_-_-_-_2017_-_-_-_.pdf?rlkey=7z0p24l8lz45pdqxwlxt029q9&st=83b6s7dv&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/القران الكريم.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 64,
    title: "التربية الإسلامية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية (الجزء الأول)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 202,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تعزيز القيم الدينية والأخلاقية لدى طلاب الصف السابع من خلال محتوى متكامل يغطي مجالات الإيمان والحديث والتهذيب والفقه والسيرة النبوية والقصص الإسلامي، بأسلوب تدريجي يناسب المرحلة الأساسية المتقدمة",
    tags: ["تربية إسلامية", "عقيدة", "فقه", "حديث", "سيرة نبوية", "قصص إسلامي", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/2sacrspuj8csetnwkn34v/_-_-_-_-_-_2014_-_-_-_.pdf?rlkey=xh67n73kps3ycs6w1c2liuhmp&st=tq123l4d&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/التربية الاسلامية الجزء الاول.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 65,
    title: "التربية الإسلامية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية (الجزء الثاني)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 188,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تعزيز القيم الدينية والأخلاقية لدى طلاب الصف السابع من خلال محتوى متكامل يغطي مجالات الإيمان والعقيدة والحديث والتهذيب والفقه والسيرة النبوية والقصص الإسلامي، بأسلوب تدريجي ومتقدم يناسب المرحلة الأساسية العليا",
    tags: ["تربية إسلامية", "عقيدة", "فقه", "حديث", "سيرة نبوية", "قصص إسلامي", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/dsb76eiz7yps3ain5uqis/_-_-_-_-_-_2014_-_-_-_.pdf?rlkey=5l5fhp2br0v2d7f7iokgqq3y7&st=v1zu4ofg&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/التربية الاسلامية الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 66,
    title: "لغتي العربية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الأول)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 176,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات اللغة العربية من خلال محتوى متكامل يجمع بين الفهم والتعبير والقيم والتطبيقات اللغوية المتنوعة، يغطي موضوعات حياتية واجتماعية وثقافية تعزز الانتماء الوطني والوعي النقدي",
    tags: ["لغة عربية", "قراءة", "نحو", "إملاء", "تعبير", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/zztthoighm1i0e6n17yix/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=5c57l9mc1tvfrq0ro2at8ujs9&st=kleyk9l7&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/لغتي العربية الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 67,
    title: "لغتي العربية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الثاني)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 180,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات اللغة العربية من خلال محتوى متكامل يجمع بين الفهم والتعبير والقيم والتطبيقات اللغوية المتقدمة، يغطي موضوعات حياتية واجتماعية وثقافية متنوعة تعزز الانتماء الوطني والوعي النقدي والتفكير التحليلي",
    tags: ["لغة عربية", "قراءة", "نحو", "إملاء", "تعبير", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/0y97fa6bjdxijc59mstjq/_-_-_-_-_-_2014_-_-_-_.pdf?rlkey=72fbev3sbh3r3hsgmrqsa4omh&st=zogumc6l&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/لغتي العربية الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 68,
    title: "English Pupil's (Lessons)",
    author: "Ministry of Education - Yemen - Aden",
    category: "english",
    subject: "English Pupil's - Grade 7",
    grade: "الصف السابع",
    type: "كتاب",
    language: "إنجليزي",
    pages: 65,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز مهارات اللغة الإنجليزية (الاستماع والتحدث والقراءة والكتابة) لدى طلاب الصف السابع من خلال وحدات متكاملة تتضمن مفردات جديدة وتراكيب لغوية وأنشطة تفاعلية وقصص مصورة وأغاني تعليمية في سياقات حياتية واقعية",
    tags: ["لغة إنجليزية", "مهارات اتصالية", "قراءة", "كتابة", "محادثة", "استماع", "مفردات", "تراكيب لغوية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/1vrpcomkfc2e0ej5h8ra8/_-_-_English_Pupils_-_2013_-_-_-_.pdf?rlkey=1l85mqsyxd03ll40q38xbhhsg&st=7x411igc&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/اللغة الانجليزية English-Pupils.jpg",
    publishedDate: "2013",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة في تعليم اللغة الإنجليزية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 69,
    title: "English Course Crescent",
    author: "Ministry of Education - Yemen - Sana'a & Aden",
    category: "english",
    subject: "English Course Crescent - Grade 7",
    grade: "الصف السابع",
    type: "كتاب",
    language: "إنجليزي",
    pages: 43,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز مهارات اللغة الإنجليزية (الاستماع والتحدث والقراءة والكتابة) لدى طلاب الصف السابع من خلال محتوى متكامل يدمج مهارات التواصل في سياقات تعليمية واقعية وتفاعلية",
    tags: ["لغة إنجليزية", "مهارات اتصالية", "قراءة", "كتابة", "محادثة", "استماع", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/xplzytemty508ptj2jnei/_-_-_English_Crescent_Handwriting_-_2026_-_-_-_.pdf?rlkey=irmqrektt94xd6hf2qpjevlfg&st=tsy06gpl&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/اللغة الانجليزية English-Course.jpg",
    publishedDate: "2026",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة متخصصة في تعليم اللغة الإنجليزية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 70,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 163,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات التفكير العلمي لدى طلاب الصف السابع من خلال محتوى متكامل يغطي تركيب المادة وحالاتها والمواد النقية وغير النقية والحرارة وخصائص الأجسام والكائنات الحية والبيئة والخلايا والأنسجة والحركة والإحساس",
    tags: ["علوم", "مادة", "حرارة", "كائنات حية", "بيئة", "خلايا", "أنسجة", "حركة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/3okh1rchn8ndpalg2qdrd/_-_-_-_-_2014_-_-_-_.pdf?rlkey=fooups5a60q30t57rcyc4jgic&st=g3ye293e&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/العلوم الجزء الاول.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 71,
    title: "العلوم (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الثاني)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 123,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية فهم الطلاب لمفاهيم العلوم الطبيعية من خلال دروس تدمج بين المعرفة النظرية والتطبيقات الحياتية، يغطي خصائص وتغيرات المواد والصوت والفضاء والكواكب والليل والنهار والفصول والكائنات الدقيقة والإسعافات الأولية",
    tags: ["علوم", "مادة", "صوت", "فضاء", "كواكب", "نجوم", "أرض", "كائنات دقيقة", "أمراض", "إسعافات أولية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/e9t02mloqd2oljnayp2gh/_-_-_-_-_2017_-_-_-_.pdf?rlkey=ls93lgmvvc0x7vbzzcmp9w2i7&st=deuzdon1&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/العلوم الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 72,
    title: "التاريخ (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (الجزء الأول)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 99,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تقديم فهم تأسيسي للحضارات القديمة في الوطن العربي بأسلوب مبسط ومترابط، يغطي المفاهيم الحضارية الأساسية والحضارات العربية القديمة مع التركيز على حضارة اليمن ومكانتها الحضارية وحضارة بلاد الرافدين",
    tags: ["تاريخ", "حضارات قديمة", "حضارة اليمن", "بلاد الرافدين", "مفاهيم حضارية", "جوانب سياسية", "جوانب اقتصادية", "جوانب اجتماعية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/zgirntx0crwfp5yeixi2z/_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=7fhavj145gzv7vdgg6fbconcv&st=exbxtjvm&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/التاريخ الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة في التاريخ تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 73,
    title: "التاريخ (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (الجزء الثاني)",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 111,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى استكمال دراسة الحضارات العربية القديمة من خلال تغطية حضارات إضافية وتعميق الفهم التاريخي للطلاب بأسلوب مبسط ومترابط، يركز على دراسة حضارات عربية قديمة متنوعة وتطورها التاريخي والحضاري",
    tags: ["تاريخ", "حضارات قديمة", "حضارات عربية", "جوانب حضارية متعددة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/uhdidydh439289ufgw1cw/_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=ymnwg29b4a75lg5mv0299tqxl&st=iuxp2a0u&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/التاريخ الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة في التاريخ تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 74,
    title: "الرياضيات",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات",
    grade: "الصف السابع",
    type: "كتاب",
    language: "عربي",
    pages: 272,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية التفكير الرياضي والتحليل المنطقي لدى طلاب الصف السابع من خلال محتوى متكامل يغطي الكسور والأعداد الصحيحة والعبارات الجبرية والمعادلات والعلاقات والدوال والهندسة والقياس والإحصاء بطريقة متدرجة ومتكاملة",
    tags: ["رياضيات", "كسور", "أعداد صحيحة", "جبر", "معادلات", "هندسة", "قياس", "إحصاء", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/dwe5adb9xko1jjnr5z1jk/_-_-_2014_-_-_-_.pdf?rlkey=lao32h0hijium7dq5fvs1mkgh&st=igl69rcx&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف السابع/الرياضيات.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 75,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 207,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى ترسيخ القيم الإيمانية وتعميق فهم الطلاب لآيات القرآن الكريم ومعانيها، يجمع بين التلاوة والتفسير والتجويد بأسلوب منهجي مبسط، يتضمن دراسة سور مختارة مع أنشطة إثرائية وتعليمية شاملة",
    tags: ["قرآن كريم", "تفسير", "تجويد", "تلاوة", "سور قرآنية", "قيم إيمانية", "تربية قرآنية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/oh1vzzldi1hek5u9aptmf/_-_-_-_-_2017_-_-_-_.pdf?rlkey=kg8cs1ieu34u8vqxy55oz16om&st=4ezstqi2&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/القران الكريم.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 76,
    title: "التربية الإسلامية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية (الجزء الأول)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 221,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تنمية القيم الإيمانية والأخلاقية لدى طلاب الصف الثامن، يغطي العقيدة الإسلامية والفقه والحديث النبوي والسيرة النبوية بأسلوب مبسط ومتكامل يربط المفاهيم الدينية بالحياة اليومية",
    tags: ["تربية إسلامية", "عقيدة", "إيمان", "فقه", "حديث", "سيرة نبوية", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/r0auduhsv2rhucu9djwfm/_-_-_-_-_-_2018_-_-_-_.pdf?rlkey=x2ftwyrbfbsv2wwrvcu9m982c&st=fez80xxw&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/التربية الاسلامية الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 77,
    title: "التربية الإسلامية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "islamic",
    subject: "التربية الإسلامية (الجزء الثاني)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 161,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تعزيز القيم الإسلامية والسلوكية لدى طلاب الصف الثامن، يجمع بين العقيدة والفقه والحديث والسيرة النبوية، يركز على تطبيق الأحكام الشرعية في الحياة اليومية وتعميق الفهم الإسلامي الصحيح",
    tags: ["تربية إسلامية", "عقيدة", "فقه", "حديث", "سيرة نبوية", "قيم أخلاقية", "غزوات إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/ehwop529i3m653tfuss8i/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=ykce3bxnjdhrlbxvnado2r9aq&st=7yixzwq0&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/التربية الاسلامية الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 78,
    title: "لغتي العربية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الأول)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 196,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات اللغة العربية لدى طلاب الصف الثامن من خلال محتوى متكامل يجمع بين الفهم والتعبير والقراءة والكتابة والقواعد النحوية والإملائية بأسلوب تدريجي ومترابط",
    tags: ["لغة عربية", "قراءة", "نحو", "إملاء", "تعبير", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/y9ch826weml83al8g5kbe/_-_-_-_-_-_2014_-_-_-_.pdf?rlkey=qlraf1lotvqxk42v8aywlnn80&st=5x0469qc&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/لغتي العربية الجزء الاول.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 79,
    title: "لغتي العربية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الثاني)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 180,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات اللغة العربية المتقدمة لدى طلاب الصف الثامن من خلال محتوى متكامل يجمع بين الفهم والتعبير والقراءة والكتابة والقواعد النحوية والإملائية بأسلوب متطور ومترابط يعزز التفكير النقدي والتحليلي",
    tags: ["لغة عربية", "قراءة", "نحو", "إملاء", "تعبير", "قيم أخلاقية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/ks10d4323r56ltymn1ajs/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=pnglmhwpun714frtmwlap80ww&st=yko0jgkz&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/لغتي العربية الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 80,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 139,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات الرياضية المتقدمة لدى طلاب الصف الثامن من خلال محتوى متدرج يغطي النسبة والتناسب والهندسة والقياس والإحصاء بطريقة متكاملة تربط النظرية بالتطبيق",
    tags: ["رياضيات", "نسبة وتناسب", "هندسة", "تشابه", "تطابق", "قياس", "مجسمات", "إحصاء", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/hw4f3i5ie285alypcw1bh/_-_-_-_-_2017_-_-_-_.pdf?rlkey=e73o525699o1q74jkql0zqa3e&st=o6erurpa&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 81,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 179,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز الفهم العلمي وتنمية مهارات التفكير والتحليل لدى طلاب الصف الثامن من خلال محتوى متكامل يجمع بين المفاهيم الفيزيائية والكيميائية والبيولوجية والصحية بطريقة علمية وتطبيقية ترتبط بالحياة اليومية",
    tags: ["علوم", "ذرة", "كيمياء", "كهرباء", "فيزياء", "قوى", "طاقة", "أحياء", "تغذية", "تنفس", "صحة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/qt7h5fm8n609k749lexnx/_-_-_-_-_2017_-_-_-_.pdf?rlkey=8kmhgvcochhv7xdefji8v5yly&st=8fnd086c&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/العلوم الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 82,
    title: "العلوم (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الثاني)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 132,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى استكمال دراسة العلوم من خلال محتوى متقدم يغطي موضوعات علمية إضافية تعمق الفهم العلمي وتنمي مهارات التحليل والتفكير الناقد لدى طلاب الصف الثامن بطريقة متكاملة وتطبيقية",
    tags: ["علوم", "موضوعات متقدمة", "فيزياء", "كيمياء", "أحياء", "بيئة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/4yisaqv3h5q7hnfjaxm8f/_-_-_-_-_2017_-_-_-_.pdf?rlkey=6qkwm2giwivn3ablqwnyb7e83&st=7x58b15l&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/العلوم الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 83,
    title: "التاريخ (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "history",
    subject: "التاريخ (الجزء الأول)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 91,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز الوعي التاريخي لدى طلاب الصف الثامن من خلال دراسة الحضارة العربية الإسلامية ومراحلها المختلفة، مع التركيز على الدور البارز لليمنيين في بنائها ونشرها والأنظمة التي قامت عليها",
    tags: ["تاريخ", "حضارة إسلامية", "مراكز حضارية", "دور اليمنيين", "نظم حضارية", "سياسة", "إدارة", "قضاء", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/qb7qhwxd8ns3hbbdceats/_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=07kc92gzjuzfd6izmm49jw4va&st=7bewg32d&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/التاريخ الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 84,
    title: "التاريخ (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "history",
    subject: "التاريخ (الجزء الثاني)",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "عربي",
    pages: 99,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى استكمال دراسة الحضارة العربية الإسلامية من خلال التركيز على الجوانب الاقتصادية والاجتماعية والعلمية والفنية، مع تسليط الضوء على تحديات الغزو الخارجي والحروب الصليبية والغزو المغولي",
    tags: ["تاريخ", "حضارة إسلامية", "اقتصاد", "مجتمع", "علوم", "فنون", "عمارة", "حروب صليبية", "غزو مغولي", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/i2rdwz36mfcho4ixw4sr9/_-_-_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=s39jvmnculum00zb1oebstade&st=ydiwer0e&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/التاريخ الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 85,
    title: "English Pupil's Book",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "English Pupil's Book",
    grade: "الصف الثامن",
    type: "كتاب",
    language: "إنجليزي",
    pages: 79,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تطوير مهارات اللغة الإنجليزية لدى طلاب الصف الثامن من خلال وحدات متكاملة تجمع بين القراءة والكتابة والاستماع والمحادثة، مع التركيز على موضوعات الحياة اليومية والقواعد النحوية الأساسية بطريقة تفاعلية وشيقة",
    tags: ["لغة إنجليزية", "قواعد نحوية", "مفردات", "قراءة", "كتابة", "استماع", "محادثة", "حياة يومية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/mmcna5qwobhvqu7gz6cqt/_-_-_English_Pupils_-_2013_-_-_-_.pdf?rlkey=nedo8d0tcf1p7n17uy1vlmfpq&st=axbyv5cl&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/اللغة الانجليزية English-Pupils.jpg",
    publishedDate: "2013",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة وطنية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 86,
    title: "English Workbook",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "English Workbook",
    grade: "الصف الثامن",
    type: "كتاب تمارين وتدريبات",
    language: "إنجليزي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز وتطبيق مهارات اللغة الإنجليزية الأساسية لدى طلاب الصف الثامن من خلال تمارين وأنشطة متنوعة ومنهجية، يرافق كتاب الطالب الأساسي ويدعم التعلم الذاتي والتطبيقي",
    tags: ["لغة إنجليزية", "تمارين", "تدريبات", "مفردات", "قواعد نحوية", "كتابة", "قراءة", "مهارات تواصلية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/1ekupsdn4altccbsr30n0/_-_-_-_English_Course_-_2013_-_-_-_.pdf?rlkey=m0dg1bwsixgb30lnti0z2dane&st=muyiv18v&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثامن/اللغة الانجليزية English-Work.jpg",
    publishedDate: "2013",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 87,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 159,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى بناء أساس متين لدى الطالب في علوم القرآن الكريم من خلال الجمع بين الحفظ والتفسير والتجويد والتلاوة الصحيحة، مع تطبيق أحكام التجويد والقراءة الصحيحة للآيات القرآنية",
    tags: ["قرآن كريم", "تفسير", "تجويد", "تلاوة", "سور قرآنية", "حفظ", "قيم إيمانية", "تربية قرآنية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/u3yo7umv55p2dfa1rn03o/_-_-_-_-_2014_-_-_-_.pdf?rlkey=a4uu5whkxz9mcscyl99ag24rr&st=vzehw7ka&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/القران الكريم.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 88,
    title: "التربية الإسلامية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية (الجزء الأول)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 211,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى تنمية الوعي الديني وتعزيز القيم الإسلامية لدى طلاب الصف التاسع من خلال محتوى متكامل يجمع بين العقيدة والفقه والسيرة النبوية والقرآن الكريم والحديث الشريف بأسلوب تربوي يعزز الفهم والتطبيق العملي",
    tags: ["تربية إسلامية", "عقيدة", "إيمان", "فقه", "حديث", "سيرة نبوية", "قيم أخلاقية", "أعلام إسلامية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/j65ylri1tf57iobqsnzj1/_-_-_-_-_-_2017_-_-_-_.pdf?rlkey=g9hs97lt6urpale8rr9adflgl&st=llpqizy4&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/التربية الاسلامية الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 89,
    title: "التربية الإسلامية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "التربية الإسلامية (الجزء الثاني)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 178,
    size: undefined,
    downloads: 0,


    description: "كتاب تربوي يهدف إلى استكمال تعزيز الوعي الديني والقيم الإسلامية لدى طلاب الصف التاسع من خلال محتوى متكامل يركز على آثار الإيمان والزواج في الإسلام والأحاديث النبوية والسيرة النبوية المتقدمة",
    tags: ["تربية إسلامية", "إيمان", "فقه", "زواج", "حديث", "سيرة نبوية", "قيم أخلاقية", "أعلام إسلامية نسائية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/dls9cgjdi3r4iybct4v89/_-_-_-_-_-_2017_-_-_.pdf?rlkey=o7g1lobbw0dcuc1e8kz8um1fy&st=y5vmxckh&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/التربية الاسلامية الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 90,
    title: "لغتي العربية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الأول)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 180,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات اللغوية لدى طلاب الصف التاسع في مجالات القراءة والاستماع والكتابة والتعبير، مع تعزيز القيم الوطنية والدينية والإنسانية من خلال محتوى أدبي ولغوي متكامل يجمع بين النصوص القرآنية والأحاديث والنصوص الأدبية والشعرية",
    tags: ["لغة عربية", "قراءة", "قواعس نحوية", "بلاغة", "إملاء", "تعبير", "نصوص أدبية", "قيم أخلاقية ودينية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/wws9fu31x8jfw3zk7akut/_-_-_-_-_-_2014_-_-_.pdf?rlkey=ys35lvmyn0wqsx6u1toqdt71p&st=q39vr6zc&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/لغتي العربية الجزء الاول.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 91,
    title: "لغتي العربية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "لغتي العربية (الجزء الثاني)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 172,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات اللغوية والأدبية لدى طلاب الصف التاسع من خلال نصوص قرائية متنوعة وأنشطة نحوية وتعبيرية وإملائية متكاملة، مع التركيز على القيم الوطنية والهوية الثقافية والقدرة على التحليل والتذوق الأدبي",
    tags: ["لغة عربية", "قراءة وفهم", "قواعس نحوية", "صرف", "بلاغة", "إملاء", "تعبير", "نصوص أدبية", "قيم وطنية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/cjq52ym5a7hghb8vys1oj/_-_-_-_-_-_2014_-_-_.pdf?rlkey=ayemx0fservrqjojwet1a4789&st=xf47zrdp&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/لغتي العربية الجزء الثاني.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 92,
    title: "English Pupil's Book",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "English Pupil's Book",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "إنجليزي",
    pages: 69,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تطوير مهارات اللغة الإنجليزية لدى طلاب الصف التاسع من خلال وحدات دراسية متدرجة تجمع بين الاستماع والتحدث والقراءة والكتابة، مع التركيز على السياقات الحياتية والموضوعات المعاصرة والمهارات التواصلية الفعالة",
    tags: ["لغة إنجليزية", "قراءة", "كتابة", "استماع", "محادثة", "قواعس نحوية", "مفردات", "مهارات تواصلية", "موضوعات حياتية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/yjaftgp0zbcr6kysk5wvo/_-_-_English_Pupil-s_-_2013_-_-_-_.pdf?rlkey=nem55epm5ptvvawt2mymxsirv&st=3fa0x14n&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/اللغة الانجليزية English-Pupils.jpg",
    publishedDate: "2013",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 93,
    title: "English Workbook",
    author: "وزارة التربية والتعليم - اليمن",
    category: "english",
    subject: "English Workbook",
    grade: "الصف التاسع",
    type: "كتاب تمارين وتدريبات",
    language: "إنجليزي",
    pages: 144,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز وتطبيق مهارات اللغة الإنجليزية لدى طلاب الصف التاسع من خلال تمارين وأنشطة متنوعة ومنهجية، يرافق كتاب الطالب الأساسي ويدعم التعلم الذاتي والتطبيقي",
    tags: ["لغة إنجليزية", "تمارين", "تدريبات", "مفردات", "قواعس نحوية", "كتابة", "قراءة", "استماع", "مهارات تواصلية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/m3b0xbdpiuwd2tf4w6i1l/_-_-_-_-_-_2013_-_-_.pdf?rlkey=713n2rqye6xruyhixiooyt4qn&st=sp5cf1h6&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/اللغة الانجليزية English-Work.jpg",
    publishedDate: "2013",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 94,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 195,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز التفكير الرياضي والمنطقي لدى طلاب الصف التاسع من خلال موضوعات متقدمة تجمع بين المجموعات والعلاقات والتحليل الجبري والمعادلات وحساب المثلثات، مع التركيز على الفهم والتطبيق العملي بأسلوب تدريجي منهجي",
    tags: ["رياضيات", "مجموعات", "علاقات", "جبر", "معادلات", "حساب مثلثات", "تحليل", "تطبيقات عملية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/e3ch1cl349fdllc4vm601/_-_-_-_-_2017_-_-_.pdf?rlkey=rwckl0owi487pk8uhhakm1o8q&st=9hei2ry4&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/الرياضيات الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 95,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 148,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى استكمال تنمية التفكير الرياضي لدى طلاب الصف التاسع من خلال موضوعات هندسية متقدمة تجمع بين الهندسة والهندسة الإحداثية والتحويلات الهندسية والإحصاء، مع التركيز على الفهم المكاني والتحليل الرياضي والتطبيقات الواقعية",
    tags: ["رياضيات", "هندسة", "دائرة", "هندسة إحداثية", "تحويلات هندسية", "إحصاء", "تحليل بيانات", "تطبيقات عملية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/4uab52c0yrqqa35fe3ga1/_-_-_-_-_2017_-_-_.pdf?rlkey=kqsjwutjmddw3pa64lhysr4x2&st=hti9ktl4&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 96,
    title: "العلوم (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "العلوم (الجزء الأول)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 171,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز الفهم العميق لمفاهيم الكيمياء والفيزياء والأحياء لدى طلاب الصف التاسع من خلال محتوى متدرج يجمع بين المحاليل والتفاعلات الكيميائية والظواهر الفيزيائية والوظائف الحيوية مع تطبيقات حياتية واقعية",
    tags: ["علوم", "كيمياء", "فيزياء", "أحياء", "محاليل", "تفاعلات كيميائية", "مغناطيسية", "إخراج", "تكاثر", "صحة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/xc507yd96d8ihudgbtu3r/_-_-_-_-_2017_-_-_-_.pdf?rlkey=8csq2ddwevsfebeksvykm5d87&st=qsujqe8t&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/العلوم الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 97,
    title: "العلوم (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "science",
    subject: "العلوم (الجزء الثاني)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 156,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى استكمال تعزيز فهم الطالب للمفاهيم العلمية من خلال موضوعات متقدمة في الكيمياء والفيزياء والأحياء تشمل تفاعلات العناصر والهالوجينات وخواص الأجسام والضغط والطاقة الشمسية والبيئة والوراثة، مع تطبيقات حياتية وصحية واقعية",
    tags: ["علوم", "كيمياء", "فيزياء", "أحياء", "أكاسيد", "هالوجينات", "ضغط", "طاقة شمسية", "بيئة", "وراثة", "صحة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/7c0wp3dwxundfjl249f59/_-_-_-_-_2017_-_-_.pdf?rlkey=a9kheywnlda7zbcfc5qzqrov8&st=okr1h7ro&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/العلوم الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 98,
    title: "جغرافية الجمهورية اليمنية والوطن العربي",
    author: "وزارة التربية والتعليم - اليمن",
    category: "geography",
    subject: "جغرافية الجمهورية اليمنية والوطن العربي",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 132,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعريف طلاب الصف التاسع بجغرافية الجمهورية اليمنية والوطن العربي، مع التركيز على الخصائص الطبيعية والبشرية والسياسية والاقتصادية والثقافية للمنطقة، بطريقة تعزز الوعي الجغرافي والهوية الوطنية والعربية",
    tags: ["جغرافيا", "الجمهورية اليمنية", "الوطن العربي", "جغرافيا طبيعية", "جغرافيا بشرية", "جغرافيا سياسية", "اقتصاد جغرافي", "ثقافة جغرافية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/sxlxos0evi6osz2lsccb3/_-_-_2017_-_-_-_.pdf?rlkey=j7mwpnv0rxwet9g59cv0dlz5s&st=meukouzu&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/الجغرافيا.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 99,
    title: "التاريخ العربي الحديث والمعاصر (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "history",
    subject: "التاريخ العربي الحديث والمعاصر (الجزء الأول)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 116,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعريف طلاب الصف التاسع بالتطورات التاريخية للعالم العربي في العصر الحديث والمعاصر، مع التركيز على الأحداث السياسية والعسكرية والاجتماعية والثقافية التي شكلت مسار الأمة العربية، بطريقة تعزز الوعي التاريخي والهوية الوطنية والعربية",
    tags: ["تاريخ", "تاريخ عربي حديث", "تاريخ معاصر", "أحداث تاريخية", "السياسة", "العسكرية", "الثقافة", "الهوية العربية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/c4p28oeeyzly1d0nyywsb/_-_-_-_-_2017_-_-_-_.pdf?rlkey=cz64ovlcq5q54xdfrw9drtc8i&st=za12nhrg&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/التاريخ الجزء الاول.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 100,
    title: "التاريخ العربي الحديث والمعاصر (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - صنعاء وعدن",
    category: "history",
    subject: "التاريخ العربي الحديث والمعاصر (الجزء الثاني)",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 131,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى استكمال فهم طلاب الصف التاسع للأحداث التاريخية المهمة من خلال دراسة الاستعمار الأوروبي في الوطن العربي والحركات الوطنية والثورات التحررية والثورة اليمنية، مع التركيز على الوعي السياسي والانتماء الوطني والهوية العربية",
    tags: ["تاريخ", "استعمار أوروبي", "حركات وطنية", "ثورات تحررية", "ثورة يمنية", "ديمقراطية", "استقلال وطني", "نضال عربي", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/y9hxdsx6zcac54f8acv49/_-_-_-_-_2017_-_-_.pdf?rlkey=jsaeatmvlxjnbf7izf07czca2&st=iuejddjz&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/التاريخ الجزء الثاني.jpg",
    publishedDate: "2022",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - صنعاء وعدن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 101,
    title: "التربية الوطنية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "national",
    subject: "التربية الوطنية",
    grade: "الصف التاسع",
    type: "كتاب",
    language: "عربي",
    pages: 129,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى ترسيخ القيم الوطنية والمفاهيم المدنية لدى طلاب الصف التاسع من خلال محتوى متكامل يجمع بين المجتمع المدني والقضايا الاجتماعية والهوية الوطنية والتكامل العربي والتنمية والبيئة والمشاركة المدنية، مع التركيز على تطبيق المبادئ الوطنية في الحياة اليومية",
    tags: ["تربية وطنية", "مجتمع مدني", "قيم وطنية", "قضايا اجتماعية", "هوية وطنية", "تكامل عربي", "تنمية", "حماية البيئة", "مواطنة", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/x3obllu0a3x9z8ere3xml/_-_-_-_2018_-_-_-_.pdf?rlkey=pl3i49o3lyzhp8os8668b8bjd&st=qluk8cfw&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف التاسع/الوطنية.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 102,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 211,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز فهم الطلاب للقرآن الكريم وتربيته على القيم الروحية والأخلاقية، ويجمع بين الحفظ، التفسير، علوم القرآن، والتجويد، مع تدريبات على تلاوة القرآن الكريم بشكل صحيح وتفسير الآيات المختارة",
    tags: ["قرآن كريم", "تفسير", "تجويد", "تلاوة", "علوم القرآن", "قيم إيمانية", "سيرة إبراهيم", "تربية قرآنية", "منهج يمني", "شامل"],
    fileUrl: "https://www.dropbox.com/scl/fi/dut1nkdwnz3mf3kzavriz/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=3ru4bxjxnvxy3382z2ec9k3m2&st=eovkp2w2&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/القران الكريم.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 103,
    title: "الإيمان",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "الإيمان",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 100,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية الفهم الديني والإيماني لدى طلاب الصف الأول الثانوي من خلال شرح مفصل لأركان الإيمان الستة والمفاهيم العقائدية الأساسية في الدين الإسلامي بأسلوب مبسط وميسر يتناسب مع قدرات الطلاب في هذه المرحلة",
    tags: ["عقيدة", "إيمان", "تعليم ديني", "أركان الإيمان", "تربية إسلامية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/1znyh514wxvbxoldqy2ns/_-_-_2017_-_-_-_-_.pdf?rlkey=e4oi9b04lmsdqby6ulx882dfz&st=e5n7q4cs&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الايمان.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 104,
    title: "الفقه والحديث",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "الفقه والحديث",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 177,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي شامل يجمع بين الفقه الإسلامي وأصوله من جهة والحديث النبوي الشريف من جهة أخرى، ويهدف إلى تنمية وعي الطالب بفهم الأحكام الشرعية وغرس القيم النبوية والأخلاق الإسلامية المستمدة من الحديث الشريف، مع ربط المعرفة النظرية بالتطبيق العملي في الحياة اليومية",
    tags: ["فقه", "حديث", "أصول فقه", "أحكام شرعية", "أدلة شرعية", "قيم إسلامية", "تربية إسلامية", "أخلاق إسلامية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/xindw31j9p3zb1iryeq2p/_-_-_-_2018_-_-_-_-_.pdf?rlkey=hzizdqyh5r3u214w7d9y84kpv&st=z9tajq9r&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الفقه والحديث.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 105,
    title: "السيرة النبوية",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "السيرة النبوية",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 90,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يقدم سيرة النبي محمد صلى الله عليه وسلم بأسلوب علمي وتربوي متسلسل يعزز فهم الطلاب للأحداث التاريخية المهمة في مسيرة الدعوة الإسلامية، ويربط بين الماضي والحاضر لتطبيق معاني السيرة في الحياة اليومية",
    tags: ["سيرة نبوية", "تاريخ إسلامي", "حياة النبي محمد", "صحابة", "دعوة إسلامية", "تربية إيمانية", "قيم إسلامية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/0czz431wojg2jq60r2fo2/_-_-_-_2017_-_-_-_-_.pdf?rlkey=5vfroja5d20lyfrqanz82goh7&st=lkefkqra&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/السيرة النبوية.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 106,
    title: "القراءة (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الأول)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 51,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات الفهم القرائي والتحليل الأدبي لدى طلاب الصف الأول الثانوي من خلال نصوص منتقاة بعناية تتنوع بين النصوص الدينية والأدبية والعلمية، مع تعزيز القيم الوطنية والإنسانية والأخلاقية",
    tags: ["قراءة", "فهم نصوص", "تحليل أدبي", "نصوص دينية", "أدب", "ثقافة", "وعي وطني", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/s4evqcjg16clbl0fgn59z/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=t0woehmw8kqn6379t8qfavq2p&st=16sozx7m&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/القراءة الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 107,
    title: "القراءة (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الثاني)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 57,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات الفهم القرائي والتحليل الأدبي والتذوق الفني للنصوص لدى طلاب الصف الأول الثانوي من خلال نصوص متنوعة تجمع بين الطابع المعرفي والثقافي والقيمي والأدبي، مع تعزيز الهوية الوطنية والوعي البيئي والإيماني",
    tags: ["قراءة", "فهم نصوص", "تحليل أدبي", "نصوص شعرية", "أدب", "ثقافة وطنية", "قيم إسلامية", "وعي بيئي", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/en523mrqn71rzpl6npize/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=n939oyobgngamgjbhjqdhimao&st=gppkpeh9&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/القراءة الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 108,
    title: "النحو والصرف (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "النحو والصرف (الجزء الأول)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 81,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات اللغوية للطلاب وتعزيز قدراتهم في فهم قواعد اللغة العربية النحوية والصرفية واستخدامها بشكل سليم من خلال شرح منهجي وتدريبات تطبيقية متنوعة تساهم في ترسيخ القواعد بطريقة عملية",
    tags: ["نحو", "صرف", "قواعد لغة عربية", "إعراب", "مهارات لغوية", "تطبيقات نحوية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/sc88qkpeev4p85nogg1ac/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=5aw9u65r35c5jcim2aqgpibvt&st=6l27t1mf&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/النحو والصرف الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من اللغويين والمشايخ والموجهين في مجال اللغة العربية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 109,
    title: "النحو والصرف (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "النحو والصرف (الجزء الثاني)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 75,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز مهارات الطالب اللغوية والنحوية من خلال دروس متدرجة وشاملة تركز على القواعد النحوية المتقدمة والمشتقات الصرفية، مما يساعد الطالب على فهم بنية اللغة العربية واستخدامها بشكل صحيح في السياقات المختلفة",
    tags: ["نحو", "صرف", "قواعد لغة عربية متقدمة", "مشتقات", "إعراب", "مهارات لغوية", "تطبيقات نحوية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/ej3gpizokmhi2fukwuoad/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=a2npnnndr4h9l10jv8bckvpdv&st=9m24a748&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/النحو والصرف الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من العلماء والموجهين والخبراء التربويين في مجال اللغة العربية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 110,
    title: "الأدب والنصوص والبلاغة (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "الأدب والنصوص والبلاغة (الجزء الأول)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 145,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية مهارات الطالب الأدبية والتعبيرية من خلال عرض نماذج منتقاة من النصوص الشعرية والنثرية وتحليلها بلاغيًا ونقديًا، مع تعريف الطالب بمراحل الأدب العربي وتطوره، وتعزيز الذوق الأدبي والقدرة على التذوق البلاغي",
    tags: ["أدب", "نصوص أدبية", "بلاغة", "شعر جاهلي", "نقد أدبي", "تذوق فني", "علم البيان", "التشبيه", "الاستعارة", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/6d4b65ebautff183fskzi/_-_-_-_-_-_-_2018_-_-_-_-_.pdf?rlkey=j53w6pqmxw71cnyrdpnfw77lr&st=hkkj1udo&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الادب والنصوص والبلاغة الجزء الاول.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من العلماء والموجهين التربويين في مجالات الأدب والنصوص والبلاغة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 111,
    title: "الأدب والنصوص والبلاغة (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "الأدب والنصوص والبلاغة (الجزء الثاني)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 116,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يستكمل الجزء الأول من خلال تقديم نماذج أدبية متنوعة من عصور لاحقة مع التركيز على تطور البلاغة والأساليب الأدبية، وتعميق مهارات الطالب في التحليل البلاغي والنقد الأدبي والتذوق الفني",
    tags: ["أدب", "نصوص أدبية", "بلاغة", "علوم البلاغة", "نقد أدبي", "تذوق فني", "أساليب بلاغية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/5artat5mz3hk8lwcxl7hk/_-_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=dqr71eaty1v7cowjdr9opvmfu&st=m9iuw5h6&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الادب والنصوص والبلاغة الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من العلماء والموجهين التربويين في مجالات الأدب والنصوص والبلاغة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 112,
    title: "الرياضيات (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الأول)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 123,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية التفكير الرياضي والمنطقي لدى طلاب الصف الأول الثانوي من خلال موضوعات منهجية متدرجة تغطي المنطق الرياضي والتطبيقات والقوى والجذور والحدوديات والبنى الجبرية، مع التركيز على الفهم العملي والتطبيق",
    tags: ["رياضيات", "منطق رياضي", "جبر", "تطبيقات", "قوى وجذور", "حدوديات", "بنى جبرية", "مهارات رياضية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/e5z22m30stbgw7l70kdsl/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=armsue9gnmfxydkgfvkym60rl&st=2woi4yml&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الرياضيات الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من خبراء التربية والمشايخ والعلماء في مجال الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 113,
    title: "الرياضيات (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (الجزء الثاني)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 131,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعزيز الفهم الرياضي لدى طلاب الصف الأول الثانوي من خلال دراسة معمقة للمعادلات والمتراجحات وحساب المثلثات والهندسة الإحداثية والمتجهات، مع التركيز على التطبيقات العملية والربط بين النظرية والواقع",
    tags: ["رياضيات", "معادلات ومتراجحات", "حساب المثلثات", "هندسة إحداثية", "متجهات", "تحويلات هندسية", "مهارات رياضية متقدمة", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/d22ju752vegvoyftpxigl/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=tzqmr7860q7tyxupeg6kth6af&st=cyngl8nv&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الرياضيات الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الأكاديميين والموجهين التربويين في مجال الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 114,
    title: "الرياضيات (التمارين)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (التمارين)",
    grade: "الصف الأول الثانوي",
    type: "كتاب تمارين",
    language: "عربي",
    pages: 51,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز الفهم والتطبيق العملي للمفاهيم الرياضية من خلال تمارين ومشكلات متنوعة تغطي كافة وحدات المنهج المقرر، مما يساعد الطالب على تطوير مهارات التفكير المنطقي وحل المشكلات",
    tags: ["رياضيات", "تمارين", "تدريبات", "مهارات رياضية", "حل المشكلات", "جبر", "هندسة", "إحصاء", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/xdg2nk7cdg44srddo7gr9/_-_-_-_2017_-_-_-_-_.pdf?rlkey=y4c2ebntrnixv2dto4bsdqmu4&st=4matymnm&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الرياضيات ( التمارين ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة وطنية متخصصة من التربويين والخبراء في تعليم الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 115,
    title: "English Pupil's Book",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "English Pupil's Book",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "إنجليزي",
    pages: 60,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تنمية المهارات اللغوية لدى طلاب الصف الأول الثانوي بشكل متكامل يشمل الاستماع والتحدث والقراءة والكتابة من خلال وحدات تعليمية تفاعلية تربط اللغة الإنجليزية بمواقف الحياة اليومية والواقعية",
    tags: ["اللغة الإنجليزية", "مهارات لغوية", "استماع", "تحدث", "قراءة", "كتابة", "مفردات", "حوارات", "ثقافة", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/lwpougtc3pu9x236j7cf4/_-_-_-_English_Pupils_-_-_-_.pdf?rlkey=28ckz8wxj5l52z57lz8m4tpyc&st=7hd4ecdm&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/اللغة الانجليزية English-Pupils.jpg",
    publishedDate: "2006",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من خبراء ومعلمي اللغة الإنجليزية والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 116,
    title: "English Workbook",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "English Workbook",
    grade: "الصف الأول الثانوي",
    type: "كتاب تمارين",
    language: "إنجليزي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز مهارات اللغة الإنجليزية لدى طلاب الصف الأول الثانوي من خلال تمارين وتدريبات متنوعة وشاملة تغطي الاستماع والتحدث والقراءة والكتابة، مع ربط التعلم بمواقف حياتية واقعية",
    tags: ["اللغة الإنجليزية", "تمارين وتدريبات", "مهارات لغوية", "قراءة", "كتابة", "استماع", "تحدث", "مفردات", "قواعد نحوية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/km6gt67ictxl0dm26ehum/_-_-_-_English_Workbook_-_-_-_.pdf?rlkey=pqbjrprf7bjicbwr3t6dzdwv5&st=2b9ax7t0&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/اللغة الانجليزية English-Work.jpg",
    publishedDate: "2006",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من خبراء ومعلمي اللغة الإنجليزية والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "yellow"
  },
  {
    id: 117,
    title: "الفيزياء",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "physics",
    subject: "الفيزياء",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 211,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تقديم مفاهيم الفيزياء بأسلوب مبسط ومنهجي يعزز الفهم والاستيعاب، ويغطي مواضيع متنوعة من الحركة والطاقة إلى الكهرباء والحرارة مع التركيز على التطبيقات العملية والربط بالحياة اليومية",
    tags: ["فيزياء", "حركة", "طاقة", "كهرباء", "حرارة", "قياس", "مبادئ فيزيائية", "تجارب", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/0ijqma8ikkijqxu68muc9/_-_-_2017_-_-_-_-_.pdf?rlkey=3rfr5wk20c11n81d32c9tk32m&st=56b9covh&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الفيزياء.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية تربوية متخصصة من الأكاديميين والموجهين التربويين في مجال الفيزياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "purple"
  },
  {
    id: 118,
    title: "الفيزياء (الأنشطة والتجارب العلمية)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "physics",
    subject: "الفيزياء (الأنشطة والتجارب العلمية)",
    grade: "الصف الأول الثانوي",
    type: "كتاب أنشطة وتجارب",
    language: "عربي",
    pages: 35,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز الفهم العملي للمفاهيم الفيزيائية من خلال مجموعة متكاملة من التجارب العلمية والأنشطة التطبيقية التي تربط المفاهيم النظرية بالتطبيقات الواقعية وتنمي المهارات التجريبية لدى الطلاب",
    tags: ["فيزياء", "تجارب علمية", "أنشطة معملية", "تطبيقات عملية", "مهارات تجريبية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/z3defehx95oc97cxsxkuz/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=4apj3ks4ifrgcmuh850xs30yv&st=3h9qe6ah&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الفيزياء ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من الخبراء والعلماء والموجهين التربويين في مجال الفيزياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "purple"
  },
  {
    id: 119,
    title: "الكيمياء",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "chemistry",
    subject: "الكيمياء",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 195,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى بناء قاعدة معرفية قوية في مفاهيم الكيمياء العامة والعضوية من خلال شرح منهجي متسلسل يبدأ من الأساسيات ويصل إلى التطبيقات العملية، مع تركيز على ربط المفاهيم الكيميائية بالحياة اليومية",
    tags: ["كيمياء", "ذرة", "جدول دوري", "عناصر", "تفاعلات كيميائية", "كيمياء عضوية", "معادلات موزونة", "مفاهيم كيميائية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/qzhvuvb3uxtvpapdbl7y0/_-_-_2017_-_-_-_-_.pdf?rlkey=s8ml1e94s0yu1advqya47srh1&st=dv4u7am4&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الكيمياء.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من الخبراء التربويين والموجهين وأساتذة الكيمياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "red"
  },
  {
    id: 120,
    title: "الكيمياء (الأنشطة والتجارب العلمية)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "chemistry",
    subject: "الكيمياء (الأنشطة والتجارب العلمية)",
    grade: "الصف الأول الثانوي",
    type: "كتاب أنشطة وتجارب",
    language: "عربي",
    pages: 51,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز الفهم العملي للمفاهيم الكيميائية من خلال مجموعة متكاملة من الأنشطة والتجارب العلمية المخبرية التي تربط النظرية بالتطبيق وتنمي المهارات العلمية الأساسية",
    tags: ["كيمياء", "تجارب علمية", "أنشطة معملية", "مركبات كيميائية", "غازات", "مهارات تجريبية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/mchw15lerylxjvedb39if/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=z7hy0o7ltwa0h5rv5thwact3x&st=yje76xrp&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الكيمياء ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والأساتذة الجامعيين والموجهين التربويين في مجال الكيمياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "red"
  },
  {
    id: 121,
    title: "الأحياء",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "biology",
    subject: "الأحياء",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 219,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي شامل يهدف إلى بناء فهم عميق لعلوم الحياة والكائنات الحية من خلال دروس مبسطة مدعومة برسوم توضيحية، يغطي مظاهر الحياة والخلايا والتصنيف والتغذية والنقل والتنفس والإخراج وتركيب الأرض",
    tags: ["أحياء", "خلايا", "تصنيف كائنات حية", "تغذية", "نقل", "تنفس", "إخراج", "جيولوجيا", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/dqa562r8o7n99xcefc6j6/_-_-_2017_-_-_-_-_.pdf?rlkey=lzbzig0o1f6k3klv4d3jjc7g5&st=8mtg4vpd&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/علم الاحياء وعلم الارض.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من الأكاديميين والعلماء والموجهين التربويين في مجال علم الأحياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "pink"
  },
  {
    id: 122,
    title: "الأحياء (الأنشطة والتجارب العلمية)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "biology",
    subject: "الأحياء (الأنشطة والتجارب العلمية)",
    grade: "الصف الأول الثانوي",
    type: "كتاب أنشطة وتجارب",
    language: "عربي",
    pages: 90,
    size: undefined,
    downloads: 0,


    description: "كتاب تدريبي يهدف إلى تعزيز الفهم العملي للمفاهيم البيولوجية من خلال مجموعة واسعة من الأنشطة والتجارب العلمية المخبرية التي تربط النظرية بالتطبيق وتنمي المهارات العلمية الأساسية",
    tags: ["أحياء", "تجارب علمية", "أنشطة معملية", "خلايا", "تغذية", "نقل", "تنفس", "إخراج", "جيولوجيا", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/vu65hwjtl8dq1y8i78gm7/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=ns54b117c9prw99o2sc1k61yf&st=2yhxm68u&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/علم الاحياء وعلم الارض ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الخبراء والموجهين التربويين وأساتذة الأحياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "pink"
  },
  {
    id: 123,
    title: "التاريخ (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (الجزء الأول)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 107,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى ترسيخ المفاهيم التاريخية والحضارية لدى الطلاب من خلال تناول تطور الحضارات البشرية القديمة بركيز خاص على الحضارات العربية والآسيوية، مع ربط الماضي بالحاضر وتعزيز الفهم النقدي والوعي الثقافي",
    tags: ["التاريخ", "حضارات قديمة", "حضارات عربية", "حضارات آسيوية", "تاريخ الحضارة", "مفاهيم تاريخية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/x36zfkygo0n95qw1vimy7/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=vadk53jbmx1i9syne14362ccy&st=djuax2ew&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/التاريخ الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من الموجهين التربويين والعلماء والمشايخ في مجال التاريخ تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 124,
    title: "التاريخ (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (الجزء الثاني)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 83,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعريف الطلاب بالمراحل المتقدمة من التاريخ البشري، مع التركيز على الحضارات الأوروبية القديمة وحضارات القارات المكتشفة والحضارات العربية قبل الإسلام، يجمع بين السرد التاريخي والتحليل لتنمية مهارات الفهم والاستنتاج",
    tags: ["التاريخ", "حضارات أوروبية", "حضارات قديمة", "حضارات عربية", "تاريخ الحضارة", "حضارات ما قبل الإسلام", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/q9eqrbd13owr93419inv9/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=s5b3854qxckofyb5hlirnck98&st=nuxlioni&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/التاريخ الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من المشايخ والعلماء والموجهين التربويين في مجال الدراسات التاريخية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 125,
    title: "الجغرافيا",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "geography",
    subject: "الجغرافيا",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 176,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي شامل يهدف إلى تنمية الفهم الجغرافي لدى الطلاب من خلال دراسة العلاقة بين الإنسان والمكان والبيئة، يغطي المفاهيم الجغرافية والخرائط والمناخ والمياه والموارد الطبيعية والأنظمة البيئية",
    tags: ["جغرافيا", "خرائط", "مناخ", "موارد طبيعية", "أنظمة بيئية", "سكان", "توزيع جغرافي", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/x8efqw75c30vzq81q0a2j/_-_-_2014_-_-_-_-_.pdf?rlkey=wei8bffxht2bamb7nwxbbrfyj&st=52t38jja&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/الجغرافيا.jpg",
    publishedDate: "2014",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تأليف متخصصة من الخبراء التربويين والموجهين في الجغرافيا تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 126,
    title: "علم الاجتماع (المجتمع اليمني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "social",
    subject: "علم الاجتماع (المجتمع اليمني)",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 59,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى تعريف الطلاب بالمجتمع اليمني من منظور اجتماعي وثقافي واقتصادي وسياسي، يغطي الملامح الاجتماعية والثقافية والاقتصادية والسياسية للمجتمع، مع معالجة المشكلات الاجتماعية المعاصرة وتعزيز الوعي الوطني",
    tags: ["علم الاجتماع", "مجتمع", "ثقافة", "اقتصاد", "سياسة", "مشاكل اجتماعية", "التعليم", "الإعلام", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/1ujcf0pz82pkpiojgc7n5/_-_-_-_2017_-_-_-_-_.pdf?rlkey=e50alei8z1pdjyfkx7y2k5cg1&st=sxb3ijy9&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/علم الاجتماع (المجتمع اليمني).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية تربوية متخصصة من الأكاديميين والموجهين التربويين في مجال علم الاجتماع تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 127,
    title: "الحاسوب",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "science",
    subject: "الحاسوب",
    grade: "الصف الأول الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 121,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي يهدف إلى إكساب الطلاب المهارات المفاهيمية والعملية لفهم أساسيات تقنية المعلومات، يغطي مكونات الحاسوب والبرمجيات ونظام التشغيل ومعالجة النصوص، يجمع بين النظرية والتطبيق العملي",
    tags: ["حاسوب", "تقنية معلومات", "مكونات الحاسوب", "برمجيات", "نظام التشغيل", "معالجة النصوص", "مهارات رقمية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/osf3iht8vhf1hykwbthal/_-_-_2017_-_-_-_-_.pdf?rlkey=pbo4nzrckfd0z5gmwc2q715a4&st=7do5i7qf&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الأول الثانوي/حاسوب.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من الموجهين التربويين والخبراء في علوم الحاسوب تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 128,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 123,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يجمع بين الحفظ والتفسير والتلاوة وعلوم القرآن، يهدف إلى تعزيز فهم الطلاب للقرآن الكريم وغرس قيم الإيمان والوعي الشرعي، يتناول تفسير آيات مختارة من سور الدخان والمؤمنون والزمر وآل عمران، ويدرب الطلاب على التلاوة الصحيحة وتطبيق أحكام التجويد.",
    tags: ["القرآن الكريم", "التفسير", "علوم القرآن", "التلاوة", "الحفظ", "تجويد", "المعاني الإيمانية", "المناهج الدراسية اليمنية"],
    fileUrl: "https://www.dropbox.com/scl/fi/j73r1s1oh2kmaott8dt7w/_-_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=yrka01kg8rkzhufjyiht0ygbm&st=kre8apj9&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/القران الكريم.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والشيوخ والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 129,
    title: "الإيمان",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "الإيمان",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 88,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يعالج أساسيات العقيدة الإسلامية والإيمان بالله وأركانه، يجمع بين النظرية والتطبيق العملي، يهدف إلى ترسيخ المفاهيم العقائدية والقيم الإيمانية لدى الطلاب، يتناول معرفة الله وأسماؤه وصفاته والإيمان بأركانه وتحذيرات من الشرك والكفر والنفاق، مع ربط العقيدة بمظاهر الكون والحياة.",
    tags: [
      "العقيدة الإسلامية",
      "الإيمان",
      "التوحيد",
      "أسماء الله وصفاته",
      "الشرك والكفر",
      "الملائكة",
      "الكتب السماوية",
      "القدر",
      "الولاء والبراء",
      "الإعجاز العلمي",
      "المناهج الدراسية اليمنية"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/y5hz3t77jxzmt9c3j5y5t/_-_-_2018_-_-_-_-_.pdf?rlkey=3mz0v79xqa1eeqycsgidbjpiu&st=aozxyrh8&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الايمان.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والموجهين التربويين في مجال العقيدة والإيمان تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 130,
    title: "القرآن الكريم وعلومه (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 92,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي أساسي يستكمل الجزء الأول من مادة القرآن الكريم وعلومه للصف الثاني ثانوي (القسم العلمي)، يتضمن موضوعات متقدمة في التفسير والحفظ والتلاوة وعلوم القرآن، معتمد من وزارة التربية والتعليم اليمنية.",
    tags: [
      "القرآن الكريم",
      "التفسير",
      "علوم القرآن",
      "التلاوة",
      "الحفظ",
      "القراءات القرآنية",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي",
      "القسم العلمي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/hyity1871wo05zb0jfwl9/_-_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=x9puv54e23fphjnclcn8kjmd4&st=bqbo92sl&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/القران الكريم الجزء الثاني.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 131,
    title: "الفقه والحديث (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "الفقه والحديث (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 97,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يجمع بين علوم الحديث النبوي والفقه الإسلامي، يهدف إلى تعزيز الفهم الديني والوعي الشرعي لدى الطلاب، يتناول أحاديث نبوية مختارة تركز على القيم الأخلاقية والسلوكية الإسلامية، وموضوعات فقهية في المعاملات المالية والتجارة، يجمع بين النظرية والتطبيق العملي.",
    tags: [
      "الحديث النبوي",
      "الفقه الإسلامي",
      "المعاملات المالية",
      "التجارة",
      "البيع",
      "الربا",
      "الغش",
      "القيم الإسلامية",
      "السلوك النبوي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/peh8ux61polwe6ledhexf/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=ooymubwsl2xate5ac4n555j2s&st=n6970gmq&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الحديث والفقه الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والشيوخ والموجهين التربويين في مجالي الفقه والحديث تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 132,
    title: "الفقه والحديث (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "الفقه والحديث (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يستكمل الجزء الأول من الفقه والحديث، يركز على أحاديث نبوية مختارة تتناول القيم الإيمانية والسلوكية، وموضوعات فقهية متقدمة في المعاملات المالية والعقود، يربط العلم الشرعي بتطبيقات الحياة الواقعية والمعاصرة، يجمع بين الفهم النظري والممارسة العملية.",
    tags: [
      "الحديث النبوي",
      "فقه المعاملات",
      "العقود",
      "المعاملات البنكية",
      "السَّلَم",
      "الإيجارة",
      "الشركة",
      "القيم الإيمانية",
      "الجهاد",
      "النظام الاقتصادي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/j15jhh03le4gvaakeojtn/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=8km828v9lbmx2g4rnk0g3altj&st=v5mgpxy5&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الحديث والفقه الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والشيوخ والموجهين التربويين في مجالي الفقه والحديث تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 133,
    title: "السيرة النبوية (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "السيرة النبوية (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 51,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يعرّف الطلاب بسيرة النبي محمد ﷺ من بدايات الدعوة حتى تأسيس الدولة الإسلامية في المدينة، يتناول المجتمع قبل الهجرة وبيعتي العقبة والهجرة والمجتمع المسلم الناشئ، يجمع بين السرد التاريخي والقيم التربوية، يركز على القيادة النبوية وبناء الدولة الإسلامية.",
    tags: [
      "السيرة النبوية",
      "التاريخ الإسلامي",
      "الهجرة",
      "المدينة المنورة",
      "بيعة العقبة",
      "وثيقة المدينة",
      "الغزوات",
      "القيادة الإسلامية",
      "الصحابة",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/cgx4hpqdctx025b3u727x/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=p2hex8kmw5d48xhq24qdvljh9&st=pk2iupom&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/السيرة النبوية الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والشيوخ والموجهين التربويين في السيرة النبوية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 134,
    title: "السيرة النبوية (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "islamic",
    subject: "السيرة النبوية (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 67,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يستكمل الجزء الأول من السيرة النبوية، يركز على الغزوات الكبرى والأحداث المفصلية في حياة النبي ﷺ، يتناول غزوة بدر وأحد والأحزاب والمواقف التربوية والقيادية، يعرض شخصيات بارزة من الصحابة، يجمع بين السرد التاريخي والتحليل الروحي والقيمي.",
    tags: [
      "السيرة النبوية",
      "الغزوات",
      "غزوة بدر",
      "غزوة أحد",
      "غزوة الأحزاب",
      "الصحابة",
      "البطولة والتضحية",
      "القيادة النبوية",
      "الدروس التربوية",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/zn0rqzh958ea2lb9tvmla/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=8206bn43x7lnfdd88yc17dl3n&st=bbkfvpfg&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/السيرة النبوية الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والموجهين التربويين في السيرة النبوية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 135,
    title: "القراءة (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 67,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن نصوص أدبية وتربوية ووطنية وإنسانية مختارة بعناية، يهدف إلى تنمية مهارات الفهم والاستيعاب والتذوق الأدبي، يجمع بين المتعة والفائدة، يعزز القيم الأخلاقية والدينية، يطور مهارات التحليل والتفكير النقدي، يربط الطالب بالواقع والقضايا المعاصرة.",
    tags: [
      "القراءة",
      "النصوص الأدبية",
      "التربية",
      "الوحدة والتكاتف",
      "العمل والإنتاجية",
      "البطولة",
      "المعالم الحضارية",
      "الوعي البيئي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/rmrpdqsed2kki7vmt33p7/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=4zklpb7lkqebzpryy9wulpuy9&st=wy8i4dgj&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/القراءة الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 136,
    title: "القراءة (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "القراءة (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 57,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يستكمل الجزء الأول من مادة القراءة، يتضمن نصوصًا أدبية وثقافية وتاريخية متنوعة تعكس الحضارة اليمنية والعربية الإسلامية، يهدف إلى تنمية مهارات الفهم والتحليل الأدبي واللغوي، يعزز القيم الأخلاقية والهوية الثقافية، يطور مهارات التفكير النقدي والتعبير الواعي.",
    tags: [
      "القراءة",
      "النصوص الأدبية",
      "الثقافة اليمنية",
      "الحضارة الإسلامية",
      "التراث",
      "الشخصية والقيم",
      "النجاح والطموح",
      "التحليل الأدبي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/mj9wv6v4yozq33294mv7g/_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=jm0fa02hjznxtabwl2vbv85tn&st=nb6er52c&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/القراءة الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 137,
    title: "النحو والصرف (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "النحو والصرف (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 132,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتناول موضوعات النحو والصرف للصف الثاني ثانوي، يهدف إلى تعليم الطلاب قواعد اللغة العربية الأساسية، يجمع بين النظرية والتطبيق العملي، يطور مهارات الإعراب والتحليل اللغوي، يساعد على الكتابة والتعبير الصحيح.",
    tags: [
      "النحو",
      "الصرف",
      "قواعد اللغة العربية",
      "الإعراب",
      "التحليل اللغوي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/xdev0rlf37ohlczv92i31/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=vpkpl3e4z9dnps4czd1r9yn7l&st=kxjbcro0&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/النحو والصرف الجزء الاول.jpg",
    publishedDate: "غير محدد",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من المعلمين والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 138,
    title: "النحو والصرف (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "النحو والصرف (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 113,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يستكمل الجزء الأول من النحو والصرف، يتناول قواعد نحوية متقدمة مثل الفعل اللازم والمتعدي والفاعل ونائب الفاعل والمصدر وأساليب التعجب والشرط، يطبق المفاهيم على أساليب المدح والذم والمقصور والممدود، يجمع بين النظرية والتطبيق العملي، يطور مهارات التحليل اللغوي والتعبير الصحيح.",
    tags: [
      "النحو",
      "الصرف",
      "قواعد اللغة العربية",
      "الفاعل",
      "نائب الفاعل",
      "المصدر",
      "أساليب الشرط",
      "المقصور والممدود",
      "التراكيب النحوية",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/7eqjhsgjuy8pzpa1337a6/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=5kwyji6z7gmnblm4b71po0g1t&st=tu1i2582&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/النحو والصرف الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين في مجال النحو والصرف تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 139,
    title: "الأدب والنصوص والبلاغة (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "الأدب والنصوص والبلاغة (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 128,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يجمع بين الدراسة الأدبية والبلاغية والعروضية، يركز على الأدب في العصر العباسي الأول مع نماذج شعرية من أعلام الشعراء، يتناول موضوعات الحكمة والمدح والوصف والزهد، يشرح علم البلاغة والخبر والإنشاء والأساليب البلاغية، يقدم أوزان الشعر والعروض، يجمع بين النظرية والتطبيق العملي والتدريبات.",
    tags: [
      "الأدب العربي",
      "الشعر العباسي",
      "النصوص الأدبية",
      "البلاغة",
      "الخبر والإنشاء",
      "الأساليب البلاغية",
      "العروض",
      "بحور الشعر",
      "التحليل الأدبي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/rs89xmyt6yk7s8ah50dk6/_-_-_-_-_-_-_2018_-_-_-_-_.pdf?rlkey=ahyoe4x8k8xobsb507rqtqhx4&st=8zbztfdj&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الادب والنصوص والبلاغة الجزء الاول.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين في مجالات اللغة العربية والأدب والبلاغة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 140,
    title: "الأدب والنصوص والبلاغة (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "الأدب والنصوص والبلاغة (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 139,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يستكمل الجزء الأول من الأدب والنصوص والبلاغة، يركز على الأدب في العصر العباسي الثاني والعصر الأندلسي، يتضمن نماذج شعرية من المتنبي وأبي فراس والمعري وابن زيدون وابن خفاجة، ينقل نصوصًا نثرية من أدباء بارزين، يشرح أساليب بلاغية كالتقديم والتأخير والقصر والإيجاز والإطناب، يقدم بحورًا شعرية إضافية.",
    tags: [
      "الأدب العربي",
      "الشعر العباسي والأندلسي",
      "النصوص الأدبية",
      "البلاغة",
      "القصر والإيجاز",
      "العروض",
      "بحور الشعر",
      "التحليل الأدبي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/qty25xks757pn283qxfuv/_-_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=6y8ggcn69gratt3do5u0rotoa&st=s96008zm&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الادب والنصوص والبلاغة الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين في مجالات الأدب والبلاغة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "green"
  },
  {
    id: 141,
    title: "الرياضيات - القسم العلمي (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات - القسم العلمي (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 171,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتناول موضوعات رياضية متقدمة في الحلقات والحقول والدوال الحقيقية، يشرح المتتاليات الحسابية والهندسية واللوغاريتمات والدوال الأسية، يقدم مفاهيم النهايات والاتصال والاشتقاق، يجمع بين النظرية والتطبيق، يطور مهارات التحليل والتفكير المنطقي، يعزز الفهم البياني والجبري، ومخصص لطلاب القسم العلمي بالصف الثاني ثانوي.",
    tags: [
      "الرياضيات",
      "الجبر",
      "الدوال الحقيقية",
      "المتتاليات",
      "اللوغاريتمات",
      "التفاضل",
      "النهايات",
      "الاشتقاق",
      "التحليل الرياضي",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/fu3ahufa8i8sif2hlyuud/_-_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=qytahhh9ysjdud9botnudkbe5&st=4o2j8aix&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الرياضيات الجزء الاول ( القسم العلمي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من الأكاديميين والموجهين التربويين في مجال الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 142,
    title: "الرياضيات (التمارين) - القسم العلمي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (التمارين) - القسم العلمي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 100,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن تمارين شاملة وتطبيقات عملية لموضوعات الرياضيات للقسم العلمي في الصف الثاني ثانوي، يساعد الطالب على تعزيز فهمه وإتقان المهارات الرياضية، يتضمن تدريبات متدرجة في الصعوبة، يجمع بين التطبيق والفهم العميق، يعزز القدرة على حل المشاكل الرياضية بأنواعها، ويمثل مكملاً تطبيقياً لكتاب الرياضيات النظري.",
    tags: [
      "الرياضيات",
      "التمارين",
      "التطبيقات العملية",
      "حل المشاكل",
      "الجبر",
      "الهندسة",
      "الإحصاء",
      "المهارات الرياضية",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/ho9qnj172v2jelvlxhben/_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=6dr6rzgpts9ro7pky5lrj23hm&st=91njnsfb&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الرياضيات التمارين ( القسم العلمي ).jpg",
    publishedDate: "-",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من معلمي الرياضيات والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 143,
    title: "الرياضيات - القسم العلمي (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات - القسم العلمي (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 162,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يستكمل الجزء الأول من الرياضيات، يتناول الكسور العشرية والمقادير الجبرية والهندسة الإحداثية والفضائية وحساب المثلثات والإحصاء والاحتمالات، يشرح معادلة الدائرة والمستويات المتوازية والنسب المثلثية والانحدار الخطي، يجمع بين النظرية والتطبيق، يطور مهارات التحليل والاستدلال الإحصائي، ومخصص لطلاب القسم العلمي بالصف الثاني ثانوي.",
    tags: [
      "الرياضيات",
      "الجبر",
      "الهندسة الإحداثية",
      "الهندسة الفضائية",
      "حساب المثلثات",
      "الإحصاء",
      "الاحتمالات",
      "الدوائر",
      "الانحدار الخطي",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/90h5nqe4bfbt4tn3wh03q/_-_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=p1882ncrs477qoy0pine8y4fr&st=r0331ose&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الرياضيات الجزء الثاني ( القسم العلمي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من خبراء الرياضيات والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 144,
    title: "الرياضيات - القسم الأدبي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات - القسم الأدبي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 107,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتناول موضوعات رياضية مناسبة للقسم الأدبي من المرحلة الثانوية، يغطي المتتاليات الحسابية والهندسية واللوغاريتمات والمصفوفات والمحددات والمشتقات، يركز على المفاهيم الأساسية والتطبيقات العملية، يجمع بين النظرية والممارسة، يطور مهارات التفكير التحليلي والمنطقي.",
    tags: [
      "الرياضيات",
      "المتتاليات",
      "اللوغاريتمات",
      "المصفوفات",
      "المحددات",
      "المشتقات",
      "التفاضل",
      "التحليل الرياضي",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/zsh2kmclxvoynxwjgpshx/_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=7a5ek08rjtg88aiu4h2bi6i1l&st=hahjk76p&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الرياضيات ( القسم الادبي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من معلمي الرياضيات والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 145,
    title: "الرياضيات (التمارين) - القسم الأدبي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "mathematics",
    subject: "الرياضيات (التمارين) - القسم الأدبي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 35,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن تمارين وتدريبات شاملة لموضوعات الرياضيات للقسم الأدبي، يغطي المتباينات واللوغاريتمات والمصفوفات والمشتقات، يساعد الطالب على تطبيق المفاهيم النظرية، يتضمن أسئلة متنوعة واختبارات وحدات، يعزز مهارات التفكير المنطقي والتحليل.",
    tags: [
      "الرياضيات",
      "التمارين",
      "المتباينات",
      "اللوغاريتمات",
      "المصفوفات",
      "المشتقات",
      "التطبيقات العملية",
      "حل المشاكل",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/p2vyxeckwe76aaw3vwmc0/_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=2b396r6vk5d8e76fm1ayoh1wn&st=p2lmm18y&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الرياضيات التمارين ( القسم الادبي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من معلمي الرياضيات والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 146,
    title: "English Pupil's Book",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "اللغة الإنجليزية (English Pupil's Book)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "إنجليزي",
    pages: 72,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يطور مهارات اللغة الإنجليزية الأربع (الاستماع والتحدث والقراءة والكتابة)، يتضمن وحدات تعليمية متكاملة حول موضوعات ثقافية وعلمية وحياتية، يركز على التواصل الواقعي والمواقف العملية، يعزز الحصيلة اللغوية والمعرفية، يدعم التفكير النقدي والانفتاح الثقافي.",
    tags: [
      "اللغة الإنجليزية",
      "مهارات اللغة",
      "الاستماع والتحدث",
      "القراءة والكتابة",
      "الثقافة الإنجليزية",
      "الدول الناطقة بالإنجليزية",
      "اليمن والمستقبل",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/s2eo1aiwmg060zwadcss0/_-_-_-_English_Pupils_-_-_-_.pdf?rlkey=4np28reuz6wc6393r7o02rvej&st=dstwys88&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/اللغة الانجليزية English-Pupils.jpg",
    publishedDate: "2026",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من التربويين والموجهين والخبراء في تدريس اللغة الإنجليزية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 147,
    title: "English Workbook",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "اللغة الإنجليزية (English Workbook)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "إنجليزي",
    pages: 144,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن تمارين وتدريبات شاملة في اللغة الإنجليزية، يطور المهارات الأربع (القراءة والكتابة والاستماع والتحدث)، يركز على موضوعات الحياة اليومية والقضايا المعاصرة، يتضمن تمارين قواعدية ومفردات متنوعة، يعزز التواصل الفعال والتفكير النقدي، يوازي كتاب الطالب النظري.",
    tags: [
      "اللغة الإنجليزية",
      "التمارين",
      "المهارات اللغوية",
      "القراءة والكتابة",
      "الاستماع والتحدث",
      "قواعد اللغة",
      "المفردات",
      "التواصل",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/jyrggfiqedkjict6lvrmc/_-_-_-_English_Workbook_-_-_-_.pdf?rlkey=tjuz9q6z1mgtbefcl5q5lebpv&st=dcp8knrm&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/اللغة الانجليزية English-Work.jpg",
    publishedDate: "2006",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من الأكاديميين والموجهين التربويين في تدريس اللغة الإنجليزية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 148,
    title: "الفيزياء",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "physics",
    subject: "الفيزياء",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 275,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي موضوعات فيزيائية متقدمة تشمل قوانين الأجسام الساكنة والحركات الدورانية والموجات الميكانيكية والصوت والضوء والكهرباء والمغناطيسية، يجمع بين الشرح النظري والتطبيقات العملية، يطور مهارات التفكير الفيزيائي والتحليل العلمي، يعزز القدرة على حل المسائل المعقدة.",
    tags: [
      "الفيزياء",
      "قوانين الحركة",
      "الموجات",
      "الصوت والضوء",
      "الكهرباء",
      "المغناطيسية",
      "الشغل والطاقة",
      "الدوائر الكهربائية",
      "القياس والأخطاء",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/5or38sshp6yfpqhmvy18v/_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=915en4tr6ciiv4w9hvuv5tq9n&st=vz8mu1sr&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الفيزياء.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين في مجال الفيزياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "red"
  },
  {
    id: 149,
    title: "الفيزياء (الأنشطة والتجارب العملية)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "physics",
    subject: "الفيزياء (الأنشطة والتجارب العملية)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 61,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن تجارب وأنشطة عملية تطبيقية تكمل الجانب النظري من كتاب الفيزياء، يركز على التعلم التجريبي والملاحظة المباشرة، يغطي موضوعات الموجات والصوت والضوء والكهرباء والمغناطيسية، يطور المهارات العملية والتفكير العلمي، يعزز الفهم العميق للمفاهيم الفيزيائية.",
    tags: [
      "الفيزياء",
      "التجارب العملية",
      "الأنشطة التعليمية",
      "الموجات الصوتية",
      "الضوء والعدسات",
      "الكهرباء",
      "المغناطيسية",
      "المختبر العلمي",
      "مهارات البحث",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/sl2ijr0m7gupuyqwtelav/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=p09d96hzkcssq1y2bha3sszwm&st=m34ykddl&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الفيزياء ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الخبراء والموجهين التربويين في الفيزياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "red"
  },
  {
    id: 150,
    title: "الكيمياء (الأنشطة والتجارب العملية) - القسم العلمي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "chemistry",
    subject: "الكيمياء (الأنشطة والتجارب العملية) - القسم العلمي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 51,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن تجارب وأنشطة عملية تطبيقية تكمل الجانب النظري من كتاب الكيمياء، يركز على التعلم التجريبي والملاحظة المباشرة، يغطي خواص الفلزات والغازات والأملاح والأحماض والقواعد والمركبات العضوية، يطور المهارات العملية والتفكير العلمي، يعزز الفهم العميق للمفاهيم الكيميائية.",
    tags: [
      "الكيمياء",
      "التجارب العملية",
      "الأنشطة التعليمية",
      "الفلزات",
      "الغازات",
      "الأملاح",
      "الأحماض والقواعس",
      "المركبات العضوية",
      "المختبر العلمي",
      "مهارات البحث",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/dvvul1x85g4h7ya99w1co/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=nnu39rc8sudtlp6vc25tj6527&st=erp18mae&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الكيمياء ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الخبراء والموجهين التربويين في الكيمياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 151,
    title: "الكيمياء - القسم العلمي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "chemistry",
    subject: "الكيمياء - القسم العلمي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 195,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي المفاهيم الأساسية في علم الكيمياء، يتناول عناصر الجدول الدوري من المجموعات الثالثة حتى الثامنة، يشرح سرعة التفاعلات والاتزان الكيميائي والاتزان الأيوني، يركز على الهيدروكربونات الأروماتية والمركبات العضوية الأكسجينية، يجمع بين النظرية والتطبيق، يطور مهارات التحليل والاستنتاج.",
    tags: [
      "الكيمياء",
      "الجدول الدوري",
      "العناصر الكيميائية",
      "التفاعلات الكيميائية",
      "الاتزان الكيميائي",
      "الأحماض والقواعس",
      "المركبات العضوية",
      "الهيدروكربونات",
      "الكيمياء الحديثة",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/56wgl9li7lawoi10gs0y1/_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=rcysafd4zy3u8wivochhbtgv4&st=72we5slw&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الكيمياء.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين في مجال الكيمياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 152,
    title: "الأحياء (الأنشطة والتجارب العملية)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "biology",
    subject: "الأحياء (الأنشطة والتجارب العملية)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 67,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتضمن تجارب وأنشطة عملية تطبيقية تكمل الجانب النظري من كتاب الأحياء، يركز على التعلم التجريبي والملاحظة المباشرة، يغطي الانقسام الخلوي والأنسجة الحيوانية والنباتية والدعامة والحركة والبناء الضوئي والمعادن والصخور، يطور المهارات العملية والتفكير العلمي، يعزز الفهم العميق للمفاهيم البيولوجية.",
    tags: [
      "الأحياء",
      "التجارب العملية",
      "الأنشطة التعليمية",
      "الانقسام الخلوي",
      "الأنسجة",
      "الدعامة والحركة",
      "البناء الضوئي",
      "البيئة والنظم البيئية",
      "الجيولوجيا",
      "المختبر العلمي",
      "مهارات البحث",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/i7cqnv2ta7enwib7repip/_-_-_-_-_-_2017_-_-_-_-_.pdf?rlkey=rns0efclke37twpfwkyjahm83&st=o80z5kol&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/علم الاحياء وعلم الارض ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الخبراء والموجهين التربويين في الأحياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 153,
    title: "الأحياء - القسم العلمي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "biology",
    subject: "الأحياء - القسم العلمي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 179,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي مفاهيم شاملة في علم الأحياء، يتناول أقسام الخلية والانقسام الخلوي والأنسجة النباتية والحيوانية، يشرح الدعامة والحركة والعمليات الحيوية والمناعة والبيئة والجيولوجيا، يجمع بين النظرية والتطبيق، يطور مهارات التحليل والفهم العلمي.",
    tags: [
      "الأحياء",
      "الخلية والانقسام الخلوي",
      "الأنسجة",
      "الدعامة والحركة",
      "العمليات الحيوية",
      "المناعة",
      "البيئة",
      "الأنظمة البيئية",
      "الجيولوجيا",
      "المعادن والصخور",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/z93r2czrr9pe3q9evauip/_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=91u9embcc6wvly4idrfyrbq9z&st=4p3ifw9i&dl=1",
    coverImage: "",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الأحياء - القسم العلمي.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من نخبة الأساتذة والخبراء التربويين في مجال الأحياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 154,
    title: "التاريخ (الجزء الأول)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (الجزء الأول)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يركز على الحضارة العربية الإسلامية من حيث أسسها ومقوماتها وتطورها التاريخي، يتناول التطور عبر العصور (عهد النبوة والخلفاء الراشدين والدولة الأموية والعباسية والفاطمية والسلاجقة والأيوبيين والمماليك)، يغطي القيم الحضارية مثل الشورى والعدالة والمساواة، يطور مهارات التحليل والتفكير النقدي.",
    tags: [
      "التاريخ",
      "الحضارة الإسلامية",
      "التاريخ الإسلامي",
      "الدولة الأموية",
      "الدولة العباسية",
      "الدولة الفاطمية",
      "السلاجقة",
      "الأيوبيون",
      "المماليك",
      "الشورى والديمقراطية",
      "العدالة الاجتماعية",
      "حقوق الإنسان",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/wvp6kbl5ga0o93k1rlji7/_-_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=ui75hkmnnpr5ezj685c8l0xzu&st=ucb3cdho&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/التاريخ الجزء الاول.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والمشايخ والتربويين في مجال التاريخ الإسلامي تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 155,
    title: "التاريخ (الجزء الثاني)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "history",
    subject: "التاريخ (الجزء الثاني)",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 123,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يركز على مكانة اليمن في الحضارة العربية الإسلامية ودور اليمنيين في نشر الإسلام والحضارة، يتناول الدول اليمنية الإسلامية وأعلامها العلماء، يستعرض الحضارات الإسلامية خارج الوطن العربي (فارس وسط آسيا والسند والهند والأناضول والأندلس وإفريقيا)، يشرح النهضة العلمية الإسلامية وتأثيرها على النهضة الأوروبية.",
    tags: [
      "التاريخ",
      "الحضارة الإسلامية",
      "اليمن والحضارة الإسلامية",
      "الدول اليمنية",
      "الحضارة الإسلامية في فارس",
      "الحضارة الإسلامية في الهند",
      "الحضارة الإسلامية في الأناضول",
      "الحضارة الإسلامية في الأندلس",
      "الحضارة الإسلامية في إفريقيا",
      "النهضة العلمية الإسلامية",
      "الحضارات المتعددة",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/j0lazhglsap3z8hcxwsqm/_-_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=18su6es5u6f1gca6fvtswayox&st=m10xrkkn&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/التاريخ الجزء الثاني.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة متخصصة من الأكاديميين والعلماء والمشايخ والموجهين التربويين في الدراسات التاريخية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 156,
    title: "الجغرافيا",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "geography",
    subject: "الجغرافيا",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 195,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يركز على جغرافية اليمن والوطن العربي، يتناول الخصائص الطبيعية والبشرية والاقتصادية، يشمل دراسة الموقع والتضاريس والمناخ والموارد المائية والسكان والتنمية الاجتماعية والموارد الاقتصادية، يغطي القضايا المعاصرة كالمياه والغذاء والفقر والأمية والبطالة، يطور مهارات التحليل الجغرافي والتفكير النقدي.",
    tags: [
      "الجغرافيا",
      "جغرافية اليمن",
      "جغرافية الوطن العربي",
      "الجغرافيا الطبيعية",
      "الجغرافيا البشرية",
      "الموارد الاقتصادية",
      "السكان والتنمية",
      "القضايا المعاصرة",
      "الأمن الغذائي والمائي",
      "التكامل الاقتصادي العربي",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/nz5n2tpbgkqde3tt2w3o0/_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=rfh5m57l3aufvpejykn22n7nm&st=tobqfk98&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/الجغرافيا.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الأكاديميين والموجهين والمشايخ في مجال الجغرافيا تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "lime"
  },
  {
    id: 157,
    title: "علم الاجتماع - القسم الأدبي",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "sociology",
    subject: "علم الاجتماع - القسم الأدبي",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 83,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يقدم أساسيات علم الاجتماع والمفاهيم الاجتماعية الأساسية، يتناول نشأة علم الاجتماع وعلاقته بالعلوم الاجتماعية الأخرى، يسلط الضوء على رواد علم الاجتماع (ابن خلدون وكونت ودوركايم)، يشرح مناهج البحث الاجتماعي وأدواته، يغطي النظم والعلاقات الاجتماعية والتنشئة الاجتماعية والضبط الاجتماعي والتغيير الاجتماعي.",
    tags: [
      "علم الاجتماع",
      "المفاهيم الاجتماعية",
      "مناهج البحث الاجتماعي",
      "رواد علم الاجتماع",
      "النظم الاجتماعية",
      "العلاقات الاجتماعية",
      "التنشئة الاجتماعية",
      "الضبط الاجتماعي",
      "التغيير الاجتماعي",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/t5vgeayabx6vmhoupsat7/_-_-_-_2017_-_-_-_-_-_-_.pdf?rlkey=5rj7057384ehdap3j41y8qbu5&st=0nive190&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/علم الاجتماع.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من الخبراء والعلماء والموجهين التربويين في مجال علم الاجتماع تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "cyan"
  },
  {
    id: 158,
    title: "الحاسوب",
    author: "وزارة التربية والتعليم - اليمن",
    category: "computer",
    subject: "الحاسوب",
    grade: "الصف الثاني الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 92,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي أساسيات الحاسوب والمفاهيم التقنية الأساسية، موجه لطلاب الصف الثاني ثانوي، يدعم التعليم في مجال تكنولوجيا المعلومات والحاسوب.",
    tags: [
      "الحاسوب",
      "تكنولوجيا المعلومات",
      "المهارات الرقمية",
      "المناهج الدراسية اليمنية",
      "الصف الثاني ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/tqpix8qztvmlc1pcvzx7d/_-_-_2017_-_-_-_-_.pdf?rlkey=ts9d12rsg8akg04dve4x0rssg&st=j4dz9iwp&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثاني الثانوي/حاسوب.jpg",
    publishedDate: "-",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن",
    isbn: "-",
    license: "مجاني",
    color: "slate"
  },
  {
    id: 159,
    title: "القرآن الكريم وعلومه",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "quran",
    subject: "القرآن الكريم وعلومه",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 195,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يجمع بين الحفظ والتفسير وعلوم القرآن والتلاوة الصحيحة، يتناول آيات من سورة النور مع دروس تفسيرية عميقة حول القيم الإيمانية والأخلاقية، يغطي علوم القرآن الأساسية (الإعجاز والتفسير وترجمة المعاني)، يشمل تطبيقات عملية للتلاوة من سور متعددة (الأعراف والأنفال والتوبة ويونس وهود).",
    tags: [
      "القرآن الكريم",
      "علوم القرآن",
      "التفسير",
      "التلاوة والتجويد",
      "الحفظ",
      "الإعجاز القرآني",
      "القيم الإيمانية",
      "الدراسات القرآنية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/dcnzhwr64x03mh0xt92a6/_-_-_-_-_2017_-_-_-_.pdf?rlkey=tigd9y67ftkowp5mcs2wg6nrk&st=899vbql8&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/القران الكريم.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من العلماء والمشايخ والموجهين التربويين في مجال القرآن الكريم وعلومه تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "teal"
  },
  {
    id: 160,
    title: "الإيمان",
    author: "وزارة التربية والتعليم - اليمن",
    category: "faith",
    subject: "الإيمان",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 83,
    size: "10 MB",
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي مفاهيم الإيمان والعقيدة الإسلامية الأساسية، موجه لطلاب الصف الثالث ثانوي بالقسمين العلمي والأدبي، يعزز الفهم العميق للمبادئ الإيمانية ويطور الوعي الديني لدى الطلاب.",
    tags: [
      "الإيمان",
      "العقيدة الإسلامية",
      "الدراسات الإسلامية",
      "المفاهيم الدينية",
      "التربية الإيمانية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/jhdlsyreqfrfmfmtett4e/_-_-_2017_-_-_-_.pdf?rlkey=puxk3anv63pn0fdwtqvzhyj7g&st=qm16noof&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الايمان.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة متخصصة من العلماء والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 161,
    title: "الفقه والحديث",
    author: "وزارة التربية والتعليم - اليمن",
    category: "fiqh_hadith",
    subject: "الفقه والحديث",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 193,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يجمع بين الحديث الشريف والفقه الإسلامي، يتناول أحاديث نبوية شريفة حول مواضيع أخلاقية وسلوكية مهمة، يغطي الفقه وأصوله (مقاصد الشريعة والاجتهاد والميراث والقضاء والحدود)، يطور الفهم الديني والشرعي، يعزز القيم الإسلامية والمسؤولية الأخلاقية.",
    tags: [
      "الفقه الإسلامي",
      "الحديث الشريف",
      "أصول الفقه",
      "الشريعة الإسلامية",
      "العقوبات الشرعية",
      "المعاملات الإسلامية",
      "القيم الأخلاقية",
      "التشريع الإسلامي",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/u53uwfooewp81v8b3ftja/_-_-_2018_-_-_-_.pdf?rlkey=6de7prbaputpupap30tqtpchq&st=8p57c9n6&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الحديث والفقه.jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة تربوية متخصصة من العلماء والمشايخ والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 162,
    title: "السيرة النبوية",
    author: "وزارة التربية والتعليم - اليمن",
    category: "seerah",
    subject: "السيرة النبوية",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 83,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يتناول السيرة النبوية الشريفة بأسلوب تربوي وتاريخي متسلسل، يركز على أحداث المرحلة المدنية (صلح الحديبية وفتح مكة والغزوات)، يغطي خطبة حجة الوداع وتعاليمها الجامعة، يستعرض وفاة النبي ﷺ والعلاقات الإسلامية، يقدم نموذج البيت النبوي وأمهات المؤمنين، يطور الوعي الإسلامي والقيم التربوية.",
    tags: [
      "السيرة النبوية",
      "التاريخ الإسلامي",
      "المرحلة المدنية",
      "الغزوات",
      "القيادة النبوية",
      "خطبة الوداع",
      "البيت النبوي",
      "أمهات المؤمنين",
      "القيم الأخلاقية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/7cx26xv5iqiddc7mrcg7z/_-_-_-_2017_-_-_-_.pdf?rlkey=6c469ynx02kknc8s2mmuqf5aw&st=kpm0cj9v&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/السيرة النبوية.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية وتربوية متخصصة من العلماء والمشايخ والموجهين التربويين في مجال السيرة النبوية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 163,
    title: "القراءة",
    author: "وزارة التربية والتعليم - اليمن",
    category: "arabic",
    subject: "القراءة",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 115,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يضم نصوصًا قرآنية وأدبية وثقافية معاصرة متنوعة، يطور مهارات الفهم والتحليل والتذوق القرائي، يتناول موضوعات إيمانية وقيمية واجتماعية، يعزز الفكر النقدي والوعي الثقافي، يربط الطالب بالبيئة اليمنية والقضايا المعاصرة.",
    tags: [
      "القراءة",
      "النصوص الأدبية",
      "النصوص القرآنية",
      "التحليل الأدبي",
      "مهارات القراءة",
      "الثقافة والمعارف",
      "القيم الأخلاقية",
      "الفكر النقدي",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/b8eisouhk0stpl0s8u2u7/_-_-_2017_-_-_-_.pdf?rlkey=t6rj4jp2lenps3c6z0js2dg1b&st=8d5e5b1q&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/القراءة.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية متخصصة من العلماء والموجهين التربويين والخبراء في اللغة والقراءة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 164,
    title: "النحو والصرف",
    author: "وزارة التربية والتعليم - اليمن",
    category: "arabic",
    subject: "النحو والصرف",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 211,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي قواعد النحو والصرف الأساسية والمتقدمة، يتناول المفاعيل بأنواعها والحال والتمييز والمستثنى والعدد، يشمل أساليب بلاغية مثل النداء والندبة والاستغاثة، يركز على النعت والبدل والتوكيد وعطف النسق، يطور مهارات التحليل اللغوي والتطبيق النحوي، يعزز الملكة اللغوية والقدرة على التعبير السليم.",
    tags: [
      "النحو العربي",
      "الصرف",
      "قواعد اللغة العربية",
      "التحليل النحوي",
      "الأساليب البلاغية",
      "المفاعيل",
      "الحال والتمييز",
      "الأدوات النحوية",
      "المعاجم العربية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/ndzpd1u22k2s2810c79yi/_-_-_-_2017_-_-_-_.pdf?rlkey=06wavpeky398ql8drwnujfshk&st=zx1zrsmr&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/النحو والصرف.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية متخصصة من العلماء والموجهين التربويين في مجال اللغة العربية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 165,
    title: "الأدب والنصوص والنقد",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "arabic",
    subject: "الأدب والنصوص والنقد",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 227,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي الأدب العربي في عصوره المختلفة، يتناول نصوصًا شعرية ونثرية مختارة من العصرين المملوكي والعثماني والعصر الحديث، يشمل الأدب اليمني وأهم الاتجاهات الأدبية (الرومانتيكية والواقعية)، يطور مهارات التحليل البلاغي والنقد الأدبي، يعزز القدرات التعبيرية والفهم العميق للنصوص.",
    tags: [
      "الأدب العربي",
      "النصوص الشعرية والنثرية",
      "النقد الأدبي",
      "المدارس الأدبية",
      "البلاغة",
      "الأسلوب الأدبي",
      "الشعر والنثر",
      "القصة والمسرح",
      "المقالة الأدبية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/09umrcjyfydxcrvemy1ys/_-_-_-_-_2017_-_-_-_.pdf?rlkey=b411y27jeo7tnuyq6ec15trl7&st=wvk4xkbj&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الادب والنصوص والنقد.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من الأكاديميين والموجهين التربويين في مجالات الأدب والنصوص والبلاغة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 166,
    title: "الرياضيات (القسم العلمي)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "mathematics",
    subject: "الرياضيات - القسم العلمي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 259,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي مفاهيم رياضية متقدمة للقسم العلمي، يتناول الأعداد المركبة ومبدأ العد والاحتمالات والقطوع المخروطية، يشمل الهندسة الفضائية والتفاضل والتكامل، يطور مهارات التحليل والاستنتاج، يهيئ الطلاب للمرحلة الجامعية والتخصصات العلمية.",
    tags: [
      "الرياضيات",
      "الأعداد المركبة",
      "الاحتمالات",
      "التحليل الرياضي",
      "القطوع المخروطية",
      "الهندسة الفضائية",
      "التفاضل والتكامل",
      "الرياضيات التطبيقية",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/gj15clb878g9p4gkbvyo7/_-_-_-_-_2017_-_-_-_.pdf?rlkey=86qukffj607a5mwvopr98jf70&st=hx8jhx04&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الرياضيات ( القسم العلمي ).jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية متخصصة من التربويين والموجهين ذوي الخبرة في مادة الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 167,
    title: "الرياضيات (التمارين) - القسم العلمي",
    author: "وزارة التربية والتعليم - اليمن",
    category: "mathematics",
    subject: "الرياضيات (التمارين) - القسم العلمي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 83,
    size: undefined,
    downloads: 0,


    description: "كتاب تمارين معتمد يُكمل كتاب الرياضيات للصف الثالث ثانوي القسم العلمي، يتضمن تدريبات منهجية على جميع الموضوعات (الأعداد المركبة، مبدأ العد، القطوع المخروطية، الهندسة الفضائية، الاحتمالات، المشتقات، التكامل)، يطور المهارات التطبيقية والتفكير التحليلي، يعزز الفهم العميق للمفاهيم النظرية.",
    tags: [
      "تمارين الرياضيات",
      "التطبيقات الرياضية",
      "التدريبات التحليلية",
      "الجبر التطبيقي",
      "الهندسة التحليلية",
      "حل المشكلات",
      "المهارات الحسابية",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/6xcjqncirgp7r3692l0bw/_-_-_-_-_2017_-_-_-_.pdf?rlkey=v8wy5eux14fhtbix0fx9p0fyv&st=mm0rvgwy&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الرياضيات ( القسم العلمي التمارين ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة تربوية متخصصة من الأكاديميين والموجهين ذوي الخبرة في مجال الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 168,
    title: "الرياضيات (القسم الأدبي)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "mathematics",
    subject: "الرياضيات - القسم الأدبي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 67,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي المفاهيم الرياضية الأساسية للقسم الأدبي، يتناول مبدأ العد والتباديل والتوافيق، يشمل الإحصاء والارتباط والانحدار، يطرح التكامل غير المحدد والمحدد مع تطبيقاته على المساحات، يطور مهارات التحليل والتفكير المنطقي، يربط الرياضيات بالسياقات الحياتية والعملية.",
    tags: [
      "الرياضيات",
      "مبدأ العد",
      "الإحصاء",
      "التكامل",
      "التحليل الرياضي",
      "العلاقات الإحصائية",
      "حساب المساحات",
      "المهارات الرياضية الأساسية",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/kvp10pok53may8kiv4wyu/_-_-_-_-_2017_-_-_-_.pdf?rlkey=y4htfyqd2k7j2f9rm0x1p2okq&st=7h2scu7y&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الرياضيات ( القسم الادبي ).jpg",
    publishedDate: "2018",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة تربوية متخصصة من التربويين وأساتذة الرياضيات والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 169,
    title: "الرياضيات (التمارين) - القسم الأدبي",
    author: "وزارة التربية والتعليم - اليمن",
    category: "mathematics",
    subject: "الرياضيات (التمارين) - القسم الأدبي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 35,
    size: undefined,
    downloads: 0,


    description: "كتاب تمارين معتمد يُكمل كتاب الرياضيات للصف الثالث ثانوي القسم الأدبي، يتضمن تدريبات منهجية على جميع الموضوعات (مبدأ العد والتباديل والتوافيق، الإحصاء والارتباط والانحدار، التكامل وتطبيقاته)، يطور المهارات التطبيقية والتفكير المنطقي، يعزز الفهم العميق للمفاهيم الرياضية الأساسية.",
    tags: [
      "تمارين الرياضيات",
      "مبدأ العد",
      "الإحصاء التطبيقي",
      "التكامل",
      "التدريبات الرياضية",
      "حل المسائل",
      "المهارات الحسابية",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/vij8z1bzz7ubd7p9j4wv7/_-_-_-_-_2017_-_-_-_.pdf?rlkey=5zm0yv2ctcn69vc8oil8q6w3v&st=0g0ba556&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الرياضيات ( القسم الادبي التمارين ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة تربوية متخصصة من الأكاديميين والموجهين في مجال الرياضيات تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "blue"
  },
  {
    id: 170,
    title: "الكيمياء (القسم العلمي)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "chemistry",
    subject: "الكيمياء - القسم العلمي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 195,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي مفاهيم كيميائية متقدمة للقسم العلمي، يتناول العناصر الانتقالية والطاقة الكيميائية والكهرباء الكيميائية والتفاعلات النووية، يشمل الكيمياء الحيوية والنفط والمعادن والكيمياء البيئية، يطور مهارات التحليل والاستنتاج، يربط النظرية بالتطبيقات الحياتية، يهيئ الطلاب للتخصصات الجامعية العلمية.",
    tags: [
      "الكيمياء",
      "العناصر الانتقالية",
      "الطاقة الكيميائية",
      "الكهرباء الكيميائية",
      "الفيزياء النووية",
      "الكيمياء الحيوية",
      "الكيمياء الصناعية",
      "البيئة والتلوث",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/jffz3niqse7rgzbtccyfh/_-_-_2017_-_-_-_.pdf?rlkey=1gfttzi1b9uyl14su610dwnx8&st=q6k218lc&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الكيمياء.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من الأكاديميين والموجهين التربويين في مجال الكيمياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 171,
    title: "الكيمياء (الأنشطة والتجارب العملية)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "chemistry",
    subject: "الكيمياء (الأنشطة والتجارب العملية)",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 51,
    size: "4 MB",
    downloads: 0,


    description: "كتاب معتمد يتضمن أنشطة وتجارب عملية يدعم كتاب الكيمياء النظري للصف الثالث ثانوي، يوفر تطبيقات عملية لمفاهيم كيميائية متنوعة، يطور المهارات العملية والمخبرية، يعزز الفهم العميق من خلال التجريب والملاحظة المباشرة، يدعم كلا القسمين العلمي والأدبي.",
    tags: [
      "تجارب الكيمياء",
      "الأنشطة العملية",
      "المهارات المخبرية",
      "التعلم التطبيقي",
      "الكيمياء التجريبية",
      "تطبيق المفاهيم النظرية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/c1fo93m7z4qaaa39pfnln/_-_-_-_2017_-_-_-_.pdf?rlkey=665zttnnlicfb5ry9aw0nuahv&st=l0vck153&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الكيمياء ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة متخصصة من المعلمين والموجهين التربويين في مجال العلوم والكيمياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "orange"
  },
  {
    id: 172,
    title: "الأحياء (القسم العلمي)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "biology",
    subject: "الأحياء - القسم العلمي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 227,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي مفاهيم بيولوجية متقدمة للقسم العلمي، يتناول الجهاز العصبي والجهاز الهرموني والتكاثر والوراثة الجزيئية، يشمل التغذية البشرية والقضايا البيئية وتاريخ الأرض، يطور مهارات التحليل والاستنتاج، يربط النظرية بالتطبيقات الحياتية، يهيئ الطلاب للتخصصات الطبية والبيولوجية.",
    tags: [
      "الأحياء",
      "الجهاز العصبي",
      "الجهاز الهرموني",
      "التكاثر",
      "الوراثة",
      "الحمض النووي",
      "التغذية البشرية",
      "البيئة والتلوث",
      "تاريخ الأرض",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/s41c0cv9yrp45czbs9519/_-_-_2017_-_-_-_.pdf?rlkey=bwpcp5w1suazhzihrktda5vl1&st=m397iiyy&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/علم الاحياء وعلم الارض.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من العلماء والموجهين التربويين في مجال الأحياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 173,
    title: "الأحياء (الأنشطة والتجارب العلمية)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "biology",
    subject: "الأحياء (الأنشطة والتجارب العلمية)",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 99,
    size: undefined,
    downloads: 0,


    description: "كتاب معتمد يتضمن أنشطة وتجارب عملية يدعم كتاب الأحياء النظري للصف الثالث ثانوي القسم العلمي، يوفر تطبيقات عملية لمفاهيم حيوية متنوعة (الجهاز العصبي، الوراثة، التكاثر، البيئة)، يطور المهارات العملية والمخبرية، يعزز الفهم العميق من خلال التجريب والملاحظة، يربط الأحياء بالسياقات الحياتية اليمنية.",
    tags: [
      "تجارب الأحياء",
      "الأنشطة العملية",
      "المهارات المخبرية",
      "التعلم التطبيقي",
      "الأحياء التجريبية",
      "الوراثة العملية",
      "البيئة والتلوث",
      "تطبيق المفاهيم النظرية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/0qusq9rg4vco68x02kl15/_-_-_-_2017_-_-_-_.pdf?rlkey=9zyczih56fw8tls051veqkrow&st=deh6o85h&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/علم الاحياء وعلم الارض ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية وتربوية متخصصة من خبراء الأحياء والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 174,
    title: "English Pupil's Book - Third Secondary",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "اللغة الإنجليزية (كتاب الدروس)",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "إنجليزي",
    pages: 219,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يطور المهارات اللغوية الأربع (الاستماع والتحدث والقراءة والكتابة)، يتناول موضوعات متنوعة من وصف الأشياء والبيئة إلى الإعداد المهني والحياة العملية، يدمج المحتوى الثقافي والعلمي والأدبي، يعزز القدرة على التواصل الفعال، يهيئ الطلاب للحياة الجامعية والمهنية.",
    tags: [
      "اللغة الإنجليزية",
      "مهارات لغوية",
      "التواصل والحوار",
      "القراءة والاستيعاب",
      "الكتابة الرسمية",
      "المفردات والقواعد",
      "النصوص الأدبية والعلمية",
      "الإعداد المهني",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/wa35fubgnap3edk7rrh09/_-_-_-_-_-_2006_-_-_-_.pdf?rlkey=t72xwpdkb346ncvywd8i2lp5a&st=kb7e41xj&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/اللغة الانجليزية English-Course.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الأكاديميين والموجهين في مجال اللغة الإنجليزية تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 175,
    title: "English Workbook - Third Secondary",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "english",
    subject: "اللغة الإنجليزية (التمارين - Workbook)",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "إنجليزي",
    pages: 120,
    size: undefined,
    downloads: 0,


    description: "كتاب تمارين معتمد يكمل كتاب الدروس، يتضمن تدريبات مكثفة على المفردات والقواعد النحوية والقراءة والكتابة، يطور المهارات اللغوية الأساسية من خلال أنشطة متنوعة ومتدرجة، يعزز الاستعداد للاختبارات الوزارية، يربط بين المهارات اللغوية المختلفة.",
    tags: [
      "تمارين اللغة الإنجليزية",
      "المفردات والقواعد",
      "القراءة والفهم",
      "الكتابة الإنشائية",
      "التدريبات اللغوية",
      "تمارين القواعد",
      "أسئلة الامتحانات",
      "المهارات اللغوية الأساسية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/ii40tobagljcoeczgglqm/_-_-_-_English_Workbook_-_2006_-_-_-_-_.pdf?rlkey=q4nedbn1e4dii5g6b4vte24zn&st=0u08yn1w&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/اللغة الانجليزية English-Workbook.jpg",
    publishedDate: "2006",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة فرق متخصصة من خبراء اللغة الإنجليزية والموجهين التربويين تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 176,
    title: "التاريخ (القسم الأدبي)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "history",
    subject: "التاريخ - القسم الأدبي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 163,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يغطي التاريخ الحديث والمعاصر، يتناول النهضة الأوروبية والكشوف الجغرافية والثورة الصناعية، يشمل الثورات الكبرى والوحدات القومية والحروب العالمية والمنظمات الدولية، يعزز الوعي بالقضايا العربية المعاصرة، ويطور مهارات التحليل النقدي والفهم العميق.",
    tags: [
      "التاريخ الحديث",
      "التاريخ المعاصر",
      "الثورات التاريخية",
      "الحروب العالمية",
      "الوحدات القومية",
      "المنظمات الدولية",
      "القضايا العربية",
      "التاريخ السياسي",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/iueqhhtjubv3jjn4ip35w/_-_-_2017_-_-_-_.pdf?rlkey=sbvhhvgilat4sjzo2m0itd3e8&st=t7no352d&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/التاريخ.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية وتربوية متخصصة من الأكاديميين والموجهين في مجال التاريخ تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "amber"
  },
  {
    id: 177,
    title: "الجغرافيا (القسم الأدبي)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "geography",
    subject: "الجغرافيا (جغرافية العالم المعاصر)",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 147,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يطور الوعي بالجوانب السياسية والاقتصادية والجغرافية للعالم المعاصر، يتناول الجغرافيا السياسية والتكتلات الاقتصادية الكبرى، يشمل المواصلات والاتصالات العالمية والمبادلات التجارية، يطرح المشكلات العالمية المعاصرة، يعزز التفكير النقدي، يوسع المدارك حول التفاعلات الدولية.",
    tags: [
      "الجغرافيا السياسية",
      "الجغرافيا الاقتصادية",
      "التكتلات الاقتصادية",
      "المواصلات والاتصالات",
      "التبادل التجاري",
      "الموارد الطبيعية",
      "الطاقة والبطالة",
      "العلاقات الدولية",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/cx3okdq3mfv0z69hgbbgd/_-_-_2017_-_-_-_.pdf?rlkey=xno04sthdvrmcfx9m0vakvqoj&st=l8lkvxbj&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الجغرافيا.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة متخصصة من الأكاديميين والموجهين في مجال الجغرافيا تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 178,
    title: "مبادئ علم الخرائط (القسم الأدبي)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "geography",
    subject: "مبادئ علم الخرائط",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 75,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يطور الوعي الجغرافي ومهارات قراءة الخرائط، يتناول مفهوم الخرائط وتطورها والأدوات المستخدمة في إعدادها، يشمل تمثيل البيانات بالرسوم والجداول والرموز الاصطلاحية، يعزز مهارات تحليل البيانات المكانية، يطور التفكير المكاني والتحليلي، يربط بين النظرية والتطبيق.",
    tags: [
      "علم الخرائط",
      "قراءة الخرائط",
      "تمثيل البيانات",
      "الرسوم البيانية",
      "المساقط الخرائطية",
      "مقاييس الرسم",
      "أنواع الخرائط",
      "الجغرافيا المكانية",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/4ob6c1wfxyjecletw292y/_-_-_-_2017_-_-_-_.pdf?rlkey=hd7isoroqjsosb93pj8ghrqyb&st=wthmya4s&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/مبادئ علم الخرائط ( القسم الادبي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة تربوية متخصصة من الخبراء والموجهين في مجال علم الخرائط تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "emerald"
  },
  {
    id: 179,
    title: "مبادئ الفلسفة (القسم الأدبي)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "philosophy",
    subject: "مبادئ الفلسفة",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 99,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يطور التفكير النقدي والفهم العميق للقضايا الفكرية، يتناول مفهوم الفلسفة وأهميتها وعلاقتها بالعلم، يشمل مباحث الفلسفة والأخلاق، يطرح تطور الفكر الفلسفي عبر الحضارات الشرقية واليونانية والإسلامية والأوروبية، يعزز مهارات التحليل والنقاش البنّاء، يربط الفلسفة بحياة الطالب والواقع المعاصر.",
    tags: [
      "الفلسفة",
      "مبادئ الفكر الفلسفي",
      "الفلسفة والعلم",
      "مباحث الفلسفة",
      "علم الأخلاق",
      "تاريخ الفلسفة",
      "الفلسفة الإسلامية",
      "الفلسفة العربية",
      "الفكر المعاصر",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/gxba52obkxuapm0c1l573/_-_-_-_2017_-_-_-_.pdf?rlkey=6hmb3damo5n52vkljlzx6w5mx&st=myq5mjx7&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/مبادى الفلسفه ( القسم الادبي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة تربوية متخصصة من العلماء والموجهين في مجال الفلسفة تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "purple"
  },
  {
    id: 180,
    title: "علم النفس (القسم الأدبي)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "psychology",
    subject: "علم النفس",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 75,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يعرّف الطالب بأساسيات علم النفس وتطبيقاته الحياتية، يتناول مفهوم علم النفس وتطوره ومناهج البحث فيه، يشمل دراسة الشخصية والصحة النفسية والنمو الإنساني، يطرح عمليات التعلم وأنواعه، يطور الفهم العلمي للسلوك الإنساني، يعزز الوعي بالصحة النفسية والتوازن السلوكي.",
    tags: [
      "علم النفس",
      "أساسيات علم النفس",
      "الشخصية",
      "الصحة النفسية",
      "النمو الإنساني",
      "التعلم والعمليات العقلية",
      "السلوك الإنساني",
      "المدارس النفسية",
      "ميادين علم النفس",
      "المناهج الدراسية اليمنية",
      "القسم الأدبي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/tgrozmtz1gdtyzu8ef1bf/_-_-_-_2017_-_-_-_.pdf?rlkey=k0nphc57s7dusl3obps6tyr52&st=eo8545p0&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/علم النفس ( القسم الادبي ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة علمية وتربوية متخصصة من العلماء والموجهين في مجال علم النفس تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 181,
    title: "الفيزياء (القسم العلمي)",
    author: "وزارة التربية والتعليم - اليمن - عدن",
    category: "physics",
    subject: "الفيزياء - القسم العلمي",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 219,
    size: undefined,
    downloads: 0,


    description: "كتاب تعليمي معتمد يطور الفهم العميق للمفاهيم الفيزيائية الحديثة، يتناول كمية التحرك والتيار المتردد والإلكترونيات والأجهزة الإلكترونية، يشمل الفيزياء الذرية والنووية والطاقة الشمسية والفيزياء الكونية، يربط النظرية بالتطبيقات الواقعية، يطور مهارات التفكير العلمي، يهيئ الطلاب للتخصصات الجامعية العلمية والهندسية.",
    tags: [
      "الفيزياء",
      "كمية التحرك",
      "التيار المتردد",
      "الإلكترونيات",
      "الأجهزة الإلكترونية",
      "الفيزياء الذرية",
      "الفيزياء النووية",
      "الطاقة الشمسية",
      "الفيزياء الكونية",
      "المفاهيم الكهرومغناطيسية",
      "المناهج الدراسية اليمنية",
      "القسم العلمي",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/0mhovql1wqmvyn3h7ceha/_-_-_2017_-_-_-_-1.pdf?rlkey=nw6xrk1uya5b2276b0k94alop&st=5r3dprg3&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الفيزياء.jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن - عدن (أُعد بواسطة لجنة علمية متخصصة من الأكاديميين والموجهين التربويين في مجال الفيزياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
  {
    id: 182,
    title: "الفيزياء (الأنشطة والتجارب العملية)",
    author: "وزارة التربية والتعليم - اليمن",
    category: "physics",
    subject: "الفيزياء (الأنشطة والتجارب العملية)",
    grade: "الصف الثالث الثانوي",
    type: "كتاب",
    language: "عربي",
    pages: 35,
    size: "8 MB",
    downloads: 0,


    description: "كتاب معتمد يتضمن أنشطة وتجارب عملية يدعم كتاب الفيزياء النظري للصف الثالث ثانوي، يوفر تطبيقات عملية لمفاهيم فيزيائية متنوعة، يطور المهارات العملية والمخبرية، يعزز الفهم العميق من خلال التجريب والملاحظة المباشرة، يدعم كلا القسمين العلمي والأدبي.",
    tags: [
      "تجارب الفيزياء",
      "الأنشطة العملية",
      "المهارات المخبرية",
      "التعلم التطبيقي",
      "الفيزياء التجريبية",
      "تطبيق المفاهيم النظرية",
      "المناهج الدراسية اليمنية",
      "الصف الثالث ثانوي"
    ],
    fileUrl: "https://www.dropbox.com/scl/fi/n1gknvjetakmc5uzg4848/_-_-_-_2017_-_-_-_-2.pdf?rlkey=sbn7vv9x67wq24rx9dbvpud8z&st=9zkd9tz2&dl=1",
    coverImage: "📖",
    coverImageUrl: "/digital-library/الصف الثالث الثانوي/الفيزياء ( الانشطة والتجارب ).jpg",
    publishedDate: "2017",
    lastUpdated: undefined as any,
    publisher: "وزارة التربية والتعليم - اليمن (أُعد بواسطة لجنة متخصصة من المعلمين والموجهين التربويين في مجال العلوم والفيزياء تحت إشراف الإدارة العامة للمناهج)",
    isbn: "-",
    license: "مجاني",
    color: "indigo"
  },
];

export default function DigitalLibraryPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  // ... (rest of the code remains the same)
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    if (selectedBook) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedBook]);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [activeActionsBookId, setActiveActionsBookId] = useState<number | null>(null);

  // فتح نافذة كتاب معيّن عند الدخول برابط مشاركة يحتوي على ?book=id
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bookIdParam = params.get('book');
      if (bookIdParam) {
        const numericId = Number(bookIdParam);
        if (!Number.isNaN(numericId)) {
          const sharedBook = digitalLibrary.find((b) => b.id === numericId);
          if (sharedBook) {
            setSelectedBook(sharedBook);
          }
        }
      }
    } catch (e) {
      // تجاهل أي أخطاء في قراءة عنوان الرابط
    }
  }, []);

  // إحصائيات سريعة
  const stats = React.useMemo(() => {
    const total = digitalLibrary.length;
    const totalDownloads = digitalLibrary.reduce((sum, book) => sum + book.downloads, 0);
    const totalPages = digitalLibrary.reduce((sum, book) => sum + book.pages, 0);
    
    return { 
      total, 
      totalDownloads, 
      totalPages
    };
  }, []);

  // فلترة الكتب
  const filteredBooks = React.useMemo(() => {
    let currentBooks = [...digitalLibrary];

    if (searchQuery) {
      currentBooks = currentBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      currentBooks = currentBooks.filter(book => book.category === categoryFilter);
    }

    if (gradeFilter !== 'all') {
      currentBooks = currentBooks.filter(book => book.grade === gradeFilter);
    }

    if (typeFilter !== 'all') {
      currentBooks = currentBooks.filter(book => book.type === typeFilter);
    }

    currentBooks.sort((a, b) => {
      const noFiltersActive =
        !searchQuery &&
        categoryFilter === 'all' &&
        gradeFilter === 'all' &&
        typeFilter === 'all';

      // الترتيب الافتراضي: من الصف الأول حتى الثالث الثانوي ثم بالاسم داخل نفس الصف
      if (noFiltersActive) {
        const gradeOrder = [
          'الصف الأول',
          'الصف الثاني',
          'الصف الثالث',
          'الصف الرابع',
          'الصف الخامس',
          'الصف السادس',
          'الصف السابع',
          'الصف الثامن',
          'الصف التاسع',
          'الصف الأول الثانوي',
          'الصف الثاني الثانوي',
          'الصف الثالث الثانوي',
        ];

        const gradeIndex = (grade: string) => {
          const idx = gradeOrder.indexOf(grade);
          return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
        };

        const gA = gradeIndex(a.grade);
        const gB = gradeIndex(b.grade);

        if (gA !== gB) return gA - gB;
        return a.title.localeCompare(b.title);
      }

      // في حال وجود بحث أو فلاتر، استخدم ترتيب أبجدي بالعنوان
      return a.title.localeCompare(b.title);
    });

    return currentBooks;
  }, [searchQuery, categoryFilter, gradeFilter, typeFilter]);

  // الحصول على الفئات والصفوف الفريدة
  const categories = React.useMemo(() => {
    const categoryMap = {
      'mathematics': 'الرياضيات',
      'arabic': 'اللغة العربية',
      'physics': 'الفيزياء',
      'history': 'التاريخ',
      'chemistry': 'الكيمياء',
      'geography': 'الجغرافيا',
      'english': 'اللغة الإنجليزية',
      'biology': 'الأحياء',
      'science': 'العلوم',
      'islamic': 'القرآن الكريم والتربية الإسلامية',
      'social': 'التربية الاجتماعية',
      'national': 'التربية الوطنية',
      'quran': 'القرآن الكريم وعلومه',
      'faith': 'الإيمان',
      'fiqh_hadith': 'الفقه والحديث',
      'seerah': 'السيرة النبوية',
      'sociology': 'علم الاجتماع',
      'computer': 'الحاسوب',
      'philosophy': 'مبادئ الفلسفة',
      'psychology': 'علم النفس'
    };
    return categoryMap;
  }, []);

  const grades = React.useMemo(() => {
    // الصفوف الأساسية من الأول إلى التاسع
    const baseGrades = [
      'الصف الأول',
      'الصف الثاني',
      'الصف الثالث',
      'الصف الرابع',
      'الصف الخامس',
      'الصف السادس',
      'الصف السابع',
      'الصف الثامن',
      'الصف التاسع',
      'الصف الأول الثانوي',
      'الصف الثاني الثانوي',
      'الصف الثالث الثانوي',
    ];

    // الصفوف الموجودة حالياً في بيانات المكتبة (مثل الأول الثانوي، الثاني الثانوي...)
    const dynamicGrades = [...new Set(digitalLibrary.map(book => book.grade))];

    // دمج الجميع مع إزالة التكرار مع الحفاظ على الترتيب (الأساسي أولاً ثم الباقي)
    const allGrades = [...baseGrades, ...dynamicGrades];
    const uniqueGrades = Array.from(new Set(allGrades));

    return uniqueGrades;
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'mathematics': 'bg-blue-600',
      'arabic': 'bg-green-600',
      'physics': 'bg-purple-600',
      'history': 'bg-orange-600',
      'chemistry': 'bg-red-600',
      'geography': 'bg-indigo-600',
      'english': 'bg-yellow-600',
      'biology': 'bg-pink-600',
      'science': 'bg-teal-600',
      'islamic': 'bg-emerald-600',
      'social': 'bg-amber-600',
      'national': 'bg-rose-600',
      'quran': 'bg-teal-600',
      'faith': 'bg-emerald-600',
      'fiqh_hadith': 'bg-emerald-600',
      'seerah': 'bg-emerald-600',
      'sociology': 'bg-cyan-600',
      'computer': 'bg-slate-600',
      'philosophy': 'bg-purple-600',
      'psychology': 'bg-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600';
  };



  const getFileIcon = (type: string) => {
    switch (type) {
      case 'كتاب': return <BookOpen className="w-4 h-4" />;
      case 'فيديو': return <Video className="w-4 h-4" />;
      case 'صورة': return <Image className="w-4 h-4" />;
      case 'صوت': return <Music className="w-4 h-4" />;
      case 'أرشيف': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* أنماط خاصة بسلايدر المكتبة الرقمية */}
      <style>
        {`
        .dl-slider {
          width: 100%;
          height: var(--height);
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
        }
        .dl-slider-list {
          display: flex;
          width: 100%;
          min-width: calc(var(--width) * var(--quantity));
          position: relative;
        }
        .dl-slider-item {
          width: var(--width);
          height: var(--height);
          position: absolute;
          left: 100%;
          animation: dlAutoRun 12s linear infinite;
          transition: filter 0.5s;
          animation-delay: calc((12s / var(--quantity)) * (var(--position) - 1) - 12s) !important;
        }
        .dl-slider-card {
          width: 100%;
          height: 100%;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.5);
          color: white;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
          backdrop-filter: blur(2px);
        }
        .dl-slider-card p {
          margin: 0;
        }
        @keyframes dlAutoRun {
          from { left: 100%; }
          to { left: calc(var(--width) * -1); }
        }
        .dl-slider:hover .dl-slider-item,
        .dl-slider-paused .dl-slider-item {
          animation-play-state: paused !important;
          filter: grayscale(0.6);
        }
        .dl-slider .dl-slider-item:hover {
          filter: grayscale(0);
        }
        `}
      </style>
      <AppHeader />
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Library className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">المكتبة الرقمية</h1>
          </div>
          <p className="text-purple-300 text-xs sm:text-sm md:text-base">مكتبة شاملة للمواد التعليمية والكتب الرقمية</p>
        </div>

        {/* سلايدر أفقي تلقائي لعرض كتب مختارة */}
        <div
          className="mb-4 sm:mb-6"
          onTouchStart={() => setSliderPaused(true)}
          onTouchEnd={() => setSliderPaused(false)}
          onTouchCancel={() => setSliderPaused(false)}
        >
          <div
            className={`dl-slider w-full ${sliderPaused ? 'dl-slider-paused' : ''}`}
            style={{
              '--width': '210px',
              '--height': '120px',
              '--quantity': Math.min(filteredBooks.length, 9) || 1,
            } as React.CSSProperties}
          >
            <div className="dl-slider-list">
              {filteredBooks.slice(0, 9).map((book, index) => (
                <div
                  key={book.id}
                  className="dl-slider-item cursor-pointer"
                  style={{ '--position': index + 1 } as React.CSSProperties}
                  onClick={() => setSelectedBook(book)}
                >
                  <div
                    className="dl-slider-card"
                    style={{
                      background:
                        index % 3 === 0
                          ? 'linear-gradient(to right, #ff7e5f, #feb47b)'
                          : index % 3 === 1
                          ? 'linear-gradient(to right, #6a11cb, #2575fc)'
                          : 'linear-gradient(to right, #00c6ff, #0072ff)',
                    }}
                  >
                    {/* الصف الأول: أيقونة الغلاف + العنوان والمادة */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900/40 rounded-md flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                        {book.coverImage}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="font-semibold text-[11px] sm:text-xs leading-snug line-clamp-2">
                          {book.title}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-100 truncate">
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span className="truncate">{book.subject}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* الصف: نفس ترتيب البطاقة الرئيسية لكن بحجم أصغر */}
                    <div className="flex items-center justify-between text-[10px] bg-slate-900/50 rounded-md px-2 py-1 border border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-slate-100">
                        <GraduationCap className="w-3 h-3 text-indigo-200" />
                        <span>الصف:</span>
                      </div>
                      <span className="text-white font-medium truncate max-w-[90px] text-right">{book.grade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-slate-950/80 border border-slate-700/70 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
          <CardContent className="p-2.5 sm:p-3.5">
            <div className="space-y-2.5 sm:space-y-3.5">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن كتاب أو مؤلف أو موضوع..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);

                    if (!value.trim()) {
                      setSearchSuggestions([]);
                      return;
                    }

                    const lower = value.toLowerCase();
                    const suggestions = digitalLibrary
                      .map((book) => [book.title, book.subject, book.author])
                      .flat()
                      .filter(Boolean)
                      .map((s) => String(s))
                      .filter((s, index, arr) => arr.indexOf(s) === index)
                      // استبعاد أي اقتراح يحتوي على كلمة صنعاء
                      .filter((s) => !s.includes('صنعاء'))
                      .filter((s) => s.toLowerCase().includes(lower))
                      .slice(0, 8);

                    setSearchSuggestions(suggestions);
                  }}
                  onBlur={() => {
                    // إغلاق قائمة الاقتراحات عند الخروج من حقل البحث
                    setTimeout(() => setSearchSuggestions([]), 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      setSearchSuggestions([]);
                    }
                  }}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-full px-9 py-2 text-xs sm:text-sm text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent shadow-[0_8px_25px_rgba(15,23,42,0.7)]"
                />

                {searchSuggestions.length > 0 && (
                  <div className="absolute mt-1 left-0 right-0 z-20 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] max-h-60 overflow-y-auto text-xs sm:text-sm">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSearchSuggestions([]);
                        }}
                        className="w-full text-right px-3 py-1.5 hover:bg-slate-800/80 text-slate-100 truncate"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-[11px] sm:text-xs text-slate-100 focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent appearance-none"
                >
                  <option value="all">جميع المواد</option>
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>

                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-[11px] sm:text-xs text-slate-100 focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent appearance-none"
                >
                  <option value="all">جميع الصفوف</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-[11px] sm:text-xs text-slate-100 focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent appearance-none"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="كتاب">كتاب</option>
                  <option value="فيديو">فيديو</option>
                  <option value="صورة">صورة</option>
                  <option value="صوت">صوت</option>
                  <option value="أرشيف">أرشيف</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setGradeFilter('all');
                    setTypeFilter('all');
                  }}
                  className="bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-600 hover:to-amber-500 text-black font-medium px-3 py-2 rounded-full text-xs sm:text-sm shadow-[0_10px_25px_rgba(248,113,113,0.55)] flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-3 sm:mb-4 text-center">
          <div className="bg-purple-800 bg-opacity-80 border border-purple-600 rounded-lg p-2 sm:p-3">
            <p className="text-purple-300 text-xs sm:text-sm">
              عرض {filteredBooks.length} من أصل {digitalLibrary.length} كتاب
            </p>
          </div>
        </div>

        {/* قائمة الكتب */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">الكتب المتاحة</h2>
            <Badge className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
              {filteredBooks.length}
            </Badge>
          </div>

          {filteredBooks.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-sm border-purple-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد كتب</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على كتب تطابق معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 justify-items-center">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="w-full flex justify-center"
                >
                  {/* تصميم بطاقة يشبه Uiverse card بزوايا متحركة */}
                  <div className="relative w-full max-w-[180px] h-[250px] sm:max-w-[200px] sm:h-[270px] cursor-pointer group">
                    {/* الجسم الرئيسي للبطاقة */}
                    <div className="absolute inset-0 bg-teal-400 rounded-[15px] flex items-stretch justify-stretch overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.55)]">
                      {/* الزاوية العلوية اليمنى */}
                      <div className="pointer-events-none absolute top-0 right-0 w-[35%] h-[35%] bg-sky-300 rounded-tr-[15px] rounded-bl-[100%] transition-all duration-500 ease-out group-hover:w-full group-hover:h-full group-hover:rounded-[15px]" />
                      {/* الزاوية السفلية اليسرى */}
                      <div className="pointer-events-none absolute bottom-0 left-0 w-[35%] h-[35%] bg-sky-200 rounded-bl-[15px] rounded-tr-[100%] transition-all duration-500 ease-out group-hover:w-full group-hover:h-full group-hover:rounded-[15px]" />
                      
                      {/* محتوى البطاقة فوق الطبقات المتحركة */}
                      <div className="relative z-10 w-full h-full rounded-[15px] overflow-hidden">
                        {/* خلفية الصورة تمتد على كامل البطاقة إن وُجدت */}
                        {book.coverImageUrl && (
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="absolute inset-0 w-full h-full object-cover brightness-125 contrast-110 saturate-110"
                          />
                        )}
                        {/* شريط الصف في أعلى يسار البطاقة بتصميم مستوحى من abbas */}
                        <div className="pointer-events-none absolute -top-4 -left-5 w-[110px] h-[110px] overflow-hidden flex items-center justify-center">
                          <div
                            className="flex items-center justify-center w-[150%] h-10 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-[0_5px_10px_rgba(0,0,0,0.55)]"
                            style={{ transform: 'rotate(-45deg) translateY(-16px)' }}
                          >
                            <span className="px-4 text-[13px] sm:text-[14px] font-extrabold text-white text-center tracking-wide">
                              {(() => {
                                const raw = (book.grade || '').trim();
                                if (!raw) return '';

                                const cleaned = raw
                                  .replace(/^الصف\s*/u, '')
                                  .replace(/^صف\s*/u, '')
                                  .replace(/^ف\s*/u, '')
                                  .trim();

                                if (!cleaned) return '';
                                return `الصف ${cleaned}`;
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* شريط الجزء في أسفل يمين البطاقة بنفس ميل الشريط العلوي */}
                        {(() => {
                          const subject = book.subject || '';
                          const match = subject.match(/\(الجزء[^)]*\)/u);
                          if (!match) return null;
                          const partText = match[0].replace(/[()]/g, '').trim();
                          if (!partText) return null;
                          return (
                            <div className="pointer-events-none absolute -bottom-4 -right-5 w-[110px] h-[110px] overflow-hidden flex items-center justify-center">
                              <div
                                className="flex items-center justify-center w-[150%] h-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-[0_5px_10px_rgba(0,0,0,0.55)]"
                                style={{ transform: 'rotate(-45deg) translateY(16px)' }}
                              >
                                <span className="px-4 text-[11px] sm:text-[12px] font-extrabold text-white text-center tracking-wide whitespace-nowrap">
                                  {partText}
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* تراكب داكن خفيف لقراءة النص (بدون ضبابية) */}
                        <div className="relative w-full h-full p-2.5 sm:p-3 flex flex-col bg-slate-950/15">
                          {/* المحتوى العلوي (عنوان + مادة) يأخذ المساحة المتبقية */}
                          <div className="space-y-2 flex-1" />

                          {/* صف الأزرار في أسفل البطاقة (بدون شريط الصف السفلي) */}
                          <div className="flex items-end justify-end gap-1.5 mt-auto pt-1.5">
                            {/* زر إجراءات واحد يفتح 3 أزرار عائمة صغيرة */}
                            <div className="relative flex-shrink-0 flex justify-end">
                              {/* الأزرار العائمة */}
                              <div
                                className={`absolute bottom-9 right-0 flex flex-col gap-1 z-20 transition-all duration-200 origin-bottom ${
                                  activeActionsBookId === book.id
                                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                                    : 'opacity-0 translate-y-1 scale-75 pointer-events-none'
                                }`}
                              >
                                {/* تنزيل */}
                                <Button
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(book.fileUrl, '_blank');
                                  }}
                                  className="w-6 h-6 rounded-full bg-emerald-400 text-black border border-emerald-300 hover:bg-emerald-300 hover:border-emerald-200 shadow-sm flex items-center justify-center transition-transform duration-150 hover:scale-110"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                {/* مشاركة */}
                                <Button
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const baseUrl = window.location.origin || '';
                                    const shareUrl = `${baseUrl}/digital-library?book=${book.id}`;

                                    if (navigator.share) {
                                      navigator
                                        .share({
                                          title: book.title,
                                          text: `📚 كتاب من مكتبة عدن لايف الرقمية:\n${book.title}\nالصف: ${book.grade}`,
                                          url: shareUrl,
                                        })
                                        .catch(() => {});
                                    } else {
                                      window.open(shareUrl, '_blank');
                                    }
                                  }}
                                  className="w-6 h-6 rounded-full bg-sky-500 text-white border border-sky-300 hover:bg-sky-400 hover:border-sky-200 shadow-sm flex items-center justify-center transition-transform duration-150 hover:scale-110"
                                >
                                  <Share2 className="w-3 h-3" />
                                </Button>
                                {/* تفاصيل */}
                                <Button
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBook(book);
                                  }}
                                  className="w-6 h-6 rounded-full bg-slate-900/90 text-slate-50 border border-slate-600 hover:bg-slate-800 hover:border-slate-500 shadow-sm flex items-center justify-center transition-transform duration-150 hover:scale-110"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>

                              {/* الزر الرئيسي الصغير */}
                              <Button
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionsBookId((prev) => (prev === book.id ? null : book.id));
                                }}
                                className="w-7 h-7 rounded-full bg-slate-900/90 border border-slate-600 text-slate-100 hover:bg-slate-800 hover:border-slate-500 flex items-center justify-center transition-transform duration-150 hover:scale-110"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBook(null)}
        >
          <Card
            className="w-full max-w-2xl bg-gray-900 border border-purple-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                  <span className="text-2xl">{selectedBook.coverImage}</span>
                  {selectedBook.title}
                </CardTitle>
                <Button
                  onClick={() => setSelectedBook(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* معلومات أساسية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedBook.size && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-purple-300">حجم الملف</h4>
                    <p className="text-sm text-gray-300">{selectedBook.size}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-purple-300">الناشر</h4>
                  <p className="text-sm text-gray-300">
                    {(() => {
                      const publisher = selectedBook.publisher || '';

                      // توحيد صياغة الناشر لكتب الوزارة التي تذكر عدن وصنعاء معًا
                      if (
                        publisher.includes('وزارة التربية والتعليم') &&
                        publisher.includes('عدن') &&
                        publisher.includes('صنعاء')
                      ) {
                        return 'وزارة التربية والتعليم - عدن';
                      }

                      return publisher;
                    })()}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-purple-300">تاريخ النشر</h4>
                  <p className="text-sm text-gray-300">{selectedBook.publishedDate}</p>
                </div>
                {selectedBook.lastUpdated && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-purple-300">آخر تحديث</h4>
                    <p className="text-sm text-gray-300">{selectedBook.lastUpdated}</p>
                  </div>
                )}
              </div>

              {/* الوصف */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-purple-300">الوصف</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedBook.description}</p>
              </div>

              {/* التصنيفات */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-purple-300">التصنيفات</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.tags.map((tag, index) => (
                    <Badge key={index} className="bg-blue-600 text-white text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    window.open(selectedBook.fileUrl, '_blank');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تحميل الكتاب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
