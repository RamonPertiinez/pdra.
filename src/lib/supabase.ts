import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ──────────────────────────────────────────────────────
export interface AccessRequest {
  id: string;
  email: string;
  phone: string | null;
  country: string | null;
  status: "pending" | "approved" | "denied";
  unlocked_clues: number[];
  reward_code: string | null;
  prebooked_size: string | null;
  created_at: string;
  updated_at: string;
}

export interface DropConfig {
  id: number;
  drop_status: "coming_soon" | "open" | "sold_out";
  units_remaining: number;
  total_units: number;
  launch_date: string;
}

// ── Owner whitelist (env-configured) ──────────────────────────
const ownerEmails = (import.meta.env.VITE_OWNER_EMAILS ?? "")
  .split(",")
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

const ownerPhones = (import.meta.env.VITE_OWNER_PHONES ?? "")
  .split(",")
  .map((p: string) => p.trim().replace(/\s/g, ""))
  .filter(Boolean);

export function isOwner(email?: string | null, phone?: string | null): boolean {
  if (email && ownerEmails.includes(email.trim().toLowerCase())) return true;
  if (phone && ownerPhones.includes(phone.trim().replace(/\s/g, ""))) return true;
  return false;
}
