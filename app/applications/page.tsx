import { ApplicationsClient } from "@/components/applications/applications-client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getApplicationsForUser } from "@/lib/queries";

export default async function ApplicationsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getApplicationsForUser(supabase, user!.id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Applications</h2>
      {error ? (
        <p className="text-sm text-destructive">Failed to load applications: {error}</p>
      ) : (
        <ApplicationsClient userId={user!.id} initialApplications={data} />
      )}
    </div>
  );
}
