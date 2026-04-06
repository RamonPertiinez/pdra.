import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import AccessPage from "./pages/AccessPage";
import AdminPage from "./pages/AdminPage";
import MontserratDrop from "./pages/MontserratDrop";
import NotFound from "./pages/NotFound";

import { AppProvider, useApp } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";

// Ruta protegida: redirigeix a /access si l'usuari no està aprovat
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();

  // Mentre carrega des de Supabase, no redirigim
  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0a09]">
        <span className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-white/30 animate-pulse">
          pdra.
        </span>
      </div>
    );
  }

  if (state.user.accessStatus !== "approved") {
    return <Navigate to="/access" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/access" element={<AccessPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/drop/montserrat"
              element={
                <ProtectedRoute>
                  <MontserratDrop />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
