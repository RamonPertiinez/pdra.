import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { FadeUp, Tag, ease } from "./shared";

const AccessRequestView = () => {
  const { state, requestAccess, login } = useApp();

  const [formMode, setFormMode] = useState<"request" | "login">("request");
  const [email, setEmail] = useState(state.user.email ?? "");
  const [country, setCountry] = useState(state.user.country ?? "");
  const [phone, setPhone] = useState(state.user.phone ?? "");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !country || !phone) return;
    setSubmitting(true);
    await requestAccess({ email, country, phone });
    setSubmitting(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setLoginError("");
    const found = await login(email);
    if (!found) setLoginError("No s'ha trobat cap sol·licitud amb aquest email.");
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-white">
      <Header />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,124,74,0.07),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div
          className="absolute right-8 top-40 hidden select-none font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/10 md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          41°36′18.9″N · 1°48′40.9″E
        </div>
        <div
          className="absolute bottom-32 left-8 hidden select-none font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/10 md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          Drop 001 · 2026 · Montserrat
        </div>
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div className="w-full max-w-md">

          <FadeUp delay={0}>
            <Tag>Early Access · Drop 001</Tag>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-7 text-[3.2rem] font-normal leading-[0.93] tracking-tight text-white md:text-[4rem]">
              Entra al<br />
              <span className="text-white/40">joc.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mt-6 text-sm leading-relaxed text-white/48">
              Accés anticipat per a la comunitat. Deixa les teves dades — si ets aprovat/ada, desbloqueja les 3 pistes del drop.
            </p>
          </FadeUp>

          {/* Mode tabs */}
          <FadeUp delay={0.2}>
            <div className="mt-10 flex gap-6 border-b border-white/8 pb-4">
              {(["request", "login"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setFormMode(m); setLoginError(""); }}
                  className={`font-mono-tech text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                    formMode === m ? "text-white" : "text-white/28 hover:text-white/54"
                  }`}
                >
                  {m === "request" ? "Sol·licitar accés" : "Ja tinc accés"}
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Form */}
          <FadeUp delay={0.26}>
            <AnimatePresence mode="wait">
              <motion.form
                key={formMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease }}
                onSubmit={formMode === "request" ? handleRequest : handleLogin}
                className="mt-7 space-y-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="El teu email"
                  required
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/24 outline-none transition-all focus:border-white/20 focus:bg-white/[0.06]"
                  style={{ height: "52px" }}
                />

                {formMode === "request" && (
                  <>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="País de procedència"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/24 outline-none transition-all focus:border-white/20 focus:bg-white/[0.06]"
                      style={{ height: "52px" }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telèfon mòbil"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/24 outline-none transition-all focus:border-white/20 focus:bg-white/[0.06]"
                      style={{ height: "52px" }}
                    />
                  </>
                )}

                {loginError && (
                  <p className="text-xs text-red-400/80">{loginError}</p>
                )}

                <Button
                  variant="pdra"
                  size="lg"
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full"
                >
                  {submitting
                    ? "..."
                    : formMode === "request"
                    ? "Sol·licitar accés"
                    : "Entrar"}
                </Button>
              </motion.form>
            </AnimatePresence>
          </FadeUp>

          <FadeUp delay={0.34}>
            <p className="mt-6 text-xs leading-relaxed text-white/22">
              L'accés és manual i selectiu. Rebràs confirmació si ets acceptat/ada.
            </p>
          </FadeUp>
        </div>

        {/* Bottom stats bar */}
        <FadeUp delay={0.4} className="absolute bottom-10 left-0 right-0 px-8">
          <div className="mx-auto flex max-w-md items-center justify-between">
            <div className="text-center">
              <p className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-white/24">Opening</p>
              <p className="mt-1 font-mono-tech text-xs text-white/50">20 / 05 / 2026</p>
            </div>
            <div className="h-px flex-1 mx-6 bg-white/8" />
            <div className="text-center">
              <p className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-white/24">Clues</p>
              <p className="mt-1 font-mono-tech text-xs text-white/50">3</p>
            </div>
            <div className="h-px flex-1 mx-6 bg-white/8" />
            <div className="text-center">
              <p className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-white/24">Unitats</p>
              <p className="mt-1 font-mono-tech text-xs text-white/50">50</p>
            </div>
          </div>
        </FadeUp>
      </main>
    </div>
  );
};

export default AccessRequestView;
