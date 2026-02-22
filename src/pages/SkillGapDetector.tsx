import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  ExternalLink,
  Plus,
  X,
  ChevronDown,
  Zap,
  TrendingUp,
  Shield,
  Star,
  Search,
  BarChart3,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { companies, studentProfile } from "@/lib/mockData";

/* ─────────────────────────────────────────────
   Skill requirement database per company
   (priority: "critical" | "important" | "good-to-have")
───────────────────────────────────────────── */
interface RequiredSkill {
  skill: string;
  priority: "critical" | "important" | "good-to-have";
  description: string;
}

interface LearningResource {
  title: string;
  platform: string;
  url: string;
  free: boolean;
  duration: string;
}

interface SkillMeta {
  resources: LearningResource[];
}

/* Curated resources for every possible gap skill */
const SKILL_RESOURCES: Record<string, LearningResource[]> = {
  "Financial Modelling": [
    { title: "Financial Modelling & Valuation Analyst (FMVA)", platform: "CFI", url: "https://corporatefinanceinstitute.com", free: false, duration: "6–8 weeks" },
    { title: "Excel Financial Modelling Bootcamp", platform: "Udemy", url: "https://udemy.com", free: false, duration: "12 hrs" },
    { title: "WSP Financial Modelling Course", platform: "Wall Street Prep", url: "https://wallstreetprep.com", free: false, duration: "8 weeks" },
  ],
  "DCF Valuation": [
    { title: "DCF Valuation – Step by Step", platform: "Aswath Damodaran (NYU)", url: "https://pages.stern.nyu.edu/~adamodar", free: true, duration: "Self-paced" },
    { title: "Equity Valuation & Analysis", platform: "Coursera", url: "https://coursera.org", free: false, duration: "4 weeks" },
  ],
  "Excel (Advanced)": [
    { title: "Excel Skills for Business Specialization", platform: "Coursera / Macquarie", url: "https://coursera.org", free: false, duration: "6 weeks" },
    { title: "Advanced Excel – Pivot, VBA, Power Query", platform: "Udemy", url: "https://udemy.com", free: false, duration: "10 hrs" },
  ],
  "Bloomberg Terminal": [
    { title: "Bloomberg Market Concepts (BMC)", platform: "Bloomberg", url: "https://learn.bloomberg.com/online/course/bloomberg-market-concepts", free: false, duration: "8 hrs" },
    { title: "BMC Free Trial via College Portal", platform: "Bloomberg", url: "https://learn.bloomberg.com", free: true, duration: "Self-paced" },
  ],
  "Credit Analysis": [
    { title: "Credit Analysis & Lending – Certificate", platform: "IIBF", url: "https://iibf.org.in", free: false, duration: "3 months" },
    { title: "Credit Risk Modelling", platform: "CFI", url: "https://corporatefinanceinstitute.com", free: false, duration: "4 weeks" },
  ],
  "PowerPoint (Pitch Decks)": [
    { title: "Business Communication & Presentations", platform: "LinkedIn Learning", url: "https://linkedin.com/learning", free: false, duration: "5 hrs" },
    { title: "McKinsey Presentation Techniques", platform: "YouTube – Ex-McKinsey Explains", url: "https://youtube.com", free: true, duration: "2 hrs" },
  ],
  "Case Analysis (MECE)": [
    { title: "Case Interview Secrets – Victor Cheng", platform: "CaseInterview.com", url: "https://caseinterview.com", free: false, duration: "Self-paced" },
    { title: "PrepLounge – 1600+ Practice Cases", platform: "PrepLounge", url: "https://preplounge.com", free: false, duration: "Ongoing" },
    { title: "Case in Point (8th Ed.) – Book", platform: "Amazon / Flipkart", url: "https://amazon.in", free: false, duration: "Self-paced" },
  ],
  "Hypothesis-Driven Thinking": [
    { title: "Structured Thinking for Consultants", platform: "Coursera / Duke", url: "https://coursera.org", free: false, duration: "3 weeks" },
    { title: "MECE Framework Deep Dive", platform: "YouTube – McKinsey Alumni", url: "https://youtube.com", free: true, duration: "3 hrs" },
  ],
  "Market Sizing": [
    { title: "Market Sizing Masterclass", platform: "PrepLounge", url: "https://preplounge.com", free: false, duration: "2 hrs" },
    { title: "Guesstimate Practice Problems", platform: "CaseInterviewMath.com", url: "https://caseinterviewmath.com", free: true, duration: "Self-paced" },
  ],
  "Brand Management (STP / 4P)": [
    { title: "Marketing Management – Kotler (Book)", platform: "Pearson", url: "https://pearson.com", free: false, duration: "Self-paced" },
    { title: "Brand Management – HSM Certification", platform: "IIMA / MICA", url: "https://iima.ac.in", free: false, duration: "8 weeks" },
  ],
  "Consumer Insights": [
    { title: "Consumer Behaviour – IIM Bangalore", platform: "edX", url: "https://edx.org", free: false, duration: "6 weeks" },
    { title: "Nielsen / KANTAR Market Reports", platform: "Nielsen IQ", url: "https://nielseniq.com", free: true, duration: "Self-paced" },
  ],
  "Digital Marketing": [
    { title: "Google Digital Garage – Fundamentals", platform: "Google", url: "https://learndigital.withgoogle.com", free: true, duration: "40 hrs" },
    { title: "Meta Blueprint – Facebook Ads", platform: "Meta", url: "https://facebook.com/business/learn", free: true, duration: "Self-paced" },
  ],
  "Market Research": [
    { title: "Marketing Analytics Specialization", platform: "Coursera / UVA", url: "https://coursera.org", free: false, duration: "5 weeks" },
    { title: "SPSS / R for Market Research", platform: "Udemy", url: "https://udemy.com", free: false, duration: "8 hrs" },
  ],
  "Channel Sales & Distribution": [
    { title: "Sales Management Certification", platform: "XLRI Online", url: "https://xlri.ac.in", free: false, duration: "6 weeks" },
    { title: "Trade Marketing & Distribution", platform: "LinkedIn Learning", url: "https://linkedin.com/learning", free: false, duration: "4 hrs" },
  ],
  "Wealth Management": [
    { title: "NISM Series V-A – Mutual Fund Distributor", platform: "NISM", url: "https://www.nism.ac.in", free: false, duration: "40 hrs" },
    { title: "CFA Level 1 – Portfolio Management", platform: "CFA Institute", url: "https://cfainstitute.org", free: false, duration: "6 months" },
  ],
  "Portfolio Management": [
    { title: "Investment Management – Wharton", platform: "Coursera", url: "https://coursera.org", free: false, duration: "5 weeks" },
    { title: "CFA Institute Free eBooks", platform: "CFA Institute", url: "https://cfainstitute.org", free: true, duration: "Self-paced" },
  ],
  "Financial Statement Analysis": [
    { title: "Financial Accounting – HarvardX", platform: "edX", url: "https://edx.org", free: false, duration: "10 weeks" },
    { title: "Understanding Financial Statements", platform: "CFI (Free)", url: "https://corporatefinanceinstitute.com", free: true, duration: "3 hrs" },
  ],
  "Due Diligence": [
    { title: "M&A and Deal Structuring", platform: "CFI", url: "https://corporatefinanceinstitute.com", free: false, duration: "4 weeks" },
    { title: "Financial Due Diligence – Deloitte Guide", platform: "Deloitte Insights", url: "https://deloitte.com", free: true, duration: "Self-paced" },
  ],
  "Risk Management": [
    { title: "FRM Part 1 Prep", platform: "Bionic Turtle", url: "https://bionicturtle.com", free: false, duration: "3 months" },
    { title: "Risk Management Essentials", platform: "Coursera / NYU", url: "https://coursera.org", free: false, duration: "4 weeks" },
  ],
  "P&L Management": [
    { title: "Finance for Non-Finance Managers", platform: "LinkedIn Learning", url: "https://linkedin.com/learning", free: false, duration: "6 hrs" },
    { title: "Business Finance – Khan Academy", platform: "Khan Academy", url: "https://khanacademy.org", free: true, duration: "Self-paced" },
  ],
  "SQL / Data Analysis": [
    { title: "SQL for Data Analysis", platform: "Mode / free online", url: "https://mode.com/sql-tutorial", free: true, duration: "10 hrs" },
    { title: "Google Data Analytics Certificate", platform: "Coursera / Google", url: "https://coursera.org", free: false, duration: "6 months" },
  ],
  "Power BI / Tableau": [
    { title: "Power BI – Microsoft Learn", platform: "Microsoft", url: "https://learn.microsoft.com", free: true, duration: "8 hrs" },
    { title: "Tableau Desktop Specialist", platform: "Tableau / Udemy", url: "https://udemy.com", free: false, duration: "10 hrs" },
  ],
  "Negotiation": [
    { title: "Successful Negotiation – Coursera / Michigan", platform: "Coursera", url: "https://coursera.org", free: false, duration: "4 weeks" },
    { title: "Negotiation Masterclass – Chris Voss", platform: "MasterClass", url: "https://masterclass.com", free: false, duration: "3 hrs" },
  ],
  "Macroeconomics": [
    { title: "Principles of Macroeconomics – Khan Academy", platform: "Khan Academy", url: "https://khanacademy.org", free: true, duration: "Self-paced" },
    { title: "Economic Policy & Current Affairs – ET", platform: "Economic Times", url: "https://economictimes.com", free: true, duration: "Daily" },
  ],
};

