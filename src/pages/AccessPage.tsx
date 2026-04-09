import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import AccessRequestView from "@/components/access/AccessRequestView";
import AccessPendingView from "@/components/access/AccessPendingView";
import AccessDeniedView from "@/components/access/AccessDeniedView";
import ClueHub from "@/components/access/ClueHub";

const AccessPage = () => {
  const { state } = useApp();
  const accessStatus = state.user.accessStatus;

  // ── Loading ──────────────────────────────────────────────────────
  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.span
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono-tech text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          pdra.
        </motion.span>
      </div>
    );
  }

  // ── Route per estat ─────────────────────────────────────────────
  switch (accessStatus) {
    case "none":
      return <AccessRequestView />;
    case "pending":
      return <AccessPendingView />;
    case "denied":
      return <AccessDeniedView />;
    case "approved":
      return <ClueHub />;
    default:
      return <AccessRequestView />;
  }
};

export default AccessPage;
