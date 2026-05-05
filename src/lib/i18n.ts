// ── FIG Strateji Odası — Çeviri Sözlüğü ─────────────────────────────────
export type Lang = "tr" | "en";

export const strings: Record<Lang, Record<string, string>> = {
  tr: {
    // Navigation
    nav_dashboard:   "Durum",
    nav_map:         "Harita",
    nav_countries:   "Federasyonlar",
    nav_promises:    "Vaatler",
    nav_notes:       "Notlar",

    // Header
    hdr_eyebrow:     "FIG Seçim · Suat Çelen",
    hdr_majority:    "çoğunluk için",
    hdr_goal:        "Hedef",
    hdr_total:       "Toplam",

    // Dashboard
    vote_title:      "Oy Durumu",
    vote_supporter:  "destekçi",
    continents_title: "Kıtalar",
    priority_title:  "Öncelikli Hedefler",
    federation_lbl:  "federasyon",
    supporter_lbl:   "destekçi",

    // Status
    status_supporter:   "Destekçi",
    status_watch:       "İzle",
    status_persuadable: "İkna Edilebilir",
    status_resistant:   "Dirençli",
    status_all:         "Tümü",

    // Continents
    continent_EG:   "Avrupa",
    continent_AGU:  "Asya",
    continent_UAG:  "Afrika",
    continent_PAGU: "Amerika",
    continent_OGU:  "Okyanusya",
    continent_all:  "Tüm Kıtalar",

    // Country list
    search_placeholder: "Ülke, başkan, federasyon ara…",
    list_count:         "federasyon",
    open_file:          "Dosya Aç",

    // Dossier tabs
    tab_strategy:     "Strateji",
    tab_contact:      "İletişim",
    tab_disciplines:  "Branşlar",
    tab_sport:        "Spor",
    tab_intelligence: "İstihbarat",

    // Dossier - Strategy tab
    what_want:        "Ne İstiyor?",
    strategic_assess: "Stratejik Değerlendirme",
    entry_channel:    "Temas Kanalı",
    red_line:         "Dikkat Edilecek",
    notes_lbl:        "Notlar",
    add_note:         "Not Ekle",
    all_notes:        "Tümü →",
    note_title_ph:    "Not başlığı",
    note_body_ph:     "Not içeriği…",
    save:             "Kaydet",
    cancel:           "İptal",
    priority_score:   "Öncelik",
    fig_power:        "FIG Gücü",
    relationship:     "İlişki",
    fig_role:         "FIG Rolü",

    // Score info
    score_info_title:   "Öncelik Puanı Nasıl Hesaplanır?",
    score_info_formula: "Durum + İhtiyaç + Etki × 0.42 + (100 − İlişki) × 0.28",

    // Dossier - Contact tab
    president_role:    "Federasyon Başkanı",
    source_lbl:        "Kaynak",
    federation_name:   "Federasyon",
    sec_general:       "Genel Sekreter",
    email_lbl:         "E-posta",
    phone_lbl:         "Telefon",
    pres_phone_lbl:    "Başkan Telefonu",
    website_lbl:       "Website",
    address_lbl:       "Adres",
    disciplines_lbl:   "Branşlar",
    edit_photo:        "Fotoğraf URL'si gir…",
    photo_save:        "Kaydet",
    photo_cancel:      "İptal",
    whatsapp_btn:      "WhatsApp",
    phone_placeholder: "+1 234 567 8900",

    // Dossier - Disciplines tab
    disc_empty:       "Bu federasyon için branş verisi bulunamadı.",
    athlete_retired:  "Emekli",
    athlete_active:   "Aktif",
    other_disciplines:"Diğer Branşlar",
    no_athlete_data:  "Kayıtlı sporcu/başarı verisi yok",

    // Dossier - Sport tab
    facilities_title:    "Tesis & Altyapı",
    infra_score:         "Altyapı Skoru",
    key_stats:           "Anahtar İstatistikler",
    relationship_power:  "İlişki Gücü",
    impact_score:        "Etki Puanı",
    facilities_lbl:      "Tesis",
    achievements_lbl:    "Başarılar",
    national_team:       "Milli Takım Profili",
    fig_roles:           "FIG Rolleri",
    host_events:         "Ev Sahipliği",
    sport_empty:         "Bu federasyon için spor verisi bulunamadı.",

    // Dossier - Intelligence tab
    data_quality:        "Veri Kalitesi",
    verified:            "Doğrulanmış",
    mixed:               "Kısmen Doğrulanmış",
    seed:                "Taslak Veri",
    open_tasks:          "Açık Araştırma Görevleri",
    priority_high:       "Yüksek",
    priority_medium:     "Orta",
    priority_low:        "Düşük",
    contact_history:     "Temas Geçmişi",
    diplomatic_allies:   "Diplomatik Müttefikler",
    friction_points:     "Sürtüşme Noktaları",
    sources_lbl:         "Kaynaklar",
    intelligence_empty:  "Bu federasyon için istihbarat verisi bulunmuyor.",

    // Notes page
    new_note:            "Yeni Not",
    active_lbl:          "Aktif",
    completed_lbl:       "Tamamlandı",
    no_notes:            "Henüz not yok. Federasyon seç ve not ekle.",
    back_to_file:        "Dosyasına Dön",
    note_add_btn:        "Not Ekle",

    // Promises page
    promises_title:       "Vaatler",
    promises_active:      "Aktif",
    promises_archive:     "Arşiv",
    promises_all:         "Tüm Liste",
    add_promise:          "Vaat Ekle",
    promise_text_ph:      "Vaat içeriği…",
    promise_countries:    "Ülkeler (boş = genel)",
    promise_category:     "Kategori",
    promise_date_given:   "Verilme Tarihi",
    promise_due_date:     "Beklenen Teslim",
    promise_status:       "Durum",
    promise_notes:        "Notlar (isteğe bağlı)",
    promise_save:         "Kaydet",
    promise_cancel:       "İptal",
    promise_delete:       "Sil",
    promise_edit:         "Düzenle",
    promise_empty:        "Henüz vaat eklenmedi.",
    promise_empty_active: "Aktif vaat bulunmuyor.",
    promise_empty_archive:"Arşivde kayıt yok.",
    promise_general:      "Genel",
    pstatus_verildi:      "Verildi",
    pstatus_devam:        "Devam Ediyor",
    pstatus_tamamlandi:   "Tamamlandı",
    pstatus_iptal:        "İptal",
    pcat_finansman:       "Finansman",
    pcat_etkinlik:        "Etkinlik",
    pcat_egitim:          "Eğitim",
    pcat_teknik:          "Teknik Destek",
    pcat_yonetisim:       "Yönetişim",
    pcat_diger:           "Diğer",

    // Common
    close:    "Kapat",
    edit:     "Düzenle",
    delete:   "Sil",
    loading:  "Yükleniyor…",
    empty:    "Veri yok",
  },

  en: {
    // Navigation
    nav_dashboard:   "Overview",
    nav_map:         "Map",
    nav_countries:   "Federations",
    nav_promises:    "Promises",
    nav_notes:       "Notes",

    // Header
    hdr_eyebrow:     "FIG Election · Suat Çelen",
    hdr_majority:    "for majority",
    hdr_goal:        "Target",
    hdr_total:       "Total",

    // Dashboard
    vote_title:      "Vote Status",
    vote_supporter:  "supporters",
    continents_title: "Continents",
    priority_title:  "Priority Targets",
    federation_lbl:  "federations",
    supporter_lbl:   "supporters",

    // Status
    status_supporter:   "Supporter",
    status_watch:       "Watch",
    status_persuadable: "Persuadable",
    status_resistant:   "Resistant",
    status_all:         "All",

    // Continents
    continent_EG:   "Europe",
    continent_AGU:  "Asia",
    continent_UAG:  "Africa",
    continent_PAGU: "Americas",
    continent_OGU:  "Oceania",
    continent_all:  "All Continents",

    // Country list
    search_placeholder: "Search country, president, federation…",
    list_count:         "federations",
    open_file:          "Open File",

    // Dossier tabs
    tab_strategy:     "Strategy",
    tab_contact:      "Contact",
    tab_disciplines:  "Disciplines",
    tab_sport:        "Sport",
    tab_intelligence: "Intelligence",

    // Dossier - Strategy tab
    what_want:        "Primary Need?",
    strategic_assess: "Strategic Assessment",
    entry_channel:    "Entry Channel",
    red_line:         "Red Lines",
    notes_lbl:        "Notes",
    add_note:         "Add Note",
    all_notes:        "All →",
    note_title_ph:    "Note title",
    note_body_ph:     "Note content…",
    save:             "Save",
    cancel:           "Cancel",
    priority_score:   "Priority",
    fig_power:        "FIG Power",
    relationship:     "Relationship",
    fig_role:         "FIG Role",

    // Score info
    score_info_title:   "How Is the Priority Score Calculated?",
    score_info_formula: "Status + Need + Influence × 0.42 + (100 − Relationship) × 0.28",

    // Dossier - Contact tab
    president_role:    "Federation President",
    source_lbl:        "Source",
    federation_name:   "Federation",
    sec_general:       "Secretary General",
    email_lbl:         "Email",
    phone_lbl:         "Phone",
    pres_phone_lbl:    "President's Phone",
    website_lbl:       "Website",
    address_lbl:       "Address",
    disciplines_lbl:   "Disciplines",
    edit_photo:        "Enter photo URL…",
    photo_save:        "Save",
    photo_cancel:      "Cancel",
    whatsapp_btn:      "WhatsApp",
    phone_placeholder: "+1 234 567 8900",

    // Dossier - Disciplines tab
    disc_empty:       "No discipline data found for this federation.",
    athlete_retired:  "Retired",
    athlete_active:   "Active",
    other_disciplines:"Other Disciplines",
    no_athlete_data:  "No registered athletes or achievement data",

    // Dossier - Sport tab
    facilities_title:    "Facilities & Infrastructure",
    infra_score:         "Infrastructure Score",
    key_stats:           "Key Statistics",
    relationship_power:  "Relationship Strength",
    impact_score:        "Influence Score",
    facilities_lbl:      "Facilities",
    achievements_lbl:    "Achievements",
    national_team:       "National Team Profile",
    fig_roles:           "FIG Roles",
    host_events:         "Hosted Events",
    sport_empty:         "No sport data found for this federation.",

    // Dossier - Intelligence tab
    data_quality:        "Data Quality",
    verified:            "Verified",
    mixed:               "Partially Verified",
    seed:                "Draft Data",
    open_tasks:          "Open Research Tasks",
    priority_high:       "High",
    priority_medium:     "Medium",
    priority_low:        "Low",
    contact_history:     "Contact History",
    diplomatic_allies:   "Diplomatic Allies",
    friction_points:     "Friction Points",
    sources_lbl:         "Sources",
    intelligence_empty:  "No intelligence data found for this federation.",

    // Notes page
    new_note:            "New Note",
    active_lbl:          "Active",
    completed_lbl:       "Completed",
    no_notes:            "No notes yet. Select a federation and add a note.",
    back_to_file:        "Back to File",
    note_add_btn:        "Add Note",

    // Promises page
    promises_title:       "Promises",
    promises_active:      "Active",
    promises_archive:     "Archive",
    promises_all:         "Full List",
    add_promise:          "Add Promise",
    promise_text_ph:      "Promise content…",
    promise_countries:    "Countries (empty = general)",
    promise_category:     "Category",
    promise_date_given:   "Date Given",
    promise_due_date:     "Expected Delivery",
    promise_status:       "Status",
    promise_notes:        "Notes (optional)",
    promise_save:         "Save",
    promise_cancel:       "Cancel",
    promise_delete:       "Delete",
    promise_edit:         "Edit",
    promise_empty:        "No promises added yet.",
    promise_empty_active: "No active promises.",
    promise_empty_archive:"No archived records.",
    promise_general:      "General",
    pstatus_verildi:      "Given",
    pstatus_devam:        "In Progress",
    pstatus_tamamlandi:   "Completed",
    pstatus_iptal:        "Cancelled",
    pcat_finansman:       "Funding",
    pcat_etkinlik:        "Events",
    pcat_egitim:          "Training",
    pcat_teknik:          "Technical Support",
    pcat_yonetisim:       "Governance",
    pcat_diger:           "Other",

    // Common
    close:    "Close",
    edit:     "Edit",
    delete:   "Delete",
    loading:  "Loading…",
    empty:    "No data",
  }
};

/** Çeviri fonksiyonu — anahtar bulunamazsa Türkçeye düşer, o da yoksa anahtarı döner */
export const t = (lang: Lang, key: string): string =>
  strings[lang]?.[key] ?? strings["tr"]?.[key] ?? key;
