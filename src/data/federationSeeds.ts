import rawFederations from "./figAffiliates.tsv?raw";
import federationDirectoryData from "./federationDirectory.json";
import authorityRolesData from "./authorityRoles.json";
import { intelligenceOverrides } from "./intelligenceOverrides";
import type {
  AuthorityRole,
  ContinentCode,
  FederationTier,
  FederationDirectoryRecord,
  FederationSeed,
  PrimaryNeed,
  SupportStatus
} from "../types";

type SeedOverride = Partial<
  Omit<FederationSeed, "countryCode" | "continent" | "federationName" | "priorityScore">
>;

const continentDefaults: Record<
  ContinentCode,
  Omit<
    FederationSeed,
    | "countryCode"
    | "countryName"
    | "federationName"
    | "continent"
    | "president"
    | "secretaryGeneral"
    | "disciplines"
    | "addressLine1"
    | "addressLine2"
    | "city"
    | "country"
    | "phone"
    | "email"
    | "website"
    | "federationTier"
    | "figRoles"
    | "figPowerIndex"
    | "technicalCommitteeStatus"
    | "judgesInfluence"
    | "politicalPower"
    | "diplomaticAllies"
    | "frictionPoints"
    | "achievements"
    | "languages"
    | "athleteCapacity"
    | "facilities"
    | "facilityScore"
    | "strategyPath"
    | "visualSignals"
    | "researchStatus"
    | "decisionArchitecture"
    | "entryChannels"
    | "persuasionPayload"
    | "redLines"
    | "congressScenario"
    | "expectations"
    | "relationshipNetwork"
    | "athleteBaseEstimate"
    | "nationalTeamHighlights"
    | "medalHighlights"
    | "countryRanking"
    | "hostedEvents"
    | "sources"
    | "researchTasks"
    | "contactLog"
    | "visualDeck"
    | "priorityScore"
  >
> = {
  EG: {
    status: "watch",
    primaryNeed: "fairness",
    needTags: ["judging alignment", "event economics", "decision access"],
    relationshipStrength: 56,
    influence: 64,
    notes:
      "Europe carries high medal weight and expects governance credibility, judging consistency, and event quality.",
    messaging: [
      "FIG needs a president who can protect fairness while improving delivery.",
      "Event hosts need cost discipline, not extra bureaucracy.",
      "Technical credibility must convert into operational reliability."
    ],
    monthlyHooks: [
      "technical alignment",
      "host economics",
      "committee dialogue"
    ]
  },
  AGU: {
    status: "watch",
    primaryNeed: "continuity",
    needTags: ["stability", "education", "technology rollout"],
    relationshipStrength: 48,
    influence: 61,
    notes:
      "Asia needs a continuity message: protect the value of the Watanabe cycle while showing sharper execution.",
    messaging: [
      "Bu bir istikrar candidacysi; mevcut dongunun iyi yanlarini korurken teslimati guclendirir.",
      "What works should stay; what is unfinished must finally land.",
      "Education and digital judging support should be made more usable federation by federation."
    ],
    monthlyHooks: [
      "continuity reassurance",
      "education hubs",
      "technology trust"
    ]
  },
  UAG: {
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["equipment", "coach education", "solidarity fund"],
    relationshipStrength: 44,
    influence: 47,
    notes:
      "Africa is the strongest growth theatre. Development delivery matters more than abstract institutional language.",
    messaging: [
      "A solidarity fund must be visible, fair, and fast.",
      "Coach, judge, and admin education should be easier to reach.",
      "Small federations need practical help, not only speeches."
    ],
    monthlyHooks: [
      "development audit",
      "equipment package",
      "education track"
    ]
  },
  PAGU: {
    status: "watch",
    primaryNeed: "visibility",
    needTags: ["commercial growth", "athlete welfare", "broadcast value"],
    relationshipStrength: 46,
    influence: 58,
    notes:
      "PAGU responds to athlete positioning, event visibility, and transparent governance more than purely continental politics.",
    messaging: [
      "Athlete-first governance should be visible in budgets and calendars.",
      "Commercial value must translate into federation value.",
      "The next FIG cycle should make gymnastics easier to sell and easier to host."
    ],
    monthlyHooks: [
      "athlete benefit",
      "commercial upside",
      "calendar discipline"
    ]
  },
  OGU: {
    status: "persuadable",
    primaryNeed: "funding",
    needTags: ["travel support", "remote learning", "small federation package"],
    relationshipStrength: 42,
    influence: 33,
    notes:
      "Oceania needs practical support: travel cost relief, remote education, and formats that work for small islands.",
    messaging: [
      "Remote-first education can close the distance gap.",
      "Small island federations need flexible support and simpler administration.",
      "Travel-heavy regions should feel the benefit of a global president."
    ],
    monthlyHooks: [
      "small federation plan",
      "travel relief",
      "remote modules"
    ]
  }
};

type AuthorityRecord = {
  role: string;
  name: string;
  countryCode: string;
  term: string;
};

const statusWeight: Record<SupportStatus, number> = {
  supporter: 18,
  watch: 50,
  persuadable: 84,
  resistant: 12
};

const needWeight: Record<PrimaryNeed, number> = {
  continuity: 10,
  development: 18,
  funding: 17,
  visibility: 12,
  governance: 15,
  fairness: 14,
  events: 13
};

const countryNameOverrides: Record<string, string> = {
  AFG: "Afghanistan",
  ALB: "Albania",
  ALG: "Algeria",
  AND: "Andorra",
  ANG: "Angola",
  ANT: "Antigua and Barbuda",
  ARG: "Argentina",
  ARM: "Armenia",
  ARU: "Aruba",
  ASA: "American Samoa",
  AUS: "Australia",
  AUT: "Austria",
  AZE: "Azerbaijan",
  BAH: "Bahamas",
  BAN: "Bangladesh",
  BAR: "Barbados",
  BEL: "Belgium",
  BEN: "Benin",
  BER: "Bermuda",
  BIH: "Bosnia and Herzegovina",
  BLR: "Belarus",
  BOL: "Bolivia",
  BRA: "Brazil",
  BRN: "Bahrain",
  BUL: "Bulgaria",
  BUR: "Burkina Faso",
  CAM: "Cambodia",
  CAN: "Canada",
  CAY: "Cayman Islands",
  CGO: "Congo",
  CHA: "Chad",
  CHI: "Chile",
  CHN: "China",
  CIV: "Cote d'Ivoire",
  CMR: "Cameroon",
  COD: "DR Congo",
  COK: "Cook Islands",
  COL: "Colombia",
  COM: "Comoros",
  CPV: "Cape Verde",
  CRC: "Costa Rica",
  CRO: "Croatia",
  CUB: "Cuba",
  CYP: "Cyprus",
  CZE: "Czechia",
  DEN: "Denmark",
  DOM: "Dominican Republic",
  ECU: "Ecuador",
  EGY: "Egypt",
  ESA: "El Salvador",
  ESP: "Spain",
  EST: "Estonia",
  ETH: "Ethiopia",
  FIJ: "Fiji",
  FIN: "Finland",
  FRA: "France",
  GBR: "Great Britain",
  GEO: "Georgia",
  GER: "Germany",
  GRE: "Greece",
  GUA: "Guatemala",
  GUI: "Guinea",
  GUM: "Guam",
  HAI: "Haiti",
  HKG: "Hong Kong",
  HON: "Honduras",
  HUN: "Hungary",
  INA: "Indonesia",
  IND: "India",
  IRI: "Iran",
  IRL: "Ireland",
  IRQ: "Iraq",
  ISL: "Iceland",
  ISR: "Israel",
  ITA: "Italy",
  JAM: "Jamaica",
  JOR: "Jordan",
  JPN: "Japan",
  KAZ: "Kazakhstan",
  KEN: "Kenya",
  KGZ: "Kyrgyzstan",
  KOR: "South Korea",
  KOS: "Kosovo",
  KSA: "Saudi Arabia",
  KUW: "Kuwait",
  LAO: "Laos",
  LAT: "Latvia",
  LBA: "Libya",
  LBN: "Lebanon",
  LES: "Lesotho",
  LIE: "Liechtenstein",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  MAD: "Madagascar",
  MAR: "Morocco",
  MAS: "Malaysia",
  MDA: "Moldova",
  MEX: "Mexico",
  MGL: "Mongolia",
  MKD: "North Macedonia",
  MLI: "Mali",
  MLT: "Malta",
  MNE: "Montenegro",
  MON: "Monaco",
  MOZ: "Mozambique",
  MRI: "Mauritius",
  MYA: "Myanmar",
  NAM: "Namibia",
  NCA: "Nicaragua",
  NED: "Netherlands",
  NEP: "Nepal",
  NGR: "Nigeria",
  NOR: "Norway",
  NZL: "New Zealand",
  PAK: "Pakistan",
  PAN: "Panama",
  PAR: "Paraguay",
  PER: "Peru",
  PHI: "Philippines",
  PLE: "Palestine",
  PNG: "Papua New Guinea",
  POL: "Poland",
  POR: "Portugal",
  PRK: "North Korea",
  PUR: "Puerto Rico",
  QAT: "Qatar",
  ROU: "Romania",
  RSA: "South Africa",
  RUS: "Russia",
  RWA: "Rwanda",
  SEN: "Senegal",
  SGP: "Singapore",
  SLE: "Sierra Leone",
  SLO: "Slovenia",
  SMR: "San Marino",
  SRB: "Serbia",
  SRI: "Sri Lanka",
  STP: "Sao Tome and Principe",
  SUD: "Sudan",
  SUI: "Switzerland",
  SVK: "Slovakia",
  SWE: "Sweden",
  SWZ: "Eswatini",
  SYR: "Syria",
  TGA: "Tonga",
  THA: "Thailand",
  TJK: "Tajikistan",
  TKM: "Turkmenistan",
  TOG: "Togo",
  TPE: "Chinese Taipei",
  TTO: "Trinidad and Tobago",
  TUN: "Tunisia",
  TUR: "Turkiye",
  UGA: "Uganda",
  UKR: "Ukraine",
  URU: "Uruguay",
  USA: "United States",
  UZB: "Uzbekistan",
  VEN: "Venezuela",
  VIE: "Vietnam",
  VIN: "Saint Vincent and the Grenadines",
  YEM: "Yemen",
  ZAM: "Zambia",
  ZIM: "Zimbabwe"
};