/* ─────────────────────────────────────────────
   Campus companies with required skills
───────────────────────────────────────────── */
interface CompanyRequirements {
  companyId: string;
  requiredSkills: RequiredSkill[];
  roleContext: string;
}

const COMPANY_REQUIREMENTS: CompanyRequirements[] = [
  {
    companyId: "1", // Goldman Sachs
    roleContext: "You'll work on live M&A deals, IPOs, and debt capital markets. Technical finance skills and Excel fluency are non-negotiable.",
    requiredSkills: [
      { skill: "Financial Modelling", priority: "critical", description: "Build 3-statement models, LBO, and M&A merger models from scratch." },
      { skill: "DCF Valuation", priority: "critical", description: "Discounted Cash Flow analysis for company valuation in pitches and live deals." },
      { skill: "Excel (Advanced)", priority: "critical", description: "Advanced Excel — shortcuts, formulas, model auditing, and sensitivity tables." },
      { skill: "Bloomberg Terminal", priority: "important", description: "Pulling market data, comps, and bond pricing for deals and presentations." },
      { skill: "PowerPoint (Pitch Decks)", priority: "important", description: "Build boardroom-ready pitch books and management presentations." },
      { skill: "Financial Statement Analysis", priority: "important", description: "Analysing P&L, Balance Sheet, and Cash Flow for target companies." },
      { skill: "Macroeconomics", priority: "good-to-have", description: "Awareness of interest rates, monetary policy, and macro indicators affecting deals." },
      { skill: "Negotiation", priority: "good-to-have", description: "Effective negotiation in client interactions and deal team dynamics." },
    ],
  },
  {
    companyId: "2", // McKinsey
    roleContext: "You'll solve complex business problems for C-suite clients. Structured thinking, communication, and data-driven storytelling are the core competencies.",
    requiredSkills: [
      { skill: "Case Analysis (MECE)", priority: "critical", description: "Mutually exclusive, collectively exhaustive problem structuring for client case interviews." },
      { skill: "Hypothesis-Driven Thinking", priority: "critical", description: "Start with a hypothesis, test it with data, and synthesise insights." },
      { skill: "Market Sizing", priority: "critical", description: "Estimate market size and business metrics through structured guesstimates." },
      { skill: "PowerPoint (Pitch Decks)", priority: "important", description: "Consulting decks follow the Pyramid Principle — top-down, insight-led." },
      { skill: "Excel (Advanced)", priority: "important", description: "Build financial and operations models to back up strategic recommendations." },
      { skill: "SQL / Data Analysis", priority: "important", description: "Query and analyse large datasets to extract business insights." },
      { skill: "Macroeconomics", priority: "good-to-have", description: "Macro context informs strategy recommendations in economic consulting cases." },
    ],
  },
  {
    companyId: "3", // HUL
    roleContext: "You'll own a brand's P&L, lead consumer insights, and execute GTM campaigns. Brand thinking and consumer empathy are your most important tools.",
    requiredSkills: [
      { skill: "Brand Management (STP / 4P)", priority: "critical", description: "Segmentation, targeting, positioning, and the 4P marketing mix for brand strategy." },
      { skill: "Consumer Insights", priority: "critical", description: "Primary research, focus groups, NPS, and translating data into brand decisions." },
      { skill: "P&L Management", priority: "critical", description: "Manage a brand's profit & loss — revenue, COGS, A&P spend, and margins." },
      { skill: "Market Research", priority: "important", description: "Quantitative & qualitative research to size opportunities and validate campaigns." },
      { skill: "Digital Marketing", priority: "important", description: "Plan and execute brand campaigns across digital channels with measurable ROI." },
      { skill: "Case Analysis (MECE)", priority: "important", description: "Structured approach to FMCG case interviews: declining sales, pricing, launches." },
      { skill: "Power BI / Tableau", priority: "good-to-have", description: "Dashboard-driven tracking of brand KPIs, market share, and campaign ROI." },
    ],
  },
  {
    companyId: "4", // HDFC Bank
    roleContext: "You'll manage corporate client relationships, assess credit proposals, and oversee working capital solutions. Financial acumen and relationship skills are key.",
    requiredSkills: [
      { skill: "Credit Analysis", priority: "critical", description: "Assess creditworthiness through financial ratio analysis and cash flow projections." },
      { skill: "Financial Statement Analysis", priority: "critical", description: "Read and interpret P&L, Balance Sheet, and Cash Flow for lending decisions." },
      { skill: "Excel (Advanced)", priority: "important", description: "Build credit models, cash flow projections, and loan repayment schedules." },
      { skill: "Risk Management", priority: "important", description: "Identify, quantify, and mitigate credit, market, and operational risks." },
      { skill: "Macroeconomics", priority: "important", description: "RBI policy changes, inflation, and liquidity directly impact corporate banking decisions." },
      { skill: "Negotiation", priority: "important", description: "Structure loan terms and pricing with corporate treasury and finance heads." },
      { skill: "PowerPoint (Pitch Decks)", priority: "good-to-have", description: "Present credit proposals and relationship reviews to internal credit committees." },
    ],
  },
  {
    companyId: "5", // Deloitte
    roleContext: "You'll advise on M&A transactions, financial restructuring, and risk. Both consulting thinking and financial depth are valued.",
    requiredSkills: [
      { skill: "Due Diligence", priority: "critical", description: "Financial, tax, and commercial due diligence for M&A and restructuring mandates." },
      { skill: "Financial Modelling", priority: "critical", description: "Build deal models, synergy assessments, and integration financial models." },
      { skill: "Case Analysis (MECE)", priority: "important", description: "Structured problem-solving for client advisory — same as consulting case approach." },
      { skill: "Risk Management", priority: "important", description: "Identify financial, operational, and compliance risks in target companies." },
      { skill: "Financial Statement Analysis", priority: "important", description: "Deep-dive into target company financials to identify red flags and value drivers." },
      { skill: "PowerPoint (Pitch Decks)", priority: "important", description: "Build client-ready reports, findings decks, and proposal presentations." },
      { skill: "Excel (Advanced)", priority: "important", description: "Audit financial models, build trackers, and analyse large datasets." },
      { skill: "SQL / Data Analysis", priority: "good-to-have", description: "Extract and analyse financial data from ERP systems during due diligence." },
    ],
  },
  {
    companyId: "6", // P&G India
    roleContext: "You'll own a brand's P&L from day one. P&G values leaders who think like owners — consumer-first, data-driven, and execution-focused.",
    requiredSkills: [
      { skill: "Brand Management (STP / 4P)", priority: "critical", description: "Define brand strategy, target segments, and execute multi-channel brand plans." },
      { skill: "P&L Management", priority: "critical", description: "Own trade spends, A&P budgets, and top/bottom line performance." },
      { skill: "Consumer Insights", priority: "critical", description: "Develop deep consumer understanding through qual and quant research." },
      { skill: "Digital Marketing", priority: "important", description: "Lead brand's digital presence — social, search, influencer, and performance marketing." },
      { skill: "Market Research", priority: "important", description: "Syndicate research, brand health trackers, and usage & attitude studies." },
      { skill: "Case Analysis (MECE)", priority: "important", description: "Structured case interviews are central to P&G's assessment centre process." },
      { skill: "Negotiation", priority: "good-to-have", description: "Trade and channel negotiations with key accounts and modern trade partners." },
    ],
  },
  {
    companyId: "7", // Kotak Mahindra Bank – Wealth
    roleContext: "You'll manage HNI and ultra-HNI wealth portfolios. Investment knowledge, client communication, and regulatory awareness are essential.",
    requiredSkills: [
      { skill: "Wealth Management", priority: "critical", description: "Construct and manage multi-asset portfolios for high-net-worth clients." },
      { skill: "Portfolio Management", priority: "critical", description: "Asset allocation, risk-return optimisation, and rebalancing strategies." },
      { skill: "Financial Statement Analysis", priority: "important", description: "Evaluate equity and fixed-income instruments through fundamentals." },
      { skill: "DCF Valuation", priority: "important", description: "Intrinsic value estimation for equity recommendations to clients." },
      { skill: "Risk Management", priority: "important", description: "Understand client risk profiles and manage downside exposure." },
      { skill: "Macroeconomics", priority: "important", description: "Macro indicators shape asset class calls and portfolio tilt decisions." },
      { skill: "Negotiation", priority: "good-to-have", description: "Retain and grow client AUM through effective relationship management." },
    ],
  },
  {
    companyId: "8", // Nestlé India – Area Sales Manager
    roleContext: "You'll manage a region's P&L, drive distributor ROI, and lead a team of sales representatives. Execution and field leadership are prized.",
    requiredSkills: [
      { skill: "Channel Sales & Distribution", priority: "critical", description: "Manage GT/MT channels, distributor networks, and last-mile penetration." },
      { skill: "P&L Management", priority: "critical", description: "Responsible for territory revenue, volume targets, and trade spend efficiency." },
      { skill: "Market Research", priority: "important", description: "Conduct market visits, outlet surveys, and share-of-shelf analysis." },
      { skill: "Negotiation", priority: "important", description: "Negotiate shelf space, promotions, and margins with key accounts and distributors." },
      { skill: "Brand Management (STP / 4P)", priority: "important", description: "Translate national brand strategy into local market execution plans." },
      { skill: "Excel (Advanced)", priority: "good-to-have", description: "MIS reporting, territory performance dashboards, and distributor claim management." },
      { skill: "Power BI / Tableau", priority: "good-to-have", description: "Build regional sales dashboards for area review meetings." },
    ],
  },
];

