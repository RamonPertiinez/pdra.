import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

const Header = () => {
  const { state, logout } = useApp();
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
        <Link
          to="/drop/montserrat"
          className="text-xs uppercase tracking-[0.1em] text-stone hover:text-foreground transition-pdra"
        >
          Drop
        </Link>
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="text-xs uppercase tracking-[0.1em] text-stone hover:text-foreground transition-pdra"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/access"
            className="text-xs uppercase tracking-[0.1em] text-stone hover:text-foreground transition-pdra"
          >
            Access
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
