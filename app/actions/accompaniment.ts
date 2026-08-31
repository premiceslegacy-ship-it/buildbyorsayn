"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  SITE_WEB_ACCOMPANIMENT_SLUG,
  isAccompanimentAdminUser,
} from "@/lib/accompanimentAccess";
import { THEMES } from "@/lib/siteWebAccompagnement";

export type AssignmentActionState = {
  ok: boolean;
  message: string;
};

const EMPTY_STATE: AssignmentActionState = { ok: false, message: "" };
const ALLOWED_THEME_IDS = new Set(THEMES.map((theme) => theme.id));
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Les dates doivent utiliser le format AAAA-MM-JJ.");

const assignmentSchema = z
  .object({
    userId: z.string().uuid("La personne sélectionnée est invalide."),
    track: z.enum(["debutant", "experimente", "agence"], "Le parcours sélectionné est invalide."),
    status: z.enum(["planned", "active", "completed", "revoked"], "Le statut sélectionné est invalide."),
    startsOn: dateSchema,
    endsOn: z.union([dateSchema, z.literal("")]).transform((value) => value || null),
    themeIds: z
      .array(z.string())
      .min(1, "Sélectionne au moins un thème à travailler.")
      .refine((values) => values.every((value) => ALLOWED_THEME_IDS.has(value)), "Un thème sélectionné est invalide."),
    notes: z.string().trim().max(4000, "La note formateur est trop longue."),
  })
  .superRefine((value, context) => {
    if (value.endsOn && value.endsOn < value.startsOn) {
      context.addIssue({ code: "custom", path: ["endsOn"], message: "La fin doit être après le début." });
    }
  });

const revokeAssignmentSchema = z.object({
  userId: z.string().uuid("La personne sélectionnée est invalide."),
});

const workspaceContextSchema = z.object({
  assignmentId: z.string().uuid("L'affectation est invalide."),
  company: z.string().trim().max(200, "L'activité est trop longue."),
  project: z.string().trim().max(500, "Le projet est trop long."),
  siteUrl: z
    .string()
    .trim()
    .max(500, "L'URL est trop longue.")
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return (url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password;
      } catch {
        return false;
      }
    }, "Utilise une URL complète commençant par http:// ou https://."),
  sharedNotes: z.string().trim().max(4000, "Les notes sont trop longues."),
});

class ActionInputError extends Error {}

function createAccompanimentAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Configuration Supabase incomplète.");
  }
  return createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

async function requireTrainer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAccompanimentAdminUser(user)) {
    throw new Error("Accès formateur refusé.");
  }

  return user;
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseWithSchema<T>(result: { success: true; data: T } | { success: false; error: z.ZodError }): T {
  if (result.success === false) {
    throw new ActionInputError(result.error.issues[0]?.message ?? "Les informations sont invalides.");
  }
  return result.data;
}

function readAssignmentInput(formData: FormData) {
  return parseWithSchema(assignmentSchema.safeParse({
    userId: readText(formData, "user_id"),
    track: readText(formData, "track"),
    status: readText(formData, "status"),
    startsOn: readText(formData, "starts_on") || new Date().toISOString().slice(0, 10),
    endsOn: readText(formData, "ends_on"),
    themeIds: [...new Set(
      formData
        .getAll("theme_id")
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
    )],
    notes: readText(formData, "notes"),
  }));
}

function readRevokeInput(formData: FormData) {
  return parseWithSchema(revokeAssignmentSchema.safeParse({
    userId: readText(formData, "user_id"),
  }));
}

function readWorkspaceContext(formData: FormData) {
  const result = workspaceContextSchema.safeParse({
    assignmentId: readText(formData, "assignment_id"),
    company: readText(formData, "company"),
    project: readText(formData, "project"),
    siteUrl: readText(formData, "site_url"),
    sharedNotes: readText(formData, "shared_notes"),
  });
  if (!result.success) {
    throw new ActionInputError(result.error.issues[0]?.message ?? "Les informations sont invalides.");
  }
  return result.data;
}

function actionFailure(error: unknown, fallback: string): AssignmentActionState {
  return {
    ok: false,
    message: error instanceof ActionInputError ? error.message : fallback,
  };
}