/* ─────────────────────────────────────────────
   Priority config
───────────────────────────────────────────── */
const PRIORITY_CONFIG = {
  critical:       { label: "Critical",       color: "text-destructive",  bg: "bg-destructive/12",  dot: "bg-destructive",  border: "border-destructive/30" },
  important:      { label: "Important",      color: "text-warning",      bg: "bg-warning/12",      dot: "bg-warning",      border: "border-warning/30" },
  "good-to-have": { label: "Good to Have",  color: "text-info",         bg: "bg-info/12",         dot: "bg-info",         border: "border-info/30" },
};

/* ─────────────────────────────────────────────
   Score ring
───────────────────────────────────────────── */
function ScoreRing({ score, size = 120, stroke = 11 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#10b981" : score >= 45 ? "hsl(var(--info))" : "hsl(var(--warning))";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="font-display font-bold text-3xl text-foreground"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {score}%
        </motion.span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Gap skill card
───────────────────────────────────────────── */
function GapSkillCard({ req, delay }: { req: RequiredSkill; delay: number }) {
  const [open, setOpen] = useState(false);
  const cfg = PRIORITY_CONFIG[req.priority];
  const resources = SKILL_RESOURCES[req.skill] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className={`rounded-xl border ${cfg.border} bg-card shadow-card overflow-hidden`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
      >
        <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{req.skill}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{req.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                📚 Recommended Learning Resources
              </p>
              {resources.length === 0 ? (
                <p className="text-xs text-muted-foreground">Search this skill on Coursera, Udemy, or YouTube for quality courses.</p>
              ) : (
                resources.map((res, i) => (
                  <a
                    key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{res.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-muted-foreground">{res.platform}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{res.duration}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${res.free ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {res.free ? "Free" : "Paid"}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1 group-hover:text-primary" />
                  </a>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Matched skill pill
───────────────────────────────────────────── */
function MatchedSkillPill({ skill, priority, delay }: { skill: string; priority: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-lg px-3 py-2"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
      <span className="text-sm font-medium text-foreground flex-1">{skill}</span>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.bg ?? "bg-muted"} ${PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.color ?? "text-muted-foreground"}`}>
        {PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.label ?? priority}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const DEFAULT_SKILLS = studentProfile.skills;

export default function SkillGapDetector() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [mySkills, setMySkills] = useState<string[]>(DEFAULT_SKILLS);
  const [inputSkill, setInputSkill] = useState("");
  const [analysed, setAnalysed] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const requirements = COMPANY_REQUIREMENTS.find(r => r.companyId === selectedCompanyId);

  const addSkill = useCallback(() => {
    const t = inputSkill.trim();
    if (t && !mySkills.includes(t)) setMySkills(p => [...p, t]);
    setInputSkill("");
  }, [inputSkill, mySkills]);

  const removeSkill = (s: string) => setMySkills(p => p.filter(x => x !== s));

  const handleAnalyse = () => {
    if (!selectedCompanyId || !requirements) return;
    setAnalysing(true);
    setAnalysed(false);
    setTimeout(() => { setAnalysed(true); setAnalysing(false); }, 1600);
  };

  const handleReset = () => { setAnalysed(false); setAnalysing(false); };

  /* Match logic */
  const normalise = (s: string) => s.toLowerCase().trim();
  const mySkillNorm = mySkills.map(normalise);

  const matchedSkills = requirements?.requiredSkills.filter(req =>
    mySkillNorm.some(s => s.includes(normalise(req.skill)) || normalise(req.skill).includes(s))
  ) ?? [];

  const gapSkills = requirements?.requiredSkills.filter(req =>
    !mySkillNorm.some(s => s.includes(normalise(req.skill)) || normalise(req.skill).includes(s))
  ) ?? [];

  const criticalGaps = gapSkills.filter(g => g.priority === "critical");
  const importantGaps = gapSkills.filter(g => g.priority === "important");
  const niceGaps = gapSkills.filter(g => g.priority === "good-to-have");

  const totalRequired = requirements?.requiredSkills.length ?? 0;
  const matchScore = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0;

  const matchLabel =
    matchScore >= 75 ? { text: "Strong Match", color: "text-success", bg: "bg-success/15" }
  : matchScore >= 50 ? { text: "Good Match", color: "text-info", bg: "bg-info/15" }
  : matchScore >= 25 ? { text: "Partial Match", color: "text-warning", bg: "bg-warning/15" }
  : { text: "Significant Gaps", color: "text-destructive", bg: "bg-destructive/15" };

  const filteredCompanies = searchQuery
    ? companies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))
    : companies;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" /> Skill Gap Detector
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Select a company visiting campus, enter your current skills, and instantly see your skill gaps with
          curated learning resources for every missing skill.
        </p>
      </motion.div>

      {/* Step 1: Company Selection */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</div>
          <h3 className="font-display font-semibold text-foreground">Select Target Company</h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            placeholder="Search company or role…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {filteredCompanies.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => { setSelectedCompanyId(c.id); setAnalysed(false); }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all
                ${selectedCompanyId === c.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
                }`}
            >
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
                {c.logo}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{c.type}</span>
                  <span className="text-[10px] text-muted-foreground">{c.package}</span>
                </div>
              </div>
              {selectedCompanyId === c.id && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Step 2: My Skills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</div>
          <h3 className="font-display font-semibold text-foreground">Your Current Skills</h3>
          <span className="text-xs text-muted-foreground ml-auto">Pre-filled from your profile — edit as needed</span>
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            placeholder="Add a skill (e.g. DCF Valuation, Tableau)…"
            value={inputSkill}
            onChange={e => setInputSkill(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
          />
          <button onClick={addSkill} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {mySkills.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {s}
              <button onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {mySkills.length === 0 && (
            <p className="text-xs text-muted-foreground">Add at least one skill to run the analysis.</p>
          )}
        </div>

        <button
          disabled={!selectedCompanyId || mySkills.length === 0 || analysing}
          onClick={handleAnalyse}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-semibold text-sm
            bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {analysing ? (
            <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" /></svg> Analysing…</>
          ) : (
            <><Zap className="w-4 h-4" /> Detect My Skill Gaps <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {analysed && requirements && selectedCompany && (
          <motion.div
            key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Role context */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-card rounded-xl border border-border px-5 py-4 shadow-card"
            >
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
                {selectedCompany.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-semibold text-foreground">{selectedCompany.name}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground">{selectedCompany.role}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{requirements.roleContext}</p>
              </div>
              <button onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors shrink-0">
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </motion.div>

            {/* Score dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
                {/* Ring */}
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={matchScore} />
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${matchLabel.bg} ${matchLabel.color}`}>
                    {matchLabel.text}
                  </span>
                  <p className="text-xs text-muted-foreground">Skill Match Score</p>
                </div>

                <div className="hidden sm:block w-px h-28 bg-border" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", val: matchedSkills.length, label: "Matched" },
                    { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", val: gapSkills.length, label: "Gaps" },
                    { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", val: criticalGaps.length, label: "Critical" },
                  ].map(({ icon: Icon, color, bg, val, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <span className="font-display font-bold text-2xl text-foreground">{val}</span>
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block w-px h-28 bg-border" />

                {/* Priority breakdown */}
                <div className="space-y-2 min-w-[140px]">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Gap Breakdown</p>
                  {[
                    { label: "Critical", count: criticalGaps.length, color: "bg-destructive" },
                    { label: "Important", count: importantGaps.length, color: "bg-warning" },
                    { label: "Good to Have", count: niceGaps.length, color: "bg-info" },
                  ].map(g => (
                    <div key={g.label} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${g.color} shrink-0`} />
                      <span className="text-xs text-muted-foreground flex-1">{g.label}</span>
                      <span className="text-xs font-semibold text-foreground">{g.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Matched Skills */}
            {matchedSkills.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-success" /> Skills You Already Have ({matchedSkills.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {matchedSkills.map((s, i) => (
                    <MatchedSkillPill key={s.skill} skill={s.skill} priority={s.priority} delay={0.12 + i * 0.04} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gap Skills */}
            {gapSkills.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-destructive" /> Skills to Develop ({gapSkills.length})
                  <span className="text-xs text-muted-foreground font-normal ml-1">— click any row to see learning resources</span>
                </h3>

                {criticalGaps.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">🚨 Critical Gaps — Learn First</p>
                    </div>
                    <div className="space-y-2">
                      {criticalGaps.map((g, i) => <GapSkillCard key={g.skill} req={g} delay={0.22 + i * 0.05} />)}
                    </div>
                  </div>
                )}

                {importantGaps.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">⚠️ Important Gaps — Build Alongside</p>
                    </div>
                    <div className="space-y-2">
                      {importantGaps.map((g, i) => <GapSkillCard key={g.skill} req={g} delay={0.3 + i * 0.05} />)}
                    </div>
                  </div>
                )}

                {niceGaps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-info" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">💡 Good to Have — Polish Later</p>
                    </div>
                    <div className="space-y-2">
                      {niceGaps.map((g, i) => <GapSkillCard key={g.skill} req={g} delay={0.38 + i * 0.05} />)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* No gaps */}
            {gapSkills.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 bg-success/10 border border-success/30 rounded-2xl p-10 text-center"
              >
                <Star className="w-10 h-10 text-success" />
                <div>
                  <p className="font-display font-bold text-foreground text-lg">No Skill Gaps Detected! 🎉</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You already have all the required skills for {selectedCompany.role} at {selectedCompany.name}.
                    Focus on deepening expertise and preparing for behavioural rounds!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action tip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-card"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Pro tip: </span>
                Add the critical gap skills to your {" "}
                <span className="text-primary font-medium">Preparation checklist</span> and set a 30-day learning sprint.
                Focus on Critical gaps first — they have the highest impact on your selection chances.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
