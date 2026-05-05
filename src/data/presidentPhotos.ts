/**
 * Federasyon başkanlarının doğrulanmış fotoğraf URL'leri.
 * IOC ülke kodu → fotoğraf URL'si
 *
 * Her fotoğraf ilgili federasyonun resmi sitesinden veya
 * güvenilir kamuya açık kaynaktan alınmıştır.
 *
 * Kaynak bulunamayanlar için presidentPhotoUrl() fonksiyonu
 * ui-avatars.com üzerinden isim baş harfli avatar üretir.
 */
export const PRESIDENT_PHOTOS: Record<string, string> = {
  // ── Resmi federasyon sitelerinden alınan fotoğraflar ──────────────────

  // Türkiye — Suat Çelen (tcf.gov.tr yönetim kurulu sayfası)
  TUR: "https://www.tcf.gov.tr/wp-content/uploads/2022/09/1-1-e1736431708417.png",

  // Almanya — Alfons Hölzl (dtb.de präsidium sayfası)
  GER: "https://www.dtb.de/fileadmin/_processed_/a/1/csm_Hoelzl-Alfons_cDTB_PictureAlliance_15b171ec62.webp",

  // Fransa — Dominique Mérieux (ffgym.fr resmi sayfa, 2024)
  FRA: "https://www.ffgym.fr/media/1732549759-Dominique%20MERIEUX.png",

  // ABD — Kyle Albrecht (usagym.org liderlik sayfası)
  USA: "https://usagym.org/wp-content/uploads/albrect_kyle-1.jpg",

  // Japonya — Fujita Tadashi (jpn-gym.or.jp hakkımızda sayfası)
  JPN: "https://jpn-gym.or.jp/wp-content/themes/TAISOU/img/about-jga/name_message.png",

  // Ukrayna — Iryna Deriugina (ugf.org.ua yönetim sayfası)
  UKR: "https://ugf.org.ua/wp-content/cache/thumb/2c/319199d9b03522c_224x260.jpg",

  // İtalya — Andrea Facci (andreafacci.it kampanya sitesi, 2024)
  ITA: "https://www.andreafacci.it/sito/wp-content/uploads/2024/12/Andrea-Facci.jpg",

  // ── Wikipedia'dan alınan fotoğraflar (lisans: CC) ─────────────────────

  // Azerbaycan — Mehriban Aliyeva (Wikipedia, 2025 portre)
  AZE: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Mehriban_Aliyeva_-_2025_%28cropped%29.jpg/250px-Mehriban_Aliyeva_-_2025_%28cropped%29.jpg",

  // Polonya — Leszek Blanik (Wikipedia)
  POL: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Leszek_Blanik.jpg/250px-Leszek_Blanik.jpg",

  // Macaristan — Zoltán Magyar (Wikipedia)
  HUN: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Zolt%C3%A1n_Magyar.jpg/250px-Zolt%C3%A1n_Magyar.jpg",

  // İspanya — Jesús Carballo Martínez (Wikipedia, 2016)
  ESP: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jes%C3%BAs_Carballo_Mart%C3%ADnez_2016.jpg/250px-Jes%C3%BAs_Carballo_Mart%C3%ADnez_2016.jpg",

  // Kazakistan — Aliya Yussupova (Wikipedia)
  KAZ: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Alia_Yusupova.JPG/250px-Alia_Yusupova.JPG",

  // ── Federasyon resmi sitelerinden eklenenler ──────────────────────────

  // Finlandiya — Mira Keränen (voimistelu.fi)
  FIN: "https://evermade-voimistelu-website.s3.eu-north-1.amazonaws.com/wp-content/uploads/2024/02/20135058/MiraKeranen.jpg",

  // Sırbistan — Saša Veličković (gssrb.rs)
  SRB: "https://www.gssrb.rs/wp-content/uploads/2020/12/Sasa-VELICKOVIC.jpg",

  // Slovakya — (sgf.sk)
  SVK: "https://www.sgf.sk/userfiles/image/IMG_1915.jpeg",

  // Norveç — (gymogturn.no)
  NOR: "https://gymogturn.no/wp-content/uploads/2019/12/Bilde-26.04.2026-12-41-25-1-300x298.jpg",

  // Arnavutluk — (gjimnastika.al)
  ALB: "https://gjimnastika.al/wp-content/uploads/2024/06/image.png",

  // İsviçre — Fabio Corti (stv-fsg.ch)
  SUI: "https://www.stv-fsg.ch/fileadmin/_processed_/0/b/csm_fabio-corti_4b145b2e5c.webp",

  // Avusturya — (turnsport-austria.at)
  AUT: "https://www.turnsport-austria.at/de/getpic/NBM0l.yDcuCFA/500/",

  // İsveç — Suzanne Lundvall (Wikipedia)
  SWE: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Suzanne_Lundvall_2006_%28cropped%29.jpg/250px-Suzanne_Lundvall_2006_%28cropped%29.jpg",

  // Katar — (qatargym.com)
  QAT: "https://qatargym.com/en/images/hitmi_.jpeg",

  // Yeni Zelanda — Quinton Hall (gymnasticsnz.com)
  NZL: "https://www.gymnasticsnz.com/wp-content/uploads/2024/07/Quinton-Hall-GNZ-Board-4-3-for-web.jpg",

  // Kanada — Michael Downey (gymcan.org)
  CAN: "https://gymcan.org/wp-content/uploads/2026/02/MichaelDowneyHeadshot-1024x1024.jpg",

  // Gürcistan — Konstantin Lashkhi (uggf.ge)
  GEO: "http://www.uggf.ge/files/images/federacia/1kliokj.jpg",

  // Hong Kong — Kenneth FOK (Wikipedia)
  HKG: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kenneth-Fok-Kai-kong.jpg/250px-Kenneth-Fok-Kai-kong.jpg",
};

