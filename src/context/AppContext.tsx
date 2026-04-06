import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { supabase, supabaseConfigured, isOwner, type AccessRequest, type DropConfig } from "@/lib/supabase";

export type DropStatus = "coming_soon" | "open" | "sold_out";
export type AccessStatus = "none" | "pending" | "approved" | "denied";

export const LAUNCH_DATE_ISO = "2026-05-20T00:00:00.000Z";

const CLUE_PASSWORDS: Record<number, string> = {
  1: "MONTSERRATQR",
  2: "BACKCUT",
  3: "PDRA200526",
};

interface UserState {
  id: string | null;
  email: string | null;
  country: string | null;
  phone: string | null;
  accessStatus: AccessStatus;
  prebookedSize: string | null;
  rewardCode: string | null;
}

interface AppState {
  user: UserState;
  dropStatus: DropStatus;
  unitsRemaining: number;
  totalUnits: number;
  launchDate: string;
  unlockedClues: number[];
  pendingCount: number; // badge for admin
  loading: boolean;
}

interface AccessPayload {
  email: string;
  country: string;
  phone: string;
}

interface UnlockResult {
  success: boolean;
  alreadyUnlocked: boolean;
  rewardCode?: string | null;
}

interface AppContextType {
  state: AppState;
  requestAccess: (payload: AccessPayload) => Promise<void>;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  prebook: (size: string) => Promise<void>;
  setDropStatus: (status: DropStatus) => Promise<void>;
  unlockClue: (clueId: number, password: string) => Promise<UnlockResult>;
  isLaunchLive: boolean;
  allCluesUnlocked: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_USER: UserState = {
  id: null,
  email: null,
  country: null,
  phone: null,
  accessStatus: "none",
  prebookedSize: null,
  rewardCode: null,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: DEFAULT_USER,
    dropStatus: "coming_soon",
    unitsRemaining: 14,
    totalUnits: 50,
    launchDate: LAUNCH_DATE_ISO,
    unlockedClues: [],
    pendingCount: 0,
    loading: true,
  });

  // ── Load drop config from Supabase on mount ─────────────────
  useEffect(() => {
    if (!supabaseConfigured) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }
    supabase
      .from("drop_config")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!data) { setState((prev) => ({ ...prev, loading: false })); return; }
        const cfg = data as DropConfig;
        setState((prev) => ({
          ...prev,
          dropStatus: cfg.drop_status,
          unitsRemaining: cfg.units_remaining,
          totalUnits: cfg.total_units,
          launchDate: cfg.launch_date,
          loading: false,
        }));
      });
  }, []);

  // ── Load pending count for admin badge ──────────────────────
  const refreshPendingCount = useCallback(async () => {
    if (!supabaseConfigured) return;
    const { count } = await supabase
      .from("access_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    setState((prev) => ({ ...prev, pendingCount: count ?? 0 }));
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;
    refreshPendingCount();

    // Realtime subscription — update badge on new requests
    const channel = supabase
      .channel("access_requests_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "access_requests" },
        () => refreshPendingCount()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [refreshPendingCount]);

  const isLaunchLive = useMemo(
    () => new Date() >= new Date(state.launchDate),
    [state.launchDate]
  );
  const allCluesUnlocked = state.unlockedClues.length === 3;

  // ── requestAccess ───────────────────────────────────────────
  const requestAccess = useCallback(async ({ email, country, phone }: AccessPayload) => {
    const owner = isOwner(email, phone);
    const status = owner ? "approved" : "pending";
    const rewardCode = null;

    // Upsert by email
    const { data, error } = await supabase
      .from("access_requests")
      .upsert(
        { email: email.trim().toLowerCase(), country, phone, status },
        { onConflict: "email", ignoreDuplicates: false }
      )
      .select()
      .single();

    if (error || !data) return;

    const row = data as AccessRequest;
    setState((prev) => ({
      ...prev,
      user: {
        id: row.id,
        email: row.email,
        country: row.country,
        phone: row.phone,
        accessStatus: row.status,
        prebookedSize: row.prebooked_size,
        rewardCode: row.reward_code,
      },
      unlockedClues: row.unlocked_clues ?? [],
    }));
  }, []);

  // ── login (check by email) ──────────────────────────────────
  const login = useCallback(async (email: string): Promise<boolean> => {
    const { data } = await supabase
      .from("access_requests")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (!data) return false;
    const row = data as AccessRequest;

    setState((prev) => ({
      ...prev,
      user: {
        id: row.id,
        email: row.email,
        country: row.country,
        phone: row.phone,
        accessStatus: row.status,
        prebookedSize: row.prebooked_size,
        rewardCode: row.reward_code,
      },
      unlockedClues: row.unlocked_clues ?? [],
    }));
    return true;
  }, []);

  // ── logout ──────────────────────────────────────────────────
  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: DEFAULT_USER, unlockedClues: [] }));
  }, []);

  // ── unlockClue ──────────────────────────────────────────────
  const unlockClue = useCallback(
    async (clueId: number, password: string): Promise<UnlockResult> => {
      const expected = CLUE_PASSWORDS[clueId];
      if (!expected || password.trim().toUpperCase() !== expected) {
        return { success: false, alreadyUnlocked: false };
      }

      if (state.unlockedClues.includes(clueId)) {
        return { success: true, alreadyUnlocked: true, rewardCode: state.user.rewardCode };
      }

      const newUnlocked = [...state.unlockedClues, clueId].sort((a, b) => a - b);
      const newRewardCode = clueId === 1 ? "MONTSERRAT10" : state.user.rewardCode;

      if (state.user.id) {
        await supabase
          .from("access_requests")
          .update({
            unlocked_clues: newUnlocked,
            reward_code: newRewardCode ?? state.user.rewardCode,
          })
          .eq("id", state.user.id);
      }

      setState((prev) => ({
        ...prev,
        unlockedClues: newUnlocked,
        user: { ...prev.user, rewardCode: newRewardCode ?? prev.user.rewardCode },
      }));

      return { success: true, alreadyUnlocked: false, rewardCode: newRewardCode };
    },
    [state.unlockedClues, state.user]
  );

  // ── prebook ─────────────────────────────────────────────────
  const prebook = useCallback(async (size: string) => {
    if (state.user.id) {
      await supabase
        .from("access_requests")
        .update({ prebooked_size: size })
        .eq("id", state.user.id);

      await supabase
        .from("drop_config")
        .update({ units_remaining: Math.max(0, state.unitsRemaining - 1) })
        .eq("id", 1);
    }

    setState((prev) => ({
      ...prev,
      user: { ...prev.user, prebookedSize: size },
      unitsRemaining: Math.max(0, prev.unitsRemaining - 1),
    }));
  }, [state.user, state.unitsRemaining]);

  // ── setDropStatus (admin) ───────────────────────────────────
  const setDropStatus = useCallback(async (status: DropStatus) => {
    await supabase.from("drop_config").update({ drop_status: status }).eq("id", 1);
    setState((prev) => ({ ...prev, dropStatus: status }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        requestAccess,
        login,
        logout,
        prebook,
        setDropStatus,
        unlockClue,
        isLaunchLive,
        allCluesUnlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
