"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useSupabaseClient } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