const strategicCountryOverrides: Record<string, SeedOverride> = {
  TUR: {
    countryName: "Turkiye",
    status: "supporter",
    primaryNeed: "governance",
    needTags: ["home base", "coalition discipline", "proof of competence"],
    relationshipStrength: 96,
    influence: 88,
    notes:
      "Anchor federation. The campaign must look globally minded, not nationally self-referential.",
    messaging: [
      "Leadership should be credible, calm, and execution-first.",
      "The candidate already understands FIG mechanics from inside the system.",
      "Support must be converted into cross-continental validators."
    ],
    monthlyHooks: ["coalition whip", "surrogate outreach", "proof points"],
    coordinates: [35.2, 39.0]
  },
  JPN: {
    countryName: "Japan",
    status: "watch",
    primaryNeed: "continuity",
    needTags: ["continuity", "respectful transition", "unfinished delivery"],
    relationshipStrength: 57,
    influence: 92,
    notes:
      "Japan is not a conversion-by-pressure theatre. The message must be respectful: continuity with stronger delivery.",
    messaging: [
      "Bu kampanya istikrar odaklidir; mevcut dongunun iyi islerini korurken teslimati guclendirir.",
      "Stability, institutional respect, and clearer delivery matter.",
      "Good projects should remain, but execution must become sharper."
    ],
    monthlyHooks: ["continuity brief", "legacy respect", "delivery proof"],
    coordinates: [138.2, 36.2]
  },
  CHN: {
    countryName: "China",
    status: "watch",
    primaryNeed: "continuity",
    needTags: ["stability", "global role", "technical credibility"],
    relationshipStrength: 52,
    influence: 95,
    notes:
      "Strategic heavyweight. Needs reassurance that reform will not create volatility.",
    messaging: [
        "The next cycle should protect stability while improving operational depth.",
        "Technical credibility and event value should be reinforced together.",
        "Large federations should see a serious, calm operator."
    ],
    monthlyHooks: ["stability narrative", "high-level diplomacy", "technical respect"],
    coordinates: [104.2, 35.8]
  },
  KAZ: {
    countryName: "Kazakhstan",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["regional influence", "education", "event access"],
    relationshipStrength: 49,
    influence: 72,
    notes:
      "Important bridge between Asia and post-Soviet relationships.",
    messaging: [
      "Regional leaders should gain more practical development tools.",
      "Coach and judge education must be easier to access.",
      "The new presidency should reward active federations with tangible support."
    ],
    monthlyHooks: ["regional bridge", "education offer", "event access"],
    coordinates: [67.9, 48.0]
  },
  UZB: {
    countryName: "Uzbekistan",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["development visibility", "technical exchange", "regional balance"],
    relationshipStrength: 47,
    influence: 69,
    notes:
      "Good conversion target with strong technical culture.",
    messaging: [
      "The next cycle should make development visible, not symbolic.",
      "Regional technical exchanges should become faster and more practical.",
      "A working president must help active federations grow their role."
    ],
    monthlyHooks: ["regional respect", "technical exchange", "visible support"],
    coordinates: [64.6, 41.3]
  },
  THA: {
    countryName: "Thailand",
    status: "persuadable",
    primaryNeed: "events",
    needTags: ["event value", "host support", "regional activation"],
    relationshipStrength: 45,
    influence: 60,
    notes: "Good target for event and visibility messaging.",
    messaging: [
      "FIG events should be easier to host and easier to monetize.",
      "Regional activity should create clearer pathways to visibility.",
      "Hosts deserve operational support, not only regulation."
    ],
    monthlyHooks: ["host economics", "regional activity", "event packaging"],
    coordinates: [101.0, 15.8]
  },
  PHI: {
    countryName: "Philippines",
    status: "persuadable",
    primaryNeed: "visibility",
    needTags: ["athlete spotlight", "fan growth", "digital reach"],
    relationshipStrength: 44,
    influence: 55,
    notes: "Responds well to visibility, athlete pathway, and digital packaging.",
    messaging: [
      "Athlete visibility should convert into federation value.",
      "Digital tools must help smaller federations look bigger.",
      "A modern FIG should make it easier to activate fans."
    ],
    monthlyHooks: ["athlete spotlight", "digital content", "fan growth"],
    coordinates: [122.7, 12.8]
  },
  IND: {
    countryName: "India",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["scale potential", "education", "athlete pathway"],
    relationshipStrength: 42,
    influence: 76,
    notes:
      "Large-scale growth market. Needs a concrete development proposition, not generic inspiration.",
    messaging: [
      "Scale requires systems: education, administration, and athlete pathway tools.",
      "The next FIG cycle should expand federation capacity, not only competition inventory.",
      "A president should help growth markets grow faster."
    ],
    monthlyHooks: ["scale pitch", "capacity building", "pathway tools"],
    coordinates: [78.9, 22.8]
  },
  QAT: {
    countryName: "Qatar",
    status: "persuadable",
    primaryNeed: "events",
    needTags: ["high-end events", "global positioning", "technical prestige"],
    relationshipStrength: 51,
    influence: 73,
    notes: "High influence node in AGU with strong event logic.",
    messaging: [
      "The next president should make premium events easier to package globally.",
      "Technical prestige should connect to brand prestige.",
      "Well-run events should matter more in FIG value creation."
    ],
    monthlyHooks: ["premium events", "brand prestige", "AGU bridge"],
    coordinates: [51.2, 25.3]
  },
  KOR: {
    countryName: "South Korea",
    status: "watch",
    primaryNeed: "fairness",
    needTags: ["judging trust", "technical consistency", "elite credibility"],
    relationshipStrength: 53,
    influence: 74,
    notes: "A trust-driven elite federation. Fairness matters.",
    messaging: [
      "Judging confidence is a political issue as much as a technical one.",
      "Elite systems need consistency and predictability.",
      "A calm, technical presidency can strengthen trust."
    ],
    monthlyHooks: ["judging trust", "elite consistency", "technical calm"],
    coordinates: [127.8, 36.3]
  },
  EGY: {
    countryName: "Egypt",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["equipment package", "coach education", "continental hub role"],
    relationshipStrength: 51,
    influence: 79,
    notes:
      "Egypt is one of the strongest African conversion targets and can shape broader UAG tone.",
    messaging: [
      "Development support should be fast, fair, and measurable.",
      "Continental hubs deserve a stronger role in coach and judge education.",
      "Active federations should feel the upside of global leadership."
    ],
    monthlyHooks: ["UAG bridge", "equipment support", "education hub"],
    coordinates: [30.8, 26.7]
  },
  ALG: {
    countryName: "Algeria",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["coach clinics", "apparatus support", "regional partnership"],
    relationshipStrength: 46,
    influence: 62,
    notes: "Needs concrete and realistic development delivery.",
    messaging: [
      "Coach and judge education should become easier to reach.",
      "Support should be transparent and federation-facing.",
      "North African partnerships can become visible engines of growth."
    ],
    monthlyHooks: ["north africa", "coach clinics", "visible support"],
    coordinates: [2.8, 28.1]
  },
  RSA: {
    countryName: "South Africa",
    status: "persuadable",
    primaryNeed: "visibility",
    needTags: ["continental leadership", "event value", "digital profile"],
    relationshipStrength: 48,
    influence: 75,
    notes:
      "South Africa can influence broader UAG sentiment if the offer feels modern and serious.",
    messaging: [
      "African leadership should be visible in the next FIG cycle.",
      "Event value and digital presence should reach active federations too.",
      "A global president must make continental leaders more visible."
    ],
    monthlyHooks: ["african leadership", "event value", "visibility pitch"],
    coordinates: [24.7, -28.5]
  },
  MAR: {
    countryName: "Morocco",
    status: "watch",
    primaryNeed: "development",
    needTags: ["solidarity fund", "education", "regional bridge"],
    relationshipStrength: 47,
    influence: 57,
    notes: "A softer development target; often influenced by broader UAG mood.",
    messaging: [
      "Solidarity support should be transparent and practical.",
      "Education must move faster than paperwork.",
      "Regional bridges need real incentives."
    ],
    monthlyHooks: ["solidarity fund", "paperwork reduction", "regional bridge"],
    coordinates: [-6.3, 31.8]
  },
  TUN: {
    countryName: "Tunisia",
    status: "watch",
    primaryNeed: "development",
    needTags: ["judge education", "coach education", "governance support"],
    relationshipStrength: 46,
    influence: 53,
    notes: "Education and structured governance support can move this desk.",
    messaging: [
      "Certified education should be easier to access.",
      "Smaller active federations need practical governance help.",
      "Delivery matters more than slogans."
    ],
    monthlyHooks: ["education ladder", "governance support", "quiet persuasion"]
  } as SeedOverride,
  NGR: {
    countryName: "Nigeria",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["coach base", "youth growth", "equipment access"],
    relationshipStrength: 41,
    influence: 65,
    notes: "High-upside growth theatre if support feels concrete.",
    messaging: [
      "Youth growth needs equipment and coaching pathways.",
      "Active growth markets deserve more visible support.",
      "A modern FIG should be present before medals appear, not after."
    ],
    monthlyHooks: ["youth growth", "equipment access", "pathway tools"],
    coordinates: [8.7, 9.1]
  },
  KEN: {
    countryName: "Kenya",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["school gymnastics", "coach education", "small federation tools"],
    relationshipStrength: 40,
    influence: 52,
    notes: "Needs grassroots and school-entry logic more than elite rhetoric.",
    messaging: [
      "School-entry gymnastics can expand the base quickly.",
      "Coach education should be modular and remote-friendly.",
      "Small federations need simple tools they can actually use."
    ],
    monthlyHooks: ["school entry", "remote education", "simple tools"],
    coordinates: [37.9, 0.2]
  },
  UGA: {
    countryName: "Uganda",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["grassroots", "education", "equipment starter kits"],
    relationshipStrength: 39,
    influence: 46,
    notes: "A classic development vote: practical support wins.",
    messaging: [
      "Starter kits and education move faster than policy papers.",
      "The next FIG cycle must include smaller active federations.",
      "Support should be visible at grassroots level."
    ],
    monthlyHooks: ["starter kit", "grassroots", "inclusion proof"],
    coordinates: [32.3, 1.3]
  },
  USA: {
    countryName: "United States",
    status: "watch",
    primaryNeed: "governance",
    needTags: ["safeguarding", "transparency", "athlete trust"],
    relationshipStrength: 47,
    influence: 98,
    notes:
      "High-stakes governance desk. Safeguarding and institutional trust are central.",
    messaging: [
      "Athlete trust must stay at the center of FIG governance.",
      "Transparency should be visible in process and reporting.",
      "Operational seriousness matters more than political theatre."
    ],
    monthlyHooks: ["governance trust", "safeguarding", "institutional seriousness"],
    coordinates: [-98.5, 39.5]
  },
  CAN: {
    countryName: "Canada",
    status: "watch",
    primaryNeed: "governance",
    needTags: ["safe sport", "athlete welfare", "transparent process"],
    relationshipStrength: 48,
    influence: 72,
    notes: "Similar to USA but easier to move through serious governance language.",
    messaging: [
      "Safe sport must stay visible in the next cycle.",
      "Athlete welfare should show up in budgets, calendars, and culture.",
      "A measured, transparent presidency is a strength."
    ],
    monthlyHooks: ["safe sport", "athlete welfare", "measured tone"],
    coordinates: [-106.3, 56.1]
  },
  BRA: {
    countryName: "Brazil",
    status: "watch",
    primaryNeed: "visibility",
    needTags: ["event packaging", "fan growth", "commercial upside"],
    relationshipStrength: 49,
    influence: 83,
    notes: "Brazil likes strong event value and visible gymnastics growth logic.",
    messaging: [
      "Event value must become federation value.",
      "Fan growth and digital packaging should help active federations.",
      "The sport needs stronger storytelling and stronger delivery."
    ],
    monthlyHooks: ["fan growth", "digital packaging", "event value"],
    coordinates: [-51.2, -10.3]
  },
  MEX: {
    countryName: "Mexico",
    status: "watch",
    primaryNeed: "events",
    needTags: ["host economics", "calendar balance", "regional leadership"],
    relationshipStrength: 50,
    influence: 74,
    notes: "Good PAGU bridge if host and calendar arguments are sharp.",
    messaging: [
      "Hosts deserve lower friction and better support.",
      "Calendar balance should protect athletes and organizers.",
      "Regional leaders should feel stronger FIG partnership."
    ],
    monthlyHooks: ["host economics", "calendar balance", "PAGU bridge"],
    coordinates: [-102.3, 23.8]
  },
  COL: {
    countryName: "Colombia",
    status: "persuadable",
    primaryNeed: "visibility",
    needTags: ["athlete profile", "digital reach", "continental positioning"],
    relationshipStrength: 45,
    influence: 60,
    notes: "A visibility and athlete-promotion desk.",
    messaging: [
      "Athlete visibility should translate into local federation value.",
      "Digital reach should help raise gymnastics profile continentally.",
      "Modern storytelling is now part of governance."
    ],
    monthlyHooks: ["athlete profile", "digital reach", "continental positioning"],
    coordinates: [-74.1, 4.6]
  },
  DOM: {
    countryName: "Dominican Republic",
    status: "persuadable",
    primaryNeed: "funding",
    needTags: ["travel support", "coach education", "competition access"],
    relationshipStrength: 42,
    influence: 45,
    notes: "Practical support desk with regional ripple value.",
    messaging: [
      "Travel and competition access still shape participation.",
      "Smaller federations need faster educational support.",
      "The next FIG cycle should be easier to feel on the ground."
    ],
    monthlyHooks: ["travel support", "competition access", "education"],
    coordinates: [-70.5, 18.9]
  },
  GUA: {
    countryName: "Guatemala",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["coach pathways", "equipment", "administrative support"],
    relationshipStrength: 41,
    influence: 44,
    notes: "Ground-level development conversation.",
    messaging: [
      "Development needs to be practical and local.",
      "Coach pathways and equipment access still matter most.",
      "Administrative simplification can unlock growth."
    ],
    monthlyHooks: ["local development", "equipment", "admin simplification"],
    coordinates: [-90.3, 15.7]
  },
  NCA: {
    countryName: "Nicaragua",
    status: "persuadable",
    primaryNeed: "development",
    needTags: ["small federation package", "equipment", "visibility"],
    relationshipStrength: 40,
    influence: 42,
    notes: "Persuadable via practical support and recognition.",
    messaging: [
      "Small federations need a package they can actually use.",
      "Recognition plus equipment support can change participation.",
      "Visibility should not only belong to large markets."
    ],
    monthlyHooks: ["small federation package", "recognition", "equipment"],
    coordinates: [-85.0, 12.8]
  },
  ARG: {
    countryName: "Argentina",
    status: "watch",
    primaryNeed: "visibility",
    needTags: ["event narrative", "fan engagement", "athlete profile"],
    relationshipStrength: 46,
    influence: 64,
    notes: "Needs a credible growth story rather than narrow politics.",
    messaging: [
      "Gymnastics needs stronger narrative and fan value.",
      "Athlete profile should feed federation profile.",
      "A growth presidency should make the sport easier to see and sell."
    ],
    monthlyHooks: ["narrative", "fan engagement", "athlete profile"],
    coordinates: [-64.1, -34.1]
  },
  CHI: {
    countryName: "Chile",
    status: "watch",
    primaryNeed: "events",
    needTags: ["host support", "competition formats", "visibility"],
    relationshipStrength: 45,
    influence: 52,
    notes: "Event logic can move this desk.",
    messaging: [
      "Competition formats should become easier to activate and package.",
      "Host support should be visible and practical.",
      "Visibility should rise with better event design."
    ],
    monthlyHooks: ["event formats", "host support", "visibility"],
    coordinates: [-71.2, -30.0]
  },
  AUS: {
    countryName: "Australia",
    status: "watch",
    primaryNeed: "funding",
    needTags: ["travel pressure", "small region support", "remote education"],
    relationshipStrength: 49,
    influence: 78,
    notes:
      "Australia matters because it can anchor Oceania mood. Needs practical regional support logic.",
    messaging: [
      "Travel-heavy regions deserve a president who understands distance costs.",
      "Remote education should become a permanent FIG asset.",
      "Small federation support should be more structured."
    ],
    monthlyHooks: ["regional anchor", "travel costs", "remote education"],
    coordinates: [134.5, -25.7]
  },
  NZL: {
    countryName: "New Zealand",
    status: "watch",
    primaryNeed: "funding",
    needTags: ["travel support", "remote modules", "small federation fairness"],
    relationshipStrength: 47,
    influence: 58,
    notes: "Often moved by practical fairness arguments for remote regions.",
    messaging: [
      "Remote regions should not be structurally disadvantaged.",
      "Travel support and remote modules are governance issues too.",
      "Small federation fairness needs visible policy."
    ],
    monthlyHooks: ["remote fairness", "travel support", "small federation policy"],
    coordinates: [172.6, -41.2]
  },
  FIJ: {
    countryName: "Fiji",
    status: "persuadable",
    primaryNeed: "funding",
    needTags: ["travel relief", "starter support", "digital education"],
    relationshipStrength: 38,
    influence: 29,
    notes: "Classic small-island persuasion desk.",
    messaging: [
      "Small island federations need travel-sensitive policy.",
      "Starter support and digital education can change participation.",
      "The next president should make distance feel smaller."
    ],
    monthlyHooks: ["travel relief", "digital education", "small island support"],
    coordinates: [178.1, -17.8]
  },
  PNG: {
    countryName: "Papua New Guinea",
    status: "persuadable",
    primaryNeed: "funding",
    needTags: ["travel cost", "starter kits", "coach basics"],
    relationshipStrength: 37,
    influence: 28,
    notes: "Needs direct, simple support promises.",
    messaging: [
      "Travel costs should be part of federation support logic.",
      "Starter kits and coach basics are high-impact tools.",
      "Distance should not define opportunity."
    ],
    monthlyHooks: ["starter kit", "coach basics", "travel logic"],
    coordinates: [145.2, -6.3]
  },
  TGA: {
    countryName: "Tonga",
    status: "persuadable",
    primaryNeed: "funding",
    needTags: ["small island package", "remote access", "travel support"],
    relationshipStrength: 36,
    influence: 21,
    notes: "Small-island logic desk.",
    messaging: [
      "The future FIG must work for small islands too.",
      "Remote access and travel support are essential.",
      "Support should scale to federation reality."
    ],
    monthlyHooks: ["small island package", "remote access", "travel"],
    coordinates: [-175.2, -21.2]
  },
  CRO: {
    countryName: "Croatia",
    status: "supporter",
    primaryNeed: "events",
    needTags: ["surrogate support", "event credibility", "European bridge"],
    relationshipStrength: 82,
    influence: 58,
    notes: "Potential validator in Europe if coalition handled well.",
    messaging: [
      "A working president should strengthen technically serious European partners.",
      "Event credibility and delivery discipline matter.",
      "Europe needs a calm operator."
    ],
    monthlyHooks: ["surrogate support", "european bridge", "event credibility"],
    coordinates: [16.4, 45.1]
  },
  BUL: {
    countryName: "Bulgaria",
    status: "supporter",
    primaryNeed: "fairness",
    needTags: ["technical trust", "regional coalition", "judge consistency"],
    relationshipStrength: 77,
    influence: 52,
    notes: "Support can also be used as regional proof of trust.",
    messaging: [
      "Technical trust should turn into coalition confidence.",
      "A FIG president must be fair and readable.",
      "Regional validators matter."
    ],
    monthlyHooks: ["regional validator", "technical trust", "judge consistency"],
    coordinates: [25.3, 42.7]
  },
  CZE: {
    countryName: "Czechia",
    status: "supporter",
    primaryNeed: "events",
    needTags: ["host value", "technical seriousness", "european alignment"],
    relationshipStrength: 72,
    influence: 51,
    notes: "Supportive but should be nurtured through serious operational language.",
    messaging: [
      "Host value and delivery discipline should improve together.",
      "The next president should look technically serious and politically calm.",
      "European alignment matters."
    ],
    monthlyHooks: ["operational language", "host value", "alignment"],
    coordinates: [15.4, 49.9]
  },
  HUN: {
    countryName: "Hungary",
    status: "supporter",
    primaryNeed: "fairness",
    needTags: ["technical pathways", "event quality", "relationship maintenance"],
    relationshipStrength: 74,
    influence: 60,
    notes: "Strong relationship maintenance desk.",
    messaging: [
      "Fairness and event quality can define the next cycle.",
      "Reliable delivery should be visible to strong federations.",
      "Support must remain warm, not assumed."
    ],
    monthlyHooks: ["relationship maintenance", "fairness", "event quality"],
    coordinates: [19.4, 47.1]
  },
  POR: {
    countryName: "Portugal",
    status: "supporter",
    primaryNeed: "visibility",
    needTags: ["discipline value", "event profile", "committee trust"],
    relationshipStrength: 70,
    influence: 49,
    notes: "Supportive but wants a serious European coalition feel.",
    messaging: [
      "Discipline visibility must continue to grow.",
      "A working presidency should help events and committees move faster.",
      "Europe needs structure, not noise."
    ],
    monthlyHooks: ["visibility", "committee trust", "coalition feel"],
    coordinates: [-8.1, 39.7]
  },
  ROU: {
    countryName: "Romania",
    status: "supporter",
    primaryNeed: "fairness",
    needTags: ["historical weight", "athlete pathways", "technical confidence"],
    relationshipStrength: 71,
    influence: 66,
    notes: "Historically resonant desk. Technical respect matters.",
    messaging: [
      "The next FIG president should respect tradition while fixing execution.",
      "Athlete pathways and judging fairness both matter.",
      "Technical confidence is political confidence."
    ],
    monthlyHooks: ["historical weight", "technical respect", "pathways"],
    coordinates: [24.9, 45.9]
  },
  SRB: {
    countryName: "Serbia",
    status: "supporter",
    primaryNeed: "governance",
    needTags: ["regional coordination", "coalition discipline", "trust"],
    relationshipStrength: 69,
    influence: 50,
    notes: "Useful validator if handled respectfully.",
    messaging: [
      "Regional coordination should feel disciplined and serious.",
      "The campaign must project trust and reliability.",
      "Coalitions grow through clarity."
    ],
    monthlyHooks: ["regional coordination", "trust", "clarity"],
    coordinates: [20.8, 44.1]
  },
  SLO: {
    countryName: "Slovenia",
    status: "watch",
    primaryNeed: "events",
    needTags: ["competition value", "broadcast quality", "technical image"],
    relationshipStrength: 61,
    influence: 46,
    notes: "Watch desk with event quality logic.",
    messaging: [
      "Competition products need stronger visual and commercial value.",
      "Technical image matters in how FIG is perceived.",
      "A calm operator can improve both."
    ],
    monthlyHooks: ["competition value", "broadcast quality", "technical image"],
    coordinates: [14.9, 46.1]
  },
  GER: {
    countryName: "Germany",
    status: "persuadable",
    primaryNeed: "governance",
    needTags: ["transparency", "athlete trust", "operational seriousness"],
    relationshipStrength: 51,
    influence: 90,
    notes:
      "One of the most important European persuasion desks. Governance, safeguarding, and seriousness matter.",
    messaging: [
      "The next presidency must feel trustworthy, transparent, and professionally managed.",
      "Athlete trust and governance quality are not side issues.",
      "Operational seriousness should be visible from day one."
    ],
    monthlyHooks: ["governance", "athlete trust", "professional management"],
    coordinates: [10.1, 51.2]
  },
  ITA: {
    countryName: "Italy",
    status: "watch",
    primaryNeed: "events",
    needTags: ["event quality", "brand value", "athlete profile"],
    relationshipStrength: 56,
    influence: 81,
    notes: "Important but often moved by elite event logic and visible leadership quality.",
    messaging: [
      "Event quality and brand quality should rise together.",
      "Athlete profile must connect to federation value.",
      "The next president should be visibly capable."
    ],
    monthlyHooks: ["brand value", "event quality", "capability signal"],
    coordinates: [12.8, 42.8]
  },
  FRA: {
    countryName: "France",
    status: "watch",
    primaryNeed: "governance",
    needTags: ["institutional seriousness", "event value", "safeguarding"],
    relationshipStrength: 54,
    influence: 88,
    notes: "High-value watch desk.",
    messaging: [
      "FIG needs institutional seriousness and delivery discipline.",
      "Safeguarding should remain central.",
      "The next cycle should feel more coherent and more valuable."
    ],
    monthlyHooks: ["institutional seriousness", "safeguarding", "coherence"],
    coordinates: [2.2, 46.5]
  },
  GBR: {
    countryName: "Great Britain",
    status: "watch",
    primaryNeed: "governance",
    needTags: ["safe sport", "decision transparency", "athlete confidence"],
    relationshipStrength: 53,
    influence: 87,
    notes: "A governance-heavy watch desk.",
    messaging: [
      "Athlete confidence and safe sport must remain visible.",
      "Decision-making should be more understandable and more transparent.",
      "The next president should project maturity and consistency."
    ],
    monthlyHooks: ["safe sport", "decision transparency", "maturity"],
    coordinates: [-2.8, 54.0]
  },
  ESP: {
    countryName: "Spain",
    status: "watch",
    primaryNeed: "events",
    needTags: ["host economics", "discipline growth", "visibility"],
    relationshipStrength: 55,
    influence: 74,
    notes: "A mixed event and visibility desk.",
    messaging: [
      "Host economics should improve if FIG wants more active organizers.",
      "Discipline growth needs better visibility.",
      "A serious presidency should help active members grow."
    ],
    monthlyHooks: ["host economics", "discipline growth", "visibility"],
    coordinates: [-3.7, 40.3]
  },
  NED: {
    countryName: "Netherlands",
    status: "watch",
    primaryNeed: "governance",
    needTags: ["clean governance", "athlete trust", "clarity"],
    relationshipStrength: 52,
    influence: 65,
    notes: "Likely to respond to governance clarity.",
    messaging: [
      "Clean governance should be felt, not only declared.",
      "Athlete trust and operational clarity should stay central.",
      "The next president must look dependable."
    ],
    monthlyHooks: ["clean governance", "dependability", "clarity"],
    coordinates: [5.4, 52.2]
  },
  SUI: {
    countryName: "Switzerland",
    status: "watch",
    primaryNeed: "governance",
    needTags: ["institutional credibility", "transparency", "execution"],
    relationshipStrength: 54,
    influence: 63,
    notes: "An institutional credibility desk.",
    messaging: [
      "Institutional credibility should come from transparency and delivery.",
      "A calm presidency is an asset.",
      "Execution quality matters."
    ],
    monthlyHooks: ["institutional credibility", "delivery", "calm tone"],
    coordinates: [8.2, 46.8]
  },
  AZE: {
    countryName: "Azerbaijan",
    status: "resistant",
    primaryNeed: "continuity",
    needTags: ["competitive bloc", "legacy politics", "relationship containment"],
    relationshipStrength: 26,
    influence: 71,
    notes:
      "Competitive desk. Not the first place to spend persuasion capital; containment and monitoring are more important.",
    messaging: [
      "Do not over-invest. Track movement and isolate ripple effects.",
      "Keep tone respectful and avoid personalized contrast.",
      "Use third-party validators rather than direct pressure."
    ],
    monthlyHooks: ["containment", "monitoring", "validator strategy"],
    coordinates: [47.6, 40.3]
  }
};

