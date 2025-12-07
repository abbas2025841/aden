// مثال مصادقة الهاتف - عدن لايف
// Phone Authentication Example for Aden Live App

import { supabase } from './lib/supabase';

class PhoneAuth {
    constructor() {
        this.phoneNumber = '';
        this.verificationCode = '';
    }

    // إرسال رمز التحقق للهاتف
    async sendVerificationCode(phoneNumber) {
        try {
            console.log('📱 إرسال رمز التحقق إلى:', phoneNumber);
            
            const { data, error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber,
                options: {
                    // تخصيص الرسالة
                    channel: 'sms', // أو 'whatsapp'
                    // رسالة مخصصة
                    message: `رمز التحقق لتطبيق عدن لايف: {{ .Code }}`
                }
            });

            if (error) {
                console.error('❌ خطأ في إرسال الرمز:', error.message);
                return { success: false, error: error.message };
            }

            console.log('✅ تم إرسال رمز التحقق بنجاح');
            this.phoneNumber = phoneNumber;
            return { success: true, data };
            
        } catch (err) {
            console.error('❌ خطأ غير متوقع:', err.message);
            return { success: false, error: err.message };
        }
    }

    // التحقق من الرمز
    async verifyCode(phoneNumber, code) {
        try {
            console.log('🔐 التحقق من الرمز:', code);
            
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token: code,
                type: 'sms'
            });

            if (error) {
                console.error('❌ خطأ في التحقق:', error.message);
                return { success: false, error: error.message };
            }

            console.log('✅ تم التحقق بنجاح:', data.user);
            
            // حفظ بيانات المستخدم في جدول users
            await this.saveUserToDatabase(data.user);
            
            return { success: true, user: data.user };
            
        } catch (err) {
            console.error('❌ خطأ غير متوقع:', err.message);
            return { success: false, error: err.message };
        }
    }

    // حفظ المستخدم في قاعدة البيانات
    async saveUserToDatabase(user) {
        try {
            const { data, error } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    phone: user.phone,
                    email: user.email,
                    name: user.user_metadata?.name || 'مستخدم جديد',
                    avatar: user.user_metadata?.avatar_url,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('❌ خطأ في حفظ المستخدم:', error.message);
            } else {
                console.log('✅ تم حفظ المستخدم في قاعدة البيانات');
            }
        } catch (err) {
            console.error('❌ خطأ غير متوقع في حفظ المستخدم:', err.message);
        }
    }

    // تسجيل الخروج
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('❌ خطأ في تسجيل الخروج:', error.message);
                return { success: false, error: error.message };
            }

            console.log('✅ تم تسجيل الخروج بنجاح');
            return { success: true };
            
        } catch (err) {
            console.error('❌ خطأ غير متوقع في تسجيل الخروج:', err.message);
            return { success: false, error: err.message };
        }
    }

    // الحصول على المستخدم الحالي
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('❌ خطأ في جلب المستخدم:', error.message);
                return { success: false, error: error.message };
            }

            return { success: true, user };
            
        } catch (err) {
            console.error('❌ خطأ غير متوقع في جلب المستخدم:', err.message);
            return { success: false, error: err.message };
        }
    }

    // تحديث بيانات المستخدم
    async updateUserProfile(updates) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: updates
            });

            if (error) {
                console.error('❌ خطأ في تحديث الملف الشخصي:', error.message);
                return { success: false, error: error.message };
            }

            console.log('✅ تم تحديث الملف الشخصي بنجاح');
            return { success: true, user: data.user };
            
        } catch (err) {
            console.error('❌ خطأ غير متوقع في تحديث الملف الشخصي:', err.message);
            return { success: false, error: err.message };
        }
    }
}

// مثال الاستخدام
const phoneAuth = new PhoneAuth();

// إرسال رمز التحقق
async function sendCode() {
    const phoneNumber = '+967777123456'; // رقم الهاتف اليمني
    const result = await phoneAuth.sendVerificationCode(phoneNumber);
    
    if (result.success) {
        console.log('تم إرسال الرمز بنجاح');
        // عرض واجهة إدخال الرمز
    } else {
        console.error('فشل في إرسال الرمز:', result.error);
    }
}

// التحقق من الرمز
async function verifyCode() {
    const phoneNumber = '+967777123456';
    const code = '123456'; // الرمز المُدخل من المستخدم
    
    const result = await phoneAuth.verifyCode(phoneNumber, code);
    
    if (result.success) {
        console.log('تم تسجيل الدخول بنجاح:', result.user);
        // توجيه المستخدم للصفحة الرئيسية
    } else {
        console.error('فشل في التحقق:', result.error);
    }
}

// تصدير الكلاس للاستخدام
export default PhoneAuth;
export { phoneAuth };
