import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Loader2, Sparkles, KeyRound, Mail, Camera } from "lucide-react";
import { toast } from "sonner";

export default function MockLogin() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Parse state and redirect_uri from the URL search params
  const searchParams = new URLSearchParams(location.search);
  const state = searchParams.get("state") || "";
  
  // Default values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  // If redirect on auth is initialized, display a toast
  useEffect(() => {
    toast.info("Connecting to Secure Identity Gateway...");
  }, []);

  const handlePresetSelect = (preset: "admin" | "user") => {
    if (preset === "admin") {
      setName("Alexander Stone");
      setEmail("admin@evostore.com");
      setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop");
      setRole("admin");
      toast.success("Preset: Administrator Selected");
    } else {
      setName("Sarah Jenkins");
      setEmail("sarah.j@gmail.com");
      setAvatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop");
      setRole("user");
      toast.success("Preset: Standard Customer Selected");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in Name and Email fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mock-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, avatar, role, state }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate authorization code");
      }

      const data = await response.json();
      toast.success("Identity authorized! Redirecting back...");
      setTimeout(() => {
        window.location.href = data.redirectUrl;
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07070a] overflow-hidden px-4 py-24 select-none">
      {/* Background Glowing Ambient Dots */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#6B46C1]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <Card className="border border-white/10 bg-[#0d0d15]/60 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(107,70,193,0.3)] text-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#6B46C1]/20 mb-4">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              EVO Identity Hub
            </CardTitle>
            <CardDescription className="text-white/60 text-sm mt-1">
              Secure Single Sign-On Gateway (Simulation)
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Quick Presets */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-white/50">
                Choose a Preset Profile
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handlePresetSelect("admin")}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#6B46C1]/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#6B46C1]/20 flex items-center justify-center text-[#9F7AEA]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Demo Admin</div>
                      <div className="text-[10px] text-white/50">Full access control</div>
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePresetSelect("user")}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#3B82F6]/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center text-[#60A5FA]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Demo Shopper</div>
                      <div className="text-[10px] text-white/50">Browse & purchase</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <span className="relative bg-[#0d0d15] px-3 text-xs text-white/40 font-semibold uppercase tracking-widest">
                Or Customize Details
              </span>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#6B46C1]" /> Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#6B46C1]/50 focus:ring-1 focus:ring-[#6B46C1]/50 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#6B46C1]" /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#6B46C1]/50 focus:ring-1 focus:ring-[#6B46C1]/50 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#6B46C1]" /> Role
                  </Label>
                  <Select value={role} onValueChange={(val: "user" | "admin") => setRole(val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#6B46C1]/50 focus:ring-1 focus:ring-[#6B46C1]/50 rounded-xl">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f18] border-white/10 text-white">
                      <SelectItem value="user">Standard User</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="avatar" className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#6B46C1]" /> Avatar URL (Optional)
                  </Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#6B46C1]/50 focus:ring-1 focus:ring-[#6B46C1]/50 rounded-xl text-xs truncate"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] hover:from-[#7C50D1] hover:to-[#4C92F7] text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#6B46C1]/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authorizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Authorize & Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
