import { z } from "zod";
import { APPLICATION_STATUSES, WORK_TYPES } from "@/lib/constants";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const applicationSchema = z.object({
  company: z.string().trim().min(2, "Company is required"),
  position: z.string().trim().min(2, "Position is required"),
  location: optionalString,
  work_type: z.enum(WORK_TYPES),
  application_date: z.string().min(1, "Application date is required"),
  status: z.enum(APPLICATION_STATUSES),
  source: optionalString,
  contact_person: optionalString,
  contact_email: optionalString.refine(
    (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Invalid email",
  ),
  cv_version: optionalString,
  interview_date: optionalString,
  follow_up_date: optionalString,
  notes: optionalString,
  job_post_link: optionalString.refine(
    (value) => !value || /^https?:\/\/.+/.test(value),
    "Invalid URL",
  ),
});

export type ApplicationFormSchema = z.infer<typeof applicationSchema>;
