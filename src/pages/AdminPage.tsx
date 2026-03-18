import { motion } from "framer-motion";
import { useApp, DropStatus } from "@/context/AppContext";
import Header from "@/components/Header";

const easing = [0.2, 0, 0, 1] as const;

const AdminPage = () => {
  const { state, setDropStatus } = useApp();

  const statuses: { value: DropStatus; label: string }[] = [
    { value: "coming_soon", label: "Coming Soon" },
    { value: "open", label: "Open" },
    { value: "sold_out", label: "Sold Out" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing }}
          className="w-full max-w-sm"
        >
          <p className="text-xs uppercase tracking-[0.15em] text-stone mb-8 font-mono-tech text-center">
            Admin — Mock Panel
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.1em] text-stone mb-3 font-mono-tech">Drop Status</p>
              <div className="flex gap-2">
                {statuses.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setDropStatus(s.value)}
                    className={`flex-1 h-10 text-xs uppercase tracking-[0.08em] rounded-[4px] transition-pdra ${
                      state.dropStatus === s.value
                        ? "bg-foreground text-background"
                        : "bg-transparent text-foreground shadow-inner-border hover:bg-surface"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6" style={{ borderTop: "1px solid hsl(25 10% 85% / 0.5)" }}>
              <p className="text-xs uppercase tracking-[0.1em] text-stone mb-3 font-mono-tech">Current State</p>
              <div className="space-y-2 font-mono-tech text-xs">
                <div className="flex justify-between">
                  <span className="text-stone">Status</span>
                  <span className="text-foreground">{state.dropStatus.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Units</span>
                  <span className="text-foreground">{state.unitsRemaining}/{state.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">User</span>
                  <span className="text-foreground">{state.user.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Access</span>
                  <span className="text-foreground">{state.user.accessStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPage;