const directoryByCode = Object.fromEntries(
  (federationDirectoryData as FederationDirectoryRecord[]).map((entry) => [
    entry.countryCode,
    entry
  ])
) as Record<string, FederationDirectoryRecord>;

const toRoleCategory = (role: string): AuthorityRole["category"] => {
  if (role.includes("TC") || role.includes("FIG GFA C")) {
    return "technical";
  }

  if (role.includes("AGU President") || role.includes("EG President") || role.includes("UAG President") || role.includes("PAGU President") || role.includes("OGU President")) {
    return "continental";
  }

  if (role.includes("Athletes' Representative")) {
    return "athlete";
  }

  return "executive";
};

const rolesByCountry = (authorityRolesData as AuthorityRecord[]).reduce<
  Record<string, AuthorityRole[]>
>((accumulator, role) => {
  const entry: AuthorityRole = {
    role: role.role,
    name: role.name,
    term: role.term,
    category: toRoleCategory(role.role)
  };

  if (!accumulator[role.countryCode]) {
    accumulator[role.countryCode] = [];
  }

  accumulator[role.countryCode].push(entry);
  return accumulator;
}, {});

const federationTierFrom = (
  influence: number,
  roles: AuthorityRole[]
): FederationTier => {
  const roleBoost = roles.some((role) => role.role.includes("Vice-President"))
    ? 12
    : roles.length * 5;
  const score = influence + roleBoost;

  if (score >= 82) {
    return "A";
  }

  if (score >= 58) {
    return "B";
  }

  return "C";
};

