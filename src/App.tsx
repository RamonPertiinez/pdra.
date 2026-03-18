import { HashRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import AccessPage from "./pages/AccessPage";
import AdminPage from "./pages/AdminPage";
import MontserratDrop from "./pages/MontserratDrop";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/access" element={<AccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/drop/montserrat" element={<MontserratDrop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
