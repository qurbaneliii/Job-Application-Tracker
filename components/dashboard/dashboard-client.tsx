"use client";

import { useMemo } from "react";
import { Briefcase, CircleX, FileClock, Handshake, Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPieChart, WeeklyBarChart, SourceBarChart } from "@/components/dashboard/charts";
import { computeMetrics } from "@/lib/dashboard";
import type { Application } from "@/lib/types";

export function DashboardClient({ applications }: { applications: Application[] }) {
  const metrics = useMemo(() => computeMetrics(applications), [applications]);

  if (!applications.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data yet. Add your first application from Applications page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Applications" value={metrics.total} icon={Briefcase} />
        <StatCard title="Active" value={metrics.active} icon={Hourglass} />
        <StatCard title="Rejected" value={metrics.rejected} icon={CircleX} />
        <StatCard title="Interviews" value={metrics.interviews} icon={FileClock} />
        <StatCard title="Offers" value={metrics.offers} icon={Handshake} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={metrics.statusData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyBarChart data={metrics.weeklyData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>By Source</CardTitle>
          </CardHeader>
          <CardContent>
            <SourceBarChart data={metrics.sourceData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-3xl font-semibold">{value}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