const figPowerIndexFrom = (roles: AuthorityRole[], influence: number) => {
  const executiveWeight = roles.filter((role) => role.category === "executive").length * 18;
  const technicalWeight = roles.filter((role) => role.category === "technical").length * 14;
  const continentalWeight = roles.filter((role) => role.category === "continental").length * 16;
  const athleteWeight = roles.filter((role) => role.category === "athlete").length * 10;

  return Math.min(
    100,
    Math.round(influence * 0.45 + executiveWeight + technicalWeight + continentalWeight + athleteWeight)
  );
};

const technicalStatusFrom = (roles: AuthorityRole[], disciplines: string[]) => {
  const technicalRoles = roles.filter((role) => role.category === "technical");

  if (technicalRoles.length > 0) {
    return technicalRoles.map((role) => role.role).join(", ");
  }

  if (disciplines.length >= 6) {
    return "No verified FIG TC presidency, but broad discipline footprint suggests medium technical depth.";
  }

  return "No verified FIG technical committee presidency in current official authority list.";
};

const judgesInfluenceFrom = (
  roles: AuthorityRole[],
  influence: number,
  disciplines: string[]
) => {
  if (roles.some((role) => role.category === "technical")) {
    return "High - verified FIG technical committee leadership present.";
  }

  if (influence >= 72 || disciplines.length >= 6) {
    return "Medium - broad technical footprint, but no verified FIG TC presidency in the current official list.";
  }

  return "Low-to-medium - needs field verification through judges and committee mapping.";
};

