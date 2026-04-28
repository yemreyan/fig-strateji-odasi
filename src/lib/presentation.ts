import type {
  AuthorityRole,
  ContactLogEntry,
  ContinentCode,
  FederationSeed,
  PrimaryNeed,
  ResearchStatus,
  ResearchTaskStatus,
  SourceStatus
} from "../types";

type DashboardMetric = {
  label: string;
  score: number;
  value: string;
  caption: string;
};

export const continentMeta: Record<
  ContinentCode,
  { label: string; accent: string; description: string }
> = {
  EG: {
    label: "Avrupa",
    accent: "#5da8ff",
    description: "Teknik güven, yönetişim ciddiyeti ve organizasyon kalitesi belirleyici."
  },
  AGU: {
    label: "Asya",
    accent: "#2eb67d",
    description: "İstikrar dili, kurumsal saygı ve teknoloji güveni öne çıkıyor."
  },
  UAG: {
    label: "Afrika",
    accent: "#ff8a57",
    description: "Gelişim fonu, ekipman erişimi ve eğitim teslimatı kritik."
  },
  PAGU: {
    label: "Amerika",
    accent: "#f1c95b",
    description: "Sporcu görünürlüğü, yayın değeri ve şeffaf yönetim öne çıkıyor."
  },
  OGU: {
    label: "Okyanusya",
    accent: "#9e8dff",
    description: "Uzaklık maliyeti, uzaktan eğitim ve küçük federasyon adaleti önemli."
  }
};

export const metricCopy = [
  {
    label: "164 federasyonluk harita",
    helper: "Resmî FIG federasyon tabanı operasyon odasına yüklendi."
  },
  {
    label: "İkna edilebilir ülke",
    helper: "İlişki yatırımıyla oy davranışı değişebilecek sahalar."
  },
  {
    label: "Destekçi blok",
    helper: "Adaylığa sıcak veya doğrudan hizalanmış ülkeler."
  }
];

const primaryNeedLabels: Record<PrimaryNeed, string> = {
  continuity: "İstikrar",
  development: "Gelişim",
  funding: "Fonlama",
  visibility: "Görünürlük",
  governance: "Yönetişim",
  fairness: "Adalet",
  events: "Etkinlik değeri"
};

const federationTierLabels: Record<FederationSeed["federationTier"], string> = {
  A: "A seviye / küresel etkisi yüksek",
  B: "B seviye / orta-üst etkili",
  C: "C seviye / gelişen masa"
};

const researchDepthScores: Record<ResearchStatus, number> = {
  verified: 88,
  mixed: 64,
  seed: 41
};

const languageLabels: Record<string, string> = {
  Arabic: "Arapça",
  English: "İngilizce",
  French: "Fransızca",
  German: "Almanca",
  Italian: "İtalyanca",
  Japanese: "Japonca",
  Korean: "Korece",
  Mandarin: "Mandarin",
  "Mandarin Chinese": "Mandarin Çincesi",
  Portuguese: "Portekizce",
  Russian: "Rusça",
  Spanish: "İspanyolca",
  Turkish: "Türkçe"
};

