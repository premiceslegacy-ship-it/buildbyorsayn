import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";

const root = new URL("../", import.meta.url);
const read = (relativePath: string) => readFileSync(fileURLToPath(new URL(relativePath, root)), "utf8");

test("Product Film Factory ouvre le catalogue et ferme la chaîne Skills en étape 07", () => {
  const productFilm = SKILLS_CATALOG.find((skill) => skill.slug === "product-film-factory");
  assert.equal(SKILLS_CATALOG.at(0), productFilm);

  const page = read("app/skills/page.tsx");
  assert.match(page, /step: "07",\s*title: "Product Film Factory"/);
});
