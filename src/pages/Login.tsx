import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { KeyRound, Mail, Lock, User, ArrowRight, Shield } from "lucide-react";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
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
        await signIn(formData.email, formData.password);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        console.log('Attempting registration with:', formData.email);
        await signUp(formData.email, formData.password, formData.name);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07070a] overflow-hidden px-4">
      {/* Background Glowing Ambient Dots */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#6B46C1]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[#3B82F6]/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="border border-white/10 bg-[#0d0d15]/60 backdrop-blur-xl shadow-2xl text-white rounded-2xl p-8">
          <div className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#6B46C1]/20 mb-4">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {isLogin ? "Sign in to access your EVO Store account" : "Join EVO Store today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-white/80 text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-10 py-3 rounded-xl focus:outline-none focus:border-[#6B46C1]"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white/80 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-10 py-3 rounded-xl focus:outline-none focus:border-[#6B46C1]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-white/80 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-10 py-3 rounded-xl focus:outline-none focus:border-[#6B46C1]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] hover:from-[#7C50D1] hover:to-[#4C92F7] text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#6B46C1]/20 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              to="/admin-login"
              className="flex items-center justify-center gap-2 text-white/40 hover:text-white/60 text-xs transition-colors"
            >
              <Shield className="w-3 h-3" />
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
