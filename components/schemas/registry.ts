import { createElement, type ComponentType, type ReactElement } from "react";
import {
  CarteDuMessageDiagram,
  MecanismeVisibleDiagram,
  MemeOffreQuatreMomentsDiagram,
  PreuveAuBonEndroitDiagram,
} from "./fondations/ecrire";
import {
  CeQueTuGardesDiagram,
  CroyanceVersQuestionDiagram,
  EchelleEngagementDiagram,
  PetitTestTroisSortiesDiagram,
  UneSeuleChoseChangeDiagram,
} from "./fondations/etat-esprit";
import {
  ConfianceVisibleDiagram,
  DecisionHumaineDiagram,
  FaitMotQuestionDiagram,
  SixRessortsDansUneSceneDiagram,
  SousLeMotLaSceneDiagram,
} from "./fondations/comprendre";
import { LeCheminDuMessageDiagram } from "./fondations/intro";
import {
  ObserverSansCopierDiagram,
  SourceVersBibliothequeDiagram,
  TroisTempsAttentionDiagram,
  UneIdeeUnePersonneDiagram,
  VolumePuisQualiteDiagram,
} from "./fondations/attention";
import {
  CheminDeVenteDiagram,
  MedecinAvantOrdonnanceDiagram,
  ObjectionQuestionCacheeDiagram,
  OffreFacileAChoisirDiagram,
  QuatreQuestionsDeVenteDiagram,
} from "./fondations/vendre";
import { DeLideeALURLDiagram } from "./fondations/intro-url";
import {
  DossierProjetVivantDiagram,
  FormulaireSousControleDiagram,
  QuestionsAvantOutilsDiagram,
  ToiEtTonIADiagram,
} from "./fondations/penser";
import {
  ComptoirAPIDiagram,
  ModeleContexteReponseDiagram,
  QuiFaitQuoiIADiagram,
  RoleSeulMethodeCompleteDiagram,
  ValiseDuContexteDiagram,
} from "./fondations/environnement";
import {
  BriefPhotoAnnoteMockup,
  DesignSystemOuvertMockup,
  EcranDansTousSesEtatsMockup,
  LandingGeneriqueContreMarqueMockup,
  ReferencesVersDirectionDiagram,
} from "./fondations/visuels";
import {
  AnatomiePremierEcranMockup,
  LandingRateeLandingUtileMockup,
  SiteParTranchesDiagram,
  SiteTrouveEtUtiliseDiagram,
  TrajetDeDecisionDiagram,
} from "./fondations/site-web";
import {
  BouclePetiteTacheDiagram,
  DepotVersHebergeurDiagram,
  DuDossierAuDomaineDiagram,
  InfrastructurePriveeDiagram,
  OuvrirOuClonerMockup,
  RemiseDesClesDiagram,
} from "./fondations/url";
import {
  CeQueTuPossedesDiagram,
  DeuxPortesDuSeuilDiagram,
  PremierProjetVersMethodeDiagram,
} from "./fondations/seuil";
import { OrdreDuPremierWorkflowDiagram, PremierWorkflowVisibleDiagram, ToiAgentOutilDiagram } from "./hermes/01-intro";
import { PremierEssaiTerminalMockup, TerminalInstallationHermesMockup, TroisVoyantsInstallationDiagram } from "./hermes/02-installer-et-essayer";
import { CinqObjetsPasUnSeulDiagram, LigneArriveeDuTravailDiagram, MessageJusquaSuiteDiagram } from "./hermes/03-choisir-le-travail";
import { DiagnosticDiagram, FilmDuDernierDevisDiagram, SymptomeTroisCausesDiagram } from "./hermes/04-regarder-le-vrai-travail";
import { CarteContratDuLotDiagram, DecompositionDiagram, DevisEnQuatreLotsDiagram } from "./hermes/05-decouper-le-travail";
import { KnowledgeLayersDiagram, QuatreFichiersQuatreQuestionsDiagram, SacDeContexteDiagram, SoulMdAnnoteMockup } from "./hermes/06-identite-memoire-contexte";
import { SousLaBulleDeMessageDiagram, TelegramDevisAvecValidationMockup, TicketQuatreEtatsDiagram, TroisCanauxMemeValidationMockup } from "./hermes/07-du-message-au-dossier";
import { AuthorityLayersDiagram, CompteurDeMissionDiagram, MainAvantLeMondeExterieurDiagram, TrousseauMinimalDiagram } from "./hermes/08-droits-outils-couts";
import { FicheMissionRemplieMockup, QuatreCartesQuiCassentDiagram, TroisPortesDuPiloteDiagram, WorkshopDiagram } from "./hermes/09-preparer-un-pilote";
import { DeuxCouloirsMemeTestDiagram, ErreurVersNouveauTestDiagram, ProofLayersDiagram, TableauDeTestSkillMockup } from "./hermes/10-tester-avant-de-garder";
import { CarteConditionDeRetraitDiagram, CinqTiroirsDuSavoirDiagram, TransmissionDiagram, ValiseClientBoiteMethodeDiagram } from "./hermes/11-garder-le-savoir-faire";
import { FlowDiagram } from "./layouts";
import { AnnotatedMockup } from "./mockup";

