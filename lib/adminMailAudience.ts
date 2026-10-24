export type MailUser = { id: string; email: string; tier: string | null; inactiveForEmail: boolean };
export type Audience = "selected" | "all" | "free" | "beginner" | "full";

/** Nombre de destinataires réels : les comptes gratuits inactifs ne reçoivent jamais d'e-mail. */
export function countMailRecipients(users: MailUser[], audience: Audience, selectedIds: string[]): number {
  const eligible = users.filter((account) => !account.inactiveForEmail);
  if (audience === "selected") return eligible.filter((account) => selectedIds.includes(account.id)).length;
  if (audience === "free") return eligible.filter((account) => !account.tier || account.tier === "free").length;
  return eligible.filter((account) => audience === "all" || account.tier === audience).length;
}
