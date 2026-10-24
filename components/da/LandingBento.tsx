import Image from "next/image";
import { ToolLogo } from "@/components/ToolLogo";
import { DaIcon } from "./DaIcon";
import { Tile } from "./Tile";

/**
 * Section « Ce que tu reçois » de l'accueil : cinq vignettes qui montrent chacune un petit morceau d'interface.
 * Le moins de texte possible : un titre court et une phrase utile. Tout est décoratif sauf les titres.
 */
export function LandingBento() {
  return (
    <section className="sec" id="contenu" aria-labelledby="contenu-titre">
      <div className="wrap">
        <div className="sec__tete">
          <h2 className="t-1" id="contenu-titre">
            Tout ce qu&apos;il te faut, <span className="mot">au même endroit.</span>
          </h2>
        </div>
        <div className="bento">
          <article className="vig vig--7">
            <div className="vig__vis">
              <div className="lecteur" aria-hidden="true">
                <div className="lecteur__ecran">
                  <Image src="/da/mini/b1.jpg" alt="" width={640} height={360} sizes="(min-width: 900px) 380px, 90vw" />
                  <div className="lecteur__seg verre"><span>Vidéo</span><span>Texte</span></div>
                  <div className="lecteur__barre verre">
                    <i><DaIcon name="play" /></i>
                    <span className="lecteur__prog" />
                    <span className="lecteur__t">4:12</span>
                  </div>
                </div>
                <ul className="chap ui">
                  <li><i><DaIcon name="check" /></i>Le décalage</li>
                  <li className="on"><i />Le métier d&apos;abord</li>
                  <li className="off"><i />Choisir une ligne</li>
                </ul>
              </div>
            </div>
            <div className="vig__txt">
              <h3 className="t-2">Des vidéos à ton rythme</h3>
              <p>Sept blocs découpés en chapitres. Tu regardes ou tu lis.</p>
            </div>
          </article>

          <article className="vig vig--5">
            <div className="vig__vis">
              <ul className="skl ui" aria-hidden="true">
                <li>
                  <Image src="/da/skills/oracle-by-orsayn.jpg" alt="" width={88} height={88} />
                  <span>ORACLE by Orsayn</span>
                  <b className="ui__pill"><DaIcon name="check" /><u>À jour</u></b>
                </li>
                <li>
                  <Image src="/da/skills/backend-orsayn.jpg" alt="" width={88} height={88} />
                  <span>Backend Orsayn</span>
                  <b className="ui__pill"><DaIcon name="check" /><u>À jour</u></b>
                </li>
                <li>
                  <Image src="/da/skills/apple-design-skills.jpg" alt="" width={88} height={88} />
                  <span>Apple Design Skills</span>
                  <b className="ui__pill ui__pill--g"><b /><u>Mise à jour</u></b>
                </li>
              </ul>
            </div>
            <div className="vig__txt">
              <h3 className="t-2">Des skills prêts à l&apos;emploi</h3>
              <p>Ils se mettent à jour tout seuls.</p>
            </div>
          </article>

          <article className="vig vig--4">
            <div className="vig__vis">
              <div className="flux" aria-hidden="true">
                <svg viewBox="0 0 320 286">
                  <defs>
                    <linearGradient id="fluxg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#b9f5cf" stopOpacity=".2" />
                      <stop offset="1" stopColor="#22d96e" />
                    </linearGradient>
                  </defs>
                  <path d="M60 46 C60 110 160 100 160 150" />
                  <path d="M160 36 L160 150" />
                  <path d="M260 46 C260 110 160 100 160 150" />
                </svg>
                <Tile logo="gmail" className="tuile--p" style={{ left: "18.75%", top: "16%" }} />
                <Tile logo="notion" className="tuile--p" style={{ left: "50%", top: "12%" }} />
                <Tile logo="telegram" className="tuile--p" style={{ left: "81.25%", top: "16%" }} />
                <Tile logo="hermes" className="tuile--c" style={{ left: "50%", top: "60%" }} />
                <span className="ui__pill"><DaIcon name="check" />Fait</span>
              </div>
            </div>
            <div className="vig__txt">
              <h3 className="t-2">Ton assistant au travail</h3>
              <p>Il fait à ta place ce qui se répète.</p>
            </div>
          </article>

          <article className="vig vig--4">
            <div className="vig__vis">
              <div className="chat ui" aria-hidden="true">
                <div className="chat__tete">
                  <Tile logo="claude" />
                  <Tile logo="openai" />
                  <span className="ui__pill"><b />BUILD connecté</span>
                </div>
                <p className="bulle bulle--moi">Quel prix pour mon offre&nbsp;?</p>
                <div className="bulle bulle--ia"><s /><s /><s /></div>
                <span className="source">
                  <ToolLogo name="BUILD" size={40} />
                  Bloc 3, chapitre 2
                </span>
              </div>
            </div>
            <div className="vig__txt">
              <h3 className="t-2">Ton IA connaît BUILD</h3>
              <p>Dans Claude, ChatGPT, Hermes Agent, Oh My Pi ou Cursor.</p>
            </div>
          </article>

          <article className="vig vig--4">
            <div className="vig__vis">
              <div className="etapes" aria-hidden="true">
                <figure><Image src="/da/objets/offre.png" alt="" width={256} height={256} /><em><DaIcon name="check" /></em><figcaption>Offre</figcaption></figure>
                <figure><Image src="/da/objets/vente.png" alt="" width={256} height={256} /><em><DaIcon name="check" /></em><figcaption>Présentation</figcaption></figure>
                <figure><Image src="/da/objets/bloc.png" alt="" width={256} height={256} /><em><DaIcon name="check" /></em><figcaption>Site</figcaption></figure>
                <figure><Image src="/da/objets/livraison.png" alt="" width={256} height={256} /><figcaption>Livraison</figcaption></figure>
              </div>
            </div>
            <div className="vig__txt">
              <h3 className="t-2">Un projet de A à Z</h3>
              <p>De l&apos;idée à ton site et son dossier de livraison.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