const exactStrategicLabels: Record<string, string> = {
  "AGU continuity desks": "AGU istikrar masaları",
  "AGU network": "AGU ağı",
  "Any message that sounds anti-Watanabe":
    "Watanabe karşıtı gibi duyulan her mesaj",
  "AZE competitive bloc": "AZE rekabet bloğu",
  "Verified: current FIG President is Japanese.":
    "Doğrulandı: mevcut FIG Başkanı Japonya'dan.",
  "abrupt change framing": "ani değişim çerçevesi",
  "aggressive campaign tone": "agresif kampanya tonu",
  "athlete-visibility federations": "sporcu görünürlüğüne önem veren federasyonlar",
  "athlete-value desks": "sporcu değeri odaklı masalar",
  "broadcast-minded federations": "yayın değeri odaklı federasyonlar",
  "casual political tone": "fazla rahat siyasi ton",
  "Central Asia bridges": "Orta Asya köprüleri",
  "continuity-leaning contacts": "istikrara yakın temaslar",
  "development hubs": "gelişim merkezleri",
  "direct confrontation": "doğrudan karşıtlık",
  "Eastern Europe bridges": "Doğu Avrupa köprüleri",
  "equipment-and-education desks": "ekipman ve eğitim odaklı masalar",
  "event-led federations": "organizasyon odaklı federasyonlar",
  "governance reform desks": "yönetişim reformu masaları",
  "Gulf bridge desks": "Körfez köprü masaları",
  "hard continuity desks in AGU": "AGU içindeki sert istikrar masaları",
  "low-credibility campaigning": "güven vermeyen kampanya",
  "loose coalition management": "gevşek koalisyon yönetimi",
  "measured governance desks": "ölçülü yönetişim masaları",
  "messages that ignore AGU prestige": "AGU prestijini görmezden gelen mesajlar",
  "messaging that feels volatile": "oynak görünen mesaj dili",
  "NED": "Hollanda",
  "NZL": "Yeni Zelanda",
  "OGU desks": "OGU masaları",
  "opaque governance": "kapalı yönetişim",
  "personalized contrast": "kişiselleştirilmiş karşılaştırma",
  "token support promises": "sembolik destek vaatleri",
  "thin athlete messaging": "zayıf sporcu anlatısı",
  "travel-insensitive policy": "seyahati dikkate almayan politika",
  "unclear governance architecture": "belirsiz yönetişim mimarisi",
  "unclear regional upside": "belirsiz bölgesel kazanç",
  "underdeveloped technical message": "yetersiz teknik anlatı",
  "vague development promises": "muğlak gelişim vaatleri",
  "safe-sport desks": "güvenli spor masaları",
  "small federation advocates": "küçük federasyon savunucuları",
  "small federation fairness desks": "küçük federasyon adaleti masaları",
  "stability-first desks": "istikrar öncelikli masalar",
  "technical prestige desks": "teknik prestij masaları",
  "technical trust desks": "teknik güven masaları",
  "technology-friendly federations": "teknolojiye açık federasyonlar",
  "travel-sensitive partners": "seyahat hassasiyeti olan partnerler",
  "UAG bridge desks": "UAG köprü masaları",
  "weak athlete-trust language": "zayıf sporcu güveni dili",
  "weak athlete narrative": "zayıf sporcu anlatısı",
  "weak event logic": "zayıf organizasyon mantığı",
  "weak safeguarding language": "zayıf güvenli spor dili"
};