export async function saveAccompanimentAssignment(
  _previousState: AssignmentActionState = EMPTY_STATE,
  formData: FormData
): Promise<AssignmentActionState> {
  const trainer = await requireTrainer();
  try {
    const input = readAssignmentInput(formData);

    const supabaseAdmin = createAccompanimentAdminClient();
    const { error } = await supabaseAdmin
      .from("accompaniment_assignments")
      .upsert(
        {
          user_id: input.userId,
          accompaniment_slug: SITE_WEB_ACCOMPANIMENT_SLUG,
          track: input.track,
          theme_ids: input.themeIds,
          status: input.status,
          starts_on: input.startsOn,
          ends_on: input.endsOn,
          approved_at: input.status === "active" || input.status === "completed" ? new Date().toISOString() : null,
          approved_by: input.status === "active" || input.status === "completed" ? trainer.id : null,
          notes: input.notes || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,accompaniment_slug" }
      );

    if (error) throw new Error(error.message);

    revalidatePath("/accompagnement/formateur");
    revalidatePath("/accompagnement/espace");
    revalidatePath("/admin");
    return { ok: true, message: "Accompagnement enregistré." };
  } catch (error) {
    return actionFailure(error, "L'enregistrement a échoué.");
  }
}

export async function revokeAccompanimentAssignment(
  _previousState: AssignmentActionState = EMPTY_STATE,
  formData: FormData
): Promise<AssignmentActionState> {
  await requireTrainer();
  try {
    const input = readRevokeInput(formData);
    const supabaseAdmin = createAccompanimentAdminClient();
    const { error } = await supabaseAdmin
      .from("accompaniment_assignments")
      .update({ status: "revoked", updated_at: new Date().toISOString() })
      .eq("user_id", input.userId)
      .eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG);

    if (error) throw new Error(error.message);

    revalidatePath("/accompagnement/formateur");
    revalidatePath("/accompagnement/espace");
    revalidatePath("/admin");
    return { ok: true, message: "Accès retiré." };
  } catch (error) {
    return actionFailure(error, "Le retrait de l'accès a échoué.");
  }
}

export async function saveMemberWorkspaceContext(
  _previousState: AssignmentActionState = EMPTY_STATE,
  formData: FormData
): Promise<AssignmentActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Connecte-toi pour enregistrer cet espace." };

    const input = readWorkspaceContext(formData);
    const { data: assignment, error: assignmentError } = await supabase
      .from("accompaniment_assignments")
      .select("id")
      .eq("id", input.assignmentId)
      .eq("user_id", user.id)
      .eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG)
      .maybeSingle();

    if (assignmentError || !assignment) {
      return { ok: false, message: "Cet accompagnement n'est pas accessible." };
    }

    const { error } = await supabase
      .from("accompaniment_workspace_context")
      .upsert(
        {
          assignment_id: input.assignmentId,
          company: input.company,
          project: input.project,
          site_url: input.siteUrl,
          shared_notes: input.sharedNotes,
          updated_by: user.id,
        },
        { onConflict: "assignment_id" }
      );
    if (error) return { ok: false, message: "L'enregistrement partagé a échoué. Réessaie." };

    revalidatePath("/accompagnement/espace");
    revalidatePath("/accompagnement/formateur");
    return { ok: true, message: "Contexte partagé enregistré." };
  } catch (error) {
    return actionFailure(error, "L'enregistrement partagé a échoué. Réessaie.");
  }
}

export async function saveTrainerWorkspaceContext(
  _previousState: AssignmentActionState = EMPTY_STATE,
  formData: FormData
): Promise<AssignmentActionState> {
  try {
    const trainer = await requireTrainer();
    const input = readWorkspaceContext(formData);
    const supabaseAdmin = createAccompanimentAdminClient();
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from("accompaniment_assignments")
      .select("id")
      .eq("id", input.assignmentId)
      .eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG)
      .maybeSingle();

    if (assignmentError || !assignment) {
      return { ok: false, message: "Cette affectation n'existe pas." };
    }

    const { error } = await supabaseAdmin
      .from("accompaniment_workspace_context")
      .upsert(
        {
          assignment_id: input.assignmentId,
          company: input.company,
          project: input.project,
          site_url: input.siteUrl,
          shared_notes: input.sharedNotes,
          updated_by: trainer.id,
        },
        { onConflict: "assignment_id" }
      );
    if (error) return { ok: false, message: "Le contexte partagé n'a pas pu être enregistré." };

    revalidatePath("/accompagnement/formateur");
    revalidatePath("/accompagnement/espace");
    return { ok: true, message: "Contexte partagé mis à jour." };
  } catch (error) {
    return actionFailure(error, "Le contexte partagé n'a pas pu être enregistré.");
  }
}
