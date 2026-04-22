import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Application } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user!.id)
    .order("application_date", { ascending: false });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      {error ? (
        <p className="text-sm text-destructive">Failed to load dashboard: {error.message}</p>
      ) : (
        <RealtimeDashboard userId={user!.id} initialData={(data as Application[]) ?? []} />
      )}
    </div>
  );
}