export type ReaderVisualKind = "maquette" | "schema";
export type ReaderVisualComponent = ComponentType;
export type ReaderVisualCourse = "fondations" | "general" | "hermes";
export type ReaderVisualCatalogEntry = {
  name: string;
  kind: ReaderVisualKind;
  course: ReaderVisualCourse;
  component: ReaderVisualComponent;
};

function normalizeVisualName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLocaleLowerCase("fr");
}

function ProjectStepsSchema() {
  return createElement(FlowDiagram, {
    id: "parcours-clair",
    title: "Une page guide vers une seule action",
    says: "Chaque bloc répond à la question qui arrive avant lui, puis prépare la décision suivante.",
    caption: "Le bouton arrive après la promesse et la preuve.",
    items: [
      { label: "Comprendre", sub: "une promesse claire" },
      { label: "Croire", sub: "une preuve concrète" },
      { label: "Agir", sub: "une action simple", accent: true },
    ],
  });
}

function OfferPageMockup() {
  return createElement(AnnotatedMockup, {
    title: "Une page qui se comprend dans l'ordre",
    description: "Le regard trouve la promesse, la preuve et l'action sans devoir décoder la mise en page.",
    blocks: [
      { kind: "header" },
      { kind: "heading", text: "Un résultat que ton client reconnaît" },
      { kind: "subtitle", text: "Une phrase explique pour qui, quand et comment." },
      { kind: "button", text: "Voir l'offre" },
      { kind: "image" },
      { kind: "proof", text: "Preuves" },
      { kind: "offer", text: "L'offre", detail: "Contenu, prix et prochaine étape" },
    ],
    annotations: [
      { number: 1, label: "Le titre nomme le résultat attendu.", x: 42, y: 23 },
      { number: 2, label: "La preuve arrive avant la demande d'action.", x: 76, y: 61 },
      { number: 3, label: "L'offre réunit les détails au même endroit.", x: 55, y: 86 },
    ],
  });
}

function registry(entries: ReadonlyArray<readonly [string, ReaderVisualComponent]>) {
  return new Map(entries.map(([name, component]) => [normalizeVisualName(name), component]));
}

