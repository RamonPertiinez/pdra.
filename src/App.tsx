import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Access from "./pages/Access";
import Drop from "./pages/Drop";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/access" element={<Access />} />
        <Route path="/drop/:id" element={<Drop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
