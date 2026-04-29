// ── Bireysel Sporcu Veri Tabanı ──────────────────────────────────────────
// FIG Seçim Stratejisi — Temel ülkeler için isim bazlı sporcu profilleri

export type AthleteDiscipline = "MAG" | "WAG" | "RG" | "TRA" | "ACRO" | "AER" | "PK" | "GFA";

export interface Athlete {
  name: string;
  discipline: AthleteDiscipline;
  gender?: "E" | "K";
  highlights: string[];   // kısa başarı notları (Türkçe)
  worldRanking?: number;
  active?: boolean;       // hâlâ aktif mi
}

export const athletesByCode: Record<string, Athlete[]> = {

  // ── AMERİKA ───────────────────────────────────────────────────────────
  USA: [
    { name: "Simone Biles",      discipline: "WAG", gender: "K", active: true,
      highlights: ["7× Dünya Şampiyonu", "4× Olimpiyat altın madalyası", "GOAT unvanı"] },
    { name: "Jade Carey",        discipline: "WAG", gender: "K", active: true,
      highlights: ["2020 Tokyo Olimpiyat şampiyonu (serbest"] },
    { name: "Brody Malone",      discipline: "MAG", gender: "E", active: true,
      highlights: ["2023 Dünya Şampiyonu (çok disiplin)", "2× ABD Şampiyonu"] },
    { name: "Paul Juda",         discipline: "MAG", gender: "E", active: true,
      highlights: ["2024 Paris Olimpiyat takım üyesi"] },
    { name: "Katelyn Ohashi",    discipline: "WAG", gender: "K", active: false,
      highlights: ["UCLA Şampiyonu", "Viral 10.0 performansı"] },
    { name: "Donnell Whittenburg", discipline: "TRA", gender: "E", active: true,
      highlights: ["Trampolin Olimpiyat madalyacısı"] },
  ],

  CHN: [
    { name: "Zhang Boheng",      discipline: "MAG", gender: "E", active: true,
      highlights: ["2023 Dünya Şampiyonu (çok disiplin)", "Çok disiplin dünya rekoru"] },
    { name: "Liu Yang",          discipline: "MAG", gender: "E", active: true,
      highlights: ["2020 Tokyo Olimpiyat şampiyonu (halka)", "2× Dünya Şampiyonu"] },
    { name: "Xiao Ruoteng",      discipline: "MAG", gender: "E", active: true,
      highlights: ["Çok disiplin Dünya Şampiyonu (2018)"] },
    { name: "Deng Shudi",        discipline: "WAG", gender: "K", active: true,
      highlights: ["Takım Dünya Şampiyonu 2023", "Çin Milli Takımı Kaptanı"] },
    { name: "Chen Yile",         discipline: "WAG", gender: "K", active: true,
      highlights: ["2020 Tokyo takım altın madalyası"] },
    { name: "Guan Chenchen",     discipline: "WAG", gender: "K", active: true,
      highlights: ["2020 Tokyo Olimpiyat şampiyonu (denge tahtası)"] },
    { name: "Zhu Xueying",       discipline: "TRA", gender: "K", active: true,
      highlights: ["Trampolin Olimpiyat şampiyonu 2020"] },
  ],

  JPN: [
    { name: "Kohei Uchimura",    discipline: "MAG", gender: "E", active: false,
      highlights: ["2× Olimpiyat şampiyonu", "6× Dünya Şampiyonu", "Tüm zamanların en iyisi"] },
    { name: "Daiki Hashimoto",   discipline: "MAG", gender: "E", active: true,
      highlights: ["2020 Tokyo Olimpiyat şampiyonu (çok dis.)", "2022-23 Dünya Şampiyonu"] },
    { name: "Kazuma Kaya",       discipline: "MAG", gender: "E", active: true,
      highlights: ["Takım Olimpiyat şampiyonu 2020"] },
    { name: "Hitomi Hatakeda",   discipline: "WAG", gender: "K", active: true,
      highlights: ["Olimpiyat takım üyesi 2020"] },
  ],

  RUS: [
    { name: "Artur Dalaloyan",   discipline: "MAG", gender: "E", active: true,
      highlights: ["2018 Dünya Şampiyonu (çok disiplin)", "ROC takım altın madalyası 2020"] },
    { name: "Nikita Nagornyy",   discipline: "MAG", gender: "E", active: true,
      highlights: ["2019 Dünya Şampiyonu (çok disiplin)", "ROC takım altın madalyası 2020"] },
    { name: "Angelina Melnikova", discipline: "WAG", gender: "K", active: true,
      highlights: ["ROC takım altın madalyası 2020", "2019 Dünya Şampiyonu (serbest hareketler)"] },
    { name: "Dina Averina",      discipline: "RG", gender: "K", active: false,
      highlights: ["2018-19 Dünya Şampiyonu (çok disiplin)", "2020 Olimpiyat gümüş"] },
    { name: "Arina Averina",     discipline: "RG", gender: "K", active: false,
      highlights: ["Dünya Şampiyonluğu madalyaları", "İkiz kardeşi Dina ile birlikte"] },
  ],

  GBR: [
    { name: "Max Whitlock",      discipline: "MAG", gender: "E", active: true,
      highlights: ["3× Olimpiyat şampiyonu (at üstü)", "6× Dünya Şampiyonu (at üstü)"] },
    { name: "Joe Fraser",        discipline: "MAG", gender: "E", active: true,
      highlights: ["2019 Dünya Şampiyonu (paralel bar)", "Olimpiyat madalyacısı"] },
    { name: "Georgia-Mae Fenton", discipline: "WAG", gender: "K", active: true,
      highlights: ["Avrupa Şampiyonası madalyaları"] },
  ],

  GER: [
    { name: "Andreas Bretschneider", discipline: "MAG", gender: "E", active: false,
      highlights: ["Olimpiyat ve Dünya Şampiyonası madalyaları"] },
    { name: "Fabian Hambüchen",  discipline: "MAG", gender: "E", active: false,
      highlights: ["2016 Rio Olimpiyat şampiyonu (yatay bar)", "Dünya Şampiyonu"] },
    { name: "Lukas Dauser",      discipline: "MAG", gender: "E", active: true,
      highlights: ["2020 Tokyo Olimpiyat gümüş (paralel bar)", "2022 Avrupa Şampiyonu"] },
  ],

  FRA: [
    { name: "Samir Aït Saïd",    discipline: "MAG", gender: "E", active: true,
      highlights: ["2015 Dünya Şampiyonu (halka)", "Paris 2024 olimpiyat takımı"] },
    { name: "Mélanie De Jesus dos Santos", discipline: "WAG", gender: "K", active: true,
      highlights: ["Avrupa Şampiyonası madalyaları", "Fransa'nın yıldızı"] },
    { name: "Coline Devillard",   discipline: "WAG", gender: "K", active: true,
      highlights: ["Avrupa Şampiyonası finalistleri"] },
  ],

  ITA: [
    { name: "Carlo Macchini",    discipline: "MAG", gender: "E", active: true,
      highlights: ["Paralel bar uzmanı", "Olimpiyat takım üyesi"] },
    { name: "Alice D'Amato",     discipline: "WAG", gender: "K", active: true,
      highlights: ["2024 Paris Olimpiyat şampiyonu (denge)", "Avrupa Şampiyonu"] },
    { name: "Manila Esposito",   discipline: "WAG", gender: "K", active: true,
      highlights: ["2024 Paris Olimpiyat Dünya Şampiyonu (takım)"] },
    { name: "Giorgia Villa",     discipline: "WAG", gender: "K", active: true,
      highlights: ["Avrupa Şampiyonası madalyaları"] },
    { name: "Milad Karimi",      discipline: "MAG", gender: "E", active: true,
      highlights: ["İtalya için doğallaştırılmış Kazak sporcu", "Olimpiyat madalyacısı"] },
  ],

  UKR: [
    { name: "Oleg Verniaiev",    discipline: "MAG", gender: "E", active: false,
      highlights: ["2016 Rio Olimpiyat şampiyonu (paralel bar)", "2014 Dünya Şampiyonu"] },
    { name: "Igor Radivilov",    discipline: "MAG", gender: "E", active: true,
      highlights: ["Olimpiyat ve Dünya Şampiyonası madalyaları (sıçrama tahtası)"] },
    { name: "Illia Kovtun",      discipline: "MAG", gender: "E", active: true,
      highlights: ["2022-23 Dünya Şampiyonası madalyaları", "Genç Türkiye yıldızı"] },
  ],

  AZE: [
    { name: "Milad Karimi",      discipline: "MAG", gender: "E", active: true,
      highlights: ["Azerbaycan'ın en başarılı cimnastikçisi", "Olimpiyat madalyacısı"] },
    { name: "Şəhriyar Hüseynov", discipline: "MAG", gender: "E", active: true,
      highlights: ["Avrupa Şampiyonası katılımcısı"] },
    { name: "Marina Nekrasova",  discipline: "RG", gender: "K", active: true,
      highlights: ["Ritmik jimnastikte Azerbaycan'ı temsil"] },
    { name: "Lala Yusifova",     discipline: "RG", gender: "K", active: true,
      highlights: ["Dünya Şampiyonası katılımcısı"] },
  ],

  KAZ: [
    { name: "Adem Asil",         discipline: "MAG", gender: "E", active: true,
      highlights: ["Dünya Şampiyonası katılımcısı"] },
    { name: "Milad Karimi",      discipline: "MAG", gender: "E", active: false,
      highlights: ["Eski Kazak sporcu, İtalya'ya transfer"] },
    { name: "Zarina Agafonova",  discipline: "TRA", gender: "K", active: true,
      highlights: ["Trampolin Dünya Kupası katılımcısı"] },
    { name: "Alexander Danilov", discipline: "TRA", gender: "E", active: true,
      highlights: ["Trampolin Dünya Şampiyonası madalyacısı"] },
  ],

  UZB: [
    { name: "Oksana Chusovitina", discipline: "WAG", gender: "K", active: false,
      highlights: ["EFSANE: 9 Olimpiyat oyunu", "40+ yaşında aktif sporcu", "FIG Spor için Olimpik sözlükte"] },
    { name: "Dilorom Abdullayeva", discipline: "WAG", gender: "K", active: true,
      highlights: ["Özbek cimnastik yeni nesli"] },
  ],

  BLR: [
    { name: "Ivan Stretovich",   discipline: "TRA", gender: "E", active: true,
      highlights: ["Trampolin Dünya Şampiyonu"] },
    { name: "Vitaly Kozlov",     discipline: "TRA", gender: "E", active: true,
      highlights: ["Trampolin Olimpiyat madalyacısı"] },
  ],

  ROU: [
    { name: "Nadia Comăneci",    discipline: "WAG", gender: "K", active: false,
      highlights: ["TARİHİ: İlk 10.0 puanı", "5× Olimpiyat altın", "Jimnastik tarihinin simgesi"] },
    { name: "Larisa Iordache",   discipline: "WAG", gender: "K", active: false,
      highlights: ["3× Dünya Şampiyonu (denge)", "Olimpiyat madalyacısı"] },
  ],

  BUL: [
    { name: "Silviya Miteva",    discipline: "RG", gender: "K", active: false,
      highlights: ["Ritmik Jimnastik Dünya Şampiyonası madalyaları"] },
    { name: "Boryana Kaleyn",    discipline: "RG", gender: "K", active: true,
      highlights: ["Ritmik jimnastik Avrupa ve Dünya madalyaları"] },
    { name: "Stiliana Nikolova", discipline: "RG", gender: "K", active: true,
      highlights: ["Avrupa ve Dünya Şampiyonası madalyaları"] },
  ],

  HUN: [
    { name: "Krisztián Berki",   discipline: "MAG", gender: "E", active: false,
      highlights: ["2012 Londra Olimpiyat şampiyonu (at üstü)", "Dünya Şampiyonu"] },
    { name: "Zoltán Böröcz",     discipline: "TRA", gender: "E", active: false,
      highlights: ["Trampolin Olimpiyat madalyacısı"] },
  ],

  NED: [
    { name: "Epke Zonderland",   discipline: "MAG", gender: "E", active: false,
      highlights: ["'Vliegende Fries' lakaplı", "Dünya Şampiyonu (yatay bar)", "Dünya rekoru skorları"] },
    { name: "Sanna Veerman",     discipline: "WAG", gender: "K", active: true,
      highlights: ["Hollanda kadın takımı liderlerinden"] },
  ],

  GRE: [
    { name: "Eleftherios Petrounias", discipline: "MAG", gender: "E", active: true,
      highlights: ["2016 Rio Olimpiyat şampiyonu (halka)", "4× Dünya Şampiyonu (halka)", "Yunanistan'ın gururu"] },
  ],

  AUS: [
    { name: "Georgia Godwin",    discipline: "WAG", gender: "K", active: true,
      highlights: ["2023 Dünya Şampiyonu (çok disiplin)", "Paris 2024 Olimpiyat madalyacısı"] },
    { name: "James Bacueti",     discipline: "MAG", gender: "E", active: true,
      highlights: ["Avustralya milli takımı kaptanı"] },
  ],

  BRA: [
    { name: "Rebeca Andrade",    discipline: "WAG", gender: "K", active: true,
      highlights: ["2024 Paris Olimpiyat şampiyonu (serbest hareketler)", "2021 Olimpiyat gümüş", "Brezilya'nın gururu"] },
    { name: "Arthur Zanetti",    discipline: "MAG", gender: "E", active: false,
      highlights: ["2012 Londra Olimpiyat şampiyonu (halka)"] },
    { name: "Diego Hypolito",    discipline: "MAG", gender: "E", active: false,
      highlights: ["Brezilya'nın efsane cimnastikçisi", "Dünya madalyaları"] },
  ],

  KOR: [
    { name: "Yang Tae-young",    discipline: "MAG", gender: "E", active: false,
      highlights: ["2004 Atina Olimpiyat altını (paralel bar)", "Kore cimnastiğinin efsanesi"] },
    { name: "Son Yun-seong",     discipline: "MAG", gender: "E", active: true,
      highlights: ["Avrupa Şampiyonası finalist"] },
  ],

  TUR: [
    { name: "İbrahim Çolak",     discipline: "MAG", gender: "E", active: true,
      highlights: ["2019 Dünya Şampiyonu (halka)", "Türkiye'nin ilk jimnastik Dünya Şampiyonu", "Olimpiyat madalyacısı"] },
    { name: "Adem Asil",         discipline: "MAG", gender: "E", active: true,
      highlights: ["Gençlik olimpiyat madalyası", "Dünya Şampiyonası katılımcısı"] },
    { name: "Ferhat Arıcan",     discipline: "MAG", gender: "E", active: true,
      highlights: ["Paralel bar uzmanı", "Olimpiyat madalyacısı", "Türk cimnastiğinin yükselen yıldızı"] },
    { name: "Ahmet Önder",       discipline: "MAG", gender: "E", active: true,
      highlights: ["Milli takım üyesi"] },
  ],

  EGY: [
    { name: "Ahmed Ali Ahmed",   discipline: "MAG", gender: "E", active: true,
      highlights: ["Afrika Şampiyonu", "Olimpiyat katılımcısı"] },
  ],

  COL: [
    { name: "Angela Hernández",  discipline: "TRA", gender: "K", active: true,
      highlights: ["Dünya Şampiyonası madalyaları (trampolin)", "Kolombiya'nın trampolin yıldızı"] },
    { name: "Jossimar Calvo",    discipline: "MAG", gender: "E", active: true,
      highlights: ["Pan Am şampiyonu", "Olimpiyat katılımcısı"] },
  ],

  QAT: [
    { name: "Marian Drăgulescu", discipline: "MAG", gender: "E", active: false,
      highlights: ["Eski Rumen sporcu", "2× Dünya Şampiyonu (sıçrama tahtası)", "Katar için yarışmış"] },
  ],

  ISR: [
    { name: "Linoy Ashram",      discipline: "RG", gender: "K", active: true,
      highlights: ["2020 Tokyo Olimpiyat şampiyonu (bireysel)", "2× Dünya Şampiyonu"] },
    { name: "Nicol Zelikman",    discipline: "RG", gender: "K", active: true,
      highlights: ["Dünya Şampiyonası madalyaları"] },
  ],

  CAN: [
    { name: "Ellie Black",       discipline: "WAG", gender: "K", active: true,
      highlights: ["5× Dünya Şampiyonası madalyası", "Olimpiyat madalyacısı", "Kanada'nın gururu"] },
    { name: "Zachary Clay",      discipline: "MAG", gender: "E", active: true,
      highlights: ["Kanada milli takımı"] },
  ],

  SUI: [
    { name: "Giulia Steingruber", discipline: "WAG", gender: "K", active: true,
      highlights: ["2016 Rio Olimpiyat bronz (sıçrama tahtası)", "Avrupa Şampiyonu"] },
    { name: "Eddy Yusof",        discipline: "MAG", gender: "E", active: true,
      highlights: ["Avrupa Şampiyonası katılımcısı"] },
  ],
};
