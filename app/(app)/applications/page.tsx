import { ApplicationsClient } from "@/components/applications/applications-client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Application } from "@/lib/types";

export default async function ApplicationsPage() {
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
      <h2 className="text-2xl font-semibold">Applications</h2>
      {error ? (
        <p className="text-sm text-destructive">Failed to load applications: {error.message}</p>
      ) : (
        <ApplicationsClient userId={user!.id} initialApplications={(data as Application[]) ?? []} />
      )}
    </div>
  );
}
