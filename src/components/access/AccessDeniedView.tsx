import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { FadeUp, Tag } from "./shared";

const AccessDeniedView = () => {
  const { logout } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-white">
      <Header />
      <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <FadeUp>
            <Tag>Accés no autoritzat</Tag>

            <h1 className="mt-7 text-4xl leading-[0.95] text-white">
              Accés<br />
              <span className="text-red-400/60">denegat.</span>
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-white/44">
              La teva sol·licitud no ha estat acceptada en aquesta fase. Si creus que és un error, contacta'ns directament.
            </p>

            <button
              onClick={logout}
              className="mt-10 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white/20 transition-all hover:text-white/44"
            >
              Tornar enrere
            </button>
          </FadeUp>
        </div>
      </main>
    </div>
  );
};

export default AccessDeniedView;
