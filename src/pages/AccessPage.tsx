import { motion } from "framer-motion";
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
        accentGlow: "from-[#223245]/20 via-[#121a22]/0 to-transparent",
        accentBorder: "border-[#2f4359]/60",
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
        accentGlow: "from-[#4a2d16]/20 via-[#1a130d]/0 to-transparent",
        accentBorder: "border-[#5a3a22]/60",
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
        accentGlow: "from-[#3a3a3a]/18 via-[#161616]/0 to-transparent",
        accentBorder: "border-white/10",
      },
    ],
    [t]
  );

  const progressMoments = useMemo(
    () => [t("progress_step_1"), t("progress_step_2"), t("progress_step_3")],
    [t]
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

  const isApproved = state.user.accessStatus === "approved";

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-white overflow-x-hidden">
      <Header />

      <main className="relative px-6 pb-20 pt-28 md:px-10 md:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_62%)]" />
          <div className="absolute right-[-8%] top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(185,125,71,0.12),transparent_58%)]" />
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,transparent_0%,transparent_49.6%,rgba(255,255,255,0.12)_50%,transparent_50.4%,transparent_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 xl:grid-cols-[430px_minmax(0,1fr)] xl:gap-12">
            <FadeIn>
              <aside className="sticky top-28">
                <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-white/58">
                    {t("access_prelabel")}
                  </div>

                  <h1 className="mt-6 max-w-[12ch] text-4xl leading-[0.95] text-white md:text-6xl">
                    {t("access_title_new")}
                  </h1>

                  <p className="mt-6 max-w-md text-base leading-relaxed text-white/68">
                    {t("access_body_new")}
                  </p>

                  <p className="mt-5 max-w-md text-sm leading-relaxed text-white/46">
                    {t("access_intro_signal")}
                  </p>

                  <div className="mt-8 h-px bg-white/10" />

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/42">
                        {t("access_stat_1_label")}
                      </p>
                      <p className="mt-3 text-xl leading-none text-white">20 / 05</p>
                      <p className="mt-2 text-sm text-white/52">2026</p>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/42">
                        {t("access_stat_2_label")}
                      </p>
                      <p className="mt-3 text-xl leading-none text-white">3</p>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/42">
                        {t("access_stat_3_label")}
                      </p>
                      <p className="mt-3 text-xl leading-none text-white">
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
                              : "text-white/38 hover:text-white/70"
                          }`}
                        >
                          {t("access_request")}
                        </button>

                        <button
                          onClick={() => setMode("login")}
                          className={`font-mono-tech text-[11px] uppercase tracking-[0.16em] transition-pdra ${
                            mode === "login"
                              ? "text-white"
                              : "text-white/38 hover:text-white/70"
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
                          className="h-12 w-full rounded-[14px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.07]"
                        />

                        {mode === "request" && (
                          <>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              placeholder={t("access_country_placeholder")}
                              required
                              className="h-12 w-full rounded-[14px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.07]"
                            />

                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t("access_phone_placeholder")}
                              required
                              className="h-12 w-full rounded-[14px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.07]"
                            />
                          </>
                        )}

                        <div className="rounded-[18px] border border-dashed border-white/12 bg-white/[0.03] p-4">
                          <p className="text-xs leading-relaxed text-white/48">
                            {t("access_form_note")}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-white/34">
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
                    <div className="mt-9 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                      <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-white/42">
                        {t("access_granted")}
                      </p>

                      <p className="mt-3 text-xl text-white">{t("access_hub_ready")}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/58">
                        {t("access_hub_note")}
                      </p>

                      <div className="mt-5 rounded-[20px] border border-white/10 bg-black/20 p-4">
                        <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/42">
                          {t("access_progress_label")}
                        </p>

                        <div className="mt-4 space-y-3">
                          {progressMoments.map((item, index) => (
                            <div
                              key={item}
                              className="flex items-start gap-3 text-sm text-white/78"
                            >
                              <span
                                className={`mt-[7px] h-2 w-2 rounded-full ${
                                  state.unlockedClues.length > index
                                    ? "bg-white"
                                    : "bg-white/18"
                                }`}
                              />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {state.user.rewardCode && (
                        <div className="mt-5 rounded-[20px] border border-[#6f553c] bg-[linear-gradient(180deg,rgba(175,126,75,0.22),rgba(64,42,22,0.18))] p-4">
                          <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[#d7b189]">
                            {t("access_reward_label")}
                          </p>
                          <p className="mt-2 text-lg text-white">{state.user.rewardCode}</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/68">
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
              <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,#090909_0%,#0d0c0b_100%)] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.34)] md:p-8 xl:p-9">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-0 top-0 h-[240px] w-[240px] bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_68%)]" />
                  <div className="absolute right-0 top-0 h-[260px] w-[260px] bg-[radial-gradient(circle,rgba(176,116,61,0.14),transparent_68%)]" />
                  <div className="absolute bottom-0 left-1/2 h-[200px] w-[200px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)]" />
                </div>

                <div className="relative">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="max-w-3xl">
                      <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-white/42">
                        {t("clue_hub_label")}
                      </p>
                      <h2 className="mt-4 max-w-[15ch] text-4xl leading-[0.96] text-white md:text-5xl">
                        {t("clue_hub_title")}
                      </h2>
                      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/64">
                        {t("clue_hub_body")}
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-white/58">
                      {state.unlockedClues.length}/3 {t("clue_hub_progress")}
                    </div>
                  </div>

                  <div className="mt-8 h-[3px] overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      animate={{ width: `${(state.unlockedClues.length / 3) * 100}%` }}
                      transition={{ duration: 0.45, ease: easing }}
                    />
                  </div>

                  <div className="mt-10 grid gap-4 lg:grid-cols-3">
                    {clues.map((clue) => {
                      const unlocked = state.unlockedClues.includes(clue.id);

                      return (
                        <article
                          key={clue.id}
                          className={`relative overflow-hidden rounded-[28px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 md:p-6 ${clue.accentBorder}`}
                        >
                          <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${clue.accentGlow}`}
                          />

                          <div className="relative">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white/42">
                                  {clue.category}
                                </p>
                                <h3 className="mt-4 text-[1.95rem] leading-[1.02] text-white">
                                  {clue.title}
                                </h3>
                              </div>

                              <span
                                className={`mt-1 rounded-full px-3 py-1 font-mono-tech text-[10px] uppercase tracking-[0.16em] ${
                                  unlocked
                                    ? "bg-white text-black"
                                    : "border border-white/10 bg-white/[0.04] text-white/58"
                                }`}
                              >
                                {unlocked
                                  ? t("clue_status_unlocked")
                                  : t("clue_status_locked")}
                              </span>
                            </div>

                            <p className="mt-8 min-h-[138px] text-base leading-relaxed text-white/82">
                              {unlocked ? clue.reveal : clue.teaser}
                            </p>

                            <div className="mt-6 rounded-[20px] border border-white/10 bg-black/20 p-4">
                              <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/42">
                                {t("clue_reveal_list_label")}
                              </p>

                              <div className="mt-4 space-y-3">
                                {clue.fragments.map((fragment, index) => (
                                  <div
                                    key={fragment}
                                    className="flex items-start gap-3 text-sm leading-relaxed"
                                  >
                                    <span
                                      className={`mt-[7px] h-1.5 w-1.5 rounded-full ${
                                        unlocked ? "bg-white" : "bg-white/16"
                                      }`}
                                    />
                                    <span
                                      className={
                                        unlocked
                                          ? "text-white/84"
                                          : index === 0
                                          ? "text-white/64"
                                          : "text-white/30"
                                      }
                                    >
                                      {fragment}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <p className="mt-5 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/34">
                              {clue.passwordHint}
                            </p>

                            {isApproved && !unlocked && (
                              <div className="mt-5 space-y-3">
                                <input
                                  type="text"
                                  value={passwords[clue.id] || ""}
                                  onChange={(e) =>
                                    setPasswords((prev) => ({
                                      ...prev,
                                      [clue.id]: e.target.value,
                                    }))
                                  }
                                  placeholder={t("clue_password_placeholder")}
                                  className="h-11 w-full rounded-[14px] border border-white/10 bg-white/[0.06] px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra focus:border-white/18 focus:bg-white/[0.08]"
                                />

                                <Button
                                  variant="pdra-outline"
                                  size="lg"
                                  className="w-full border-white/20 text-white hover:bg-white hover:text-black"
                                  onClick={() => handleUnlock(clue.id)}
                                >
                                  {t("clue_unlock_cta")}
                                </Button>
                              </div>
                            )}

                            {feedback[clue.id] && (
                              <div className="mt-4 rounded-[16px] border border-white/10 bg-white/[0.05] p-3">
                                <p className="text-xs leading-relaxed text-white/82">
                                  {feedback[clue.id]}
                                </p>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div
                    className={`mt-8 rounded-[28px] p-6 transition-pdra md:p-7 ${
                      allCluesUnlocked
                        ? "border border-[#8d6a48] bg-[linear-gradient(180deg,rgba(202,156,112,0.18),rgba(74,49,27,0.14))] text-white"
                        : "border border-dashed border-white/12 bg-white/[0.03] text-white"
                    }`}
                  >
                    <p className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white/42">
                      {t("clue_final_label")}
                    </p>

                    <p className="mt-4 max-w-4xl text-2xl leading-[1.18] text-white">
                      {allCluesUnlocked ? t("clue_final_open") : t("clue_final_locked")}
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/62">
                      {allCluesUnlocked
                        ? t("clue_final_emotional_open")
                        : t("clue_final_emotional_locked")}
                    </p>
                  </div>
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