const phraseReplacements: Array<[RegExp, string]> = [
  [/\bFIG Vice-President\b/g, "FIG Asbaşkanı"],
  [/\bFIG President\b/g, "FIG Başkanı"],
  [/\bFIG Executive Committee member seat\b/g, "FIG Yürütme Kurulu üyeliği"],
  [/\bAGU presidency\b/g, "AGU başkanlığı"],
  [/\bAER TC presidency\b/g, "Aerobik Teknik Kurul başkanlığı"],
  [/\bVerified:\s*/gi, "Doğrulandı: "],
  [/\bStrategic asset:\s*/gi, "Stratejik avantaj: "],
  [/\bVery high\b/gi, "Çok yüksek"],
  [/\bTop tier\b/gi, "Üst seviye"],
  [/\bTop Tier\b/g, "Üst seviye"],
  [/\bMedium-high\b/gi, "Orta-yüksek"],
  [/\bLow-to-medium\b/gi, "Düşük-orta"],
  [/\bHigh\b/gi, "Yüksek"],
  [/\bMedium\b/gi, "Orta"],
  [/\bLow\b/gi, "Düşük"],
  [/\bWarm\b/gi, "Sıcak"],
  [/\bwatch\b/gi, "izleme"],
  [/\bseed\b/gi, "tohum"],
  [/\bmixed\b/gi, "karma"],
  [/\bdesks\b/gi, "masaları"],
  [/\bdesk\b/gi, "masa"],
  [/\bfederations\b/gi, "federasyonlar"],
  [/\bfederation\b/gi, "federasyon"],
  [/\bbridges\b/gi, "köprüleri"],
  [/\bbridge\b/gi, "köprü"],
  [/\bcontacts\b/gi, "temaslar"],
  [/\bcontact\b/gi, "temas"],
  [/\badvocates\b/gi, "savunucuları"],
  [/\bcontinuity\b/gi, "istikrar"],
  [/\bgovernance\b/gi, "yönetişim"],
  [/\bathlete\b/gi, "sporcu"],
  [/\bvisibility\b/gi, "görünürlük"],
  [/\bprestige\b/gi, "prestij"],
  [/\btrust\b/gi, "güven"],
  [/\btone\b/gi, "ton"],
  [/\bpolicy\b/gi, "politika"],
  [/\bpromises\b/gi, "vaatleri"],
  [/\bpromise\b/gi, "vaadi"],
  [/\breform\b/gi, "reform"],
  [/\bcompetitive\b/gi, "rekabet"],
  [/\bbloc\b/gi, "blok"],
  [/\bunclear\b/gi, "belirsiz"],
  [/\bvague\b/gi, "muğlak"],
  [/\baggressive\b/gi, "agresif"],
  [/\bdelivery\b/gi, "teslimat"],
  [/\bhosting\b/gi, "ev sahipliği"],
  [/\binternal processes\b/gi, "iç süreçler"],
  [/\bcurrent official authority list\b/gi, "güncel resmî otorite listesi"],
  [/\btechnical committee\b/gi, "teknik kurul"],
  [/\btechnical\b/gi, "teknik"],
  [/\bexecutive\b/gi, "yürütme"],
  [/\bmember seat\b/gi, "üyelik koltuğu"],
  [/\bleadership\b/gi, "liderlik"],
  [/\bsolidarity fund\b/gi, "dayanışma fonu"],
  [/\bsmall island federations\b/gi, "küçük ada federasyonları"],
  [/\bremote-first\b/gi, "uzaktan öncelikli"],
  [/\bcampaign\b/gi, "kampanya"],
  [/\bquality\b/gi, "kalite"],
  [/\bcredibility\b/gi, "güvenilirlik"],
  [/\bdeliberate\b/gi, "ölçülü"],
  [/\bdiscipline\b/gi, "disiplin"],
  [/\bsystem scale\b/gi, "sistem ölçeği"]
];

const roleLabels: Record<string, string> = {
  "Athletes' Representative": "Sporcu Temsilcisi",
  "FIG AER TC President": "FIG Aerobik Teknik Kurul Başkanı",
  "FIG ACRO TC President": "FIG Akrobasi Teknik Kurul Başkanı",
  "FIG GFA C President": "FIG Herkes İçin Cimnastik Komite Başkanı",
  "FIG MAG TC President": "FIG Erkek Artistik Teknik Kurul Başkanı",
  "FIG PK TC President": "FIG Parkur Teknik Kurul Başkanı",
  "FIG President": "FIG Başkanı",
  "FIG RG TC President": "FIG Ritmik Teknik Kurul Başkanı",
  "FIG TRA TC President": "FIG Trampolin Teknik Kurul Başkanı",
  "FIG Vice-President": "FIG Asbaşkanı",
  "FIG WAG TC President": "FIG Kadın Artistik Teknik Kurul Başkanı",
  "Member": "FIG Yürütme Kurulu Üyesi",
  "AGU President": "AGU Başkanı",
  "EG President": "EG Başkanı",
  "OGU President": "OGU Başkanı",
  "PAGU President": "PAGU Başkanı",
  "UAG President": "UAG Başkanı"
};

const normalizeWhitespace = (text: string) => text.replace(/\s+/g, " ").trim();

export const primaryNeedLabel = (need: PrimaryNeed) => primaryNeedLabels[need];

export const federationTierLabel = (tier: FederationSeed["federationTier"]) =>
  federationTierLabels[tier];

export const researchStatusLabel = (status: ResearchStatus) => {
  switch (status) {
    case "verified":
      return "Doğrulandı";
    case "mixed":
      return "Karma";
    case "seed":
      return "Tohum veri";
  }
};

export const sourceStatusLabel = (status: SourceStatus) => {
  switch (status) {
    case "verified":
      return "Doğrulandı";
    case "strategic":
      return "Stratejik";
    case "pending":
      return "Beklemede";
  }
};

