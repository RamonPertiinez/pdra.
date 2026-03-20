import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

const easing = [0.2, 0, 0, 1] as const;

const AccessPage = () => {
  const { state, requestAccess, login, unlockClue, allCluesUnlocked } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"request" | "login">(
    state.user.accessStatus === "none" ? "request" : "login",
  );
  const [email, setEmail] = useState(state.user.email ?? "");
  const [country, setCountry] = useState(state.user.country ?? "");
  const [phone, setPhone] = useState(state.user.phone ?? "");
  const [passwords, setPasswords] = useState<Record<number, string>>({ 1: "", 2: "", 3: "" });
  const [feedback, setFeedback] = useState<Record<number, string>>({});

  const clues = useMemo(
    () => [
      {
        id: 1,
        title: t("clue_1_title"),
        category: t("clue_category_1"),
        teaser: t("clue_1_teaser"),
        reveal: t("clue_1_reveal"),
        passwordHint: t("clue_password_hint"),
        fragments: [t("clue_1_fragment_1"), t("clue_1_fragment_2"), t("clue_1_fragment_3")],
        accent: "from-[#0f1114] via-[#1b1f25] to-[#252c34]",
      },
      {
        id: 2,
        title: t("clue_2_title"),
        category: t("clue_category_2"),
        teaser: t("clue_2_teaser"),
        reveal: t("clue_2_reveal"),
        passwordHint: t("clue_password_hint_2"),
        fragments: [t("clue_2_fragment_1"), t("clue_2_fragment_2"), t("clue_2_fragment_3")],
        accent: "from-[#17120e] via-[#221913] to-[#302219]",
      },
      {
        id: 3,
        title: t("clue_3_title"),
        category: t("clue_category_3"),
        teaser: t("clue_3_teaser"),
        reveal: t("clue_3_reveal"),
        passwordHint: t("clue_password_hint_3"),
        fragments: [t("clue_3_fragment_1"), t("clue_3_fragment_2"), t("clue_3_fragment_3")],
        accent: "from-[#101010] via-[#181818] to-[#262626]",
      },
    ],
    [t],
  );

  const progressMoments = useMemo(
    () => [
      t("progress_step_1"),
      t("progress_step_2"),
      t("progress_step_3"),
    ],
    [t],
  );

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && country && phone) {
      requestAccess({ email, country, phone });
      setMode("login");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  const handleUnlock = (clueId: number) => {
    const result = unlockClue(clueId, passwords[clueId] || "");

    if (!result.success) {
      setFeedback((prev) => ({ ...prev, [clueId]: t("clue_password_error") }));
      return;
    }

    setFeedback((prev) => ({
      ...prev,
      [clueId]: clueId === 1 && result.rewardCode
        ? t("clue_reward_unlocked", { code: result.rewardCode })
        : t("clue_unlocked_success"),
    }));
  };

  const isApproved = state.user.accessStatus === "approved";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-28 md:px-10">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            className="rounded-[30px] border border-foreground/8 bg-surface p-8 shadow-soft"
          >
            <div className="inline-flex rounded-full border border-foreground/10 bg-background px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone font-mono-tech shadow-inner-border">
              {t("access_prelabel")}
            </div>
            <h1 className="mt-5 text-3xl md:text-4xl leading-[1.04] text-balance">{t("access_title_new")}</h1>
            <p className="mt-4 text-stone leading-relaxed">{t("access_body_new")}</p>
            <p className="mt-4 text-sm text-foreground/70 leading-relaxed">{t("access_intro_signal")}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-background p-4 shadow-inner-border">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone font-mono-tech">{t("access_stat_1_label")}</p>
                <p className="mt-3 text-xl">20 / 05 / 2026</p>
              </div>
              <div className="rounded-[20px] bg-background p-4 shadow-inner-border">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone font-mono-tech">{t("access_stat_2_label")}</p>
                <p className="mt-3 text-xl">3</p>
              </div>
              <div className="rounded-[20px] bg-background p-4 shadow-inner-border">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone font-mono-tech">{t("access_stat_3_label")}</p>
                <p className="mt-3 text-xl">{state.unlockedClues.length}/3</p>
              </div>
            </div>

            {!isApproved ? (
              <>
                <div className="flex gap-6 mt-10 mb-8 justify-center">
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
                    className="w-full h-12 px-4 bg-background text-foreground text-sm rounded-[10px] shadow-inner-border placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                  />

                  {mode === "request" && (
                    <>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={t("access_country_placeholder")}
                        required
                        className="w-full h-12 px-4 bg-background text-foreground text-sm rounded-[10px] shadow-inner-border placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("access_phone_placeholder")}
                        required
                        className="w-full h-12 px-4 bg-background text-foreground text-sm rounded-[10px] shadow-inner-border placeholder:text-stone/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                      />
                    </>
                  )}

                  <div className="rounded-[18px] border border-dashed border-foreground/10 bg-background p-4">
                    <p className="text-xs text-stone leading-relaxed">{t("access_form_note")}</p>
                    <p className="mt-2 text-xs text-foreground/60">{t("access_hint")}</p>
                  </div>
                  <Button variant="pdra" size="lg" type="submit" className="w-full">
                    {mode === "request" ? t("access_unlock_hub") : t("access_enter_btn")}
                  </Button>
                </form>
              </>
            ) : (
              <div className="mt-10 rounded-[24px] bg-background p-6 shadow-inner-border">
                <p className="text-xs uppercase tracking-[0.15em] text-stone font-mono-tech">{t("access_granted")}</p>
                <p className="mt-3 text-lg text-foreground">{t("access_hub_ready")}</p>
                <p className="mt-2 text-sm text-stone">{t("access_hub_note")}</p>
                <div className="mt-5 rounded-[18px] border border-foreground/8 bg-white/60 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-stone font-mono-tech">{t("access_progress_label")}</p>
                  <div className="mt-4 grid gap-2">
                    {progressMoments.map((item, index) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                        <span className={`h-2.5 w-2.5 rounded-full ${state.unlockedClues.length > index ? "bg-foreground" : "bg-foreground/15"}`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {state.user.rewardCode && (
                  <div className="mt-5 rounded-[18px] border border-foreground/8 bg-foreground text-background p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-background/65 font-mono-tech">{t("access_reward_label")}</p>
                    <p className="mt-2 text-lg">{state.user.rewardCode}</p>
                    <p className="mt-2 text-sm text-background/78">{t("access_reward_body")}</p>
                  </div>
                )}
                <Button variant="pdra" size="lg" className="mt-6 w-full" onClick={() => navigate("/drop/montserrat")}>{t("access_go_to_drop")}</Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easing, delay: 0.08 }}
            className="rounded-[34px] border border-foreground/8 bg-[#11100f] p-8 text-white shadow-[0_28px_120px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45 font-mono-tech">{t("clue_hub_label")}</p>
                <h2 className="mt-3 text-3xl leading-tight text-balance">{t("clue_hub_title")}</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/60 font-mono-tech">
                {state.unlockedClues.length}/3 {t("clue_hub_progress")}
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-white/68 leading-relaxed">{t("clue_hub_body")}</p>

            <div className="mt-8 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                animate={{ width: `${(state.unlockedClues.length / 3) * 100}%` }}
                transition={{ duration: 0.45, ease: easing }}
              />
            </div>

            <div className="mt-10 grid gap-4 xl:grid-cols-3">
              {clues.map((clue) => {
                const unlocked = state.unlockedClues.includes(clue.id);

                return (
                  <div key={clue.id} className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${clue.accent} p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/42 font-mono-tech">{clue.category}</p>
                        <p className="mt-3 text-xl text-white">{clue.title}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em] font-mono-tech ${unlocked ? "bg-white text-black" : "bg-white/8 text-white/56"}`}>
                        {unlocked ? t("clue_status_unlocked") : t("clue_status_locked")}
                      </span>
                    </div>

                    <p className="mt-6 text-sm leading-relaxed text-white/74">{unlocked ? clue.reveal : clue.teaser}</p>

                    <div className="mt-6 rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/42 font-mono-tech">{t("clue_reveal_list_label")}</p>
                      <div className="mt-4 space-y-3">
                        {clue.fragments.map((fragment, index) => (
                          <div key={fragment} className="flex items-start gap-3 text-sm leading-relaxed text-white/72">
                            <span className={`mt-1.5 h-2 w-2 rounded-full ${unlocked ? "bg-white" : "bg-white/20"}`} />
                            <span className={unlocked ? "text-white/84" : index === 0 ? "text-white/68" : "text-white/40"}>{fragment}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-white/42 font-mono-tech">{clue.passwordHint}</p>

                    {isApproved && !unlocked && (
                      <div className="mt-6 space-y-3">
                        <input
                          type="text"
                          value={passwords[clue.id] || ""}
                          onChange={(e) => setPasswords((prev) => ({ ...prev, [clue.id]: e.target.value }))}
                          placeholder={t("clue_password_placeholder")}
                          className="w-full h-11 px-4 bg-white/8 text-white text-sm rounded-[10px] border border-white/10 placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/20 transition-pdra"
                        />
                        <Button variant="pdra-outline" size="lg" className="w-full border-white/20 text-white hover:bg-white hover:text-black" onClick={() => handleUnlock(clue.id)}>
                          {t("clue_unlock_cta")}
                        </Button>
                      </div>
                    )}

                    {feedback[clue.id] && (
                      <div className="mt-4 rounded-[16px] border border-white/12 bg-white/8 p-3">
                        <p className="text-xs text-white/82">{feedback[clue.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`mt-8 rounded-[28px] p-6 transition-pdra ${allCluesUnlocked ? "bg-white text-black" : "border border-dashed border-white/12 bg-white/5 text-white"}`}>
              <p className={`text-[11px] uppercase tracking-[0.18em] font-mono-tech ${allCluesUnlocked ? "text-black/45" : "text-white/42"}`}>
                {t("clue_final_label")}
              </p>
              <p className="mt-4 text-lg leading-relaxed">
                {allCluesUnlocked ? t("clue_final_open") : t("clue_final_locked")}
              </p>
              <p className={`mt-4 text-sm leading-relaxed ${allCluesUnlocked ? "text-black/68" : "text-white/62"}`}>
                {allCluesUnlocked ? t("clue_final_emotional_open") : t("clue_final_emotional_locked")}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AccessPage;
