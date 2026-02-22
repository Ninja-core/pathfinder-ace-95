import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  LineChart,
  BarChart3,
  Briefcase,
  Globe,
  Users,
  ShoppingBag,
  Building2,
  Target,
  Star,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Plus,
  X,
  ChevronRight,
  Brain,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface CareerPath {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  keySkills: string[];
  roleKeywords: string[];
  interestKeywords: string[];
  companies: Company[];
  roles: string[];
  roadmap: string[];
  match: number;
}

interface Company {
  name: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  domain: string;
}

/* ─────────────────────────────────────────────
   MBA / Finance / Marketing Career Paths
───────────────────────────────────────────── */
const CAREER_PATHS: Omit<CareerPath, "match">[] = [
  {
    id: "investment-banking",
    title: "Investment Banking",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    description:
      "Advise corporations and governments on M&A deals, IPOs, capital raising, and financial restructuring.",
    keySkills: [
      "financial modelling", "dcf", "valuation", "excel", "powerpoint", "m&a",
      "lbo", "ipo", "capital markets", "equity research", "accounting",
      "balance sheet", "p&l", "cash flow", "ratios", "bloomberg", "pitch deck",
    ],
    roleKeywords: [
      "investment banking", "ib", "m&a", "deal", "capital", "equity", "debt",
      "restructuring", "ipo", "underwriting", "leveraged buyout",
    ],
    interestKeywords: [
      "finance", "deals", "mergers", "investment banking", "capital markets",
      "wall street", "stock market", "financial analysis", "corporate finance",
    ],
    companies: [
      { name: "Goldman Sachs", tier: "Tier 1", domain: "Bulge Bracket Bank" },
      { name: "Morgan Stanley", tier: "Tier 1", domain: "Bulge Bracket Bank" },
      { name: "JPMorgan Chase", tier: "Tier 1", domain: "Bulge Bracket Bank" },
      { name: "Kotak Investment Banking", tier: "Tier 2", domain: "Indian IB" },
      { name: "IIFL Capital", tier: "Tier 2", domain: "Indian IB" },
      { name: "Axis Capital", tier: "Tier 2", domain: "Indian IB" },
      { name: "SBI Capital Markets", tier: "Tier 3", domain: "PSU/ Mid-Market" },
    ],
    roles: ["Investment Banking Analyst", "M&A Associate", "Capital Markets Analyst", "ECM/DCM Analyst", "Coverage Banker"],
    roadmap: [
      "Master 3-statement financial modelling (Excel)",
      "Learn DCF, Comparable Companies, Precedent Transactions",
      "Complete a live deal internship at a bank or boutique",
      "Build a deal tracker portfolio with real transaction tearsheets",
      "Nail technical IB interviews: accounting, valuation, M&A math",
    ],
  },
  {
    id: "consulting",
    title: "Management Consulting",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    description:
      "Help top executives solve complex strategic, operational, and organisational problems.",
    keySkills: [
      "case analysis", "case interview", "problem solving", "strategy", "mece",
      "frameworks", "data analysis", "excel", "powerpoint", "communication",
      "market entry", "profitability", "bcg matrix", "porter", "swot",
      "hypothesis", "guesstimate", "market sizing",
    ],
    roleKeywords: [
      "consulting", "strategy", "case", "advisory", "management", "operations",
      "transformation", "restructuring", "due diligence",
    ],
    interestKeywords: [
      "consulting", "strategy", "business problem solving", "management consulting",
      "case studies", "mckinsey", "bcg", "bain", "leadership", "organisational change",
    ],
    companies: [
      { name: "McKinsey & Company", tier: "Tier 1", domain: "MBB Consulting" },
      { name: "Boston Consulting Group", tier: "Tier 1", domain: "MBB Consulting" },
      { name: "Bain & Company", tier: "Tier 1", domain: "MBB Consulting" },
      { name: "Deloitte Consulting", tier: "Tier 2", domain: "Big 4 Consulting" },
      { name: "EY-Parthenon", tier: "Tier 2", domain: "Big 4 Strategy" },
      { name: "Kearney", tier: "Tier 2", domain: "Strategy Consulting" },
      { name: "KPMG Advisory", tier: "Tier 3", domain: "Big 4 Advisory" },
    ],
    roles: ["Business Analyst", "Strategy Consultant", "Associate Consultant", "Operations Consultant", "Digital Transformation Advisor"],
    roadmap: [
      "Solve 50+ consulting cases using MECE frameworks",
      "Practice guesstimates & market sizing daily",
      "Read Case in Point (Cosentino) and Victor Cheng LOMS",
      "Develop 5–6 strong leadership & STAR stories",
      "Apply early for off-campus & PPO consulting internships",
    ],
  },
  {
    id: "brand-management",
    title: "Brand & Marketing Management",
    icon: ShoppingBag,
    color: "text-pink-600",
    bgColor: "bg-pink-600/10",
    description:
      "Drive brand strategy, consumer insights, product launches, and P&L ownership for top consumer brands.",
    keySkills: [
      "brand management", "stp", "4p", "7p", "consumer behaviour", "market research",
      "digital marketing", "gtm", "go-to-market", "p&l", "advertising", "campaign",
      "fmcg", "media planning", "nps", "brand equity", "product launch", "pricing strategy",
    ],
    roleKeywords: [
      "brand", "marketing", "fmcg", "consumer", "campaign", "product launch",
      "category management", "trade marketing", "digital", "social media",
    ],
    interestKeywords: [
      "marketing", "brand building", "advertising", "consumer behaviour", "fmcg",
      "digital marketing", "social media", "product launch", "brand strategy",
    ],
    companies: [
      { name: "Hindustan Unilever", tier: "Tier 1", domain: "FMCG Giant" },
      { name: "Procter & Gamble", tier: "Tier 1", domain: "FMCG Giant" },
      { name: "Nestlé India", tier: "Tier 1", domain: "FMCG / Food" },
      { name: "ITC Limited", tier: "Tier 2", domain: "Diversified FMCG" },
      { name: "Marico", tier: "Tier 2", domain: "FMCG / Personal Care" },
      { name: "Dabur India", tier: "Tier 2", domain: "FMCG / Ayurveda" },
      { name: "Emami", tier: "Tier 3", domain: "FMCG / Healthcare" },
    ],
    roles: ["Assistant Brand Manager", "Brand Manager", "Category Manager", "Product Manager", "Trade Marketing Manager"],
    roadmap: [
      "Study STP, 4Ps, brand equity frameworks deeply",
      "Complete a brand management or marketing analytics course",
      "Build a mock brand plan for a real brand (as a project)",
      "Develop skills in Google Analytics, social listening tools",
      "Ace marketing case interviews: declining sales, new launch, pricing",
    ],
  },
  {
    id: "banking-finance",
    title: "Corporate & Retail Banking",
    icon: Building2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/10",
    description:
      "Manage corporate credit, retail lending, treasury, and wealth management for top Indian and global banks.",
    keySkills: [
      "credit analysis", "banking", "loans", "risk management", "treasury", "npa",
      "balance sheet", "ratio analysis", "working capital", "trade finance",
      "wealth management", "portfolio management", "aum", "regulatory",
      "rbi guidelines", "excel", "financial statements",
    ],
    roleKeywords: [
      "banking", "credit", "treasury", "wealth management", "retail banking",
      "corporate banking", "relationship management", "lending", "npa", "risk",
    ],
    interestKeywords: [
      "banking", "finance", "credit", "lending", "wealth management", "treasury",
      "financial markets", "risk", "insurance", "corporate finance",
    ],
    companies: [
      { name: "HDFC Bank", tier: "Tier 1", domain: "Private Bank" },
      { name: "ICICI Bank", tier: "Tier 1", domain: "Private Bank" },
      { name: "Axis Bank", tier: "Tier 2", domain: "Private Bank" },
      { name: "Kotak Mahindra Bank", tier: "Tier 2", domain: "Private Bank" },
      { name: "Yes Bank", tier: "Tier 2", domain: "Private Bank" },
      { name: "State Bank of India", tier: "Tier 3", domain: "PSU Bank" },
      { name: "Bank of Baroda", tier: "Tier 3", domain: "PSU Bank" },
    ],
    roles: ["Management Trainee – Credit", "Relationship Manager", "Treasury Analyst", "Wealth Manager", "Credit Analyst"],
    roadmap: [
      "Revise financial ratios, NPA norms, and RBI guidelines",
      "Learn credit appraisal and working capital assessment",
      "Build a mock credit memo for a mid-size company",
      "Prepare for GD/PI on current economic topics (RBI policy, inflation)",
      "Study NISM / CFA Level 1 for Wealth Management track",
    ],
  },
  {
    id: "equity-research",
    title: "Equity Research & Asset Management",
    icon: LineChart,
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/10",
    description:
      "Analyse listed companies, build investment theses, and manage equity/debt portfolios for investors.",
    keySkills: [
      "equity research", "stock analysis", "fundamental analysis", "technical analysis",
      "financial modelling", "dcf", "bloomberg", "screener", "sector research",
      "portfolio management", "mutual fund", "aum", "pe", "ev/ebitda",
      "buy-side", "sell-side", "cfa", "excel",
    ],
    roleKeywords: [
      "equity research", "research analyst", "portfolio", "investment", "buy-side",
      "sell-side", "fund management", "asset management", "mutual fund",
    ],
    interestKeywords: [
      "stock market", "equity research", "investing", "financial markets", "portfolio",
      "mutual funds", "cfa", "fundamental analysis", "asset management",
    ],
    companies: [
      { name: "Motilal Oswal", tier: "Tier 1", domain: "Broking / Research" },
      { name: "ICICI Direct", tier: "Tier 2", domain: "Broking / Research" },
      { name: "HDFC Securities", tier: "Tier 2", domain: "Broking / Research" },
      { name: "Edelweiss", tier: "Tier 2", domain: "Financial Services" },
      { name: "Mirae Asset", tier: "Tier 2", domain: "Asset Management" },
      { name: "UTI AMC", tier: "Tier 3", domain: "Mutual Fund" },
      { name: "Franklin Templeton", tier: "Tier 2", domain: "Asset Management" },
    ],
    roles: ["Equity Research Analyst", "Portfolio Analyst", "Fund Analyst", "Investment Analyst", "Research Associate"],
    roadmap: [
      "Write a 2-page initiating coverage report on a listed mid-cap",
      "Build a sector comparison model in Excel",
      "Clear CFA Level 1 (highly valued in this track)",
      "Follow SEBI circulars and RBI monetary policy regularly",
      "Practice stock pitches: thesis, valuation, risks, catalysts",
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing & Growth",
    icon: Globe,
    color: "text-cyan-600",
    bgColor: "bg-cyan-600/10",
    description:
      "Lead performance marketing, SEO/SEM, content strategy, and data-driven growth for brands and startups.",
    keySkills: [
      "digital marketing", "seo", "sem", "google ads", "meta ads", "social media",
      "content marketing", "email marketing", "analytics", "google analytics",
      "funnel", "roi", "cac", "ltv", "growth hacking", "a/b testing",
      "crm", "email", "conversion rate", "social listening",
    ],
    roleKeywords: [
      "digital", "seo", "sem", "social media", "growth", "performance marketing",
      "content", "email", "analytics", "brand digital", "e-commerce",
    ],
    interestKeywords: [
      "digital marketing", "social media", "content creation", "seo", "growth hacking",
      "influencer marketing", "e-commerce", "d2c brands", "performance marketing",
    ],
    companies: [
      { name: "Nykaa", tier: "Tier 2", domain: "D2C / E-Commerce" },
      { name: "Zomato", tier: "Tier 2", domain: "Food Tech" },
      { name: "boAt", tier: "Tier 2", domain: "D2C Consumer Electronics" },
      { name: "Meesho", tier: "Tier 2", domain: "Social Commerce" },
      { name: "MakeMyTrip", tier: "Tier 2", domain: "Travel / OTA" },
      { name: "WATConsult", tier: "Tier 3", domain: "Digital Agency" },
      { name: "iProspect", tier: "Tier 3", domain: "Digital Agency" },
    ],
    roles: ["Digital Marketing Manager", "Growth Manager", "SEO/SEM Analyst", "Performance Marketing Lead", "Content Strategist"],
    roadmap: [
      "Earn Google Ads & Google Analytics certifications",
      "Run real ad campaigns with a small budget (Meta / Google)",
      "Learn attribution modeling and multi-channel funnels",
      "Build a case study: improved ROAS / CAC for a brand",
      "Master tools: HubSpot, Semrush, Hotjar, Mailchimp",
    ],
  },
  {
    id: "sales-bd",
    title: "Sales & Business Development",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    description:
      "Drive revenue growth through B2B/B2C sales, partnerships, and market expansion strategies.",
    keySkills: [
      "sales", "business development", "bd", "crm", "negotiation", "b2b", "b2c",
      "key account management", "channel sales", "revenue", "cold calling",
      "pipeline", "conversion", "salesforce", "leadership", "territory management",
    ],
    roleKeywords: [
      "sales", "business development", "account management", "b2b", "b2c",
      "channel", "territory", "kam", "enterprise sales", "revenue",
    ],
    interestKeywords: [
      "sales", "business development", "entrepreneurship", "negotiation", "client relationships",
      "b2b sales", "revenue growth", "partnerships", "business strategy",
    ],
    companies: [
      { name: "Asian Paints", tier: "Tier 2", domain: "Paints / FMCG" },
      { name: "Berger Paints", tier: "Tier 2", domain: "Paints / FMCG" },
      { name: "Bajaj Allianz", tier: "Tier 2", domain: "BFSI / Insurance" },
      { name: "Tata Motors", tier: "Tier 2", domain: "Automotive" },
      { name: "Cipla", tier: "Tier 2", domain: "Pharma" },
      { name: "Max Life Insurance", tier: "Tier 3", domain: "Insurance" },
      { name: "HDFC Life", tier: "Tier 2", domain: "Insurance / BFSI" },
    ],
    roles: ["Area Sales Manager", "Key Account Manager", "Business Development Manager", "Territory Sales Manager", "National Sales Trainer"],
    roadmap: [
      "Master solution selling & consultative sales techniques",
      "Learn CRM tools: Salesforce, Zoho, HubSpot",
      "Build negotiation skills through role-plays and simulations",
      "Study channel & distribution management frameworks",
      "Practice GD/PI on market entry, sales turnaround cases",
    ],
  },
  {
    id: "supply-chain",
    title: "Supply Chain & Operations",
    icon: BarChart3,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    description:
      "Optimise end-to-end supply chains — procurement, inventory, logistics, and demand planning — for global firms.",
    keySkills: [
      "supply chain", "operations", "logistics", "procurement", "inventory management",
      "demand planning", "scm", "erp", "sap", "six sigma", "lean", "kaizen",
      "vendor management", "warehousing", "3pl", "forecast", "kpi",
    ],
    roleKeywords: [
      "supply chain", "operations", "logistics", "procurement", "inventory",
      "demand planning", "erp", "sap", "manufacturing", "plant operations",
    ],
    interestKeywords: [
      "supply chain", "operations management", "logistics", "lean manufacturing",
      "six sigma", "procurement", "erp", "warehousing", "global trade",
    ],
    companies: [
      { name: "Amazon Logistics", tier: "Tier 1", domain: "E-Commerce Logistics" },
      { name: "Maersk", tier: "Tier 1", domain: "Global Shipping" },
      { name: "Flipkart Supply Chain", tier: "Tier 2", domain: "E-Commerce" },
      { name: "DHL India", tier: "Tier 2", domain: "Logistics" },
      { name: "Mahindra Logistics", tier: "Tier 2", domain: "3PL Logistics" },
      { name: "Blue Dart", tier: "Tier 3", domain: "Express Logistics" },
      { name: "TVS Supply Chain", tier: "Tier 3", domain: "Automotive Logistics" },
    ],
    roles: ["Supply Chain Analyst", "Operations Manager", "Procurement Manager", "Demand Planner", "Logistics Manager"],
    roadmap: [
      "Earn Six Sigma Green Belt or APICS CPIM certification",
      "Learn SAP MM / SD modules (widely used in SCM)",
      "Build a supply chain optimisation project with data",
      "Understand Incoterms, customs, and import/export process",
      "Practice SCM case studies: bullwhip effect, network design",
    ],
  },
];

/* ─────────────────────────────────────────────
   Matching engine — no API, pure rule-based
───────────────────────────────────────────── */
function computeMatch(
  path: Omit<CareerPath, "match">,
  skills: string[],
  projects: string[],
  interests: string[]
): number {
  const normalize = (arr: string[]) => arr.map((s) => s.toLowerCase().trim());
  const skillSet = normalize(skills);
  const projectSet = normalize(projects);
  const interestSet = normalize(interests);

  let score = 0;

  skillSet.forEach((sk) => {
    if (path.keySkills.some((k) => sk.includes(k) || k.includes(sk))) score += 9;
  });
  projectSet.forEach((pr) => {
    if (path.roleKeywords.some((k) => pr.includes(k) || k.includes(pr))) score += 7;
  });
  interestSet.forEach((it) => {
    if (path.interestKeywords.some((k) => it.includes(k) || k.includes(it))) score += 5;
  });

  return Math.min(100, score);
}

function predict(skills: string[], projects: string[], interests: string[]): CareerPath[] {
  return CAREER_PATHS.map((p) => ({ ...p, match: computeMatch(p, skills, projects, interests) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 4);
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const TIER_BADGE: Record<string, string> = {
  "Tier 1": "bg-success/15 text-success",
  "Tier 2": "bg-info/15 text-info",
  "Tier 3": "bg-muted text-muted-foreground",
};

function TagInput({
  label, placeholder, values, onAdd, onRemove, hint,
}: {
  label: string; placeholder: string; values: string[];
  onAdd: (v: string) => void; onRemove: (v: string) => void; hint?: string;
}) {
  const [input, setInput] = useState("");
  const commit = () => {
    const t = input.trim();
    if (t && !values.includes(t)) onAdd(t);
    setInput("");
  };
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); } }}
        />
        <button onClick={commit} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {values.map((v) => (
            <span key={v} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {v}
              <button onClick={() => onRemove(v)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchBar({ match, delay }: { match: number; delay: number }) {
  const color = match >= 70 ? "hsl(var(--success))" : match >= 45 ? "hsl(var(--info))" : "hsl(var(--warning))";
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full" style={{ background: color }}
        initial={{ width: 0 }} animate={{ width: `${match}%` }}
        transition={{ duration: 0.9, ease: "easeOut", delay }}
      />
    </div>
  );
}

function PathCard({ path, rank, delay }: { path: CareerPath; rank: number; delay: number }) {
  const [tab, setTab] = useState<"companies" | "roles" | "roadmap">("companies");
  const match = path.match;
  const matchLabel = match >= 70 ? "Strong Match" : match >= 45 ? "Good Match" : match > 0 ? "Partial Match" : "Explore Path";
  const matchColor = match >= 70 ? "bg-success/15 text-success" : match >= 45 ? "bg-info/15 text-info" : "bg-warning/15 text-warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      <div className="px-5 pt-5 pb-4 flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${path.bgColor} shrink-0`}>
          <path.icon className={`w-5 h-5 ${path.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {rank === 1 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-500">
                <Star className="w-3 h-3" /> Top Pick
              </span>
            )}
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${matchColor}`}>{matchLabel}</span>
          </div>
          <h3 className="font-display font-bold text-foreground mt-1">{path.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{path.description}</p>
        </div>
        <div className="text-right shrink-0">
          <span className={`font-display font-bold text-2xl ${path.color}`}>{match}%</span>
          <p className="text-[10px] text-muted-foreground">match</p>
        </div>
      </div>
      <div className="px-5 pb-3">
        <MatchBar match={match} delay={delay + 0.1} />
      </div>

      <div className="flex border-t border-border">
        {(["companies", "roles", "roadmap"] as const).map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-medium py-2.5 capitalize transition-colors ${
              tab === t ? "bg-muted text-foreground border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/40"
            }`}
          >
            {t === "companies" ? "🏢 Companies" : t === "roles" ? "💼 Roles" : "🗺️ Roadmap"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="px-5 py-4"
        >
          {tab === "companies" && (
            <div className="space-y-2">
              {path.companies.slice(0, 5).map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">· {c.domain}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_BADGE[c.tier]}`}>{c.tier}</span>
                </div>
              ))}
              {path.companies.length > 5 && (
                <p className="text-xs text-muted-foreground pt-1">+{path.companies.length - 5} more companies…</p>
              )}
            </div>
          )}
          {tab === "roles" && (
            <div className="flex flex-wrap gap-2">
              {path.roles.map((r) => (
                <span key={r} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted border border-border text-foreground">
                  <Briefcase className="w-3 h-3 text-muted-foreground" /> {r}
                </span>
              ))}
            </div>
          )}
          {tab === "roadmap" && (
            <div className="space-y-2.5">
              {path.roadmap.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Quick chips
───────────────────────────────────────────── */
const QUICK_SKILLS = [
  "Financial Modelling", "Excel", "Case Analysis", "Brand Management",
  "Market Research", "DCF Valuation", "SQL", "Power BI", "SAP",
  "Digital Marketing", "Six Sigma", "CRM",
];
const QUICK_INTERESTS = [
  "Investment Banking", "Consulting", "FMCG Marketing",
  "Stock Market", "Digital Marketing", "Supply Chain",
  "Corporate Banking", "Entrepreneurship",
];

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function CareerPredictor() {
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [results, setResults] = useState<CareerPath[] | null>(null);
  const [analysing, setAnalysing] = useState(false);

  const addSkill    = (v: string) => setSkills((p) => [...p, v]);
  const removeSkill = (v: string) => setSkills((p) => p.filter((x) => x !== v));
  const addProject    = (v: string) => setProjects((p) => [...p, v]);
  const removeProject = (v: string) => setProjects((p) => p.filter((x) => x !== v));
  const addInterest    = (v: string) => setInterests((p) => [...p, v]);
  const removeInterest = (v: string) => setInterests((p) => p.filter((x) => x !== v));

  const canPredict = skills.length > 0 || interests.length > 0;

  const handlePredict = () => {
    if (!canPredict) return;
    setAnalysing(true);
    setResults(null);
    setTimeout(() => {
      setResults(predict(skills, projects, interests));
      setAnalysing(false);
    }, 1800);
  };

  const handleReset = () => {
    setSkills([]); setProjects([]); setInterests([]);
    setResults(null); setAnalysing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Career Path Predictor
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your MBA skills, projects, and interests to discover the best career tracks —
          Investment Banking, Consulting, FMCG, and more — plus the top companies and a personalised roadmap.
        </p>
      </motion.div>

      {/* Input Form */}
      {!results && !analysing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-6"
        >
          <TagInput
            label="Your Skills"
            placeholder="e.g. Financial Modelling, Brand Management, Excel…"
            values={skills} onAdd={addSkill} onRemove={removeSkill}
            hint="Type a skill and press Enter. Or tap quick-add chips below."
          />
          <div className="flex flex-wrap gap-2 -mt-3">
            {QUICK_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
              <button key={s} onClick={() => addSkill(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                + {s}
              </button>
            ))}
          </div>

          <div className="border-t border-border" />

          <TagInput
            label="Internship / Project Keywords"
            placeholder="e.g. DCF model for FMCG brand, Credit analysis project…"
            values={projects} onAdd={addProject} onRemove={removeProject}
            hint="Add brief descriptions or keywords from your MBA internships or projects."
          />

          <div className="border-t border-border" />

          <TagInput
            label="Career Interests"
            placeholder="e.g. Investment Banking, FMCG Marketing…"
            values={interests} onAdd={addInterest} onRemove={removeInterest}
            hint="What MBA career domains excite you the most?"
          />
          <div className="flex flex-wrap gap-2 -mt-3">
            {QUICK_INTERESTS.filter((i) => !interests.includes(i)).map((i) => (
              <button key={i} onClick={() => addInterest(i)}
                className="text-xs px-2.5 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                + {i}
              </button>
            ))}
          </div>

          <button
            disabled={!canPredict} onClick={handlePredict}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-semibold text-sm transition-all
              bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" /> Predict My Career Path <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Analysing */}
      {analysing && (
        <motion.div
          key="analysing" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border shadow-card p-12 flex flex-col items-center gap-5"
        >
          <div className="relative w-20 h-20">
            <svg className="w-full h-full animate-spin" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                strokeLinecap="round" strokeDasharray="55 160" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground">Matching your MBA profile…</p>
            <p className="text-sm text-muted-foreground mt-1">Comparing against 8 career tracks</p>
          </div>
          <div className="flex gap-2">
            {["Finance", "Marketing", "Consulting", "Operations"].map((s, i) => (
              <motion.span key={s}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4] }}
                transition={{ delay: i * 0.3, repeat: Infinity, duration: 1.1 }}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >{s}</motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results && !analysing && (
        <AnimatePresence>
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-card rounded-xl border border-border px-5 py-3.5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Career paths predicted</p>
                  <p className="text-xs text-muted-foreground">
                    Based on {skills.length} skills · {projects.length} projects · {interests.length} interests
                  </p>
                </div>
              </div>
              <button onClick={handleReset}
                className="text-xs font-medium text-primary hover:underline underline-offset-2 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Re-analyse
              </button>
            </motion.div>

            {results[0].match === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
                <Lightbulb className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <p className="text-sm text-warning">
                  No strong matches found. Try adding more specific skills (e.g. "Financial Modelling", "Brand Management", "Case Analysis") or interests.
                </p>
              </motion.div>
            )}

            <div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Top Recommended MBA Career Paths
              </motion.p>
              <div className="grid gap-5">
                {results.map((path, i) => (
                  <PathCard key={path.id} path={path} rank={i + 1} delay={0.08 + i * 0.07} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
