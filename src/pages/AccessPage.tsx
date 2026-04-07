import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

const ease = [0.2, 0, 0, 1] as const;

// ── Micro-components ───────────────────────────────────────────────
const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.75, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/44">
    {children}
  </span>
);

const LockIcon = ({ unlocked }: { unlocked: boolean }) => (
  <motion.svg
    key={unlocked ? "open" : "closed"}
    initial={{ scale: 0.7, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.25, ease }}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    {unlocked ? (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    ) : (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    )}
  </motion.svg>
);

// ── Main component ─────────────────────────────────────────────────
const AccessPage = () => {
  const { state, requestAccess, login, logout, unlockClue, allCluesUnlocked } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formMode, setFormMode] = useState<"request" | "login">("request");
  const [email, setEmail] = useState(state.user.email ?? "");
  const [country, setCountry] = useState(state.user.country ?? "");
  const [phone, setPhone] = useState(state.user.phone ?? "");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [activeClueId, setActiveClueId] = useState(1);
  const [passwords, setPasswords] = useState<Record<number, string>>({ 1: "", 2: "", 3: "" });
  const [feedback, setFeedback] = useState<Record<number | string, string>>({});
  const [shakeClue, setShakeClue] = useState<number | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<number | null>(null);

  const clues = useMemo(
    () => [
      {
        id: 1,
        category: t("clue_category_1"),
        title: t("clue_1_title"),
        teaser: t("clue_1_teaser"),
        reveal: t("clue_1_reveal"),
        hint: t("clue_password_hint"),
        fragments: [t("clue_1_fragment_1"), t("clue_1_fragment_2"), t("clue_1_fragment_3")],
        panelTitle: t("clue_1_panel_title"),
        panelBody: t("clue_1_panel_body"),
        panelSignal: `41°36'18.9"N 1°48'40.9"E`,
        accent: "rgba(49,68,87,0.6)",
      },
      {
        id: 2,
        category: t("clue_category_2"),
        title: t("clue_2_title"),
        teaser: t("clue_2_teaser"),
        reveal: t("clue_2_reveal"),
        hint: t("clue_password_hint_2"),
        fragments: [t("clue_2_fragment_1"), t("clue_2_fragment_2"), t("clue_2_fragment_3")],
        panelTitle: t("clue_2_panel_title"),
        panelBody: t("clue_2_panel_body"),
        panelSignal: t("clue_2_panel_signal"),
        accent: "rgba(94,60,37,0.6)",
      },
      {
        id: 3,
        category: t("clue_category_3"),
        title: t("clue_3_title"),
        teaser: t("clue_3_teaser"),
        reveal: t("clue_3_reveal"),
        hint: t("clue_password_hint_3"),
        fragments: [t("clue_3_fragment_1"), t("clue_3_fragment_2"), t("clue_3_fragment_3")],
        panelTitle: t("clue_3_panel_title"),
        panelBody: t("clue_3_panel_body"),
        panelSignal: t("clue_3_panel_signal"),
        accent: "rgba(255,255,255,0.04)",
      },
    ],
    [t]
  );

  const activeClue = clues.find((c) => c.id === activeClueId) ?? clues[0];
  const activeUnlocked = state.unlockedClues.includes(activeClue.id);
  const accessStatus = state.user.accessStatus;
  const isApproved = accessStatus === "approved";

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

  const handleUnlock = async (clueId: number) => {
    const result = await unlockClue(clueId, passwords[clueId] || "");
    if (!result.success) {
      setShakeClue(clueId);
      setTimeout(() => setShakeClue(null), 600);
      setFeedback((p) => ({ ...p, [clueId]: t("clue_password_error") }));
      return;
    }
    setJustUnlocked(clueId);
    setTimeout(() => setJustUnlocked(null), 1400);
    setFeedback((p) => ({
      ...p,
      [clueId]:
        clueId === 1 && result.rewardCode
          ? `Pista validada. El teu codi és ${result.rewardCode}.`
          : t("clue_unlocked_success"),
    }));
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0a09]">
        <motion.span
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono-tech text-[11px] uppercase tracking-[0.3em] text-white/30"
        >
          pdra.
        </motion.span>
      </div>
    );
  }

  // ── Pàgina de sol·licitud / login (status === "none") ────────────
  if (accessStatus === "none") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-white">
        <Header />

        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,124,74,0.07),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          {/* Decorative coordinates text */}
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

            {/* Label */}
            <FadeUp delay={0}>
              <Tag>Early Access · Drop 001</Tag>
            </FadeUp>

            {/* Title */}
            <FadeUp delay={0.08}>
              <h1 className="mt-7 text-[3.2rem] font-normal leading-[0.93] tracking-tight text-white md:text-[4rem]">
                Entra al<br />
                <span className="text-white/40">joc.</span>
              </h1>
            </FadeUp>

            {/* Subtitle */}
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

            {/* Footer note */}
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
  }

  // ── Pendent ──────────────────────────────────────────────────────
  if (accessStatus === "pending") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-white">
        <Header />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.05),transparent_60%)]" />
        </div>
        <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <FadeUp>
              {/* Pulsing dot */}
              <div className="mx-auto mb-10 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-3 w-3 rounded-full bg-amber-400"
                />
              </div>

              <Tag>Sol·licitud en revisió</Tag>

              <h1 className="mt-7 text-4xl leading-[0.95] text-white">
                Estem<br />
                <span className="text-white/40">revisant-ho.</span>
              </h1>

              <p className="mt-6 text-sm leading-relaxed text-white/48">
                La teva sol·licitud ha estat rebuda. Rebràs accés quan sigui aprovada manualment — normalment en menys de 24h.
              </p>

              <div className="mt-10 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white/28">
                  Sol·licitud registrada com a
                </p>
                <p className="mt-2 text-sm text-white/70">{state.user.email}</p>
              </div>

              <button
                onClick={logout}
                className="mt-10 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/20 transition-all hover:text-white/44"
              >
                Tancar sessió
              </button>
            </FadeUp>
          </div>
        </main>
      </div>
    );
  }

  // ── Denegat ──────────────────────────────────────────────────────
  if (accessStatus === "denied") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-white">
        <Header />
        <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <FadeUp>
              <Tag>Accés no autoritzat</Tag>

              <h1 className="mt-7 text-4xl leading-[0.95] text-white">
                Accés<br />
                <span className="text-red-400/60">denegat.</span>
              </h1>

              <p className="mt-6 text-sm leading-relaxed text-white/44">
                La teva sol·licitud no ha estat acceptada en aquesta fase. Si creus que és un error, contacta'ns directament.
              </p>

              <button
                onClick={logout}
                className="mt-10 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/20 transition-all hover:text-white/44"
              >
                Tornar enrere
              </button>
            </FadeUp>
          </div>
        </main>
      </div>
    );
  }

  // ── Aprovat: Clue Hub ────────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0a09] text-white">
      <Header />

      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(180,124,74,0.06),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/6" />
      </div>

      <main className="relative z-10 px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl">

          {/* ── Header del hub ─────────────────────────── */}
          <FadeUp>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/8 pb-8">
              <div>
                <Tag>Accés concedit · Drop 001</Tag>
                <h1 className="mt-5 text-[2.6rem] leading-[0.94] text-white md:text-[3.4rem]">
                  {t("clue_hub_title")}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/48">
                  {t("clue_hub_body")}
                </p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {clues.map((c) => (
                    <motion.div
                      key={c.id}
                      animate={{
                        backgroundColor: state.unlockedClues.includes(c.id)
                          ? "#ffffff"
                          : "rgba(255,255,255,0.12)",
                      }}
                      transition={{ duration: 0.4 }}
                      className="h-2 w-2 rounded-full"
                    />
                  ))}
                </div>
                <span className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-white/38">
                  {state.unlockedClues.length}/3 {t("clue_hub_progress")}
                </span>
              </div>
            </div>
          </FadeUp>

          {/* Progress bar */}
          <div className="mt-0 h-[2px] w-full overflow-hidden bg-white/6">
            <motion.div
              className="h-full bg-gradient-to-r from-white/40 via-white/70 to-white/40"
              animate={{ width: `${(state.unlockedClues.length / 3) * 100}%` }}
              transition={{ duration: 0.6, ease }}
            />
          </div>

          {/* ── Clue cards ─────────────────────────────── */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {clues.map((clue) => {
              const unlocked = state.unlockedClues.includes(clue.id);
              const active = clue.id === activeClueId;
              const justUnlockedThis = justUnlocked === clue.id;

              return (
                <motion.article
                  key={clue.id}
                  animate={
                    justUnlockedThis
                      ? {
                          scale: [1, 1.025, 1],
                          boxShadow: [
                            "0 0 0 rgba(255,255,255,0)",
                            "0 0 48px rgba(255,255,255,0.12)",
                            "0 0 0 rgba(255,255,255,0)",
                          ],
                        }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.55, ease }}
                  onClick={() => setActiveClueId(clue.id)}
                  className={`group cursor-pointer rounded-[28px] border p-6 transition-all duration-300 ${
                    active
                      ? "border-white/16 bg-white/[0.055]"
                      : "border-white/8 bg-white/[0.025] hover:border-white/14 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/34">
                      {clue.category}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono-tech text-[9px] uppercase tracking-[0.16em] ${
                        unlocked
                          ? "bg-white text-black"
                          : "border border-white/10 bg-transparent text-white/40"
                      }`}
                    >
                      <LockIcon unlocked={unlocked} />
                      {unlocked ? t("clue_status_unlocked") : t("clue_status_locked")}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl leading-tight text-white">
                    {clue.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/52">
                    {active ? clue.reveal : clue.teaser}
                  </p>

                  <div
                    className={`mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tech text-[10px] uppercase tracking-[0.16em] transition-all ${
                      active
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-white/40 group-hover:border-white/18 group-hover:text-white/60"
                    }`}
                  >
                    {active ? "Oberta" : `Clue ${clue.id}`}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* ── Detail panel ───────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease }}
              className="mt-6 grid gap-6 rounded-[32px] border border-white/8 bg-white/[0.025] p-6 md:p-8 xl:grid-cols-[1fr_380px]"
              style={{ borderColor: activeClue.accent }}
            >
              {/* Left: info */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Tag>{activeClue.category}</Tag>
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/28">
                    · {t("clue_panel_label") ?? "Senyal ampliat"}
                  </span>
                </div>

                <h2 className="mt-6 text-3xl leading-tight text-white md:text-4xl">
                  {activeClue.panelTitle}
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/58">
                  {activeClue.panelBody}
                </p>

                {/* Signal box */}
                <div className="mt-7 rounded-2xl border border-white/8 bg-black/20 p-5">
                  <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/28">
                    {t("clue_panel_signal") ?? "Senyal"}
                  </p>
                  <p className="mt-4 break-words text-2xl leading-tight text-white md:text-[1.8rem]">
                    {activeClue.panelSignal}
                  </p>
                </div>

                {/* Fragments */}
                <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-5">
                  <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/28">
                    {t("clue_reveal_list_label") ?? "El que revela"}
                  </p>
                  <div className="mt-5 space-y-4">
                    {activeClue.fragments.map((f, i) => (
                      <div key={f} className="flex items-start gap-4 text-sm leading-relaxed">
                        <motion.span
                          animate={{
                            scale: activeUnlocked ? [1, 1.4, 1] : 1,
                            backgroundColor: activeUnlocked
                              ? "#ffffff"
                              : "rgba(255,255,255,0.14)",
                          }}
                          transition={{ duration: 0.35, delay: i * 0.06 }}
                          className="mt-[7px] h-2 w-2 shrink-0 rounded-full block"
                        />
                        <span
                          className={
                            activeUnlocked
                              ? "text-white/80"
                              : i === 0
                              ? "text-white/60"
                              : "text-white/24"
                          }
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: unlock station */}
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-6">
                  <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/28">
                    {t("clue_unlock_station") ?? "Unlock station"}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/54">
                    {activeClue.hint}
                  </p>

                  {!activeUnlocked ? (
                    <div className="mt-6 space-y-3">
                      <motion.div
                        animate={
                          shakeClue === activeClue.id
                            ? { x: [0, -7, 7, -7, 7, -4, 4, 0] }
                            : { x: 0 }
                        }
                        transition={{ duration: 0.45 }}
                      >
                        <input
                          type="text"
                          value={passwords[activeClue.id] ?? ""}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, [activeClue.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleUnlock(activeClue.id)}
                          placeholder={t("clue_password_placeholder")}
                          className={`h-12 w-full rounded-[14px] border bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/22 outline-none transition-all focus:bg-white/[0.06] ${
                            shakeClue === activeClue.id
                              ? "border-red-500/40 focus:border-red-500/60"
                              : "border-white/8 focus:border-white/18"
                          }`}
                        />
                      </motion.div>
                      <Button
                        variant="pdra"
                        size="lg"
                        className="w-full"
                        onClick={() => handleUnlock(activeClue.id)}
                      >
                        {t("clue_unlock_cta")}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease }}
                      className="mt-6 rounded-[14px] border border-white/10 bg-white/[0.05] p-4"
                    >
                      <p className="text-sm text-white/70">{t("clue_station_open") ?? "Pista desbloquejada."}</p>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {feedback[activeClue.id] && (
                      <motion.div
                        key={feedback[activeClue.id]}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="mt-4 rounded-[14px] border border-white/8 bg-white/[0.03] p-4"
                      >
                        <p className="text-xs leading-relaxed text-white/74">
                          {feedback[activeClue.id]}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Nav clues */}
                <div className="flex gap-3">
                  {clues.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveClueId(c.id)}
                      className={`flex-1 rounded-2xl border py-3 font-mono-tech text-[10px] uppercase tracking-[0.16em] transition-all ${
                        c.id === activeClueId
                          ? "border-white/16 bg-white/[0.06] text-white"
                          : "border-white/8 bg-transparent text-white/28 hover:border-white/14 hover:text-white/50"
                      }`}
                    >
                      {c.id}
                    </button>
                  ))}
                </div>

                {/* Reward code */}
                {state.user.rewardCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="rounded-2xl border border-[#6f553c] bg-[linear-gradient(180deg,rgba(175,126,75,0.16),rgba(64,42,22,0.10))] p-5"
                  >
                    <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[#d7b189]">
                      {t("access_reward_label")}
                    </p>
                    <p className="mt-3 font-mono-tech text-xl tracking-widest text-white">
                      {state.user.rewardCode}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/50">
                      {t("access_reward_body")}
                    </p>
                  </motion.div>
                )}

                {/* CTA al drop */}
                <Button
                  variant="pdra"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/drop/montserrat")}
                >
                  {t("access_go_to_drop")}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Reveal final ──────────────────────────── */}
          <motion.div
            animate={{
              borderColor: allCluesUnlocked
                ? "rgba(141,106,72,0.7)"
                : "rgba(255,255,255,0.06)",
            }}
            transition={{ duration: 0.7 }}
            className={`mt-6 rounded-[28px] border p-7 md:p-9 ${
              allCluesUnlocked
                ? "bg-[linear-gradient(180deg,rgba(202,156,112,0.12),rgba(74,49,27,0.08))]"
                : "border-dashed bg-white/[0.015]"
            }`}
          >
            <Tag>{t("clue_final_label") ?? "Reveal final"}</Tag>

            <motion.p
              animate={{
                filter: allCluesUnlocked ? "blur(0px)" : "blur(5px)",
                opacity: allCluesUnlocked ? 1 : 0.4,
              }}
              transition={{ duration: 0.7 }}
              className="mt-5 max-w-4xl text-2xl leading-snug text-white md:text-3xl"
            >
              {allCluesUnlocked ? t("clue_final_open") : t("clue_final_locked")}
            </motion.p>

            <motion.p
              animate={{
                filter: allCluesUnlocked ? "blur(0px)" : "blur(3px)",
                opacity: allCluesUnlocked ? 0.56 : 0.28,
              }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 max-w-3xl text-sm leading-relaxed text-white/56"
            >
              {allCluesUnlocked ? t("clue_final_emotional_open") : t("clue_final_emotional_locked")}
            </motion.p>
          </motion.div>

          {/* Logout subtle */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={logout}
              className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/16 transition-all hover:text-white/36"
            >
              Tancar sessió
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessPage;
