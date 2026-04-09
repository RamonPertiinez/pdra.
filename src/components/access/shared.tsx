import { motion } from "framer-motion";

export const ease = [0.2, 0, 0, 1] as const;

export const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.75, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-border bg-surface/50 px-4 py-1.5 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
    {children}
  </span>
);

export const LockIcon = ({ unlocked }: { unlocked: boolean }) => (
  <motion.svg
    key={unlocked ? "open" : "closed"}
    initial={{ scale: 0.7, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.25, ease }}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    {unlocked ? (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    ) : (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    )}
  </motion.svg>
);
