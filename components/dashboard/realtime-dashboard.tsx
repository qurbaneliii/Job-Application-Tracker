"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/components/providers/supabase-provider";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getApplicationsForUser } from "@/lib/queries";
import type { Application } from "@/lib/types";

type RealtimeDashboardProps = {
  userId: string;
  initialData: Application[];
};

export function RealtimeDashboard({ userId, initialData }: RealtimeDashboardProps) {
  const supabase = useSupabaseClient();
  const [applications, setApplications] = useState<Application[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: queryError } = await getApplicationsForUser(supabase, userId);

      if (queryError) {
        setError(queryError);
      } else {
        setApplications(data);
      }
      setLoading(false);
    };

    void load();

    const channel = supabase
      .channel(`applications-user-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications", filter: `user_id=eq.${userId}` },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Refreshing dashboard...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">Failed to load dashboard: {error}</p>;
  }

  return <DashboardClient applications={applications} />;
}
