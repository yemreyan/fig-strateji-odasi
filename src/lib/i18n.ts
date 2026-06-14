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
    sec_phone_lbl:     "Genel Sekreter Telefonu",
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

    // Navigation (new)
    nav_war_room:           "⚔️ Savaş Odası",
    nav_war_room_short:     "⚔️ Savaş",
    nav_calendar:           "📅 Takvim",
    nav_congress_city:      "🏛️ Kongre Şehri",
    nav_congress_city_short:"🏛️ Şehir",

    // Congress Countdown
    days_left:              "gün kaldı",
    fig_congress_oct_2026:  "⏱ FIG Kongresi · Ekim 2026",
    critical_dates:         "KRİTİK TARİHLER",
    country_count_suffix:   "ülke",

    // Trend / Status History
    trend_this_month:       "📈 Bu Ay",
    gained_suffix:          "kazanıldı",
    lost_suffix:            "kaybedildi",
    status_history:         "DURUM GEÇMİŞİ",

    // WhatsApp Template
    whatsapp_draft:         "📋 WhatsApp Taslağı",
    copy_btn:               "📋 Kopyala",
    copied_btn:             "✓ Kopyalandı!",

    // Print
    print_briefing:         "🖨️ Yazdır",

    // Strategy / Presentation
    strategic_metrics:      "STRATEJİK METRİKLER",
    facilities_org:         "TESİS & ORGANİZASYON",
    fig_roles_title:        "FIG ROLLERİ",
    athlete_capacity_title: "SPORCU KAPASİTESİ",

    // Competitor
    competitor_status:      "⚔️ Rakip Durumu",
    competitor_name_ph:     "Rakip adı",
    competitor_supporters_ph:"Destekçi ülke kodları (virgülle: USA, GBR, FRA)",
    competitor_votes_ph:    "Tahmini oy sayısı",
    est_votes:              "tahmini oy",
    known_supporters:       "BİLİNEN DESTEKÇİLER",
    no_competitor_info:     "Rakip bilgisi girilmedi. Düzenle butonuna tıklayın.",
    suat_celen:             "Suat Çelen",

    // Commitment Level
    commitment_level:       "TAAHHÜT SEVİYESİ",
    commit_no_contact:      "Temas yok",
    commit_introduced:      "Tanışma yapıldı",
    commit_interested:      "İlgi gösterdi",
    commit_verbal_yes:      "Sözlü olumlu",
    commit_firm_yes:        "Kesin taahhüt",
    commit_written:         "Yazılı taahhüt",
    firm_commitment:        "Kesin taahhüt",
    written_commitment:     "Yazılı taahhüt",

    // Congress Attendance
    congress_attendance:    "KONGRE KATILIMI",
    att_confirmed:          "Kesin gelecek",
    att_likely:             "Büyük ihtimalle",
    att_uncertain:          "Belirsiz",
    att_no:                 "Gelmeyecek",
    att_unknown:            "Bilinmiyor",
    attendance_note_ph:     "Not (seyahat desteği, delegasyon vb.)",
    real_vote_estimate:     "✈️ Gerçek oy tahmini (katılım × taahhüt): ",

    // City Vote (Istanbul vs Roma)
    congress_city_title:    "🏛️ Kongre Şehri Tercihi",
    congress_city_subtitle: "İstanbul mu, Roma mı? — FIG Kongresi'ne ev sahipliği yapacak şehir oylaması.",
    istanbul_candidacy:     "Türkiye adaylığı",
    rome_candidacy:         "İtalya adaylığı",
    federations_support:    "federasyon destekliyor",
    undecided:              "❓ Kararsız",
    unknown_lbl:            "⚫ Bilinmiyor",
    gap:                    "🎯 Fark",
    continent_distribution: "🌍 Kıta Bazlı Dağılım",
    all_lbl:                "Tümü",
    host_city_preference:   "🏛️ KONGRE ŞEHRİ TERCİHİ",
    city_vote_note_ph:      "Şehir tercihi notu (ne dedi, neden bu tercih...)",
    host_city_mini:         "🏛️ KONGRE ŞEHRİ",
    detail_arrow:           "Detay →",
    first_n_shown:          "İlk 60 federasyon gösteriliyor (toplam",

    // War Room
    war_room_title:         "⚔️ Savaş Odası",
    what_to_do_today:       "Bugün ne yapmalısın?",
    urgent_persuadable_title:"🔴 Acil — İkna Edilebilir (7 gün temas yok)",
    watch_followup_title:   "🟡 Takipte — İzleme (14 gün temas yok)",
    all_contacts_current:   "Tüm hedef ülkelerle güncel temas var!",
    next_steps:             "📋 Sonraki Adımlar",
    contact_velocity:       "📊 Temas Hızı",
    this_week:              "Bu hafta",
    last_week:              "Geçen hafta",
    difference:             "fark",
    channel_distribution:   "KANAL DAĞILIMI (Bu Hafta)",
    longest_waiting:        "⏰ En Uzun Bekleyen Hedefler",
    no_contact_yet:         "Hiç temas yok",
    channel_desk:           "🖥️ Masa",
    channel_email:          "📧 E-posta",
    channel_call:           "📞 Arama",
    channel_visit:          "🤝 Ziyaret",

    // Objection Map
    objection_types_label:  "İtiraz türleri (opsiyonel)",
    obj_prefer_competitor:  "Rakibi tercih ediyor",
    obj_resource_issue:     "Kaynak sorunu",
    obj_info_gap:           "Bilgi eksikliği",
    obj_political_pressure: "Politik baskı",
    obj_no_personal_rel:    "Kişisel ilişki yok",
    obj_institutional_memory:"Kurumsal hafıza",
    obj_other:              "Diğer",
    objection_analysis:     "🚧 İtiraz Analizi",

    // Risk Register
    risk_records:           "⚠️ RİSK KAYITLARI",
    add_risk:               "+ Risk Ekle",
    no_risks:               "Risk kaydı yok.",
    risk_leadership:        "👤 Liderlik değişikliği",
    risk_budget:            "💰 Bütçe sorunu",
    risk_competitor_offer:  "⚔️ Rakip teklif",
    risk_event_conflict:    "📅 Etkinlik çakışması",
    risk_other:             "⚠️ Diğer",
    risk_severity_high:     "🔴 Yüksek",
    risk_severity_medium:   "🟡 Orta",
    risk_severity_low:      "🟢 Düşük",
    risk_resolved:          "✅ Çözüldü",
    risk_resolve:           "○ Çöz",
    risk_description_ph:    "Risk açıklaması...",
    risk_warning_dashboard: "destekçi ülkede çözülmemiş yüksek risk",

    // Endorsement Chain
    influence_network:      "📡 ETKİ AĞI",
    rel_ally:               "🤝 Müttefik",
    rel_swing:              "↔️ Sallanıyor",
    rel_competitive:        "⚔️ Rekabetçi",
    influence_centers:      "📡 Etki Merkezleri",
    allies_suffix:          "müttefik",

    // Campaign Calendar
    campaign_calendar:      "📅 Kampanya Takvimi",
    calendar_subtitle:      "Hangi etkinlikte kime odaklanmalısın?",
    event_persuadable:      "ikna",
    event_watch:            "izleme",
    event_supporter:        "destekçi",
    meet_these_first:       "🎯 Önce Bunlarla Görüş:",
    feds_at_event:          "Bu etkinlikteki federasyonlar:",
    main_target:            "🗳️ ANA HEDEF",
    passed:                 "Geçti",
    event_doha:             "Dünya Kupası — Doha",
    event_pan_american:     "Pan-Amerikan Şampiyonası",
    event_africa_cup:       "Afrika Kupası",
    event_asia_champ:       "Asya Şampiyonası",
    event_europe_champ:     "Avrupa Şampiyonası",
    event_fig_congress:     "FIG Kongresi — Seçim",

    // Simulator 2.0
    continent_based_conversion:"KIITA BAZLI DÖNÜŞÜM",
    targets_lbl:            "hedef",
    worst_case:             "😰 En Kötü",
    current_case:           "📊 Mevcut",
    optimistic_case:        "😊 Optimist",
    scenario_lbl:           "senaryo",
    majority_lbl:           "Çoğunluk",
    over:                   "fazla",
    under:                  "eksik",

    // Common new
    note_lbl_short:         "Not",
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
    sec_phone_lbl:     "Secretary General's Phone",
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

    // Navigation (new)
    nav_war_room:           "⚔️ War Room",
    nav_war_room_short:     "⚔️ War",
    nav_calendar:           "📅 Calendar",
    nav_congress_city:      "🏛️ Host City",
    nav_congress_city_short:"🏛️ City",

    // Congress Countdown
    days_left:              "days left",
    fig_congress_oct_2026:  "⏱ FIG Congress · October 2026",
    critical_dates:         "CRITICAL DATES",
    country_count_suffix:   "countries",

    // Trend / Status History
    trend_this_month:       "📈 This Month",
    gained_suffix:          "gained",
    lost_suffix:            "lost",
    status_history:         "STATUS HISTORY",

    // WhatsApp Template
    whatsapp_draft:         "📋 WhatsApp Draft",
    copy_btn:               "📋 Copy",
    copied_btn:             "✓ Copied!",

    // Print
    print_briefing:         "🖨️ Print",

    // Strategy / Presentation
    strategic_metrics:      "STRATEGIC METRICS",
    facilities_org:         "FACILITIES & ORGANIZATION",
    fig_roles_title:        "FIG ROLES",
    athlete_capacity_title: "ATHLETE CAPACITY",

    // Competitor
    competitor_status:      "⚔️ Competitor Status",
    competitor_name_ph:     "Competitor name",
    competitor_supporters_ph:"Supporter country codes (comma-separated: USA, GBR, FRA)",
    competitor_votes_ph:    "Estimated vote count",
    est_votes:              "est. votes",
    known_supporters:       "KNOWN SUPPORTERS",
    no_competitor_info:     "No competitor info entered. Click the edit button.",
    suat_celen:             "Suat Çelen",

    // Commitment Level
    commitment_level:       "COMMITMENT LEVEL",
    commit_no_contact:      "No contact",
    commit_introduced:      "Introduced",
    commit_interested:      "Showed interest",
    commit_verbal_yes:      "Verbal yes",
    commit_firm_yes:        "Firm commitment",
    commit_written:         "Written commitment",
    firm_commitment:        "Firm commitment",
    written_commitment:     "Written commitment",

    // Congress Attendance
    congress_attendance:    "CONGRESS ATTENDANCE",
    att_confirmed:          "Will attend",
    att_likely:             "Likely",
    att_uncertain:          "Uncertain",
    att_no:                 "Won't attend",
    att_unknown:            "Unknown",
    attendance_note_ph:     "Note (travel support, delegation, etc.)",
    real_vote_estimate:     "✈️ Real vote estimate (attendance × commitment): ",

    // City Vote (Istanbul vs Roma)
    congress_city_title:    "🏛️ Host City Preference",
    congress_city_subtitle: "Istanbul or Rome? — Vote for the city that will host the FIG Congress.",
    istanbul_candidacy:     "Turkey's candidacy",
    rome_candidacy:         "Italy's candidacy",
    federations_support:    "federations support",
    undecided:              "❓ Undecided",
    unknown_lbl:            "⚫ Unknown",
    gap:                    "🎯 Gap",
    continent_distribution: "🌍 Continental Distribution",
    all_lbl:                "All",
    host_city_preference:   "🏛️ HOST CITY PREFERENCE",
    city_vote_note_ph:      "City vote note (what they said, why this preference...)",
    host_city_mini:         "🏛️ HOST CITY",
    detail_arrow:           "Details →",
    first_n_shown:          "First 60 federations shown (total",

    // War Room
    war_room_title:         "⚔️ War Room",
    what_to_do_today:       "What should you do today?",
    urgent_persuadable_title:"🔴 Urgent — Persuadable (no contact in 7 days)",
    watch_followup_title:   "🟡 Follow-up — Watch (no contact in 14 days)",
    all_contacts_current:   "All target countries have current contact!",
    next_steps:             "📋 Next Steps",
    contact_velocity:       "📊 Contact Velocity",
    this_week:              "This week",
    last_week:              "Last week",
    difference:             "diff",
    channel_distribution:   "CHANNEL DISTRIBUTION (This Week)",
    longest_waiting:        "⏰ Longest-Waiting Targets",
    no_contact_yet:         "No contact yet",
    channel_desk:           "🖥️ Desk",
    channel_email:          "📧 Email",
    channel_call:           "📞 Call",
    channel_visit:          "🤝 Visit",

    // Objection Map
    objection_types_label:  "Objection types (optional)",
    obj_prefer_competitor:  "Prefers competitor",
    obj_resource_issue:     "Resource issue",
    obj_info_gap:           "Info gap",
    obj_political_pressure: "Political pressure",
    obj_no_personal_rel:    "No personal relationship",
    obj_institutional_memory:"Institutional memory",
    obj_other:              "Other",
    objection_analysis:     "🚧 Objection Analysis",

    // Risk Register
    risk_records:           "⚠️ RISK RECORDS",
    add_risk:               "+ Add Risk",
    no_risks:               "No risk records.",
    risk_leadership:        "👤 Leadership change",
    risk_budget:            "💰 Budget issue",
    risk_competitor_offer:  "⚔️ Competitor offer",
    risk_event_conflict:    "📅 Event conflict",
    risk_other:             "⚠️ Other",
    risk_severity_high:     "🔴 High",
    risk_severity_medium:   "🟡 Medium",
    risk_severity_low:      "🟢 Low",
    risk_resolved:          "✅ Resolved",
    risk_resolve:           "○ Resolve",
    risk_description_ph:    "Risk description...",
    risk_warning_dashboard: "supporter countries with unresolved high risk",

    // Endorsement Chain
    influence_network:      "📡 INFLUENCE NETWORK",
    rel_ally:               "🤝 Ally",
    rel_swing:              "↔️ Swing",
    rel_competitive:        "⚔️ Competitive",
    influence_centers:      "📡 Influence Centers",
    allies_suffix:          "allies",

    // Campaign Calendar
    campaign_calendar:      "📅 Campaign Calendar",
    calendar_subtitle:      "Who should you focus on at each event?",
    event_persuadable:      "persuad.",
    event_watch:            "watch",
    event_supporter:        "support.",
    meet_these_first:       "🎯 Meet These First:",
    feds_at_event:          "Federations at this event:",
    main_target:            "🗳️ MAIN TARGET",
    passed:                 "Passed",
    event_doha:             "World Cup — Doha",
    event_pan_american:     "Pan-American Championship",
    event_africa_cup:       "Africa Cup",
    event_asia_champ:       "Asia Championship",
    event_europe_champ:     "European Championship",
    event_fig_congress:     "FIG Congress — Election",

    // Simulator 2.0
    continent_based_conversion:"CONTINENT-BASED CONVERSION",
    targets_lbl:            "targets",
    worst_case:             "😰 Worst",
    current_case:           "📊 Current",
    optimistic_case:        "😊 Optimist",
    scenario_lbl:           "scenario",
    majority_lbl:           "Majority",
    over:                   "over",
    under:                  "under",

    // Common new
    note_lbl_short:         "Note",
  }
};

/** Çeviri fonksiyonu — anahtar bulunamazsa Türkçeye düşer, o da yoksa anahtarı döner */
export const t = (lang: Lang, key: string): string =>
  strings[lang]?.[key] ?? strings["tr"]?.[key] ?? key;
