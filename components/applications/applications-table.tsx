"use client";

import { formatDistanceStrict, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { computeResponseTimeDays, isFollowUpOverdue } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApplicationFormDialog } from "@/components/applications/application-form-dialog";
import type { Application, ApplicationInput, ApplicationStatus } from "@/lib/types";

type ApplicationsTableProps = {
  applications: Application[];
  onUpdate: (id: string, value: ApplicationInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: ApplicationStatus) => Promise<void>;
};

export function ApplicationsTable({ applications, onUpdate, onDelete, onStatusChange }: ApplicationsTableProps) {
  if (!applications.length) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <h3 className="text-lg font-medium">No applications found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting filters or add a new application.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead>Follow Up</TableHead>
          <TableHead>Response</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => {
          const overdue = isFollowUpOverdue(application);

          return (
            <TableRow key={application.id} className={overdue ? "bg-destructive/10" : ""}>
              <TableCell className="font-medium">{application.company}</TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>
                <Select
                  value={application.status}
                  onValueChange={(value) => onStatusChange(application.id, value as ApplicationStatus)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              <TableCell>{application.source}</TableCell>
              <TableCell>{application.application_date}</TableCell>
              <TableCell>
                {application.follow_up_date ? (
                  <Badge variant={overdue ? "destructive" : "secondary"}>{application.follow_up_date}</Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {["offer", "rejected", "no_response"].includes(application.status)
                  ? `${computeResponseTimeDays(application.application_date)} day(s)`
                  : formatDistanceStrict(parseISO(application.application_date), new Date(), { unit: "day" })}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-2">
                  <ApplicationFormDialog
                    mode="edit"
                    value={application}
                    onSubmit={(value) => onUpdate(application.id, value)}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button variant="destructive" size="sm" onClick={() => onDelete(application.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
