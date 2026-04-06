import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useLanguage, languageLabels, Language } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const languages: Language[] = ["ca", "en", "es"];

const DARK_ROUTES = ["/access", "/drop/montserrat"];

const Header = () => {
  const { state, logout } = useApp();
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const isLoggedIn = !!state.user.email;

  // Determine if we're on a dark-background page
  const isDark = DARK_ROUTES.some((route) => location.pathname === route || location.pathname.startsWith(route));

  const bgStyle = isDark
    ? "linear-gradient(to bottom, rgba(11,10,9,0.92), transparent)"
    : "linear-gradient(to bottom, hsl(30 20% 94% / 0.9), transparent)";

  const textBase = isDark ? "text-white/70 hover:text-white" : "text-stone hover:text-foreground";
  const textActive = isDark ? "text-white" : "text-foreground";
  const logoPrimary = isDark ? "text-white" : "text-foreground";
  const dividerColor = isDark ? "bg-white/15" : "bg-stone/20";

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      style={{ background: bgStyle }}
    >
      <Link to="/" className={`text-lg tracking-[-0.03em] transition-pdra ${logoPrimary}`}>
        pdra.
      </Link>

      <nav className="flex items-center gap-6">
        {/* Language Switcher */}
        <div className="flex items-center gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[10px] uppercase tracking-[0.08em] transition-pdra ${
                language === lang ? textActive : `${textBase} opacity-40`
              }`}
            >
              {languageLabels[lang]}
            </button>
          ))}
        </div>

        <span className={`w-px h-3 ${dividerColor}`} />

        {/* Clue progress dots — visible when logged in */}
        {isLoggedIn && (
          <>
            <div className="flex items-center gap-1.5" title={`${state.unlockedClues.length}/3 pistes desbloqueides`}>
              {[1, 2, 3].map((n) => (
                <motion.span
                  key={n}
                  initial={{ scale: 0.6, opacity: 0.3 }}
                  animate={{
                    scale: state.unlockedClues.includes(n) ? 1 : 0.7,
                    opacity: state.unlockedClues.includes(n) ? 1 : 0.25,
                  }}
                  transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                  className={`block h-1.5 w-1.5 rounded-full ${
                    isDark ? "bg-white" : "bg-foreground"
                  }`}
                />
              ))}
            </div>
            <span className={`w-px h-3 ${dividerColor}`} />
          </>
        )}

        <Link
          to="/drop/montserrat"
          className={`text-xs uppercase tracking-[0.1em] transition-pdra ${textBase}`}
        >
          {t("nav_drop")}
        </Link>

        {isLoggedIn ? (
          <button
            onClick={logout}
            className={`text-xs uppercase tracking-[0.1em] transition-pdra ${textBase}`}
          >
            {t("nav_logout")}
          </button>
        ) : (
          <Link
            to="/access"
            className={`text-xs uppercase tracking-[0.1em] transition-pdra ${textBase}`}
          >
            {t("nav_access")}
          </Link>
        )}

        <Link
          to="/admin"
          className={`relative text-xs uppercase tracking-[0.1em] transition-pdra ${isDark ? "text-white/20 hover:text-white/50" : "text-muted-foreground/50 hover:text-foreground"}`}
        >
          ·
          {state.pendingCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] font-bold text-black"
            >
              {state.pendingCount > 9 ? "9+" : state.pendingCount}
            </motion.span>
          )}
        </Link>
      </nav>
    </motion.header>
  );
};

export default Header;
