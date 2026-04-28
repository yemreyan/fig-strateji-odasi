import React, {
  type FormEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { db, onValue, ref, remove, set, update } from "../lib/firebase";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import worldGeoData from "world-atlas/countries-110m.json";
import federationDirectoryData from "../data/federationDirectory.json";
import { federationSeeds } from "../data/federationSeeds";
import {
  buildSportHighlights,
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
import type {
  ContinentCode,
  FederationDirectoryRecord,
  FederationSeed,
  SupportStatus
} from "../types";

// ── Types ─────────────────────────────────────────────────────────────
type AppView = "dashboard" | "map" | "countries" | "notes";
type Sheet = "dossier" | null;
type FilterValue<T extends string> = T | "all";
type DossierTab = "genel" | "iletisim" | "spor";

// Notes
type Note = { id: string; countryCode: string; countryName: string; title: string; body: string; date: string; completed?: boolean };

// Overrides — status + editable texts
type CountryOverride = {
  status?: SupportStatus;
  assessment?: string;
  entryChannel?: string;
  redLine?: string;
};

const officialDirectory = federationDirectoryData as FederationDirectoryRecord[];

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
    <line x1="16" y1="17" x2="8" y2="17"/>
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
const IcEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcCheckCircle = ({ done }: { done?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: done ? "var(--green)" : "var(--muted)" }}>
    <circle cx="12" cy="12" r="10"/>
    {done && <polyline points="9 12 11 14 15 10"/>}
  </svg>
);
const IcPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

// Country code → ISO numeric
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

// ── Editable text block ─────────────────────────────────────────────────
const EditableBlock = ({
  label, value, onSave, warn = false
}: { label: string; value: string; onSave: (v: string) => void; warn?: boolean }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onSave(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`ds-block ${warn ? "ds-block-warn" : ""}`}>
        <div className="ds-block-label">{label}</div>
        <textarea
          className="edit-textarea"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={4}
          autoFocus
        />
        <div className="edit-actions">
          <button type="button" className="edit-save" onClick={save}><IcCheck /> Kaydet</button>
          <button type="button" className="edit-cancel" onClick={() => { setDraft(value); setEditing(false); }}>İptal</button>
        </div>
      </div>
    );
  }
  return (
    <div className={`ds-block ${warn ? "ds-block-warn" : ""}`}>
      <div className="ds-block-label-row">
        <span className="ds-block-label">{label}</span>
        <button type="button" className="edit-btn" onClick={() => { setDraft(value); setEditing(true); }}><IcEdit /></button>
      </div>
      <div className="ds-block-text">{value}</div>
    </div>
  );
};

