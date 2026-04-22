import { z } from "zod";
import { APPLICATION_SOURCES, APPLICATION_STATUSES, WORK_TYPES } from "@/lib/constants";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const applicationSchema = z.object({
  company: z.string().trim().min(2, "Company is required"),
  position: z.string().trim().min(2, "Position is required"),
  job_link: optionalString.refine(
    (value) => !value || /^https?:\/\/.+/.test(value),
    "Invalid URL",
  ),
  location: optionalString,
  work_type: z.enum(WORK_TYPES),
  status: z.enum(APPLICATION_STATUSES),
  source: z.enum(APPLICATION_SOURCES),
  application_date: z.string().min(1, "Application date is required"),
  interview_date: optionalString,
  follow_up_date: optionalString,
  contact_person: optionalString,
  contact_email: optionalString.refine(
    (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Invalid email",
  ),
  notes: optionalString,
});

export type ApplicationFormSchema = z.infer<typeof applicationSchema>;