const politicalPowerFrom = (
  continent: ContinentCode,
  roles: AuthorityRole[],
  influence: number
) => {
  if (roles.some((role) => role.role.includes("Vice-President"))) {
    return "High FIG executive access with direct agenda visibility.";
  }

  if (roles.some((role) => role.category === "continental")) {
    return "High continental leverage with bloc-shaping potential.";
  }

  if (influence >= 75) {
    return `High ${continentMetaLabel(continent)} influence; politics run through prestige and validator networks.`;
  }

  if (influence >= 55) {
    return `Medium ${continentMetaLabel(continent)} influence; important as a bridge desk rather than a bloc commander.`;
  }

  return "Limited formal power; practical relationship-building matters more than institutional weight.";
};

const continentMetaLabel = (continent: ContinentCode) => {
  switch (continent) {
    case "EG":
      return "European";
    case "AGU":
      return "Asian";
    case "UAG":
      return "African";
    case "PAGU":
      return "American";
    case "OGU":
      return "Oceanian";
  }
};

const defaultAlliesFrom = (continent: ContinentCode) => {
  switch (continent) {
    case "EG":
      return ["European technical desks", "active event hosts"];
    case "AGU":
      return ["continuity-minded Asian desks", "education-first federations"];
    case "UAG":
      return ["development hubs", "equipment-and-education desks"];
    case "PAGU":
      return ["athlete-value desks", "broadcast-minded federations"];
    case "OGU":
      return ["small federation advocates", "travel-sensitive partners"];
  }
};

const defaultFrictionFrom = (continent: ContinentCode) => {
  switch (continent) {
    case "EG":
      return ["opaque governance", "weak fairness language"];
    case "AGU":
      return ["anti-continuity tone", "unstable reform messaging"];
    case "UAG":
      return ["abstract development promises", "slow delivery"];
    case "PAGU":
      return ["thin athlete-benefit narrative", "unclear commercial upside"];
    case "OGU":
      return ["travel-insensitive policy", "small federation neglect"];
  }
};

const defaultAchievementsFrom = (
  roles: AuthorityRole[],
  disciplines: string[]
) => {
  if (roles.length > 0) {
    return roles.map(
      (role) => `Verified: ${role.role} currently held by ${role.name}.`
    );
  }

  return [
    `Verified: federation is active in ${disciplines.length} FIG-recognized discipline areas.`,
    "Research needed for richer medal, hosting, and referee achievement history."
  ];
};

const athleteCapacityFrom = (influence: number, disciplines: string[]) => {
  if (influence >= 82) {
    return `Very high. Broad discipline base (${disciplines.length}) and strong elite visibility.`;
  }

  if (influence >= 60) {
    return `Medium-high. Multi-discipline capacity with room to convert visibility into influence.`;
  }

  return `Developing-to-medium. Discipline activity exists, but needs field verification on depth and conversion.`;
};

const facilityScoreFrom = (influence: number, disciplines: string[]) => {
  return Math.min(90, Math.round(32 + influence * 0.48 + disciplines.length * 2.2));
};

const facilitiesFrom = (facilityScore: number, continent: ContinentCode) => {
  if (facilityScore >= 82) {
    return "Strong infrastructure profile with visible event or high-performance readiness.";
  }

  if (facilityScore >= 64) {
    return `Functional infrastructure with ${continentMetaLabel(continent).toLowerCase()}-level relevance; exact depth still needs venue-by-venue verification.`;
  }

  return "Developing infrastructure profile; practical support and capacity-building likely matter.";
};

const defaultStrategyPathFrom = (
  need: PrimaryNeed,
  countryName: string
) => [
  `Open ${countryName} with a listening-first brief anchored in ${need}.`,
  "Translate the offer into a federation-facing value package.",
  "Move from warm access to explicit delegate-level commitment."
];

