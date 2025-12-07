// نظام المصادقة لتطبيق عدن لايف
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator' | 'guest';
  preferences: UserPreferences;
  profile: UserProfile;
  createdAt: Date;
  lastLogin?: Date;
  isGuest?: boolean;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showProfile: boolean;
    showLocation: boolean;
    showContact: boolean;
  };
}

export interface UserProfile {
  bio?: string;
  location?: string;
  interests: string[];
  skills: string[];
  experience: string;
  education: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// بيانات المستخدمين الافتراضية
export const defaultUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد العدني',
    email: 'ahmed@aden.com',
    phone: '+967-123456789',
    avatar: '/avatars/ahmed.jpg',
    role: 'admin',
    preferences: {
      language: 'ar',
      theme: 'auto',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        showProfile: true,
        showLocation: true,
        showContact: true
      }
    },
    profile: {
      bio: 'مطور تطبيقات ومهتم بتطوير المجتمع العدني',
      location: 'عدن، اليمن',
      interests: ['التطوير', 'التكنولوجيا', 'المجتمع'],
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      experience: '5 سنوات في تطوير التطبيقات',
      education: 'بكالوريوس علوم الحاسوب - جامعة عدن',
      socialLinks: {
        facebook: 'https://facebook.com/ahmed.adeni',
        twitter: 'https://twitter.com/ahmed_adeni'
      }
    },
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'فاطمة علي السعيد',
    email: 'fatima@aden.com',
    phone: '+967-987654321',
    avatar: '/avatars/fatima.jpg',
    role: 'user',
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        sms: true
      },
      privacy: {
        showProfile: true,
        showLocation: false,
        showContact: false
      }
    },
    profile: {
      bio: 'طالبة طب ومتطوعة في الخدمات الصحية',
      location: 'كريتر، عدن',
      interests: ['الطب', 'الصحة', 'التطوع'],
      skills: ['الطب', 'الإسعافات الأولية', 'التمريض'],
      experience: 'طالبة سنة ثالثة طب',
      education: 'كلية الطب - جامعة عدن',
      socialLinks: {
        instagram: 'https://instagram.com/fatima.medical'
      }
    },
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date()
  },
  {
    id: '3',
    name: 'محمد سالم البكري',
    email: 'mohammed@aden.com',
    phone: '+967-555666777',
    avatar: '/avatars/mohammed.jpg',
    role: 'moderator',
    preferences: {
      language: 'ar',
      theme: 'dark',
      notifications: {
        email: false,
        push: true,
        sms: false
      },
      privacy: {
        showProfile: true,
        showLocation: true,
        showContact: true
      }
    },
    profile: {
      bio: 'مهندس مدني ومطور عقاري في عدن',
      location: 'المنصورة، عدن',
      interests: ['الهندسة', 'العقارات', 'التطوير'],
      skills: ['الهندسة المدنية', 'إدارة المشاريع', 'التصميم'],
      experience: '8 سنوات في الهندسة المدنية',
      education: 'بكالوريوس هندسة مدنية - جامعة عدن',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mohammed-bakri'
      }
    },
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date()
  }
];

// محاكاة قاعدة البيانات المحلية
class AuthService {
  private users: User[] = [...defaultUsers];
  private currentUser: User | null = null;

  // تسجيل الدخول بالبريد الإلكتروني
  async login(email: string, password: string): Promise<User> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }
    
    // في التطبيق الحقيقي، يجب التحقق من كلمة المرور
    // هنا نتحقق من أن كلمة المرور ليست فارغة
    if (!password || password.length < 6) {
      throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }
    
    this.currentUser = user;
    user.lastLogin = new Date();
    
    // حفظ في localStorage
    localStorage.setItem('aden_user', JSON.stringify(user));
    
    return user;
  }

  // تسجيل الدخول برقم الهاتف
  async loginWithPhone(phone: string, password: string): Promise<User> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // تنظيف رقم الهاتف من المسافات والرموز
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    const user = this.users.find(u => {
      if (!u.phone) return false;
      const userCleanPhone = u.phone.replace(/[\s\-\(\)]/g, '');
      return userCleanPhone === cleanPhone;
    });
    
    if (!user) {
      throw new Error('رقم الهاتف غير مسجل');
    }
    
    // في التطبيق الحقيقي، يجب التحقق من كلمة المرور
    // هنا نتحقق من أن كلمة المرور ليست فارغة
    if (!password || password.length < 6) {
      throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }
    
    this.currentUser = user;
    user.lastLogin = new Date();
    
    // حفظ في localStorage
    localStorage.setItem('aden_user', JSON.stringify(user));
    
    return user;
  }

  // تسجيل الخروج
  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('aden_user');
  }

  // التسجيل
  async register(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // التحقق من وجود المستخدم
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    localStorage.setItem('aden_user', JSON.stringify(newUser));
    
    return newUser;
  }

  // الحصول على المستخدم الحالي
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // محاولة استرجاع من localStorage
    const stored = localStorage.getItem('aden_user') || localStorage.getItem('user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem('aden_user');
        localStorage.removeItem('user');
      }
    }
    
    return null;
  }

  // تسجيل الدخول كزائر
  async loginAsGuest(): Promise<User> {
    const guestUser: User = {
      id: 'guest',
      name: 'زائر',
      email: 'guest@aden.com',
      role: 'guest',
      avatar: null,
      isGuest: true,
      preferences: {
        language: 'ar',
        theme: 'auto',
        notifications: {
          email: false,
          push: false,
          sms: false
        },
        privacy: {
          showProfile: false,
          showLocation: false,
          showContact: false
        }
      },
      profile: {
        bio: 'مستخدم زائر',
        location: 'عدن، اليمن',
        interests: [],
        skills: [],
        experience: '',
        education: '',
        socialLinks: {}
      },
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.currentUser = guestUser;
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('isGuest', 'true');
    
    return guestUser;
  }

  // تحديث الملف الشخصي
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }
    
    user.profile = { ...user.profile, ...updates };
    
    if (this.currentUser?.id === userId) {
      this.currentUser = user;
      localStorage.setItem('aden_user', JSON.stringify(user));
    }
    
    return user;
  }

  // تحديث التفضيلات
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }
    
    user.preferences = { ...user.preferences, ...preferences };
    
    if (this.currentUser?.id === userId) {
      this.currentUser = user;
      localStorage.setItem('aden_user', JSON.stringify(user));
    }
    
    return user;
  }

  // التحقق من حالة المصادقة
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // الحصول على جميع المستخدمين (للمشرفين)
  getAllUsers(): User[] {
    return [...this.users];
  }
}

export const authService = new AuthService();
