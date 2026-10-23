export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { SchemaBoard } from "@/app/admin/schemas/SchemaBoard";

/** Planche des schémas pour le serveur de développement local seulement : 404 dans tout build de production. */
export default function DevSchemasPage({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  return <SchemaBoard searchParams={searchParams} basePath="/dev/schemas" />;
}
