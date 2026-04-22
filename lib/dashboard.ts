import { format, parseISO, startOfWeek } from "date-fns";
import type { Application } from "@/lib/types";

export function computeMetrics(applications: Application[]) {
  const total = applications.length;
  const interviews = applications.filter((item) =>
    ["interview", "technical"].includes(item.status),
  ).length;
  const rejected = applications.filter((item) => item.status === "rejected").length;
  const offers = applications.filter((item) => item.status === "offer").length;

  const statusMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();
  const weeklyMap = new Map<string, number>();

  for (const application of applications) {
    statusMap.set(application.status, (statusMap.get(application.status) ?? 0) + 1);

    const source = application.source?.trim() || "Unknown";
    sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);

    const week = format(startOfWeek(parseISO(application.application_date), { weekStartsOn: 1 }), "yyyy-MM-dd");
    weeklyMap.set(week, (weeklyMap.get(week) ?? 0) + 1);
  }

  const statusData = Array.from(statusMap, ([name, value]) => ({ name, value }));
  const sourceData = Array.from(sourceMap, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value,
  );
  const weeklyData = Array.from(weeklyMap, ([weekStart, count]) => ({
    weekStart,
    label: format(parseISO(weekStart), "MMM dd"),
    count,
  })).sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  return { total, rejected, interviews, offers, statusData, sourceData, weeklyData };
}
