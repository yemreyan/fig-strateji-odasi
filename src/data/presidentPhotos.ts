/**
 * Federasyon başkanlarının doğrulanmış fotoğraf URL'leri.
 * IOC ülke kodu → fotoğraf URL'si
 *
 * Kaynak bulunamayanlar için presidentPhotoUrl() fonksiyonu
 * ui-avatars.com üzerinden isim baş harfli avatar üretir.
 */
export const PRESIDENT_PHOTOS: Record<string, string> = {
  // Türkiye — Suat Çelen (turksporvakfi.org, 2024)
  TUR: "https://i0.wp.com/turksporvakfi.org/wp-content/uploads/2024/10/464288936_943784697790607_3234894052039949345_n.jpg",

  // ABD — Kyle Albrecht (usagym.org)
  USA: "https://usagym.org/wp-content/uploads/albrect_kyle-1.jpg",

  // Azerbaycan — Mehriban Aliyeva (Wikipedia, 2025)
  AZE: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Mehriban_Aliyeva_-_2025_%28cropped%29.jpg/250px-Mehriban_Aliyeva_-_2025_%28cropped%29.jpg",

  // Polonya — Leszek Blanik (Wikipedia)
  POL: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Leszek_Blanik.jpg/250px-Leszek_Blanik.jpg",

  // Macaristan — Zoltán Magyar (Wikipedia)
  HUN: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Zolt%C3%A1n_Magyar.jpg/250px-Zolt%C3%A1n_Magyar.jpg",

  // İspanya — Jesús Carballo Martínez (Wikipedia, 2016)
  ESP: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jes%C3%BAs_Carballo_Mart%C3%ADnez_2016.jpg/250px-Jes%C3%BAs_Carballo_Mart%C3%ADnez_2016.jpg",

  // Kazakistan — Aliya Yussupova (Wikipedia)
  KAZ: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Alia_Yusupova.JPG/250px-Alia_Yusupova.JPG",

  // Fransa — Dominique Mérieux (ffgym.fr, 2024)
  FRA: "https://www.ffgym.fr/media/1732367382-content_details-1732367381-Visuel%20carr%C3%A9%20DM.png",

  // Ukrayna — Iryna Deriugina (Wikipedia)
  UKR: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Deryugina_Irina_1981.jpg/250px-Deryugina_Irina_1981.jpg",
};

/**
 * Başkan fotoğraf URL'si döner.
 * Bilinen URL yoksa ui-avatars.com üzerinden isim baş harfli avatar üretir.
 */
export const presidentPhotoUrl = (countryCode: string, presidentName: string): string => {
  const known = PRESIDENT_PHOTOS[countryCode];
  if (known) return known;
  // isimden baş harfli avatar (ui-avatars.com)
  const encoded = encodeURIComponent(presidentName || "??");
  return `https://ui-avatars.com/api/?name=${encoded}&background=1e293b&color=60a5fa&size=128&bold=true&font-size=0.42&format=svg`;
};
