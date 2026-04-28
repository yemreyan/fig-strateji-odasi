import type { CountryRoadmapInput, RoadmapStep } from "../types";

const needLanguage = {
  continuity: {
    month2: "İstikrar Kanıtı",
    objective: "Güveni korurken teslimatın nerede güçleneceğini net göster.",
    deliverable: "Mirası koruyan kısa brifing ve istikrar soru-cevap notu."
  },
  development: {
    month2: "Gelişim Paketi",
    objective: "Gelişim vaadini somut destek başlıklarına çevir.",
    deliverable: "Ekipman, eğitim ve dayanışma fonu taslağı."
  },
  funding: {
    month2: "Destek Ekonomisi",
    objective: "Fonlama, seyahat desteği ve uzaktan erişim modelini görünür kıl.",
    deliverable: "Küçük federasyon destek notu ve seyahat mantığı."
  },
  visibility: {
    month2: "Görünürlük Teklifi",
    objective: "Sporcu tanıtımı ve dijital erişimi federasyon değerine bağla.",
    deliverable: "Sporcu vitrin paketi ve içerik desteği seti."
  },
  governance: {
    month2: "Yönetişim Güveni",
    objective: "Şeffaflık, safeguarding ve kurumsal ciddiyeti açık hale getir.",
    deliverable: "Süreç taahhütlerini içeren yönetişim notu."
  },
  fairness: {
    month2: "Teknik Güven",
    objective: "Hakemlik, standartlar ve teknik bütünlük etrafında güven inşa et.",
    deliverable: "Hakemlik ve adalet reform notu."
  },
  events: {
    month2: "Etkinlik Değeri",
    objective: "Daha iyi ev sahipliği ekonomisi, temiz formatlar ve güçlü paketleme göster.",
    deliverable: "Ev sahibi desteği ve etkinlik değeri notu."
  }
} as const;

export const buildCountryRoadmap = (
  input: CountryRoadmapInput
): RoadmapStep[] => {
  const needBlock = needLanguage[input.primaryNeed];

  return [
    {
      month: "Ay 1",
      focus: "Dinleme Sprinti",
      objective: `${input.countryName} için kapalı bir dinleme turu yap; karar vericileri, güvenilen doğrulayıcıları ve görünmeyen blokajları haritala.`,
      deliverable: "Karar haritası, ilişki riskleri ve iki cümlelik giriş brifingi."
    },
    {
      month: "Ay 2",
      focus: needBlock.month2,
      objective: needBlock.objective,
      deliverable: needBlock.deliverable
    },
    {
      month: "Ay 3",
      focus: "Doğrulayıcı Hizalaması",
      objective:
        "Dolaylı doğrulayıcıları, kıta köprülerini ve güvenilen eş federasyonları devreye alarak güveni pekiştir.",
      deliverable: "Doğrulayıcı listesi, temas takvimi ve kişiselleştirilmiş konuşma başlıkları."
    },
    {
      month: "Ay 4",
      focus: "Teklif Dönüşümü",
      objective:
        "Genel sempatiyi, federasyonun içeride savunabileceği somut bir değer teklifine çevir.",
      deliverable: "Federasyona dönük değer notu ve itiraz takip listesi."
    },
    {
      month: "Ay 5",
      focus: "Delege Kilidi",
      objective:
        "Muhtemel oy kullanacak kişiyi, kongre katılımını ve son tereddüt noktalarını teyit et.",
      deliverable: "Delege kontrol listesi ve son ikna notu."
    },
    {
      month: "Ay 6",
      focus: "Taahhüt Kilidi",
      objective: `Yumuşak desteği açık taahhüde çevir; oy akışkan kalırsa ilişkiyi koru. Mevcut ilişki skoru: ${input.relationshipStrength}.`,
      deliverable: "Taahhüt durumu güncellemesi, kongre konuşma planı ve takip sahibi."
    }
  ];
};
