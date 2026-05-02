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
};
