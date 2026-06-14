import React, {
  type FormEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { db, onValue, ref, remove, set, update } from "../lib/firebase";
import { t } from "../lib/i18n";
import { useLang } from "../lib/LanguageContext";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import worldGeoData from "world-atlas/countries-110m.json";
import federationDirectoryData from "../data/federationDirectory.json";
import { federationSeeds } from "../data/federationSeeds";
import { athletesByCode } from "../data/athleteData";
import { presidentPhotoUrl, PHOTO_SOURCE } from "../data/presidentPhotos";
import {
  buildSportHighlights,
  buildStrategicSummary,
  buildCountryIdentity,
  buildOperationalChips,
  buildStrategicMoves,
  buildPowerNarrative,
  buildJudgeNarrative,
  buildAthleteNarrative,
  buildFacilityNarrative,
  buildRoleDigest,
  buildCountryDashboard,
  buildProofBullets,
  buildMessageBullets,
  continentMeta,
  primaryNeedLabel,
  translateStrategicText
} from "../lib/presentation";
import {
  rankCountriesByUrgency,
  statusTone
} from "../lib/strategy";
import { buildCountryRoadmap } from "../lib/roadmap";
import type {
  ContinentCode,
  ContactLogEntry,
  FederationDirectoryRecord,
  FederationSeed,
  FigPromise,
  PromiseCategory,
  PromiseStatus,
  SupportStatus
} from "../types";

// ── Types ─────────────────────────────────────────────────────────────
type AppView = "dashboard" | "map" | "countries" | "vaatler" | "notes" | "savaş-odası" | "takvim" | "kongre-şehri";
type CityVote = "istanbul" | "roma" | "kararsız" | "bilinmiyor";
type Sheet = "dossier" | null;
type FilterValue<T extends string> = T | "all";
type DossierTab = "genel" | "mesaj" | "iletisim" | "branşlar" | "istihbarat";
type PromiseTab = "active" | "archive" | "all";

// Notes
type Note = { id: string; countryCode: string; countryName: string; title: string; body: string; date: string; completed?: boolean };

// Overrides — status + editable texts + president contact
type CountryOverride = {
  status?: SupportStatus;
  assessment?: string;
  entryChannel?: string;
  redLine?: string;
  presidentPhone?: string;
  secretaryPhone?: string;
  commitmentLevel?: number;
  congressAttendance?: string;
  attendanceNote?: string;
  cityVote?: CityVote;
  cityVoteNote?: string;
};

const officialDirectory = federationDirectoryData as FederationDirectoryRecord[];

// ── Türkçe ülke isimleri ──────────────────────────────────────────────
const COUNTRY_TR: Record<string, string> = {
  AFG:"Afganistan", ALB:"Arnavutluk", ALG:"Cezayir", AND:"Andorra", ANG:"Angola",
  ANT:"Antigua ve Barbuda", ARG:"Arjantin", ARM:"Ermenistan", ARU:"Aruba",
  ASA:"Amerikan Samoası", AUS:"Avustralya", AUT:"Avusturya", AZE:"Azerbaycan",
  BAH:"Bahamalar", BAN:"Bangladeş", BAR:"Barbados", BEL:"Belçika", BEN:"Benin",
  BER:"Bermuda", BIH:"Bosna-Hersek", BLR:"Belarus", BOL:"Bolivya", BRA:"Brezilya",
  BRN:"Bahreyn", BUL:"Bulgaristan", BUR:"Burkina Faso", CAM:"Kamboçya",
  CAN:"Kanada", CAY:"Cayman Adaları", CGO:"Kongo", CHA:"Çad", CHI:"Şili",
  CHN:"Çin", CIV:"Fildişi Sahili", CMR:"Kamerun", COD:"Kongo DR", COK:"Cook Adaları",
  COL:"Kolombiya", COM:"Komorlar", CPV:"Yeşil Burun Adaları", CRC:"Kosta Rika",
  CRO:"Hırvatistan", CUB:"Küba", CYP:"Kıbrıs", CZE:"Çekya", DEN:"Danimarka",
  DOM:"Dominik Cumhuriyeti", ECU:"Ekvador", EGY:"Mısır", ESA:"El Salvador",
  ESP:"İspanya", EST:"Estonya", ETH:"Etiyopya", FIJ:"Fiji", FIN:"Finlandiya",
  FRA:"Fransa", GAB:"Gabon", GBR:"Büyük Britanya", GEO:"Gürcistan", GER:"Almanya",
  GHA:"Gana", GRE:"Yunanistan", GRN:"Grenada", GUA:"Guatemala", GUI:"Gine",
  GUM:"Guam", GUY:"Guyana", HAI:"Haiti", HKG:"Hong Kong", HON:"Honduras",
  HUN:"Macaristan", INA:"Endonezya", IND:"Hindistan", IRI:"İran", IRL:"İrlanda",
  IRQ:"Irak", ISL:"İzlanda", ISR:"İsrail", ISV:"ABD Virjin Adaları", ITA:"İtalya",
  JAM:"Jamaika", JOR:"Ürdün", JPN:"Japonya", KAZ:"Kazakistan", KEN:"Kenya",
  KGZ:"Kırgızistan", KOR:"Güney Kore", KOS:"Kosova", KSA:"Suudi Arabistan",
  KUW:"Kuveyt", LAO:"Laos", LAT:"Letonya", LBA:"Libya", LBR:"Liberia",
  LCA:"Saint Lucia", LES:"Lesotho", LIB:"Lübnan", LIE:"Lihtenştayn",
  LTU:"Litvanya", LUX:"Lüksemburg", MAD:"Madagaskar", MAR:"Fas", MAS:"Malezya",
  MAW:"Malavi", MDA:"Moldova", MDV:"Maldivler", MEX:"Meksika", MGL:"Moğolistan",
  MKD:"Kuzey Makedonya", MLI:"Mali", MLT:"Malta", MNE:"Karadağ", MON:"Monako",
  MOZ:"Mozambik", MRI:"Mauritius", MTN:"Moritanya", MYA:"Myanmar",
  NAM:"Namibya", NCA:"Nikaragua", NED:"Hollanda", NEP:"Nepal", NGR:"Nijerya",
  NIG:"Nijer", NOR:"Norveç", NZL:"Yeni Zelanda", OMA:"Umman", PAK:"Pakistan",
  PAN:"Panama", PAR:"Paraguay", PER:"Peru", PHI:"Filipinler", PLE:"Filistin",
  PLW:"Palau", PNG:"Papua Yeni Gine", POL:"Polonya", POR:"Portekiz",
  PRK:"Kuzey Kore", PUR:"Porto Riko", QAT:"Katar", ROU:"Romanya",
  RSA:"Güney Afrika", RUS:"Rusya", RWA:"Ruanda", SAM:"Samoa", SAU:"Suudi Arabistan",
  SEN:"Senegal", SEY:"Seyşeller", SGP:"Singapur", SKN:"Saint Kitts ve Nevis",
  SLE:"Sierra Leone", SLO:"Slovenya", SMR:"San Marino", SOL:"Solomon Adaları",
  SOM:"Somali", SRB:"Sırbistan", SRI:"Sri Lanka", STP:"São Tomé ve Príncipe",
  SUD:"Sudan", SUI:"İsviçre", SUR:"Surinam", SVK:"Slovakya", SWE:"İsveç",
  SWZ:"Esvatini", SYR:"Suriye", TAN:"Tanzanya", TGA:"Tonga", THA:"Tayland",
  TJK:"Tacikistan", TKM:"Türkmenistan", TLS:"Doğu Timor", TOG:"Togo",
  TPE:"Çin Taipei", TRI:"Trinidad ve Tobago", TUN:"Tunus", TUR:"Türkiye",
  UAE:"BAE", UGA:"Uganda", UKR:"Ukrayna", URU:"Uruguay", USA:"ABD",
  UZB:"Özbekistan", VAN:"Vanuatu", VEN:"Venezuela", VIE:"Vietnam",
  VIN:"Saint Vincent", YEM:"Yemen", ZAM:"Zambia", ZIM:"Zimbabwe",
  NZL2:"Yeni Zelanda", KSA2:"Suudi Arabistan",
};
const trName = (c: FederationSeed) => COUNTRY_TR[c.countryCode] ?? c.countryName;
const fmtScore = (n: number) => Math.round(n * 100) / 100;

// ── IOC → ISO 3166-1 alpha-2 (bayrak emoji için) ─────────────────────
const IOC_TO_ISO2: Record<string, string> = {
  AFG:"AF",ALB:"AL",ALG:"DZ",AND:"AD",ANG:"AO",ANT:"AG",ARG:"AR",ARM:"AM",
  ARU:"AW",ASA:"AS",AUS:"AU",AUT:"AT",AZE:"AZ",BAH:"BS",BAN:"BD",BAR:"BB",
  BEL:"BE",BEN:"BJ",BER:"BM",BIH:"BA",BLR:"BY",BOL:"BO",BRA:"BR",BRN:"BH",
  BUL:"BG",BUR:"BF",CAM:"KH",CAN:"CA",CAY:"KY",CGO:"CG",CHA:"TD",CHI:"CL",
  CHN:"CN",CIV:"CI",CMR:"CM",COD:"CD",COK:"CK",COL:"CO",COM:"KM",CPV:"CV",
  CRC:"CR",CRO:"HR",CUB:"CU",CYP:"CY",CZE:"CZ",DEN:"DK",DOM:"DO",ECU:"EC",
  EGY:"EG",ESA:"SV",ESP:"ES",EST:"EE",ETH:"ET",FIJ:"FJ",FIN:"FI",FRA:"FR",
  GAB:"GA",GBR:"GB",GEO:"GE",GER:"DE",GHA:"GH",GRE:"GR",GRN:"GD",GUA:"GT",
  GUI:"GN",GUM:"GU",GUY:"GY",HAI:"HT",HKG:"HK",HON:"HN",HUN:"HU",INA:"ID",
  IND:"IN",IRI:"IR",IRL:"IE",IRQ:"IQ",ISL:"IS",ISR:"IL",ISV:"VI",ITA:"IT",
  JAM:"JM",JOR:"JO",JPN:"JP",KAZ:"KZ",KEN:"KE",KGZ:"KG",KOR:"KR",KOS:"XK",
  KSA:"SA",KUW:"KW",LAO:"LA",LAT:"LV",LBA:"LY",LBR:"LR",LCA:"LC",LES:"LS",
  LIB:"LB",LIE:"LI",LTU:"LT",LUX:"LU",MAD:"MG",MAR:"MA",MAS:"MY",MAW:"MW",
  MDA:"MD",MDV:"MV",MEX:"MX",MGL:"MN",MKD:"MK",MLI:"ML",MLT:"MT",MNE:"ME",
  MON:"MC",MOZ:"MZ",MRI:"MU",MTN:"MR",MYA:"MM",NAM:"NA",NCA:"NI",NED:"NL",
  NEP:"NP",NGR:"NG",NIG:"NE",NOR:"NO",NZL:"NZ",OMA:"OM",PAK:"PK",PAN:"PA",
  PAR:"PY",PER:"PE",PHI:"PH",PLE:"PS",PLW:"PW",PNG:"PG",POL:"PL",POR:"PT",
  PRK:"KP",PUR:"PR",QAT:"QA",ROU:"RO",RSA:"ZA",RUS:"RU",RWA:"RW",SAM:"WS",
  SAU:"SA",SEN:"SN",SEY:"SC",SGP:"SG",SKN:"KN",SLE:"SL",SLO:"SI",SMR:"SM",
  SOL:"SB",SOM:"SO",SRB:"RS",SRI:"LK",STP:"ST",SUD:"SD",SUI:"CH",SUR:"SR",
  SVK:"SK",SWE:"SE",SWZ:"SZ",SYR:"SY",TAN:"TZ",TGA:"TO",THA:"TH",TJK:"TJ",
  TKM:"TM",TLS:"TL",TOG:"TG",TPE:"TW",TRI:"TT",TUN:"TN",TUR:"TR",UAE:"AE",
  UGA:"UG",UKR:"UA",URU:"UY",USA:"US",UZB:"UZ",VAN:"VU",VEN:"VE",VIE:"VN",
  VIN:"VC",YEM:"YE",ZAM:"ZM",ZIM:"ZW",
};
const flagEmoji = (code: string): string => {
  const iso2 = IOC_TO_ISO2[code];
  if (!iso2 || iso2.length !== 2) return "";
  return iso2.toUpperCase().split("").map(
    ch => String.fromCodePoint(0x1F1E6 + ch.charCodeAt(0) - 65)
  ).join("");
};

// ── Icons ─────────────────────────────────────────────────────────────
const IcGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const IcMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const IcGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IcNote = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IcX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IcEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcCheckCircle = ({ done }: { done?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: done ? "var(--green)" : "var(--muted)" }}>
    <circle cx="12" cy="12" r="10"/>
    {done && <polyline points="9 12 11 14 15 10"/>}
  </svg>
);
const IcPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcHandshake = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3-3 3 3"/>
    <path d="M12 8v8"/>
    <path d="M5 17H2a1 1 0 01-1-1V5a1 1 0 011-1h3"/>
    <path d="M19 17h3a1 1 0 001-1V5a1 1 0 00-1-1h-3"/>
    <path d="M5 7h14"/>
    <path d="M5 17h14"/>
  </svg>
);
const IcCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IcWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ display:"inline-block" }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ── Photo Lightbox ─────────────────────────────────────────────────────
const PhotoLightbox = ({ src, name, countryCode, onClose }: {
  src: string; name: string; countryCode: string; onClose: () => void;
}) => {
  const source = PHOTO_SOURCE[countryCode];
  return createPortal(
    <>
      <div className="lightbox-backdrop" onClick={onClose} />
      <div className="lightbox-modal">
        <img className="lightbox-img" src={src} alt={name} />
        <div className="lightbox-info">
          <div className="lightbox-name">{name}</div>
          {source && (
            <a className="lightbox-source" href={source.url} target="_blank" rel="noreferrer">
              Kaynak: {source.site}
            </a>
          )}
        </div>
        <button className="lightbox-close" onClick={onClose}><IcX /></button>
      </div>
    </>,
    document.body
  );
};