const visualSignalsFrom = (
  figPowerIndex: number,
  facilityScore: number,
  researchStatus: FederationSeed["researchStatus"]
): FederationSeed["visualSignals"] => [
  {
    label: "FIG Power",
    value: String(figPowerIndex),
    tone: figPowerIndex >= 72 ? "high" : figPowerIndex >= 45 ? "medium" : "watch",
    note: "Derived from verified authority roles plus influence"
  },
  {
    label: "Facility Score",
    value: String(facilityScore),
    tone: facilityScore >= 78 ? "high" : facilityScore >= 60 ? "medium" : "watch",
    note: "Strategic infrastructure estimate"
  },
  {
    label: "Research Depth",
    value: researchStatus,
    tone: researchStatus === "verified" ? "high" : researchStatus === "mixed" ? "medium" : "watch",
    note: "Officially verified fields are mixed with strategic inference"
  }
];

const decisionArchitectureFrom = ({
  countryName,
  president,
  secretaryGeneral,
  figRoles,
  status,
  continent
}: {
  countryName: string;
  president: string;
  secretaryGeneral: string;
  figRoles: AuthorityRole[];
  status: SupportStatus;
  continent: ContinentCode;
}): FederationSeed["decisionArchitecture"] => {
  const lines = [
    president
      ? `${countryName} masasinda dogrudan karar merkezi baskan ${president} etrafinda sekilleniyor.`
      : `${countryName} masasinda baskanlik ekseni teyit bekliyor; ilk gorusmede karar merkezini netlestirmek kritik.`,
    secretaryGeneral
      ? `Sekreter genel ${secretaryGeneral}, operasyon akisi ve yazili temas sirasini belirleyen ikinci kilit halka.`
      : "Sekreterya yapisi saha teyidi gerektiriyor; yazili temas akisi bu hatta baglanmali."
  ];

  if (figRoles.length > 0) {
    lines.push(
      `${figRoles[0].role} baglantisi, bu masada ulusal iradenin ustune kurumsal agirlik kataniyor.`
    );
  } else {
    lines.push(
      `${continentMetaLabel(continent)} aglar ve yakin federasyonlar, resmi koltuk eksikligini telafi eden dolayli etki kanali olusturuyor.`
    );
  }

  lines.push(
    status === "supporter"
      ? "Karar mantigi destek koruma ve blok disina tasma potansiyeli uzerinden okunmali."
      : "Karar mantigi iceride savunulabilir somut fayda paketi gosterildiginde yumusuyor."
  );

  return lines;
};

const entryChannelsFrom = ({
  figRoles,
  diplomaticAllies,
  primaryNeed,
  countryName,
  continent
}: {
  figRoles: AuthorityRole[];
  diplomaticAllies: string[];
  primaryNeed: PrimaryNeed;
  countryName: string;
  continent: ContinentCode;
}): FederationSeed["entryChannels"] => {
  const lines = [
    figRoles.length > 0
      ? `${figRoles[0].role} hattina yakin isimler uzerinden ust seviye giris kurulabilir.`
      : `${continentMetaLabel(continent)} ag ve yakin federasyonlar uzerinden dolayli giris kurulmasi daha dogru.`
  ];

  if (diplomaticAllies.length > 0) {
    lines.push(
      `${diplomaticAllies.slice(0, 2).join(" ve ")} uzerinden yumusak validator girisi acilabilir.`
    );
  }

  lines.push(
    `${countryName} ile ikinci temas ${needLabelForLogs(primaryNeed)} basliginda kisisellestirilmis fayda dosyasi uzerinden yapilmali.`
  );

  return lines;
};

const persuasionPayloadFrom = ({
  primaryNeed,
  athleteCapacity,
  facilities,
  judgesInfluence
}: {
  primaryNeed: PrimaryNeed;
  athleteCapacity: string;
  facilities: string;
  judgesInfluence: string;
}): FederationSeed["persuasionPayload"] => {
  switch (primaryNeed) {
    case "continuity":
      return [
        "Iyi giden yapilarin korunacagi, eksik teslimatin ise daha iyi yonetilecegi anlatilmali.",
        `Sporcu ve sistem kapasitesi icin mesaj: ${athleteCapacity}`,
        `Teknik guven tarafinda kullanilacak ikinci kart: ${judgesInfluence}`
      ];
    case "development":
      return [
        "Ekipman, egitim ve idari kolaylastirma tek paket halinde sunulmali.",
        `Saha argumani: ${facilities}`,
        `Kapasite karti: ${athleteCapacity}`
      ];
    case "funding":
      return [
        "Seyahat maliyeti, uzaktan erisim ve kucuk federasyon destegi ayni cumlede kurulmalı.",
        `Altyapi baglami: ${facilities}`,
        "Fonlama soyut degil, takvimlenmis ve gorunur bir model olarak anlatilmali."
      ];
    case "visibility":
      return [
        "Sporcu gorunurlugu ile federasyon degerini birbirine baglayan net bir anlatim kullanilmali.",
        `Kapasite zemini: ${athleteCapacity}`,
        "Dijital icerik, yayin degeri ve etkinlik paketi ayni eksende sunulmali."
      ];
    case "governance":
      return [
        "Seffaflik, safeguarding ve karar ciddiyeti birlikte sunulmali.",
        `Teknik arka plan karti: ${judgesInfluence}`,
        "Yonetişim vaadi, soyut etik dili degil operasyon modelini gostermeli."
      ];
    case "fairness":
      return [
        "Hakemlik guveni ve teknik tutarlilik, politik guvenle birlikte anlatilmali.",
        `Teknik derinlik: ${judgesInfluence}`,
        `Ev sahipligi ve altyapi referansi: ${facilities}`
      ];
    case "events":
      return [
        "Etkinlik ekonomisi, format temizligi ve marka kalitesi tek pakete baglanmali.",
        `Altyapi kozumuz: ${facilities}`,
        `Saha kapasitesi: ${athleteCapacity}`
      ];
  }
};

const redLinesFrom = ({
  frictionPoints,
  primaryNeed,
  status
}: {
  frictionPoints: string[];
  primaryNeed: PrimaryNeed;
  status: SupportStatus;
}): FederationSeed["redLines"] => {
  const lines = frictionPoints.slice(0, 2).map(
    (point) => `${point} bu masada dogrudan sogutucu etki yaratir.`
  );

  if (primaryNeed === "continuity") {
    lines.push("Kopus veya sert degisim tonu kullanilmamali.");
  }

  if (primaryNeed === "governance") {
    lines.push("Belirsiz yonetisim dili ve kisisel yakinlik siyaseti ters teper.");
  }

  if (status === "supporter") {
    lines.push("Destek var diye fazla baski kurulmamali; sadakat yipranabilir.");
  } else {
    lines.push("Taahhut istemeden once federasyonun iceride savunabilecegi yazili bir fayda dosyasi hazir olmali.");
  }

  return lines;
};

const congressScenarioFrom = ({
  countryName,
  status,
  relationshipStrength,
  primaryNeed
}: {
  countryName: string;
  status: SupportStatus;
  relationshipStrength: number;
  primaryNeed: PrimaryNeed;
}): FederationSeed["congressScenario"] => {
  const lines = [
    `${countryName} icin kongre haftasi hedefi ${status === "supporter" ? "destegi sabitlemek" : "kararsizligi faydaya cevirerek taahhude yaklastirmak"}.`
  ];

  lines.push(
    relationshipStrength >= 70
      ? "Son temas sicak ama olcuyu koruyan bir validator cagrisi ile yapilmali."
      : "Son temas, kisa ve net bir fayda paketiyle; gereksiz baski kurmadan yapilmali."
  );

  lines.push(
    `${needLabelForLogs(primaryNeed)} basligi kongre konusmasi veya ikili gorusme notunda mutlaka gorunur olmali.`
  );

  return lines;
};

const expectationsFrom = ({
  primaryNeed,
  continent,
  status
}: {
  primaryNeed: PrimaryNeed;
  continent: ContinentCode;
  status: SupportStatus;
}): FederationSeed["expectations"] => {
  const lines = [
    `${continentMetaLabel(continent)} masalarda liderlik tonu sakin, uygulanabilir ve kurumsal olmalı.`,
    `${needLabelForLogs(primaryNeed)} basliginda federasyona dogrudan fayda gosteren bir teklif beklenir.`
  ];

  lines.push(
    status === "supporter"
      ? "Beklenti, mevcut yakinligin somut rola ve görünür saygiya donusmesidir."
      : "Beklenti, federasyonun iceride savunabilecegi somut ve yazili bir kazanım dosyasidir."
  );

  return lines;
};

const relationshipNetworkFrom = ({
  diplomaticAllies,
  frictionPoints
}: {
  diplomaticAllies: string[];
  frictionPoints: string[];
}): FederationSeed["relationshipNetwork"] => {
  const allies = diplomaticAllies.slice(0, 2).map((item) => ({
    countryCode: item,
    label: item,
    kind: "ally" as const,
    note: "Bu hat, giris ve validator zinciri icin kullanilabilir."
  }));
  const swings = diplomaticAllies.slice(2, 3).map((item) => ({
    countryCode: item,
    label: item,
    kind: "swing" as const,
    note: "Bu iliski, dogru paket sunulursa oy davranisini etkileyebilir."
  }));
  const competitors = frictionPoints.slice(0, 2).map((item) => ({
    countryCode: item.split(" ")[0],
    label: item,
    kind: "competitive" as const,
    note: "Bu hat, dolayli zarar veya blok sertlesmesi uretebilir."
  }));

  return [...allies, ...swings, ...competitors];
};

