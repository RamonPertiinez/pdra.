import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";

const easing = [0.2, 0, 0, 1] as const;

const AccessPage = () => {
  const { state, requestAccess, login, approveAccess } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"request" | "login">(
    state.user.accessStatus === "none" ? "request" : "login"
  );

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      requestAccess(email);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      // Auto-approve for demo
      approveAccess();
      navigate("/drop/montserrat");
    }
  };

  const isRequested = state.user.accessStatus === "requested";
  const isApproved = state.user.accessStatus === "approved";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          className="w-full max-w-sm"
        >
          {isApproved ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">Access Granted</p>
              <p className="text-foreground text-lg">Welcome back.</p>
              <p className="text-stone text-sm mt-2">You have early access to all drops.</p>
              <Button
                variant="pdra"
                size="lg"
                className="mt-8 w-full"
                onClick={() => navigate("/drop/montserrat")}
              >
                Enter Drop
              </Button>
            </div>
          ) : isRequested ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">Requested</p>
              <p className="text-foreground text-lg text-balance">Your request is being reviewed.</p>
              <p className="text-stone text-sm mt-2">We'll reach out when your access is ready.</p>
              <div className="mt-8 h-px bg-foreground/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-foreground/30"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 3, ease: easing }}
                />
              </div>
              <button
                onClick={() => {
                  approveAccess();
                }}
                className="mt-6 text-xs text-stone/50 hover:text-stone transition-pdra"
              >
                (Simulate approval)
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-6 mb-10 justify-center">
                <button
                  onClick={() => setMode("request")}
                  className={`text-xs uppercase tracking-[0.15em] transition-pdra ${
                    mode === "request" ? "text-foreground" : "text-stone"
                  }`}
                >
                  Request Access
                </button>
                <button
                  onClick={() => setMode("login")}
                  className={`text-xs uppercase tracking-[0.15em] transition-pdra ${
                    mode === "login" ? "text-foreground" : "text-stone"
                  }`}
                >
                  Login
                </button>
              </div>

              <form onSubmit={mode === "request" ? handleRequest : handleLogin} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "request" ? "your@email.com" : "your@email.com"}
                  required
                  className="w-full h-12 px-4 bg-transparent text-foreground text-sm rounded-[4px] shadow-inner-border placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                />
                <Button variant="pdra" size="lg" type="submit" className="w-full">
                  {mode === "request" ? "Request Access" : "Enter"}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AccessPage;
