import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

const easing = [0.2, 0, 0, 1] as const;

const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: easing }}
    className={className}
  >
    {children}
  </motion.div>
);

const AccessPage = () => {
  const { state, requestAccess, login, unlockClue, allCluesUnlocked } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"request" | "login">(
    state.user.accessStatus === "none" ? "request" : "login"
  );
  const [email, setEmail] = useState(state.user.email ?? "");
  const [country, setCountry] = useState(state.user.country ?? "");
  const [phone, setPhone] = useState(state.user.phone ?? "");
  const [passwords, setPasswords] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
  });
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [activeClueId, setActiveClueId] = useState<number>(1);

  const clues = useMemo(
    () => [
      {
        id: 1,
        title: t("clue_1_title"),
        category: t("clue_category_1"),
        teaser: t("clue_1_teaser"),
        reveal: t("clue_1_reveal"),
        passwordHint: t("clue_password_hint"),
        fragments: [
          t("clue_1_fragment_1"),
          t("clue_1_fragment_2"),
          t("clue_1_fragment_3"),
        ],
        panelTitle: t("clue_1_panel_title"),
        panelBody: t("clue_1_panel_body"),
        panelSignal: `41°36'18.9"N 1°48'40.9"E`,
        tone: "territory",
      },
      {
        id: 2,
        title: t("clue_2_title"),
        category: t("clue_category_2"),
        teaser: t("clue_2_teaser"),
        reveal: t("clue_2_reveal"),
        passwordHint: t("clue_password_hint_2"),
        fragments: [
          t("clue_2_fragment_1"),
          t("clue_2_fragment_2"),
          t("clue_2_fragment_3"),
        ],
        panelTitle: t("clue_2_panel_title"),
        panelBody: t("clue_2_panel_body"),
        panelSignal: t("clue_2_panel_signal"),
        tone: "construction",
      },
      {
        id: 3,
        title: t("clue_3_title"),
        category: t("clue_category_3"),
        teaser: t("clue_3_teaser"),
        reveal: t("clue_3_reveal"),
        passwordHint: t("clue_password_hint_3"),
        fragments: [
          t("clue_3_fragment_1"),
          t("clue_3_fragment_2"),
          t("clue_3_fragment_3"),
        ],
        panelTitle: t("clue_3_panel_title"),
        panelBody: t("clue_3_panel_body"),
        panelSignal: t("clue_3_panel_signal"),
        tone: "identity",
      },
    ],
    [t]
  );

  const progressMoments = useMemo(
    () => [t("progress_step_1"), t("progress_step_2"), t("progress_step_3")],
    [t]
  );

  const activeClue = clues.find((clue) => clue.id === activeClueId) ?? clues[0];
  const activeClueIndex = clues.findIndex((clue) => clue.id === activeClue.id);

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
      setFeedback((prev) => ({
        ...prev,
        [clueId]: t("clue_password_error"),
      }));
      return;
    }

    setFeedback((prev) => ({
      ...prev,
      [clueId]:
        clueId === 1 && result.rewardCode
          ? t("clue_reward_unlocked", { code: result.rewardCode })
          : t("clue_unlocked_success"),
    }));
  };

  const goToAdjacentClue = (direction: -1 | 1) => {
    const nextIndex = activeClueIndex + direction;
    if (nextIndex >= 0 && nextIndex < clues.length) {
      setActiveClueId(clues[nextIndex].id);
    }
  };

  const isApproved = state.user.accessStatus === "approved";
  const activeUnlocked = state.unlockedClues.includes(activeClue.id);

  const toneClass =
    activeClue.tone === "territory"
      ? "border-[#314457]/50"
      : activeClue.tone === "construction"
      ? "border-[#5e3c25]/50"
      : "border-white/10";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0a09] text-white">
      <Header />

      <main className="relative px-6 pb-20 pt-28 md:px-10 md:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12%] top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_62%)]" />
          <div className="absolute right-[-10%] top-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(180,124,74,0.08),transparent_60%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/8" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 xl:grid-cols-[400px_minmax(0,1fr)] xl:gap-12">
            <FadeIn>
              <aside className="sticky top-28">
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md md:p-8">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-white/55">
                    {t("access_prelabel")}
                  </div>

                  <h1 className="mt-6 max-w-[11ch] text-4xl leading-[0.94] text-white md:text-6xl">
                    {t("access_title_new")}
                  </h1>

                  <p className="mt-6 max-w-md text-base leading-relaxed text-white/66">
                    {t("access_body_new")}
                  </p>

                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/42">
                    {t("access_intro_signal")}
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/40">
                        {t("access_stat_1_label")}
                      </p>
                      <p className="mt-3 text-lg text-white">20 / 05</p>
                      <p className="text-sm text-white/48">2026</p>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/40">
                        {t("access_stat_2_label")}
                      </p>
                      <p className="mt-3 text-lg text-white">3</p>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/40">
                        {t("access_stat_3_label")}
                      </p>
                      <p className="mt-3 text-lg text-white">
                        {state.unlockedClues.length}/3
                      </p>
                    </div>
                  </div>

                  {!isApproved ? (
                    <>
                      <div className="mt-9 flex gap-5">
                        <button
                          onClick={() => setMode("request")}
                          className={`font-mono-tech text-[11px] uppercase tracking-[0.16em] transition-pdra ${
                            mode === "request"
                              ? "text-white"
                              : "text-white/36 hover:text-white/70"
                          }`}
                        >
                          {t("access_request")}
                        </button>

                        <button
                          onClick={() => setMode("login")}
                          className={`font-mono-tech text-[11px] uppercase tracking-[0.16em] transition-pdra ${
                            mode === "login"
                              ? "text-white"
                              : "text-white/36 hover:text-white/70"
                          }`}
                        >
                          {t("access_login")}
                        </button>
                      </div>

                      <form
                        onSubmit={mode === "request" ? handleRequest : handleLogin}
                        className="mt-6 space-y-3"
                      >
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("email_placeholder")}
                          required
                          className="h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.06]"
                        />

                        {mode === "request" && (
                          <>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              placeholder={t("access_country_placeholder")}
                              required
                              className="h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.06]"
                            />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t("access_phone_placeholder")}
                              required
                              className="h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.06]"
                            />
                          </>
                        )}

                        <div className="rounded-[16px] border border-dashed border-white/10 bg-white/[0.02] p-4">
                          <p className="text-xs leading-relaxed text-white/44">
                            {t("access_form_note")}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-white/32">
                            {t("access_hint")}
                          </p>
                        </div>

                        <Button variant="pdra" size="lg" type="submit" className="mt-2 w-full">
                          {mode === "request"
                            ? t("access_unlock_hub")
                            : t("access_enter_btn")}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="mt-9 rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                      <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {t("access_granted")}
                      </p>

                      <p className="mt-3 text-xl text-white">{t("access_hub_ready")}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/56">
                        {t("access_hub_note")}
                      </p>

                      <div className="mt-5 rounded-[18px] border border-white/10 bg-black/20 p-4">
                        <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/40">
                          {t("access_progress_label")}
                        </p>

                        <div className="mt-4 space-y-3">
                          {progressMoments.map((item, index) => (
                            <div
                              key={item}
                              className="flex items-start gap-3 text-sm text-white/76"
                            >
                              <span
                                className={`mt-[7px] h-2 w-2 rounded-full ${
                                  state.unlockedClues.length > index
                                    ? "bg-white"
                                    : "bg-white/16"
                                }`}
                              />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {state.user.rewardCode && (
                        <div className="mt-5 rounded-[18px] border border-[#6f553c] bg-[linear-gradient(180deg,rgba(175,126,75,0.18),rgba(64,42,22,0.12))] p-4">
                          <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[#d7b189]">
                            {t("access_reward_label")}
                          </p>
                          <p className="mt-2 text-lg text-white">{state.user.rewardCode}</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/66">
                            {t("access_reward_body")}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="pdra"
                        size="lg"
                        className="mt-6 w-full"
                        onClick={() => navigate("/drop/montserrat")}
                      >
                        {t("access_go_to_drop")}
                      </Button>
                    </div>
                  )}
                </div>
              </aside>
            </FadeIn>

            <FadeIn delay={0.08}>
              <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#0b0b0a_0%,#100f0d_100%)] p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-3xl">
                    <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {t("clue_hub_label")}
                    </p>
                    <h2 className="mt-4 max-w-[14ch] text-4xl leading-[0.97] text-white md:text-5xl">
                      {t("clue_hub_title")}
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62">
                      {t("clue_hub_body")}
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-white/54">
                    {state.unlockedClues.length}/3 {t("clue_hub_progress")}
                  </div>
                </div>

                <div className="mt-8 h-[2px] overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    animate={{ width: `${(state.unlockedClues.length / 3) * 100}%` }}
                    transition={{ duration: 0.45, ease: easing }}
                  />
                </div>

                <div className="mt-10 grid gap-4 lg:grid-cols-3">
                  {clues.map((clue, index) => {
                    const unlocked = state.unlockedClues.includes(clue.id);
                    const active = clue.id === activeClueId;

                    return (
                      <article
                        key={clue.id}
                        className={`rounded-[24px] border p-5 transition-pdra ${
                          active
                            ? "border-white/18 bg-white/[0.06]"
                            : "border-white/10 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.045]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white/38">
                              {clue.category}
                            </p>
                            <h3 className="mt-4 text-[1.55rem] leading-[1.02] text-white">
                              {clue.title}
                            </h3>
                          </div>

                          <span
                            className={`mt-1 rounded-full px-3 py-1 font-mono-tech text-[10px] uppercase tracking-[0.16em] ${
                              unlocked
                                ? "bg-white text-black"
                                : "border border-white/10 bg-white/[0.03] text-white/54"
                            }`}
                          >
                            {unlocked ? t("clue_status_unlocked") : t("clue_status_locked")}
                          </span>
                        </div>

                        <p className="mt-6 min-h-[112px] text-sm leading-relaxed text-white/74">
                          {active ? clue.reveal : clue.teaser}
                        </p>

                        <button
                          type="button"
                          onClick={() => setActiveClueId(clue.id)}
                          className={`mt-5 inline-flex items-center rounded-full border px-4 py-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] transition-pdra ${
                            active
                              ? "border-white bg-white text-black"
                              : "border-white/12 bg-transparent text-white/60 hover:border-white/24 hover:text-white"
                          }`}
                        >
                          {active
                            ? t("clue_opened_cta")
                            : t("clue_open_cta", { number: index + 1 })}
                        </button>
                      </article>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.section
                    key={activeClue.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, ease: easing }}
                    className={`mt-8 rounded-[28px] border bg-white/[0.03] p-6 md:p-7 ${toneClass}`}
                  >
                    <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/38">
                              {t("clue_panel_label")}
                            </p>
                            <h3 className="mt-4 text-3xl leading-[0.98] text-white md:text-4xl">
                              {activeClue.panelTitle}
                            </h3>
                          </div>

                          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/54">
                            {activeClue.category}
                          </div>
                        </div>

                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68">
                          {activeClue.panelBody}
                        </p>

                        <div className="mt-7 rounded-[20px] border border-white/10 bg-black/20 p-5">
                          <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/38">
                            {t("clue_panel_signal")}
                          </p>
                          <p className="mt-4 break-words text-2xl leading-tight text-white md:text-[2rem]">
                            {activeClue.panelSignal}
                          </p>
                        </div>

                        <div className="mt-7 rounded-[20px] border border-white/10 bg-black/20 p-5">
                          <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/38">
                            {t("clue_reveal_list_label")}
                          </p>

                          <div className="mt-5 space-y-4">
                            {activeClue.fragments.map((fragment, index) => (
                              <div
                                key={fragment}
                                className="flex items-start gap-4 text-sm leading-relaxed"
                              >
                                <span
                                  className={`mt-[7px] h-2 w-2 rounded-full ${
                                    activeUnlocked ? "bg-white" : "bg-white/16"
                                  }`}
                                />
                                <span
                                  className={
                                    activeUnlocked
                                      ? "text-white/84"
                                      : index === 0
                                      ? "text-white/64"
                                      : "text-white/32"
                                  }
                                >
                                  {fragment}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                          <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/38">
                            {t("clue_unlock_station")}
                          </p>

                          <p className="mt-4 text-sm leading-relaxed text-white/66">
                            {activeClue.passwordHint}
                          </p>

                          {isApproved && !activeUnlocked ? (
                            <div className="mt-6 space-y-3">
                              <input
                                type="text"
                                value={passwords[activeClue.id] || ""}
                                onChange={(e) =>
                                  setPasswords((prev) => ({
                                    ...prev,
                                    [activeClue.id]: e.target.value,
                                  }))
                                }
                                placeholder={t("clue_password_placeholder")}
                                className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.05] px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.07]"
                              />

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
                            <div className="mt-6 rounded-[16px] border border-white/10 bg-white/[0.03] p-4">
                              <p className="text-sm leading-relaxed text-white/76">
                                {activeUnlocked
                                  ? t("clue_station_open")
                                  : t("clue_station_locked")}
                              </p>
                            </div>
                          )}

                          {feedback[activeClue.id] && (
                            <div className="mt-4 rounded-[16px] border border-white/10 bg-white/[0.04] p-3">
                              <p className="text-xs leading-relaxed text-white/82">
                                {feedback[activeClue.id]}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 flex gap-3">
                          <Button
                            variant="pdra-outline"
                            size="lg"
                            className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
                            onClick={() => goToAdjacentClue(-1)}
                            disabled={activeClueIndex === 0}
                          >
                            {t("clue_prev")}
                          </Button>

                          <Button
                            variant="pdra-outline"
                            size="lg"
                            className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
                            onClick={() => goToAdjacentClue(1)}
                            disabled={activeClueIndex === clues.length - 1}
                          >
                            {t("clue_next")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                </AnimatePresence>

                <div
                  className={`mt-8 rounded-[24px] p-6 transition-pdra md:p-7 ${
                    allCluesUnlocked
                      ? "border border-[#8d6a48] bg-[linear-gradient(180deg,rgba(202,156,112,0.14),rgba(74,49,27,0.1))] text-white"
                      : "border border-dashed border-white/10 bg-white/[0.02] text-white"
                  }`}
                >
                  <p className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white/38">
                    {t("clue_final_label")}
                  </p>

                  <p className="mt-4 max-w-4xl text-2xl leading-[1.18] text-white">
                    {allCluesUnlocked ? t("clue_final_open") : t("clue_final_locked")}
                  </p>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">
                    {allCluesUnlocked
                      ? t("clue_final_emotional_open")
                      : t("clue_final_emotional_locked")}
                  </p>
                </div>
              </section>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessPage;