export const taskStatusLabel = (status: ResearchTaskStatus) => {
  switch (status) {
    case "verified":
      return "Tamam";
    case "in_progress":
      return "Çalışılıyor";
    case "open":
      return "Açık";
  }
};

export const sourceKindLabel = (kind: FederationSeed["sources"][number]["kind"]) => {
  switch (kind) {
    case "official":
      return "Resmî";
    case "federation":
      return "Federasyon";
    case "internal":
      return "İç not";
  }
};

export const channelLabel = (channel: ContactLogEntry["channel"]) => {
  switch (channel) {
    case "desk":
      return "Masaüstü analiz";
    case "email":
      return "E-posta";
    case "call":
      return "Görüşme";
    case "visit":
      return "Yüz yüze";
  }
};

export const translateLanguage = (language: string) =>
  languageLabels[language] ?? language;

export const translateRole = (role: string) => roleLabels[role] ?? role;

export const translateStrategicText = (value: string) => {
  let next = exactStrategicLabels[value] ?? value;

  for (const [pattern, replacement] of phraseReplacements) {
    next = next.replace(pattern, replacement);
  }

  return normalizeWhitespace(next);
};

const researchDepthText = (status: ResearchStatus) => {
  switch (status) {
    case "verified":
      return "Resmî ve saha teyidi güçlü."
    case "mixed":
      return "Resmî veri var, saha teyidi derinleşmeli."
    case "seed":
      return "Bu masa hâlâ yoğun araştırma istiyor."
  }
};

const sportCapacityScore = (country: FederationSeed) =>
  Math.min(95, Math.round(country.influence * 0.58 + country.disciplines.length * 5));

const hostedEventStrength = (country: FederationSeed) =>
  Math.min(95, Math.round(country.facilityScore * 0.68 + country.hostedEvents.length * 9));

const visualValueForScore = (score: number) => {
  if (score >= 85) {
    return "Çok güçlü";
  }

  if (score >= 68) {
    return "Güçlü";
  }

  if (score >= 50) {
    return "Orta";
  }

  return "Geliştirilmeli";
};

export const buildCountryDashboard = (country: FederationSeed): DashboardMetric[] => [
  {
    label: "FIG içi etki",
    score: country.figPowerIndex,
    value: `${country.figPowerIndex}/100`,
    caption:
      country.figPowerIndex >= 75
        ? "Resmî koltuk ve ağ gücü yüksek."
        : country.figPowerIndex >= 50
          ? "Köprü rolü oynayabilecek bir kurumsal etki var."
          : "Daha çok ilişki kalitesi ve temas tasarımıyla ilerlenmeli."
  },
  {
    label: "İlişki sıcaklığı",
    score: country.relationshipStrength,
    value: `${country.relationshipStrength}/100`,
    caption:
      country.relationshipStrength >= 70
        ? "Temas zemini sıcak; hızla taahhüde dönebilir."
        : country.relationshipStrength >= 55
          ? "Temas zemini açık; düzenli bakım istiyor."
          : "Bu masa önce güven ve fayda görmek istiyor."
  },
  {
    label: "Sporcu ölçeği",
    score: sportCapacityScore(country),
    value: visualValueForScore(sportCapacityScore(country)),
    caption: `${country.disciplines.length} disiplin ve etki seviyesi birlikte okundu.`
  },
  {
    label: "Tesis ve organizasyon",
    score: country.facilityScore,
    value: `${country.facilityScore}/100`,
    caption:
      country.facilityScore >= 80
        ? "Ev sahipliği ve hazırlık kapasitesi yüksek."
        : country.facilityScore >= 60
          ? "İşleyen ama derinleştirilmesi gereken bir altyapı var."
          : "Kapasite büyütme dili daha etkili olur."
  },
  {
    label: "Araştırma derinliği",
    score: researchDepthScores[country.researchStatus],
    value: researchStatusLabel(country.researchStatus),
    caption: researchDepthText(country.researchStatus)
  }
];

