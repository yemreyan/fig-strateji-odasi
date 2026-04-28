import {
  type FormEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import worldGeoData from "world-atlas/countries-110m.json";
import { federationSeeds } from "../data/federationSeeds";
import {
  buildStrategicSummary,
  continentMeta,
  primaryNeedLabel,
  translateStrategicText
} from "../lib/presentation";
import {
  buildContinentSummaries,
  rankCountriesByUrgency,
  statusTone
} from "../lib/strategy";
import type { ContinentCode, FederationSeed, SupportStatus } from "../types";

// ── Types ─────────────────────────────────────────────────────────────
type AppView = "dashboard" | "map" | "countries" | "notes";
type Sheet = "dossier" | null;
type FilterValue<T extends string> = T | "all";

type Note = { id: string; countryCode: string; countryName: string; title: string; body: string; date: string };
const NOTES_KEY = "fig-v3-notes";
const loadNotes = (): Note[] => {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) ?? "[]"); } catch { return []; }
};
const saveNotes = (notes: Note[]) => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
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
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
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

// ── Status helpers ─────────────────────────────────────────────────────
const STATUS_TR: Record<SupportStatus, string> = {
  supporter: "Destekçi",
  watch: "İzle",
  persuadable: "İkna Edilebilir",
  resistant: "Dirençli"
};
const STATUS_CSS: Record<SupportStatus, string> = {
  supporter: "badge-green",
  watch: "badge-amber",
  persuadable: "badge-blue",
  resistant: "badge-red"
};
const MAP_COLOR: Record<SupportStatus, string> = {
  supporter: "#10D9A0",
  watch: "#F59E0B",
  persuadable: "#38BDF8",
  resistant: "#F87171"
};

// Country code → ISO numeric map (sample subset for coloring)
const CODE_TO_NUMERIC: Record<string, string> = {
  TUR:"792",GER:"276",FRA:"250",USA:"840",CHN:"156",JPN:"392",BRA:"076",
  AUS:"036",EGY:"818",KEN:"404",RSA:"710",IND:"356",RUS:"643",UKR:"804",
  GBR:"826",ITA:"380",ESP:"724",ARG:"032",MEX:"484",CAN:"124",KOR:"410",
  POL:"616",NED:"528",SUI:"756",AUT:"040",HUN:"348",ROU:"642",BUL:"100",
  GRE:"300",POR:"620",BEL:"056",SWE:"752",NOR:"578",DEN:"208",FIN:"246",
  CZE:"203",SVK:"703",SLO:"705",CRO:"191",SRB:"688",BIH:"070",MKD:"807",
  MDA:"498",BLR:"112",KAZ:"398",UZB:"860",AZE:"031",GEO:"268",ARM:"051",
  QAT:"634",UAE:"784",KUW:"414",BRN:"048",SAU:"682",OMA:"512",JOR:"400",
  LIB:"422",IRQ:"368",IRN:"364",ISR:"376",PAK:"586",BAN:"050",SRI:"144",
  NEP:"524",PHI:"608",INA:"360",MAS:"458",THA:"764",VIE:"704",SGP:"702",
  MGL:"496",HKG:"344",TPE:"158",NZL:"554",FIJ:"242",PNG:"598",NGR:"566",
  GHA:"288",CMR:"120",ETH:"231",TAN:"834",UGA:"800",ZIM:"716",ZAM:"894",
  MOZ:"508",ANG:"024",SEN:"686",MLI:"466",BEN:"204",BUR:"854",CIV:"384",
  GUI:"324",TOG:"768",NIG:"562",MAD:"450",ALG:"012",MAR:"504",TUN:"788",
  LBA:"434",SUD:"729",COL:"170",VEN:"862",PER:"604",CHI:"152",ECU:"218",
  BOL:"068",PAR:"600",URU:"858",GUA:"320",CRC:"188",PAN:"591",HON:"340",
  ESA:"222",NCA:"558",DOM:"214",CUB:"192",PUR:"630",SKN:"659",JAM:"388",
  TRI:"780",GUY:"328",SUR:"740",BAR:"052",
};

