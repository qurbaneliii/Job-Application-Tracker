import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getApplicationsForUser } from "@/lib/queries";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getApplicationsForUser(supabase, user!.id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      {error ? (
        <p className="text-sm text-destructive">Failed to load dashboard: {error}</p>
      ) : (
        <RealtimeDashboard userId={user!.id} initialData={data} />
      )}
    </div>
  );
}