const athleteBaseEstimateFrom = (
  influence: number,
  disciplines: string[]
): FederationSeed["athleteBaseEstimate"] => {
  if (influence >= 82) {
    return `Tahmini 120+ elit ve gelisim havuzu; ${disciplines.length} disiplinli genis milli takim cekirdegi.`;
  }

  if (influence >= 60) {
    return `Tahmini 45-90 ust seviye sporcu havuzu; ${disciplines.length} disiplinli orta genislikte milli takim cekirdegi.`;
  }

  return `Tahmini 15-40 ust seviye sporcu havuzu; milli takim cekirdegi dar ama buyumeye acik.`;
};

const nationalTeamHighlightsFrom = ({
  athleteCapacity,
  disciplines
}: {
  athleteCapacity: string;
  disciplines: string[];
}): FederationSeed["nationalTeamHighlights"] => [
  athleteCapacity,
  `${disciplines.length} disiplinlik gorunurluk, milli takim cesitliligi icin ilk olumlu sinyal.`,
  "Milli sporcu sayisi ve aktif havuz buyuklugu saha teyidiyle derinlestirilmeli."
];

const medalHighlightsFrom = ({
  achievements,
  influence
}: {
  achievements: string[];
  influence: number;
}): FederationSeed["medalHighlights"] => {
  const lines = achievements.slice(0, 2);

  lines.push(
    influence >= 80
      ? "Kuresel basari bandi ust segmentte; madalyali profil secici ve etkili."
      : influence >= 60
        ? "Kita ve dunya duzeyinde gorunurluk uretebilen bir madalya profili var."
        : "Madalyali sporcu profili sinirli; buyume anlatisi daha guclu koz olabilir."
  );

  return lines;
};

const countryRankingFrom = (
  influence: number,
  facilityScore: number
): FederationSeed["countryRanking"] => {
  if (influence >= 85 || facilityScore >= 85) {
    return "Kuresel basari bandi: ilk 10-15 arasi etkili seviye.";
  }

  if (influence >= 65 || facilityScore >= 72) {
    return "Kuresel basari bandi: ilk 15-35 arasi orta-ust seviye.";
  }

  return "Kuresel basari bandi: gelismekte olan veya secili disiplinlerde cikis arayan seviye.";
};

const hostedEventsFrom = ({
  countryName,
  facilityScore,
  continent
}: {
  countryName: string;
  facilityScore: number;
  continent: ContinentCode;
}): FederationSeed["hostedEvents"] => {
  if (facilityScore >= 84) {
    return [
      `${countryName} buyuk olcekli uluslararasi organizasyon almaya elverisli bir profil ciziyor.`,
      "Dunya Kupasi, kitasal sampiyona veya premium event duzeyi organizasyon dili bu masada calisir.",
      "Ev sahipligi referansi, yeterince islenirse siyasi guce donusebilir."
    ];
  }

  if (facilityScore >= 68) {
    return [
      `${countryName} kitasal veya orta olcekli etkinliklerde guvenilir ev sahipligi profili sunabilir.`,
      `${continentMetaLabel(continent)} duzeyde organizasyon ve kamp kapasitesi ikna paketine dahil edilmeli.`,
      "Ev sahipligi gecmisi orta seviye ama buyumeye acik okunmali."
    ];
  }

  return [
    `${countryName} icin organizasyon karti yerine kapasite buyutme dili daha anlamli.`,
    "Yerel turnuva, gelisim kampi ve bolgesel clinic modeli daha islevsel olabilir.",
    "Tesis ve organizasyon izi icin saha teyidi gereklidir."
  ];
};

const needLabelForLogs = (need: PrimaryNeed) => {
  switch (need) {
    case "continuity":
      return "istikrar";
    case "development":
      return "gelisim";
    case "funding":
      return "fonlama";
    case "visibility":
      return "gorunurluk";
    case "governance":
      return "yonetisim";
    case "fairness":
      return "adalet";
    case "events":
      return "etkinlik degeri";
  }
};

const sourcesFrom = ({
  countryName,
  website,
  president,
  figRoles,
  researchStatus
}: {
  countryName: string;
  website: string;
  president: string;
  figRoles: AuthorityRole[];
  researchStatus: FederationSeed["researchStatus"];
}): FederationSeed["sources"] => {
  const sources: FederationSeed["sources"] = [];

  if (president) {
    sources.push({
      title: `FIG Directory - ${countryName}`,
      url: "https://www.gymnastics.sport/site/pages/viewfederation.php?id=142",
      note: "Baskan, sekreter genel ve federasyon iletisim bilgileri resmi FIG dizininden cekildi.",
      kind: "official",
      status: "verified"
    });
  }

  if (figRoles.length > 0) {
    sources.push({
      title: `FIG Authorities - ${countryName}`,
      url: "https://www.gymnastics.sport/site/pages/about-authorities.php",
      note: "FIG icindeki guncel gorevler ve teknik kurul baglantilari resmi listeden isaretlendi.",
      kind: "official",
      status: "verified"
    });
  }

  if (website) {
    sources.push({
      title: `${countryName} federasyon sitesi`,
      url: website,
      note: "Tesis, etkinlik takvimi ve yerel yonetim sinyallerini teyit etmek icin kullanilir.",
      kind: "federation",
      status: "strategic"
    });
  }

  sources.push({
    title: "Kampanya strateji tohumu",
    url: "#internal-seed",
    note:
      researchStatus === "verified"
        ? "Saha ve resmi kaynaklar birbiriyle hizali."
        : "Müttefiklik, kapasite ve saha notlari kismen stratejik cikarim icerir; yeni teyit gerektirir.",
    kind: "internal",
    status: researchStatus === "seed" ? "pending" : "strategic"
  });

  return sources;
};

const researchTasksFrom = ({
  president,
  figRoles,
  researchStatus,
  countryName
}: {
  president: string;
  figRoles: AuthorityRole[];
  researchStatus: FederationSeed["researchStatus"];
  countryName: string;
}): FederationSeed["researchTasks"] => [
  {
    title: "Federasyon liderliği teyidi",
    owner: "Masaüstü ekip",
    note: president
      ? `${countryName} baskanlik ve genel sekreter bilgisi FIG dizininde gorunuyor.`
      : `${countryName} icin baskanlik bilgisi saha teyidi bekliyor.`,
    status: president ? "verified" : "open"
  },
  {
    title: "FIG gorev ve teknik kurul haritasi",
    owner: "Politik analiz",
    note:
      figRoles.length > 0
        ? `${figRoles.length} resmi FIG rol baglantisi kayda alindi.`
        : "Resmi otorite listesinde dogrudan rol görünmuyor; dolayli etki haritasi cikarilmali.",
    status: figRoles.length > 0 ? "verified" : "open"
  },
  {
    title: "Dil, tesis ve sporcu kapasitesi saha taramasi",
    owner: "Saha arastirma",
    note:
      researchStatus === "seed"
        ? "Tesis ve sporcu verisi agirlikli olarak stratejik tohum durumda."
        : "Resmi veriler toplandi, saha teyidiyle derinlestirilmeli.",
    status: researchStatus === "seed" ? "open" : "in_progress"
  },
  {
    title: "Müttefik ve gerilim agi",
    owner: "Kampanya masasi",
    note: "Dost federasyonlar, rakip bloklar ve validator zinciri ayri ayri netlestirilmeli.",
    status: "in_progress"
  }
];

const contactLogFrom = ({
  countryName,
  primaryNeed,
  monthlyHooks,
  status
}: {
  countryName: string;
  primaryNeed: PrimaryNeed;
  monthlyHooks: string[];
  status: SupportStatus;
}): FederationSeed["contactLog"] => [
  {
    date: "20 Nis 2026",
    actor: "Istihbarat masasi",
    channel: "desk",
    summary: `${countryName} icin ilk analiz tamamlandi. Ana ihtiyac ${needLabelForLogs(primaryNeed)} olarak kodlandi.`,
    nextStep: `${monthlyHooks[0] ?? "ilk temas"} basliginda acilis notu hazirlanacak.`
  },
  {
    date: "06 May 2026",
    actor: "Bolge sorumlusu",
    channel: "email",
    summary:
      status === "supporter"
        ? "Mevcut sicak iliski koruma modunda tutulacak."
        : "Kisisellestirilmis mesaj seti ve validator listesi olusturulacak.",
    nextStep: `${monthlyHooks[1] ?? "validator temasi"} icin yazili brifing gonderilecek.`
  },
  {
    date: "18 May 2026",
    actor: "Kampanya liderligi",
    channel: "call",
    summary: "Delegeye giden kanal ve son karar verici zinciri teyit asamasina alinacak.",
    nextStep: `${monthlyHooks[2] ?? "taahhut aramasi"} basliginda ikinci temas planlanacak.`
  }
];

