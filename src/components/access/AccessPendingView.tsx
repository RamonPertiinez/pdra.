import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { FadeUp, Tag } from "./shared";

const AccessPendingView = () => {
  const { state, logout } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
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

            <h1 className="mt-7 text-4xl leading-[0.95] text-foreground">
              Estem<br />
              <span className="text-muted-foreground">revisant-ho.</span>
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              La teva sol·licitud ha estat rebuda. Rebràs accés quan sigui aprovada manualment — normalment en menys de 24h.
            </p>

            <div className="mt-10 rounded-2xl border border-border bg-surface/50 p-5">
              <p className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                Sol·licitud registrada com a
              </p>
              <p className="mt-2 text-sm text-foreground/70">{state.user.email}</p>
            </div>

            <button
              onClick={logout}
              className="mt-10 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 transition-all hover:text-muted-foreground"
            >
              Tancar sessió
            </button>
          </FadeUp>
        </div>
      </main>
    </div>
  );
};

export default AccessPendingView;
