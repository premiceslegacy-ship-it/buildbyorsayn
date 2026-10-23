import { Compare, Fork, Ladder, Steps } from "../kit";

const EM = "#22d96e";

export function TransmissionDiagram() {
  return <Steps
    title="Le savoir-faire voyage"
    description="Exemple : une relance qui marche après une visite devient une méthode pour le client suivant."
    legend="Le dossier du client reste chez lui, seule la méthode repart."
    ariaLabel="Quatre étapes : le cas réel, une mission terminée ; ce qui a marché, le choix utile ; la méthode, écrite sans données ; le prochain projet, où la méthode revient. La méthode est mise en avant."
    accent={EM}
    items={[
      { label: "Cas réel", detail: "Une mission terminée" },
      { label: "Ce qui a marché", detail: "Le choix qui a aidé" },
      { label: "Méthode", detail: "Écrite sans données client" },
      { label: "Prochain projet", detail: "La méthode revient" },
    ]}
    accentIndex={2}
  />;
}

export function ValiseClientBoiteMethodeDiagram() {
  return <Compare
    title="Les données restent, la méthode voyage"
    description="Le chef ne repart pas avec l'assiette du client : il garde la recette améliorée."
    legend="Tu gardes le jugement, tu ne réutilises pas les données privées."
    ariaLabel="La valise du client contient les contacts, les prix et les documents, qui restent chez lui. La boîte méthode contient les questions, les contrôles et les gestes qui ont marché."
    accent={EM}
    beforeTitle="Chez le client"
    afterTitle="Dans ta méthode"
    rows={[
      { before: "Contacts", after: "Questions utiles" },
      { before: "Prix", after: "Contrôles à faire" },
      { before: "Documents", after: "Gestes qui ont marché" },
    ]}
  />;
}

export function CinqTiroirsDuSavoirDiagram() {
  return <Ladder
    title="Cinq tiroirs pour ne rien mélanger"
    description="Chaque apprentissage va dans le fichier qui peut le garder, du plus personnel au plus durable."
    legend="Une réussite isolée reste une observation : une règle demande plusieurs cas."
    ariaLabel="Cinq destinations du plus local au plus réutilisable : USER.md pour une préférence personnelle, MEMORY.md pour un fait appris, AGENTS.md pour une règle de projet, un skill pour une méthode testée, un registre pour une décision datée. Le skill est mis en avant."
    accent={EM}
    rungs={[
      { label: "USER.md", detail: "Une préférence personnelle" },
      { label: "MEMORY.md", detail: "Un fait sur ton environnement" },
      { label: "AGENTS.md", detail: "Une règle de projet" },
      { label: "Skill", detail: "Une méthode testée" },
      { label: "Décisions", detail: "Un choix durable et daté" },
    ]}
    accentIndex={3}
    lowLabel="Local"
    highLabel="Réutilisable"
  />;
}

export function CarteConditionDeRetraitDiagram() {
  return <Fork
    title="Une méthode sait quand s'arrêter"
    description="Exemple : la relance après visite ne s'applique pas à un litige, qui part au responsable."
    legend="Écris « arrête-toi ici » aussi souvent que « fais ceci »."
    ariaLabel="Une méthode est proposée, avec trois mentions : elle marche quand les sources sont présentes ; elle ne marche pas dans un litige, qui part au responsable ; elle est revue à une date de contrôle. Le cas où elle ne marche pas est écarté."
    accent={EM}
    situation="Cette méthode est proposée"
    outcomes={[
      { label: "Marche quand", condition: "Les sources sont présentes", recommended: true },
      { label: "Ne marche pas quand", condition: "Litige : le responsable reprend", rejected: true },
      { label: "Revue", condition: "Une date de contrôle écrite" },
    ]}
  />;
}