const visualDeckFrom = ({
  figPowerIndex,
  facilityScore,
  relationshipStrength,
  primaryNeed
}: {
  figPowerIndex: number;
  facilityScore: number;
  relationshipStrength: number;
  primaryNeed: PrimaryNeed;
}): FederationSeed["visualDeck"] => [
  {
    title: "Guc merkezi",
    caption: "FIG icindeki kurumsal agirlik seviyesi.",
    metric: `${figPowerIndex}/100`,
    tone: figPowerIndex >= 75 ? "emerald" : "blue"
  },
  {
    title: "Saha hazirligi",
    caption: "Tesis, organizasyon ve operasyon kabiliyeti.",
    metric: `${facilityScore}/100`,
    tone: facilityScore >= 75 ? "emerald" : "amber"
  },
  {
    title: "Temas modu",
    caption: "Ilk gorusmede one cikacak stratejik baslik.",
    metric: primaryNeed,
    tone: relationshipStrength >= 65 ? "emerald" : "amber"
  }
];

const priorityScoreFrom = (
  status: SupportStatus,
  need: PrimaryNeed,
  influence: number,
  relationshipStrength: number
) => {
  return (
    statusWeight[status] +
    needWeight[need] +
    influence * 0.42 +
    (100 - relationshipStrength) * 0.28
  );
};

const parseFederations = () => {
  return rawFederations
    .trim()
    .split("\n")
    .map((line) => {
      const [countryCode, federationName, continentRaw] = line.split("\t");
      return {
        countryCode,
        federationName,
        continent: continentRaw as ContinentCode
      };
    });
};

export const federationSeeds: FederationSeed[] = parseFederations().map(
  ({ countryCode, federationName, continent }) => {
    const defaults = continentDefaults[continent];
    const override = strategicCountryOverrides[countryCode];
    const intelligence = intelligenceOverrides[countryCode];
    const directory = directoryByCode[countryCode];
    const figRoles = rolesByCountry[countryCode] ?? [];
    const countryName =
      override?.countryName ?? countryNameOverrides[countryCode] ?? federationName;
    const status = override?.status ?? defaults.status;
    const primaryNeed = (override?.primaryNeed ?? defaults.primaryNeed) as PrimaryNeed;
    const needTags = override?.needTags ?? defaults.needTags;
    const relationshipStrength =
      override?.relationshipStrength ?? defaults.relationshipStrength;
    const influence = override?.influence ?? defaults.influence;
    const notes = override?.notes ?? defaults.notes;
    const messaging = override?.messaging ?? defaults.messaging;
    const monthlyHooks = override?.monthlyHooks ?? defaults.monthlyHooks;
    const federationTier = federationTierFrom(influence, figRoles);
    const figPowerIndex = figPowerIndexFrom(figRoles, influence);
    const facilityScore = intelligence?.facilityScore ?? facilityScoreFrom(influence, directory?.disciplines ?? []);
    const researchStatus =
      intelligence?.researchStatus ?? (figRoles.length > 0 ? "mixed" : "seed");
    const sources = sourcesFrom({
      countryName,
      website: directory?.website ?? "",
      president: directory?.president ?? "",
      figRoles,
      researchStatus
    });
    const researchTasks = researchTasksFrom({
      president: directory?.president ?? "",
      figRoles,
      researchStatus,
      countryName
    });
    const contactLog = contactLogFrom({
      countryName,
      primaryNeed,
      monthlyHooks,
      status
    });
    const visualDeck = visualDeckFrom({
      figPowerIndex,
      facilityScore,
      relationshipStrength,
      primaryNeed
    });
    const decisionArchitecture =
      intelligence?.decisionArchitecture ??
      decisionArchitectureFrom({
        countryName,
        president: directory?.president ?? "",
        secretaryGeneral: directory?.secretaryGeneral ?? "",
        figRoles,
        status,
        continent
      });
    const entryChannels =
      intelligence?.entryChannels ??
      entryChannelsFrom({
        figRoles,
        diplomaticAllies: intelligence?.diplomaticAllies ?? defaultAlliesFrom(continent),
        primaryNeed,
        countryName,
        continent
      });
    const persuasionPayload =
      intelligence?.persuasionPayload ??
      persuasionPayloadFrom({
        primaryNeed,
        athleteCapacity:
          intelligence?.athleteCapacity ??
          athleteCapacityFrom(influence, directory?.disciplines ?? []),
        facilities: intelligence?.facilities ?? facilitiesFrom(facilityScore, continent),
        judgesInfluence:
          intelligence?.judgesInfluence ??
          judgesInfluenceFrom(figRoles, influence, directory?.disciplines ?? [])
      });
    const redLines =
      intelligence?.redLines ??
      redLinesFrom({
        frictionPoints: intelligence?.frictionPoints ?? defaultFrictionFrom(continent),
        primaryNeed,
        status
      });
    const congressScenario =
      intelligence?.congressScenario ??
      congressScenarioFrom({
        countryName,
        status,
        relationshipStrength,
        primaryNeed
      });
    const expectations =
      intelligence?.expectations ??
      expectationsFrom({
        primaryNeed,
        continent,
        status
      });
    const relationshipNetwork =
      intelligence?.relationshipNetwork ??
      relationshipNetworkFrom({
        diplomaticAllies: intelligence?.diplomaticAllies ?? defaultAlliesFrom(continent),
        frictionPoints: intelligence?.frictionPoints ?? defaultFrictionFrom(continent)
      });
    const athleteBaseEstimate =
      intelligence?.athleteBaseEstimate ??
      athleteBaseEstimateFrom(influence, directory?.disciplines ?? []);
    const nationalTeamHighlights =
      intelligence?.nationalTeamHighlights ??
      nationalTeamHighlightsFrom({
        athleteCapacity:
          intelligence?.athleteCapacity ??
          athleteCapacityFrom(influence, directory?.disciplines ?? []),
        disciplines: directory?.disciplines ?? []
      });
    const medalHighlights =
      intelligence?.medalHighlights ??
      medalHighlightsFrom({
        achievements:
          intelligence?.achievements ??
          defaultAchievementsFrom(figRoles, directory?.disciplines ?? []),
        influence
      });
    const countryRanking =
      intelligence?.countryRanking ?? countryRankingFrom(influence, facilityScore);
    const hostedEvents =
      intelligence?.hostedEvents ??
      hostedEventsFrom({
        countryName,
        facilityScore,
        continent
      });

    return {
      countryCode,
      countryName,
      federationName,
      continent,
      president: directory?.president ?? "",
      secretaryGeneral: directory?.secretaryGeneral ?? "",
      disciplines: directory?.disciplines ?? [],
      addressLine1: directory?.addressLine1 ?? "",
      addressLine2: directory?.addressLine2 ?? "",
      city: directory?.city ?? "",
      country: directory?.country ?? countryName,
      phone: directory?.phone ?? "",
      email: directory?.email ?? "",
      website: directory?.website ?? "",
      status,
      primaryNeed,
      needTags,
      relationshipStrength,
      influence,
      federationTier,
      figRoles,
      figPowerIndex,
      technicalCommitteeStatus:
        technicalStatusFrom(figRoles, directory?.disciplines ?? []),
      judgesInfluence:
        intelligence?.judgesInfluence ??
        judgesInfluenceFrom(figRoles, influence, directory?.disciplines ?? []),
      politicalPower:
        intelligence?.politicalPower ??
        politicalPowerFrom(continent, figRoles, influence),
      diplomaticAllies:
        intelligence?.diplomaticAllies ?? defaultAlliesFrom(continent),
      frictionPoints:
        intelligence?.frictionPoints ?? defaultFrictionFrom(continent),
      achievements:
        intelligence?.achievements ??
        defaultAchievementsFrom(figRoles, directory?.disciplines ?? []),
      languages: intelligence?.languages ?? ["Needs language research"],
      athleteCapacity:
        intelligence?.athleteCapacity ??
        athleteCapacityFrom(influence, directory?.disciplines ?? []),
      facilities:
        intelligence?.facilities ?? facilitiesFrom(facilityScore, continent),
      facilityScore,
      strategyPath:
        intelligence?.strategyPath ??
        defaultStrategyPathFrom(primaryNeed, countryName),
      visualSignals:
        intelligence?.visualSignals ??
        visualSignalsFrom(figPowerIndex, facilityScore, researchStatus),
      researchStatus,
      decisionArchitecture,
      entryChannels,
      persuasionPayload,
      redLines,
      congressScenario,
      expectations,
      relationshipNetwork,
      athleteBaseEstimate,
      nationalTeamHighlights,
      medalHighlights,
      countryRanking,
      hostedEvents,
      sources,
      researchTasks,
      contactLog,
      visualDeck,
      notes,
      messaging,
      monthlyHooks,
      coordinates: override?.coordinates,
      priorityScore: priorityScoreFrom(
        status,
        primaryNeed,
        influence,
        relationshipStrength
      )
    };
  }
);
