import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import { FadeUp, Tag, LockIcon, ease } from "./shared";

const ClueHub = () => {
  const { state, logout, unlockClue, allCluesUnlocked } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

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

export default ClueHub;