// ── Main Component ─────────────────────────────────────────────────────
export const StrategyApp = () => {
  const ranked = useMemo(() => rankCountriesByUrgency(federationSeeds), []);
  const continentSummaries = useMemo(() => buildContinentSummaries(federationSeeds), []);

  // Global state
  const [view, setView] = useState<AppView>("dashboard");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selectedCode, setSelectedCode] = useState(ranked[0].countryCode);

  // Filters (countries tab)
  const [statusFilter, setStatusFilter] = useState<FilterValue<SupportStatus>>("all");
  const [continentFilter, setContinentFilter] = useState<FilterValue<ContinentCode>>("all");
  const [search, setSearch] = useState("");
  const dSearch = useDeferredValue(search.trim().toLowerCase());

  // Map
  const [mapPos, setMapPos] = useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [10, 12], zoom: 1 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Fix SVG preserveAspectRatio when map tab is active
  useEffect(() => {
    if (view !== "map") return;
    const fix = () => {
      const svg = mapRef.current?.querySelector("svg");
      if (svg) svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    };
    fix();
    const t = setTimeout(fix, 100);
    return () => clearTimeout(t);
  }, [view]);

  // Notes
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  useEffect(() => { saveNotes(notes); }, [notes]);

  // Derived
  const seedByCode = useMemo(() => Object.fromEntries(ranked.map(c => [c.countryCode, c])), [ranked]);
  const selected = seedByCode[selectedCode] ?? ranked[0];
  const tone = statusTone(selected.status);

  const filtered = useMemo(() => ranked.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (continentFilter !== "all" && c.continent !== continentFilter) return false;
    if (dSearch && ![c.countryName, c.countryCode, c.president, c.federationName].join(" ").toLowerCase().includes(dSearch)) return false;
    return true;
  }), [ranked, statusFilter, continentFilter, dSearch]);

  // Vote totals
  const totals = useMemo(() => ({
    supporter: federationSeeds.filter(c => c.status === "supporter").length,
    watch: federationSeeds.filter(c => c.status === "watch").length,
    persuadable: federationSeeds.filter(c => c.status === "persuadable").length,
    resistant: federationSeeds.filter(c => c.status === "resistant").length,
    total: federationSeeds.length,
  }), []);

  // ISO numeric lookup for map coloring
  const statusByNumeric = useMemo(() => {
    const map: Record<string, SupportStatus> = {};
    for (const c of federationSeeds) {
      const num = CODE_TO_NUMERIC[c.countryCode];
      if (num) map[num] = c.status;
    }
    return map;
  }, []);

  const openDossier = (code: string) => {
    setSelectedCode(code);
    setSheet("dossier");
  };

  const addNote = (e: FormEvent) => {
    e.preventDefault();
    const t = noteTitle.trim(); const b = noteBody.trim();
    if (!t || !b) return;
    const note: Note = {
      id: `${selectedCode}-${Date.now()}`,
      countryCode: selectedCode,
      countryName: selected.countryName,
      title: t, body: b,
      date: new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())
    };
    setNotes(cur => [note, ...cur]);
    setNoteTitle(""); setNoteBody("");
  };

  const deleteNote = (id: string) => setNotes(cur => cur.filter(n => n.id !== id));

  const countryNotes = notes.filter(n => n.countryCode === selectedCode);

  const majority = Math.ceil(totals.total / 2) + 1;
  const onTrack = totals.supporter;

  return (
    <div className="shell">
      {/* ── Header ── */}
      <header className="hdr">
        <div className="hdr-brand">
          <span className="hdr-eyebrow">FIG Seçim · Suat Çelen</span>
          <div className="hdr-votes">
            <span className="hdr-vote-num" style={{ color: "#10D9A0" }}>{totals.supporter}</span>
            <span className="hdr-vote-sep">/</span>
            <span className="hdr-vote-total">{majority}</span>
            <span className="hdr-vote-label">çoğunluk için</span>
          </div>
        </div>
        <nav className="hdr-nav">
          {(["dashboard","map","countries","notes"] as AppView[]).map(v => {
            const labels: Record<AppView,string> = { dashboard:"Durum", map:"Harita", countries:"Federasyonlar", notes:"Notlar" };
            const icons: Record<AppView, JSX.Element> = { dashboard:<IcGrid/>, map:<IcMap/>, countries:<IcGlobe/>, notes:<IcNote/> };
            return (
              <button key={v} className={`hdr-tab ${view===v?"active":""}`} onClick={() => setView(v)} type="button">
                {icons[v]}{labels[v]}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="main">
        {/* ══ DURUM PANELİ ══ */}
        {view === "dashboard" && (
          <div className="tab-scroll">
            {/* Progress */}
            <section className="section">
              <h2 className="section-title">Oy Durumu</h2>
              <div className="vote-progress-card">
                <div className="vote-big">{onTrack} <span>destekçi</span></div>
                <div className="vote-goal">Hedef: {majority} · Toplam: {totals.total}</div>
                <div className="progress-track">
                  <div className="progress-fill green" style={{ width: `${(totals.supporter/totals.total)*100}%` }} />
                  <div className="progress-fill blue" style={{ width: `${(totals.persuadable/totals.total)*100}%` }} />
                  <div className="progress-fill amber" style={{ width: `${(totals.watch/totals.total)*100}%` }} />
                  <div className="progress-fill red" style={{ width: `${(totals.resistant/totals.total)*100}%` }} />
                </div>
                <div className="vote-legend">
                  <span className="dot green"/><b>{totals.supporter}</b> Destekçi
                  <span className="dot blue"/><b>{totals.persuadable}</b> İkna Edilebilir
                  <span className="dot amber"/><b>{totals.watch}</b> İzle
                  <span className="dot red"/><b>{totals.resistant}</b> Dirençli
                </div>
              </div>
            </section>

            {/* Kıtalar */}
            <section className="section">
              <h2 className="section-title">Kıtalar</h2>
              {(["EG","AGU","UAG","PAGU","OGU"] as ContinentCode[]).map(code => {
                const meta = continentMeta[code];
                const s = continentSummaries[code];
                if (!s) return null;
                const pct = s.total > 0 ? Math.round((s.supporter / s.total) * 100) : 0;
                return (
                  <div key={code} className="continent-row" onClick={() => { setContinentFilter(code); setView("countries"); }}>
                    <div className="continent-row-left">
                      <span className="continent-flag">{meta.flag}</span>
                      <div>
                        <div className="continent-name">{meta.label}</div>
                        <div className="continent-sub">{s.total} federasyon · <span style={{color:"#10D9A0"}}>{s.supporter} destekçi</span></div>
                      </div>
                    </div>
                    <div className="continent-row-right">
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${pct}%`, background: "#10D9A0" }} />
                      </div>
                      <span className="continent-pct">{pct}%</span>
                      <IcChevronRight />
                    </div>
                  </div>
                );
              })}
            </section>

            {/* En Kritik */}
            <section className="section">
              <h2 className="section-title">Öncelikli Hedefler</h2>
              {ranked.filter(c => c.status === "persuadable").slice(0, 8).map(c => {
                const tone = statusTone(c.status);
                return (
                  <div key={c.countryCode} className="priority-row" onClick={() => openDossier(c.countryCode)}>
                    <div className="priority-row-left">
                      <span className={`badge ${STATUS_CSS[c.status]}`}>{STATUS_TR[c.status]}</span>
                      <div>
                        <div className="priority-name">{c.countryName}</div>
                        <div className="priority-sub">{continentMeta[c.continent]?.label} · {primaryNeedLabel(c.primaryNeed)}</div>
                      </div>
                    </div>
                    <div className="priority-score" style={{ color: tone.color }}>{c.priorityScore}</div>
                  </div>
                );
              })}
            </section>
          </div>
        )}

        {/* ══ HARİTA ══ */}
        {view === "map" && (
          <div className="map-container" ref={mapRef}>
            <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }} style={{ width: "100%", height: "100%" }}>
              <ZoomableGroup
                zoom={mapPos.zoom}
                center={mapPos.coordinates}
                onMoveEnd={({ zoom, coordinates }) => setMapPos({ zoom, coordinates: coordinates as [number, number] })}
              >
                <Geographies geography={worldGeoData}>
                  {({ geographies }) => geographies.map(geo => {
                    const numericId = geo.id as string;
                    const status = statusByNumeric[numericId];
                    const isSelected = status && federationSeeds.find(c => CODE_TO_NUMERIC[c.countryCode] === numericId)?.countryCode === selectedCode;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          const seed = federationSeeds.find(c => CODE_TO_NUMERIC[c.countryCode] === numericId);
                          if (seed) { setSelectedCode(seed.countryCode); setSheet("dossier"); }
                        }}
                        style={{
                          default: { fill: status ? MAP_COLOR[status] : "#1C2A3A", stroke: "#0D1B2A", strokeWidth: 0.4, opacity: isSelected ? 1 : 0.85, outline: "none" },
                          hover: { fill: status ? MAP_COLOR[status] : "#243447", stroke: "#38BDF8", strokeWidth: 0.8, opacity: 1, outline: "none", cursor: status ? "pointer" : "default" },
                          pressed: { fill: status ? MAP_COLOR[status] : "#1C2A3A", outline: "none" }
                        }}
                      />
                    );
                  })}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Map legend */}
            <div className="map-legend">
              {(["supporter","persuadable","watch","resistant"] as SupportStatus[]).map(s => (
                <div key={s} className="map-legend-item">
                  <span className="map-legend-dot" style={{ background: MAP_COLOR[s] }} />
                  <span>{STATUS_TR[s]}</span>
                </div>
              ))}
            </div>

            {/* Map zoom */}
            <div className="map-zoom">
              <button type="button" onClick={() => setMapPos(p => ({ ...p, zoom: Math.min(p.zoom+0.8,5) }))}>+</button>
              <button type="button" onClick={() => setMapPos(p => ({ ...p, zoom: Math.max(p.zoom-0.8,1) }))}>−</button>
              <button type="button" onClick={() => setMapPos({ coordinates:[10,12], zoom:1 })}>↺</button>
            </div>

            {/* Selected bar */}
            {sheet !== "dossier" && selected && (
              <div className="map-bar" onClick={() => setSheet("dossier")}>
                <div>
                  <div className="map-bar-name">{selected.countryName} <span className="map-bar-code">{selected.countryCode}</span></div>
                  <div className="map-bar-sub">{STATUS_TR[selected.status]} · {continentMeta[selected.continent]?.label}</div>
                </div>
                <button className="map-bar-btn" type="button">Dosya Aç</button>
              </div>
            )}
          </div>
        )}

        {/* ══ FEDERASYONLAR ══ */}
        {view === "countries" && (
          <div className="tab-scroll">
            {/* Search */}
            <div className="search-bar">
              <input
                className="search-input"
                placeholder="Ülke, başkan, federasyon ara…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Status pills */}
            <div className="filter-pills">
              {(["all","supporter","persuadable","watch","resistant"] as (FilterValue<SupportStatus>)[]).map(s => (
                <button key={s} type="button" className={`pill ${statusFilter===s?"pill-active":""}`}
                  onClick={() => setStatusFilter(s)}>
                  {s === "all" ? "Tümü" : STATUS_TR[s as SupportStatus]}
                </button>
              ))}
            </div>

            {/* Continent pills */}
            <div className="filter-pills">
              <button type="button" className={`pill ${continentFilter==="all"?"pill-active":""}`} onClick={() => setContinentFilter("all")}>Tüm Kıtalar</button>
              {(["EG","AGU","UAG","PAGU","OGU"] as ContinentCode[]).map(code => (
                <button key={code} type="button" className={`pill ${continentFilter===code?"pill-active":""}`} onClick={() => setContinentFilter(code)}>
                  {continentMeta[code]?.flag} {continentMeta[code]?.label}
                </button>
              ))}
            </div>

            <div className="list-count">{filtered.length} federasyon</div>

            {/* Country list */}
            {filtered.map(c => (
              <div key={c.countryCode} className="country-card" onClick={() => openDossier(c.countryCode)}>
                <div className="country-card-left">
                  <div className="country-card-code">{c.countryCode}</div>
                  <div>
                    <div className="country-card-name">{c.countryName}</div>
                    <div className="country-card-sub">{continentMeta[c.continent]?.label} · {c.president}</div>
                  </div>
                </div>
                <div className="country-card-right">
                  <span className={`badge ${STATUS_CSS[c.status]}`}>{STATUS_TR[c.status]}</span>
                  <span className="country-card-score">{c.priorityScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ NOTLAR ══ */}
        {view === "notes" && (
          <div className="tab-scroll">
            <section className="section">
              <h2 className="section-title">Yeni Not</h2>
              <div className="note-country-selector">
                <select
                  className="note-select"
                  value={selectedCode}
                  onChange={e => setSelectedCode(e.target.value)}
                >
                  {ranked.map(c => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.countryName} ({c.countryCode}) — {STATUS_TR[c.status]}
                    </option>
                  ))}
                </select>
              </div>
              <form className="note-form" onSubmit={addNote}>
                <input className="note-input" placeholder="Not başlığı" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} required />
                <textarea className="note-textarea" placeholder="Not içeriği…" rows={4} value={noteBody} onChange={e => setNoteBody(e.target.value)} required />
                <button className="note-submit" type="submit">Not Ekle</button>
              </form>
            </section>

            {notes.length === 0 ? (
              <div className="empty-state">Henüz not yok. Federasyon seç ve not ekle.</div>
            ) : (
              <section className="section">
                <h2 className="section-title">Tüm Notlar <span className="note-count">{notes.length}</span></h2>
                {notes.map(n => (
                  <div key={n.id} className="note-card">
                    <div className="note-card-header">
                      <span className="note-card-country">{n.countryName} · {n.countryCode}</span>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <span className="note-card-date">{n.date}</span>
                        <button className="note-delete" type="button" onClick={() => deleteNote(n.id)} aria-label="Notu sil"><IcX /></button>
                      </div>
                    </div>
                    <div className="note-card-title">{n.title}</div>
                    <div className="note-card-body">{n.body}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        {(["dashboard","map","countries","notes"] as AppView[]).map(v => {
          const labels: Record<AppView,string> = { dashboard:"Durum", map:"Harita", countries:"Federasyonlar", notes:"Notlar" };
          const icons: Record<AppView, JSX.Element> = { dashboard:<IcGrid/>, map:<IcMap/>, countries:<IcGlobe/>, notes:<IcNote/> };
          return (
            <button key={v} type="button" className={`nav-tab ${view===v?"active":""}`} onClick={() => { setView(v); setSheet(null); }}>
              <span className="nav-tab-icon">{icons[v]}</span>
              <span className="nav-tab-label">{labels[v]}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Dossier Sheet ── */}
      {sheet === "dossier" && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheet(null)} />
          <div className="dossier-sheet">
            <div className="sheet-handle" />

            {/* Header */}
            <div className="ds-header">
              <div>
                <div className="ds-title">{selected.countryName}</div>
                <div className="ds-meta">
                  {continentMeta[selected.continent]?.label} · {selected.president}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <span className={`badge badge-lg ${STATUS_CSS[selected.status]}`}>{STATUS_TR[selected.status]}</span>
                <button type="button" className="sheet-x" onClick={() => setSheet(null)}><IcX /></button>
              </div>
            </div>

            {/* Key metrics */}
            <div className="ds-metrics">
              <div className="ds-metric">
                <div className="ds-metric-val">{selected.priorityScore}</div>
                <div className="ds-metric-key">Öncelik</div>
              </div>
              <div className="ds-metric">
                <div className="ds-metric-val">{selected.figPowerIndex}</div>
                <div className="ds-metric-key">FIG Gücü</div>
              </div>
              <div className="ds-metric">
                <div className="ds-metric-val">{selected.relationshipStrength}</div>
                <div className="ds-metric-key">İlişki</div>
              </div>
              <div className="ds-metric">
                <div className="ds-metric-val">{(selected.figRoles ?? []).length}</div>
                <div className="ds-metric-key">FIG Rolü</div>
              </div>
            </div>

            <div className="ds-scroll">
              {/* Ne istiyor */}
              <div className="ds-block">
                <div className="ds-block-label">Ne İstiyor?</div>
                <div className="ds-block-val">{primaryNeedLabel(selected.primaryNeed)}</div>
              </div>

              {/* Stratejik özet */}
              <div className="ds-block">
                <div className="ds-block-label">Stratejik Değerlendirme</div>
                <div className="ds-block-text">{translateStrategicText(buildStrategicSummary(selected))}</div>
              </div>

              {/* Temas */}
              {(selected.entryChannels ?? []).length > 0 && (
                <div className="ds-block">
                  <div className="ds-block-label">Temas Kanalı</div>
                  <div className="ds-block-text">{translateStrategicText(selected.entryChannels[0])}</div>
                </div>
              )}

              {/* Dikkat */}
              {(selected.redLines ?? []).length > 0 && (
                <div className="ds-block ds-block-warn">
                  <div className="ds-block-label">Dikkat Edilecek</div>
                  <div className="ds-block-text">{translateStrategicText(selected.redLines[0])}</div>
                </div>
              )}

              {/* Notes section */}
              <div className="ds-notes-header">
                <span className="ds-block-label">Notlar</span>
                <button type="button" className="ds-notes-all-btn" onClick={() => { setSheet(null); setView("notes"); }}>
                  Tüm notlar →
                </button>
              </div>

              <form className="note-form" onSubmit={addNote}>
                <input className="note-input" placeholder="Not başlığı" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
                <textarea className="note-textarea" placeholder="Not ekle…" rows={3} value={noteBody} onChange={e => setNoteBody(e.target.value)} />
                <button className="note-submit" type="submit">Kaydet</button>
              </form>

              {countryNotes.length > 0 && (
                <div className="ds-note-list">
                  {countryNotes.map(n => (
                    <div key={n.id} className="note-card">
                      <div className="note-card-header">
                        <span className="note-card-title">{n.title}</span>
                        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                          <span className="note-card-date">{n.date}</span>
                          <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                        </div>
                      </div>
                      <div className="note-card-body">{n.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
