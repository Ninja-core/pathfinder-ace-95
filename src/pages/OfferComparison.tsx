import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Plus,
  X,
  IndianRupee,
  MapPin,
  Briefcase,
  TrendingUp,
  Heart,
  Star,
  Trophy,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Pencil,
  Building2,
  Lightbulb,
  BarChart3,
  Medal,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Offer {
  id: string;
  company: string;
  role: string;
  domain: string;
  ctc: number;            // LPA
  joiningBonus: number;   // ₹ (0 if none)
  location: string;
  wfhPolicy: "Remote" | "Hybrid" | "On-site";
  healthInsurance: boolean;
  relocation: boolean;
  growthRating: number;   // 1–5
  wlbRating: number;      // 1–5
  brandRating: number;    // 1–5
  notes: string;
}

/* ─────────────────────────────────────────────
   Demo seed offers (pre-loaded)
───────────────────────────────────────────── */
const SEED_OFFERS: Offer[] = [
  {
    id: "o1", company: "Goldman Sachs", role: "Investment Banking Analyst",
    domain: "Investment Banking", ctc: 28, joiningBonus: 200000, location: "Mumbai",
    wfhPolicy: "Hybrid", healthInsurance: true, relocation: true,
    growthRating: 5, wlbRating: 2, brandRating: 5, notes: "High pressure, excellent exit ops",
  },
  {
    id: "o2", company: "McKinsey & Company", role: "Business Analyst",
    domain: "Consulting", ctc: 32, joiningBonus: 0, location: "Delhi / Mumbai",
    wfhPolicy: "Hybrid", healthInsurance: true, relocation: true,
    growthRating: 5, wlbRating: 3, brandRating: 5, notes: "Best brand name, global exposure",
  },
  {
    id: "o3", company: "Hindustan Unilever", role: "Brand Manager Trainee",
    domain: "FMCG / Marketing", ctc: 24, joiningBonus: 100000, location: "Mumbai",
    wfhPolicy: "Hybrid", healthInsurance: true, relocation: false,
    growthRating: 4, wlbRating: 4, brandRating: 4, notes: "Great brand training, structured growth",
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const DOMAIN_OPTIONS = [
  "Investment Banking", "Consulting", "FMCG / Marketing", "Corporate Banking",
  "Equity Research", "Digital Marketing", "Sales & BD", "Supply Chain",
  "Private Equity", "Product Management", "HR / People", "Operations",
];
const WFH_OPTIONS: Offer["wfhPolicy"][] = ["Remote", "Hybrid", "On-site"];

const WFH_BADGE: Record<Offer["wfhPolicy"], string> = {
  Remote: "bg-success/15 text-success",
  Hybrid: "bg-info/15 text-info",
  "On-site": "bg-muted text-muted-foreground",
};

function shortLPA(v: number) { return `₹${v} LPA`; }
function formatBonus(v: number) { return v > 0 ? `₹${(v / 100000).toFixed(1)} L` : "—"; }
function inhand(ctc: number) {
  // rough monthly in-hand ≈ (CTC * 0.7) / 12
  return `₹${((ctc * 100000 * 0.7) / 12 / 1000).toFixed(0)}K/mo`;
}

function StarRow({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < value ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}>
          <Star className={`w-5 h-5 transition-colors ${i <= value ? "text-amber-400 fill-amber-400" : "text-muted-foreground hover:text-amber-300"}`} />
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Weighted score (0–100)
───────────────────────────────────────────── */
function computeScore(offer: Offer, allOffers: Offer[]): number {
  const maxCTC = Math.max(...allOffers.map(o => o.ctc));
  const ctcNorm  = maxCTC > 0 ? (offer.ctc / maxCTC) * 100 : 50;
  const bonusNorm = offer.joiningBonus > 0 ? 10 : 0;
  const growthNorm = (offer.growthRating / 5) * 100;
  const wlbNorm   = (offer.wlbRating / 5) * 100;
  const brandNorm = (offer.brandRating / 5) * 100;
  const insNorm   = offer.healthInsurance ? 100 : 0;
  const relNorm   = offer.relocation ? 100 : 0;

  return Math.round(
    ctcNorm * 0.30 +
    growthNorm * 0.25 +
    brandNorm * 0.15 +
    wlbNorm * 0.15 +
    insNorm * 0.05 +
    relNorm * 0.05 +
    bonusNorm * 0.05
  );
}

/* ─────────────────────────────────────────────
   Comparison rows config
───────────────────────────────────────────── */
interface CompRow {
  key: string;
  label: string;
  icon: React.ElementType;
  render: (o: Offer) => React.ReactNode;
  rawValue: (o: Offer) => number;   // for highlighting winner
  higherIsBetter: boolean;
  section: "financial" | "role" | "benefits" | "growth";
}

const COMP_ROWS: CompRow[] = [
  {
    key: "ctc", label: "Total CTC", icon: IndianRupee, section: "financial",
    render: o => <span className="font-bold text-foreground">{shortLPA(o.ctc)}</span>,
    rawValue: o => o.ctc, higherIsBetter: true,
  },
  {
    key: "inhand", label: "Est. In-Hand", icon: IndianRupee, section: "financial",
    render: o => <span className="text-foreground">{inhand(o.ctc)}</span>,
    rawValue: o => o.ctc, higherIsBetter: true,
  },
  {
    key: "bonus", label: "Joining Bonus", icon: Trophy, section: "financial",
    render: o => <span className={o.joiningBonus > 0 ? "text-success font-semibold" : "text-muted-foreground"}>{formatBonus(o.joiningBonus)}</span>,
    rawValue: o => o.joiningBonus, higherIsBetter: true,
  },
  {
    key: "location", label: "Location", icon: MapPin, section: "role",
    render: o => <span className="text-foreground">{o.location}</span>,
    rawValue: () => 0, higherIsBetter: true,
  },
  {
    key: "domain", label: "Domain", icon: Briefcase, section: "role",
    render: o => <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">{o.domain}</span>,
    rawValue: () => 0, higherIsBetter: true,
  },
  {
    key: "wfh", label: "WFH Policy", icon: Building2, section: "role",
    render: o => <span className={`text-xs font-medium px-2 py-1 rounded-full ${WFH_BADGE[o.wfhPolicy]}`}>{o.wfhPolicy}</span>,
    rawValue: o => o.wfhPolicy === "Remote" ? 3 : o.wfhPolicy === "Hybrid" ? 2 : 1, higherIsBetter: true,
  },
  {
    key: "health", label: "Health Insurance", icon: Heart, section: "benefits",
    render: o => o.healthInsurance
      ? <CheckCircle2 className="w-4 h-4 text-success" />
      : <X className="w-4 h-4 text-muted-foreground" />,
    rawValue: o => o.healthInsurance ? 1 : 0, higherIsBetter: true,
  },
  {
    key: "relocation", label: "Relocation Allow.", icon: MapPin, section: "benefits",
    render: o => o.relocation
      ? <CheckCircle2 className="w-4 h-4 text-success" />
      : <X className="w-4 h-4 text-muted-foreground" />,
    rawValue: o => o.relocation ? 1 : 0, higherIsBetter: true,
  },
  {
    key: "growth", label: "Career Growth", icon: TrendingUp, section: "growth",
    render: o => <StarRow value={o.growthRating} />,
    rawValue: o => o.growthRating, higherIsBetter: true,
  },
  {
    key: "wlb", label: "Work-Life Balance", icon: Scale, section: "growth",
    render: o => <StarRow value={o.wlbRating} />,
    rawValue: o => o.wlbRating, higherIsBetter: true,
  },
  {
    key: "brand", label: "Brand Reputation", icon: Medal, section: "growth",
    render: o => <StarRow value={o.brandRating} />,
    rawValue: o => o.brandRating, higherIsBetter: true,
  },
];

const SECTIONS: { key: CompRow["section"]; label: string; color: string }[] = [
  { key: "financial", label: "💰 Financial Package", color: "bg-blue-500/10 text-blue-600" },
  { key: "role",      label: "💼 Role & Location",   color: "bg-purple-500/10 text-purple-600" },
  { key: "benefits",  label: "🛡️ Benefits",          color: "bg-emerald-500/10 text-emerald-600" },
  { key: "growth",    label: "📈 Growth & Culture",  color: "bg-amber-500/10 text-amber-600" },
];

/* ─────────────────────────────────────────────
   Offer Form (Add / Edit)
───────────────────────────────────────────── */
const EMPTY: Omit<Offer, "id"> = {
  company: "", role: "", domain: "Consulting", ctc: 0, joiningBonus: 0,
  location: "", wfhPolicy: "Hybrid", healthInsurance: true, relocation: false,
  growthRating: 3, wlbRating: 3, brandRating: 3, notes: "",
};

function OfferForm({
  initial, onSave, onCancel,
}: { initial: Omit<Offer, "id">; onSave: (o: Omit<Offer, "id">) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Omit<Offer, "id">>(initial);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.company.trim() && form.role.trim() && form.ctc > 0;

  const inputCls = "w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Company *</label>
          <input className={inputCls} placeholder="e.g. Goldman Sachs" value={form.company} onChange={e => set("company", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Role *</label>
          <input className={inputCls} placeholder="e.g. Investment Banking Analyst" value={form.role} onChange={e => set("role", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Domain</label>
          <select className={inputCls} value={form.domain} onChange={e => set("domain", e.target.value)}>
            {DOMAIN_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">CTC (LPA) *</label>
          <input className={inputCls} type="number" min={0} placeholder="e.g. 28" value={form.ctc || ""} onChange={e => set("ctc", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Joining Bonus (₹)</label>
          <input className={inputCls} type="number" min={0} placeholder="e.g. 200000" value={form.joiningBonus || ""} onChange={e => set("joiningBonus", parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Location</label>
          <input className={inputCls} placeholder="e.g. Mumbai" value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">WFH Policy</label>
          <select className={inputCls} value={form.wfhPolicy} onChange={e => set("wfhPolicy", e.target.value as Offer["wfhPolicy"])}>
            {WFH_OPTIONS.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Career Growth</label>
          <StarInput value={form.growthRating} onChange={v => set("growthRating", v)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Work-Life Balance</label>
          <StarInput value={form.wlbRating} onChange={v => set("wlbRating", v)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Brand Reputation</label>
          <StarInput value={form.brandRating} onChange={v => set("brandRating", v)} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" checked={form.healthInsurance} onChange={e => set("healthInsurance", e.target.checked)}
            className="w-4 h-4 rounded accent-primary" />
          Health Insurance
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" checked={form.relocation} onChange={e => set("relocation", e.target.checked)}
            className="w-4 h-4 rounded accent-primary" />
          Relocation Allowance
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Notes / Pros & Cons</label>
        <textarea rows={2} className={`${inputCls} resize-none`} placeholder="e.g. High pressure but great exit ops..."
          value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={() => valid && onSave(form)} disabled={!valid}
          className="flex-1 py-2.5 rounded-xl font-display font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
          Save Offer
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Score bar for comparison header
───────────────────────────────────────────── */
function ScoreBar({ score, rank, delay }: { score: number; rank: number; delay: number }) {
  const color = score >= 70 ? "#10b981" : score >= 50 ? "hsl(var(--info))" : "hsl(var(--warning))";
  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <motion.span className="font-display font-extrabold text-2xl text-foreground"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
        {score}
      </motion.span>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay }} />
      </div>
      {rank === 1 && (
        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
          <Trophy className="w-3 h-3" /> Top Pick
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const OFFER_COLORS = [
  { header: "from-blue-600 to-blue-400",  ring: "#3b82f6" },
  { header: "from-violet-600 to-violet-400", ring: "#7c3aed" },
  { header: "from-pink-600 to-pink-400",  ring: "#ec4899" },
  { header: "from-amber-600 to-amber-400", ring: "#d97706" },
];

export default function OfferComparison() {
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const scores = useMemo(() =>
    offers.map(o => ({ id: o.id, score: computeScore(o, offers) })),
    [offers]
  );
  const rankedOffers = useMemo(() =>
    [...offers].sort((a, b) => {
      const sa = scores.find(s => s.id === a.id)?.score ?? 0;
      const sb = scores.find(s => s.id === b.id)?.score ?? 0;
      return sb - sa;
    }),
    [offers, scores]
  );

  const addOffer = (data: Omit<Offer, "id">) => {
    setOffers(p => [...p, { ...data, id: `o${Date.now()}` }]);
    setShowAddForm(false);
  };
  const deleteOffer = (id: string) => setOffers(p => p.filter(o => o.id !== id));
  const saveEdit = (id: string, data: Omit<Offer, "id">) => {
    setOffers(p => p.map(o => o.id === id ? { ...data, id } : o));
    setEditId(null);
  };

  const toggleSection = (key: string) => setCollapsedSections(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  /* winner per row */
  const getWinner = (row: CompRow): string | null => {
    if (row.rawValue(offers[0]) === 0 && row.rawValue(offers[1] ?? offers[0]) === 0) return null;
    const best = offers.reduce((a, b) =>
      row.higherIsBetter ? (row.rawValue(b) > row.rawValue(a) ? b : a) : (row.rawValue(b) < row.rawValue(a) ? b : a)
    );
    const bestVal = row.rawValue(best);
    const winners = offers.filter(o => row.rawValue(o) === bestVal);
    return winners.length === 1 ? winners[0].id : null; // no highlight if tied
  };

  const topOffer = rankedOffers[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" /> Offer Comparison Tool
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Compare up to 4 offers side-by-side across salary, benefits, and career growth.
            Best values in each row are highlighted <span className="text-success font-medium">green</span>.
          </p>
        </div>
        {offers.length < 4 && !showAddForm && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setShowAddForm(true); setEditId(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Offer
          </motion.button>
        )}
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div key="add-form"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Add New Offer
            </h3>
            <OfferForm initial={EMPTY} onSave={addOffer} onCancel={() => setShowAddForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* No offers */}
      {offers.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-card rounded-2xl border border-dashed border-border p-16 flex flex-col items-center gap-4 text-center">
          <Scale className="w-12 h-12 text-muted-foreground" />
          <div>
            <p className="font-display font-semibold text-foreground">No offers yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Offer" to start comparing your placement offers.</p>
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      {offers.length > 0 && (
        <AnimatePresence>
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Offer header cards */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${rankedOffers.length}, 1fr)` }}>
              <div /> {/* spacer for row labels column */}
              {rankedOffers.map((offer, idx) => {
                const col = OFFER_COLORS[idx % OFFER_COLORS.length];
                const score = scores.find(s => s.id === offer.id)?.score ?? 0;
                const rank = rankedOffers.findIndex(o => o.id === offer.id) + 1;
                const isEditing = editId === offer.id;

                return (
                  <motion.div key={offer.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                    className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
                  >
                    {/* Gradient cap */}
                    <div className={`bg-gradient-to-br ${col.header} px-4 py-4 relative`}>
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button onClick={() => setEditId(isEditing ? null : offer.id)}
                          className="w-6 h-6 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                          <Pencil className="w-3 h-3 text-white" />
                        </button>
                        <button onClick={() => deleteOffer(offer.id)}
                          className="w-6 h-6 rounded-md bg-white/20 hover:bg-red-400/60 flex items-center justify-center transition-colors">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-sm mb-2">
                        {offer.company.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="font-display font-bold text-white text-sm leading-tight">{offer.company}</p>
                      <p className="text-white/80 text-xs mt-0.5">{offer.role}</p>
                    </div>
                    <div className="px-4 py-4">
                      <ScoreBar score={score} rank={rank} delay={0.1 + idx * 0.06} />
                      <p className="text-[10px] text-muted-foreground text-center mt-1">Overall Score</p>
                    </div>

                    {/* Edit form inline */}
                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border px-4 pb-4 pt-3"
                        >
                          <OfferForm
                            initial={{ company: offer.company, role: offer.role, domain: offer.domain, ctc: offer.ctc,
                              joiningBonus: offer.joiningBonus, location: offer.location, wfhPolicy: offer.wfhPolicy,
                              healthInsurance: offer.healthInsurance, relocation: offer.relocation,
                              growthRating: offer.growthRating, wlbRating: offer.wlbRating,
                              brandRating: offer.brandRating, notes: offer.notes }}
                            onSave={(data) => saveEdit(offer.id, data)}
                            onCancel={() => setEditId(null)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Comparison rows by section */}
            {SECTIONS.map(section => {
              const sectionRows = COMP_ROWS.filter(r => r.section === section.key);
              const collapsed = collapsedSections.has(section.key);

              return (
                <div key={section.key} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${section.color}`}>{section.label}</span>
                    {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
                  </button>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border divide-y divide-border">
                          {sectionRows.map((row, ri) => {
                            const winnerId = getWinner(row);
                            const Icon = row.icon;
                            return (
                              <div key={row.key}
                                className="grid items-center"
                                style={{ gridTemplateColumns: `200px repeat(${rankedOffers.length}, 1fr)` }}
                              >
                                {/* Row label */}
                                <div className="flex items-center gap-2 px-5 py-3.5 bg-muted/30">
                                  <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="text-xs font-semibold text-muted-foreground">{row.label}</span>
                                </div>
                                {/* Values */}
                                {rankedOffers.map(offer => {
                                  const isWinner = winnerId === offer.id;
                                  return (
                                    <div key={offer.id}
                                      className={`flex items-center justify-center px-3 py-3.5 border-l border-border transition-colors
                                        ${isWinner ? "bg-success/8" : ri % 2 === 0 ? "" : "bg-muted/20"}`}
                                    >
                                      <div className="flex flex-col items-center gap-0.5">
                                        {row.render(offer)}
                                        {isWinner && (
                                          <span className="text-[9px] font-bold text-success flex items-center gap-0.5">
                                            <Trophy className="w-2.5 h-2.5" /> Best
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Notes row */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">📝 Notes</span>
              </div>
              <div className="grid divide-x divide-border"
                style={{ gridTemplateColumns: `200px repeat(${rankedOffers.length}, 1fr)` }}>
                <div className="px-5 py-4 bg-muted/30 flex items-center">
                  <span className="text-xs font-semibold text-muted-foreground">Your Notes</span>
                </div>
                {rankedOffers.map(offer => (
                  <div key={offer.id} className="px-4 py-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {offer.notes || <span className="italic">—</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            {topOffer && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/25 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-foreground text-base">
                    🏆 Recommendation: {topOffer.company}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    <span className="font-semibold text-foreground">{topOffer.role}</span> at {topOffer.company} scores highest
                    overall ({scores.find(s => s.id === topOffer.id)?.score}/100) — led by{" "}
                    {topOffer.ctc >= Math.max(...offers.map(o => o.ctc)) ? "its highest CTC, " : ""}
                    {topOffer.growthRating === 5 ? "top-tier career growth, " : ""}
                    {topOffer.brandRating === 5 ? "premium brand reputation, " : ""}
                    and strong overall value.
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary">
                      {shortLPA(topOffer.ctc)} CTC
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {topOffer.location}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${WFH_BADGE[topOffer.wfhPolicy]}`}>
                      {topOffer.wfhPolicy}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Weight legend */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="bg-card rounded-xl border border-border px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="font-semibold">Score Weights:</span>
              </div>
              {[
                { label: "CTC", w: "30%" }, { label: "Growth", w: "25%" },
                { label: "Brand", w: "15%" }, { label: "WLB", w: "15%" },
                { label: "Benefits", w: "10%" }, { label: "Bonus", w: "5%" },
              ].map(({ label, w }) => (
                <span key={label} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{label}</span> {w}
                </span>
              ))}
              <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Modify weights by editing offers above
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
