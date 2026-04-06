import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { supabase, type AccessRequest } from "@/lib/supabase";
import Header from "@/components/Header";

const easing = [0.2, 0, 0, 1] as const;

// Canvia aquesta contrasenya per alguna cosa secreta teva
const ADMIN_PASSWORD = "PDRA2026";

const statusColors: Record<string, string> = {
  pending: "border-amber-500/40 bg-amber-500/8 text-amber-300",
  approved: "border-emerald-500/40 bg-emerald-500/8 text-emerald-300",
  denied: "border-red-500/40 bg-red-500/8 text-red-400",
};

const AdminPage = () => {
  const { state, setDropStatus } = useApp();

  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests((data as AccessRequest[]) ?? []);
    setLoadingRequests(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchRequests();

    const channel = supabase
      .channel("admin_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "access_requests" },
        () => fetchRequests()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authed, fetchRequests]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const updateStatus = async (id: string, status: "approved" | "denied") => {
    setActionLoading(id + status);
    await supabase.from("access_requests").update({ status }).eq("id", id);
    setActionLoading(null);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  // ── Password gate ────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0b0a09] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easing }}
          className="w-full max-w-sm"
        >
          <p className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/40 mb-8 text-center">
            Pdra. · Admin
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <motion.div
              animate={passwordError ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Contrasenya"
                autoFocus
                className={`h-12 w-full rounded-[14px] border bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/28 outline-none transition-pdra ${
                  passwordError
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-white/20"
                }`}
              />
            </motion.div>
            <Button variant="pdra" size="lg" type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Admin panel ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0a09] text-white">
      <Header />

      <main className="px-6 pt-28 pb-20 md:px-10 md:pt-32">
        <div className="mx-auto max-w-5xl">

          {/* Capçalera */}
          <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
            <div>
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/40">
                Pdra. · Panel d'administració
              </p>
              <h1 className="mt-3 text-4xl text-white">Control del drop</h1>
            </div>

            {/* Botons d'estat del drop */}
            <div className="flex items-center gap-2">
              {(["coming_soon", "open", "sold_out"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setDropStatus(s)}
                  className={`rounded-full border px-4 py-2 font-mono-tech text-[10px] uppercase tracking-[0.16em] transition-pdra ${
                    state.dropStatus === s
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Sol·licituds totals", value: requests.length },
              { label: "Pendents", value: pendingRequests.length },
              { label: "Aprovats", value: requests.filter((r) => r.status === "approved").length },
              { label: "Unitats restants", value: `${state.unitsRemaining}/${state.totalUnits}` },
            ].map((s) => (
              <div key={s.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/40">{s.label}</p>
                <p className="mt-2 text-2xl text-white font-mono-tech">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Sol·licituds pendents — destacades */}
          <AnimatePresence>
            {pendingRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: easing }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Pendents d'aprovació
                  </p>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black">
                    {pendingRequests.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, ease: easing }}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-amber-500/25 bg-amber-500/5 p-5"
                    >
                      <div>
                        <p className="text-white font-medium">{req.email}</p>
                        <p className="mt-1 text-xs text-white/45 font-mono-tech">
                          {[req.country, req.phone, new Date(req.created_at).toLocaleString("ca-ES", { dateStyle: "short", timeStyle: "short" })]
                            .filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="pdra"
                          disabled={!!actionLoading}
                          onClick={() => updateStatus(req.id, "approved")}
                          className="text-xs px-5"
                        >
                          {actionLoading === req.id + "approved" ? "..." : "Aprovar"}
                        </Button>
                        <button
                          disabled={!!actionLoading}
                          onClick={() => updateStatus(req.id, "denied")}
                          className="rounded-full border border-white/15 px-5 py-2 font-mono-tech text-[10px] uppercase tracking-[0.12em] text-white/50 hover:border-red-500/40 hover:text-red-400 transition-pdra"
                        >
                          {actionLoading === req.id + "denied" ? "..." : "Denegar"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Taula de totes les sol·licituds */}
          <div>
            <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">
              Totes les sol·licituds
            </p>

            {loadingRequests ? (
              <div className="py-12 text-center text-white/30 text-sm">Carregant...</div>
            ) : requests.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-white/10 p-10 text-center text-white/30 text-sm">
                Encara no hi ha sol·licituds
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.02]">
                      {["Email", "País", "Pistes", "Reserva", "Estat", ""].map((h) => (
                        <th key={h} className={`text-left px-5 py-3 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/35 ${h === "" || h === "Pistes" || h === "Reserva" ? "hidden md:table-cell" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-pdra">
                        <td className="px-5 py-4 text-white/80">{req.email}</td>
                        <td className="px-5 py-4 text-white/45 hidden md:table-cell">{req.country ?? "—"}</td>
                        <td className="px-5 py-4 text-white/45 hidden md:table-cell font-mono-tech">{(req.unlocked_clues ?? []).length}/3</td>
                        <td className="px-5 py-4 text-white/45 hidden md:table-cell font-mono-tech">{req.prebooked_size ?? "—"}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full border px-3 py-1 font-mono-tech text-[10px] uppercase tracking-[0.14em] ${statusColors[req.status] ?? ""}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          {req.status === "pending" && (
                            <div className="flex gap-3 justify-end">
                              <button onClick={() => updateStatus(req.id, "approved")} disabled={!!actionLoading} className="font-mono-tech text-[10px] uppercase tracking-[0.1em] text-emerald-400 hover:text-emerald-300 transition-pdra">Aprovar</button>
                              <button onClick={() => updateStatus(req.id, "denied")} disabled={!!actionLoading} className="font-mono-tech text-[10px] uppercase tracking-[0.1em] text-red-400 hover:text-red-300 transition-pdra">Denegar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
