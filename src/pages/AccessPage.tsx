import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

const easing = [0.2, 0, 0, 1] as const;

const AccessPage = () => {
  const { state, requestAccess, login, approveAccess } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"request" | "login">(
    state.user.accessStatus === "none" ? "request" : "login"
  );

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) requestAccess(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
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
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">{t("access_granted")}</p>
              <p className="text-foreground text-lg">{t("access_welcome")}</p>
              <p className="text-stone text-sm mt-2">{t("access_early")}</p>
              <Button
                variant="pdra"
                size="lg"
                className="mt-8 w-full"
                onClick={() => navigate("/drop/montserrat")}
              >
                {t("access_enter")}
              </Button>
            </div>
          ) : isRequested ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">{t("access_requested")}</p>
              <p className="text-foreground text-lg text-balance">{t("access_reviewing")}</p>
              <p className="text-stone text-sm mt-2">{t("access_reach_out")}</p>
              <div className="mt-8 h-px bg-foreground/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-foreground/30"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 3, ease: easing }}
                />
              </div>
              <button
                onClick={() => approveAccess()}
                className="mt-6 text-xs text-stone/50 hover:text-stone transition-pdra"
              >
                {t("access_simulate")}
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-6 mb-10 justify-center">
                <button
                  onClick={() => setMode("request")}
                  className={`text-xs uppercase tracking-[0.15em] transition-pdra ${
                    mode === "request" ? "text-foreground" : "text-stone"
                  }`}
                >
                  {t("access_request")}
                </button>
                <button
                  onClick={() => setMode("login")}
                  className={`text-xs uppercase tracking-[0.15em] transition-pdra ${
                    mode === "login" ? "text-foreground" : "text-stone"
                  }`}
                >
                  {t("access_login")}
                </button>
              </div>

              <form onSubmit={mode === "request" ? handleRequest : handleLogin} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  required
                  className="w-full h-12 px-4 bg-transparent text-foreground text-sm rounded-[4px] shadow-inner-border placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                />
                <Button variant="pdra" size="lg" type="submit" className="w-full">
                  {mode === "request" ? t("access_request") : t("access_enter_btn")}
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
