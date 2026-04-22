"use client";

import { createContext, useContext, useMemo } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const SupabaseContext = createContext<ReturnType<typeof createBrowserSupabaseClient> | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createBrowserSupabaseClient(), []);

  return <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>;
}

export function useSupabaseClient() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabaseClient must be used within SupabaseProvider");
  }

  return context;
}
