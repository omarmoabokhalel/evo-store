import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function getMockAuthUrl() {
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  return `/mock-login?state=${state}`;
}

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#07070a] overflow-hidden px-4">
      {/* Background Glowing Ambient Dots */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#6B46C1]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[#3B82F6]/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="border border-white/10 bg-[#0d0d15]/60 backdrop-blur-xl shadow-2xl text-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#6B46C1]/20 mb-4">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Access Your Account
            </CardTitle>
            <CardDescription className="text-white/60 text-sm mt-1">
              Select your authentication provider to proceed to EVO Store
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] hover:from-[#7C50D1] hover:to-[#4C92F7] text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#6B46C1]/20 flex items-center justify-center gap-2"
              size="lg"
              onClick={() => {
                window.location.href = getMockAuthUrl();
              }}
            >
              <Sparkles className="w-4 h-4" />
              Sign in with External Auth
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
