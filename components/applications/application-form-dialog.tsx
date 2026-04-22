"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { APPLICATION_STATUSES, WORK_TYPES } from "@/lib/constants";
import { applicationSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Application, ApplicationInput } from "@/lib/types";

const defaultValues: ApplicationInput = {
  company: "",
  position: "",
  location: "",
  work_type: "Remote",
  application_date: new Date().toISOString().slice(0, 10),
  status: "Applied",
  source: "",
  contact_person: "",
  contact_email: "",
  cv_version: "",
  interview_date: "",
  follow_up_date: "",
  notes: "",
  job_post_link: "",
};

type ApplicationFormDialogProps = {
  mode: "create" | "edit";
  value?: Application;
  trigger: React.ReactNode;
  onSubmit: (value: ApplicationInput) => Promise<void>;
};

export function ApplicationFormDialog({ mode, value, trigger, onSubmit }: ApplicationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ApplicationInput>(value ? mapToInput(value) : defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => (mode === "create" ? "Add Application" : "Edit Application"), [mode]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setForm(value ? mapToInput(value) : defaultValues);
      setErrors({});
    }
  };

  const update = <K extends keyof ApplicationInput>(key: K, val: ApplicationInput[K]) => {
    setForm((current) => ({ ...current, [key]: val }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const parsed = applicationSchema.parse(form);
      const normalized: ApplicationInput = {
        ...parsed,
        location: parsed.location || "",
        source: parsed.source || "",
        contact_person: parsed.contact_person || "",
        contact_email: parsed.contact_email || "",
        cv_version: parsed.cv_version || "",
        interview_date: parsed.interview_date || "",
        follow_up_date: parsed.follow_up_date || "",
        notes: parsed.notes || "",
        job_post_link: parsed.job_post_link || "",
      };
      await onSubmit(normalized);
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = Object.fromEntries(error.issues.map((issue) => [issue.path[0]?.toString(), issue.message]));
        setErrors(fieldErrors);
      } else {
        setErrors({ form: "Unexpected error happened." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Field label="Company" error={errors.company}>
            <Input value={form.company} onChange={(e) => update("company", e.target.value)} />
          </Field>
          <Field label="Position" error={errors.position}>
            <Input value={form.position} onChange={(e) => update("position", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={form.location ?? ""} onChange={(e) => update("location", e.target.value)} />
          </Field>
          <Field label="Work Type">
            <Select value={form.work_type} onValueChange={(v) => update("work_type", v as ApplicationInput["work_type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORK_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Application Date" error={errors.application_date}>
            <Input type="date" value={form.application_date} onChange={(e) => update("application_date", e.target.value)} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => update("status", v as ApplicationInput["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Source">
            <Input value={form.source ?? ""} onChange={(e) => update("source", e.target.value)} />
          </Field>
          <Field label="Contact Person">
            <Input value={form.contact_person ?? ""} onChange={(e) => update("contact_person", e.target.value)} />
          </Field>
          <Field label="Contact Email" error={errors.contact_email}>
            <Input
              type="email"
              value={form.contact_email ?? ""}
              onChange={(e) => update("contact_email", e.target.value)}
            />
          </Field>
          <Field label="CV Version">
            <Input value={form.cv_version ?? ""} onChange={(e) => update("cv_version", e.target.value)} />
          </Field>
          <Field label="Interview Date">
            <Input type="date" value={form.interview_date ?? ""} onChange={(e) => update("interview_date", e.target.value)} />
          </Field>
          <Field label="Follow Up Date">
            <Input type="date" value={form.follow_up_date ?? ""} onChange={(e) => update("follow_up_date", e.target.value)} />
          </Field>
          <Field label="Job Post Link" className="md:col-span-2" error={errors.job_post_link}>
            <Input value={form.job_post_link ?? ""} onChange={(e) => update("job_post_link", e.target.value)} />
          </Field>
          <Field label="Notes" className="md:col-span-2">
            <Textarea value={form.notes ?? ""} onChange={(e) => update("notes", e.target.value)} />
          </Field>
          {errors.form ? <p className="md:col-span-2 text-sm text-destructive">{errors.form}</p> : null}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  className,
  error,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function mapToInput(value: Application): ApplicationInput {
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
