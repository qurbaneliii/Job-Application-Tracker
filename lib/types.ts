import { APPLICATION_STATUSES, WORK_TYPES } from "@/lib/constants";

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type WorkType = (typeof WORK_TYPES)[number];

export type Application = {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  work_type: WorkType;
  application_date: string;
  status: ApplicationStatus;
  source: string | null;
  contact_person: string | null;
  contact_email: string | null;
  cv_version: string | null;
  interview_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
  job_post_link: string | null;
  response_time_days: number | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationInput = Omit<
  Application,
  "id" | "user_id" | "response_time_days" | "created_at" | "updated_at"
>;
