import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative h-screen flex items-end">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Montserrat mountain range at golden hour" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, hsl(30 20% 94% / 0.95))" }} />
        </div>
        <div className="relative z-10 px-6 md:px-10 pb-16 md:pb-24 max-w-3xl">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">{t("hero_est")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] text-balance">
              {t("hero_title")}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-stone text-base md:text-lg max-w-md leading-relaxed">
              {t("hero_subtitle")}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link to="/access">
              <Button variant="pdra" size="xl" className="mt-8">
                {t("hero_cta")}
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-8 font-mono-tech">{t("manifesto_label")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground leading-[1.4] text-balance">
              {t("manifesto_text")}
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-stone text-base leading-relaxed max-w-lg">
              {t("manifesto_body")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Concept */}
      <section className="pb-24 md:pb-40">
        <div className="grid md:grid-cols-2 gap-0">
          <FadeIn className="relative aspect-[4/5] md:aspect-auto">
            <img src={climbingImg} alt="Climber on Catalan limestone" className="w-full h-full object-cover" />
          </FadeIn>
          <div className="flex items-center px-6 md:px-16 py-16 md:py-0">
            <div>
              <FadeIn>
                <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("concept_label")}</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-4xl text-foreground leading-[1.2] text-balance">
                  {t("concept_title")}
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-6 text-stone text-base leading-relaxed">{t("concept_p1")}</p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="mt-4 text-stone text-base leading-relaxed">{t("concept_p2")}</p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* First Drop Preview */}
      <section className="py-24 md:py-40 px-6 md:px-10 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <FadeIn>
                <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("drop_label")}</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-5xl text-foreground leading-[1.1]">{t("drop_name")}</h2>
              </FadeIn>
              <FadeIn delay={0.15}>
                <p className="mt-2 text-stone italic">{t("drop_subtitle")}</p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-8 space-y-3 font-mono-tech text-xs text-stone">
                  <p>{t("drop_elevation")}</p>
                  <p>{t("drop_units", { count: state.totalUnits })}</p>
                  <p>{t("drop_status_label")} — {statusLabel}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Link to="/drop/montserrat">
                  <Button variant="pdra-outline" size="lg" className="mt-8">{t("drop_view")}</Button>
                </Link>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} className="relative">
              <img src={productJacket} alt="Montserrat collection jacket" className="w-full rounded-[8px] shadow-soft" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-8 font-mono-tech">{t("philosophy_label")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-2xl md:text-3xl text-foreground leading-[1.4] text-balance">{t("philosophy_title")}</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-stone text-base leading-relaxed max-w-lg mx-auto">{t("philosophy_body")}</p>
          </FadeIn>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-24 md:py-40 px-6 md:px-10 bg-surface">
        <div className="max-w-md mx-auto text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">{t("email_label")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-2xl md:text-3xl text-foreground text-balance">{t("email_title")}</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            {submitted || state.user.accessStatus !== "none" ? (
              <div className="mt-8">
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
                  className="w-full h-12 px-4 bg-background text-foreground text-sm rounded-[4px] shadow-inner-border placeholder:text-stone/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                />
                <Button variant="pdra" size="lg" type="submit">{t("email_cta")}</Button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-10 flex items-center justify-between">
        <p className="text-xs text-stone">{t("footer_location")}</p>
        <p className="text-xs text-stone font-mono-tech">© 2026</p>
      </footer>
    </div>
  );
};

export default Index;
