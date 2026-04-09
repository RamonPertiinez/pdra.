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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Header />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.07),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        <div
          className="absolute right-8 top-40 hidden select-none font-mono-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/30 md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          41°36′18.9″N · 1°48′40.9″E
        </div>
        <div
          className="absolute bottom-32 left-8 hidden select-none font-mono-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/30 md:block"
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
            <h1 className="mt-7 text-[3.2rem] font-normal leading-[0.93] tracking-tight text-foreground md:text-[4rem]">
              Entra al<br />
              <span className="text-muted-foreground">joc.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Accés anticipat per a la comunitat. Deixa les teves dades — si ets aprovat/ada, desbloqueja les 3 pistes del drop.
            </p>
          </FadeUp>

          {/* Mode tabs */}
          <FadeUp delay={0.2}>
            <div className="mt-10 flex gap-6 border-b border-border pb-4">
              {(["request", "login"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setFormMode(m); setLoginError(""); }}
                  className={`font-mono-tech text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                    formMode === m ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
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
                  className="h-13 w-full rounded-2xl border border-border bg-surface/50 px-5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-ring focus:bg-surface"
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
                      className="w-full rounded-2xl border border-border bg-surface/50 px-5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-ring focus:bg-surface"
                      style={{ height: "52px" }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telèfon mòbil"
                      required
                      className="w-full rounded-2xl border border-border bg-surface/50 px-5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-ring focus:bg-surface"
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
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground/50">
              L'accés és manual i selectiu. Rebràs confirmació si ets acceptat/ada.
            </p>
          </FadeUp>
        </div>

        {/* Bottom stats bar */}
        <FadeUp delay={0.4} className="absolute bottom-10 left-0 right-0 px-8">
          <div className="mx-auto flex max-w-md items-center justify-between">
            <div className="text-center">
              <p className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Opening</p>
              <p className="mt-1 font-mono-tech text-xs text-muted-foreground">20 / 05 / 2026</p>
            </div>
            <div className="h-px flex-1 mx-6 bg-border" />
            <div className="text-center">
              <p className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Clues</p>
              <p className="mt-1 font-mono-tech text-xs text-muted-foreground">3</p>
            </div>
            <div className="h-px flex-1 mx-6 bg-border" />
            <div className="text-center">
              <p className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Unitats</p>
              <p className="mt-1 font-mono-tech text-xs text-muted-foreground">50</p>
            </div>
          </div>
        </FadeUp>
      </main>
    </div>
  );
};

export default AccessRequestView;
