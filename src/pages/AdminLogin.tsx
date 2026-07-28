import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, isAdmin } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Admin login attempt:', formData.email);
      
      // Check admin code (hardcoded for security)
      if (formData.adminCode !== "EVO") {
        toast.error("Invalid admin code");
        setIsLoading(false);
        return;
      }

      await signIn(formData.email, formData.password);
      
      console.log('Sign in successful, checking admin role...');
      
      // Wait a moment for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user has admin role
      if (!isAdmin) {
        toast.error("This account does not have admin privileges");
        setIsLoading(false);
        return;
      }

      toast.success("Admin access granted");
      navigate("/admin");
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error(error.message || "Admin login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07070a] overflow-hidden px-4">
      {/* Background Glowing Ambient Dots */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#FF2A2A]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[#FBBF24]/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="border border-red-500/20 bg-[#0d0d15]/60 backdrop-blur-xl shadow-2xl text-white rounded-2xl p-8">
          <div className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2A2A] to-[#FBBF24] flex items-center justify-center shadow-lg shadow-[#FF2A2A]/20 mb-4">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Admin Access
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Restricted access for authorized personnel only
            </p>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300">
                Admin access requires a valid admin code. Contact the system administrator for access.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-white/80 text-sm">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@evostore.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-10 py-3 rounded-xl focus:outline-none focus:border-[#FF2A2A]"
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
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-10 py-3 rounded-xl focus:outline-none focus:border-[#FF2A2A]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="adminCode" className="text-white/80 text-sm">Admin Code</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  id="adminCode"
                  type="password"
                  placeholder="Enter admin code"
                  value={formData.adminCode}
                  onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-10 py-3 rounded-xl focus:outline-none focus:border-[#FF2A2A]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF2A2A] to-[#FBBF24] hover:from-[#FF3A3A] hover:to-[#FFCF24] text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#FF2A2A]/20 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-white/40 hover:text-white/60 text-sm transition-colors"
            >
              ← Back to regular login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
