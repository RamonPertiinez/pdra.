import { HashRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import AccessPage from "./pages/AccessPage";
import AdminPage from "./pages/AdminPage";
import MontserratDrop from "./pages/MontserratDrop";
import NotFound from "./pages/NotFound";

import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/access" element={<AccessPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/drop/montserrat" element={<MontserratDrop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