/**
 * Başkan fotoğraf URL'si döner.
 * Bilinen URL yoksa ui-avatars.com üzerinden isim baş harfli avatar üretir.
 */
export const presidentPhotoUrl = (countryCode: string, presidentName: string): string => {
  const known = PRESIDENT_PHOTOS[countryCode];
  if (known) return known;
  const encoded = encodeURIComponent(presidentName || "??");
  return `https://ui-avatars.com/api/?name=${encoded}&background=1e293b&color=60a5fa&size=256&bold=true&font-size=0.42&format=svg`;
};

/**
 * Hangi ülkelerin gerçek fotoğrafı olduğu (lightbox'ta kaynakla göstermek için)
 */
export const PHOTO_SOURCE: Record<string, { site: string; url: string }> = {
  TUR: { site: "tcf.gov.tr", url: "https://www.tcf.gov.tr/yonetim/" },
  GER: { site: "dtb.de", url: "https://www.dtb.de/deutscher-turner-bund/organisation/praesidium" },
  FRA: { site: "ffgym.fr", url: "https://www.ffgym.fr/La_FFGYM/La_federation/Organisation" },
  USA: { site: "usagym.org", url: "https://usagym.org/about/leadership/" },
  JPN: { site: "jpn-gym.or.jp", url: "https://jpn-gym.or.jp/about/" },
  UKR: { site: "ugf.org.ua", url: "https://ugf.org.ua/federation-administration/" },
  ITA: { site: "andreafacci.it", url: "https://www.andreafacci.it" },
  AZE: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mehriban_Aliyeva" },
  POL: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Leszek_Blanik" },
  HUN: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Zolt%C3%A1n_Magyar" },
  ESP: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Jes%C3%BAs_Carballo" },
  KAZ: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Aliya_Yussupova" },
  FIN: { site: "voimistelu.fi", url: "https://www.voimistelu.fi/en/About-us/Administration/Board-of-directors" },
  SRB: { site: "gssrb.rs", url: "https://www.gssrb.rs/o-savezu/rukovodstvo/" },
  SVK: { site: "sgf.sk", url: "https://www.sgf.sk/prezidentka" },
  NOR: { site: "gymogturn.no", url: "https://gymogturn.no/om-ngi/styret/" },
  ALB: { site: "gjimnastika.al", url: "https://gjimnastika.al/keshilli-drejtues/" },
  SUI: { site: "stv-fsg.ch", url: "https://www.stv-fsg.ch/de/verband/vorstand.html" },
  AUT: { site: "turnsport-austria.at", url: "https://www.turnsport-austria.at/de/verband/praesidium.html" },
  SWE: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Suzanne_Lundvall" },
  QAT: { site: "qatargym.com", url: "https://qatargym.com/en/about-us" },
  NZL: { site: "gymnasticsnz.com", url: "https://www.gymnasticsnz.com/about-us/governance/board/" },
  CAN: { site: "gymcan.org", url: "https://gymcan.org/about/board-of-directors/" },
  GEO: { site: "uggf.ge", url: "https://uggf.ge/en/president" },
  HKG: { site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Kenneth_Fok" },
};
