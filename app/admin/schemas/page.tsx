export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SchemaBoard } from "./SchemaBoard";

export default async function SchemasControlPage({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.app_metadata?.role !== "admin") redirect("/dashboard");
  return <SchemaBoard searchParams={searchParams} basePath="/admin/schemas" />;
}
