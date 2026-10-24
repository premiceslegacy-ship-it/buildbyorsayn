import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BLOCS_DATA, blocIdFromDisplayNumber, displayNumberFromBlocId } from "../lib/blocCatalog";
import { buildSearchCatalog } from "../lib/search/catalog";

const read = (path: string) => readFileSync(path, "utf8");

test("le numéro affiché reste distinct de l'identifiant interne", () => {
  assert.equal(blocIdFromDisplayNumber(3), "5");
  assert.equal(blocIdFromDisplayNumber(4), "3");
  assert.equal(blocIdFromDisplayNumber(5), "4");
  for (const bloc of BLOCS_DATA) {
    assert.equal(displayNumberFromBlocId(bloc.id), bloc.displayNumber);
    assert.equal(bloc.titre.startsWith(`Bloc ${bloc.displayNumber}`), true);
  }
});

test("la recherche affiche les numéros de blocs et non les ids internes", () => {
  const catalog = buildSearchCatalog("full");
  for (const numero of [3, 4, 5]) {
    const bloc = catalog.find((item) => item.id === `video-bloc-${numero}`);
    assert.ok(bloc);
    assert.match(bloc.title, new RegExp(`\\bBloc ${numero}\\b`));
    assert.doesNotMatch(bloc.title, new RegExp(`\\bBloc ${blocIdFromDisplayNumber(numero)}\\b`));
  }
});

test("l'admin, les métadonnées et liste_blocs ne montrent jamais un id brut", () => {
  const admin = read("app/admin/AdminVideoManager.tsx");
  assert.doesNotMatch(admin, /Bloc \$\{video\.bloc_id\}/);
  assert.match(admin, /displayNumber/);

  const metadata = `${read("app/blocs/[id]/page.tsx")}\n${read("app/blocs/[id]/lire/page.tsx")}`;
  assert.match(metadata, /displayNumber/);
  assert.doesNotMatch(metadata, /Bloc \$\{id\}/);

  const agent = read("lib/adminAgent/tools.ts");
  const listStart = agent.indexOf("  liste_blocs:");
  const listEnd = agent.indexOf("  lister_videos:");
  assert.ok(listStart >= 0 && listEnd > listStart);
  const listTool = agent.slice(listStart, listEnd);
  assert.match(listTool, /numero:\s*bloc\.displayNumber/);
  assert.doesNotMatch(listTool, /\bid:\s*bloc\.id/);
});
