import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import heroImg from "@/assets/hero-montserrat.jpg";
import productJacket from "@/assets/product-jacket.jpg";
import productTee from "@/assets/product-tee.jpg";

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

const MontserratDrop = () => {
  const { state, prebook } = useApp();
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [step, setStep] = useState<"browse" | "confirm" | "reserved">("browse");

  const isLoggedIn = state.user.accessStatus === "approved";
  const isOpen = state.dropStatus === "open";
  const isSoldOut = state.dropStatus === "sold_out";
  const alreadyBooked = !!state.user.prebookedSize;

  const handlePrebook = () => {
    if (selectedSize) setStep("confirm");
  };

  const handleConfirm = () => {
    if (selectedSize) {
      prebook(selectedSize);
      setStep("reserved");
    }
  };

  const sizes = ["S", "M", "L", "XL"];

  const statusLabel = state.dropStatus === "coming_soon"
    ? t("drop_coming_soon")
    : state.dropStatus === "open"
    ? t("drop_open")
    : t("drop_sold_out");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Montserrat" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, hsl(30 20% 94% / 0.98))" }} />
        </div>
        <div className="relative z-10 px-6 md:px-10 pb-12">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-3 font-mono-tech">{t("drop_label")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-foreground tracking-[-0.03em]">{t("drop_name")}</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-2 text-stone italic text-lg">{t("drop_subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="space-y-6">
            <FadeIn>
              <img src={productJacket} alt="Montserrat jacket" className="w-full rounded-[8px] shadow-soft" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <img src={productTee} alt="Montserrat tee" className="w-full rounded-[8px] shadow-soft" />
            </FadeIn>
          </div>

          <div className="md:sticky md:top-24 md:self-start">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.15em] text-stone mb-8 font-mono-tech">{t("drop_collection_label")}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-foreground leading-relaxed text-balance">{t("drop_collection_desc")}</p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 text-stone text-base leading-relaxed">{t("drop_back_cut")}</p>
            </FadeIn>

            {/* Specs */}
            <FadeIn delay={0.2}>
              <div className="mt-10 pt-8 space-y-4" style={{ borderTop: "1px solid hsl(25 10% 85% / 0.5)" }}>
                <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">{t("drop_technical")}</p>
                <div className="grid grid-cols-2 gap-y-3 font-mono-tech text-xs">
                  <span className="text-stone">{t("drop_fit")}</span>
                  <span className="text-foreground">{t("drop_fit_value")}</span>
                  <span className="text-stone">{t("drop_composition")}</span>
                  <span className="text-foreground">{t("drop_composition_value")}</span>
                  <span className="text-stone">{t("drop_weight")}</span>
                  <span className="text-foreground">{t("drop_weight_value")}</span>
                  <span className="text-stone">{t("drop_origin")}</span>
                  <span className="text-foreground">{t("drop_origin_value")}</span>
                  <span className="text-stone">{t("drop_elevation_label")}</span>
                  <span className="text-foreground">{t("drop_elevation_value")}</span>
                </div>
              </div>
            </FadeIn>

            {/* Availability */}
            <FadeIn delay={0.25}>
              <div className="mt-8 pt-8" style={{ borderTop: "1px solid hsl(25 10% 85% / 0.5)" }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-stone font-mono-tech">{t("drop_availability")}</p>
                  <span className={`text-xs font-mono-tech ${isSoldOut ? "text-stone line-through" : "text-foreground"}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="font-mono-tech text-xs text-stone">
                  {t("drop_units_remaining")}: {state.unitsRemaining}/{state.totalUnits}
                </p>
                <div className="mt-3 h-px bg-foreground/10 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-foreground/30 transition-pdra"
                    style={{ width: `${((state.totalUnits - state.unitsRemaining) / state.totalUnits) * 100}%` }}
                  />
                </div>
              </div>
            </FadeIn>

            {/* Prebook / CTA */}
            <FadeIn delay={0.3}>
              <div className="mt-10">
                {alreadyBooked ? (
                  <div className="text-center py-8">
                    <p className="text-foreground text-sm">{t("drop_reserved", { size: state.user.prebookedSize! })}</p>
                    <p className="text-stone text-xs mt-2">{t("drop_production_soon")}</p>
                  </div>
                ) : step === "reserved" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: easing }}
                    className="text-center py-8"
                  >
                    <p className="text-foreground text-sm">{t("drop_secured")}</p>
                    <p className="text-stone text-xs mt-2">{t("drop_production_soon")}</p>
                    <div className="mt-4 h-px bg-foreground/10 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-foreground/30"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: easing }}
                      />
                    </div>
                  </motion.div>
                ) : step === "confirm" ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: easing }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-foreground">{t("drop_confirm_reservation", { size: selectedSize! })}</p>
                    <div className="flex gap-3">
                      <Button variant="pdra" size="lg" className="flex-1" onClick={handleConfirm}>
                        {t("drop_confirm")}
                      </Button>
                      <Button variant="pdra-outline" size="lg" onClick={() => setStep("browse")}>
                        {t("drop_back")}
                      </Button>
                    </div>
                  </motion.div>
                ) : !isLoggedIn ? (
                  <div>
                    <p className="text-xs text-stone mb-3">{t("drop_access_required")}</p>
                    <Link to="/access">
                      <Button variant="pdra" size="lg" className="w-full">{t("drop_request_access")}</Button>
                    </Link>
                  </div>
                ) : !isOpen ? (
                  <div>
                    <Button variant="pdra-outline" size="lg" className="w-full" disabled>
                      {isSoldOut ? t("drop_sold_out") : t("drop_coming_soon")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`flex-1 h-12 text-xs uppercase tracking-[0.1em] rounded-[4px] transition-pdra ${
                            selectedSize === size
                              ? "bg-foreground text-background"
                              : "bg-transparent text-foreground shadow-inner-border hover:bg-surface"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <Button variant="pdra" size="lg" className="w-full" disabled={!selectedSize} onClick={handlePrebook}>
                      {t("drop_prebook")}
                    </Button>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
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

export default MontserratDrop;
