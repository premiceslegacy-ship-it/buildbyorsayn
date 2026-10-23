import { createElement, type ComponentType, type ReactElement } from "react";
import { COFFRE_VISUAL_CATALOG } from "./coffre";
import { DOCTRINE_VISUAL_CATALOG } from "./doctrine";
import { INTRO_VISUAL_CATALOG } from "./intro";
import { PROTOCOLE_VISUAL_CATALOG } from "./protocole/index";
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
import { OffreCRMAvantApresMockup, PreuveAuMemeNiveauDiagram, SceneTravailPreuveChoixDiagram } from "./hermes/12-expliquer-loffre";
import { FicheProspectQualifieMockup, MessageVersFicheCRMDiagram, QuestionsQuiOuvrentUneRouteDiagram, RelanceDansWhatsAppMockup } from "./hermes/13-qualifier-et-livrer";
import { AgentsParTravailDiagram, DesaccordVisibleDiagram, FederatedBrainDiagramV2, QuatreMetiersUneVueDiagram } from "./hermes/14-relier-lequipe";
import { CinqParcoursMetierDiagram, PasseportDuDossierDiagram, RefusQuiAideDiagram, RelaisDuDossierDiagram } from "./hermes/15-suivre-les-passages";
import { DataFormatsDiagramV2, QuatreFormatsQuatreUsagesDiagram, SourceEtCopiesDateesDiagram, ValeurQuiChangeDiagram } from "./hermes/16-ranger-les-informations";
import { BriquesDeCompetenceDiagram, DossierSkillReelMockup, SkillCommeDossierOuvertDiagram, SkillsSopDiagramV2 } from "./hermes/17-transformer-en-skill";
import { CarteOutilsParRoleDiagram, LireAgirRelireDiagram, ToolAccessDiagramV2, TroisPortesUnServiceDiagram } from "./hermes/18-connecter-les-outils";
import { ParcoursProspectCompletDiagram, WorkflowAdsDiagram, WorkflowCRMDevisSupportDiagram, WorkflowCrossPoleDiagramV2, WorkflowMarketingDiagram } from "./hermes/19-faire-passer-le-dossier";
import { AdoptionLaddersDiagramV2, EscalierDesDroitsDiagram, SortieDeSecoursDiagram, TableauAvantApresPiloteMockup } from "./hermes/20-commencer-petit";
import { ArborescencePiloteTerminalMockup, ContratMissionLisibleMockup, PassationEnSixCartesDiagram, TemplateTreeDiagram } from "./hermes/21-laisser-un-dossier";
import { CalendrierTachePlanifieeMockup, ManuelPuisPlanifieDiagram, PauseNarretePasLeTrainDiagram, TerminalCronEtHistoriqueMockup, VeillePlanifieeAvecFreinDiagram } from "./hermes/22-planifier-sans-perdre-la-main";
import { FlowDiagram } from "./layouts";
import { WebPage } from "./kit";

export type ReaderVisualKind = "maquette" | "schema";
export type ReaderVisualComponent = ComponentType;
export type ReaderVisualCourse = "coffre" | "fondations" | "general" | "hermes";
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
  return createElement(WebPage, {
    title: "Une page qui se comprend dans l'ordre",
    description: "Le regard trouve la promesse, la preuve et l'action sans devoir décoder la mise en page.",
    ariaLabel: "Une page d'offre de chauffagiste annotée : le titre nomme le résultat et le délai, la preuve vient avant le bouton, et l'offre réunit contenu, prix et prochaine étape.",
    accent: "#22d96e",
    page: {
      url: "atelier-dupre.fr",
      nav: "Atelier Dupré",
      heading: "Chaudière remplacée en une journée, devis fixe sous 48 h",
      subtitle: "Dépose de l'ancienne, pose de la nouvelle, mise en service le jour même.",
      button: "Voir l'offre",
      screen: { title: "Ton offre", rows: [{ left: "Contenu", right: "dépose, pose, mise en service", state: "ok" }, { left: "Prix", right: "fixe, annoncé avant", state: "ok" }, { left: "Prochaine étape", right: "visite sous 5 jours", state: "todo" }] },
      proofs: ["Photos de vrais chantiers"],
    },
    annotations: [
      { number: 1, target: "heading", label: "Le titre nomme le résultat attendu.", why: "Le résultat (une chaudière remplacée) et le délai (une journée) sont dans la même phrase.", alt: "Le nombre de chaudières posées l'an dernier." },
      { number: 2, target: "image", label: "L'offre réunit les détails au même endroit.", why: "Contenu, prix et prochaine étape se lisent d'un coup d'œil, sans changer de page.", alt: "Un devis type en PDF, à télécharger." },
      { number: 3, target: "proofs", label: "La preuve arrive avant la demande d'action.", why: "Des photos de vrais chantiers répondent à « est-ce sérieux ? » avant le clic.", alt: "L'avis d'un client, avec son quartier." },
    ],
  });
}

function registry(entries: ReadonlyArray<readonly [string, ReaderVisualComponent]>) {
  return new Map(entries.map(([name, component]) => [normalizeVisualName(name), component]));
}

