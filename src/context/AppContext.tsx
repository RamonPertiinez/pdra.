import React, { createContext, useContext, useState, ReactNode } from "react";

export type DropStatus = "coming_soon" | "open" | "sold_out";

interface UserState {
  email: string | null;
  accessStatus: "none" | "requested" | "approved";
  prebookedSize: string | null;
}

interface AppState {
  user: UserState;
  dropStatus: DropStatus;
  unitsRemaining: number;
  totalUnits: number;
}

interface AppContextType {
  state: AppState;
  requestAccess: (email: string) => void;
  approveAccess: () => void;
  login: (email: string) => void;
  logout: () => void;
  prebook: (size: string) => void;
  setDropStatus: (status: DropStatus) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: {
      email: null,
      accessStatus: "none",
      prebookedSize: null,
    },
    dropStatus: "coming_soon",
    unitsRemaining: 14,
    totalUnits: 50,
  });

  const requestAccess = (email: string) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, email, accessStatus: "requested" },
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
      user: { email: null, accessStatus: "none", prebookedSize: null },
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

  return (
    <AppContext.Provider
      value={{ state, requestAccess, approveAccess, login, logout, prebook, setDropStatus }}
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
