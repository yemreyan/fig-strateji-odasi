import type { FederationSeed } from "../types";

type IntelligenceOverride = Partial<
  Pick<
    FederationSeed,
    | "languages"
    | "diplomaticAllies"
    | "frictionPoints"
    | "achievements"
    | "athleteCapacity"
    | "facilities"
    | "facilityScore"
    | "politicalPower"
    | "judgesInfluence"
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
  >
>;

export const intelligenceOverrides: Record<string, IntelligenceOverride> = {
  TUR: {
    languages: ["Turkish", "English"],
    diplomaticAllies: ["CRO", "BUL", "HUN", "ROU", "SRB"],
    frictionPoints: ["AZE competitive bloc", "hard continuity desks in AGU"],
    achievements: [
      "Verified: current FIG Vice-President from Turkiye.",
      "Strategic asset: can speak both operational and political FIG language.",
      "Campaign proof should lean on delivery, not only proximity."
    ],
    athleteCapacity:
      "High and diversified. Strong enough to host elite events and sustain multi-discipline attention.",
    facilities:
      "Above regional average with proven hosting optics. Use venue quality as proof of competence.",
    facilityScore: 84,
    politicalPower:
      "Direct FIG executive power with cross-continental access. Best used through calm coalition building.",
    judgesInfluence:
      "Medium-high. Needs to be framed as technical reliability, not favoritism.",
    strategyPath: [
      "Lock the home coalition and convert it into cross-border validators.",
      "Use FIG Vice-President credibility as competence proof, not as entitlement.",
      "Show a presidential temperament: stable, fair, and globally oriented."
    ],
    visualSignals: [
      {
        label: "Power Node",
        value: "FIG VP",
        tone: "high",
        note: "Verified executive leverage"
      },
      {
        label: "Facility Score",
        value: "84",
        tone: "high",
        note: "Hosting optics are a campaign asset"
      },
      {
        label: "Bloc Health",
        value: "Warm",
        tone: "medium",
        note: "Needs disciplined coalition maintenance"
      }
    ],
    decisionArchitecture: [
      "Karar merkezi doğrudan federasyon başkanı ve FIG içindeki yürütme hattında şekilleniyor.",
      "Türkiye için sekreterya, operasyon akışı ve uluslararası temas zamanlamasında kritik kilit taşıdır.",
      "FIG Başkan Yardımcılığı koltuğu, teknik meşruiyeti politik erişime çeviren ana omurgadır."
    ],
    entryChannels: [
      "Balkan ve Doğu Avrupa köprüsü üzerinden ilk doğrulayıcı halkayı kur.",
      "Başkanlık iddiasını 'hak edilmiş yetkinlik' diliyle aç; hiçbir zaman otomatik hak gibi sunma.",
      "Ev sahipliği ve operasyon kalitesini, üçüncü taraf ülke referanslarıyla masaya getir."
    ],
    persuasionPayload: [
      "Adil yönetişim ve teslimat kapasitesini aynı çerçevede sun.",
      "Türkiye'nin FIG içindeki tecrübesini, gelişmekte olan federasyonlara somut fayda paketine bağla.",
      "Yakın çevre desteğini genişletmek için teknik güven ve etkinlik yönetimi kartını birlikte kullan."
    ],
    redLines: [
      "Adaylık dili içe kapanık veya yalnızca milli başarı vurgusuna sıkışmamalı.",
      "Rakiplerle kişiselleştirilmiş polemik kurulursa merkez seçmen uzaklaşır.",
      "FIG Başkan Yardımcılığı koltuğu, baskı aracı gibi değil güven aracı gibi kullanılmalı."
    ],
    congressScenario: [
      "Kongre öncesi sıcak blok korunmalı, fakat salondaki son dakika kararsızlarına sakin validator diliyle girilmeli.",
      "Konuşma zemini liderlik, adalet ve uygulama kapasitesi etrafında kurulmalı.",
      "Taahhüt isteme anı, yazılı fayda paketi gösterildikten sonra gelmeli."
    ],
    researchStatus: "mixed"
  },
  JPN: {
    languages: ["Japanese", "English"],
    diplomaticAllies: ["AGU continuity desks", "technology-friendly federations"],
    frictionPoints: ["Any message that sounds anti-Watanabe", "abrupt change framing"],
    achievements: [
      "Verified: current FIG President is Japanese.",
      "Verified: Japan also holds the FIG AER TC presidency.",
      "Institutional prestige is high; transition language must stay respectful."
    ],
    athleteCapacity:
      "Very high elite capacity and global prestige. Treat as a legitimacy desk, not a transactional desk.",
    facilities:
      "High-end, competition-ready, and symbolically powerful inside the sport.",
    facilityScore: 92,
    politicalPower:
      "Top-tier institutional power because the country anchors the current FIG presidency narrative.",
    judgesInfluence:
      "High technical legitimacy. Respect and continuity matter more than pressure.",
    strategyPath: [
      "Lead with istikrar and respectful continuity.",
      "Position the campaign as stronger delivery of unfinished work.",
      "Use soft validators; do not force direct contrast."
    ],
    visualSignals: [
      {
        label: "Continuity Risk",
        value: "High",
        tone: "watch",
        note: "Tone discipline matters"
      },
      {
        label: "Prestige",
        value: "Top Tier",
        tone: "high",
        note: "Global legitimacy desk"
      },
      {
        label: "Technical Reach",
        value: "AER TC",
        tone: "high",
        note: "Verified FIG technical role"
      }
    ],
    decisionArchitecture: [
      "Başkanlık mirası ve kurumsal hafıza belirleyici olduğu için karar süreci sadece federasyon başkanına indirgenemez.",
      "FIG başkanlık döngüsüne yakın isimlerin tonu, resmi oy davranışı kadar önemlidir.",
      "Teknik kurul görünürlüğü, Japonya masasını politik değil meşruiyet odaklı hale getirir."
    ],
    entryChannels: [
      "İlk giriş mutlaka istikrar ve saygı diliyle açılmalı.",
      "Doğrudan zıtlaşma yerine tamamlanmamış işlerin daha iyi teslimi çerçevesi kullanılmalı.",
      "Teknik saygınlığı olan aracı isimlerle ikinci kapı açılmalı."
    ],
    persuasionPayload: [
      "İyi giden projelerin korunacağı açıkça söylenmeli.",
      "Teslimat hızını artıracak yönetim modeli net ve sakin anlatılmalı.",
      "Japonya'ya küresel saygınlığını koruyan, türbülans üretmeyen bir başkanlık resmi gösterilmeli."
    ],
    redLines: [
      "Anti-Watanabe gibi okunacak her cümle kapıyı kapatır.",
      "Hızlı değişim veya kopuş tonu kullanılmamalı.",
      "Japonya masasını pazarlık masası gibi görmek stratejik hata olur."
    ],
    congressScenario: [
      "Kongre haftasında doğrudan oy istemekten çok saygı ve istikrar teyidi alınmalı.",
      "Son temas, sert karşılaştırma yerine güvenli geçiş fikrine dayanmalı.",
      "Kararsızlık kalırsa ilişkiyi koruyacak yumuşak kapanış yapılmalı."
    ],
    researchStatus: "mixed"
  },
  CHN: {
    languages: ["Mandarin Chinese", "English"],
    diplomaticAllies: ["Central Asia bridges", "stability-first desks"],
    frictionPoints: ["messaging that feels volatile", "unclear governance architecture"],
    achievements: [
      "Verified: China holds a current FIG Executive Committee member seat.",
      "High symbolic athletic prestige and system depth."
    ],
    athleteCapacity:
      "Very high, with strong system depth and long-horizon elite planning capacity.",
    facilities:
      "High-level infrastructure and event-hosting capability.",
    facilityScore: 90,
    politicalPower:
      "High. Responds to composure, strategic seriousness, and stability.",
    judgesInfluence:
      "Medium-high. Technical respect should be assumed in the message architecture.",
    strategyPath: [
      "Stress system stability and predictability.",
      "Show a serious governance blueprint, not personality politics.",
      "Use high-level diplomacy and technical respect."
    ],
    visualSignals: [
      {
        label: "Executive Reach",
        value: "FIG Member",
        tone: "high",
        note: "Verified current executive presence"
      },
      {
        label: "System Scale",
        value: "Very High",
        tone: "high",
        note: "Large-capacity federation"
      },
      {
        label: "Conversion Mode",
        value: "Diplomatic",
        tone: "watch",
        note: "Needs careful tone control"
      }
    ],
    decisionArchitecture: [
      "Karar mekanizması kurumsal ölçek, sistem aklı ve üst düzey temsil dengesiyle çalışır.",
      "FIG yürütme görünürlüğü olan isimler, doğrudan siyasi tonu belirler.",
      "Teknik saygınlık, Çin masasındaki politik ağırlığın ayrılmaz parçasıdır."
    ],
    entryChannels: [
      "Giriş cümlesi öngörülebilirlik ve sistem ciddiyeti üzerinden kurulmalı.",
      "Yüksek seviye diplomatik temas ile teknik güven aynı pakette ilerlemeli.",
      "Orta Asya köprüleri ve istikrar odaklı masalar ikinci halka olarak kullanılmalı."
    ],
    persuasionPayload: [
      "Başkanlığın kriz üretmeyen ama daha disiplinli çalışan bir yapı getireceği anlatılmalı.",
      "Büyük federasyonlara karar kalitesi, takvim disiplini ve teknik tutarlılık sözü verilmeli.",
      "Sistemin saygınlığını artıracak bir yönetişim omurgası gösterilmeli."
    ],
    redLines: [
      "Volatilite çağrıştıran dil kullanılmamalı.",
      "Kişisel marka siyaseti, kurumsal aklın önüne geçirilmemeli.",
      "Belirsiz yönetişim anlatısı Çin masasını hızla soğutur."
    ],
    congressScenario: [
      "Kongre öncesinde resmi değil ama güven veren bir pozisyon hedeflenmeli.",
      "Son temas kısa, net ve sistem diliyle yapılmalı.",
      "Taahhüt alınamıyorsa en azından karşı cepheye itilmeyecek bir zemin korunmalı."
    ],
    researchStatus: "mixed"
  },
  QAT: {
    languages: ["Arabic", "English"],
    diplomaticAllies: ["AGU network", "event-led federations", "Gulf bridge desks"],
    frictionPoints: ["messages that ignore AGU prestige", "weak event logic"],
    achievements: [
      "Verified: Qatar holds a FIG Vice-President seat.",
      "Verified: Qatar also holds the AGU presidency.",
      "This is one of the strongest institutional desks in Asia."
    ],
    athleteCapacity:
      "Moderate athlete depth but outsized institutional and event leverage.",
    facilities:
      "Very high event infrastructure and presentation quality.",
    facilityScore: 91,
    politicalPower:
      "Very high inside AGU and FIG bridge politics.",
    judgesInfluence:
      "Medium. Political reach is stronger than pure judging leverage.",
    strategyPath: [
      "Treat as a top-level institutional desk.",
      "Lead with event value, prestige, and regional respect.",
      "Any outreach must acknowledge AGU leadership weight."
    ],
    visualSignals: [
      {
        label: "Dual Role",
        value: "FIG + AGU",
        tone: "high",
        note: "Verified executive and continental power"
      },
      {
        label: "Event Optics",
        value: "Premium",
        tone: "high",
        note: "Major hosting credibility"
      },
      {
        label: "Negotiation Mode",
        value: "Top Table",
        tone: "medium",
        note: "Handle at leadership level"
      }
    ],
    decisionArchitecture: [
      "Qatar masasında karar ekseni yalnız federasyon değil aynı zamanda AGU prestij hattıdır.",
      "FIG ve AGU çift rolü, bu ülkeyi sıradan bir oy masasından çıkarır.",
      "Temas düzeyi her zaman üst masa kalitesinde yürütülmelidir."
    ],
    entryChannels: [
      "İlk temas mutlaka bölgesel saygı ve liderlik diliyle açılmalı.",
      "AGU içindeki ağırlığı teslim eden bir cümle olmadan ikinci aşamaya geçilmemeli.",
      "Premium etkinlik ve marka değeri vurgusu, kapı açan ana anahtardır."
    ],
    persuasionPayload: [
      "Başkanlık modelinin AGU prestijini azaltmadan küresel teslimatı güçlendireceği anlatılmalı.",
      "Etkinlik kalitesi, görünürlük ve bölgesel saygınlık aynı pakete bağlanmalı.",
      "Qatar'a masada kurucu ortak gibi davranılmalı, sıradan ikna masası gibi değil."
    ],
    redLines: [
      "AGU ağırlığını görmezden gelen dil ilişkiyi anında bozar.",
      "Zayıf etkinlik mantığı veya düşük seviye temas biçimi kullanılmamalı.",
      "Bölgesel rekabet söylemi yerine prestij ve kurumsal ağırlık çerçevesi korunmalı."
    ],
    congressScenario: [
      "Kongreye giderken açık destek kadar nötr kalmasını sağlamak da kazanımdır.",
      "Son temas liderlik seviyesinde ve kısa yapılmalı.",
      "Yazılı teklif, etkinlik değeri ve kurumsal ortaklık ekseninde sunulmalı."
    ],
    researchStatus: "mixed"
  },
  MEX: {
    languages: ["Spanish", "English"],
    diplomaticAllies: ["PAGU leadership desks", "athlete-visibility federations"],
    frictionPoints: ["weak athlete narrative", "unclear regional upside"],
    achievements: [
      "Verified: Mexico holds a FIG Vice-President seat.",
      "Important PAGU leadership bridge."
    ],
    athleteCapacity:
      "Moderate-to-high regional capacity with strong symbolic value in the Americas.",
    facilities:
      "Competitive regional infrastructure with visible event potential.",
    facilityScore: 73,
    politicalPower:
      "High within PAGU politics because of current FIG vice-presidential access.",
    judgesInfluence:
      "Medium. Better played through leadership and regional voice than technical pressure.",
    strategyPath: [
      "Connect PAGU upside to the candidacy clearly.",
      "Frame the next cycle around athlete value and host value.",
      "Use vice-presidential parity language carefully."
    ],
    visualSignals: [
      {
        label: "FIG Role",
        value: "Vice-President",
        tone: "high",
        note: "Verified"
      },
      {
        label: "Regional Reach",
        value: "High",
        tone: "medium",
        note: "Bridge into PAGU"
      },
      {
        label: "Narrative Need",
        value: "Athlete Value",
        tone: "watch",
        note: "Lead with benefit, not politics"
      }
    ],
    decisionArchitecture: [
      "Egypt masasını şekillendiren çekirdek, federasyon liderliği ile kıtasal otorite hattının birleşimidir.",
      "UAG başkanlığı etkisi, yalnız Mısır oyunu değil çevresini de etkiler.",
      "RG teknik gücü, meşruiyet ve saygınlık katsayısını yukarı taşır."
    ],
    entryChannels: [
      "İlk giriş Afrika teslimatı ve kıtasal saygı diliyle kurulmalı.",
      "Kuzey Afrika ve UAG hattı üzerinden ikinci validator halkası örülmeli.",
      "Eğitim, ekipman ve görünürlük üçlemesi birlikte masaya getirilmeli."
    ],
    persuasionPayload: [
      "Mısır'a sıradan gelişim ülkesi gibi değil, Afrika düğüm noktası gibi yaklaşılmalı.",
      "Kıta içi eğitim merkezi, ekipman erişimi ve görünürlük desteği paket halinde sunulmalı.",
      "Kurumsal rolüne uygun bir ortaklık dili kurulursa çevre oylar da yumuşar."
    ],
    redLines: [
      "Soyut gelişim söylemi burada işlemiyor.",
      "Kıtasal ağırlığı küçümseyen veya görmezden gelen ton kapıyı kapatır.",
      "Mısır'a tekil oy gibi yaklaşmak stratejik kayıptır."
    ],
    congressScenario: [
      "Kongre öncesi hedef yalnız oy değil, Afrika çevresine taşacak olumlu sinyal üretmektir.",
      "Mısır'dan açık destek çıkmıyorsa en azından karşı bloğu sertleştirmeyen bir kanal korunmalı.",
      "Son temasta kıtasal merkez rolüne saygı açık biçimde gösterilmeli."
    ],
    researchStatus: "mixed"
  },
  EGY: {
    languages: ["Arabic", "English", "French"],
    diplomaticAllies: ["UAG bridge desks", "RG-heavy federations", "North Africa"],
    frictionPoints: ["vague development promises", "weak continental respect language"],
    achievements: [
      "Verified: Egypt holds the FIG RG TC presidency.",
      "Verified: Egypt also holds the UAG presidency.",
      "This gives Egypt one of the strongest African institutional positions."
    ],
    athleteCapacity:
      "High by African standards with strong symbolic leadership value inside UAG.",
    facilities:
      "Above-continental-average infrastructure with hub potential.",
    facilityScore: 78,
    politicalPower:
      "Very high in African block politics because of dual FIG/UAG institutional reach.",
    judgesInfluence:
      "High in RG-facing conversations due to verified technical leadership.",
    strategyPath: [
      "Present a credible Africa delivery package.",
      "Respect Egypt as a continental hub, not as a generic development vote.",
      "Use education, equipment, and visibility in one package."
    ],
    visualSignals: [
      {
        label: "Dual Authority",
        value: "UAG + RG TC",
        tone: "high",
        note: "Verified continental and technical power"
      },
      {
        label: "Hub Potential",
        value: "Strong",
        tone: "high",
        note: "Treat as an African anchor desk"
      },
      {
        label: "Conversion Mode",
        value: "Package",
        tone: "medium",
        note: "Needs a serious development offer"
      }
    ],
    decisionArchitecture: [
      "ABD masasında karar merkezi federasyon liderliği kadar güvenlik ve yönetişim hafızasıyla şekillenir.",
      "FIG yürütme koltuğu, kurumsal kulak verir ama tek başına oy garantisi üretmez.",
      "Sporcu güveni ve kurum ciddiyeti, karar üzerinde doğrudan etkili filtrelerdir."
    ],
    entryChannels: [
      "İlk giriş safeguarding, şeffaflık ve sporcu refahı üzerinden yapılmalı.",
      "Teknik argüman ikinci sırada gelmeli; ilk eşik güvenilir yönetişimdir.",
      "Yüksek itibar sahibi aracı isimlerle yumuşak bir açılış tercih edilmeli."
    ],
    persuasionPayload: [
      "Yeni başkanlık modelinin süreç şeffaflığını ve sporcu güvenini görünür kılacağı anlatılmalı.",
      "Bütçe, takvim ve karar yapısında kurumsal ciddiyet vurgulanmalı.",
      "Politik heyecan değil, güven veren yönetim mimarisi satılmalı."
    ],
    redLines: [
      "Zayıf safeguarding dili ağır hasar verir.",
      "Taktik siyaset veya kişisel yakınlık vurgusu ters teper.",
      "Belirsiz süreç anlatısı ABD masasını hızla soğutur."
    ],
    congressScenario: [
      "Kongre yaklaşırken destek aramak kadar itirazları nötralize etmek de önemlidir.",
      "Son temas kısa, disiplinli ve süreç güvencesi üzerinden yapılmalı.",
      "Açık taahhüt çıkmıyorsa karşı blok sertleştirilmeden ilişki korunmalı."
    ],
    researchStatus: "mixed"
  },
  GER: {
    languages: ["German", "English"],
    diplomaticAllies: ["NED", "SUI", "AUT", "GBR"],
    frictionPoints: ["opaque governance", "amateur campaign tone", "weak athlete-trust language"],
    achievements: [
      "Germany sits in the European serious-governance cluster and influences neighboring desks through tone.",
      "Strong event and system credibility make Germany a high-value persuasion desk."
    ],
    athleteCapacity:
      "High elite and administrative capacity with deep club infrastructure and visible technical culture.",
    facilities:
      "High-end infrastructure and event-readiness; hosting quality can be turned into a serious governance conversation.",
    facilityScore: 87,
    politicalPower:
      "High inside Europe because Germany shapes the mood of governance-sensitive federations.",
    judgesInfluence:
      "Medium-high. Technical respect matters, but governance trust matters even more.",
    strategyPath: [
      "Lead with professionalism, transparency, and athlete trust.",
      "Use mature validators rather than loud coalition tactics.",
      "Translate every promise into a process and delivery mechanism."
    ],
    visualSignals: [
      {
        label: "Governance Weight",
        value: "High",
        tone: "high",
        note: "A tone-setting European desk"
      },
      {
        label: "Trust Filter",
        value: "Strict",
        tone: "watch",
        note: "Amateurism will be punished"
      },
      {
        label: "Event Readiness",
        value: "Strong",
        tone: "medium",
        note: "Use quality and structure together"
      }
    ],
    decisionArchitecture: [
      "Almanya masasinda karar, baskanlik ve profesyonel sekreterya kadar kurumsal itibar filtresinden geciyor.",
      "Teknik ve guvenlik hassasiyeti yuksek oldugu icin sadece politik yakinlik yeterli degil.",
      "Bu masada federasyon ici savunulabilirlik, tekil iliskiden daha belirleyici."
    ],
    entryChannels: [
      "Ilk giris profesyonellik ve seffaflik cümlesiyle açılmalı.",
      "NED, SUI ve GBR hattindan gelecek validator dili ikinci kapıyı açabilir.",
      "Etkinlik kalitesi ve yonetişim ciddiyeti ayni dosyada sunulmalı."
    ],
    persuasionPayload: [
      "Karar surecini daha okunur kılacak bir baskanlik modeli anlatılmalı.",
      "Safeguarding, sporcu guveni ve takvim disiplini birlikte paketlenmeli.",
      "Sert siyaset yerine ciddi uygulama planı satılmalı."
    ],
    redLines: [
      "Kişisel yakınlık veya arka kapı siyaseti izlenimi verilmemeli.",
      "Belirsiz süreç anlatısı Almanya masasını hızla kaybettirir.",
      "Abartılı popülizm yerine kısa ve profesyonel dil kullanılmalı."
    ],
    congressScenario: [
      "Kongre haftasında Almanya'dan açık destek almak kadar itiraz üretmemek de kritik.",
      "Son temas, yazılı süreç güvencesi ve validator desteğiyle yapılmalı.",
      "Kararsız kalırlarsa karşı bloğa itilmeyecek nötr-sıcak zemin korunmalı."
    ],
    expectations: [
      "Kurumsal ciddiyet ve süreç şeffaflığı görmek ister.",
      "Sporcu güvenini gerçek yönetim kararlarına bağlayan bir çizgi bekler.",
      "Avrupa içinde savunulabilir, profesyonel bir başkanlık modeli görmek ister."
    ],
    relationshipNetwork: [
      {
        countryCode: "NED",
        label: "Hollanda hattı",
        kind: "ally",
        note: "Yönetişim ve sporcu güveni dilini güçlendiren yakın doğrulayıcı hattı."
      },
      {
        countryCode: "SUI",
        label: "İsviçre hattı",
        kind: "ally",
        note: "Kurumsal ciddiyet vurgusunu destekler."
      },
      {
        countryCode: "GBR",
        label: "Britanya hattı",
        kind: "swing",
        note: "Teknik güven ve safe-sport dili üzerinden etkilenebilir."
      },
      {
        countryCode: "AZE",
        label: "Süreklilikçi Avrupa çevresi",
        kind: "competitive",
        note: "Zayıf yönetişim dili Almanya'yı bu çevreye doğru itebilir."
      }
    ],
    athleteBaseEstimate:
      "Tahmini 140+ elit ve gelisim havuzu; genis kulup tabani sayesinde milli takim cekirdegi derin.",
    nationalTeamHighlights: [
      "Yuksek performans yapisi ve kulup tabani, milli takim yenilenmesini destekler.",
      "Farkli disiplinlerde sureklilik uretebilen bir sporcu havuzu bulunur.",
      "Yonetim dili sporcu refahina temas etmezse bu guc siyasi avantaja donusmez."
    ],
    medalHighlights: [
      "Avrupa ve dunya duzeyinde gorunurluk ureten bir performans hafizasi var.",
      "Madalya standardi tekil degil, sistem temelli okunur.",
      "Basari bandi ust-orta segmentte ve ciddi yonetişim beklentisiyle baglantili."
    ],
    countryRanking: "Kuresel basari bandi: ilk 10-20 arasi etkili seviye.",
    hostedEvents: [
      "Almanya, premium kalite beklentisi olan uluslararasi organizasyon mantigina yatkin bir profil sunar.",
      "Ev sahipligi karti burada sayginlik ve organizasyon disipliniyle birlikte oynanmalı.",
      "Etkinlik kalitesi, yönetişim ciddiyeti söylemini destekleyen somut kozlardan biri."
    ],
    researchStatus: "mixed"
  },
  GBR: {
    languages: ["English"],
    diplomaticAllies: ["safe-sport desks", "technical trust desks"],
    frictionPoints: ["opaque governance", "casual political tone"],
    achievements: [
      "Verified: Great Britain holds the FIG MAG TC presidency.",
      "Strong technical legitimacy desk."
    ],
    athleteCapacity:
      "High elite and administrative capacity with strong technical reputation.",
    facilities:
      "High-end national and event infrastructure.",
    facilityScore: 86,
    politicalPower:
      "Medium-high. Technical trust can become political trust if tone is mature.",
    judgesInfluence:
      "High in MAG-related credibility conversations.",
    strategyPath: [
      "Lead with governance seriousness and athlete trust.",
      "Make fairness and technical integrity visible.",
      "Use technical validators rather than hard politics."
    ],
    visualSignals: [
      {
        label: "Technical Power",
        value: "MAG TC",
        tone: "high",
        note: "Verified FIG technical leadership"
      },
      {
        label: "Trust Demand",
        value: "High",
        tone: "watch",
        note: "Needs governance confidence"
      },
      {
        label: "Athlete Optics",
        value: "Sensitive",
        tone: "watch",
        note: "Safe-sport language matters"
      }
    ],
    researchStatus: "mixed"
  },
  ITA: {
    languages: ["Italian", "English"],
    diplomaticAllies: ["technical prestige desks", "event-led federations"],
    frictionPoints: ["low-credibility campaigning", "underdeveloped technical message"],
    achievements: [
      "Verified: Italy holds the FIG WAG TC presidency.",
      "High technical and event prestige desk."
    ],
    athleteCapacity:
      "High across elite systems and competition visibility.",
    facilities:
      "High-quality event and federation infrastructure.",
    facilityScore: 85,
    politicalPower:
      "Medium-high due to technical prestige and event visibility.",
    judgesInfluence:
      "High in WAG credibility conversations.",
    strategyPath: [
      "Lead with quality, fairness, and elite event value.",
      "Project seriousness and technical fluency.",
      "Do not over-politicize the approach."
    ],
    visualSignals: [
      {
        label: "Technical Power",
        value: "WAG TC",
        tone: "high",
        note: "Verified FIG technical leadership"
      },
      {
        label: "Event Value",
        value: "Strong",
        tone: "medium",
        note: "Use brand and quality arguments"
      },
      {
        label: "Tone Need",
        value: "Serious",
        tone: "watch",
        note: "Technical fluency expected"
      }
    ],
    researchStatus: "mixed"
  },
  BUL: {
    languages: ["Bulgarian", "English"],
    diplomaticAllies: ["Eastern Europe bridges", "acro-oriented desks"],
    frictionPoints: ["loose coalition management"],
    achievements: [
      "Verified: Bulgaria holds the FIG ACRO TC presidency.",
      "Verified: Bulgaria also holds the Athletes' Representative seat."
    ],
    athleteCapacity:
      "Strong symbolic technical presence, especially in ACRO conversations.",
    facilities:
      "Solid European infrastructure with targeted technical influence.",
    facilityScore: 71,
    politicalPower:
      "Medium with unusually useful athlete-plus-technical validation power.",
    judgesInfluence:
      "Medium-high because of verified technical representation.",
    strategyPath: [
      "Use as a validator desk.",
      "Blend athlete voice with technical trust.",
      "Keep the relationship warm and visible."
    ],
    visualSignals: [
      {
        label: "Dual Validation",
        value: "TC + Athlete",
        tone: "high",
        note: "Verified"
      },
      {
        label: "Coalition Value",
        value: "Useful",
        tone: "medium",
        note: "Good supporting validator"
      },
      {
        label: "Maintenance Need",
        value: "Steady",
        tone: "watch",
        note: "Do not assume support"
      }
    ],
    researchStatus: "mixed"
  },
  USA: {
    languages: ["English"],
    diplomaticAllies: ["governance reform desks", "athlete trust advocates"],
    frictionPoints: ["weak safeguarding language", "opaque internal processes"],
    achievements: [
      "Verified: the USA holds a current FIG Executive Committee member seat.",
      "Governance and athlete trust are decisive themes here."
    ],
    athleteCapacity:
      "Very high athlete depth and global media relevance.",
    facilities:
      "Very high system capacity and event presentation power.",
    facilityScore: 89,
    politicalPower:
      "Very high, especially when governance and athlete welfare are central.",
    judgesInfluence:
      "Medium-high. Governance optics likely matter more than technical persuasion alone.",
    strategyPath: [
      "Lead with safeguarding, transparency, and athlete trust.",
      "Avoid tactical politics; show executive seriousness.",
      "Translate governance promises into visible operating principles."
    ],
    visualSignals: [
      {
        label: "Executive Seat",
        value: "FIG Member",
        tone: "high",
        note: "Verified"
      },
      {
        label: "Media Weight",
        value: "Very High",
        tone: "high",
        note: "Narrative desk"
      },
      {
        label: "Governance Sensitivity",
        value: "Acute",
        tone: "watch",
        note: "Tone matters"
      }
    ],
    researchStatus: "mixed"
  },
  CAN: {
    languages: ["English", "French"],
    diplomaticAllies: ["safe-sport desks", "measured governance desks"],
    frictionPoints: ["aggressive campaign tone", "thin athlete messaging"],
    achievements: [
      "Verified: Canada holds a current FIG Executive Committee member seat."
    ],
    athleteCapacity:
      "High enough to matter globally, with strong governance sensitivity.",
    facilities:
      "High-quality system and event capacity.",
    facilityScore: 82,
    politicalPower:
      "Medium-high through governance credibility and executive access.",
    judgesInfluence:
      "Medium. Better moved by trust than by technical pressure.",
    strategyPath: [
      "Use measured, serious, athlete-aware language.",
      "Show transparent process and calm leadership.",
      "Connect governance to daily federation reality."
    ],
    visualSignals: [
      {
        label: "Executive Seat",
        value: "FIG Member",
        tone: "high",
        note: "Verified"
      },
      {
        label: "Trust Weight",
        value: "High",
        tone: "watch",
        note: "Safe-sport logic matters"
      },
      {
        label: "Conversion Mode",
        value: "Measured",
        tone: "medium",
        note: "Use disciplined tone"
      }
    ],
    researchStatus: "mixed"
  },
  AUS: {
    languages: ["English"],
    diplomaticAllies: ["OGU desks", "small federation fairness desks"],
    frictionPoints: ["token support promises", "travel-insensitive policy"],
    achievements: [
      "Verified: Australia holds the OGU presidency."
    ],
    athleteCapacity:
      "High inside Oceania with strong ability to influence smaller neighbours.",
    facilities:
      "Very strong regional infrastructure and development capacity.",
    facilityScore: 88,
    politicalPower:
      "High inside Oceania because it anchors regional mood and support structures.",
    judgesInfluence:
      "Medium. Regional leverage is stronger than technical reach.",
    strategyPath: [
      "Show how the candidacy helps the whole region, not just Australia.",
      "Lead with travel, remote education, and small federation fairness.",
      "Treat Australia as a regional anchor, not a single vote."
    ],
    visualSignals: [
      {
        label: "OGU Role",
        value: "President",
        tone: "high",
        note: "Verified continental leadership"
      },
      {
        label: "Regional Reach",
        value: "Anchor",
        tone: "high",
        note: "Can shape surrounding votes"
      },
      {
        label: "Message Need",
        value: "Practical",
        tone: "watch",
        note: "Policy must feel useful"
      }
    ],
    researchStatus: "mixed"
  },
  AZE: {
    languages: ["Azerbaijani", "English", "Russian"],
    diplomaticAllies: ["EG leadership desks", "continuity-leaning contacts"],
    frictionPoints: ["direct confrontation", "personalized contrast"],
    achievements: [
      "Verified: Azerbaijan holds the EG presidency through Farid Gayibov."
    ],
    athleteCapacity:
      "Strong symbolic and hosting profile in the region.",
    facilities:
      "High hosting and presentation optics.",
    facilityScore: 86,
    politicalPower:
      "High in European internal politics and continuity framing.",
    judgesInfluence:
      "Medium-high through network weight rather than one visible TC seat.",
    strategyPath: [
      "Contain rather than over-invest.",
      "Do not personalize the contrast.",
      "Use third-party validators and coalition insulation."
    ],
    visualSignals: [
      {
        label: "Competitive Risk",
        value: "High",
        tone: "watch",
        note: "Track bloc behaviour closely"
      },
      {
        label: "EG Reach",
        value: "President",
        tone: "high",
        note: "Verified continental role"
      },
      {
        label: "Approach",
        value: "Contain",
        tone: "medium",
        note: "Avoid wasting persuasion capital"
      }
    ],
    decisionArchitecture: [
      "Azerbaycan masasındaki karar mantığı, kıta içi ağlar ve başkanlık prestiji üzerinden şekillenir.",
      "EG başkanlığı etkisi, bu masayı yalnız ulusal değil bölgesel bir kaldıraç haline getirir.",
      "Sunum dili değil ağ davranışı daha belirleyicidir."
    ],
    entryChannels: [
      "Doğrudan ikna değil, çevre etkisini sınırlayacak izolasyon stratejisi kullanılmalı.",
      "Üçüncü taraf validatorler ve dost bloklar üzerinden dolaylı temas kurulmalı.",
      "Her temas ölçülü ve kişiselleştirmeden uzak tutulmalı."
    ],
    persuasionPayload: [
      "Bu masada ana amaç oy devşirmekten çok zincirleme etkiyi sınırlamaktır.",
      "Avrupa içi kararsızlara yönelik karşı anlatıyı erken kurmak gerekir.",
      "Rakibin doğal ağına karşı sakin, yayılmış ve disiplinli bir savunma hattı örülmeli."
    ],
    redLines: [
      "Kişisel çatışma görüntüsü verilmemeli.",
      "Doğrudan sert karşılaştırma Azerbaycan masasını daha da sertleştirir.",
      "Aşırı ikna yatırımı kaynak israfına dönüşebilir."
    ],
    congressScenario: [
      "Kongre haftasında bu masaya değil, onun etkilediği çevre ülkelere oynanmalı.",
      "Son pozisyonu yakından izlemek gerekir ama baskılı temas kurulmamalı.",
      "Hedef, zarar sınırlama ve çevre masaların sarkmasını önlemektir."
    ],
    researchStatus: "mixed"
  }
};
