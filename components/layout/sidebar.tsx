import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, ListChecks } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Separator } from "@/components/ui/separator";
import type { Route } from "next";
import type { ComponentType } from "react";

type SidebarProps = {
  pathname: string;
};

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: ListChecks },
] as const satisfies ReadonlyArray<{ href: Route; label: string; icon: ComponentType<{ className?: string }> }>;

export function Sidebar({ pathname }: SidebarProps) {
  return (
    <aside className="w-full border-b md:h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 p-5">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold">Job Tracker</h1>
        </div>
        <Separator />
        <nav className="grid gap-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
