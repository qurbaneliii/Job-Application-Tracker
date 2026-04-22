"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { ApplicationFormDialog } from "@/components/applications/application-form-dialog";
import { ApplicationsTable } from "@/components/applications/applications-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseClient } from "@/components/providers/supabase-provider";
import type { Application, ApplicationInput, ApplicationStatus } from "@/lib/types";

type ApplicationsClientProps = {
  userId: string;
  initialApplications: Application[];
};

export function ApplicationsClient({ userId, initialApplications }: ApplicationsClientProps) {
  const supabase = useSupabaseClient();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const statusMatch = statusFilter === "all" || app.status === statusFilter;
      const searchTerm = search.toLowerCase();
      const searchMatch =
        app.company.toLowerCase().includes(searchTerm) ||
        app.position.toLowerCase().includes(searchTerm) ||
        (app.location ?? "").toLowerCase().includes(searchTerm) ||
        (app.source ?? "").toLowerCase().includes(searchTerm);

      return statusMatch && searchMatch;
    });
  }, [applications, search, statusFilter]);

  const createApplication = async (value: ApplicationInput) => {
    setLoading(true);
    setError(null);

    const payload = mapInputToPayload(value);
    const { data, error: queryError } = await supabase
      .from("applications")
      .insert({ ...payload, user_id: userId })
      .select("*")
      .single();

    if (queryError) {
      setError(queryError.message);
    } else if (data) {
      setApplications((current) => [data as Application, ...current]);
    }

    setLoading(false);
  };

  const updateApplication = async (id: string, value: ApplicationInput) => {
    setLoading(true);
    setError(null);

    const payload = mapInputToPayload(value);
    const { data, error: queryError } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (queryError) {
      setError(queryError.message);
    } else if (data) {
      setApplications((current) => current.map((item) => (item.id === id ? (data as Application) : item)));
    }

    setLoading(false);
  };

  const changeStatus = async (id: string, status: ApplicationStatus) => {
    const application = applications.find((item) => item.id === id);
    if (!application) {
      setError("Application not found for status update.");
      return;
    }

    await updateApplication(id, mapApplicationToInput({ ...application, status }));
  };

  const removeApplication = async (id: string) => {
    setLoading(true);
    setError(null);

    const { error: queryError } = await supabase.from("applications").delete().eq("id", id).eq("user_id", userId);

    if (queryError) {
      setError(queryError.message);
    } else {
      setApplications((current) => current.filter((item) => item.id !== id));
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, role, source..."
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPLICATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ApplicationFormDialog
          mode="create"
          onSubmit={createApplication}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Application
            </Button>
          }
        />
      </div>
      {loading ? <p className="text-sm text-muted-foreground">Saving changes...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <ApplicationsTable
        applications={filtered}
        onUpdate={updateApplication}
        onDelete={removeApplication}
        onStatusChange={changeStatus}
      />
    </div>
  );
}

function mapInputToPayload(input: ApplicationInput) {
  return {
    ...input,
    location: nullable(input.location),
    source: nullable(input.source),
    contact_person: nullable(input.contact_person),
    contact_email: nullable(input.contact_email),
    cv_version: nullable(input.cv_version),
    interview_date: nullable(input.interview_date),
    follow_up_date: nullable(input.follow_up_date),
    notes: nullable(input.notes),
    job_post_link: nullable(input.job_post_link),
  };
}

function mapApplicationToInput(value: Application): ApplicationInput {
  return {
    company: value.company,
    position: value.position,
    location: value.location ?? "",
    work_type: value.work_type,
    application_date: value.application_date,
    status: value.status,
    source: value.source ?? "",
    contact_person: value.contact_person ?? "",
    contact_email: value.contact_email ?? "",
    cv_version: value.cv_version ?? "",
    interview_date: value.interview_date ?? "",
    follow_up_date: value.follow_up_date ?? "",
    notes: value.notes ?? "",
    job_post_link: value.job_post_link ?? "",
  };
}

function nullable(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : null;
}
