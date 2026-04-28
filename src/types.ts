export type ContinentCode = "EG" | "AGU" | "UAG" | "PAGU" | "OGU";

export type SupportStatus =
  | "supporter"
  | "watch"
  | "persuadable"
  | "resistant";

export type PrimaryNeed =
  | "continuity"
  | "development"
  | "funding"
  | "visibility"
  | "governance"
  | "fairness"
  | "events";

export type FederationTier = "A" | "B" | "C";

export type ResearchStatus = "verified" | "mixed" | "seed";
export type SourceStatus = "verified" | "strategic" | "pending";
export type ResearchTaskStatus = "verified" | "in_progress" | "open";

export interface AuthorityRole {
  role: string;
  name: string;
  term: string;
  category: "executive" | "technical" | "continental" | "athlete" | "honorary";
  groupName?: string;
  groupType?:
    | "authority"
    | "commission"
    | "working_group"
    | "honorary"
    | "continental_union";
  positionId?: number;
  source?: "official" | "supplement";
  sourceUrl?: string;
}

export interface FigEventRecord {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  countryCode: string;
  status: string;
  disciplines: string[];
  hasResults: boolean;
  sourceUrl: string;
}

export interface FigEventSummary {
  countryCode: string;
  totalEvents: number;
  recentEventCount: number;
  upcomingEventCount: number;
  flagshipEventCount: number;
  eventScore: number;
  recentHighlights: FigEventRecord[];
  upcomingHighlights: FigEventRecord[];
}

export interface VisualSignal {
  label: string;
  value: string;
  tone: "high" | "medium" | "watch";
  note: string;
}

export interface CountrySource {
  title: string;
  url: string;
  note: string;
  kind: "official" | "federation" | "internal";
  status: SourceStatus;
}

export interface ResearchTask {
  title: string;
  owner: string;
  note: string;
  status: ResearchTaskStatus;
}

export interface ContactLogEntry {
  date: string;
  actor: string;
  channel: "desk" | "email" | "call" | "visit";
  summary: string;
  nextStep: string;
}

export interface VisualDeckCard {
  title: string;
  caption: string;
  metric: string;
  tone: "emerald" | "amber" | "blue";
}

export interface StrategicRelationship {
  countryCode: string;
  label: string;
  kind: "ally" | "swing" | "competitive";
  note: string;
}

export interface FederationDirectoryRecord {
  countryCode: string;
  federationName: string;
  continent: ContinentCode;
  disciplines: string[];
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  president: string;
  secretaryGeneral: string;
}

export interface FederationSeed {
  countryCode: string;
  countryName: string;
  federationName: string;
  continent: ContinentCode;
  president: string;
  secretaryGeneral: string;
  disciplines: string[];
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  status: SupportStatus;
  primaryNeed: PrimaryNeed;
  needTags: string[];
  relationshipStrength: number;
  influence: number;
  federationTier: FederationTier;
  figRoles: AuthorityRole[];
  figPowerIndex: number;
  technicalCommitteeStatus: string;
  judgesInfluence: string;
  politicalPower: string;
  diplomaticAllies: string[];
  frictionPoints: string[];
  achievements: string[];
  languages: string[];
  athleteCapacity: string;
  facilities: string;
  facilityScore: number;
  strategyPath: string[];
  visualSignals: VisualSignal[];
  researchStatus: ResearchStatus;
  decisionArchitecture: string[];
  entryChannels: string[];
  persuasionPayload: string[];
  redLines: string[];
  congressScenario: string[];
  expectations: string[];
  relationshipNetwork: StrategicRelationship[];
  athleteBaseEstimate: string;
  nationalTeamHighlights: string[];
  medalHighlights: string[];
  countryRanking: string;
  hostedEvents: string[];
  officialEventFootprint: FigEventSummary;
  sources: CountrySource[];
  researchTasks: ResearchTask[];
  contactLog: ContactLogEntry[];
  visualDeck: VisualDeckCard[];
  notes: string;
  messaging: string[];
  monthlyHooks: string[];
  priorityScore: number;
  coordinates?: [number, number];
}

export interface ContinentSummary {
  total: number;
  supporter: number;
  watch: number;
  persuadable: number;
  resistant: number;
  averageRelationship: number;
}

export interface CountryRoadmapInput {
  countryCode: string;
  countryName: string;
  continent: ContinentCode;
  status: SupportStatus;
  primaryNeed: PrimaryNeed;
  relationshipStrength: number;
}

export interface RoadmapStep {
  month: string;
  focus: string;
  objective: string;
  deliverable: string;
}
