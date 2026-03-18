import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useLanguage, languageLabels, Language } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const languages: Language[] = ["ca", "en", "es"];

const Header = () => {
  const { state, logout } = useApp();
  const { t, language, setLanguage } = useLanguage();
  const isLoggedIn = !!state.user.email;

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      style={{ background: "linear-gradient(to bottom, hsl(30 20% 94% / 0.9), transparent)" }}
    >
      <Link to="/" className="text-foreground text-lg tracking-[-0.03em]">
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
                language === lang
                  ? "text-foreground"
                  : "text-stone/40 hover:text-stone"
              }`}
            >
              {languageLabels[lang]}
            </button>
          ))}
        </div>

        <span className="w-px h-3 bg-stone/20" />

        <Link
          to="/drop/montserrat"
          className="text-xs uppercase tracking-[0.1em] text-stone hover:text-foreground transition-pdra"
        >
          {t("nav_drop")}
        </Link>
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="text-xs uppercase tracking-[0.1em] text-stone hover:text-foreground transition-pdra"
          >
            {t("nav_logout")}
          </button>
        ) : (
          <Link
            to="/access"
            className="text-xs uppercase tracking-[0.1em] text-stone hover:text-foreground transition-pdra"
          >
            {t("nav_access")}
          </Link>
        )}
        <Link
          to="/admin"
          className="text-xs uppercase tracking-[0.1em] text-muted-foreground/50 hover:text-foreground transition-pdra"
        >
          ·
        </Link>
      </nav>
    </motion.header>
  );
};

export default Header;