export const READER_VISUAL_CATALOG: readonly ReaderVisualCatalogEntry[] = [
  { name: "LeCheminDuMessage", kind: "schema", course: "fondations", component: LeCheminDuMessageDiagram },
  { name: "CroyanceVersQuestion", kind: "schema", course: "fondations", component: CroyanceVersQuestionDiagram },
  { name: "PetitTestTroisSorties", kind: "schema", course: "fondations", component: PetitTestTroisSortiesDiagram },
  { name: "UneSeuleChoseChange", kind: "schema", course: "fondations", component: UneSeuleChoseChangeDiagram },
  { name: "EchelleEngagement", kind: "schema", course: "fondations", component: EchelleEngagementDiagram },
  { name: "CeQueTuGardes", kind: "schema", course: "fondations", component: CeQueTuGardesDiagram },
  { name: "SousLeMotLaScene", kind: "schema", course: "fondations", component: SousLeMotLaSceneDiagram },
  { name: "DecisionHumaine", kind: "schema", course: "fondations", component: DecisionHumaineDiagram },
  { name: "SixRessortsDansUneScene", kind: "schema", course: "fondations", component: SixRessortsDansUneSceneDiagram },
  { name: "ConfianceVisible", kind: "schema", course: "fondations", component: ConfianceVisibleDiagram },
  { name: "FaitMotQuestion", kind: "schema", course: "fondations", component: FaitMotQuestionDiagram },
  { name: "MedecinAvantOrdonnance", kind: "schema", course: "fondations", component: MedecinAvantOrdonnanceDiagram },
  { name: "QuatreQuestionsDeVente", kind: "schema", course: "fondations", component: QuatreQuestionsDeVenteDiagram },
  { name: "CheminDeVente", kind: "schema", course: "fondations", component: CheminDeVenteDiagram },
  { name: "OffreFacileAChoisir", kind: "schema", course: "fondations", component: OffreFacileAChoisirDiagram },
  { name: "ObjectionQuestionCachee", kind: "schema", course: "fondations", component: ObjectionQuestionCacheeDiagram },
  { name: "CarteDuMessage", kind: "schema", course: "fondations", component: CarteDuMessageDiagram },
  { name: "MemeOffreQuatreMoments", kind: "schema", course: "fondations", component: MemeOffreQuatreMomentsDiagram },
  { name: "MecanismeVisible", kind: "schema", course: "fondations", component: MecanismeVisibleDiagram },
  { name: "PreuveAuBonEndroit", kind: "schema", course: "fondations", component: PreuveAuBonEndroitDiagram },
  { name: "UneIdeeUnePersonne", kind: "schema", course: "fondations", component: UneIdeeUnePersonneDiagram },
  { name: "TroisTempsAttention", kind: "schema", course: "fondations", component: TroisTempsAttentionDiagram },
  { name: "ObserverSansCopier", kind: "schema", course: "fondations", component: ObserverSansCopierDiagram },
  { name: "VolumePuisQualite", kind: "schema", course: "fondations", component: VolumePuisQualiteDiagram },
  { name: "SourceVersBibliotheque", kind: "schema", course: "fondations", component: SourceVersBibliothequeDiagram },
  { name: "DeLideeALURL", kind: "schema", course: "fondations", component: DeLideeALURLDiagram },
  { name: "QuestionsAvantOutils", kind: "schema", course: "fondations", component: QuestionsAvantOutilsDiagram },
  { name: "ToiEtTonIA", kind: "schema", course: "fondations", component: ToiEtTonIADiagram },
  { name: "FormulaireSousControle", kind: "schema", course: "fondations", component: FormulaireSousControleDiagram },
  { name: "DossierProjetVivant", kind: "schema", course: "fondations", component: DossierProjetVivantDiagram },
  { name: "ModeleContexteReponse", kind: "schema", course: "fondations", component: ModeleContexteReponseDiagram },
  { name: "ValiseDuContexte", kind: "schema", course: "fondations", component: ValiseDuContexteDiagram },
  { name: "ComptoirAPI", kind: "schema", course: "fondations", component: ComptoirAPIDiagram },
  { name: "RoleSeulMethodeComplete", kind: "schema", course: "fondations", component: RoleSeulMethodeCompleteDiagram },
  { name: "QuiFaitQuoiIA", kind: "schema", course: "fondations", component: QuiFaitQuoiIADiagram },
  { name: "LandingGeneriqueContreMarque", kind: "maquette", course: "fondations", component: LandingGeneriqueContreMarqueMockup },
  { name: "ReferencesVersDirection", kind: "schema", course: "fondations", component: ReferencesVersDirectionDiagram },
  { name: "BriefPhotoAnnote", kind: "maquette", course: "fondations", component: BriefPhotoAnnoteMockup },
  { name: "DesignSystemOuvert", kind: "maquette", course: "fondations", component: DesignSystemOuvertMockup },
  { name: "EcranDansTousSesEtats", kind: "maquette", course: "fondations", component: EcranDansTousSesEtatsMockup },
  { name: "LandingRateeLandingUtile", kind: "maquette", course: "fondations", component: LandingRateeLandingUtileMockup },
  { name: "AnatomiePremierEcran", kind: "maquette", course: "fondations", component: AnatomiePremierEcranMockup },
  { name: "TrajetDeDecision", kind: "schema", course: "fondations", component: TrajetDeDecisionDiagram },
  { name: "SiteParTranches", kind: "schema", course: "fondations", component: SiteParTranchesDiagram },
  { name: "SiteTrouveEtUtilise", kind: "schema", course: "fondations", component: SiteTrouveEtUtiliseDiagram },
  { name: "DuDossierAuDomaine", kind: "schema", course: "fondations", component: DuDossierAuDomaineDiagram },
  { name: "OuvrirOuCloner", kind: "maquette", course: "fondations", component: OuvrirOuClonerMockup },
  { name: "BouclePetiteTache", kind: "schema", course: "fondations", component: BouclePetiteTacheDiagram },
  { name: "DepotVersHebergeur", kind: "schema", course: "fondations", component: DepotVersHebergeurDiagram },
  { name: "InfrastructurePrivee", kind: "schema", course: "fondations", component: InfrastructurePriveeDiagram },
  { name: "RemiseDesCles", kind: "schema", course: "fondations", component: RemiseDesClesDiagram },
  { name: "CeQueTuPossedes", kind: "schema", course: "fondations", component: CeQueTuPossedesDiagram },
  { name: "PremierProjetVersMethode", kind: "schema", course: "fondations", component: PremierProjetVersMethodeDiagram },
  { name: "DeuxPortesDuSeuil", kind: "schema", course: "fondations", component: DeuxPortesDuSeuilDiagram },
  { name: "PremierWorkflowVisible", kind: "schema", course: "hermes", component: PremierWorkflowVisibleDiagram },
  { name: "OrdreDuPremierWorkflow", kind: "schema", course: "hermes", component: OrdreDuPremierWorkflowDiagram },
  { name: "ToiAgentOutil", kind: "schema", course: "hermes", component: ToiAgentOutilDiagram },
  { name: "TerminalInstallationHermes", kind: "maquette", course: "hermes", component: TerminalInstallationHermesMockup },
  { name: "TroisVoyantsInstallation", kind: "schema", course: "hermes", component: TroisVoyantsInstallationDiagram },
  { name: "PremierEssaiTerminal", kind: "maquette", course: "hermes", component: PremierEssaiTerminalMockup },
  { name: "CinqObjetsPasUnSeul", kind: "schema", course: "hermes", component: CinqObjetsPasUnSeulDiagram },
  { name: "MessageJusquaSuite", kind: "schema", course: "hermes", component: MessageJusquaSuiteDiagram },
  { name: "LigneArriveeDuTravail", kind: "schema", course: "hermes", component: LigneArriveeDuTravailDiagram },
  { name: "DiagnosticDiagram", kind: "schema", course: "hermes", component: DiagnosticDiagram },
  { name: "FilmDuDernierDevis", kind: "schema", course: "hermes", component: FilmDuDernierDevisDiagram },
  { name: "SymptomeTroisCauses", kind: "schema", course: "hermes", component: SymptomeTroisCausesDiagram },
  { name: "DecompositionDiagram", kind: "schema", course: "hermes", component: DecompositionDiagram },
  { name: "DevisEnQuatreLots", kind: "schema", course: "hermes", component: DevisEnQuatreLotsDiagram },
  { name: "CarteContratDuLot", kind: "schema", course: "hermes", component: CarteContratDuLotDiagram },
  { name: "QuatreFichiersQuatreQuestions", kind: "schema", course: "hermes", component: QuatreFichiersQuatreQuestionsDiagram },
  { name: "SoulMdAnnote", kind: "maquette", course: "hermes", component: SoulMdAnnoteMockup },
  { name: "KnowledgeLayersDiagram", kind: "schema", course: "hermes", component: KnowledgeLayersDiagram },
  { name: "SacDeContexte", kind: "schema", course: "hermes", component: SacDeContexteDiagram },
  { name: "TelegramDevisAvecValidation", kind: "maquette", course: "hermes", component: TelegramDevisAvecValidationMockup },
  { name: "SousLaBulleDeMessage", kind: "schema", course: "hermes", component: SousLaBulleDeMessageDiagram },
  { name: "TroisCanauxMemeValidation", kind: "maquette", course: "hermes", component: TroisCanauxMemeValidationMockup },
  { name: "TicketQuatreEtats", kind: "schema", course: "hermes", component: TicketQuatreEtatsDiagram },
  { name: "AuthorityLayersDiagram", kind: "schema", course: "hermes", component: AuthorityLayersDiagram },
  { name: "TrousseauMinimal", kind: "schema", course: "hermes", component: TrousseauMinimalDiagram },
  { name: "MainAvantLeMondeExterieur", kind: "schema", course: "hermes", component: MainAvantLeMondeExterieurDiagram },
  { name: "CompteurDeMission", kind: "schema", course: "hermes", component: CompteurDeMissionDiagram },
  { name: "WorkshopDiagram", kind: "schema", course: "hermes", component: WorkshopDiagram },
  { name: "FicheMissionRemplie", kind: "maquette", course: "hermes", component: FicheMissionRemplieMockup },
  { name: "TroisPortesDuPilote", kind: "schema", course: "hermes", component: TroisPortesDuPiloteDiagram },
  { name: "QuatreCartesQuiCassent", kind: "schema", course: "hermes", component: QuatreCartesQuiCassentDiagram },
  { name: "ProofLayersDiagram", kind: "schema", course: "hermes", component: ProofLayersDiagram },
  { name: "DeuxCouloirsMemeTest", kind: "schema", course: "hermes", component: DeuxCouloirsMemeTestDiagram },
  { name: "TableauDeTestSkill", kind: "maquette", course: "hermes", component: TableauDeTestSkillMockup },
  { name: "ErreurVersNouveauTest", kind: "schema", course: "hermes", component: ErreurVersNouveauTestDiagram },
  { name: "TransmissionDiagram", kind: "schema", course: "hermes", component: TransmissionDiagram },
  { name: "ValiseClientBoiteMethode", kind: "schema", course: "hermes", component: ValiseClientBoiteMethodeDiagram },
  { name: "CinqTiroirsDuSavoir", kind: "schema", course: "hermes", component: CinqTiroirsDuSavoirDiagram },
  { name: "CarteConditionDeRetrait", kind: "schema", course: "hermes", component: CarteConditionDeRetraitDiagram },
  { name: "ParcoursClair", kind: "schema", course: "general", component: ProjectStepsSchema },
  { name: "PageOffreAnnotée", kind: "maquette", course: "general", component: OfferPageMockup },
] as const;

