import type { SupabaseClient } from "@supabase/supabase-js";
import type { Application, ApplicationInput, ApplicationStatus, Database } from "@/lib/types";

type TypedClient = SupabaseClient<Database>;

function mapErrorMessage(message: string) {
  if (message.includes("Could not find the table") || message.includes("relation \"public.applications\" does not exist")) {
    return "Could not find table public.applications. Run supabase-schema.sql in your Supabase SQL editor.";
  }
  return message;
}

function toNullable(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export function normalizeApplicationInput(input: ApplicationInput): ApplicationInput {
  return {
    ...input,
    company: input.company.trim(),
    position: input.position.trim(),
    job_link: toNullable(input.job_link),
    location: toNullable(input.location),
    interview_date: toNullable(input.interview_date),
    follow_up_date: toNullable(input.follow_up_date),
    contact_person: toNullable(input.contact_person),
    contact_email: toNullable(input.contact_email),
    notes: toNullable(input.notes),
  };
}

export function computeResponseTimeDays(applicationDate: string) {
  const appliedAt = new Date(`${applicationDate}T00:00:00Z`).getTime();
  const now = Date.now();
  const diff = now - appliedAt;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function isFollowUpOverdue(application: Application) {
  if (!application.follow_up_date) {
    return false;
  }
  if (application.status === "offer" || application.status === "rejected" || application.status === "no_response") {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUpDate = new Date(`${application.follow_up_date}T00:00:00`);
  return followUpDate.getTime() < today.getTime();
}

export async function getApplicationsForUser(supabase: TypedClient, userId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("application_date", { ascending: false });

  if (error) {
    return { data: [] as Application[], error: mapErrorMessage(error.message) };
  }

  return { data: (data ?? []) as Application[], error: null };
}

export async function createApplicationForUser(supabase: TypedClient, userId: string, input: ApplicationInput) {
  const payload = normalizeApplicationInput(input);
  const { data, error } = await supabase
    .from("applications")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();

  if (error) {
    return { data: null, error: mapErrorMessage(error.message) };
  }

  return { data: data as Application, error: null };
}

export async function updateApplicationForUser(
  supabase: TypedClient,
  userId: string,
  id: string,
  input: ApplicationInput,
) {
  const payload = normalizeApplicationInput(input);
  const { data, error } = await supabase
    .from("applications")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    return { data: null, error: mapErrorMessage(error.message) };
  }

  return { data: data as Application, error: null };
}

export async function updateApplicationStatusForUser(
  supabase: TypedClient,
  userId: string,
  id: string,
  status: ApplicationStatus,
) {
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    return { data: null, error: mapErrorMessage(error.message) };
  }

  return { data: data as Application, error: null };
}

export async function deleteApplicationForUser(supabase: TypedClient, userId: string, id: string) {
  const { error } = await supabase.from("applications").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    return { error: mapErrorMessage(error.message) };
  }

  return { error: null };
}