export const buildStrategicSummary = (country: FederationSeed) => {
  const relationTone =
    country.relationshipStrength >= 75
      ? "İlişki zemini sıcak."
      : country.relationshipStrength >= 55
        ? "İlişki zemini açık ama düzenli temas istiyor."
        : "İlişki zemini hassas; önce güven inşa etmek gerekiyor.";
  const powerTone =
    country.figPowerIndex >= 75
      ? "Bu masa FIG içinde görünür kurumsal ağırlık taşıyor."
      : country.figPowerIndex >= 50
        ? "Bu masa FIG tarafında önemli bir köprü rolü oynayabilir."
        : "Bu masa resmî güçten çok ilişki ve fayda paketiyle hareket eder.";

  return `${country.countryName} için ana başlık ${primaryNeedLabel(
    country.primaryNeed
  ).toLowerCase()}. ${powerTone} ${relationTone} İlk temas kısa, somut ve federasyonun kendi iç yapısında savunabileceği bir teklifle açılmalı.`;
};

export const buildOperationalChips = (country: FederationSeed) => {
  return [
    `${primaryNeedLabel(country.primaryNeed)} önceliği`,
    `${continentMeta[country.continent].label} masası`,
    federationTierLabel(country.federationTier),
    `${researchStatusLabel(country.researchStatus)} profil`
  ];
};

export const buildProofBullets = (country: FederationSeed) => {
  const roles =
    country.figRoles.length > 0
      ? `FIG içinde ${country.figRoles.length} aktif görev bağlantısı var; bu da masaya kurumsal ağırlık kazandırıyor.`
      : "Doğrudan FIG koltuğu görünmüyor; bu yüzden etki daha çok kıta ağı ve ilişki kalitesi üzerinden kurulmalı.";

  return [
    roles,
    `${country.disciplines.length} disiplin görünürlüğü, federasyonun saha genişliği ve kadro çeşitliliği için olumlu sinyal üretiyor.`,
    `${country.facilityScore}/100 tesis puanı, ev sahipliği ve hazırlık kapasitesinin hızlı göstergesi olarak okunabilir.`,
    country.president
      ? `${country.president} çevresinde şekillenen karar merkezi, temas tonunu doğrudan etkiler.`
      : "Karar merkezinin kimde toplandığı saha teyidi istiyor; ilk görüşmede bu alan netleştirilmeli."
  ];
};

export const buildMessageBullets = (country: FederationSeed) => {
  const continentLine = continentMeta[country.continent].description;

  return [
    `${country.countryName} ile konuşmada ilk cümle, federasyona doğrudan fayda göstermeli.`,
    `${primaryNeedLabel(country.primaryNeed)} başlığını ${continentLine.toLowerCase()} çerçevesiyle bağlamak doğru giriş olur.`,
    `Mesaj tonu ${
      country.status === "supporter"
        ? "mevcut sıcaklığı koruyan"
        : country.status === "persuadable"
          ? "ikna eden ama baskı kurmayan"
          : "ölçülü ve güven inşa eden"
    } bir çizgide kalmalı.`
  ];
};

export const buildStrategicMoves = (country: FederationSeed) => {
  const firstRole = country.figRoles[0]?.role;

  return [
    `${country.countryName} için ilk tur temas, başkan ve sekreter genel hattını aynı anda kapsamalı.`,
    firstRole
      ? `${translateRole(firstRole)} bağlantısı kullanılarak kapı açan teknik veya siyasi isim devreye alınmalı.`
      : "Teknik kurul veya kıta köprüsü üzerinden kapı açacak aracı isim bulunmalı.",
    `Delege düzeyinde taahhüt istemeden önce ${primaryNeedLabel(
      country.primaryNeed
    ).toLowerCase()} paketi yazılı hale getirilmeli.`
  ];
};

export const buildPowerNarrative = (country: FederationSeed) => {
  if (country.figRoles.length > 0) {
    const topRoles = country.figRoles
      .slice(0, 2)
      .map((role) => translateRole(role.role))
      .join(", ");

    return `${country.countryName} masası ${topRoles} üzerinden doğrudan FIG teması kurabiliyor. Bu yüzden güç dili sert değil, sakin ve kurumsal kullanılmalı.`;
  }

  return `${country.countryName} masasında resmî FIG koltuğu görünmüyor. Bu ülkede oy davranışı daha çok kıta ağı, başkanın kişisel hattı ve yakın federasyon referanslarıyla etkilenir.`;
};

