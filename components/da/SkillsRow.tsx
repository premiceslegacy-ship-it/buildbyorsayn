"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import type { SkillCatalogItem } from "@/lib/skillsCatalog";
import { playAppSound } from "@/lib/ui/sound";

const SKILL_IMAGE = new Set(["product-film-factory", "oracle-by-orsayn", "oracle-site-web", "apple-design-skills", "ux-ui-design", "backend-orsayn", "deep-research-vertical"]);

// One line of a rail card: what the skill gives you. The full description stays on the Skills page.
const RAIL_SUMMARY: Record<string, string> = {
  "product-film-factory": "Un film produit, du script au rendu.",
  "deep-research-vertical": "Sais si ta niche vaut le coup.",
  "oracle-by-orsayn": "Cadre ton produit avant le code.",
  "ux-ui-design": "Une direction visuelle tirée de tes références.",
  "apple-design-skills": "Quinze skills pour des interfaces premium.",
  "backend-orsayn": "Protège les données de tes clients.",
  "oracle-site-web": "Un site ou une landing page qui vend.",
};

export function SkillsRow({ skills }: { skills: SkillCatalogItem[] }) {
  const list = useRef<HTMLUListElement>(null);
  const move = (direction: number) => { list.current?.scrollBy({ left: direction * list.current.clientWidth * .8, behavior: "smooth" }); void playAppSound("click"); };
  return <section className="row row--sq" id="skills"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Les skills</h2><p className="row__d">Les méthodes d'Orsayn à télécharger, pour que ton IA travaille comme l'agence.</p></div><Link className="btn btn--l" href="/skills">Tout voir <DaIcon name="chevron" /></Link></div><div className="row__v"><button className="row__a row__a--l" type="button" aria-label="Précédent" data-sfx="none" onClick={() => move(-1)}><DaIcon name="chevronLeft" /></button><ul className="row__l" ref={list}>{skills.map((skill) => <li key={skill.slug}><Link className="card card--skill" href={`/skills#${skill.slug}`}><span className="card__in"><span className="card__img">{SKILL_IMAGE.has(skill.slug) ? <Image src={`/da/skills/${skill.slug}.jpg`} alt="" fill sizes="(max-width: 734px) 38vw, 20vw" /> : <span className="card__ph"><DaIcon name="skill" /></span>}</span><span className="card__cap"><span className="card__txt"><span className="card__t">{skill.title}</span><span className="card__m">{RAIL_SUMMARY[skill.slug] ?? skill.description.split(":")[0].trim()}</span></span></span></span></Link></li>)}</ul><button className="row__a row__a--r" type="button" aria-label="Suivant" data-sfx="none" onClick={() => move(1)}><DaIcon name="chevron" /></button></div></section>;
}
