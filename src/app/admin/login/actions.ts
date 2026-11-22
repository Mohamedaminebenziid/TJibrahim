"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  const sb = await createClient();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    redirect(`/admin/login?error=${encodeURIComponent(error?.message || "Invalid credentials")}`);
  }

  // Ensure a profile row exists for this user (so is_admin() works).
  await sb.from("profiles").upsert({ id: data.user.id, email: data.user.email, role: "admin" });

  redirect(next);
}

export async function logout() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}
