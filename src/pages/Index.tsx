import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import heroImg from "@/assets/hero-montserrat.jpg";
import climbingImg from "@/assets/climbing-editorial.jpg";
import productJacket from "@/assets/product-jacket.jpg";

const easing = [0.2, 0, 0, 1] as const;

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: easing }}
    className={className}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const { requestAccess, state } = useApp();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealedClues, setRevealedClues] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      requestAccess(email);
      setSubmitted(true);
    }
  };

  const statusLabel = state.dropStatus === "coming_soon"
    ? t("drop_coming_soon")
    : state.dropStatus === "open"
    ? t("drop_open")
    : t("drop_sold_out");

  const clues = useMemo(
    () => [
      { id: 1, label: t("tease_clue_1_label"), body: t("tease_clue_1_body") },
      { id: 2, label: t("tease_clue_2_label"), body: t("tease_clue_2_body") },
      { id: 3, label: t("tease_clue_3_label"), body: t("tease_clue_3_body") },
    ],
    [t],
  );

  const decoded = revealedClues.length === clues.length;

  const toggleClue = (id: number) => {
    setRevealedClues((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <section className="relative min-h-screen flex items-end isolate">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Montserrat mountain range at golden hour" className="w-full h-full object-cover scale-[1.03]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.18)_0%,rgba(6,6,6,0.46)_45%,rgba(14,11,8,0.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%)]" />
        </div>

        <div className="absolute inset-x-0 top-24 z-10 px-6 md:px-10">
          <FadeIn>
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-black/20 px-5 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/72 font-mono-tech">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.7)]" />
                {t("hero_signal")}
              </div>
              <div className="grid grid-cols-3 gap-6 text-right text-[11px] uppercase tracking-[0.18em] text-white/55 font-mono-tech">
                <div>
                  <p>{t("hero_metric_1_label")}</p>
                  <p className="mt-1 text-white">{t("hero_metric_1_value")}</p>
                </div>
                <div>
                  <p>{t("hero_metric_2_label")}</p>
                  <p className="mt-1 text-white">{t("hero_metric_2_value")}</p>
                </div>
                <div>
                  <p>{t("hero_metric_3_label")}</p>
                  <p className="mt-1 text-white">{statusLabel}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="relative z-10 w-full px-6 pb-16 md:px-10 md:pb-20 pt-40">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-4xl">
              <FadeIn>
                <div className="inline-flex rounded-full border border-white/10 bg-black/28 px-4 py-2 backdrop-blur-sm shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/80 font-mono-tech">{t("hero_est")}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h1 className="mt-5 max-w-4xl text-5xl md:text-7xl lg:text-[5.8rem] text-white leading-[0.95] text-balance [text-shadow:0_10px_40px_rgba(0,0,0,0.45)]">
                  {t("hero_title")}
                </h1>
              </FadeIn>
              <FadeIn delay={0.16}>
                <div className="mt-7 max-w-2xl rounded-[24px] border border-white/10 bg-black/34 px-6 py-5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
                  <p className="text-base md:text-xl text-white leading-relaxed [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
                    {t("hero_subtitle")}
                  </p>
                  <p className="mt-4 text-sm md:text-base text-white/82 leading-relaxed [text-shadow:0_4px_24px_rgba(0,0,0,0.45)]">
                    {t("hero_mystery")}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.32} className="flex flex-wrap items-center gap-4 mt-10">
                <Link to="/access">
                  <Button variant="pdra" size="xl" className="min-w-52">
                    {t("hero_cta")}
                  </Button>
                </Link>
                <Link to="/drop/montserrat" className="text-sm uppercase tracking-[0.18em] text-white/70 hover:text-white transition-pdra">
                  {t("hero_secondary_cta")}
                </Link>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="lg:justify-self-end">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.28)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/55 font-mono-tech">{t("hero_panel_label")}</p>
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-mono-tech">{t("hero_panel_drop")}</p>
                    <p className="mt-2 text-3xl text-white">{t("drop_name")}</p>
                    <p className="mt-2 text-sm text-white/55">{t("drop_subtitle")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-white/72">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-mono-tech">{t("hero_panel_availability")}</p>
                      <p className="mt-3 text-xl text-white">{state.unitsRemaining}/{state.totalUnits}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-mono-tech">{t("hero_panel_window")}</p>
                      <p className="mt-3 text-xl text-white">Q2 / 2026</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-white/15 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-mono-tech">{t("hero_panel_note_label")}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{t("hero_panel_note")}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 md:px-10 md:py-32 bg-[#0f0d0b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <FadeIn>
                <p className="text-xs uppercase tracking-[0.25em] text-white/45 mb-6 font-mono-tech">{t("tease_label")}</p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h2 className="text-3xl md:text-5xl leading-[1.05] text-balance">{t("tease_title")}</h2>
              </FadeIn>
              <FadeIn delay={0.16}>
                <p className="mt-6 max-w-2xl text-white/68 leading-relaxed">{t("tease_body")}</p>
              </FadeIn>
            </div>
            <FadeIn delay={0.12}>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/45 font-mono-tech">
                  <span>{t("tease_progress_label")}</span>
                  <span>{revealedClues.length}/{clues.length}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    animate={{ width: `${(revealedClues.length / clues.length) * 100}%` }}
                    transition={{ duration: 0.45, ease: easing }}
                  />
                </div>
                <p className="mt-4 text-sm text-white/55">{decoded ? t("tease_decoded_helper") : t("tease_instruction")}</p>
              </div>
            </FadeIn>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {clues.map((clue, index) => {
              const active = revealedClues.includes(clue.id);
              return (
                <FadeIn key={clue.id} delay={0.16 + index * 0.08}>
                  <button
                    type="button"
                    onClick={() => toggleClue(clue.id)}
                    className={`group h-full w-full rounded-[26px] border p-6 text-left transition-pdra ${
                      active
                        ? "border-white/30 bg-white text-[#111] shadow-[0_20px_80px_rgba(255,255,255,0.08)]"
                        : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <p className={`text-[11px] uppercase tracking-[0.22em] font-mono-tech ${active ? "text-black/45" : "text-white/45"}`}>
                      {clue.label}
                    </p>
                    <p className={`mt-8 text-lg leading-relaxed ${active ? "text-black/85" : "text-white/78"}`}>
                      {active ? clue.body : t("tease_locked")}
                    </p>
                    <p className={`mt-10 text-[11px] uppercase tracking-[0.18em] font-mono-tech ${active ? "text-black/45" : "text-white/35 group-hover:text-white/60"}`}>
                      {active ? t("tease_clue_open") : t("tease_clue_cta")}
                    </p>
                  </button>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.36} className="mt-10">
            <div className={`rounded-[30px] border p-8 md:p-10 transition-pdra ${decoded ? "border-white/30 bg-white text-[#111]" : "border-dashed border-white/12 bg-transparent text-white"}`}>
              <p className={`text-[11px] uppercase tracking-[0.22em] font-mono-tech ${decoded ? "text-black/45" : "text-white/40"}`}>
                {t("tease_decode_label")}
              </p>
              <h3 className={`mt-4 text-2xl md:text-4xl leading-[1.08] ${decoded ? "text-black" : "text-white/35"}`}>
                {decoded ? t("tease_decoded_title") : "•••••••• ••••••• •••••"}
              </h3>
              <p className={`mt-4 max-w-3xl leading-relaxed ${decoded ? "text-black/72" : "text-white/35"}`}>
                {decoded ? t("tease_decoded_body") : t("tease_decoded_locked")}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <FadeIn className="relative">
            <div className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_55%)]" />
            <img src={climbingImg} alt="Climber on Catalan limestone" className="relative w-full rounded-[28px] object-cover shadow-soft" />
          </FadeIn>
          <div>
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("manifesto_label")}</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <p className="text-2xl md:text-4xl text-foreground leading-[1.25] text-balance">{t("manifesto_text")}</p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-8 text-stone text-base leading-relaxed max-w-xl">{t("manifesto_body")}</p>
            </FadeIn>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: t("positioning_1_label"), body: t("positioning_1_body") },
                { label: t("positioning_2_label"), body: t("positioning_2_body") },
                { label: t("positioning_3_label"), body: t("positioning_3_body") },
              ].map((item, index) => (
                <FadeIn key={item.label} delay={0.2 + index * 0.06}>
                  <div className="rounded-[22px] border border-foreground/8 bg-white/60 p-5 shadow-soft">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone font-mono-tech">{item.label}</p>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/80">{item.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-10 bg-surface">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("drop_label")}</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="text-3xl md:text-5xl text-foreground leading-[1.05]">{t("drop_name")}</h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mt-3 text-stone italic">{t("drop_subtitle")}</p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-8 max-w-xl text-foreground/82 leading-relaxed">{t("concept_p1")}</p>
            </FadeIn>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                t("drop_elevation"),
                t("drop_units", { count: state.totalUnits }),
                `${t("drop_status_label")} — ${statusLabel}`,
                t("drop_hint_line"),
              ].map((item, index) => (
                <FadeIn key={item} delay={0.2 + index * 0.05}>
                  <div className="rounded-[20px] border border-foreground/8 bg-background p-4 text-sm text-stone shadow-inner-border">
                    {item}
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.38} className="flex flex-wrap gap-4 mt-10">
              <Link to="/drop/montserrat">
                <Button variant="pdra-outline" size="lg">{t("drop_view")}</Button>
              </Link>
              <Link to="/access">
                <Button variant="pdra" size="lg">{t("email_cta")}</Button>
              </Link>
            </FadeIn>
          </div>
          <FadeIn delay={0.16} className="relative">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 rounded-full border border-foreground/10 bg-background/90 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone font-mono-tech shadow-soft">
              {t("drop_overlay")}
            </div>
            <img src={productJacket} alt="Montserrat collection jacket" className="w-full rounded-[30px] shadow-soft" />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("timeline_label")}</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="text-3xl md:text-5xl leading-[1.08] text-balance">{t("timeline_title")}</h2>
            </FadeIn>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { step: "01", title: t("timeline_1_title"), body: t("timeline_1_body") },
              { step: "02", title: t("timeline_2_title"), body: t("timeline_2_body") },
              { step: "03", title: t("timeline_3_title"), body: t("timeline_3_body") },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={0.1 + index * 0.08}>
                <div className="h-full rounded-[26px] border border-foreground/8 bg-white/70 p-6 shadow-soft">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-stone font-mono-tech">{item.step}</p>
                  <h3 className="mt-6 text-2xl leading-tight">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 md:px-10 bg-surface">
        <div className="max-w-md mx-auto text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("email_label")}</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="text-3xl md:text-4xl text-foreground text-balance">{t("email_title")}</h2>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-5 text-stone leading-relaxed">{t("email_supporting")}</p>
          </FadeIn>
          <FadeIn delay={0.24}>
            {submitted || state.user.accessStatus !== "none" ? (
              <div className="mt-8 rounded-[24px] border border-foreground/8 bg-background p-8 shadow-soft">
                <p className="text-stone text-sm">{t("email_on_list")}</p>
                <div className="mt-4 h-px bg-foreground/10 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-foreground/30"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: easing }}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  required
                  className="w-full h-12 px-4 bg-background text-foreground text-sm rounded-[8px] shadow-inner-border placeholder:text-stone/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                />
                <Button variant="pdra" size="lg" type="submit">{t("email_cta")}</Button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-10 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-stone">{t("footer_location")}</p>
        <p className="text-xs text-stone font-mono-tech">© 2026</p>
      </footer>
    </div>
  );
};

export default Index;
