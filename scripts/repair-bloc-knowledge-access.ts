import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { collectBlocsDocuments } from "../lib/knowledge/sources";

config({ path: ".env.local", quiet: true });
const apply = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Authorized Supabase environment required");
const client = createClient(url, key, { auth: { persistSession: false } });
const documents = await collectBlocsDocuments();
const restricted = documents.filter(d => d.tier === "full").map(d => d.sourceId);
if (!restricted.length || new Set(restricted).size !== restricted.length || restricted.some(id => id.startsWith("b1-"))) {
  throw new Error("Invalid canonical restricted section set");
}
async function inventory() {
  const rows: {id: string; source_id: string; tier_required: string}[] = [];
  for (let offset = 0; ; offset += 500) {
    const {data,error} = await client.from("knowledge_chunks")
      .select("id,source_id,tier_required").eq("source", "blocs")
      .order("id").range(offset, offset + 499);
    if(error) throw new Error("Knowledge inventory failed");
    rows.push(...data);
    if(data.length < 500) return rows;
  }
}
const before = await inventory();
const invalid = before.filter(row => restricted.includes(row.source_id) && row.tier_required !== "full");
if (apply) {
  // Restrict access only. No content, embeddings or existing full grants are changed.
  const {error} = await client.from("knowledge_chunks").update({tier_required:"full"})
    .eq("source", "blocs").in("source_id", restricted).neq("tier_required", "full");
  if(error) throw new Error("Access repair failed");
  const after = await inventory();
  if(after.length !== before.length || before.some(row => !after.some(x => x.id === row.id))) throw new Error("Inventory changed during repair");
  if(after.some(row => restricted.includes(row.source_id) && row.tier_required !== "full")) throw new Error("Restricted rows remain exposed");
  if(before.some(row => !restricted.includes(row.source_id) && after.find(x => x.id === row.id)?.tier_required !== row.tier_required)) throw new Error("Unrelated entitlement changed");
  console.log(JSON.stringify({applied:true,restrictedSections:restricted.length,correctedRows:invalid.length,totalRows:after.length,readbackVerified:true}));
} else {
  console.log(JSON.stringify({applied:false,restrictedSections:restricted.length,rowsToRestrict:invalid.length,totalRows:before.length}));
}
