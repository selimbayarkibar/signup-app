"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// useFormState passes prevState as the first argument
export async function login(prevState, formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const next = formData.get("next") || "/admin";

  const { data: sessionData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !sessionData?.session) {
    return { error: "❌ Invalid credentials" };
  }

  const allowedAdmins = ["a@b.com"]; // ✅ your admin emails
  const isAdmin = allowedAdmins.includes(sessionData.session.user.email);

  if (!isAdmin) {
    return { error: "❌ Not authorized" };
  }

  redirect(next);
}