// ── President Avatar ───────────────────────────────────────────────────
const PresidentAvatar = ({
  countryCode, presidentName, size = "sm", clickable = true, photoOverride
}: {
  countryCode: string;
  presidentName: string;
  size?: "sm" | "md" | "lg" | "xl";
  clickable?: boolean;
  photoOverride?: string;
}) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(presidentName || "?")}&background=1e293b&color=60a5fa&size=256&bold=true&font-size=0.42&format=svg`;
  const [src, setSrc] = useState(() => photoOverride ?? presidentPhotoUrl(countryCode, presidentName));
  const [open, setOpen] = useState(false);

  // Firebase'den fotoğraf override güncellenince src'yi yenile
  useEffect(() => {
    if (photoOverride) setSrc(photoOverride);
    else setSrc(presidentPhotoUrl(countryCode, presidentName));
  }, [photoOverride, countryCode, presidentName]);

  return (
    <>
      <img
        className={`president-avatar president-avatar-${size}${clickable ? " president-avatar-clickable" : ""}`}
        src={src}
        alt={presidentName}
        title={presidentName}
        onError={() => { if (src !== fallback) setSrc(fallback); }}
        onClick={clickable ? (e) => { e.stopPropagation(); setOpen(true); } : undefined}
      />
      {open && (
        <PhotoLightbox
          src={src}
          name={presidentName}
          countryCode={countryCode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

// ── Status helpers ─────────────────────────────────────────────────────
const STATUS_CSS: Record<SupportStatus, string> = {
  supporter: "badge-green",
  watch: "badge-amber",
  persuadable: "badge-blue",
  resistant: "badge-red"
};
const MAP_COLOR: Record<SupportStatus, string> = {
  supporter: "#10D9A0",
  watch: "#F59E0B",
  persuadable: "#3B82F6",   // daha koyu, net mavi
  resistant: "#EF4444"       // net kırmızı (pembe değil)
};

// ── Branş yapısı ──────────────────────────────────────────────────────
const DISCIPLINE_TR: Record<string, { label: string; color: string }> = {
  MAG:  { label: "Erkekler Artistik",  color: "#38BDF8" },
  WAG:  { label: "Kadınlar Artistik",  color: "#F472B6" },
  RG:   { label: "Ritmik Jimnastik",   color: "#A78BFA" },
  TRA:  { label: "Trampolin",          color: "#34D399" },
  ACRO: { label: "Akrobatik",          color: "#FBBF24" },
  AER:  { label: "Aerobik",            color: "#F87171" },
  PK:   { label: "Parkur",             color: "#6EE7B7" },
  GFA:  { label: "Herkese Jimnastik",  color: "#93C5FD" },
};

const disciplineKeywords: Record<string, string[]> = {
  MAG:  ["MAG","men's artistic","erkek artistik","men artistic","floor","pommel","rings","vault men","parallel","high bar","rings"],
  WAG:  ["WAG","women's artistic","kadın artistik","women artistic","artistic gymn","beam","uneven","floor exercise"],
  RG:   ["RG","rhythmic","ritmik","ribbon","hoop","ball","clubs","rope"],
  TRA:  ["TRA","trampoline","tramplen","trampolining"],
  ACRO: ["ACRO","acrobatic","akrobatik","acro"],
  AER:  ["AER","aerobic","aerobik","aerobics"],
  PK:   ["PK","parkour","parkur"],
  GFA:  ["GFA","general","gymnastics for all","herkese","for all"],
};

const getHighlightsForDiscipline = (seed: FederationSeed, disc: string): string[] => {
  const kws = disciplineKeywords[disc] ?? [];
  const pool = [
    ...(seed.medalHighlights ?? []),
    ...(seed.nationalTeamHighlights ?? []),
    ...(seed.achievements ?? []),
  ];
  return pool.filter(h => kws.some(kw => h.toLowerCase().includes(kw.toLowerCase())));
};

// Country code → ISO numeric (IOC federation code → world-atlas topoJSON id)
const CODE_TO_NUMERIC: Record<string, string> = {
  // Büyük ülkeler
  TUR:"792",GER:"276",FRA:"250",USA:"840",CHN:"156",JPN:"392",BRA:"076",
  AUS:"036",EGY:"818",KEN:"404",RSA:"710",IND:"356",RUS:"643",UKR:"804",
  GBR:"826",ITA:"380",ESP:"724",ARG:"032",MEX:"484",CAN:"124",KOR:"410",
  POL:"616",NED:"528",SUI:"756",AUT:"040",HUN:"348",ROU:"642",BUL:"100",
  GRE:"300",POR:"620",BEL:"056",SWE:"752",NOR:"578",DEN:"208",FIN:"246",
  CZE:"203",SVK:"703",SLO:"705",CRO:"191",SRB:"688",BIH:"070",MKD:"807",
  MDA:"498",BLR:"112",KAZ:"398",UZB:"860",AZE:"031",GEO:"268",ARM:"051",
  // Orta Doğu (IRI = Iran IOC kodu!)
  QAT:"634",UAE:"784",KUW:"414",BRN:"048",KSA:"682",SAU:"682",OMA:"512",
  JOR:"400",LIB:"422",IRQ:"368",IRI:"364",IRN:"364",ISR:"376",SYR:"760",YEM:"887",
  // Asya
  PAK:"586",BAN:"050",SRI:"144",NEP:"524",PHI:"608",INA:"360",MAS:"458",
  THA:"764",VIE:"704",SGP:"702",MGL:"496",HKG:"344",TPE:"158",NZL:"554",
  FIJ:"242",PNG:"598",KGZ:"417",TJK:"762",TKM:"795",LAO:"418",CAM:"116",
  MYA:"104",PRK:"408",PLE:"275",MDV:"462",TLS:"626",
  // Afrika
  NGR:"566",GHA:"288",CMR:"120",ETH:"231",TAN:"834",UGA:"800",ZIM:"716",
  ZAM:"894",MOZ:"508",ANG:"024",SEN:"686",MLI:"466",BEN:"204",BUR:"854",
  CIV:"384",GUI:"324",TOG:"768",NIG:"562",MAD:"450",ALG:"012",MAR:"504",
  TUN:"788",LBA:"434",SUD:"729",RWA:"646",NAM:"516",LBR:"430",SLE:"694",
  GAB:"266",CGO:"178",COD:"180",MTN:"478",MAW:"454",MRI:"480",SEY:"690",
  SOM:"706",LES:"426",SWZ:"748",STP:"678",CPV:"132",COM:"174",
  DJI:"262",ERI:"232",GMB:"270",GNB:"624",GNQ:"226",
  // Avrupa (eksikler)
  EST:"233",LAT:"428",LTU:"440",LUX:"442",IRL:"372",ISL:"352",LIE:"438",
  SMR:"674",MON:"492",MLT:"470",MNE:"499",KOS:"383",CYP:"196",
  // Americas
  COL:"170",VEN:"862",PER:"604",CHI:"152",ECU:"218",BOL:"068",PAR:"600",
  URU:"858",GUA:"320",CRC:"188",PAN:"591",HON:"340",ESA:"222",NCA:"558",
  DOM:"214",CUB:"192",PUR:"630",SKN:"659",JAM:"388",TRI:"780",GUY:"328",
  SUR:"740",BAR:"052",HAI:"332",ANT:"028",GRN:"308",VIN:"670",LCA:"662",
  // Pasifik / diğer
  SAM:"882",TGA:"776",VAN:"548",SOL:"090",PLW:"585",
  // Küçük bölgeler / özel durumlar
  ARU:"533",CAY:"136",ISV:"850",GUM:"316",ASA:"016",BER:"060",BAH:"044",
  COK:"184",
  // Eksik federasyonlar (önceden siyah görünüyordu)
  AFG:"004", ALB:"008", AND:"020", CHA:"148",
  LBN:"422", // Lübnan (LIB IOC kodu da var, ikisi de aynı ülke)
  TTO:"780", // Trinidad ve Tobago (TRI IOC kodu da var)
};

// ── Editable text block ─────────────────────────────────────────────────
const EditableBlock = ({
  label, value, onSave, warn = false
}: { label: string; value: string; onSave: (v: string) => void; warn?: boolean }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onSave(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`ds-block ${warn ? "ds-block-warn" : ""}`}>
        <div className="ds-block-label">{label}</div>
        <textarea
          className="edit-textarea"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={4}
          autoFocus
        />
        <div className="edit-actions">
          <button type="button" className="edit-save" onClick={save}><IcCheck /> Kaydet</button>
          <button type="button" className="edit-cancel" onClick={() => { setDraft(value); setEditing(false); }}>İptal</button>
        </div>
      </div>
    );
  }
  return (
    <div className={`ds-block ${warn ? "ds-block-warn" : ""}`}>
      <div className="ds-block-label-row">
        <span className="ds-block-label">{label}</span>
        <button type="button" className="edit-btn" onClick={() => { setDraft(value); setEditing(true); }}><IcEdit /></button>
      </div>
      <div className="ds-block-text">{value}</div>
    </div>
  );
};

// ── Discipline Note Editor ─────────────────────────────────────────────
const DisciplineNoteEditor = ({ note, onSave }: { note: string; onSave: (v: string) => void }) => {
  const [val, setVal] = useState(note);
  const [editing, setEditing] = useState(false);
  useEffect(() => setVal(note), [note]);
  if (!editing) return (
    <div style={{ marginTop:8, padding:"6px 8px", background:"var(--surface2,#1a2533)", borderRadius:6 }}>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", flex:1 }}>📝 Saha Notu</span>
        <button type="button" className="edit-btn" onClick={() => setEditing(true)}><IcEdit /></button>
      </div>
      {note && <p style={{ fontSize:12, color:"var(--text)", margin:"4px 0 0", lineHeight:1.5 }}>{note}</p>}
    </div>
  );
  return (
    <div style={{ marginTop:6 }}>
      <textarea className="note-textarea" rows={2} value={val} onChange={e => setVal(e.target.value)} style={{ fontSize:12 }} />
      <div style={{ display:"flex", gap:6, marginTop:4 }}>
        <button type="button" className="note-submit" style={{ fontSize:11 }} onClick={() => { onSave(val); setEditing(false); }}>Kaydet</button>
        <button type="button" className="note-cancel" style={{ fontSize:11 }} onClick={() => { setVal(note); setEditing(false); }}>İptal</button>
      </div>
    </div>
  );
};

// ── Password ──────────────────────────────────────────────────────────
const PASS = "SuatCelen";
const SESSION_KEY = "fig-v3-auth";

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASS) { sessionStorage.setItem(SESSION_KEY, "1"); onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };
  return (
    <div className="login-screen">
      <div className="login-logo">FIG Seçim Operasyonu</div>
      <h1 className="login-title">Suat Çelen<br />Strateji Odası</h1>
      <p className="login-sub">Giriş yapmak için şifreyi girin</p>
      <form className="login-form" onSubmit={submit}>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••••"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoComplete="current-password"
          autoFocus
        />
        {error && <div className="login-error">Hatalı şifre, tekrar deneyin.</div>}
        <button className="login-btn" type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

// ── İç Uygulama (hooks burada — conditional return yok) ───────────────
const AppMain = () => {
  const { lang, setLang } = useLang();
  const ranked = useMemo(() => rankCountriesByUrgency(federationSeeds), []);
  const directoryByCode = useMemo(() =>
    Object.fromEntries(officialDirectory.map(r => [r.countryCode, r])) as Record<string, FederationDirectoryRecord>,
    []
  );

  // Global state
  const [view, setView] = useState<AppView>("dashboard");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selectedCode, setSelectedCode] = useState(ranked[0].countryCode);
  const [dossierTab, setDossierTab] = useState<DossierTab>("genel");
  const [promiseTab, setPromiseTab] = useState<PromiseTab>("active");

  // Filters
  const [statusFilter, setStatusFilter] = useState<FilterValue<SupportStatus>>("all");
  const [continentFilter, setContinentFilter] = useState<FilterValue<ContinentCode>>("all");
  const [search, setSearch] = useState("");
  const dSearch = useDeferredValue(search.trim().toLowerCase());

  // Map
  const [mapPos, setMapPos] = useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [15, 20], zoom: 1 });
  const [mapPreview, setMapPreview] = useState<string | null>(null); // null = bar gizli
  const mapRef = useRef<HTMLDivElement>(null);

  // Dossier UI
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  // Notes — synced from Firebase
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteReturnCode, setNoteReturnCode] = useState<string | null>(null); // "Tümü"dan döniş

  // Overrides — synced from Firebase
  const [overrides, setOverrides] = useState<Record<string, CountryOverride>>({});

  // Photo overrides — synced from Firebase
  const [photoOverrides, setPhotoOverrides] = useState<Record<string, string>>({});

  // Promises — synced from Firebase
  const [promises, setPromises] = useState<FigPromise[]>([]);

  // Photo edit UI
  const [photoEditCode, setPhotoEditCode] = useState<string | null>(null);
  const [photoEditUrl, setPhotoEditUrl] = useState("");

  // Promise form UI
  const [showPromiseForm, setShowPromiseForm] = useState(false);
  const [editingPromise, setEditingPromise] = useState<FigPromise | null>(null);
  const [promiseText, setPromiseText] = useState("");
  const [promiseCountries, setPromiseCountries] = useState<string[]>([]);
  const [promiseCategory, setPromiseCategory] = useState<PromiseCategory>("diger");
  const [promiseDateGiven, setPromiseDateGiven] = useState("");
  const [promiseDueDate, setPromiseDueDate] = useState("");
  const [promiseStatus, setPromiseStatus] = useState<PromiseStatus>("verildi");
  const [promiseNotes, setPromiseNotes] = useState("");

  // President phone edit UI
  const [phoneEditCode, setPhoneEditCode] = useState<string | null>(null);
  const [phoneEditVal, setPhoneEditVal] = useState("");
  const [secPhoneEditCode, setSecPhoneEditCode] = useState<string | null>(null);
  const [secPhoneEditVal, setSecPhoneEditVal] = useState("");

  // Vote simulator
  const [conversionRate, setConversionRate] = useState(50);

  // Contact logs — synced from Firebase
  const [contactLogs, setContactLogs] = useState<Record<string, ContactLogEntry[]>>({});

  // Content overrides — editable mesaj/istihbarat alanları
  const [contentOverrides, setContentOverrides] = useState<Record<string, Record<string, string[]>>>({});

  // Editing state for content fields
  const [editingContentField, setEditingContentField] = useState<string | null>(null);
  const [contentDraft, setContentDraft] = useState("");

  // Discipline notes
  const [disciplineNotes, setDisciplineNotes] = useState<Record<string, Record<string, string>>>({});

  // WhatsApp template copy state
  const [msgCopied, setMsgCopied] = useState(false);

  // Status history — synced from Firebase
  const [statusHistory, setStatusHistory] = useState<Record<string,{from:string,to:string,date:string}[]>>({});

  // Competitor analysis
  const [competitor, setCompetitor] = useState<{name:string, knownSupporters:string[], estimatedVotes:number} | null>(null);
  const [editingCompetitor, setEditingCompetitor] = useState(false);
  const [competitorDraft, setCompetitorDraft] = useState({name:"", knownSupporters:"", estimatedVotes:0});

  // Contact log form UI
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactDate, setContactDate] = useState(new Date().toISOString().slice(0, 10));
  const [contactChannel, setContactChannel] = useState<ContactLogEntry["channel"]>("call");
  const [contactActor, setContactActor] = useState("Suat Çelen");
  const [contactSummary, setContactSummary] = useState("");
  const [contactNextStep, setContactNextStep] = useState("");
  const [contactObjections, setContactObjections] = useState<string[]>([]);

  // Feature: Risk Register
  const [risks, setRisks] = useState<Record<string, any[]>>({});
  // Local draft to debounce per-keystroke Firebase writes on risk note textarea
  const [riskNoteDraft, setRiskNoteDraft] = useState<{riskId: string; note: string} | null>(null);

  // Feature: Simulator 2.0
  const [continentSliders, setContinentSliders] = useState<Record<string,number>>({EG:0,AGU:0,UAG:0,PAGU:0,OGU:0});
  const [scenarioName, setScenarioName] = useState("Mevcut");

  // Feature: City Vote (Istanbul vs Roma)
  const [cityFilter, setCityFilter] = useState<"all"|"istanbul"|"roma"|"kararsız"|"bilinmiyor">("all");
  const [cityPage, setCityPage] = useState(1);
  const [citySearch, setCitySearch] = useState("");
  const [cityPageSize, setCityPageSize] = useState(40);

  // Feature: Editable Calendar
  type CalEvent = { id: string; date: string; label: string; emoji: string; countries: string[]; note?: string };
  const [calendarEvents, setCalendarEvents] = useState<CalEvent[] | null>(null);
  const [calEditingId, setCalEditingId] = useState<string | null>(null);
  const [calDraft, setCalDraft] = useState<CalEvent>({ id:"", date:"", label:"", emoji:"📅", countries:[], note:"" });
  const [calCountryPicker, setCalCountryPicker] = useState<string | null>(null); // event id for which we're showing the picker
  const [calCountrySearch, setCalCountrySearch] = useState("");

  // Firebase listeners
  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/notes"), snap => {
      const val = snap.val() as Record<string, Note> | null;
      if (!val) { setNotes([]); return; }
      const arr = Object.values(val).sort((a, b) => b.id.localeCompare(a.id));
      setNotes(arr);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/overrides"), snap => {
      const val = snap.val() as Record<string, CountryOverride> | null;
      setOverrides(val ?? {});
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/photo-overrides"), snap => {
      const val = snap.val() as Record<string, string> | null;
      setPhotoOverrides(val ?? {});
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/promises"), snap => {
      const val = snap.val() as Record<string, FigPromise> | null;
      if (!val) { setPromises([]); return; }
      const arr = Object.values(val).sort((a, b) => (b.dateGiven ?? "").localeCompare(a.dateGiven ?? ""));
      setPromises(arr);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/contactLogs"), snap => {
      const val = snap.val() as Record<string, Record<string, ContactLogEntry>> | null;
      if (!val) { setContactLogs({}); return; }
      const result: Record<string, ContactLogEntry[]> = {};
      for (const [code, entries] of Object.entries(val)) {
        result[code] = Object.values(entries).sort((a, b) => b.date.localeCompare(a.date));
      }
      setContactLogs(result);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/contentOverrides"), snap => {
      setContentOverrides(snap.val() ?? {});
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/disciplineNotes"), snap => {
      setDisciplineNotes(snap.val() ?? {});
    });
    return unsub;
  }, []);

  useEffect(() => {
    const shUnsub = onValue(ref(db, "fig-v3/statusHistory"), snap => {
      setStatusHistory(snap.val() || {});
    });
    return shUnsub;
  }, []);

  useEffect(() => {
    const compUnsub = onValue(ref(db, "fig-v3/competitor"), snap => {
      setCompetitor(snap.val() || null);
    });
    return compUnsub;
  }, []);

  useEffect(() => {
    const risksUnsub = onValue(ref(db, "fig-v3/risks"), snap => {
      setRisks(snap.val() || {});
    });
    return risksUnsub;
  }, []);

  useEffect(() => {
    const calUnsub = onValue(ref(db, "fig-v3/calendarEvents"), snap => {
      const val = snap.val();
      if (val && typeof val === "object") {
        // Firebase returns object keyed by id → convert to array
        // ÖNEMLI: Firebase boş array'leri saklamaz, geri okurken countries undefined olabilir
        // Bu yüzden normalize ediyoruz.
        const arr = (Object.values(val) as any[]).map(e => ({
          id: e?.id ?? "",
          date: e?.date ?? "",
          label: e?.label ?? "",
          emoji: e?.emoji ?? "📅",
          countries: Array.isArray(e?.countries) ? e.countries : [],
          note: e?.note ?? "",
        })) as CalEvent[];
        setCalendarEvents(arr);
      } else {
        setCalendarEvents([]); // empty array (no events yet)
      }
    });
    return calUnsub;
  }, []);

  // Filtre değişince city sayfalamayı sıfırla
  useEffect(() => {
    setCityPage(1);
  }, [cityFilter, citySearch, cityPageSize]);

  // Harita dışına çıkınca mapPreview sıfırla
  useEffect(() => {
    if (view !== "map") setMapPreview(null);
  }, [view]);

  // Fix map SVG sizing — retry until SVG renders
  useEffect(() => {
    if (view !== "map") return;
    let tries = 0;
    const fix = () => {
      const svg = mapRef.current?.querySelector("svg");
      if (svg) {
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";
      } else if (tries < 20) {
        tries++;
        setTimeout(fix, 50);
      }
    };
    fix();
  }, [view]);

  // Helper to update override for a country (writes to Firebase)
  const setOverride = (code: string, patch: Partial<CountryOverride>) => {
    update(ref(db, `fig-v3/overrides/${code}`), patch);
    if (patch.status !== undefined) {
      const existing = mergedByCode[code];
      const oldStatus = overrides[code]?.status ?? existing?.status ?? "unknown";
      if (oldStatus !== patch.status) {
        const currentHistory = statusHistory[code] || [];
        set(ref(db, `fig-v3/statusHistory/${code}`), [...currentHistory, { from: oldStatus, to: patch.status as string, date: new Date().toISOString().slice(0,10) }]);
      }
    }
  };

  // Photo override
  const savePhotoOverride = (code: string, url: string) => {
    if (url.trim()) {
      set(ref(db, `fig-v3/photo-overrides/${code}`), url.trim());
      setPhotoOverrides(prev => ({ ...prev, [code]: url.trim() })); // anında güncelle
    } else {
      remove(ref(db, `fig-v3/photo-overrides/${code}`));
      setPhotoOverrides(prev => { const n = {...prev}; delete n[code]; return n; });
    }
    setPhotoEditCode(null);
    setPhotoEditUrl("");
  };

  // Promise CRUD
  const savePromise = (e: FormEvent) => {
    e.preventDefault();
    if (!promiseText.trim()) return;
    const id = editingPromise?.id ?? `p-${Date.now()}`;
    const p: FigPromise = {
      id,
      text: promiseText.trim(),
      countryCodes: promiseCountries,
      category: promiseCategory,
      dateGiven: promiseDateGiven || undefined,
      dueDate: promiseDueDate || undefined,
      status: promiseStatus,
      notes: promiseNotes.trim() || undefined,
    };
    set(ref(db, `fig-v3/promises/${id}`), p);
    resetPromiseForm();
  };

  const deletePromise = (id: string) => remove(ref(db, `fig-v3/promises/${id}`));

  // Contact log CRUD
  const saveContactLog = (e: FormEvent) => {
    e.preventDefault();
    if (!contactSummary.trim()) return;
    const entry: ContactLogEntry = {
      date: contactDate,
      actor: contactActor.trim() || "Suat Çelen",
      channel: contactChannel,
      summary: contactSummary.trim(),
      nextStep: contactNextStep.trim(),
      ...(contactObjections.length > 0 ? { objections: contactObjections } : {}),
    };
    const key = `${Date.now()}`;
    set(ref(db, `fig-v3/contactLogs/${selectedCode}/${key}`), entry);
    setShowContactForm(false);
    setContactSummary("");
    setContactNextStep("");
    setContactObjections([]);
  };
  const deleteContactLog = (code: string, key: string) =>
    remove(ref(db, `fig-v3/contactLogs/${code}/${key}`));

  const updatePromiseStatus = (id: string, status: PromiseStatus) =>
    update(ref(db, `fig-v3/promises/${id}`), { status });

  const resetPromiseForm = () => {
    setShowPromiseForm(false);
    setEditingPromise(null);
    setPromiseText("");
    setPromiseCountries([]);
    setPromiseCategory("diger");
    setPromiseDateGiven("");
    setPromiseDueDate("");
    setPromiseStatus("verildi");
    setPromiseNotes("");
  };

  const startEditPromise = (p: FigPromise) => {
    setEditingPromise(p);
    setPromiseText(p.text);
    setPromiseCountries(p.countryCodes);
    setPromiseCategory(p.category);
    setPromiseDateGiven(p.dateGiven ?? "");
    setPromiseDueDate(p.dueDate ?? "");
    setPromiseStatus(p.status);
    setPromiseNotes(p.notes ?? "");
    setShowPromiseForm(true);
  };

  // Content field save
  const saveContentField = (code: string, field: string, lines: string[]) => {
    const clean = lines.filter(l => l.trim());
    if (clean.length > 0) set(ref(db, `fig-v3/contentOverrides/${code}/${field}`), clean);
    else remove(ref(db, `fig-v3/contentOverrides/${code}/${field}`));
    setContentOverrides(prev => ({
      ...prev,
      [code]: { ...(prev[code] ?? {}), [field]: clean }
    }));
  };

  // Discipline note save
  const saveDisciplineNote = (code: string, discipline: string, note: string) => {
    if (note.trim()) set(ref(db, `fig-v3/disciplineNotes/${code}/${discipline}`), note.trim());
    else remove(ref(db, `fig-v3/disciplineNotes/${code}/${discipline}`));
    setDisciplineNotes(prev => ({
      ...prev,
      [code]: { ...(prev[code] ?? {}), [discipline]: note.trim() }
    }));
  };

  // Status ağırlıkları (priorityScore yeniden hesaplamak için)
  const STATUS_WEIGHT: Record<SupportStatus, number> = {
    supporter: 18, watch: 50, persuadable: 84, resistant: 12
  };

  // Merged country with overrides applied + priority score recalculation
  const mergedSeed = useMemo(() => {
    return ranked.map(c => {
      const ov = overrides[c.countryCode];
      if (!ov || !ov.status) return c;
      const newStatus = ov.status;
      // Durum değişince puanı yeniden hesapla
      const scoreDelta = STATUS_WEIGHT[newStatus] - STATUS_WEIGHT[c.status];
      return {
        ...c,
        status: newStatus,
        priorityScore: Math.max(0, c.priorityScore + scoreDelta)
      };
    });
  }, [ranked, overrides]);

  const mergedByCode = useMemo(() => Object.fromEntries(mergedSeed.map(c => [c.countryCode, c])), [mergedSeed]);

  // Filtered list (uses merged status)
  const filtered = useMemo(() => mergedSeed.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (continentFilter !== "all" && c.continent !== continentFilter) return false;
    if (dSearch && ![c.countryName, trName(c), c.countryCode, c.president, c.federationName].join(" ").toLowerCase().includes(dSearch)) return false;
    return true;
  }), [mergedSeed, statusFilter, continentFilter, dSearch]);

  // Vote totals (from merged)
  const totals = useMemo(() => ({
    supporter: mergedSeed.filter(c => c.status === "supporter").length,
    watch: mergedSeed.filter(c => c.status === "watch").length,
    persuadable: mergedSeed.filter(c => c.status === "persuadable").length,
    resistant: mergedSeed.filter(c => c.status === "resistant").length,
    total: mergedSeed.length,
  }), [mergedSeed]);

  const statusByNumeric = useMemo(() => {
    const map: Record<string, SupportStatus> = {};
    for (const c of mergedSeed) {
      const num = CODE_TO_NUMERIC[c.countryCode];
      if (num) map[num] = c.status;
    }
    return map;
  }, [mergedSeed]);

  const selected = mergedByCode[selectedCode] ?? mergedSeed[0];
  const selectedDir = directoryByCode[selectedCode];
  // const selectedOv = overrides[selectedCode] ?? {};

  const getAssessment = (c: FederationSeed) => overrides[c.countryCode]?.assessment ?? translateStrategicText(buildStrategicSummary(c));
  const getEntryChannel = (c: FederationSeed) => overrides[c.countryCode]?.entryChannel ?? translateStrategicText((c.entryChannels ?? [])[0] ?? "");
  const getRedLine = (c: FederationSeed) => overrides[c.countryCode]?.redLine ?? translateStrategicText((c.redLines ?? [])[0] ?? "");

  const sportHighlights = useMemo(() => buildSportHighlights(selected).filter(Boolean), [selected]);

  // Content override helper — Firebase override yoksa seed verisi kullan
  const getContent = (code: string, field: keyof FederationSeed): string[] => {
    const ov = contentOverrides[code]?.[field as string];
    const seed = mergedByCode[code];
    return ov ?? ((seed?.[field] as string[] | undefined) ?? []);
  };

  // İstihbarat alanları helper
  const getDiplomaticAllies = (code: string): string[] =>
    contentOverrides[code]?.diplomaticAllies ?? (mergedByCode[code]?.diplomaticAllies ?? []);
  const getFrictionPoints = (code: string): string[] =>
    contentOverrides[code]?.frictionPoints ?? (mergedByCode[code]?.frictionPoints ?? []);

  const openDossier = (code: string) => {
    setSelectedCode(code);
    setDossierTab("genel");
    setShowScoreInfo(false);
    setSheet("dossier");
  };

  const addNote = (e: FormEvent) => {
    e.preventDefault();
    const t = noteTitle.trim(); const b = noteBody.trim();
    if (!t || !b) return;
    const note: Note = {
      id: `${selectedCode}-${Date.now()}`,
      countryCode: selectedCode,
      countryName: trName(selected),
      title: t, body: b,
      date: new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())
    };
    set(ref(db, `fig-v3/notes/${note.id}`), note);
    setNoteTitle(""); setNoteBody("");
  };

  const deleteNote = (id: string) => remove(ref(db, `fig-v3/notes/${id}`));
  const toggleNoteComplete = (id: string, completed: boolean) => update(ref(db, `fig-v3/notes/${id}`), { completed });
  const countryNotes = notes.filter(n => n.countryCode === selectedCode);

  const majority = Math.ceil(totals.total / 2) + 1;

  // Continent summaries from merged data (all 4 statuses)
  const continentStats = useMemo(() => {
    const map: Record<string, { total: number; supporter: number; watch: number; persuadable: number; resistant: number }> = {};
    for (const c of mergedSeed) {
      if (!map[c.continent]) map[c.continent] = { total: 0, supporter: 0, watch: 0, persuadable: 0, resistant: 0 };
      map[c.continent].total++;
      map[c.continent][c.status]++;
    }
    return map;
  }, [mergedSeed]);

  // Vote projections
  const projected = useMemo(() => {
    const fromPersuadable = Math.round(totals.persuadable * conversionRate / 100);
    const fromWatch = Math.round(totals.watch * conversionRate * 0.3 / 100);
    return totals.supporter + fromPersuadable + fromWatch;
  }, [totals, conversionRate]);

  // Action list — top 10 "hareket et" (persuadable + watch, sorted by urgency)
  const actionList = useMemo(() =>
    mergedSeed
      .filter(c => c.status === "persuadable" || c.status === "watch")
      .sort((a, b) =>
        (b.priorityScore - b.relationshipStrength * 0.3) -
        (a.priorityScore - a.relationshipStrength * 0.3)
      )
      .slice(0, 10),
    [mergedSeed]
  );

  // Feature 2: Congress countdown helpers
  const CONGRESS_DATE = new Date("2026-10-01");
  const getDaysToCongressFn = (): number => {
    const today = new Date();
    const diff = CONGRESS_DATE.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000*60*60*24)));
  };
  const KEY_EVENTS = [
    { date:"2026-06-15", label:"Dünya Kupası — Doha", countries:["QAT","KUW","BHR","UAE"] },
    { date:"2026-07-20", label:"Pan-Amerikan Şampiyonası", countries:["BRA","ARG","COL","CHI"] },
    { date:"2026-08-10", label:"Afrika Kupası", countries:["EGY","MAR","RSA","SEN"] },
    { date:"2026-09-05", label:"Asya Şampiyonası", countries:["JPN","CHN","KOR","INA"] },
    { date:"2026-10-01", label:"FIG Kongresi — Seçim", countries:[] },
  ];

  // Feature 3: Trend this month
  const trendThisMonth = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0,7);
    let gained = 0, lost = 0;
    Object.values(statusHistory).forEach(entries => {
      entries.forEach(e => {
        if (e.date.startsWith(thisMonth)) {
          const goodStatuses = ["confirmed","leaning"];
          const wasGood = goodStatuses.includes(e.from);
          const isGood = goodStatuses.includes(e.to);
          if (!wasGood && isGood) gained++;
          if (wasGood && !isGood) lost++;
        }
      });
    });
    return { gained, lost };
  }, [statusHistory]);

  // Feature 1: WhatsApp template builder
  function buildWhatsAppTemplate(country: typeof selected): string {
    const need = primaryNeedLabel(country.primaryNeed);
    const msg0 = (country.messaging as string[] | undefined)?.[0] || "";
    const hook = (country.monthlyHooks as string[] | undefined)?.[0] || "";
    return `Sayın ${country.president || "Sayın Başkan"},\n\n${country.name || country.countryName} ile ${need} konusunda iş birliği geliştirmek istiyoruz.\n\n${msg0}${hook ? "\n\n" + hook : ""}\n\nSaygılarımla,\nSuat Çelen\nFIG Adayı`;
  }

  // Roadmap for selected country
  const roadmap = useMemo(() =>
    buildCountryRoadmap({
      countryCode: selected.countryCode,
      countryName: selected.countryName,
      continent: selected.continent,
      status: selected.status,
      primaryNeed: selected.primaryNeed,
      relationshipStrength: selected.relationshipStrength,
    }),
    [selected]
  );

  // Country contact logs
  const selectedContactLogs = contactLogs[selectedCode] ?? [];

  return (
    <>
    <div className="shell">
      {/* ── Header ── */}
      <header className="hdr">
        <div className="hdr-brand">
          <span className="hdr-eyebrow">{t(lang,"hdr_eyebrow")}</span>
          <div className="hdr-votes">
            <span className="hdr-vote-num">{totals.supporter}</span>
            <span className="hdr-vote-sep">/</span>
            <span className="hdr-vote-total">{majority}</span>
            <span className="hdr-vote-label">{t(lang,"hdr_majority")}</span>
          </div>
        </div>
        <nav className="hdr-nav">
          {(["dashboard","savaş-odası","map","countries","vaatler","notes","takvim","kongre-şehri"] as AppView[]).map(v => {
            const labels: Record<AppView,string> = { dashboard:t(lang,"nav_dashboard"), map:t(lang,"nav_map"), countries:t(lang,"nav_countries"), vaatler:t(lang,"nav_promises"), notes:t(lang,"nav_notes"), "savaş-odası":t(lang,"nav_war_room"), takvim:t(lang,"nav_calendar"), "kongre-şehri":t(lang,"nav_congress_city") };
            const icons: Record<AppView, React.ReactElement> = { dashboard:<IcGrid/>, map:<IcMap/>, countries:<IcGlobe/>, vaatler:<IcHandshake/>, notes:<IcNote/>, "savaş-odası":<IcGrid/>, takvim:<IcNote/>, "kongre-şehri":<IcGlobe/> };
            return (
              <button key={v} className={`hdr-tab ${view===v?"active":""}`} onClick={() => setView(v)} type="button">
                {icons[v]}{labels[v]}
              </button>
            );
          })}
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            title="Switch language / Dil değiştir"
          >
            {lang === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}
          </button>
        </nav>
      </header>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        {(["dashboard","savaş-odası","map","countries","vaatler","notes","takvim","kongre-şehri"] as AppView[]).map(v => {
          const labels: Record<AppView,string> = { dashboard:t(lang,"nav_dashboard"), map:t(lang,"nav_map"), countries:t(lang,"nav_countries"), vaatler:t(lang,"nav_promises"), notes:t(lang,"nav_notes"), "savaş-odası":t(lang,"nav_war_room_short"), takvim:t(lang,"nav_calendar"), "kongre-şehri":t(lang,"nav_congress_city_short") };
          const icons: Record<AppView, React.ReactElement> = { dashboard:<IcGrid/>, map:<IcMap/>, countries:<IcGlobe/>, vaatler:<IcHandshake/>, notes:<IcNote/>, "savaş-odası":<IcGrid/>, takvim:<IcNote/>, "kongre-şehri":<IcGlobe/> };
          return (
            <button key={v} type="button" className={`nav-tab ${view===v?"active":""}`} onClick={() => { setView(v); setSheet(null); }}>
              <span className="nav-tab-icon">{icons[v]}</span>
              <span className="nav-tab-label">{labels[v]}</span>
            </button>
          );
        })}
      </nav>

      <main className="main">
        {/* ══ DURUM PANELİ ══ */}
        {view === "dashboard" && (
          <div className="tab-scroll">
            {/* Kongre Geri Sayım */}
            <div className="congress-card">
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ fontSize:48, fontWeight:800, color:"var(--accent)", lineHeight:1 }}>{getDaysToCongressFn()}</span>
                <span style={{ fontSize:16, fontWeight:600, color:"var(--muted)" }}>{t(lang,"days_left")}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginTop:4 }}>{t(lang,"fig_congress_oct_2026")}</div>

              {/* Kongre Şehri Mini Özet */}
              {(() => {
                const ist = Object.values(overrides).filter((o:any) => o?.cityVote === "istanbul").length;
                const rom = Object.values(overrides).filter((o:any) => o?.cityVote === "roma").length;
                const total = ist + rom;
                if (total === 0) return null;
                const iPct = Math.round((ist / total) * 100);
                return (
                  <div onClick={() => setView("kongre-şehri")} style={{ marginTop:12, padding:"10px 12px", background:"var(--surface2)", borderRadius:8, cursor:"pointer" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"var(--muted)", letterSpacing:"0.05em" }}>{t(lang,"host_city_mini")}</span>
                      <span style={{ fontSize:11, color:"var(--accent)" }}>{t(lang,"detail_arrow")}</span>
                    </div>
                    <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden", background:"var(--border)", marginBottom:5 }}>
                      <div style={{ width:`${iPct}%`, background:"#0ea5e9" }} />
                      <div style={{ width:`${100-iPct}%`, background:"#dc2626" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                      <span style={{ color:"#0ea5e9", fontWeight:700 }}>🇹🇷 İstanbul {ist}</span>
                      <span style={{ color:"#dc2626", fontWeight:700 }}>{rom} Roma 🇮🇹</span>
                    </div>
                  </div>
                );
              })()}

              <div style={{ marginTop:14, borderTop:"1px solid var(--border)", paddingTop:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"critical_dates")}</div>
                {KEY_EVENTS.map(ev => (
                  <div key={ev.date} className="key-date-row">
                    <span style={{ fontSize:11, color:"var(--muted)", minWidth:72 }}>{ev.date.slice(5).replace("-",".")}</span>
                    <span style={{ fontSize:12, color:"var(--text)", flex:1 }}>{ev.label}</span>
                    {ev.countries.length > 0 && (
                      <span style={{ fontSize:10, color:"var(--accent)", fontWeight:600 }}>{ev.countries.length} {t(lang,"country_count_suffix")}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Trend Bu Ay */}
            <div className="trend-row">
              <span style={{ fontSize:13 }}>{t(lang,"trend_this_month")}</span>
              <span style={{ color:"#4ade80", fontWeight:700 }}>+{trendThisMonth.gained} {t(lang,"gained_suffix")}</span>
              {trendThisMonth.lost > 0 && <span style={{ color:"#f87171", fontWeight:700 }}>−{trendThisMonth.lost} {t(lang,"lost_suffix")}</span>}
            </div>

            {/* Rakip Analizi */}
            <div className="competitor-card">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{t(lang,"competitor_status")}</span>
                <button type="button" className="edit-btn" onClick={() => {
                  setCompetitorDraft({
                    name: competitor?.name || "",
                    knownSupporters: competitor?.knownSupporters?.join(", ") || "",
                    estimatedVotes: competitor?.estimatedVotes || 0
                  });
                  setEditingCompetitor(true);
                }}><IcEdit /></button>
              </div>
              {editingCompetitor ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input
                    placeholder={t(lang,"competitor_name_ph")}
                    value={competitorDraft.name}
                    onChange={e => setCompetitorDraft(p => ({...p, name: e.target.value}))}
                    style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 8px", color:"var(--text)", fontSize:12 }}
                  />
                  <input
                    placeholder={t(lang,"competitor_supporters_ph")}
                    value={competitorDraft.knownSupporters}
                    onChange={e => setCompetitorDraft(p => ({...p, knownSupporters: e.target.value}))}
                    style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 8px", color:"var(--text)", fontSize:12 }}
                  />
                  <input
                    type="number"
                    placeholder={t(lang,"competitor_votes_ph")}
                    value={competitorDraft.estimatedVotes}
                    onChange={e => setCompetitorDraft(p => ({...p, estimatedVotes: Number(e.target.value)}))}
                    style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 8px", color:"var(--text)", fontSize:12 }}
                  />
                  <div style={{ display:"flex", gap:8 }}>
                    <button type="button" onClick={() => {
                      const data = {
                        name: competitorDraft.name,
                        knownSupporters: competitorDraft.knownSupporters.split(",").map(s=>s.trim()).filter(Boolean),
                        estimatedVotes: competitorDraft.estimatedVotes
                      };
                      set(ref(db, "fig-v3/competitor"), data);
                      setEditingCompetitor(false);
                    }} style={{ flex:1, background:"var(--accent)", color:"#fff", border:"none", borderRadius:6, padding:"6px 8px", fontSize:12, fontWeight:600, cursor:"pointer" }}>{t(lang,"save")}</button>
                    <button type="button" onClick={() => setEditingCompetitor(false)} style={{ flex:1, background:"var(--surface2)", color:"var(--muted)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 8px", fontSize:12, cursor:"pointer" }}>{t(lang,"cancel")}</button>
                  </div>
                </div>
              ) : competitor ? (
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:"var(--text)", marginBottom:6 }}>{competitor.name}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                    <div style={{ background:"var(--surface2)", borderRadius:6, padding:"8px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"suat_celen")}</div>
                      <div style={{ fontSize:24, fontWeight:800, color:"#4ade80" }}>
                        {Object.values(overrides).filter((o:any) => ["confirmed","leaning"].includes((o as CountryOverride & {status:string}).status)).length + mergedSeed.filter(f => !overrides[f.countryCode] && ["confirmed","leaning"].includes(f.status)).length}
                      </div>
                      <div style={{ fontSize:10, color:"var(--muted)" }}>{t(lang,"est_votes")}</div>
                    </div>
                    <div style={{ background:"var(--surface2)", borderRadius:6, padding:"8px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:11, color:"var(--muted)" }}>{competitor.name}</div>
                      <div style={{ fontSize:24, fontWeight:800, color:"#f87171" }}>{competitor.estimatedVotes}</div>
                      <div style={{ fontSize:10, color:"var(--muted)" }}>{t(lang,"est_votes")}</div>
                    </div>
                  </div>
                  {competitor.knownSupporters.length > 0 && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:"var(--muted)", marginBottom:4 }}>{t(lang,"known_supporters")}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                        {competitor.knownSupporters.map(c => (
                          <span key={c} style={{ fontSize:10, background:"rgba(248,113,113,0.15)", color:"#f87171", borderRadius:4, padding:"2px 6px" }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize:12, color:"var(--muted)", margin:0 }}>{t(lang,"no_competitor_info")}</p>
              )}
            </div>

            <section className="section">
              <h2 className="section-title">{t(lang,"vote_title")}</h2>
              <div className="vote-progress-card">
                <div className="vote-big">{totals.supporter} <span>{t(lang,"vote_supporter")}</span></div>
                <div className="vote-goal">{t(lang,"hdr_goal")}: {majority} · {t(lang,"hdr_total")}: {totals.total}</div>
                <div className="progress-track">
                  <div className="progress-fill green" style={{ width: `${(totals.supporter/totals.total)*100}%` }} />
                  <div className="progress-fill blue"  style={{ width: `${(totals.persuadable/totals.total)*100}%` }} />
                  <div className="progress-fill amber" style={{ width: `${(totals.watch/totals.total)*100}%` }} />
                  <div className="progress-fill red"   style={{ width: `${(totals.resistant/totals.total)*100}%` }} />
                </div>
                <div className="vote-legend">
                  <span className="dot green"/><b>{totals.supporter}</b> {t(lang,"status_supporter")}
                  <span className="dot blue"/><b>{totals.persuadable}</b> {t(lang,"status_persuadable")}
                  <span className="dot amber"/><b>{totals.watch}</b> {t(lang,"status_watch")}
                  <span className="dot red"/><b>{totals.resistant}</b> {t(lang,"status_resistant")}
                </div>

                {/* FEATURE 1: Gerçek Taahhüt Dağılımı */}
                {(() => {
                  const committed5 = Object.entries(overrides).filter(([,o]: any) => o.commitmentLevel >= 5).length;
                  const committed6 = Object.entries(overrides).filter(([,o]: any) => o.commitmentLevel === 6).length;
                  if (committed5 === 0) return null;
                  return (
                    <div style={{ display:"flex", gap:12, marginTop:8, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12, color:"#0d9488" }}>✅ {t(lang,"firm_commitment")}: <strong>{committed5}</strong></span>
                      {committed6 > 0 && <span style={{ fontSize:12, color:"#7c3aed" }}>🏆 {t(lang,"written_commitment")}: <strong>{committed6}</strong></span>}
                    </div>
                  );
                })()}

                {/* FEATURE 2: Gerçek Oy Tahmini */}
                {(() => {
                  const realVotes = mergedSeed.filter((f: any) => {
                    const ov = overrides[f.countryCode] || {};
                    const lvl = ov.commitmentLevel ?? 1;
                    const att = ov.congressAttendance ?? "unknown";
                    const isSupporter = f.status === "supporter";
                    return isSupporter && lvl >= 4 && ["confirmed","likely"].includes(att);
                  }).length;
                  return (
                    <div style={{ marginTop:6, padding:"8px 12px", background:"rgba(16,163,127,0.1)", border:"1px solid rgba(16,163,127,0.3)", borderRadius:8 }}>
                      <span style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"real_vote_estimate")}</span>
                      <strong style={{ fontSize:16, color:"#10a37f" }}>{realVotes}</strong>
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* FEATURE 5: Risk Warning */}
            {(() => {
              const highRisks = Object.entries(risks).filter(([code, rList]: any) => {
                const isSup = overrides[code]?.status === "supporter" || federationSeeds.find((f:any)=>f.countryCode===code)?.status === "supporter";
                return isSup && rList?.some((r:any) => !r.resolved && r.severity === "high");
              });
              if (highRisks.length === 0) return null;
              return (
                <div className="section" style={{ paddingTop:0 }}>
                  <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 14px", marginBottom:12 }}>
                    <span style={{ fontSize:12, color:"#f87171", fontWeight:700 }}>⚠️ {highRisks.length} {t(lang,"risk_warning_dashboard")}</span>
                  </div>
                </div>
              );
            })()}

            {/* FEATURE 4: İtiraz Analizi */}
            {(() => {
              const objCounts: Record<string,number> = {};
              Object.values(contactLogs).forEach((logs: any) => {
                if (!logs) return;
                logs.forEach((l: any) => {
                  (l.objections || []).forEach((obj: string) => {
                    objCounts[obj] = (objCounts[obj] || 0) + 1;
                  });
                });
              });
              const sorted = Object.entries(objCounts).sort((a,b) => b[1]-a[1]).slice(0,4);
              if (sorted.length === 0) return null;
              const maxCount = sorted[0][1];
              return (
                <section className="section">
                  <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:12 }}>{t(lang,"objection_analysis")}</div>
                    {sorted.map(([obj, count]) => (
                      <div key={obj} style={{ marginBottom:8 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:11, color:"var(--text)" }}>{obj}</span>
                          <span style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>{count}</span>
                        </div>
                        <div style={{ height:6, background:"var(--surface2)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ width:`${(count/maxCount)*100}%`, height:"100%", background:"#f59e0b", borderRadius:3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* FEATURE 6: Etki Merkezleri */}
            {(() => {
              const allyCounts: Record<string, number> = {};
              federationSeeds.forEach((f: any) => {
                (f.relationshipNetwork || []).filter((r: any) => r.kind === "ally").forEach(() => {
                  allyCounts[f.countryCode] = (allyCounts[f.countryCode] || 0) + 1;
                });
              });
              const top5 = Object.entries(allyCounts).sort((a,b) => b[1]-a[1]).slice(0,5);
              if (top5.length === 0) return null;
              return (
                <section className="section">
                  <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:10 }}>{t(lang,"influence_centers")}</div>
                    {top5.map(([code, count]) => {
                      const fed = mergedByCode[code];
                      const eff = fed?.status;
                      const statusColors: Record<string,string> = {supporter:"#10D9A0", persuadable:"#3B82F6", watch:"#F59E0B", resistant:"#EF4444"};
                      return (
                        <div key={code} onClick={() => openDossier(code)} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", borderBottom:"1px solid var(--border)", cursor:"pointer" }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", background:statusColors[(eff ?? "")]||"var(--muted)", flexShrink:0 }} />
                          <span style={{ fontSize:12, fontWeight:700, color:"var(--accent)", minWidth:36 }}>{code}</span>
                          <span style={{ fontSize:12, color:"var(--text)", flex:1 }}>{fed ? trName(fed) : code}</span>
                          <span style={{ fontSize:11, color:"#4ade80", fontWeight:600 }}>+{count} {t(lang,"allies_suffix")}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })()}

            <section className="section">
              <h2 className="section-title">{t(lang,"continents_title")}</h2>
              {(["EG","AGU","UAG","PAGU","OGU"] as ContinentCode[]).map(code => {
                const meta = continentMeta[code];
                const s = continentStats[code];
                if (!s) return null;
                const pct = s.total > 0 ? Math.round((s.supporter / s.total) * 100) : 0;
                const accent = meta.accent;
                return (
                  <div
                    key={code}
                    className="continent-row"
                    style={{ background: `${accent}15`, borderColor: `${accent}35` }}
                    onClick={() => { setContinentFilter(code); setView("countries"); }}
                  >
                    <div className="continent-row-left">
                      <span className="continent-flag">{meta.flag}</span>
                      <div>
                        <div className="continent-name" style={{ color: accent }}>{t(lang,`continent_${code}`)}</div>
                        <div className="continent-sub">{s.total} {t(lang,"federation_lbl")}</div>
                        <div className="continent-stats">
                          <span className="cs-green">✓ {s.supporter}</span>
                          <span className="cs-blue">◈ {s.persuadable}</span>
                          <span className="cs-amber">◎ {s.watch}</span>
                          <span className="cs-red">✕ {s.resistant}</span>
                        </div>
                      </div>
                    </div>
                    <div className="continent-row-right">
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${pct}%`, background: accent }} />
                      </div>
                      <span className="continent-pct" style={{ color: accent }}>{pct}%</span>
                      <IcChevronRight />
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Oy Simülatörü */}
            <section className="section">
              <h2 className="section-title">{lang === "tr" ? "Oy Projeksiyonu" : "Vote Projection"}</h2>
              <div className="sim-card">
                <div className="sim-big">
                  <span className="sim-num" style={{ color: projected >= majority ? "var(--green)" : "var(--amber)" }}>{projected}</span>
                  <span className="sim-sep">/</span>
                  <span className="sim-goal">{majority}</span>
                  {projected >= majority && <span className="sim-check">✓</span>}
                </div>
                <div className="sim-bar-wrap">
                  <div className="progress-track">
                    <div className="progress-fill green" style={{ width: `${Math.min((projected / totals.total) * 100, 100)}%` }} />
                  </div>
                  <div className="sim-pct">{Math.round((projected / totals.total) * 100)}%</div>
                </div>
                <div className="sim-detail">
                  <span>{lang === "tr" ? "İkna edilebilir" : "Persuadable"}: <b>{totals.persuadable}</b></span>
                  <span>{lang === "tr" ? "İzlenen" : "Watch"}: <b>{totals.watch}</b></span>
                  <span>{lang === "tr" ? "Hedef dönüşüm" : "Conversion"}: <b>%{conversionRate}</b></span>
                </div>
                <div className="sim-slider-row">
                  <span className="sim-slider-label">0%</span>
                  <input
                    type="range"
                    className="sim-slider"
                    min={0}
                    max={100}
                    value={conversionRate}
                    onChange={e => setConversionRate(Number(e.target.value))}
                  />
                  <span className="sim-slider-label">100%</span>
                </div>
                <div className="sim-scenarios">
                  <div className={`sim-scenario ${totals.supporter + Math.round(totals.persuadable * 0.5) >= majority ? "sim-ok" : "sim-warn"}`}>
                    %50 → {totals.supporter + Math.round(totals.persuadable * 0.5)} {lang === "tr" ? "oy" : "votes"}
                    {totals.supporter + Math.round(totals.persuadable * 0.5) >= majority ? " ✓" : ` (${majority - totals.supporter - Math.round(totals.persuadable * 0.5)} ${lang === "tr" ? "eksik" : "short"})`}
                  </div>
                  <div className={`sim-scenario ${totals.supporter + Math.round(totals.persuadable * 0.33) >= majority ? "sim-ok" : "sim-warn"}`}>
                    %33 → {totals.supporter + Math.round(totals.persuadable * 0.33)} {lang === "tr" ? "oy" : "votes"}
                    {totals.supporter + Math.round(totals.persuadable * 0.33) >= majority ? " ✓" : ` (${majority - totals.supporter - Math.round(totals.persuadable * 0.33)} ${lang === "tr" ? "eksik" : "short"})`}
                  </div>
                </div>

                {/* FEATURE 8: Simülatör 2.0 — Kıta Bazlı */}
                <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--border)" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:10, letterSpacing:"0.05em" }}>{t(lang,"continent_based_conversion")}</div>
                  {[{code:"EG",label:"🇪🇺 Avrupa"},{code:"AGU",label:"🌏 Asya"},{code:"UAG",label:"🌍 Afrika"},{code:"PAGU",label:"🌎 Amerika"},{code:"OGU",label:"🌊 Okyanusya"}].map(({code, label}) => {
                    const targets = federationSeeds.filter((f:any) => f.continent === code && ["watch","persuadable"].includes(overrides[f.countryCode]?.status || f.status));
                    const val = continentSliders[code] || 0;
                    const converted = Math.round(targets.length * val / 100);
                    return (
                      <div key={code} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:11, color:"var(--text)" }}>{label}</span>
                          <span style={{ fontSize:11, color:"var(--accent)", fontWeight:600 }}>+{converted} / {targets.length} {t(lang,"targets_lbl")}</span>
                        </div>
                        <input
                          type="range" min={0} max={100} value={val}
                          onChange={e => setContinentSliders(p => ({...p, [code]: Number(e.target.value)}))}
                          style={{ width:"100%", accentColor:"var(--accent)" }}
                        />
                      </div>
                    );
                  })}
                  <div style={{ display:"flex", gap:6, marginTop:8 }}>
                    {[
                      {label:t(lang,"worst_case"), vals:{EG:5,AGU:5,UAG:5,PAGU:5,OGU:5}},
                      {label:t(lang,"current_case"), vals:{EG:30,AGU:25,UAG:40,PAGU:35,OGU:50}},
                      {label:t(lang,"optimistic_case"), vals:{EG:60,AGU:50,UAG:70,PAGU:65,OGU:80}},
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => { setContinentSliders(preset.vals); setScenarioName(preset.label); }}
                        style={{ flex:1, background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 4px", fontSize:10, color:"var(--text)", cursor:"pointer", fontWeight:600 }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    let extraVotes = 0;
                    (["EG","AGU","UAG","PAGU","OGU"] as const).forEach(code => {
                      const targets = federationSeeds.filter((f:any) => f.continent === code && ["watch","persuadable"].includes(overrides[f.countryCode]?.status || f.status));
                      extraVotes += Math.round(targets.length * (continentSliders[code]||0) / 100);
                    });
                    const base = federationSeeds.filter((f:any) => (overrides[f.countryCode]?.status || f.status) === "supporter").length;
                    const total = base + extraVotes;
                    const maj = Math.ceil(federationSeeds.length / 2) + 1;
                    return (
                      <div style={{ marginTop:10, padding:"10px 12px", background: total >= maj ? "rgba(16,163,127,0.12)" : "rgba(239,68,68,0.08)", border:`1px solid ${total >= maj ? "rgba(16,163,127,0.4)" : "rgba(239,68,68,0.3)"}`, borderRadius:8, textAlign:"center" }}>
                        <div style={{ fontSize:22, fontWeight:800, color: total >= maj ? "#10a37f" : "#f87171" }}>{total}</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>{scenarioName} {t(lang,"scenario_lbl")} · {t(lang,"majority_lbl")}: {maj}</div>
                        <div style={{ fontSize:11, color: total >= maj ? "#4ade80" : "#f87171", fontWeight:600, marginTop:2 }}>
                          {total >= maj ? `✅ +${total - maj} ${t(lang,"over")}` : `❌ ${maj - total} ${t(lang,"under")}`}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </section>

            {/* Aksiyon Listesi */}
            <section className="section">
              <h2 className="section-title">{lang === "tr" ? "🔥 Bu Hafta Hareket Et" : "🔥 Act This Week"}</h2>
              {actionList.map((c, i) => (
                <div key={c.countryCode} className="action-row" onClick={() => openDossier(c.countryCode)}>
                  <span className="action-rank">{i + 1}</span>
                  <div className="action-info">
                    <div className="action-name">
                      <span className="flag-emoji">{flagEmoji(c.countryCode)}</span>
                      {trName(c)} <span className="country-code-tag">{c.countryCode}</span>
                      <span className={`badge ${STATUS_CSS[c.status]}`} style={{ marginLeft:6 }}>{t(lang,`status_${c.status}`)}</span>
                    </div>
                    <div className="action-sub">
                      {t(lang,"relationship")}: {c.relationshipStrength}/100 · {t(lang,`continent_${c.continent}`)} · {primaryNeedLabel(c.primaryNeed)}
                    </div>
                  </div>
                  <div className="priority-score" style={{ color: statusTone(c.status).color }}>{fmtScore(c.priorityScore)}</div>
                </div>
              ))}
            </section>

            <section className="section">
              <h2 className="section-title">{t(lang,"priority_title")}</h2>
              {mergedSeed.filter(c => c.status === "persuadable").slice(0, 8).map(c => (
                <div key={c.countryCode} className="priority-row" onClick={() => openDossier(c.countryCode)}>
                  <div className="priority-row-left">
                    <span className={`badge ${STATUS_CSS[c.status]}`}>{t(lang,`status_${c.status}`)}</span>
                    <div>
                      <div className="priority-name"><span className="flag-emoji">{flagEmoji(c.countryCode)}</span>{trName(c)} <span className="country-code-tag">{c.countryCode}</span></div>
                      <div className="priority-sub">{t(lang,`continent_${c.continent}`)} · {primaryNeedLabel(c.primaryNeed)}</div>
                    </div>
                  </div>
                  <div className="priority-score" style={{ color: statusTone(c.status).color }}>{fmtScore(c.priorityScore)}</div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* ══ HARİTA ══ */}
        {view === "map" && (
          <>
          <div className="map-container" ref={mapRef}>
            <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 130 }} style={{ width: "100%", height: "100%" }}>
              <ZoomableGroup
                zoom={mapPos.zoom}
                center={mapPos.coordinates}
                onMoveEnd={({ zoom, coordinates }: { zoom: number; coordinates: [number, number] }) => setMapPos({ zoom, coordinates })}
              >
                <Geographies geography={worldGeoData}>
                  {({ geographies }: { geographies: { id: string; rsmKey: string; [k: string]: unknown }[] }) => geographies.map((geo) => {
                    const numericId = geo.id as string;
                    const status = statusByNumeric[numericId];
                    const isSelected = federationSeeds.find(c => CODE_TO_NUMERIC[c.countryCode] === numericId)?.countryCode === selectedCode;
                    return (
                      <Geography
                        key={`${geo.rsmKey}-${status ?? "none"}`}
                        geography={geo}
                        onClick={() => {
                          const seed = federationSeeds.find(c => CODE_TO_NUMERIC[c.countryCode] === numericId);
                          if (seed) { setSelectedCode(seed.countryCode); setMapPreview(seed.countryCode); }
                        }}
                        style={{
                          default: { fill: status ? MAP_COLOR[status] : "#1C2A3A", stroke: "#0D1B2A", strokeWidth: 0.4, opacity: isSelected ? 1 : 0.85, outline: "none" },
                          hover:   { fill: status ? MAP_COLOR[status] : "#243447", stroke: "#3B82F6", strokeWidth: 0.8, opacity: 1, outline: "none", cursor: status ? "pointer" : "default" },
                          pressed: { fill: status ? MAP_COLOR[status] : "#1C2A3A", outline: "none" }
                        }}
                      />
                    );
                  })}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            <div className="map-legend">
              {(["supporter","persuadable","watch","resistant"] as SupportStatus[]).map(s => (
                <div key={s} className="map-legend-item">
                  <span className="map-legend-dot" style={{ background: MAP_COLOR[s] }} />
                  <span>{t(lang,`status_${s}`)}</span>
                </div>
              ))}
            </div>

            <div className="map-zoom">
              <button type="button" onClick={() => setMapPos(p => ({ ...p, zoom: Math.min(p.zoom+0.8,5) }))}>+</button>
              <button type="button" onClick={() => setMapPos(p => ({ ...p, zoom: Math.max(p.zoom-0.8,1) }))}>−</button>
              <button type="button" onClick={() => setMapPos({ coordinates:[10,12], zoom:1 })}>↺</button>
            </div>

          </div>

          {/* map-bar → map-container DIŞINDA, main içinde absolute — SVG touch event rekabeti yok */}
          {mapPreview && selected && (
            <div className="map-bar-overlay">
              <div className="map-bar">
                <PresidentAvatar countryCode={selected.countryCode} presidentName={selected.president} size="sm" photoOverride={photoOverrides[selected.countryCode]} />
                <div style={{ minWidth: 0, flex: 1 }} onClick={() => { setDossierTab("genel"); setShowScoreInfo(false); setSheet("dossier"); }}>
                  <div className="map-bar-name"><span className="flag-emoji">{flagEmoji(selected.countryCode)}</span>{trName(selected)} <span className="map-bar-code">{selected.countryCode}</span></div>
                  <div className="map-bar-sub">{selected.president} · {t(lang,`continent_${selected.continent}`)}</div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                  <button className="map-bar-btn" type="button" onClick={() => { setDossierTab("genel"); setShowScoreInfo(false); setSheet("dossier"); }}>{t(lang,"open_file")}</button>
                  <button type="button" className="map-bar-close" onClick={() => setMapPreview(null)}><IcX /></button>
                </div>
              </div>
            </div>
          )}
          </>
        )}

        {/* ══ FEDERASYONLAR ══ */}
        {view === "countries" && (
          <div className="tab-scroll">
            <div className="search-bar">
              <input
                className="search-input"
                placeholder={t(lang,"search_placeholder")}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {(["all","supporter","persuadable","watch","resistant"] as (FilterValue<SupportStatus>)[]).map(s => (
                <button key={s} type="button" className={`pill ${statusFilter===s?"pill-active":""}`}
                  onClick={() => setStatusFilter(s)}>
                  {s === "all" ? t(lang,"status_all") : t(lang,`status_${s}`)}
                </button>
              ))}
            </div>

            <div className="filter-pills">
              <button type="button" className={`pill ${continentFilter==="all"?"pill-active":""}`} onClick={() => setContinentFilter("all")}>{t(lang,"continent_all")}</button>
              {(["EG","AGU","UAG","PAGU","OGU"] as ContinentCode[]).map(code => (
                <button key={code} type="button" className={`pill ${continentFilter===code?"pill-active":""}`} onClick={() => setContinentFilter(code)}>
                  {continentMeta[code]?.flag} {t(lang,`continent_${code}`)}
                </button>
              ))}
            </div>

            <div className="list-count">{filtered.length} {t(lang,"list_count")}</div>

            {filtered.map(c => {
              const dirEntry = directoryByCode[c.countryCode];
              return (
              <div key={c.countryCode} className="country-card" onClick={() => openDossier(c.countryCode)}>
                <div className="country-card-left">
                  <PresidentAvatar countryCode={c.countryCode} presidentName={c.president} size="md" photoOverride={photoOverrides[c.countryCode]} />
                  <div style={{ minWidth: 0 }}>
                    <div className="country-card-name"><span className="flag-emoji">{flagEmoji(c.countryCode)}</span>{trName(c)} <span className="country-code-tag">{c.countryCode}</span></div>
                    <div className="country-card-sub">{c.president}</div>
                    {dirEntry?.disciplines && dirEntry.disciplines.length > 0 && (
                      <div className="card-disciplines">
                        {dirEntry.disciplines.slice(0, 5).map(d => (
                          <span key={d} className="card-disc-chip"
                            style={{ borderColor: DISCIPLINE_TR[d]?.color ?? "var(--border)", color: DISCIPLINE_TR[d]?.color ?? "var(--muted)" }}>
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="country-card-right">
                  <span className={`badge ${STATUS_CSS[c.status]}`}>{t(lang,`status_${c.status}`)}</span>
                  <span className="country-card-score">{fmtScore(c.priorityScore)}</span>
                  {/* FEATURE 1: Commitment dot */}
                  {overrides[c.countryCode]?.commitmentLevel && (
                    <span className="commitment-dot" data-level={overrides[c.countryCode].commitmentLevel}>
                      {(["🔵","🟡","🟠","🟢","✅","🏆"] as const)[(overrides[c.countryCode].commitmentLevel as number) - 1]}
                    </span>
                  )}
                  {/* FEATURE 2: Attendance icon */}
                  {(() => {
                    const att = overrides[c.countryCode]?.congressAttendance;
                    if (!att || att === "unknown") return null;
                    const icons: Record<string,string> = {confirmed:"✈️", likely:"🟢", uncertain:"❓", no:"✗"};
                    return <span style={{ fontSize:11 }}>{icons[att as string]}</span>;
                  })()}
                  {/* FEATURE 5: Risk badge */}
                  {risks[c.countryCode]?.some((r:any) => !r.resolved && r.severity === "high") && (
                    <span style={{ fontSize:11 }}>⚠️</span>
                  )}
                  {(c.facilityScore ?? 0) > 0 && (
                    <div className="card-facility-mini" title={`${t(lang,"facilities_lbl")}: ${c.facilityScore}/100`}>
                      <div className="card-facility-fill" style={{ width: `${c.facilityScore}%` }} />
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* ══ NOTLAR ══ */}
        {view === "notes" && (
          <div className="tab-scroll">
            {noteReturnCode && (
              <div className="notes-back-bar">
                <button type="button" className="notes-back-btn" onClick={() => {
                  setSelectedCode(noteReturnCode);
                  setDossierTab("genel");
                  setSheet("dossier");
                  setNoteReturnCode(null);
                }}>
                  ← {COUNTRY_TR[noteReturnCode] ?? noteReturnCode} {t(lang,"back_to_file")}
                </button>
              </div>
            )}
            <section className="section">
              <div className="notes-header-row">
                <h2 className="section-title">{t(lang,"new_note")}</h2>
              </div>
              <div className="note-country-selector">
                <select
                  className="note-select"
                  value={selectedCode}
                  onChange={e => setSelectedCode(e.target.value)}
                >
                  {ranked.map(c => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {trName(c)} ({c.countryCode}) — {t(lang,`status_${mergedByCode[c.countryCode]?.status ?? c.status}`)}
                    </option>
                  ))}
                </select>
              </div>
              <form className="note-form" onSubmit={addNote}>
                <input className="note-input" placeholder={t(lang,"note_title_ph")} value={noteTitle} onChange={e => setNoteTitle(e.target.value)} required />
                <textarea className="note-textarea" placeholder={t(lang,"note_body_ph")} rows={4} value={noteBody} onChange={e => setNoteBody(e.target.value)} required />
                <button className="note-submit" type="submit">{t(lang,"note_add_btn")}</button>
              </form>
            </section>

            {notes.length === 0 ? (
              <div className="empty-state">{t(lang,"no_notes")}</div>
            ) : (
              <>
                {notes.filter(n => !n.completed).length > 0 && (
                  <section className="section">
                    <h2 className="section-title">{t(lang,"active_lbl")} <span className="note-count">{notes.filter(n => !n.completed).length}</span></h2>
                    {notes.filter(n => !n.completed).map(n => (
                      <div key={n.id} className="note-card">
                        <div className="note-card-header">
                          <button type="button" className="note-complete-btn" onClick={() => toggleNoteComplete(n.id, true)}>
                            <IcCheckCircle done={false} />
                          </button>
                          <span className="note-card-country">{n.countryName} · {n.countryCode}</span>
                          <div style={{ display:"flex", gap:"8px", alignItems:"center", marginLeft:"auto" }}>
                            <span className="note-card-date">{n.date}</span>
                            <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                          </div>
                        </div>
                        <div className="note-card-title">{n.title}</div>
                        <div className="note-card-body">{n.body}</div>
                      </div>
                    ))}
                  </section>
                )}
                {notes.filter(n => n.completed).length > 0 && (
                  <section className="section">
                    <h2 className="section-title" style={{ color:"var(--muted)" }}>{t(lang,"completed_lbl")} <span className="note-count">{notes.filter(n => n.completed).length}</span></h2>
                    {notes.filter(n => n.completed).map(n => (
                      <div key={n.id} className="note-card note-card-done">
                        <div className="note-card-header">
                          <button type="button" className="note-complete-btn" onClick={() => toggleNoteComplete(n.id, false)}>
                            <IcCheckCircle done={true} />
                          </button>
                          <span className="note-card-country" style={{ opacity:0.5 }}>{n.countryName} · {n.countryCode}</span>
                          <div style={{ display:"flex", gap:"8px", alignItems:"center", marginLeft:"auto" }}>
                            <span className="note-card-date">{n.date}</span>
                            <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                          </div>
                        </div>
                        <div className="note-card-title note-title-done">{n.title}</div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        )}
        {/* ══ VAATLER ══ */}
        {view === "vaatler" && (
          <div className="tab-scroll">
            <div className="vaatler-header">
              <h2 className="section-title">{t(lang,"promises_title")}</h2>
              <button type="button" className="promise-add-btn" onClick={() => { resetPromiseForm(); setShowPromiseForm(true); }}>
                <IcPlus /> {t(lang,"add_promise")}
              </button>
            </div>

            {/* Sekmeler */}
            <div className="filter-pills">
              {(["active","archive","all"] as PromiseTab[]).map(tab => (
                <button key={tab} type="button" className={`pill ${promiseTab === tab ? "pill-active" : ""}`} onClick={() => setPromiseTab(tab)}>
                  {tab === "active" ? t(lang,"promises_active") : tab === "archive" ? t(lang,"promises_archive") : t(lang,"promises_all")}
                </button>
              ))}
            </div>

            {/* Yeni vaat formu */}
            {showPromiseForm && (
              <form className="promise-form" onSubmit={savePromise}>
                <textarea
                  className="note-textarea"
                  placeholder={t(lang,"promise_text_ph")}
                  value={promiseText}
                  onChange={e => setPromiseText(e.target.value)}
                  rows={3}
                  required
                />

                <div className="promise-form-grid">
                  <div className="promise-form-field">
                    <label className="promise-form-label">{t(lang,"promise_category")}</label>
                    <select className="promise-select" value={promiseCategory} onChange={e => setPromiseCategory(e.target.value as PromiseCategory)}>
                      {(["finansman","etkinlik","egitim","teknik","yonetisim","diger"] as PromiseCategory[]).map(cat => (
                        <option key={cat} value={cat}>{t(lang,`pcat_${cat}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="promise-form-field">
                    <label className="promise-form-label">{t(lang,"promise_status")}</label>
                    <select className="promise-select" value={promiseStatus} onChange={e => setPromiseStatus(e.target.value as PromiseStatus)}>
                      {(["verildi","devam","tamamlandi","iptal"] as PromiseStatus[]).map(st => (
                        <option key={st} value={st}>{t(lang,`pstatus_${st}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="promise-form-field">
                    <label className="promise-form-label">{t(lang,"promise_date_given")}</label>
                    <input type="date" className="promise-input" value={promiseDateGiven} onChange={e => setPromiseDateGiven(e.target.value)} />
                  </div>

                  <div className="promise-form-field">
                    <label className="promise-form-label">{t(lang,"promise_due_date")}</label>
                    <input type="date" className="promise-input" value={promiseDueDate} onChange={e => setPromiseDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="promise-form-field">
                  <label className="promise-form-label">{t(lang,"promise_countries")}</label>
                  <select
                    className="promise-select promise-country-select"
                    multiple
                    value={promiseCountries}
                    onChange={e => setPromiseCountries(Array.from(e.target.selectedOptions, o => o.value))}
                  >
                    {ranked.map(c => (
                      <option key={c.countryCode} value={c.countryCode}>
                        {flagEmoji(c.countryCode)} {trName(c)} ({c.countryCode})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  className="note-textarea"
                  placeholder={t(lang,"promise_notes")}
                  value={promiseNotes}
                  onChange={e => setPromiseNotes(e.target.value)}
                  rows={2}
                />

                <div style={{ display:"flex", gap:8 }}>
                  <button className="note-submit" type="submit">{t(lang,"promise_save")}</button>
                  <button className="note-cancel" type="button" onClick={resetPromiseForm}>{t(lang,"promise_cancel")}</button>
                </div>
              </form>
            )}

            {/* Vaat listesi */}
            {(() => {
              const PROMISE_STATUS_CSS: Record<PromiseStatus, string> = {
                verildi: "badge-blue", devam: "badge-amber", tamamlandi: "badge-green", iptal: "badge-red"
              };
              const PROMISE_CAT_COLORS: Record<PromiseCategory, string> = {
                finansman: "#34D399", etkinlik: "#60A5FA", egitim: "#A78BFA",
                teknik: "#F59E0B", yonetisim: "#F472B6", diger: "#94A3B8"
              };

              const filteredPromises = promises.filter(p => {
                if (promiseTab === "active") return p.status === "verildi" || p.status === "devam";
                if (promiseTab === "archive") return p.status === "tamamlandi" || p.status === "iptal";
                return true;
              });

              if (filteredPromises.length === 0) return (
                <div className="empty-state">
                  {promiseTab === "active" ? t(lang,"promise_empty_active") :
                   promiseTab === "archive" ? t(lang,"promise_empty_archive") : t(lang,"promise_empty")}
                </div>
              );

              return filteredPromises.map(p => (
                <div key={p.id} className="promise-card">
                  <div className="promise-card-top">
                    <span
                      className="promise-cat-chip"
                      style={{ background: `${PROMISE_CAT_COLORS[p.category]}20`, color: PROMISE_CAT_COLORS[p.category], borderColor: `${PROMISE_CAT_COLORS[p.category]}40` }}
                    >
                      {t(lang,`pcat_${p.category}`)}
                    </span>
                    <div className="promise-flags">
                      {p.countryCodes.length === 0 ? (
                        <span className="promise-general-tag">{t(lang,"promise_general")}</span>
                      ) : (
                        <>
                          {p.countryCodes.slice(0, 6).map(code => (
                            <span key={code} className="promise-flag-emoji" title={code}>{flagEmoji(code)}</span>
                          ))}
                          {p.countryCodes.length > 6 && <span className="promise-more">+{p.countryCodes.length - 6}</span>}
                        </>
                      )}
                    </div>
                    <span className={`badge ${PROMISE_STATUS_CSS[p.status]}`}>{t(lang,`pstatus_${p.status}`)}</span>
                  </div>

                  <div className="promise-text">{p.text}</div>

                  {(p.dateGiven || p.dueDate) && (
                    <div className="promise-dates">
                      {p.dateGiven && <span>📅 {p.dateGiven}</span>}
                      {p.dueDate && <span>→ {p.dueDate}</span>}
                    </div>
                  )}

                  {p.notes && <div className="promise-note-text">{p.notes}</div>}

                  <div className="promise-card-footer">
                    <select
                      className="promise-status-select"
                      value={p.status}
                      onChange={e => updatePromiseStatus(p.id, e.target.value as PromiseStatus)}
                    >
                      {(["verildi","devam","tamamlandi","iptal"] as PromiseStatus[]).map(st => (
                        <option key={st} value={st}>{t(lang,`pstatus_${st}`)}</option>
                      ))}
                    </select>
                    <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                      <button type="button" className="promise-edit-btn" onClick={() => startEditPromise(p)}><IcEdit /></button>
                      <button type="button" className="promise-delete-btn" onClick={() => { if (window.confirm(t(lang,"promise_delete") + "?")) deletePromise(p.id); }}><IcX /></button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* ══ SAVAŞ ODASI ══ */}
        {view === "savaş-odası" && (() => {
          const today = new Date();
          const sevenDaysAgo = new Date(today.getTime() - 7*24*60*60*1000).toISOString().slice(0,10);
          const fourteenDaysAgo = new Date(today.getTime() - 14*24*60*60*1000).toISOString().slice(0,10);
          const thisWeekStart = new Date(today.getTime() - 7*24*60*60*1000).toISOString().slice(0,10);

          const lastContact: Record<string, string> = {};
          Object.entries(contactLogs).forEach(([code, logs]) => {
            if (logs && logs.length > 0) {
              const sorted = [...logs].sort((a,b) => b.date.localeCompare(a.date));
              lastContact[code] = sorted[0].date;
            }
          });

          const allFeds = federationSeeds.map((f: any) => ({ ...f, ...(overrides[f.countryCode] || {}) }));

          const urgentPersuadable = allFeds.filter((f: any) => {
            const eff = overrides[f.countryCode]?.status || f.status;
            return eff === "persuadable" && (!lastContact[f.countryCode] || lastContact[f.countryCode] < sevenDaysAgo);
          }).sort((a:any, b:any) => (lastContact[a.countryCode] || "0").localeCompare(lastContact[b.countryCode] || "0"));

          const warningWatch = allFeds.filter((f: any) => {
            const eff = overrides[f.countryCode]?.status || f.status;
            return eff === "watch" && (!lastContact[f.countryCode] || lastContact[f.countryCode] < fourteenDaysAgo);
          }).sort((a:any, b:any) => (lastContact[a.countryCode] || "0").localeCompare(lastContact[b.countryCode] || "0"));

          const nextSteps: {code: string, name: string, nextStep: string, date: string}[] = [];
          Object.entries(contactLogs).forEach(([code, logs]) => {
            if (logs && logs.length > 0) {
              const sorted = [...logs].sort((a:any,b:any) => b.date.localeCompare(a.date));
              const latest = sorted[0];
              if (latest.nextStep && latest.nextStep.trim()) {
                const fed = federationSeeds.find((f:any) => f.countryCode === code);
                nextSteps.push({ code, name: fed ? trName(fed) : code, nextStep: latest.nextStep, date: latest.date });
              }
            }
          });
          nextSteps.sort((a,b) => b.date.localeCompare(a.date));

          const lastWeekStart = new Date(today.getTime() - 14*24*60*60*1000).toISOString().slice(0,10);
          let thisWeekCount = 0, lastWeekCount = 0;
          const channelCounts: Record<string,number> = {desk:0, email:0, call:0, visit:0};
          Object.values(contactLogs).forEach((logs: any) => {
            if (!logs) return;
            logs.forEach((l: any) => {
              if (l.date >= thisWeekStart) { thisWeekCount++; if (l.channel) channelCounts[l.channel] = (channelCounts[l.channel]||0)+1; }
              else if (l.date >= lastWeekStart) lastWeekCount++;
            });
          });
          const totalChannels = Object.values(channelCounts).reduce((a,b) => a+b, 0);

          return (
            <div className="tab-scroll">
              <div style={{ padding:"24px 20px", maxWidth:1100, margin:"0 auto" }}>
                <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text)", marginBottom:4 }}>{t(lang,"war_room_title")}</h2>
                <p style={{ fontSize:13, color:"var(--muted)", marginBottom:24 }}>{t(lang,"what_to_do_today")}</p>
                <div className="war-room-grid">
                  <div>
                    {urgentPersuadable.length > 0 && (
                      <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, padding:"16px", marginBottom:16 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#f87171", marginBottom:12 }}>{t(lang,"urgent_persuadable_title")}</div>
                        {urgentPersuadable.slice(0,8).map((f: any) => (
                          <div key={f.countryCode} onClick={() => openDossier(f.countryCode)} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid rgba(239,68,68,0.15)", cursor:"pointer" }}>
                            <span style={{ fontSize:12, fontWeight:700, color:"var(--accent)", minWidth:36 }}>{f.countryCode}</span>
                            <span style={{ fontSize:12, color:"var(--text)", flex:1 }}>{trName(f)}</span>
                            <span style={{ fontSize:10, color:"var(--muted)" }}>{lastContact[f.countryCode] ? lastContact[f.countryCode] : t(lang,"no_contact_yet")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {warningWatch.length > 0 && (
                      <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:12, padding:"16px", marginBottom:16 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#fbbf24", marginBottom:12 }}>{t(lang,"watch_followup_title")}</div>
                        {warningWatch.slice(0,6).map((f: any) => (
                          <div key={f.countryCode} onClick={() => openDossier(f.countryCode)} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid rgba(245,158,11,0.15)", cursor:"pointer" }}>
                            <span style={{ fontSize:12, fontWeight:700, color:"var(--accent)", minWidth:36 }}>{f.countryCode}</span>
                            <span style={{ fontSize:12, color:"var(--text)", flex:1 }}>{trName(f)}</span>
                            <span style={{ fontSize:10, color:"var(--muted)" }}>{lastContact[f.countryCode] || t(lang,"no_contact_yet")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {urgentPersuadable.length === 0 && warningWatch.length === 0 && (
                      <div style={{ background:"rgba(16,163,127,0.08)", border:"1px solid rgba(16,163,127,0.3)", borderRadius:12, padding:"24px 16px", textAlign:"center" }}>
                        <div style={{ fontSize:24, marginBottom:8 }}>✅</div>
                        <div style={{ fontSize:13, color:"#10a37f", fontWeight:600 }}>{t(lang,"all_contacts_current")}</div>
                      </div>
                    )}
                    {nextSteps.length > 0 && (
                      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"16px", marginTop:16 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:12 }}>{t(lang,"next_steps")}</div>
                        {nextSteps.slice(0,6).map((ns, i) => (
                          <div key={i} style={{ padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                              <span style={{ fontSize:11, fontWeight:700, color:"var(--accent)" }}>{ns.code}</span>
                              <span style={{ fontSize:11, color:"var(--muted)" }}>{ns.date}</span>
                            </div>
                            <div style={{ fontSize:12, color:"var(--text)" }}>{ns.nextStep}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"16px", marginBottom:16 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:16 }}>{t(lang,"contact_velocity")}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                        <div style={{ textAlign:"center", padding:"12px", background:"var(--surface2)", borderRadius:8 }}>
                          <div style={{ fontSize:28, fontWeight:800, color:"var(--accent)" }}>{thisWeekCount}</div>
                          <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"this_week")}</div>
                        </div>
                        <div style={{ textAlign:"center", padding:"12px", background:"var(--surface2)", borderRadius:8 }}>
                          <div style={{ fontSize:28, fontWeight:800, color:"var(--muted)" }}>{lastWeekCount}</div>
                          <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"last_week")}</div>
                          {lastWeekCount > 0 && (
                            <div style={{ fontSize:10, color: thisWeekCount >= lastWeekCount ? "#4ade80" : "#f87171" }}>
                              {thisWeekCount >= lastWeekCount ? "▲" : "▼"} {Math.abs(thisWeekCount - lastWeekCount)} {t(lang,"difference")}
                            </div>
                          )}
                        </div>
                      </div>
                      {totalChannels > 0 && (
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8 }}>{t(lang,"channel_distribution")}</div>
                          {Object.entries(channelCounts).filter(([,v]) => v > 0).map(([channel, count]) => (
                            <div key={channel} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                              <span style={{ fontSize:11, color:"var(--muted)", minWidth:70 }}>{{desk:t(lang,"channel_desk"),email:t(lang,"channel_email"),call:t(lang,"channel_call"),visit:t(lang,"channel_visit")}[channel as "desk"|"email"|"call"|"visit"] || channel}</span>
                              <div style={{ flex:1, height:8, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${(count/totalChannels)*100}%`, height:"100%", background:"var(--accent)", borderRadius:4 }} />
                              </div>
                              <span style={{ fontSize:11, color:"var(--text)", fontWeight:600 }}>{count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"16px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:12 }}>{t(lang,"longest_waiting")}</div>
                      {allFeds
                        .filter((f:any) => ["persuadable","watch"].includes(overrides[f.countryCode]?.status || f.status))
                        .sort((a:any,b:any) => (lastContact[a.countryCode]||"0").localeCompare(lastContact[b.countryCode]||"0"))
                        .slice(0,5)
                        .map((f:any) => {
                          const eff = overrides[f.countryCode]?.status || f.status;
                          return (
                            <div key={f.countryCode} onClick={() => openDossier(f.countryCode)} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid var(--border)", cursor:"pointer" }}>
                              <span className={`status-dot status-${eff}`} />
                              <span style={{ fontSize:12, fontWeight:700, color:"var(--accent)", minWidth:36 }}>{f.countryCode}</span>
                              <span style={{ fontSize:12, color:"var(--text)", flex:1 }}>{trName(f)}</span>
                              <span style={{ fontSize:10, color:"var(--muted)" }}>{lastContact[f.countryCode] || "—"}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ TAKVİM ══ */}
        {view === "takvim" && (() => {
          // Varsayılan etkinlikler — i18n key olarak saklanır (storage independent of language)
          // Render zamanında çevrilir
          const DEFAULT_EVENTS: CalEvent[] = [
            { id:"e_doha",     date:"2026-06-15", label:"__i18n:event_doha",         emoji:"🏆", countries:["QAT","KUW","BRN","UAE","EGY","JOR","OMA","IRQ"], note:"" },
            { id:"e_panam",    date:"2026-07-20", label:"__i18n:event_pan_american", emoji:"🌎", countries:["BRA","ARG","COL","CHI","MEX","PER","VEN","URU"], note:"" },
            { id:"e_africa",   date:"2026-08-10", label:"__i18n:event_africa_cup",   emoji:"🌍", countries:["EGY","MAR","RSA","SEN","NGR","ETH","CMR","GHA"], note:"" },
            { id:"e_asia",     date:"2026-09-05", label:"__i18n:event_asia_champ",   emoji:"🌏", countries:["JPN","CHN","KOR","INA","THA","PHI","IND","MAS"], note:"" },
            { id:"e_europe",   date:"2026-09-25", label:"__i18n:event_europe_champ", emoji:"🇪🇺", countries:["GER","FRA","ITA","ESP","GBR","NED","SUI","BEL"], note:"" },
            { id:"e_congress", date:"2026-10-01", label:"__i18n:event_fig_congress", emoji:"🗳️", countries:[], note:"" },
          ];

          // i18n etiket çözümleyici — "__i18n:key" prefix'i varsa çevir
          const resolveLabel = (label: string): string => label.startsWith("__i18n:") ? t(lang, label.slice(7)) : label;

          const events: CalEvent[] = calendarEvents && calendarEvents.length > 0 ? calendarEvents : [];
          const sortedEvents = [...events].sort((a,b) => a.date.localeCompare(b.date));
          const allFeds = federationSeeds.map((f:any) => ({...f, ...(overrides[f.countryCode]||{})}));

          // CRUD helpers — per-event keyed writes (no map-wide clobber)
          const saveEvent = (e: CalEvent) => {
            set(ref(db, `fig-v3/calendarEvents/${e.id}`), e);
          };
          const removeEvent = (id: string) => {
            remove(ref(db, `fig-v3/calendarEvents/${id}`));
          };
          const seedEvents = (defaultEvents: CalEvent[]) => {
            const obj: Record<string, CalEvent> = {};
            defaultEvents.forEach(e => { obj[e.id] = e; });
            set(ref(db, "fig-v3/calendarEvents"), obj);
          };
          const addEvent = () => {
            const newId = `e_${Date.now()}`;
            const newEvent: CalEvent = { id:newId, date:new Date().toISOString().slice(0,10), label:lang==="tr"?"Yeni Etkinlik":"New Event", emoji:"📅", countries:[], note:"" };
            saveEvent(newEvent);
            setCalEditingId(newId);
            setCalDraft(newEvent);
          };
          const seedDefaults = () => {
            seedEvents(DEFAULT_EVENTS);
          };
          const deleteEvent = (id: string) => {
            if (!confirm(lang === "tr" ? "Bu etkinliği silmek istediğine emin misin?" : "Are you sure you want to delete this event?")) return false;
            removeEvent(id);
            return true;
          };
          const saveDraft = () => {
            if (!calDraft.label.trim()) {
              alert(lang === "tr" ? "Etkinlik adı boş olamaz." : "Event name cannot be empty.");
              return;
            }
            if (!calDraft.date) {
              alert(lang === "tr" ? "Tarih seçmelisin." : "You must select a date.");
              return;
            }
            saveEvent(calDraft);
            setCalEditingId(null);
          };
          const toggleCountry = (eventId: string, code: string) => {
            const ev = events.find(e => e.id === eventId);
            if (!ev) return;
            const has = ev.countries.includes(code);
            const newCountries = has ? ev.countries.filter(c => c !== code) : [...ev.countries, code];
            saveEvent({ ...ev, countries: newCountries });
          };

          return (
            <div className="tab-scroll">
              <div style={{ padding:"24px 20px", maxWidth:1000, margin:"0 auto" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4, flexWrap:"wrap", gap:8 }}>
                  <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text)", margin:0 }}>{t(lang,"campaign_calendar")}</h2>
                  <div style={{ display:"flex", gap:8 }}>
                    {events.length === 0 && (
                      <button type="button" onClick={seedDefaults} style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 12px", fontSize:12, color:"var(--text)", cursor:"pointer", fontWeight:600 }}>
                        {lang === "tr" ? "🌱 Varsayılan etkinlikleri yükle" : "🌱 Load default events"}
                      </button>
                    )}
                    <button type="button" onClick={addEvent} style={{ background:"var(--accent)", color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:700 }}>
                      + {lang === "tr" ? "Etkinlik Ekle" : "Add Event"}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize:13, color:"var(--muted)", marginBottom:20 }}>{t(lang,"calendar_subtitle")}</p>

                {events.length === 0 && (
                  <div style={{ textAlign:"center", padding:"40px 20px", background:"var(--surface)", border:"1px dashed var(--border)", borderRadius:12, color:"var(--muted)" }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>📅</div>
                    <div style={{ fontSize:14 }}>{lang === "tr" ? "Henüz etkinlik yok. Yeni ekleyin veya varsayılanları yükleyin." : "No events yet. Add new or load defaults."}</div>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {sortedEvents.map(ev => {
                    const isEditing = calEditingId === ev.id;
                    const evFeds = ev.countries.map(code => allFeds.find((f:any) => f.countryCode === code)).filter(Boolean) as any[];
                    const persuadable = evFeds.filter((f:any) => (overrides[f.countryCode]?.status||f.status) === "persuadable");
                    const watch = evFeds.filter((f:any) => (overrides[f.countryCode]?.status||f.status) === "watch");
                    const supporters = evFeds.filter((f:any) => (overrides[f.countryCode]?.status||f.status) === "supporter");
                    const daysLeft = Math.max(0, Math.ceil((new Date(ev.date).getTime() - Date.now()) / (1000*60*60*24)));
                    const isPickerOpen = calCountryPicker === ev.id;
                    const searchLower = calCountrySearch.trim().toLowerCase();
                    const pickerList = searchLower
                      ? federationSeeds.filter(f => f.countryCode.toLowerCase().includes(searchLower) || trName(f).toLowerCase().includes(searchLower))
                      : federationSeeds;

                    return (
                      <div key={ev.id} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 18px" }}>
                        {/* Header — Edit mode vs View mode */}
                        {isEditing ? (
                          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
                            <div style={{ display:"flex", gap:8 }}>
                              <input
                                type="text"
                                value={calDraft.emoji}
                                onChange={e => setCalDraft(p => ({...p, emoji: e.target.value}))}
                                placeholder="🏆"
                                style={{ width:60, background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:20, textAlign:"center" }}
                              />
                              <input
                                type="date"
                                value={calDraft.date}
                                onChange={e => setCalDraft(p => ({...p, date: e.target.value}))}
                                style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:13 }}
                              />
                              <input
                                type="text"
                                value={calDraft.label}
                                onChange={e => setCalDraft(p => ({...p, label: e.target.value}))}
                                placeholder={lang === "tr" ? "Etkinlik adı" : "Event name"}
                                style={{ flex:1, background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:13, fontWeight:600 }}
                              />
                            </div>
                            <textarea
                              value={calDraft.note || ""}
                              onChange={e => setCalDraft(p => ({...p, note: e.target.value}))}
                              placeholder={lang === "tr" ? "Not (opsiyonel)..." : "Note (optional)..."}
                              rows={2}
                              style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:12, resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }}
                            />
                            <div style={{ display:"flex", gap:6 }}>
                              <button type="button" onClick={saveDraft} style={{ background:"var(--accent)", color:"#fff", border:"none", borderRadius:6, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                                ✓ {lang === "tr" ? "Kaydet" : "Save"}
                              </button>
                              <button type="button" onClick={() => setCalEditingId(null)} style={{ background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--muted)", borderRadius:6, padding:"6px 14px", fontSize:12, cursor:"pointer" }}>
                                {lang === "tr" ? "İptal" : "Cancel"}
                              </button>
                              <button type="button" onClick={() => { if (deleteEvent(ev.id)) setCalEditingId(null); }} style={{ background:"transparent", border:"1px solid rgba(239,68,68,0.4)", color:"#f87171", borderRadius:6, padding:"6px 14px", fontSize:12, cursor:"pointer", marginLeft:"auto" }}>
                                🗑️ {lang === "tr" ? "Sil" : "Delete"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                            <span style={{ fontSize:22 }}>{ev.emoji}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:15, fontWeight:700, color:"var(--text)" }}>{resolveLabel(ev.label)}</div>
                              <div style={{ fontSize:12, color:"var(--muted)" }}>{ev.date} · {daysLeft > 0 ? `${daysLeft} ${t(lang,"days_left")}` : t(lang,"passed")}</div>
                              {ev.note && <div style={{ fontSize:11, color:"var(--muted)", marginTop:3, fontStyle:"italic" }}>{ev.note}</div>}
                            </div>
                            {ev.countries.length > 0 && (
                              <div style={{ display:"flex", gap:6 }}>
                                {persuadable.length > 0 && <span style={{ fontSize:11, background:"rgba(59,130,246,0.2)", color:"#3b82f6", borderRadius:16, padding:"2px 8px", fontWeight:600 }}>{persuadable.length} {t(lang,"event_persuadable")}</span>}
                                {watch.length > 0 && <span style={{ fontSize:11, background:"rgba(245,158,11,0.2)", color:"#f59e0b", borderRadius:16, padding:"2px 8px", fontWeight:600 }}>{watch.length} {t(lang,"event_watch")}</span>}
                                {supporters.length > 0 && <span style={{ fontSize:11, background:"rgba(16,217,160,0.2)", color:"#10D9A0", borderRadius:16, padding:"2px 8px", fontWeight:600 }}>{supporters.length} {t(lang,"event_supporter")}</span>}
                              </div>
                            )}
                            <button type="button" onClick={() => { setCalEditingId(ev.id); setCalDraft({...ev, label: resolveLabel(ev.label)}); }} className="edit-btn" title={lang === "tr" ? "Düzenle" : "Edit"}>
                              <IcEdit />
                            </button>
                          </div>
                        )}

                        {/* Ülke listesi + Ekle butonu */}
                        {!isEditing && (
                          <div>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                              <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)" }}>
                                {ev.countries.length > 0
                                  ? (persuadable.length > 0 ? t(lang,"meet_these_first") : t(lang,"feds_at_event"))
                                  : (lang === "tr" ? "Hedef ülke eklenmedi" : "No target countries")}
                              </div>
                              <button type="button" onClick={() => { setCalCountryPicker(isPickerOpen ? null : ev.id); setCalCountrySearch(""); }} style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"3px 10px", fontSize:11, color:"var(--accent)", cursor:"pointer", fontWeight:600 }}>
                                {isPickerOpen ? (lang === "tr" ? "✕ Kapat" : "✕ Close") : `+ ${lang === "tr" ? "Ülke" : "Country"}`}
                              </button>
                            </div>
                            {ev.countries.length > 0 && (
                              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                                {[...persuadable, ...watch, ...supporters, ...evFeds.filter(f => !["persuadable","watch","supporter"].includes(overrides[f.countryCode]?.status || f.status))].map((f:any) => {
                                  const eff = overrides[f.countryCode]?.status || f.status;
                                  const statusColors: Record<string,string> = {supporter:"#10D9A0", persuadable:"#3B82F6", watch:"#F59E0B", resistant:"#EF4444"};
                                  return (
                                    <span
                                      key={f.countryCode}
                                      style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:600, color:"#fff", background:statusColors[eff]||"var(--muted)", borderRadius:6, padding:"3px 6px 3px 8px" }}
                                    >
                                      <span onClick={() => openDossier(f.countryCode)} style={{ cursor:"pointer" }}>{f.countryCode}</span>
                                      <button type="button" onClick={() => toggleCountry(ev.id, f.countryCode)} style={{ background:"transparent", border:"none", color:"#fff", cursor:"pointer", padding:"0 2px", fontSize:11, opacity:0.7 }} title={lang === "tr" ? "Kaldır" : "Remove"}>✕</button>
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            {/* Country picker */}
                            {isPickerOpen && (
                              <div style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"10px", marginTop:8 }}>
                                <input
                                  type="text"
                                  value={calCountrySearch}
                                  onChange={e => setCalCountrySearch(e.target.value)}
                                  placeholder={lang === "tr" ? "🔍 Ülke ara…" : "🔍 Search country…"}
                                  style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:6, padding:"5px 10px", color:"var(--text)", fontSize:12, marginBottom:8, boxSizing:"border-box" }}
                                />
                                <div style={{ maxHeight:300, overflowY:"auto", display:"flex", flexWrap:"wrap", gap:4 }}>
                                  {pickerList.map(f => {
                                    const has = ev.countries.includes(f.countryCode);
                                    return (
                                      <button
                                        key={f.countryCode}
                                        type="button"
                                        onClick={() => toggleCountry(ev.id, f.countryCode)}
                                        style={{
                                          background: has ? "var(--accent)" : "var(--surface)",
                                          color: has ? "#fff" : "var(--text)",
                                          border:`1px solid ${has ? "var(--accent)" : "var(--border)"}`,
                                          borderRadius:5, padding:"3px 8px", fontSize:11, cursor:"pointer", fontWeight:600,
                                        }}
                                        title={trName(f)}
                                      >
                                        {has ? "✓ " : ""}{f.countryCode}
                                      </button>
                                    );
                                  })}
                                  {pickerList.length === 0 && (
                                    <div style={{ width:"100%", textAlign:"center", color:"var(--muted)", fontSize:12, padding:"10px" }}>
                                      {lang === "tr" ? "Eşleşme yok" : "No matches"}
                                    </div>
                                  )}
                                </div>
                                <div style={{ fontSize:10, color:"var(--muted)", marginTop:6, textAlign:"center" }}>
                                  {lang === "tr" ? `${pickerList.length} federasyon · Tümünü görmek için kaydır` : `${pickerList.length} federations · Scroll to see all`}
                                </div>
                              </div>
                            )}

                            {ev.countries.length === 0 && !isPickerOpen && ev.id === "e_congress" && (
                              <div style={{ textAlign:"center", padding:"8px", color:"var(--accent)", fontWeight:700 }}>{t(lang,"main_target")}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ KONGRE ŞEHRİ — İstanbul vs Roma ══ */}
        {view === "kongre-şehri" && (() => {
          // Türkçe alfabetik sıralama (ç, ğ, ı, ö, ş, ü dikkate alınır)
          const trCollator = new Intl.Collator(lang === "tr" ? "tr" : "en", { sensitivity: "base" });
          const allFeds = [...federationSeeds].sort((a, b) => trCollator.compare(trName(a), trName(b)));
          const cityOf = (code: string): CityVote => (overrides[code]?.cityVote as CityVote) ?? "bilinmiyor";

          const istanbulList = allFeds.filter(f => cityOf(f.countryCode) === "istanbul");
          const romaList = allFeds.filter(f => cityOf(f.countryCode) === "roma");
          const kararsızList = allFeds.filter(f => cityOf(f.countryCode) === "kararsız");
          const bilinmiyorList = allFeds.filter(f => cityOf(f.countryCode) === "bilinmiyor");

          // Kıta bazlı dağılım
          const continentBreak: Record<string, {istanbul:number, roma:number, kararsız:number, bilinmiyor:number}> = {};
          ["EG","AGU","UAG","PAGU","OGU"].forEach(c => { continentBreak[c] = {istanbul:0, roma:0, kararsız:0, bilinmiyor:0}; });
          allFeds.forEach(f => {
            const c = f.continent;
            if (continentBreak[c]) continentBreak[c][cityOf(f.countryCode)]++;
          });

          const total = allFeds.length;
          const iPct = Math.round((istanbulList.length / total) * 100);
          const rPct = Math.round((romaList.length / total) * 100);
          const kPct = Math.round((kararsızList.length / total) * 100);

          const [filter, setFilter] = [cityFilter, setCityFilter];
          const baseList = filter === "istanbul" ? istanbulList : filter === "roma" ? romaList : filter === "kararsız" ? kararsızList : filter === "bilinmiyor" ? bilinmiyorList : allFeds;
          // Arama filtresi (kod veya isim)
          const searchLower = citySearch.trim().toLowerCase();
          const filteredList = searchLower
            ? baseList.filter(f => f.countryCode.toLowerCase().includes(searchLower) || trName(f).toLowerCase().includes(searchLower))
            : baseList;
          const totalPages = Math.max(1, Math.ceil(filteredList.length / cityPageSize));
          const currentPage = Math.min(cityPage, totalPages);
          const pageStart = (currentPage - 1) * cityPageSize;
          const pageList = filteredList.slice(pageStart, pageStart + cityPageSize);

          return (
            <div className="tab-scroll">
              <div style={{ padding:"24px 20px", maxWidth:1100, margin:"0 auto" }}>
                <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text)", marginBottom:4 }}>{t(lang,"congress_city_title")}</h2>
                <p style={{ fontSize:13, color:"var(--muted)", marginBottom:24 }}>{t(lang,"congress_city_subtitle")}</p>

                {/* Büyük Karşılaştırma Kartı */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:16, alignItems:"stretch", marginBottom:20 }}>
                  {/* İstanbul */}
                  <div style={{ background: istanbulList.length >= romaList.length ? "linear-gradient(135deg, #1a2d2d 0%, #0d2329 100%)" : "var(--surface)", border:`2px solid ${istanbulList.length >= romaList.length ? "#0ea5e9" : "var(--border)"}`, borderRadius:14, padding:"20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                      <span style={{ fontSize:28 }}>🇹🇷</span>
                      <div>
                        <div style={{ fontSize:18, fontWeight:800, color:"#0ea5e9" }}>İstanbul</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"istanbul_candidacy")}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:48, fontWeight:800, color:"#0ea5e9", lineHeight:1 }}>{istanbulList.length}</div>
                    <div style={{ fontSize:13, color:"var(--muted)", marginTop:4 }}>{t(lang,"federations_support")} (%{iPct})</div>
                    <div style={{ marginTop:10, height:8, background:"var(--surface2)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ width:`${iPct}%`, height:"100%", background:"#0ea5e9" }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", fontSize:24, fontWeight:800, color:"var(--muted)" }}>VS</div>
                  {/* Roma */}
                  <div style={{ background: romaList.length > istanbulList.length ? "linear-gradient(135deg, #2d1a1a 0%, #29130d 100%)" : "var(--surface)", border:`2px solid ${romaList.length > istanbulList.length ? "#dc2626" : "var(--border)"}`, borderRadius:14, padding:"20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                      <span style={{ fontSize:28 }}>🇮🇹</span>
                      <div>
                        <div style={{ fontSize:18, fontWeight:800, color:"#dc2626" }}>Roma</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"rome_candidacy")}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:48, fontWeight:800, color:"#dc2626", lineHeight:1 }}>{romaList.length}</div>
                    <div style={{ fontSize:13, color:"var(--muted)", marginTop:4 }}>{t(lang,"federations_support")} (%{rPct})</div>
                    <div style={{ marginTop:10, height:8, background:"var(--surface2)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ width:`${rPct}%`, height:"100%", background:"#dc2626" }} />
                    </div>
                  </div>
                </div>

                {/* Özet Satırı */}
                <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:140, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"undecided")}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:"#f59e0b" }}>{kararsızList.length} <span style={{ fontSize:11, color:"var(--muted)" }}>(%{kPct})</span></div>
                  </div>
                  <div style={{ flex:1, minWidth:140, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"unknown_lbl")}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:"var(--muted)" }}>{bilinmiyorList.length}</div>
                  </div>
                  <div style={{ flex:1, minWidth:140, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{t(lang,"gap")}</div>
                    <div style={{ fontSize:20, fontWeight:800, color: istanbulList.length >= romaList.length ? "#0ea5e9" : "#dc2626" }}>
                      {istanbulList.length >= romaList.length ? "İST" : "ROM"} +{Math.abs(istanbulList.length - romaList.length)}
                    </div>
                  </div>
                </div>

                {/* Kıta Bazlı Tablo */}
                <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:12 }}>{t(lang,"continent_distribution")}</div>
                  {Object.entries(continentBreak).map(([cont, br]) => {
                    const contTotal = br.istanbul + br.roma + br.kararsız + br.bilinmiyor;
                    if (contTotal === 0) return null;
                    return (
                      <div key={cont} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{continentMeta[cont as ContinentCode]?.label || cont}</span>
                          <span style={{ fontSize:11, color:"var(--muted)" }}>İST {br.istanbul} · ROM {br.roma} · Kararsız {br.kararsız} · ? {br.bilinmiyor}</span>
                        </div>
                        <div style={{ display:"flex", height:8, borderRadius:4, overflow:"hidden", background:"var(--surface2)" }}>
                          <div style={{ width:`${(br.istanbul/contTotal)*100}%`, background:"#0ea5e9" }} />
                          <div style={{ width:`${(br.roma/contTotal)*100}%`, background:"#dc2626" }} />
                          <div style={{ width:`${(br.kararsız/contTotal)*100}%`, background:"#f59e0b" }} />
                          <div style={{ width:`${(br.bilinmiyor/contTotal)*100}%`, background:"#475569" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Filtre Sekmeleri */}
                <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
                  {[
                    {val:"all", label:`${t(lang,"all_lbl")} (${total})`, color:"var(--accent)"},
                    {val:"istanbul", label:`🇹🇷 İstanbul (${istanbulList.length})`, color:"#0ea5e9"},
                    {val:"roma", label:`🇮🇹 Roma (${romaList.length})`, color:"#dc2626"},
                    {val:"kararsız", label:`${t(lang,"undecided")} (${kararsızList.length})`, color:"#f59e0b"},
                    {val:"bilinmiyor", label:`${t(lang,"unknown_lbl")} (${bilinmiyorList.length})`, color:"#475569"},
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => { setFilter(opt.val as any); setCityPage(1); }}
                      style={{
                        background: filter === opt.val ? opt.color : "var(--surface2)",
                        color: filter === opt.val ? "#fff" : "var(--muted)",
                        border:`1px solid ${filter === opt.val ? opt.color : "var(--border)"}`,
                        borderRadius:18, padding:"4px 12px", fontSize:11, fontWeight:600, cursor:"pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Arama + Sayfa Boyutu */}
                <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center", flexWrap:"wrap" }}>
                  <input
                    type="text"
                    placeholder={lang === "tr" ? "🔍 Ülke kodu veya adı ara…" : "🔍 Search country code or name…"}
                    value={citySearch}
                    onChange={e => { setCitySearch(e.target.value); setCityPage(1); }}
                    style={{ flex:1, minWidth:200, background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:12 }}
                  />
                  <select
                    value={cityPageSize}
                    onChange={e => { setCityPageSize(Number(e.target.value)); setCityPage(1); }}
                    style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 8px", color:"var(--text)", fontSize:12, cursor:"pointer" }}
                  >
                    <option value={20}>20 / {lang === "tr" ? "sayfa" : "page"}</option>
                    <option value={40}>40 / {lang === "tr" ? "sayfa" : "page"}</option>
                    <option value={80}>80 / {lang === "tr" ? "sayfa" : "page"}</option>
                    <option value={200}>{lang === "tr" ? "Tümü" : "All"}</option>
                  </select>
                </div>

                {/* Ülke Listesi — Hızlı Atama */}
                <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"10px" }}>
                  <div style={{ fontSize:11, color:"var(--muted)", marginBottom:8, padding:"0 4px" }}>
                    {lang === "tr"
                      ? `Toplam ${filteredList.length} federasyon · Sayfa ${currentPage}/${totalPages} (${pageStart + 1}–${Math.min(pageStart + cityPageSize, filteredList.length)})`
                      : `${filteredList.length} federations total · Page ${currentPage}/${totalPages} (${pageStart + 1}–${Math.min(pageStart + cityPageSize, filteredList.length)})`}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:8 }}>
                    {pageList.length === 0 && (
                      <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"30px 10px", color:"var(--muted)", fontSize:13 }}>
                        {lang === "tr" ? "Eşleşen federasyon bulunamadı." : "No matching federations."}
                      </div>
                    )}
                    {pageList.map(f => {
                      const current = cityOf(f.countryCode);
                      const cityColors: Record<CityVote, string> = { istanbul:"#0ea5e9", roma:"#dc2626", kararsız:"#f59e0b", bilinmiyor:"#475569" };
                      return (
                        <div key={f.countryCode} style={{ background:"var(--surface2)", border:`1px solid ${cityColors[current]}40`, borderRadius:8, padding:"8px 10px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                            <span className="flag-emoji">{flagEmoji(f.countryCode)}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:"var(--accent)" }}>{f.countryCode}</span>
                            <span style={{ fontSize:11, color:"var(--text)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{trName(f)}</span>
                            <button type="button" onClick={() => openDossier(f.countryCode)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:11, color:"var(--muted)" }}>↗</button>
                          </div>
                          <div style={{ display:"flex", gap:3 }}>
                            {(["istanbul","roma","kararsız","bilinmiyor"] as CityVote[]).map(v => {
                              const labels: Record<CityVote,string> = { istanbul:"🇹🇷 İST", roma:"🇮🇹 ROM", kararsız:"❓", bilinmiyor:"⚫" };
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setOverride(f.countryCode, { cityVote: v })}
                                  style={{
                                    flex:1,
                                    background: current === v ? cityColors[v] : "var(--surface)",
                                    border: `1px solid ${current === v ? cityColors[v] : "var(--border)"}`,
                                    color: current === v ? "#fff" : "var(--muted)",
                                    borderRadius:5, padding:"3px 4px", fontSize:10, fontWeight:600, cursor:"pointer",
                                  }}
                                >
                                  {labels[v]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:14, flexWrap:"wrap" }}>
                      <button
                        type="button"
                        onClick={() => setCityPage(1)}
                        disabled={currentPage === 1}
                        style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"4px 10px", fontSize:11, color: currentPage === 1 ? "var(--muted)" : "var(--text)", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight:600 }}
                      >
                        « {lang === "tr" ? "İlk" : "First"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCityPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"4px 10px", fontSize:11, color: currentPage === 1 ? "var(--muted)" : "var(--text)", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight:600 }}
                      >
                        ‹ {lang === "tr" ? "Önceki" : "Prev"}
                      </button>
                      {/* Sayfa numara butonları (max 7 görünür) */}
                      {(() => {
                        const pages: (number | "...")[] = [];
                        const maxVisible = 7;
                        if (totalPages <= maxVisible) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          pages.push(1);
                          let start = Math.max(2, currentPage - 2);
                          let end = Math.min(totalPages - 1, currentPage + 2);
                          if (start > 2) pages.push("...");
                          for (let i = start; i <= end; i++) pages.push(i);
                          if (end < totalPages - 1) pages.push("...");
                          pages.push(totalPages);
                        }
                        return pages.map((p, i) => p === "..." ? (
                          <span key={`dot-${i}`} style={{ fontSize:11, color:"var(--muted)", padding:"0 4px" }}>…</span>
                        ) : (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setCityPage(p as number)}
                            style={{
                              background: p === currentPage ? "var(--accent)" : "var(--surface2)",
                              border:`1px solid ${p === currentPage ? "var(--accent)" : "var(--border)"}`,
                              borderRadius:6, padding:"4px 10px", fontSize:11,
                              color: p === currentPage ? "#fff" : "var(--text)",
                              cursor:"pointer", fontWeight:700, minWidth:28,
                            }}
                          >
                            {p}
                          </button>
                        ));
                      })()}
                      <button
                        type="button"
                        onClick={() => setCityPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"4px 10px", fontSize:11, color: currentPage === totalPages ? "var(--muted)" : "var(--text)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontWeight:600 }}
                      >
                        {lang === "tr" ? "Sonraki" : "Next"} ›
                      </button>
                      <button
                        type="button"
                        onClick={() => setCityPage(totalPages)}
                        disabled={currentPage === totalPages}
                        style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"4px 10px", fontSize:11, color: currentPage === totalPages ? "var(--muted)" : "var(--text)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontWeight:600 }}
                      >
                        {lang === "tr" ? "Son" : "Last"} »
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      </main>
    </div>{/* /shell */}

    {/* ── Dossier Sheet — createPortal ile document.body'e eklenir, tüm stacking context dışında ── */}
    {sheet === "dossier" && selected && createPortal(
      <>
        <div className="sheet-backdrop" onClick={() => setSheet(null)} />
        <div className="dossier-sheet">
          <div className="sheet-handle" />

          {/* Header */}
          <div className="ds-header">
            <PresidentAvatar countryCode={selected.countryCode} presidentName={selected.president} size="lg" clickable={true} />
            <div style={{ minWidth:0, flex:1 }}>
              <div className="ds-title"><span className="flag-emoji flag-emoji-lg">{flagEmoji(selected.countryCode)}</span>{trName(selected)} <span className="ds-title-code">{selected.countryCode}</span></div>
              <div className="ds-meta">{selected.president}</div>
              <div className="ds-meta" style={{ opacity: 0.6, fontSize: 11 }}>{continentMeta[selected.continent]?.label} · {selected.federationName}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
              <button
                type="button"
                className="ds-print-btn"
                onClick={() => window.print()}
                title={t(lang,"print_briefing")}
              >
                {t(lang,"print_briefing")}
              </button>
              <button type="button" className="sheet-x" onClick={() => setSheet(null)}><IcX /></button>
            </div>
          </div>

          {/* Status changer */}
          <div className="ds-status-row">
            {(["supporter","persuadable","watch","resistant"] as SupportStatus[]).map(s => (
              <button
                key={s}
                type="button"
                className={`status-chip ${selected.status === s ? "status-chip-active " + STATUS_CSS[s] : ""}`}
                onClick={() => setOverride(selectedCode, { status: s })}
              >
                {t(lang,`status_${s}`)}
              </button>
            ))}
          </div>

          {/* Key metrics */}
          <div className="ds-metrics">
            <div className="ds-metric ds-metric-clickable" onClick={() => setShowScoreInfo(v => !v)}>
              <div className="ds-metric-val">{fmtScore(selected.priorityScore)}</div>
              <div className="ds-metric-key">{t(lang,"priority_score")} <span className="score-info-icon">?</span></div>
            </div>
            <div className="ds-metric">
              <div className="ds-metric-val">{selected.figPowerIndex}</div>
              <div className="ds-metric-key">{t(lang,"fig_power")}</div>
            </div>
            <div className="ds-metric">
              <div className="ds-metric-val">{selected.relationshipStrength}</div>
              <div className="ds-metric-key">{t(lang,"relationship")}</div>
            </div>
            <div className="ds-metric">
              <div className="ds-metric-val">{(selected.figRoles ?? []).length}</div>
              <div className="ds-metric-key">{t(lang,"fig_role")}</div>
            </div>
          </div>

          {/* Operasyonel kimlik chip'leri */}
          <div className="op-chips-row">
            {buildOperationalChips(selected).map((chip, i) => (
              <span key={i} className="op-chip">{chip}</span>
            ))}
          </div>

          {/* Skor açıklaması */}
          {showScoreInfo && (
            <div className="score-info-box">
              <div className="score-info-title">{t(lang,"score_info_title")}</div>
              <div className="score-info-formula">{t(lang,"score_info_formula")}</div>
              <div className="score-info-rows">
                <div className="score-info-row"><span>{t(lang,"status_supporter")}</span><b>18</b></div>
                <div className="score-info-row"><span>{t(lang,"status_watch")}</span><b>50</b></div>
                <div className="score-info-row"><span>{t(lang,"status_persuadable")}</span><b>84</b></div>
                <div className="score-info-row"><span>{t(lang,"status_resistant")}</span><b>12</b></div>
                <div className="score-info-row"><span>{lang === "tr" ? "Gelişim ihtiyacı" : "Development need"}</span><b>+18</b></div>
                <div className="score-info-row"><span>{lang === "tr" ? "Finansman ihtiyacı" : "Funding need"}</span><b>+17</b></div>
                <div className="score-info-row"><span>{lang === "tr" ? "Yönetişim ihtiyacı" : "Governance need"}</span><b>+15</b></div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="ds-tabs">
            {(["genel","mesaj","iletisim","branşlar","istihbarat"] as DossierTab[]).map(tab => {
              const tabLabels: Record<DossierTab,string> = {
                genel: t(lang,"tab_strategy"),
                mesaj: lang === "tr" ? "Mesaj" : "Message",
                iletisim: t(lang,"tab_contact"),
                "branşlar": t(lang,"tab_disciplines"),
                istihbarat: t(lang,"tab_intelligence")
              };
              return (
                <button key={tab} type="button" className={`ds-tab-btn ${dossierTab===tab?"active":""}`} onClick={() => setDossierTab(tab)}>
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>

          <div className="ds-scroll">
            {/* ── STRATEJİ ── */}
            {dossierTab === "genel" && (
              <>
                <div className="ds-block">
                  <div className="ds-block-label">{t(lang,"what_want")}</div>
                  <div className="ds-block-val">{primaryNeedLabel(selected.primaryNeed)}</div>
                </div>

                <EditableBlock
                  label={t(lang,"strategic_assess")}
                  value={getAssessment(selected)}
                  onSave={v => setOverride(selectedCode, { assessment: v })}
                />

                {getEntryChannel(selected) && (
                  <EditableBlock
                    label={t(lang,"entry_channel")}
                    value={getEntryChannel(selected)}
                    onSave={v => setOverride(selectedCode, { entryChannel: v })}
                  />
                )}

                {getRedLine(selected) && (
                  <EditableBlock
                    label={t(lang,"red_line")}
                    value={getRedLine(selected)}
                    onSave={v => setOverride(selectedCode, { redLine: v })}
                    warn
                  />
                )}

                {/* Notes in strategy tab */}
                <div className="ds-notes-header">
                  <span className="ds-block-label">{t(lang,"notes_lbl")} {countryNotes.length > 0 && <span className="note-count">{countryNotes.length}</span>}</span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button type="button" className="ds-notes-add-btn" onClick={() => setShowNoteForm(v => !v)}>
                      <IcPlus /> {t(lang,"add_note")}
                    </button>
                    <button type="button" className="ds-notes-all-btn" onClick={() => { setNoteReturnCode(selectedCode); setSheet(null); setView("notes"); }}>
                      {t(lang,"all_notes")}
                    </button>
                  </div>
                </div>
                {showNoteForm && (
                  <form className="note-form" onSubmit={e => { addNote(e); setShowNoteForm(false); }}>
                    <input className="note-input" placeholder={t(lang,"note_title_ph")} value={noteTitle} onChange={e => setNoteTitle(e.target.value)} required />
                    <textarea className="note-textarea" placeholder={t(lang,"note_body_ph")} rows={3} value={noteBody} onChange={e => setNoteBody(e.target.value)} required />
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="note-submit" type="submit">{t(lang,"save")}</button>
                      <button className="note-cancel" type="button" onClick={() => { setShowNoteForm(false); setNoteTitle(""); setNoteBody(""); }}>{t(lang,"cancel")}</button>
                    </div>
                  </form>
                )}
                {countryNotes.map(n => (
                  <div key={n.id} className={`note-card ${n.completed ? "note-card-done" : ""}`} style={{ marginTop: 8 }}>
                    <div className="note-card-header">
                      <button type="button" className="note-complete-btn" onClick={() => toggleNoteComplete(n.id, !n.completed)}>
                        <IcCheckCircle done={n.completed} />
                      </button>
                      <span className={`note-card-title ${n.completed ? "note-title-done" : ""}`}>{n.title}</span>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center", marginLeft:"auto" }}>
                        <span className="note-card-date">{n.date}</span>
                        <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                      </div>
                    </div>
                    {!n.completed && <div className="note-card-body">{n.body}</div>}
                  </div>
                ))}

                {/* Karar Mimarisi */}
                {(selected.decisionArchitecture ?? []).length > 0 && (
                  <div className="ds-block">
                    <div className="ds-block-label">🏛️ {lang === "tr" ? "Karar Mimarisi" : "Decision Architecture"}</div>
                    {selected.decisionArchitecture.map((d, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">▸</span>
                        <span className="msg-text">{translateStrategicText(d)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strateji Adımları */}
                <div className="ds-block">
                  <div className="ds-block-label">⚡ {lang === "tr" ? "Taktik Adımlar" : "Strategic Moves"}</div>
                  {buildStrategicMoves(selected).map((move, i) => (
                    <div key={i} className="strat-move-row">
                      <span className="strat-move-num">{i + 1}</span>
                      <span className="strat-move-text">{move}</span>
                    </div>
                  ))}
                </div>

                {/* Strateji Yolu */}
                {(selected.strategyPath ?? []).length > 0 && (
                  <div className="ds-block">
                    <div className="ds-block-label">🗺️ {lang === "tr" ? "Strateji Yolu" : "Strategy Path"}</div>
                    {selected.strategyPath.map((s, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">→</span>
                        <span className="msg-text">{translateStrategicText(s)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Yol haritası */}
                <div className="ds-block" style={{ marginTop: 16 }}>
                  <div className="ds-block-label">{lang === "tr" ? "6 Aylık Eylem Planı" : "6-Month Action Plan"}</div>
                  <div className="roadmap-timeline">
                    {roadmap.map((step, i) => (
                      <div key={i} className="roadmap-step">
                        <div className="roadmap-month">{step.month}</div>
                        <div className="roadmap-body">
                          <div className="roadmap-focus">{step.focus}</div>
                          <div className="roadmap-objective">{step.objective}</div>
                          <div className="roadmap-deliverable">→ {step.deliverable}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status History */}
                {statusHistory[selected?.countryCode]?.length > 0 && (
                  <div style={{ marginTop:16, background:"var(--surface2,#1a2533)", borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"status_history")}</div>
                    {statusHistory[selected.countryCode].slice().reverse().map((h, i) => (
                      <div key={i} className="status-history-row">
                        <span style={{ fontSize:11, color:"var(--muted)" }}>{h.date}</span>
                        <span style={{ fontSize:11, color:"var(--text)" }}>{h.from} → {h.to}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Country Dashboard Metrics */}
                {(() => {
                  const metrics = buildCountryDashboard(selected);
                  return metrics.length > 0 ? (
                    <div style={{ marginTop:16 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"strategic_metrics")}</div>
                      <div className="country-dashboard-grid">
                        {metrics.map((m, i) => (
                          <div key={i} className="country-metric-card">
                            <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{m.label}</div>
                            <div style={{ fontSize:16, fontWeight:700, color:"var(--accent)" }}>{m.score}</div>
                            <div style={{ fontSize:10, color:"var(--text)", marginTop:2 }}>{m.value}</div>
                            <div style={{ marginTop:4, height:3, borderRadius:2, background:"var(--border)" }}>
                              <div style={{ width:`${m.score}%`, height:"100%", background:"var(--accent)", borderRadius:2 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Facility Narrative */}
                {(() => {
                  const narrative = buildFacilityNarrative(selected);
                  return narrative ? (
                    <div style={{ marginTop:12, padding:"8px 12px", background:"var(--surface2,#1a2533)", borderRadius:8 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:4, letterSpacing:"0.05em" }}>{t(lang,"facilities_org")}</div>
                      <p style={{ fontSize:12, color:"var(--text)", margin:0, lineHeight:1.6 }}>{narrative}</p>
                    </div>
                  ) : null;
                })()}

                {/* Role Digest */}
                {(() => {
                  const roles = buildRoleDigest(selected);
                  return roles.length > 0 ? (
                    <div style={{ marginTop:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"fig_roles_title")}</div>
                      {roles.map((r, i) => (
                        <div key={i} className="role-digest-row">
                          <div style={{ fontWeight:600, fontSize:12, color:"var(--accent)" }}>{r.title}</div>
                          <div style={{ fontSize:11, color:"var(--text)", marginTop:2 }}>{r.body}</div>
                          {r.meta && <div style={{ fontSize:10, color:"var(--muted)", marginTop:1 }}>{r.meta}</div>}
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
              </>
            )}

            {/* ── MESAJ REHBERİ ── */}
            {dossierTab === "mesaj" && (
              <>
                {/* WhatsApp Şablon */}
                <div style={{ background:"#1a2d1a", border:"1px solid #2d5a2d", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#4ade80" }}>{t(lang,"whatsapp_draft")}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const text = buildWhatsAppTemplate(selected);
                        navigator.clipboard.writeText(text).then(() => {
                          setMsgCopied(true);
                          setTimeout(() => setMsgCopied(false), 2500);
                        });
                      }}
                      style={{ background: msgCopied ? "#166534" : "#15803d", color:"#fff", border:"none", borderRadius:6, padding:"4px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}
                    >
                      {msgCopied ? t(lang,"copied_btn") : t(lang,"copy_btn")}
                    </button>
                  </div>
                  <pre style={{ fontSize:11, color:"#86efac", margin:0, whiteSpace:"pre-wrap", lineHeight:1.6, fontFamily:"inherit" }}>
                    {buildWhatsAppTemplate(selected)}
                  </pre>
                </div>

                {/* Ana Mesajlar */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">💬 {lang === "tr" ? "Ana Mesajlar" : "Key Messages"}</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("messaging"); setContentDraft(getContent(selectedCode,"messaging").join("\n")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "messaging" ? (
                    <>
                      <textarea className="edit-textarea" rows={6} value={contentDraft} onChange={e => setContentDraft(e.target.value)} autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"messaging",contentDraft.split("\n")); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getContent(selectedCode,"messaging").map((m, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">•</span>
                        <span className="msg-text">{translateStrategicText(m)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* İkna Argümanları */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">🎯 {lang === "tr" ? "İkna Argümanları" : "Persuasion Payload"}</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("persuasionPayload"); setContentDraft(getContent(selectedCode,"persuasionPayload").join("\n")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "persuasionPayload" ? (
                    <>
                      <textarea className="edit-textarea" rows={6} value={contentDraft} onChange={e => setContentDraft(e.target.value)} autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"persuasionPayload",contentDraft.split("\n")); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getContent(selectedCode,"persuasionPayload").map((p, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">▸</span>
                        <span className="msg-text">{translateStrategicText(p)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Kongre Senaryosu */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">⚖️ {lang === "tr" ? "Kongre Senaryosu" : "Congress Scenario"}</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("congressScenario"); setContentDraft(getContent(selectedCode,"congressScenario").join("\n")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "congressScenario" ? (
                    <>
                      <textarea className="edit-textarea" rows={6} value={contentDraft} onChange={e => setContentDraft(e.target.value)} autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"congressScenario",contentDraft.split("\n")); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getContent(selectedCode,"congressScenario").map((c, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">◈</span>
                        <span className="msg-text">{translateStrategicText(c)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Aylık Kancalar */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">📅 {lang === "tr" ? "Aylık Temas Noktaları" : "Monthly Hooks"}</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("monthlyHooks"); setContentDraft(getContent(selectedCode,"monthlyHooks").join("\n")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "monthlyHooks" ? (
                    <>
                      <textarea className="edit-textarea" rows={6} value={contentDraft} onChange={e => setContentDraft(e.target.value)} autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"monthlyHooks",contentDraft.split("\n")); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getContent(selectedCode,"monthlyHooks").map((h, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">📌</span>
                        <span className="msg-text">{translateStrategicText(h)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Kaçınılacak Konular */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">🚫 {lang === "tr" ? "Kaçınılacak Konular" : "Red Lines"}</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("redLines"); setContentDraft(getContent(selectedCode,"redLines").join("\n")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "redLines" ? (
                    <>
                      <textarea className="edit-textarea" rows={6} value={contentDraft} onChange={e => setContentDraft(e.target.value)} autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"redLines",contentDraft.split("\n")); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getContent(selectedCode,"redLines").map((r, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet" style={{ color: "var(--red)" }}>✕</span>
                        <span className="msg-text" style={{ color: "var(--red)" }}>{translateStrategicText(r)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Sunum Kartları (visualDeck) */}
                {(selected.visualDeck ?? []).length > 0 && (
                  <div className="ds-block">
                    <div className="ds-block-label">📊 {lang === "tr" ? "Sunum Kartları" : "Visual Deck"}</div>
                    <div className="vdeck-grid">
                      {selected.visualDeck.map((card, i) => (
                        <div key={i} className={`vdeck-card vdeck-${card.tone}`}>
                          <div className="vdeck-metric">{card.metric}</div>
                          <div className="vdeck-title">{card.title}</div>
                          <div className="vdeck-caption">{card.caption}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beklentiler */}
                {(selected.expectations ?? []).length > 0 && (
                  <div className="ds-block">
                    <div className="ds-block-label">📋 {lang === "tr" ? "Beklentiler" : "Expectations"}</div>
                    {selected.expectations.map((ex, i) => (
                      <div key={i} className="msg-item">
                        <span className="msg-bullet">•</span>
                        <span className="msg-text">{translateStrategicText(ex)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mesaj Çerçevesi */}
                <div className="ds-block">
                  <div className="ds-block-label">🗣️ {lang === "tr" ? "Mesaj Çerçevesi" : "Message Framework"}</div>
                  {buildMessageBullets(selected).map((b, i) => (
                    <div key={i} className="msg-item">
                      <span className="msg-bullet">◈</span>
                      <span className="msg-text">{b}</span>
                    </div>
                  ))}
                </div>

                {/* Kanıt Maddeleri */}
                <div className="ds-block">
                  <div className="ds-block-label">✅ {lang === "tr" ? "Kanıt Noktaları" : "Proof Points"}</div>
                  {buildProofBullets(selected).map((b, i) => (
                    <div key={i} className="msg-item">
                      <span className="msg-bullet">▸</span>
                      <span className="msg-text">{b}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── İLETİŞİM ── */}
            {dossierTab === "iletisim" && (
              <>
                {/* Başkan Fotoğraf Kartı */}
                <div className="president-card">
                  <div className="president-avatar-wrap">
                    <PresidentAvatar countryCode={selected.countryCode} presidentName={selected.president} size="xl" photoOverride={photoOverrides[selected.countryCode]} />
                    <button
                      type="button"
                      className="photo-edit-btn"
                      title={t(lang,"edit_photo")}
                      onClick={() => {
                        setPhotoEditCode(selected.countryCode);
                        setPhotoEditUrl(photoOverrides[selected.countryCode] ?? "");
                      }}
                    >
                      <IcCamera />
                    </button>
                  </div>
                  <div className="president-card-info">
                    <div className="president-card-role">{t(lang,"president_role")}</div>
                    <div className="president-card-name">{selected.president}</div>
                    {PHOTO_SOURCE[selected.countryCode] && (
                      <a
                        className="president-card-source"
                        href={PHOTO_SOURCE[selected.countryCode].url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        🔗 {PHOTO_SOURCE[selected.countryCode].site}
                      </a>
                    )}
                  </div>
                </div>

                {/* Photo URL inline editor */}
                {photoEditCode === selected.countryCode && (
                  <div className="photo-edit-block">
                    <input
                      className="photo-edit-input"
                      type="url"
                      placeholder={t(lang,"edit_photo")}
                      value={photoEditUrl}
                      onChange={e => setPhotoEditUrl(e.target.value)}
                      autoFocus
                    />
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
                      <label className="file-upload-btn" style={{ cursor:"pointer" }}>
                        📁 Bilgisayardan Seç
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display:"none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              setPhotoEditUrl(dataUrl);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:8 }}>
                      <button type="button" className="note-submit" onClick={() => savePhotoOverride(selected.countryCode, photoEditUrl)}>{t(lang,"photo_save")}</button>
                      <button type="button" className="note-cancel" onClick={() => { setPhotoEditCode(null); setPhotoEditUrl(""); }}>{t(lang,"photo_cancel")}</button>
                    </div>
                  </div>
                )}

                {/* Başkan kişisel telefonu */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">{t(lang,"pres_phone_lbl")}</span>
                    <button type="button" className="edit-btn" onClick={() => {
                      setPhoneEditCode(selected.countryCode);
                      setPhoneEditVal(overrides[selected.countryCode]?.presidentPhone ?? "");
                    }}><IcEdit /></button>
                  </div>
                  {phoneEditCode === selected.countryCode ? (
                    <div>
                      <input
                        className="photo-edit-input"
                        type="tel"
                        placeholder={t(lang,"phone_placeholder")}
                        value={phoneEditVal}
                        onChange={e => setPhoneEditVal(e.target.value)}
                        autoFocus
                      />
                      <div style={{ display:"flex", gap:8, marginTop:8 }}>
                        <button type="button" className="note-submit" onClick={() => {
                          setOverride(selected.countryCode, { presidentPhone: phoneEditVal.trim() });
                          setPhoneEditCode(null);
                        }}>{t(lang,"save")}</button>
                        <button type="button" className="note-cancel" onClick={() => setPhoneEditCode(null)}>{t(lang,"cancel")}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="president-phone-row">
                      {overrides[selected.countryCode]?.presidentPhone ? (
                        <>
                          <span className="contact-main">{overrides[selected.countryCode].presidentPhone}</span>
                          <a
                            className="whatsapp-btn"
                            href={`https://wa.me/${(overrides[selected.countryCode].presidentPhone ?? "").replace(/\D/g,"")}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            <IcWhatsApp /> {t(lang,"whatsapp_btn")}
                          </a>
                        </>
                      ) : (
                        <span className="contact-empty">—</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="ds-block">
                  <div className="ds-block-label">{t(lang,"federation_name")}</div>
                  <div className="ds-block-val" style={{ fontSize: 14 }}>{selectedDir?.federationName ?? selected.federationName}</div>
                </div>

                {selectedDir?.secretaryGeneral && (
                  <div className="ds-block">
                    <div className="ds-block-label">{t(lang,"sec_general")}</div>
                    <div className="contact-row">
                      <div className="contact-main">{selectedDir.secretaryGeneral}</div>
                    </div>
                  </div>
                )}

                {/* Genel Sekreter kişisel telefonu */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">{t(lang,"sec_phone_lbl")}</span>
                    <button type="button" className="edit-btn" onClick={() => {
                      setSecPhoneEditCode(selected.countryCode);
                      setSecPhoneEditVal(overrides[selected.countryCode]?.secretaryPhone ?? "");
                    }}><IcEdit /></button>
                  </div>
                  {secPhoneEditCode === selected.countryCode ? (
                    <div>
                      <input
                        className="photo-edit-input"
                        type="tel"
                        placeholder={t(lang,"phone_placeholder")}
                        value={secPhoneEditVal}
                        onChange={e => setSecPhoneEditVal(e.target.value)}
                        autoFocus
                      />
                      <div style={{ display:"flex", gap:8, marginTop:8 }}>
                        <button type="button" className="note-submit" onClick={() => {
                          setOverride(selected.countryCode, { secretaryPhone: secPhoneEditVal.trim() });
                          setSecPhoneEditCode(null);
                        }}>{t(lang,"save")}</button>
                        <button type="button" className="note-cancel" onClick={() => setSecPhoneEditCode(null)}>{t(lang,"cancel")}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="president-phone-row">
                      {overrides[selected.countryCode]?.secretaryPhone ? (
                        <>
                          <span className="contact-main">{overrides[selected.countryCode].secretaryPhone}</span>
                          <a
                            className="whatsapp-btn"
                            href={`https://wa.me/${(overrides[selected.countryCode].secretaryPhone ?? "").replace(/\D/g,"")}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            <IcWhatsApp /> {t(lang,"whatsapp_btn")}
                          </a>
                        </>
                      ) : (
                        <span className="contact-empty">—</span>
                      )}
                    </div>
                  )}
                </div>

                {selectedDir?.email && (
                  <div className="ds-block">
                    <div className="ds-block-label">{t(lang,"email_lbl")}</div>
                    <div className="contact-row">
                      <div className="contact-main contact-link">{selectedDir.email}</div>
                    </div>
                  </div>
                )}

                {selectedDir?.phone && (
                  <div className="ds-block">
                    <div className="ds-block-label">{t(lang,"phone_lbl")}</div>
                    <div className="contact-main">{selectedDir.phone}</div>
                  </div>
                )}

                {selectedDir?.website && (
                  <div className="ds-block">
                    <div className="ds-block-label">{t(lang,"website_lbl")}</div>
                    <div className="contact-main contact-link">{selectedDir.website}</div>
                  </div>
                )}

                {(selectedDir?.addressLine1 || selectedDir?.city) && (
                  <div className="ds-block">
                    <div className="ds-block-label">{t(lang,"address_lbl")}</div>
                    <div className="ds-block-text">
                      {[selectedDir?.addressLine1, selectedDir?.addressLine2, selectedDir?.city, selectedDir?.country].filter(Boolean).join(", ")}
                    </div>
                  </div>
                )}

                {selectedDir?.disciplines && selectedDir.disciplines.length > 0 && (
                  <div className="ds-block">
                    <div className="ds-block-label">{t(lang,"disciplines_lbl")}</div>
                    <div className="discipline-chips">
                      {selectedDir.disciplines.map(d => (
                        <span key={d} className="discipline-chip">{d}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* FEATURE 1: Taahhüt Seviyesi */}
                <div className="ds-block">
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"commitment_level")}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
                    {[
                      {level:1, label:t(lang,"commit_no_contact"), color:"#475569"},
                      {level:2, label:t(lang,"commit_introduced"), color:"#ca8a04"},
                      {level:3, label:t(lang,"commit_interested"), color:"#ea580c"},
                      {level:4, label:t(lang,"commit_verbal_yes"), color:"#16a34a"},
                      {level:5, label:t(lang,"commit_firm_yes"), color:"#0d9488"},
                      {level:6, label:t(lang,"commit_written"), color:"#7c3aed"},
                    ].map(({level, label, color}) => {
                      const current = (overrides[selected.countryCode]?.commitmentLevel as number|undefined) ?? 1;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setOverride(selected.countryCode, { commitmentLevel: level })}
                          style={{
                            background: current === level ? color : "var(--surface2)",
                            border: `2px solid ${current === level ? color : "var(--border)"}`,
                            borderRadius:8,
                            padding:"8px 4px",
                            cursor:"pointer",
                            textAlign:"center",
                          }}
                        >
                          <div style={{ fontSize:16, marginBottom:2 }}>
                            {(["🔵","🟡","🟠","🟢","✅","🏆"] as const)[level-1]}
                          </div>
                          <div style={{ fontSize:9, color: current === level ? "#fff" : "var(--muted)", fontWeight:600, lineHeight:1.2 }}>{label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FEATURE 2: Kongre Katılımı */}
                <div className="ds-block">
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"congress_attendance")}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {[
                      {val:"confirmed", label:t(lang,"att_confirmed"), icon:"✈️", color:"#16a34a"},
                      {val:"likely", label:t(lang,"att_likely"), icon:"🟢", color:"#0d9488"},
                      {val:"uncertain", label:t(lang,"att_uncertain"), icon:"❓", color:"#ca8a04"},
                      {val:"no", label:t(lang,"att_no"), icon:"✗", color:"#dc2626"},
                      {val:"unknown", label:t(lang,"att_unknown"), icon:"—", color:"#475569"},
                    ].map(({val, label, icon, color}) => {
                      const current = (overrides[selected.countryCode]?.congressAttendance as string|undefined) ?? "unknown";
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setOverride(selected.countryCode, { congressAttendance: val })}
                          style={{
                            background: current === val ? color : "var(--surface2)",
                            border:`2px solid ${current === val ? color : "var(--border)"}`,
                            borderRadius:6, padding:"6px 10px", cursor:"pointer",
                            fontSize:11, fontWeight:600,
                            color: current === val ? "#fff" : "var(--muted)",
                          }}
                        >
                          {icon} {label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop:8 }}>
                    <input
                      placeholder={t(lang,"attendance_note_ph")}
                      value={(overrides[selected.countryCode]?.attendanceNote as string|undefined) ?? ""}
                      onChange={e => setOverride(selected.countryCode, { attendanceNote: e.target.value })}
                      style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 8px", color:"var(--text)", fontSize:12, boxSizing:"border-box" }}
                    />
                  </div>
                </div>

                {/* ── KONGRE ŞEHRİ TERCİHİ — İstanbul vs Roma ── */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:8, letterSpacing:"0.05em" }}>{t(lang,"host_city_preference")}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                    {[
                      {val:"istanbul" as CityVote, label:"🇹🇷 İstanbul", color:"#0ea5e9"},
                      {val:"roma" as CityVote, label:"🇮🇹 Roma", color:"#dc2626"},
                      {val:"kararsız" as CityVote, label:t(lang,"undecided"), color:"#f59e0b"},
                      {val:"bilinmiyor" as CityVote, label:t(lang,"unknown_lbl"), color:"#475569"},
                    ].map(({val, label, color}) => {
                      const current = (overrides[selected.countryCode]?.cityVote as CityVote|undefined) ?? "bilinmiyor";
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setOverride(selected.countryCode, { cityVote: val })}
                          style={{
                            background: current === val ? color : "var(--surface2)",
                            border:`2px solid ${current === val ? color : "var(--border)"}`,
                            borderRadius:8, padding:"8px 4px", cursor:"pointer",
                            fontSize:11, fontWeight:600,
                            color: current === val ? "#fff" : "var(--muted)",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop:8 }}>
                    <input
                      placeholder={t(lang,"city_vote_note_ph")}
                      value={(overrides[selected.countryCode]?.cityVoteNote as string|undefined) ?? ""}
                      onChange={e => setOverride(selected.countryCode, { cityVoteNote: e.target.value })}
                      style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:6, padding:"6px 8px", color:"var(--text)", fontSize:12, boxSizing:"border-box" }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── BRANŞLAR ── */}
            {dossierTab === "branşlar" && (() => {
              const disciplines = selectedDir?.disciplines ?? [];
              const athletes = athletesByCode[selectedCode] ?? [];
              if (disciplines.length === 0 && athletes.length === 0) {
                return <div className="empty-state">Bu federasyon için branş verisi bulunamadı.</div>;
              }
              return (
                <>
                  {/* Athlete Narrative */}
                  {(() => {
                    const narrative = buildAthleteNarrative(selected);
                    return narrative ? (
                      <div style={{ marginBottom:16, padding:"8px 12px", background:"var(--surface2,#1a2533)", borderRadius:8 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:4, letterSpacing:"0.05em" }}>{t(lang,"athlete_capacity_title")}</div>
                        <p style={{ fontSize:12, color:"var(--text)", margin:0, lineHeight:1.6 }}>{narrative}</p>
                      </div>
                    ) : null;
                  })()}
                  {disciplines.map(disc => {
                    const discInfo = DISCIPLINE_TR[disc];
                    const highlights = getHighlightsForDiscipline(selected, disc);
                    const discAthletes = athletes.filter(a => a.discipline === disc);
                    return (
                      <div key={disc} className="discipline-section">
                        <div className="discipline-section-header" style={{ borderLeftColor: discInfo?.color ?? "var(--blue)" }}>
                          <span className="discipline-section-code" style={{ color: discInfo?.color ?? "var(--blue)" }}>{disc}</span>
                          <span className="discipline-section-label">{discInfo?.label ?? disc}</span>
                        </div>

                        {/* Sporcular */}
                        {discAthletes.length > 0 && (
                          <div className="athlete-list">
                            {discAthletes.map((a, i) => (
                              <div key={i} className="athlete-card">
                                <div className="athlete-card-top">
                                  <span className="athlete-name">{a.name}</span>
                                  {a.active === false && <span className="athlete-retired">Emekli</span>}
                                  {a.active === true && <span className="athlete-active">Aktif</span>}
                                </div>
                                <ul className="athlete-highlights">
                                  {a.highlights.map((h, j) => (
                                    <li key={j}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Genel başarı metinleri */}
                        {highlights.length > 0 && (
                          <div className="discipline-highlights">
                            {highlights.slice(0, 3).map((h, i) => (
                              <div key={i} className="achievement-row">
                                <span className="achievement-bullet">▸</span>
                                <span className="achievement-text">{translateStrategicText(h)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {discAthletes.length === 0 && highlights.length === 0 && (
                          <div className="discipline-empty">Kayıtlı sporcu/başarı verisi yok</div>
                        )}

                        {/* Saha Notu */}
                        <DisciplineNoteEditor
                          note={disciplineNotes[selected.countryCode]?.[disc] ?? ""}
                          onSave={(v) => saveDisciplineNote(selected.countryCode, disc, v)}
                        />
                      </div>
                    );
                  })}

                  {/* Branşı listelenemeyen sporcular (tüm branş listenin dışı) */}
                  {athletes.filter(a => !disciplines.includes(a.discipline)).length > 0 && (
                    <div className="discipline-section">
                      <div className="discipline-section-header" style={{ borderLeftColor: "var(--muted)" }}>
                        <span className="discipline-section-label" style={{ color:"var(--muted)" }}>Diğer Branşlar</span>
                      </div>
                      <div className="athlete-list">
                        {athletes.filter(a => !disciplines.includes(a.discipline)).map((a, i) => (
                          <div key={i} className="athlete-card">
                            <div className="athlete-card-top">
                              <span className="athlete-name">{a.name}</span>
                              <span className="athlete-disc" style={{ color: DISCIPLINE_TR[a.discipline]?.color ?? "var(--muted)" }}>
                                {DISCIPLINE_TR[a.discipline]?.label ?? a.discipline}
                              </span>
                            </div>
                            <ul className="athlete-highlights">
                              {a.highlights.map((h, j) => <li key={j}>{h}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* ── İSTİHBARAT ── */}
            {dossierTab === "istihbarat" && (
              <>
                {/* Veri kalitesi */}
                <div className="ds-block">
                  <div className="ds-block-label">Veri Kalitesi</div>
                  <span className={`badge badge-lg ${
                    selected.researchStatus === "verified" ? "badge-green" :
                    selected.researchStatus === "mixed" ? "badge-amber" : "badge-blue"
                  }`}>
                    {selected.researchStatus === "verified" ? "Doğrulanmış" :
                     selected.researchStatus === "mixed" ? "Kısmen Doğrulanmış" : "Taslak Veri"}
                  </span>
                </div>

                {/* Araştırma Görevleri */}
                {(selected.researchTasks as unknown as Array<{ priority: string; task: string }> | undefined)?.length ? (
                  <div className="ds-block">
                    <div className="ds-block-label">Açık Araştırma Görevleri</div>
                    {(selected.researchTasks as unknown as Array<{ priority: string; task: string }>).map((t, i) => (
                      <div key={i} className="research-task-row">
                        <span className={`task-priority task-${t.priority?.toLowerCase() ?? "medium"}`}>
                          {t.priority === "high" ? "Yüksek" : t.priority === "low" ? "Düşük" : "Orta"}
                        </span>
                        <span className="task-label">{t.task}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Temas Geçmişi — Firebase */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">{lang === "tr" ? "Temas Geçmişi" : "Contact History"} {selectedContactLogs.length > 0 && <span className="note-count">{selectedContactLogs.length}</span>}</span>
                    <button type="button" className="ds-notes-add-btn" onClick={() => setShowContactForm(v => !v)}>
                      <IcPlus /> {lang === "tr" ? "Temas Ekle" : "Add Contact"}
                    </button>
                  </div>

                  {showContactForm && (
                    <form className="contact-log-form" onSubmit={saveContactLog}>
                      <div className="promise-form-grid">
                        <div className="promise-form-field">
                          <label className="promise-form-label">{lang === "tr" ? "Tarih" : "Date"}</label>
                          <input type="date" className="promise-input" value={contactDate} onChange={e => setContactDate(e.target.value)} />
                        </div>
                        <div className="promise-form-field">
                          <label className="promise-form-label">{lang === "tr" ? "Kanal" : "Channel"}</label>
                          <select className="promise-select" value={contactChannel} onChange={e => setContactChannel(e.target.value as ContactLogEntry["channel"])}>
                            <option value="call">{lang === "tr" ? "Telefon" : "Phone Call"}</option>
                            <option value="email">E-posta</option>
                            <option value="visit">{lang === "tr" ? "Yüz yüze" : "In Person"}</option>
                            <option value="desk">{lang === "tr" ? "Masa / Not" : "Desk / Note"}</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        className="note-textarea"
                        placeholder={lang === "tr" ? "Görüşme özeti…" : "Meeting summary…"}
                        value={contactSummary}
                        onChange={e => setContactSummary(e.target.value)}
                        rows={3}
                        required
                      />
                      <input
                        className="note-input"
                        placeholder={lang === "tr" ? "Sonraki adım…" : "Next step…"}
                        value={contactNextStep}
                        onChange={e => setContactNextStep(e.target.value)}
                      />
                      {/* FEATURE 4: Objection tags */}
                      <div style={{ marginTop:6 }}>
                        <div style={{ fontSize:11, color:"var(--muted)", marginBottom:4 }}>{t(lang,"objection_types_label")}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {[
                            {key:"Rakibi tercih ediyor", label:t(lang,"obj_prefer_competitor")},
                            {key:"Kaynak sorunu", label:t(lang,"obj_resource_issue")},
                            {key:"Bilgi eksikliği", label:t(lang,"obj_info_gap")},
                            {key:"Politik baskı", label:t(lang,"obj_political_pressure")},
                            {key:"Kişisel ilişki yok", label:t(lang,"obj_no_personal_rel")},
                            {key:"Kurumsal hafıza", label:t(lang,"obj_institutional_memory")},
                            {key:"Diğer", label:t(lang,"obj_other")},
                          ].map(({key:obj, label:objLabel}) => (
                            <button
                              key={obj}
                              type="button"
                              onClick={() => setContactObjections(prev =>
                                prev.includes(obj) ? prev.filter(o => o !== obj) : [...prev, obj]
                              )}
                              style={{
                                background: contactObjections.includes(obj) ? "rgba(59,130,246,0.3)" : "var(--surface2)",
                                border:`1px solid ${contactObjections.includes(obj) ? "#3b82f6" : "var(--border)"}`,
                                borderRadius:16, padding:"3px 10px", fontSize:11, color:"var(--text)", cursor:"pointer",
                              }}
                            >
                              {objLabel}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, marginTop:6 }}>
                        <button className="note-submit" type="submit">{t(lang,"save")}</button>
                        <button className="note-cancel" type="button" onClick={() => setShowContactForm(false)}>{t(lang,"cancel")}</button>
                      </div>
                    </form>
                  )}

                  {selectedContactLogs.length > 0 ? (
                    selectedContactLogs.slice(0, 8).map((l, i) => (
                      <div key={i} className="contact-log-row">
                        <span className="log-date">{l.date}</span>
                        <span className="log-channel">{l.channel}</span>
                        <span className="log-note">{l.summary}</span>
                        {l.nextStep && <span className="log-next">→ {l.nextStep}</span>}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ fontSize:12, padding:"8px 0" }}>
                      {lang === "tr" ? "Henüz temas kaydı yok." : "No contact history yet."}
                    </div>
                  )}
                </div>

                {/* İlişki Ağı */}
                {(selected.relationshipNetwork ?? []).length > 0 && (
                  <div className="ds-block">
                    <div className="ds-block-label">🕸️ {lang === "tr" ? "İlişki Ağı" : "Relationship Network"}</div>
                    {selected.relationshipNetwork.map((rel, i) => (
                      <div key={i} className="rel-network-row">
                        <span className={`rel-kind rel-kind-${rel.kind}`}>
                          {rel.kind === "ally" ? (lang === "tr" ? "Müttefik" : "Ally") :
                           rel.kind === "swing" ? (lang === "tr" ? "Sallanır" : "Swing") :
                           (lang === "tr" ? "Rakip" : "Rival")}
                        </span>
                        <span className="rel-label">{rel.label}</span>
                        {rel.note && <span className="rel-note">{translateStrategicText(rel.note)}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* FEATURE 6: Etki Ağı */}
                {(selected.relationshipNetwork ?? []).length > 0 && (
                  <div style={{ marginTop:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:10, letterSpacing:"0.05em" }}>{t(lang,"influence_network")}</div>
                    {selected.relationshipNetwork.map((rel, i) => {
                      const kindColors: Record<string,string> = {ally:"#4ade80", swing:"#fbbf24", competitive:"#f87171"};
                      const kindLabels: Record<string,string> = {ally:t(lang,"rel_ally"), swing:t(lang,"rel_swing"), competitive:t(lang,"rel_competitive")};
                      return (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 10px", background:"var(--surface2)", borderRadius:6, marginBottom:6, border:`1px solid ${(kindColors[rel.kind]||"var(--border)")}20` }}>
                          <span style={{ fontSize:11, fontWeight:700, color:kindColors[rel.kind]||"var(--muted)", minWidth:110 }}>
                            {kindLabels[rel.kind]||rel.kind}
                          </span>
                          <span style={{ fontSize:12, fontWeight:700, color:"var(--accent)", minWidth:36 }}>{rel.countryCode}</span>
                          {rel.label && <span style={{ fontSize:11, color:"var(--text)", flex:1 }}>{rel.label}</span>}
                          {rel.note && <span style={{ fontSize:10, color:"var(--muted)" }}>{rel.note}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* FEATURE 5: Risk Kayıtları */}
                <div style={{ marginTop:16 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", letterSpacing:"0.05em" }}>{t(lang,"risk_records")}</div>
                    <button
                      type="button"
                      onClick={() => {
                        const newRisk = { type:"other", severity:"medium", note:"", date:new Date().toISOString().slice(0,10), resolved:false };
                        const existing = risks[selected.countryCode] || [];
                        set(ref(db, `fig-v3/risks/${selected.countryCode}`), [...existing, newRisk]);
                      }}
                      style={{ background:"var(--accent)", color:"#fff", border:"none", borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}
                    >
                      {t(lang,"add_risk")}
                    </button>
                  </div>
                  {(risks[selected.countryCode] || []).length === 0 ? (
                    <p style={{ fontSize:12, color:"var(--muted)", margin:0 }}>{t(lang,"no_risks")}</p>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {(risks[selected.countryCode] || []).map((r: any, i: number) => (
                        <div key={i} style={{
                          background: r.resolved ? "var(--surface2)" : r.severity === "high" ? "rgba(239,68,68,0.08)" : r.severity === "medium" ? "rgba(245,158,11,0.08)" : "var(--surface2)",
                          border:`1px solid ${r.resolved ? "var(--border)" : r.severity === "high" ? "rgba(239,68,68,0.4)" : r.severity === "medium" ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                          borderRadius:8, padding:"10px 12px",
                        }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                            <select
                              value={r.type}
                              onChange={e => {
                                const updated = [...(risks[selected.countryCode] || [])];
                                updated[i] = {...r, type: e.target.value};
                                set(ref(db, `fig-v3/risks/${selected.countryCode}`), updated);
                              }}
                              style={{ background:"transparent", border:"none", color:"var(--accent)", fontSize:11, fontWeight:700, cursor:"pointer" }}
                            >
                              <option value="leadership_change">{t(lang,"risk_leadership")}</option>
                              <option value="budget">{t(lang,"risk_budget")}</option>
                              <option value="competitor_offer">{t(lang,"risk_competitor_offer")}</option>
                              <option value="event_conflict">{t(lang,"risk_event_conflict")}</option>
                              <option value="other">{t(lang,"risk_other")}</option>
                            </select>
                            <select
                              value={r.severity}
                              onChange={e => {
                                const updated = [...(risks[selected.countryCode] || [])];
                                updated[i] = {...r, severity: e.target.value};
                                set(ref(db, `fig-v3/risks/${selected.countryCode}`), updated);
                              }}
                              style={{ background:"transparent", border:"none", color: r.severity==="high"?"#f87171":r.severity==="medium"?"#fbbf24":"#94a3b8", fontSize:11, cursor:"pointer" }}
                            >
                              <option value="high">{t(lang,"risk_severity_high")}</option>
                              <option value="medium">{t(lang,"risk_severity_medium")}</option>
                              <option value="low">{t(lang,"risk_severity_low")}</option>
                            </select>
                            <span style={{ marginLeft:"auto", fontSize:10, color:"var(--muted)" }}>{r.date}</span>
                            <button type="button" onClick={() => {
                              const updated = [...(risks[selected.countryCode] || [])];
                              updated[i] = {...r, resolved: !r.resolved};
                              set(ref(db, `fig-v3/risks/${selected.countryCode}`), updated);
                            }} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:11, color: r.resolved ? "#4ade80" : "var(--muted)" }}>
                              {r.resolved ? t(lang,"risk_resolved") : t(lang,"risk_resolve")}
                            </button>
                            <button type="button" onClick={() => {
                              const updated = (risks[selected.countryCode] || []).filter((_:any, idx:number) => idx !== i);
                              set(ref(db, `fig-v3/risks/${selected.countryCode}`), updated);
                            }} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:12, color:"var(--muted)" }}>✕</button>
                          </div>
                          <textarea
                            value={riskNoteDraft?.riskId === `${selected.countryCode}-${i}` ? riskNoteDraft.note : r.note}
                            onFocus={() => setRiskNoteDraft({riskId: `${selected.countryCode}-${i}`, note: r.note})}
                            onChange={e => setRiskNoteDraft({riskId: `${selected.countryCode}-${i}`, note: e.target.value})}
                            onBlur={() => {
                              if (riskNoteDraft && riskNoteDraft.riskId === `${selected.countryCode}-${i}`) {
                                const updated = [...(risks[selected.countryCode] || [])];
                                updated[i] = {...r, note: riskNoteDraft.note};
                                set(ref(db, `fig-v3/risks/${selected.countryCode}`), updated);
                                setRiskNoteDraft(null);
                              }
                            }}
                            placeholder={t(lang,"risk_description_ph")}
                            rows={2}
                            style={{ width:"100%", background:"transparent", border:"none", color:"var(--text)", fontSize:12, resize:"none", fontFamily:"inherit", boxSizing:"border-box" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Diplomatik Müttefikler */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">Diplomatik Müttefikler</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("diplomaticAllies"); setContentDraft(getDiplomaticAllies(selectedCode).join(", ")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "diplomaticAllies" ? (
                    <>
                      <textarea className="edit-textarea" rows={3} value={contentDraft} onChange={e => setContentDraft(e.target.value)} placeholder="Virgülle ayırarak girin…" autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"diplomaticAllies",contentDraft.split(",").map(s=>s.trim()).filter(Boolean)); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getDiplomaticAllies(selectedCode).length > 0 ? (
                      <div className="ds-block-text">{getDiplomaticAllies(selectedCode).join(" · ")}</div>
                    ) : (
                      <div className="ds-block-text" style={{ opacity: 0.4 }}>—</div>
                    )
                  )}
                </div>

                {/* Sürtüşme Noktaları */}
                <div className="ds-block">
                  <div className="ds-block-label-row">
                    <span className="ds-block-label">Sürtüşme Noktaları</span>
                    <button type="button" className="edit-btn" onClick={() => { setEditingContentField("frictionPoints"); setContentDraft(getFrictionPoints(selectedCode).join("\n")); }}><IcEdit /></button>
                  </div>
                  {editingContentField === "frictionPoints" ? (
                    <>
                      <textarea className="edit-textarea" rows={4} value={contentDraft} onChange={e => setContentDraft(e.target.value)} placeholder="Her satır bir madde…" autoFocus />
                      <div className="edit-actions">
                        <button type="button" className="edit-save" onClick={() => { saveContentField(selectedCode,"frictionPoints",contentDraft.split("\n").filter(s=>s.trim())); setEditingContentField(null); }}><IcCheck /> Kaydet</button>
                        <button type="button" className="edit-cancel" onClick={() => setEditingContentField(null)}>İptal</button>
                      </div>
                    </>
                  ) : (
                    getFrictionPoints(selectedCode).length > 0 ? (
                      getFrictionPoints(selectedCode).map((f, i) => (
                        <div key={i} className="achievement-row">
                          <span style={{ color: "var(--red)", marginRight: 6 }}>!</span>
                          <span className="achievement-text">{translateStrategicText(f)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="ds-block-text" style={{ opacity: 0.4 }}>—</div>
                    )
                  )}
                </div>

                {/* Kaynaklar */}
                {(selected.sources as unknown as Array<{ url: string; label?: string }> | undefined)?.length ? (
                  <div className="ds-block">
                    <div className="ds-block-label">Kaynaklar</div>
                    {(selected.sources as unknown as Array<{ url: string; label?: string }>).slice(0, 5).map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noreferrer" className="source-link">
                        {s.label ?? s.url}
                      </a>
                    ))}
                  </div>
                ) : null}

                {!selected.researchTasks?.length && !selected.diplomaticAllies?.length && !selected.contactLog?.length && (
                  <div className="empty-state">Bu federasyon için istihbarat verisi bulunmuyor.</div>
                )}
              </>
            )}
          </div>
        </div>
      </>,
      document.body
    )}
    </>
  );
};

// ── Giriş Kapısı (hooks kuralı: AppMain ayrı component'te) ─────────────
export const StrategyApp = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AppMain />;
};
