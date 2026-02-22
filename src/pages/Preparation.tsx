import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  ShoppingBag,
  Brain,
  Lightbulb,
  Globe,
  BookOpen,
  ExternalLink,
  Filter,
  BarChart3,
  Target,
  Layers,
} from "lucide-react";
import { useAppState } from "@/lib/AppContext";

/* ─────────────────────────────────────────────
   Domain config
───────────────────────────────────────────── */
const DOMAINS = [
  { key: "All",              icon: Layers,      color: "bg-muted text-foreground" },
  { key: "Finance",         icon: TrendingUp,   color: "bg-blue-500/15 text-blue-600" },
  { key: "Marketing",       icon: ShoppingBag,  color: "bg-pink-500/15 text-pink-600" },
  { key: "Consulting",      icon: Brain,        color: "bg-purple-500/15 text-purple-600" },
  { key: "Entrepreneurship",icon: Lightbulb,    color: "bg-amber-500/15 text-amber-600" },
  { key: "Digital Marketing",icon: Globe,       color: "bg-cyan-500/15 text-cyan-600" },
  { key: "General",         icon: BookOpen,     color: "bg-muted text-muted-foreground" },
];

const DOMAIN_BADGE: Record<string, string> = {
  Finance:          "bg-blue-500/12 text-blue-600",
  Marketing:        "bg-pink-500/12 text-pink-600",
  Consulting:       "bg-purple-500/12 text-purple-600",
  Entrepreneurship: "bg-amber-500/12 text-amber-600",
  "Digital Marketing": "bg-cyan-500/12 text-cyan-600",
  General:          "bg-muted text-muted-foreground",
  Aptitude:         "bg-muted text-muted-foreground",
  Interview:        "bg-success/15 text-success",
};

/* ─────────────────────────────────────────────
   Resources — grouped by domain
───────────────────────────────────────────── */
interface Resource {
  title: string;
  description: string;
  domain: string;
  icon: React.ElementType;
  link: string;
  tag: string;
}

