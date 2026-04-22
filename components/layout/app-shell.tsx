"use client";

import { usePathname } from "next/navigation";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SupabaseProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar pathname={pathname} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </SupabaseProvider>
  );
}
