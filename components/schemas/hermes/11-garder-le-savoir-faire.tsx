import { Compare, Fork, Ladder, Steps } from "../kit";

export function TransmissionDiagram() {
  return <Steps title="Le savoir-faire voyage" description="Le cas réel devient une méthode réutilisable." ariaLabel="Cas réel devient Ce qui a marché, puis Méthode et Prochain projet." items={[
    { label: "Cas réel", detail: "Le travail observé" },
    { label: "Ce qui a marché", detail: "Le choix utile" },
    { label: "Méthode", detail: "La pratique écrite" },
    { label: "Prochain projet", detail: "La méthode revient" },
  ]} accentIndex={2} />;
}

export function ValiseClientBoiteMethodeDiagram() {
  return <Compare title="Les données restent, la méthode voyage" description="La valise du client et la boîte commune ne contiennent pas la même chose." ariaLabel="Contacts, Prix et Documents restent chez le client. Questions et Contrôles entrent dans la méthode commune." beforeTitle="Valise du client" afterTitle="Boîte méthode" rows={[
    { before: "Contacts", after: "Questions" },
    { before: "Prix", after: "Contrôles" },
    { before: "Documents", after: "Méthode sans données" },
  ]} />;
}

export function CinqTiroirsDuSavoirDiagram() {
  return <Ladder title="Cinq tiroirs pour ne rien mélanger" description="Chaque apprentissage rejoint l'endroit qui peut le garder." ariaLabel="Toi, Mémoire, Projet, Skill et Décision forment cinq tiroirs. Skill est mis en avant." rungs={[
    { label: "Toi", detail: "Une préférence personnelle" },
    { label: "Mémoire", detail: "Un fait appris" },
    { label: "Projet", detail: "Une règle locale" },
    { label: "Skill", detail: "Une méthode testée" },
    { label: "Décision", detail: "Un choix daté" },
  ]} accentIndex={3} lowLabel="Local" highLabel="Réutilisable" />;
}

export function CarteConditionDeRetraitDiagram() {
  return <Fork title="Une méthode sait quand s'arrêter" description="La condition de retrait fait partie de la méthode." ariaLabel="Une carte indique Marche quand, Ne marche pas quand et Revoir le. Ne marche pas quand est mis en avant." situation="Cette méthode est proposée" outcomes={[
    { label: "Marche quand", condition: "Les sources sont présentes", recommended: true },
    { label: "Ne marche pas quand", condition: "Les règles se contredisent", rejected: true },
    { label: "Revoir le", condition: "Date de contrôle" },
  ]} />;
}
