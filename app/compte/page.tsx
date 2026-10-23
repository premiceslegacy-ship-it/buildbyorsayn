import { redirect } from "next/navigation";
import { AccountClient } from "@/components/account/AccountClient";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { getMcpConnectionStatus } from "@/app/actions/mcpConnections";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { createClient } from "@/lib/supabase/server";
import "@/app/ui3.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compte | BUILD", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fcompte");

  const identity = await navIdentity(user);
  if (!identity) redirect("/login?next=%2Fcompte");
  const connectionStatus = identity.tier === "beginner" || identity.tier === "full"
    ? await getMcpConnectionStatus()
    : "disconnected";

  return (
    <DaRoot className="da-app has-tabbar">
      <NavBar tier={identity.tier} isAdmin={identity.isAdmin} displayName={identity.displayName} displayEmail={identity.displayEmail} initials={identity.initials} />
      <AccountClient initialName={identity.displayName} email={identity.displayEmail} tier={identity.tier} connectionStatus={connectionStatus} />
    </DaRoot>
  );
}
