import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      requestAccess(email);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative h-screen flex items-end">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Montserrat mountain range at golden hour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, hsl(30 20% 94% / 0.95))" }} />
        </div>
        <div className="relative z-10 px-6 md:px-10 pb-16 md:pb-24 max-w-3xl">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-4 font-mono-tech">Est. Barcelona</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] text-balance">
              The mountain is the pattern.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-stone text-base md:text-lg max-w-md leading-relaxed">
              Each garment follows a ridge. Each cut follows a cliff.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link to="/access">
              <Button variant="pdra" size="xl" className="mt-8">
                Request Early Access
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-8 font-mono-tech">Manifesto</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground leading-[1.4] text-balance">
              pdra. is a study of the Catalan landscape. We do not climb to conquer; we climb to belong.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-stone text-base leading-relaxed max-w-lg">
              Every stitch follows a ridge. Every cut follows a cliff. The mountain is not decoration — it defines the structure of the garment.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Concept: Mountain → Garment */}
      <section className="pb-24 md:pb-40">
        <div className="grid md:grid-cols-2 gap-0">
          <FadeIn className="relative aspect-[4/5] md:aspect-auto">
            <img
              src={climbingImg}
              alt="Climber on Catalan limestone"
              className="w-full h-full object-cover"
            />
          </FadeIn>
          <div className="flex items-center px-6 md:px-16 py-16 md:py-0">
            <div>
              <FadeIn>
                <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">The Concept</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-4xl text-foreground leading-[1.2] text-balance">
                  From mountain to garment.
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-6 text-stone text-base leading-relaxed">
                  Each collection begins with a Catalan mountain range — Montserrat, Pedraforca, Montsant. 
                  We study the topography, trace the ridgelines, and translate them into the architecture of each piece.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="mt-4 text-stone text-base leading-relaxed">
                  The result is clothing that belongs to a place. Not performance wear. Not fashion. Something in between.
                </p>
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
                <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">Drop 001</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-5xl text-foreground leading-[1.1]">
                  MONT SERRAT
                </h2>
              </FadeIn>
              <FadeIn delay={0.15}>
                <p className="mt-2 text-stone italic">A mountain you wear.</p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-8 space-y-3 font-mono-tech text-xs text-stone">
                  <p>Elevation — 1,236m</p>
                  <p>Units — {state.totalUnits} pieces</p>
                  <p>Status — {state.dropStatus === "coming_soon" ? "Coming Soon" : state.dropStatus === "open" ? "Open" : "Sold Out"}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Link to="/drop/montserrat">
                  <Button variant="pdra-outline" size="lg" className="mt-8">
                    View Drop
                  </Button>
                </Link>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} className="relative">
              <img
                src={productJacket}
                alt="Montserrat collection jacket"
                className="w-full rounded-[8px] shadow-soft"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-8 font-mono-tech">Philosophy</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-2xl md:text-3xl text-foreground leading-[1.4] text-balance">
              Connection, not performance.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-stone text-base leading-relaxed max-w-lg mx-auto">
              We believe climbing is an act of listening. The rock speaks through texture, weight, and form. 
              pdra. translates that conversation into clothing you can carry with you — off the wall, into the city.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-24 md:py-40 px-6 md:px-10 bg-surface">
        <div className="max-w-md mx-auto text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-6 font-mono-tech">Stay Close</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-2xl md:text-3xl text-foreground text-balance">
              Be the first to know.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            {submitted || state.user.accessStatus !== "none" ? (
              <div className="mt-8">
                <p className="text-stone text-sm">You're on the list.</p>
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
                  placeholder="your@email.com"
                  required
                  className="w-full h-12 px-4 bg-background text-foreground text-sm rounded-[4px] shadow-inner-border placeholder:text-stone/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-pdra"
                />
                <Button variant="pdra" size="lg" type="submit">
                  Request Access
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-10 flex items-center justify-between">
        <p className="text-xs text-stone">pdra. — Barcelona</p>
        <p className="text-xs text-stone font-mono-tech">© 2026</p>
      </footer>
    </div>
  );
};

export default Index;
