import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <SupabaseProvider>
        <LoginForm />
      </SupabaseProvider>
    </main>
  );
}