// ── Password ──────────────────────────────────────────────────────────
const PASS = "SuatCelen";
const SESSION_KEY = "fig-v3-auth";

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASS) { sessionStorage.setItem(SESSION_KEY, "1"); onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };
  return (
    <div className="login-screen">
      <div className="login-logo">FIG Seçim Operasyonu</div>
      <h1 className="login-title">Suat Çelen<br />Strateji Odası</h1>
      <p className="login-sub">Giriş yapmak için şifreyi girin</p>
      <form className="login-form" onSubmit={submit}>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••••"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoComplete="current-password"
          autoFocus
        />
        {error && <div className="login-error">Hatalı şifre, tekrar deneyin.</div>}
        <button className="login-btn" type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

// ── Ana Bileşen ────────────────────────────────────────────────────────
export const StrategyApp = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  const ranked = useMemo(() => rankCountriesByUrgency(federationSeeds), []);
  const continentSummaries = useMemo(() => buildContinentSummaries(federationSeeds), []);
  const directoryByCode = useMemo(() =>
    Object.fromEntries(officialDirectory.map(r => [r.countryCode, r])) as Record<string, FederationDirectoryRecord>,
    []
  );
  const seedByCode = useMemo(() => Object.fromEntries(ranked.map(c => [c.countryCode, c])), [ranked]);

  // Global state
  const [view, setView] = useState<AppView>("dashboard");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selectedCode, setSelectedCode] = useState(ranked[0].countryCode);
  const [dossierTab, setDossierTab] = useState<DossierTab>("genel");

  // Filters
  const [statusFilter, setStatusFilter] = useState<FilterValue<SupportStatus>>("all");
  const [continentFilter, setContinentFilter] = useState<FilterValue<ContinentCode>>("all");
  const [search, setSearch] = useState("");
  const dSearch = useDeferredValue(search.trim().toLowerCase());

  // Map
  const [mapPos, setMapPos] = useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [10, 12], zoom: 1 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Notes — synced from Firebase
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Overrides — synced from Firebase
  const [overrides, setOverrides] = useState<Record<string, CountryOverride>>({});

  // Firebase listeners
  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/notes"), snap => {
      const val = snap.val() as Record<string, Note> | null;
      if (!val) { setNotes([]); return; }
      const arr = Object.values(val).sort((a, b) => b.id.localeCompare(a.id));
      setNotes(arr);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "fig-v3/overrides"), snap => {
      const val = snap.val() as Record<string, CountryOverride> | null;
      setOverrides(val ?? {});
    });
    return unsub;
  }, []);

  // Fix map preserveAspectRatio — retry until SVG renders
  useEffect(() => {
    if (view !== "map") return;
    let tries = 0;
    const fix = () => {
      const svg = mapRef.current?.querySelector("svg");
      if (svg) {
        svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        svg.style.width = "100%";
        svg.style.height = "100%";
      } else if (tries < 20) {
        tries++;
        setTimeout(fix, 50);
      }
    };
    fix();
  }, [view]);

  // Helper to update override for a country (writes to Firebase)
  const setOverride = (code: string, patch: Partial<CountryOverride>) => {
    update(ref(db, `fig-v3/overrides/${code}`), patch);
  };

  // Merged country with overrides applied
  const mergedSeed = useMemo(() => {
    return ranked.map(c => {
      const ov = overrides[c.countryCode];
      if (!ov) return c;
      return { ...c, status: ov.status ?? c.status };
    });
  }, [ranked, overrides]);

  const mergedByCode = useMemo(() => Object.fromEntries(mergedSeed.map(c => [c.countryCode, c])), [mergedSeed]);

  // Filtered list (uses merged status)
  const filtered = useMemo(() => mergedSeed.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (continentFilter !== "all" && c.continent !== continentFilter) return false;
    if (dSearch && ![c.countryName, c.countryCode, c.president, c.federationName].join(" ").toLowerCase().includes(dSearch)) return false;
    return true;
  }), [mergedSeed, statusFilter, continentFilter, dSearch]);

  // Vote totals (from merged)
  const totals = useMemo(() => ({
    supporter: mergedSeed.filter(c => c.status === "supporter").length,
    watch: mergedSeed.filter(c => c.status === "watch").length,
    persuadable: mergedSeed.filter(c => c.status === "persuadable").length,
    resistant: mergedSeed.filter(c => c.status === "resistant").length,
    total: mergedSeed.length,
  }), [mergedSeed]);

  const statusByNumeric = useMemo(() => {
    const map: Record<string, SupportStatus> = {};
    for (const c of mergedSeed) {
      const num = CODE_TO_NUMERIC[c.countryCode];
      if (num) map[num] = c.status;
    }
    return map;
  }, [mergedSeed]);

  const selected = mergedByCode[selectedCode] ?? mergedSeed[0];
  const selectedDir = directoryByCode[selectedCode];
  const selectedOv = overrides[selectedCode] ?? {};

  const getAssessment = (c: FederationSeed) => overrides[c.countryCode]?.assessment ?? translateStrategicText(buildStrategicSummary(c));
  const getEntryChannel = (c: FederationSeed) => overrides[c.countryCode]?.entryChannel ?? translateStrategicText((c.entryChannels ?? [])[0] ?? "");
  const getRedLine = (c: FederationSeed) => overrides[c.countryCode]?.redLine ?? translateStrategicText((c.redLines ?? [])[0] ?? "");

  const sportHighlights = useMemo(() => buildSportHighlights(selected).filter(Boolean), [selected]);

  const openDossier = (code: string) => {
    setSelectedCode(code);
    setDossierTab("genel");
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
    set(ref(db, `fig-v3/notes/${note.id}`), note);
    setNoteTitle(""); setNoteBody("");
  };

  const deleteNote = (id: string) => remove(ref(db, `fig-v3/notes/${id}`));
  const toggleNoteComplete = (id: string, completed: boolean) => update(ref(db, `fig-v3/notes/${id}`), { completed });
  const countryNotes = notes.filter(n => n.countryCode === selectedCode);

  const majority = Math.ceil(totals.total / 2) + 1;

  // Continent summaries from merged data
  const continentStats = useMemo(() => {
    const map: Record<string, { total: number; supporter: number }> = {};
    for (const c of mergedSeed) {
      if (!map[c.continent]) map[c.continent] = { total: 0, supporter: 0 };
      map[c.continent].total++;
      if (c.status === "supporter") map[c.continent].supporter++;
    }
    return map;
  }, [mergedSeed]);

  return (
    <div className="shell">
      {/* ── Header ── */}
      <header className="hdr">
        <div className="hdr-brand">
          <span className="hdr-eyebrow">FIG Seçim · Suat Çelen</span>
          <div className="hdr-votes">
            <span className="hdr-vote-num">{totals.supporter}</span>
            <span className="hdr-vote-sep">/</span>
            <span className="hdr-vote-total">{majority}</span>
            <span className="hdr-vote-label">çoğunluk için</span>
          </div>
        </div>
        <nav className="hdr-nav">
          {(["dashboard","map","countries","notes"] as AppView[]).map(v => {
            const labels: Record<AppView,string> = { dashboard:"Durum", map:"Harita", countries:"Federasyonlar", notes:"Notlar" };
            const icons: Record<AppView, React.ReactElement> = { dashboard:<IcGrid/>, map:<IcMap/>, countries:<IcGlobe/>, notes:<IcNote/> };
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
            <section className="section">
              <h2 className="section-title">Oy Durumu</h2>
              <div className="vote-progress-card">
                <div className="vote-big">{totals.supporter} <span>destekçi</span></div>
                <div className="vote-goal">Hedef: {majority} · Toplam: {totals.total}</div>
                <div className="progress-track">
                  <div className="progress-fill green" style={{ width: `${(totals.supporter/totals.total)*100}%` }} />
                  <div className="progress-fill blue"  style={{ width: `${(totals.persuadable/totals.total)*100}%` }} />
                  <div className="progress-fill amber" style={{ width: `${(totals.watch/totals.total)*100}%` }} />
                  <div className="progress-fill red"   style={{ width: `${(totals.resistant/totals.total)*100}%` }} />
                </div>
                <div className="vote-legend">
                  <span className="dot green"/><b>{totals.supporter}</b> Destekçi
                  <span className="dot blue"/><b>{totals.persuadable}</b> İkna Edilebilir
                  <span className="dot amber"/><b>{totals.watch}</b> İzle
                  <span className="dot red"/><b>{totals.resistant}</b> Dirençli
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="section-title">Kıtalar</h2>
              {(["EG","AGU","UAG","PAGU","OGU"] as ContinentCode[]).map(code => {
                const meta = continentMeta[code];
                const s = continentStats[code];
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

            <section className="section">
              <h2 className="section-title">Öncelikli Hedefler</h2>
              {mergedSeed.filter(c => c.status === "persuadable").slice(0, 8).map(c => (
                <div key={c.countryCode} className="priority-row" onClick={() => openDossier(c.countryCode)}>
                  <div className="priority-row-left">
                    <span className={`badge ${STATUS_CSS[c.status]}`}>{STATUS_TR[c.status]}</span>
                    <div>
                      <div className="priority-name">{c.countryName}</div>
                      <div className="priority-sub">{continentMeta[c.continent]?.label} · {primaryNeedLabel(c.primaryNeed)}</div>
                    </div>
                  </div>
                  <div className="priority-score" style={{ color: statusTone(c.status).color }}>{c.priorityScore}</div>
                </div>
              ))}
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
                    const isSelected = federationSeeds.find(c => CODE_TO_NUMERIC[c.countryCode] === numericId)?.countryCode === selectedCode;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          const seed = federationSeeds.find(c => CODE_TO_NUMERIC[c.countryCode] === numericId);
                          if (seed) { setSelectedCode(seed.countryCode); setSheet("dossier"); setDossierTab("genel"); }
                        }}
                        style={{
                          default: { fill: status ? MAP_COLOR[status] : "#1C2A3A", stroke: "#0D1B2A", strokeWidth: 0.4, opacity: isSelected ? 1 : 0.85, outline: "none" },
                          hover:   { fill: status ? MAP_COLOR[status] : "#243447", stroke: "#38BDF8", strokeWidth: 0.8, opacity: 1, outline: "none", cursor: status ? "pointer" : "default" },
                          pressed: { fill: status ? MAP_COLOR[status] : "#1C2A3A", outline: "none" }
                        }}
                      />
                    );
                  })}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            <div className="map-legend">
              {(["supporter","persuadable","watch","resistant"] as SupportStatus[]).map(s => (
                <div key={s} className="map-legend-item">
                  <span className="map-legend-dot" style={{ background: MAP_COLOR[s] }} />
                  <span>{STATUS_TR[s]}</span>
                </div>
              ))}
            </div>

            <div className="map-zoom">
              <button type="button" onClick={() => setMapPos(p => ({ ...p, zoom: Math.min(p.zoom+0.8,5) }))}>+</button>
              <button type="button" onClick={() => setMapPos(p => ({ ...p, zoom: Math.max(p.zoom-0.8,1) }))}>−</button>
              <button type="button" onClick={() => setMapPos({ coordinates:[10,12], zoom:1 })}>↺</button>
            </div>

            {sheet !== "dossier" && selected && (
              <div className="map-bar" onClick={() => { setDossierTab("genel"); setSheet("dossier"); }}>
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
            <div className="search-bar">
              <input
                className="search-input"
                placeholder="Ülke, başkan, federasyon ara…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {(["all","supporter","persuadable","watch","resistant"] as (FilterValue<SupportStatus>)[]).map(s => (
                <button key={s} type="button" className={`pill ${statusFilter===s?"pill-active":""}`}
                  onClick={() => setStatusFilter(s)}>
                  {s === "all" ? "Tümü" : STATUS_TR[s as SupportStatus]}
                </button>
              ))}
            </div>

            <div className="filter-pills">
              <button type="button" className={`pill ${continentFilter==="all"?"pill-active":""}`} onClick={() => setContinentFilter("all")}>Tüm Kıtalar</button>
              {(["EG","AGU","UAG","PAGU","OGU"] as ContinentCode[]).map(code => (
                <button key={code} type="button" className={`pill ${continentFilter===code?"pill-active":""}`} onClick={() => setContinentFilter(code)}>
                  {continentMeta[code]?.flag} {continentMeta[code]?.label}
                </button>
              ))}
            </div>

            <div className="list-count">{filtered.length} federasyon</div>

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
              <div className="notes-header-row">
                <h2 className="section-title">Yeni Not</h2>
              </div>
              <div className="note-country-selector">
                <select
                  className="note-select"
                  value={selectedCode}
                  onChange={e => setSelectedCode(e.target.value)}
                >
                  {ranked.map(c => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.countryName} ({c.countryCode}) — {STATUS_TR[mergedByCode[c.countryCode]?.status ?? c.status]}
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
              <>
                {notes.filter(n => !n.completed).length > 0 && (
                  <section className="section">
                    <h2 className="section-title">Aktif <span className="note-count">{notes.filter(n => !n.completed).length}</span></h2>
                    {notes.filter(n => !n.completed).map(n => (
                      <div key={n.id} className="note-card">
                        <div className="note-card-header">
                          <button type="button" className="note-complete-btn" onClick={() => toggleNoteComplete(n.id, true)}>
                            <IcCheckCircle done={false} />
                          </button>
                          <span className="note-card-country">{n.countryName} · {n.countryCode}</span>
                          <div style={{ display:"flex", gap:"8px", alignItems:"center", marginLeft:"auto" }}>
                            <span className="note-card-date">{n.date}</span>
                            <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                          </div>
                        </div>
                        <div className="note-card-title">{n.title}</div>
                        <div className="note-card-body">{n.body}</div>
                      </div>
                    ))}
                  </section>
                )}
                {notes.filter(n => n.completed).length > 0 && (
                  <section className="section">
                    <h2 className="section-title" style={{ color:"var(--muted)" }}>Tamamlandı <span className="note-count">{notes.filter(n => n.completed).length}</span></h2>
                    {notes.filter(n => n.completed).map(n => (
                      <div key={n.id} className="note-card note-card-done">
                        <div className="note-card-header">
                          <button type="button" className="note-complete-btn" onClick={() => toggleNoteComplete(n.id, false)}>
                            <IcCheckCircle done={true} />
                          </button>
                          <span className="note-card-country" style={{ opacity:0.5 }}>{n.countryName} · {n.countryCode}</span>
                          <div style={{ display:"flex", gap:"8px", alignItems:"center", marginLeft:"auto" }}>
                            <span className="note-card-date">{n.date}</span>
                            <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                          </div>
                        </div>
                        <div className="note-card-title note-title-done">{n.title}</div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        {(["dashboard","map","countries","notes"] as AppView[]).map(v => {
          const labels: Record<AppView,string> = { dashboard:"Durum", map:"Harita", countries:"Federasyonlar", notes:"Notlar" };
          const icons: Record<AppView, React.ReactElement> = { dashboard:<IcGrid/>, map:<IcMap/>, countries:<IcGlobe/>, notes:<IcNote/> };
          return (
            <button key={v} type="button" className={`nav-tab ${view===v?"active":""}`} onClick={() => { setView(v); setSheet(null); }}>
              <span className="nav-tab-icon">{icons[v]}</span>
              <span className="nav-tab-label">{labels[v]}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Dossier Sheet ── */}
      {sheet === "dossier" && selected && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheet(null)} />
          <div className="dossier-sheet">
            <div className="sheet-handle" />

            {/* Header */}
            <div className="ds-header">
              <div style={{ minWidth:0, flex:1 }}>
                <div className="ds-title">{selected.countryName}</div>
                <div className="ds-meta">{continentMeta[selected.continent]?.label} · {selected.president}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
                <button type="button" className="sheet-x" onClick={() => setSheet(null)}><IcX /></button>
              </div>
            </div>

            {/* Status changer */}
            <div className="ds-status-row">
              {(["supporter","persuadable","watch","resistant"] as SupportStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  className={`status-chip ${selected.status === s ? "status-chip-active " + STATUS_CSS[s] : ""}`}
                  onClick={() => setOverride(selectedCode, { status: s })}
                >
                  {STATUS_TR[s]}
                </button>
              ))}
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

            {/* Tabs */}
            <div className="ds-tabs">
              {(["genel","iletisim","spor"] as DossierTab[]).map(t => {
                const labels: Record<DossierTab,string> = { genel:"Strateji", iletisim:"İletişim", spor:"Spor" };
                return (
                  <button key={t} type="button" className={`ds-tab-btn ${dossierTab===t?"active":""}`} onClick={() => setDossierTab(t)}>
                    {labels[t]}
                  </button>
                );
              })}
            </div>

            <div className="ds-scroll">
              {/* ── STRATEJİ ── */}
              {dossierTab === "genel" && (
                <>
                  <div className="ds-block">
                    <div className="ds-block-label">Ne İstiyor?</div>
                    <div className="ds-block-val">{primaryNeedLabel(selected.primaryNeed)}</div>
                  </div>

                  <EditableBlock
                    label="Stratejik Değerlendirme"
                    value={getAssessment(selected)}
                    onSave={v => setOverride(selectedCode, { assessment: v })}
                  />

                  {getEntryChannel(selected) && (
                    <EditableBlock
                      label="Temas Kanalı"
                      value={getEntryChannel(selected)}
                      onSave={v => setOverride(selectedCode, { entryChannel: v })}
                    />
                  )}

                  {getRedLine(selected) && (
                    <EditableBlock
                      label="Dikkat Edilecek"
                      value={getRedLine(selected)}
                      onSave={v => setOverride(selectedCode, { redLine: v })}
                      warn
                    />
                  )}

                  {/* Notes in strategy tab */}
                  <div className="ds-notes-header">
                    <span className="ds-block-label">Notlar {countryNotes.length > 0 && <span className="note-count">{countryNotes.length}</span>}</span>
                    <div style={{ display:"flex", gap:8 }}>
                      <button type="button" className="ds-notes-add-btn" onClick={() => setShowNoteForm(v => !v)}>
                        <IcPlus /> Not Ekle
                      </button>
                      <button type="button" className="ds-notes-all-btn" onClick={() => { setSheet(null); setView("notes"); }}>
                        Tümü →
                      </button>
                    </div>
                  </div>
                  {showNoteForm && (
                    <form className="note-form" onSubmit={e => { addNote(e); setShowNoteForm(false); }}>
                      <input className="note-input" placeholder="Not başlığı" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} required />
                      <textarea className="note-textarea" placeholder="Not içeriği…" rows={3} value={noteBody} onChange={e => setNoteBody(e.target.value)} required />
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="note-submit" type="submit">Kaydet</button>
                        <button className="note-cancel" type="button" onClick={() => { setShowNoteForm(false); setNoteTitle(""); setNoteBody(""); }}>İptal</button>
                      </div>
                    </form>
                  )}
                  {countryNotes.map(n => (
                    <div key={n.id} className={`note-card ${n.completed ? "note-card-done" : ""}`} style={{ marginTop: 8 }}>
                      <div className="note-card-header">
                        <button type="button" className="note-complete-btn" onClick={() => toggleNoteComplete(n.id, !n.completed)}>
                          <IcCheckCircle done={n.completed} />
                        </button>
                        <span className={`note-card-title ${n.completed ? "note-title-done" : ""}`}>{n.title}</span>
                        <div style={{ display:"flex", gap:"8px", alignItems:"center", marginLeft:"auto" }}>
                          <span className="note-card-date">{n.date}</span>
                          <button className="note-delete" type="button" onClick={() => deleteNote(n.id)}><IcX /></button>
                        </div>
                      </div>
                      {!n.completed && <div className="note-card-body">{n.body}</div>}
                    </div>
                  ))}
                </>
              )}

              {/* ── İLETİŞİM ── */}
              {dossierTab === "iletisim" && (
                <>
                  <div className="ds-block">
                    <div className="ds-block-label">Federasyon</div>
                    <div className="ds-block-val" style={{ fontSize: 14 }}>{selectedDir?.federationName ?? selected.federationName}</div>
                  </div>

                  <div className="ds-block">
                    <div className="ds-block-label">Başkan</div>
                    <div className="contact-row">
                      <div className="contact-main">{selected.president}</div>
                    </div>
                  </div>

                  {selectedDir?.secretaryGeneral && (
                    <div className="ds-block">
                      <div className="ds-block-label">Genel Sekreter</div>
                      <div className="contact-row">
                        <div className="contact-main">{selectedDir.secretaryGeneral}</div>
                      </div>
                    </div>
                  )}

                  {selectedDir?.email && (
                    <div className="ds-block">
                      <div className="ds-block-label">E-posta</div>
                      <div className="contact-row">
                        <div className="contact-main contact-link">{selectedDir.email}</div>
                      </div>
                    </div>
                  )}

                  {selectedDir?.phone && (
                    <div className="ds-block">
                      <div className="ds-block-label">Telefon</div>
                      <div className="contact-main">{selectedDir.phone}</div>
                    </div>
                  )}

                  {selectedDir?.website && (
                    <div className="ds-block">
                      <div className="ds-block-label">Website</div>
                      <div className="contact-main contact-link">{selectedDir.website}</div>
                    </div>
                  )}

                  {(selectedDir?.addressLine1 || selectedDir?.city) && (
                    <div className="ds-block">
                      <div className="ds-block-label">Adres</div>
                      <div className="ds-block-text">
                        {[selectedDir?.addressLine1, selectedDir?.addressLine2, selectedDir?.city, selectedDir?.country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  )}

                  {selectedDir?.disciplines && selectedDir.disciplines.length > 0 && (
                    <div className="ds-block">
                      <div className="ds-block-label">Branşlar</div>
                      <div className="discipline-chips">
                        {selectedDir.disciplines.map(d => (
                          <span key={d} className="discipline-chip">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── SPOR ── */}
              {dossierTab === "spor" && (
                <>
                  {selected.achievements?.length > 0 && (
                    <div className="ds-block">
                      <div className="ds-block-label">Başarılar</div>
                      {selected.achievements.slice(0, 4).map((a, i) => (
                        <div key={i} className="achievement-row">
                          <span className="achievement-bullet">▸</span>
                          <span className="achievement-text">{translateStrategicText(a)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sportHighlights.length > 0 && (
                    <div className="ds-block">
                      <div className="ds-block-label">Spor Profili</div>
                      {sportHighlights.map((h, i) => (
                        <div key={i} className="achievement-row">
                          <span className="achievement-bullet">▸</span>
                          <span className="achievement-text">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.figRoles?.length > 0 && (
                    <div className="ds-block">
                      <div className="ds-block-label">FIG Rolleri</div>
                      {selected.figRoles.slice(0, 5).map((r, i) => (
                        <div key={i} className="role-row">
                          <div className="role-name">{r.name}</div>
                          <div className="role-title">{r.role}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selected.hostedEvents?.length > 0 && (
                    <div className="ds-block">
                      <div className="ds-block-label">Ev Sahipliği</div>
                      {selected.hostedEvents.slice(0, 3).map((e, i) => (
                        <div key={i} className="achievement-row">
                          <span className="achievement-bullet">▸</span>
                          <span className="achievement-text">{translateStrategicText(e)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sportHighlights.length === 0 && !selected.achievements?.length && !selected.figRoles?.length && (
                    <div className="empty-state">Bu federasyon için spor verisi bulunamadı.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
