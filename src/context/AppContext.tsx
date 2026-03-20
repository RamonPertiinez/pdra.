import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

export type DropStatus = "coming_soon" | "open" | "sold_out";
export type AccessStatus = "none" | "requested" | "approved";

export const LAUNCH_DATE_ISO = "2026-05-20T00:00:00.000Z";

const CLUE_PASSWORDS: Record<number, string> = {
  1: "MONTSERRATQR",
  2: "BACKCUT",
  3: "PDRA200526",
};

interface UserState {
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
  requestAccess: (payload: AccessPayload) => void;
  approveAccess: () => void;
  login: (email: string) => void;
  logout: () => void;
  prebook: (size: string) => void;
  setDropStatus: (status: DropStatus) => void;
  unlockClue: (clueId: number, password: string) => UnlockResult;
  isLaunchLive: boolean;
  allCluesUnlocked: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: {
      email: null,
      country: null,
      phone: null,
      accessStatus: "none",
      prebookedSize: null,
      rewardCode: null,
    },
    dropStatus: "coming_soon",
    unitsRemaining: 14,
    totalUnits: 50,
    launchDate: LAUNCH_DATE_ISO,
    unlockedClues: [],
  });

  const isLaunchLive = useMemo(() => new Date() >= new Date(state.launchDate), [state.launchDate]);
  const allCluesUnlocked = state.unlockedClues.length === 3;

  const requestAccess = ({ email, country, phone }: AccessPayload) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        email,
        country,
        phone,
        accessStatus: "approved",
      },
    }));
  };

  const approveAccess = () => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, accessStatus: "approved" },
    }));
  };

  const login = (email: string) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, email, accessStatus: "approved" },
    }));
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      user: {
        email: null,
        country: null,
        phone: null,
        accessStatus: "none",
        prebookedSize: null,
        rewardCode: null,
      },
      unlockedClues: [],
    }));
  };

  const prebook = (size: string) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, prebookedSize: size },
      unitsRemaining: Math.max(0, prev.unitsRemaining - 1),
    }));
  };

  const setDropStatus = (status: DropStatus) => {
    setState((prev) => ({ ...prev, dropStatus: status }));
  };

  const unlockClue = (clueId: number, password: string): UnlockResult => {
    const expectedPassword = CLUE_PASSWORDS[clueId];
    const normalized = password.trim().toUpperCase();

    if (!expectedPassword || normalized !== expectedPassword) {
      return { success: false, alreadyUnlocked: false };
    }

    const alreadyUnlocked = state.unlockedClues.includes(clueId);
    const rewardCode = clueId === 1 ? state.user.rewardCode ?? "MONTSERRAT10" : null;

    setState((prev) => ({
      ...prev,
      unlockedClues: prev.unlockedClues.includes(clueId)
        ? prev.unlockedClues
        : [...prev.unlockedClues, clueId].sort((a, b) => a - b),
      user: {
        ...prev.user,
        rewardCode: clueId === 1 ? prev.user.rewardCode ?? "MONTSERRAT10" : prev.user.rewardCode,
      },
    }));

    return { success: true, alreadyUnlocked, rewardCode };
  };

  return (
    <AppContext.Provider
      value={{
        state,
        requestAccess,
        approveAccess,
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