export const buildJudgeNarrative = (country: FederationSeed) => {
  if (country.figRoles.some((role) => role.category === "technical")) {
    return "Teknik kurul bağlantısı doğrulanmış durumda. Hakemlik ve teknik güven başlıkları burada güçlü bir giriş kapısı olabilir.";
  }

  if (country.disciplines.length >= 6 || country.influence >= 70) {
    return "Doğrudan teknik kurul başkanlığı görünmese de teknik derinlik yüksek. Mesaj dili adalet, tutarlılık ve uygulama kalitesi etrafında kurulmalı.";
  }

  return "Hakem ve teknik kurul etkisi sınırlı görünüyor. Önce saha teyidi, sonra teknik güven cümlesi kurulmalı.";
};

export const buildAthleteNarrative = (country: FederationSeed) => {
  const score = sportCapacityScore(country);

  if (score >= 80) {
    return "Sporcu havuzu geniş ve görünür. Bu ülkeyle konuşurken milli takım derinliği, elit sporcu akışı ve etkinlik standardı aynı çerçevede ele alınmalı.";
  }

  if (score >= 60) {
    return "Sporcu kapasitesi orta-üst seviyede. Doğru destekle görünürlük ve sonuç üretme kabiliyeti büyüyebilir.";
  }

  return "Sporcu kapasitesi gelişim bandında. Bu masada büyüme, eğitim ve altyapı desteği daha ikna edici olur.";
};

export const buildFacilityNarrative = (country: FederationSeed) => {
  const eventScore = hostedEventStrength(country);

  if (eventScore >= 82) {
    return "Tesis ve organizasyon izi güçlü. Ev sahipliği kalitesi, yönetsel güven ve kampanya kabiliyeti için doğrudan kanıt olarak kullanılabilir.";
  }

  if (eventScore >= 62) {
    return "İşleyen bir organizasyon kapasitesi var. Bölgesel veya kıtasal etkinlik dili, bu ülkede ikna paketine rahatça eklenebilir.";
  }

  return "Tesis ve organizasyon tarafı hâlâ gelişim alanı. Büyük vaatlerden çok kapasite artırıcı teklif daha inandırıcı olur.";
};

export const buildRoleDigest = (country: FederationSeed) => {
  if (country.figRoles.length === 0) {
    return [
      {
        title: "Resmî FIG koltuğu",
        body: "Doğrudan doğrulanmış görev görünmüyor.",
        meta: "İlişki ve kıta köprüsüyle ilerlenmeli."
      }
    ];
  }

  return country.figRoles.slice(0, 4).map((role: AuthorityRole) => ({
    title: translateRole(role.role),
    body: role.name,
    meta: translateStrategicText(role.term)
  }));
};

export const buildCountryIdentity = (country: FederationSeed) => [
  {
    label: "Federasyon seviyesi",
    value: federationTierLabel(country.federationTier)
  },
  {
    label: "Teknik kurul durumu",
    value:
      country.figRoles.some((role) => role.category === "technical")
        ? "Doğrulanmış teknik kurul teması var"
        : "Teknik kurulda doğrudan liderlik görünmüyor"
  },
  {
    label: "Hakem etkisi",
    value:
      country.figRoles.some((role) => role.category === "technical") || country.influence >= 70
        ? "Orta-üst / etkili"
        : "Saha teyidi gerekiyor"
  },
  {
    label: "Konuşulan diller",
    value: country.languages.map(translateLanguage).join(", ")
  }
];

export const buildSportHighlights = (country: FederationSeed) => [
  translateStrategicText(country.athleteBaseEstimate),
  ...country.nationalTeamHighlights.slice(0, 2).map(translateStrategicText),
  ...country.medalHighlights.slice(0, 2).map(translateStrategicText)
];

export const buildFacilityHighlights = (country: FederationSeed) => [
  buildFacilityNarrative(country),
  ...country.hostedEvents.slice(0, 2).map(translateStrategicText)
];
