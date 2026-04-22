import { APPLICATION_SOURCES, APPLICATION_STATUSES, WORK_TYPES } from "@/lib/constants";

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type WorkType = (typeof WORK_TYPES)[number];
export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export type Application = {
  id: string;
  user_id: string;
  company: string;
  position: string;
  job_link: string | null;
  location: string | null;
  work_type: WorkType;
  status: ApplicationStatus;
  source: ApplicationSource;
  application_date: string;
  interview_date: string | null;
  follow_up_date: string | null;
  contact_person: string | null;
  contact_email: string | null;
  notes: string | null;
  created_at: string;
};

export type ApplicationInput = Omit<Application, "id" | "user_id" | "created_at">;

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          position: string;
          job_link?: string | null;
          location?: string | null;
          work_type?: WorkType;
          status?: ApplicationStatus;
          source?: ApplicationSource;
          application_date: string;
          interview_date?: string | null;
          follow_up_date?: string | null;
          contact_person?: string | null;
          contact_email?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          position?: string;
          job_link?: string | null;
          location?: string | null;
          work_type?: WorkType;
          status?: ApplicationStatus;
          source?: ApplicationSource;
          application_date?: string;
          interview_date?: string | null;
          follow_up_date?: string | null;
          contact_person?: string | null;
          contact_email?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