export const SCHEMA_REGISTRY = registry([
  ...READER_VISUAL_CATALOG
    .filter((entry) => entry.kind === "schema")
    .map((entry) => [entry.name, entry.component] as const),
  ["ParcoursClair", ProjectStepsSchema],
  ["ÉtapesDuProjet", ProjectStepsSchema],
  ["EtapesDuProjet", ProjectStepsSchema],
]);

export const MOCKUP_REGISTRY = registry([
  ...READER_VISUAL_CATALOG
    .filter((entry) => entry.kind === "maquette")
    .map((entry) => [entry.name, entry.component] as const),
  ["PageOffreAnnotée", OfferPageMockup],
  ["PageOffreAnnotee", OfferPageMockup],
]);

export function resolveReaderVisual(kind: ReaderVisualKind, name: string): ReaderVisualComponent | undefined {
  const component = (kind === "schema" ? SCHEMA_REGISTRY : MOCKUP_REGISTRY).get(normalizeVisualName(name));
  if (!component && process.env.NODE_ENV !== "production") {
    console.warn(`[reader] ${kind} inconnu : ${name}`);
  }
  return component;
}

export function readerVisualElement(kind: ReaderVisualKind, name: string): ReactElement | null {
  const component = resolveReaderVisual(kind, name);
  return component ? createElement(component) : null;
}