export const READER_VISUAL_CATALOG: readonly ReaderVisualCatalogEntry[] = [
  ...COFFRE_VISUAL_CATALOG.map(({ name, kind, component }) => ({ name, kind, course: "coffre" as const, component })),
  ...DOCTRINE_VISUAL_CATALOG.map(({ name, kind, component }) => ({ name, kind, course: "general" as const, component })),
  ...INTRO_VISUAL_CATALOG.map(({ name, kind, component }) => ({ name, kind, course: "general" as const, component })),
  ...PROTOCOLE_VISUAL_CATALOG.map(({ name, kind, component }) => ({ name, kind, course: "general" as const, component })),
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
  { name: "SceneTravailPreuveChoix", kind: "schema", course: "hermes", component: SceneTravailPreuveChoixDiagram },
  { name: "OffreCRMAvantApres", kind: "maquette", course: "hermes", component: OffreCRMAvantApresMockup },
  { name: "PreuveAuMemeNiveau", kind: "schema", course: "hermes", component: PreuveAuMemeNiveauDiagram },
  { name: "FicheProspectQualifie", kind: "maquette", course: "hermes", component: FicheProspectQualifieMockup },
  { name: "QuestionsQuiOuvrentUneRoute", kind: "schema", course: "hermes", component: QuestionsQuiOuvrentUneRouteDiagram },
  { name: "MessageVersFicheCRM", kind: "schema", course: "hermes", component: MessageVersFicheCRMDiagram },
  { name: "RelanceDansWhatsApp", kind: "maquette", course: "hermes", component: RelanceDansWhatsAppMockup },
  { name: "FederatedBrainDiagram", kind: "schema", course: "hermes", component: FederatedBrainDiagramV2 },
  { name: "QuatreMetiersUneVue", kind: "schema", course: "hermes", component: QuatreMetiersUneVueDiagram },
  { name: "AgentsParTravail", kind: "schema", course: "hermes", component: AgentsParTravailDiagram },
  { name: "DesaccordVisible", kind: "schema", course: "hermes", component: DesaccordVisibleDiagram },
  { name: "RelaisDuDossier", kind: "schema", course: "hermes", component: RelaisDuDossierDiagram },
  { name: "PasseportDuDossier", kind: "schema", course: "hermes", component: PasseportDuDossierDiagram },
  { name: "CinqParcoursMetier", kind: "schema", course: "hermes", component: CinqParcoursMetierDiagram },
  { name: "RefusQuiAide", kind: "schema", course: "hermes", component: RefusQuiAideDiagram },
  { name: "DataFormatsDiagram", kind: "schema", course: "hermes", component: DataFormatsDiagramV2 },
  { name: "SourceEtCopiesDatees", kind: "schema", course: "hermes", component: SourceEtCopiesDateesDiagram },
  { name: "QuatreFormatsQuatreUsages", kind: "schema", course: "hermes", component: QuatreFormatsQuatreUsagesDiagram },
  { name: "ValeurQuiChange", kind: "schema", course: "hermes", component: ValeurQuiChangeDiagram },
  { name: "SkillCommeDossierOuvert", kind: "schema", course: "hermes", component: SkillCommeDossierOuvertDiagram },
  { name: "SkillsSopDiagram", kind: "schema", course: "hermes", component: SkillsSopDiagramV2 },
  { name: "DossierSkillReel", kind: "maquette", course: "hermes", component: DossierSkillReelMockup },
  { name: "BriquesDeCompetence", kind: "schema", course: "hermes", component: BriquesDeCompetenceDiagram },
  { name: "TroisPortesUnService", kind: "schema", course: "hermes", component: TroisPortesUnServiceDiagram },
  { name: "ToolAccessDiagram", kind: "schema", course: "hermes", component: ToolAccessDiagramV2 },
  { name: "CarteOutilsParRole", kind: "schema", course: "hermes", component: CarteOutilsParRoleDiagram },
  { name: "LireAgirRelire", kind: "schema", course: "hermes", component: LireAgirRelireDiagram },
  { name: "ParcoursProspectComplet", kind: "schema", course: "hermes", component: ParcoursProspectCompletDiagram },
  { name: "WorkflowMarketing", kind: "schema", course: "hermes", component: WorkflowMarketingDiagram },
  { name: "WorkflowAds", kind: "schema", course: "hermes", component: WorkflowAdsDiagram },
  { name: "WorkflowCRMDevisSupport", kind: "schema", course: "hermes", component: WorkflowCRMDevisSupportDiagram },
  { name: "WorkflowCrossPoleDiagram", kind: "schema", course: "hermes", component: WorkflowCrossPoleDiagramV2 },
  { name: "AdoptionLaddersDiagram", kind: "schema", course: "hermes", component: AdoptionLaddersDiagramV2 },
  { name: "EscalierDesDroits", kind: "schema", course: "hermes", component: EscalierDesDroitsDiagram },
  { name: "TableauAvantApresPilote", kind: "maquette", course: "hermes", component: TableauAvantApresPiloteMockup },
  { name: "SortieDeSecours", kind: "schema", course: "hermes", component: SortieDeSecoursDiagram },
  { name: "TemplateTreeDiagram", kind: "schema", course: "hermes", component: TemplateTreeDiagram },
  { name: "ArborescencePiloteTerminal", kind: "maquette", course: "hermes", component: ArborescencePiloteTerminalMockup },
  { name: "ContratMissionLisible", kind: "maquette", course: "hermes", component: ContratMissionLisibleMockup },
  { name: "PassationEnSixCartes", kind: "schema", course: "hermes", component: PassationEnSixCartesDiagram },
  { name: "CalendrierTachePlanifiee", kind: "maquette", course: "hermes", component: CalendrierTachePlanifieeMockup },
  { name: "ManuelPuisPlanifie", kind: "schema", course: "hermes", component: ManuelPuisPlanifieDiagram },
  { name: "TerminalCronEtHistorique", kind: "maquette", course: "hermes", component: TerminalCronEtHistoriqueMockup },
  { name: "VeillePlanifieeAvecFrein", kind: "schema", course: "hermes", component: VeillePlanifieeAvecFreinDiagram },
  { name: "PauseNarretePasLeTrain", kind: "schema", course: "hermes", component: PauseNarretePasLeTrainDiagram },
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
