"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import type { SkillCatalogItem } from "@/lib/skillsCatalog";
import { playAppSound } from "@/lib/ui/sound";

const SKILL_IMAGE = new Set(["product-film-factory", "oracle-by-orsayn", "oracle-site-web", "apple-design-skills", "ux-ui-design", "backend-orsayn", "deep-research-vertical"]);
const publicDescription = (description: string) => description.replace(/\s[\u2013\u2014-]\s/g, ", ");

export function SkillsRow({ skills }: { skills: SkillCatalogItem[] }) {
  const list = useRef<HTMLUListElement>(null);
  const move = (direction: number) => { list.current?.scrollBy({ left: direction * list.current.clientWidth * .8, behavior: "smooth" }); void playAppSound("click"); };
  return <section className="row row--sq" id="skills"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Les skills</h2><p className="row__d">Les méthodes d'Orsayn à télécharger, pour que ton IA travaille comme l'agence.</p></div><Link className="btn btn--l" href="/skills">Tout voir <DaIcon name="chevron" /></Link></div><div className="row__v"><button className="row__a row__a--l" type="button" aria-label="Précédent" data-sfx="none" onClick={() => move(-1)}><DaIcon name="chevronLeft" /></button><ul className="row__l" ref={list}>{skills.map((skill) => <li key={skill.slug}><Link className="card" href={`/skills#${skill.slug}`}><span className="card__in"><span className="card__img">{SKILL_IMAGE.has(skill.slug) ? <Image src={`/da/skills/${skill.slug}.jpg`} alt="" fill sizes="(max-width: 734px) 38vw, 20vw" /> : <span className="card__ph"><DaIcon name="skill" /></span>}</span><span className="card__cap"><span className="card__txt"><span className="card__t">{skill.title}</span><span className="card__m">À télécharger</span></span></span><span className="card__pop"><span className="pop__t">{skill.title}</span><span className="pop__m">{publicDescription(skill.description)}</span></span></span></Link></li>)}</ul><button className="row__a row__a--r" type="button" aria-label="Suivant" data-sfx="none" onClick={() => move(1)}><DaIcon name="chevron" /></button></div></section>;
}
