export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { SchemaBoard } from "@/app/admin/schemas/SchemaBoard";
import { KitBoard } from "@/components/schemas/kit/KitBoard";

/** Planche des schémas pour le serveur de développement local seulement : 404 dans tout build de production. */
export default async function DevSchemasPage({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const query = await searchParams;
  const course = typeof query.cours === "string" ? query.cours.toLocaleLowerCase("fr") : "fondations";
  if (course === "kit") return <KitBoard only={typeof query.nom === "string" ? query.nom : undefined} />;
  return <SchemaBoard searchParams={Promise.resolve(query)} basePath="/dev/schemas" />;
}
