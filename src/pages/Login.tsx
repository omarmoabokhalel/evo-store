import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { KeyRound, Mail, Lock, User, ArrowRight, Shield, Home } from "lucide-react";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useLanguageStore } from "@/stores/languageStore";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profile';

  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const { signIn, signUp } = useSupabaseAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with:', formData.email);
        await signIn(formData.email.trim(), formData.password);
        toast.success(isAr ? "مرحباً بك مجدداً في EVO!" : "Welcome back to EVO!");
        navigate(redirectTarget);
      } else {
        console.log('Attempting registration with:', formData.email);
        await signUp(formData.email.trim(), formData.password, formData.name.trim());
        toast.success(isAr ? "تم إنشاء حسابك بنجاح! مرحباً بك" : "Account created successfully!");
        navigate(redirectTarget);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || (isLogin ? (isAr ? "فشل تسجيل الدخول" : "Login failed") : (isAr ? "فشل إنشاء الحساب" : "Registration failed")));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07070a] overflow-hidden px-4 py-12">
      {/* Background Glowing Ambient Dots */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#6B46C1]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[#3B82F6]/10 blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all backdrop-blur-md z-20"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{isAr ? 'الرئيسية' : 'Home'}</span>
      </Link>

      <div className="w-full max-w-md z-10">
        <div className="border border-white/10 bg-[#0d0d15]/80 backdrop-blur-2xl shadow-2xl text-white rounded-3xl p-8 sm:p-10">
          <div className="text-center pb-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#6B46C1]/20 mb-4">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isLogin
                ? (isAr ? "تسجيل الدخول" : "Welcome Back")
                : (isAr ? "إنشاء حساب جديد" : "Create Account")}
            </h1>
            <p className="text-white/60 text-xs sm:text-sm mt-1.5">
              {isLogin
                ? (isAr ? "سجل دخول لمتابعة طلباتك وإعدادات حسابك" : "Sign in to access your EVO account & orders")
                : (isAr ? "انضم لمجتمع EVO Streetwear اليوم" : "Join the EVO Streetwear community today")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-white/80 text-xs font-semibold">
                  {isAr ? "الاسم بالكامل" : "Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    placeholder={isAr ? "عمر محمد" : "Omar Mohamed"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 ps-10 pe-4 py-3 rounded-xl focus:outline-none focus:border-[#6B46C1] text-sm transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-white/80 text-xs font-semibold">
                {isAr ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 ps-10 pe-4 py-3 rounded-xl focus:outline-none focus:border-[#6B46C1] text-sm transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-white/80 text-xs font-semibold">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 ps-10 pe-4 py-3 rounded-xl focus:outline-none focus:border-[#6B46C1] text-sm transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] hover:from-[#7C50D1] hover:to-[#4C92F7] text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#6B46C1]/20 flex items-center justify-center gap-2 text-sm"
              disabled={isLoading}
            >
              {isLoading
                ? (isAr ? "جاري المعالجة..." : "Processing...")
                : isLogin
                ? (isAr ? "تسجيل الدخول" : "Sign In")
                : (isAr ? "إنشاء الحساب" : "Create Account")}
              {!isLoading && <ArrowRight className="w-4 h-4 rtl:rotate-180" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
            >
              {isLogin
                ? (isAr ? "ليس لديك حساب؟ إنشاء حساب جديد" : "Don't have an account? Sign up")
                : (isAr ? "لديك حساب بالفعل؟ تسجيل الدخول" : "Already have an account? Sign in")}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <Link
              to="/admin-login"
              className="flex items-center gap-1.5 hover:text-white/70 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAr ? "دخول لوحة التحكم (Admin)" : "Admin Access"}</span>
            </Link>
            <Link
              to="/terms"
              className="hover:text-white/70 transition-colors"
            >
              {isAr ? "الشروط والخصوصية" : "Terms & Privacy"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