const RESOURCES: Resource[] = [
  // Finance
  {
    title: "Financial Modelling & Valuation (WSP)",
    description: "Industry-standard DCF, LBO, and M&A modelling course.",
    domain: "Finance", icon: TrendingUp,
    link: "https://www.wallstreetprep.com", tag: "Course",
  },
  {
    title: "Mergers & Inquisitions",
    description: "Free IB interview guides, technical Q&A, and deal analysis.",
    domain: "Finance", icon: TrendingUp,
    link: "https://www.mergersandinquisitions.com", tag: "Website",
  },
  {
    title: "CFA Level 1 – Schweser Notes",
    description: "Essential for equity research, asset management, and banking tracks.",
    domain: "Finance", icon: TrendingUp,
    link: "https://www.kaplanschweser.com", tag: "Certification",
  },
  // Marketing
  {
    title: "HUL / P&G Brand Management Cases",
    description: "Real-world brand strategy, STP, and GTM case studies.",
    domain: "Marketing", icon: ShoppingBag,
    link: "https://www.hbs.edu/faculty/Pages/item.aspx?num=19", tag: "Cases",
  },
  {
    title: "Kotler's Principles of Marketing",
    description: "Bible of marketing — covers 4Ps, consumer behaviour, branding.",
    domain: "Marketing", icon: ShoppingBag,
    link: "https://www.pearson.com", tag: "Book",
  },
  {
    title: "Google Digital Garage – Marketing",
    description: "Free certified course on digital marketing fundamentals.",
    domain: "Marketing", icon: ShoppingBag,
    link: "https://learndigital.withgoogle.com", tag: "Free Course",
  },
  // Consulting
  {
    title: "Case in Point – Marc Cosentino",
    description: "The definitive guide to case interview frameworks and practice.",
    domain: "Consulting", icon: Brain,
    link: "https://www.caseinterview.com", tag: "Book",
  },
  {
    title: "PrepLounge",
    description: "1600+ consulting cases, peer practice, and expert coaches.",
    domain: "Consulting", icon: Brain,
    link: "https://www.preplounge.com", tag: "Platform",
  },
  {
    title: "McKinsey Problem Solving Test (PST)",
    description: "Official sample questions for MBB aptitude screening.",
    domain: "Consulting", icon: Brain,
    link: "https://www.mckinsey.com", tag: "Practice",
  },
  // Entrepreneurship
  {
    title: "YCombinator Startup School",
    description: "Free 8-week program by YC — from idea to product-market fit.",
    domain: "Entrepreneurship", icon: Lightbulb,
    link: "https://www.startupschool.org", tag: "Free Program",
  },
  {
    title: "The Lean Startup – Eric Ries",
    description: "Build-Measure-Learn loop for validating startup ideas fast.",
    domain: "Entrepreneurship", icon: Lightbulb,
    link: "https://theleanstartup.com", tag: "Book",
  },
  {
    title: "NSRCEL / IIM-B Incubator Resources",
    description: "Indian startup ecosystem guides and funding landscape.",
    domain: "Entrepreneurship", icon: Lightbulb,
    link: "https://nsrcel.org", tag: "Resource",
  },
  // Digital Marketing
  {
    title: "Google Analytics 4 Certification",
    description: "Master GA4 events, funnels, and attribution modelling.",
    domain: "Digital Marketing", icon: Globe,
    link: "https://skillshop.withgoogle.com", tag: "Certification",
  },
  {
    title: "Meta Blueprint – Facebook Ads",
    description: "Learn campaign structure, targeting, and ad optimisation.",
    domain: "Digital Marketing", icon: Globe,
    link: "https://www.facebook.com/business/learn", tag: "Certification",
  },
  {
    title: "SEMrush Academy",
    description: "SEO, SEM, content marketing, and competitive analysis courses.",
    domain: "Digital Marketing", icon: Globe,
    link: "https://www.semrush.com/academy", tag: "Free Course",
  },
  // General
  {
    title: "Economic Times – Markets & Business",
    description: "Stay updated on macro trends, sector news, and corporate deals.",
    domain: "General", icon: BookOpen,
    link: "https://economictimes.indiatimes.com", tag: "News",
  },
  {
    title: "Harvard Business Review",
    description: "Strategy, leadership, and management thought leadership articles.",
    domain: "General", icon: BookOpen,
    link: "https://hbr.org", tag: "Publication",
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function domainIcon(domain: string) {
  return DOMAINS.find((d) => d.key === domain)?.icon ?? BookOpen;
}
function domainColor(domain: string) {
  return DOMAINS.find((d) => d.key === domain)?.color ?? "bg-muted text-muted-foreground";
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function Preparation() {
  const { prepTasks, setPrepTasks } = useAppState();
  const [activeDomain, setActiveDomain] = useState("All");

  const toggleTask = (id: string) =>
    setPrepTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const filteredTasks =
    activeDomain === "All" ? prepTasks : prepTasks.filter((t) => t.category === activeDomain);

  const completed = prepTasks.filter((t) => t.completed).length;
  const pct = Math.round((completed / prepTasks.length) * 100);

  const filteredResources =
    activeDomain === "All" ? RESOURCES : RESOURCES.filter((r) => r.domain === activeDomain);

  // Domain-level completion stats
  const domainStats = DOMAINS.filter((d) => d.key !== "All").map((d) => {
    const tasks = prepTasks.filter((t) => t.category === d.key);
    const done = tasks.filter((t) => t.completed).length;
    return { ...d, total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
  }).filter((d) => d.total > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Preparation</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Track your MBA placement prep across Finance, Marketing, Consulting, Entrepreneurship &amp; more.
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="bg-card rounded-xl shadow-card border border-border p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-semibold text-foreground text-sm">Overall Progress</span>
          <span className="text-sm font-medium text-primary">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{completed} of {prepTasks.length} tasks completed</p>

        {/* Domain mini-stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {domainStats.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.button
                key={d.key}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.04 }}
                onClick={() => setActiveDomain(activeDomain === d.key ? "All" : d.key)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left
                  ${activeDomain === d.key ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{d.key}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{d.done}/{d.total}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Domain Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {DOMAINS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveDomain(key)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all
              ${activeDomain === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            <Icon className="w-3 h-3" /> {key}
          </button>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-card border border-border"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Task Checklist</h3>
            <span className="text-xs text-muted-foreground">
              {activeDomain === "All" ? `${completed}/${prepTasks.length}` : `${filteredTasks.filter(t=>t.completed).length}/${filteredTasks.length}`} done
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDomain}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="divide-y divide-border"
            >
              {filteredTasks.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No tasks found for this domain.
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    {t.completed
                      ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    }
                    <span className={`text-sm flex-1 leading-snug ${t.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {t.title}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${DOMAIN_BADGE[t.category] ?? "bg-muted text-muted-foreground"}`}>
                      {t.category}
                    </span>
                  </button>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-xl shadow-card border border-border flex flex-col"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Resources</h3>
            <span className="text-xs text-muted-foreground">{filteredResources.length} available</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border max-h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain + "-res"}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {filteredResources.map((r) => {
                  const Icon = domainIcon(r.domain);
                  const colorCls = domainColor(r.domain);
                  return (
                    <a
                      key={r.title}
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colorCls}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                          {r.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${DOMAIN_BADGE[r.domain] ?? "bg-muted text-muted-foreground"}`}>
                            {r.domain}
                          </span>
                          <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                            {r.tag}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Domain Tips Banner */}
      {activeDomain !== "All" && (
        <AnimatePresence>
          <motion.div
            key={activeDomain + "-tip"}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-card rounded-xl shadow-card border border-border p-5"
          >
            {activeDomain === "Finance" && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Finance Track Tips</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    <li>Master the 3-statement model before attempting LBO or M&A models.</li>
                    <li>Practice mental maths: % changes, ratios, and back-of-the-envelope valuations.</li>
                    <li>Read Bloomberg Quint and Financial Times daily to build sector awareness.</li>
                    <li>Learn Excel shortcuts deeply — F2, Alt+E+S+V, Ctrl+Shift+L are interview essentials.</li>
                  </ul>
                </div>
              </div>
            )}
            {activeDomain === "Marketing" && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-pink-500/15 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Marketing Track Tips</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    <li>Build a mock brand plan (Brand Audit → STP → 4Ps → Metrics) and present it.</li>
                    <li>Study HUL Summer Internship case patterns — they test consumer insight depth.</li>
                    <li>Track quarterly volume/value splits of FMCG categories from Nielsen reports.</li>
                    <li>Practice "declining sales" and "new product launch" cases for FMCG interviews.</li>
                  </ul>
                </div>
              </div>
            )}
            {activeDomain === "Consulting" && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Consulting Track Tips</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    <li>Practice 2–3 cases per day with a partner; give and receive structured feedback.</li>
                    <li>Use MECE frameworks: start broad (buckets), then drill down with hypotheses.</li>
                    <li>Narrative matters as much as the answer — practice "so what?" conclusions.</li>
                    <li>McKinsey focuses on problem-solving; BCG/Bain on structured communication — tailor prep.</li>
                  </ul>
                </div>
              </div>
            )}
            {activeDomain === "Entrepreneurship" && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Entrepreneurship Track Tips</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    <li>Validate your idea with 20 customer discovery interviews before writing a single line of code or investing money.</li>
                    <li>Build and present a one-page business canvas (BMC) for your startup idea.</li>
                    <li>Apply to campus incubators early — they provide mentorship, seed grants, and networks.</li>
                    <li>Understand unit economics: CAC, LTV, payback period, and contribution margin.</li>
                  </ul>
                </div>
              </div>
            )}
            {activeDomain === "Digital Marketing" && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Digital Marketing Track Tips</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    <li>Run a real campaign — even ₹500 on Meta/Google Ads teaches more than any course.</li>
                    <li>Know your funnel metrics cold: Impressions → CTR → Conversions → ROAS → CAC.</li>
                    <li>Build a portfolio: write 2–3 case studies on brands whose digital strategy you improved (hypothetically).</li>
                    <li>Learn GA4 deeply — recruiters love candidates who can read dashboards and drive decisions.</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
