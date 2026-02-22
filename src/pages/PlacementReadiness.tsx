import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  FileText,
  Zap,
  Users,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  RefreshCw,
  Star,
  Target,
  BarChart3,
  Briefcase,
  BookOpen,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import { useAppState } from "@/lib/AppContext";
import { studentProfile } from "@/lib/mockData";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Dimension {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  accentColor: string;
  weight: number;          // % weight in total score
  score: number;           // 0–100
  description: string;
  howScored: string;
  tips: string[];
}

/* ─────────────────────────────────────────────
   MBA Skill pool — for skills coverage calc
───────────────────────────────────────────── */
const MBA_SKILLS_POOL = [
  "Financial Modelling", "DCF Valuation", "Excel", "Excel (Advanced)",
  "PowerPoint", "PowerPoint (Pitch Decks)", "Bloomberg Terminal",
  "Credit Analysis", "Case Analysis", "Case Analysis (MECE)",
  "Brand Management", "Brand Management (STP / 4P)", "Consumer Insights",
  "Market Research", "Digital Marketing", "P&L Management",
  "SQL", "SQL / Data Analysis", "Power BI", "Power BI / Tableau",
  "Tableau", "Negotiation", "Macroeconomics", "Risk Management",
  "Portfolio Management", "Wealth Management", "Due Diligence",
  "Channel Sales & Distribution", "Supply Chain", "SAP",
  "Market Sizing", "Hypothesis-Driven Thinking",
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function clamp(v: number, min = 0, max = 100) { return Math.max(min, Math.min(max, v)); }

function parseCGPA(cgpaStr: string): number {
  // "8.3/10" or "3.5/4.0"
  const parts = cgpaStr.split("/");
  if (parts.length !== 2) return 70;
  const val = parseFloat(parts[0]);
  const max = parseFloat(parts[1]);
  return Math.round((val / max) * 100);
}

function cgpaScore(cgpaRaw: number): number {
  // Map 0-100 (normalised CGPA) to a placement-readiness bucket
  if (cgpaRaw >= 90) return 100;
  if (cgpaRaw >= 80) return 88;
  if (cgpaRaw >= 70) return 72;
  if (cgpaRaw >= 60) return 55;
  return 35;
}

function skillsCoverageScore(skills: string[]): number {
  const norm = (s: string) => s.toLowerCase().trim();
  const myNorm = skills.map(norm);
  const matched = MBA_SKILLS_POOL.filter(p =>
    myNorm.some(s => s.includes(norm(p)) || norm(p).includes(s))
  ).length;
  return clamp(Math.round((matched / 12) * 100));   // 12 = target breadth
}

function prepScore(completed: number, total: number): number {
  if (total === 0) return 0;
  return clamp(Math.round((completed / total) * 100));
}

function applicationScore(applied: number): number {
  if (applied === 0) return 10;
  if (applied === 1) return 40;
  if (applied === 2) return 65;
  if (applied >= 3) return 85;
  return 100;
}

/* ─────────────────────────────────────────────
   Grade label
───────────────────────────────────────────── */
function getGrade(score: number) {
  if (score >= 85) return { label: "Placement Ready 🎯",  color: "text-success",     bg: "bg-success/15",     ring: "#10b981" };
  if (score >= 70) return { label: "Almost There 🔥",     color: "text-info",        bg: "bg-info/15",        ring: "hsl(var(--info))" };
  if (score >= 50) return { label: "On Track 📈",         color: "text-warning",     bg: "bg-warning/15",     ring: "hsl(var(--warning))" };
  return              { label: "Needs Focus ⚠️",          color: "text-destructive", bg: "bg-destructive/15", ring: "hsl(var(--destructive))" };
}

/* ─────────────────────────────────────────────
   Score Ring
───────────────────────────────────────────── */
function ScoreRing({ score, size = 180, stroke = 14, color }: { score: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
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
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <motion.span className="font-display font-extrabold text-4xl text-foreground"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
          {score}
        </motion.span>
        <span className="text-sm text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Dimension bar
───────────────────────────────────────────── */
function DimensionBar({ dim, delay }: { dim: Dimension; delay: number }) {
  const [open, setOpen] = useState(false);
  const grade = getGrade(dim.score);
  const Icon = dim.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dim.bgColor} shrink-0`}>
          <Icon className={`w-5 h-5 ${dim.color}`} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-sm font-semibold text-foreground">{dim.label}</p>
            <span className="text-[10px] text-muted-foreground font-medium">(weight: {dim.weight}%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: dim.accentColor }}
                initial={{ width: 0 }}
                animate={{ width: `${dim.score}%` }}
                transition={{ duration: 1, ease: "easeOut", delay }}
              />
            </div>
            <span className="text-sm font-bold text-foreground w-10 text-right shrink-0">{dim.score}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${grade.bg} ${grade.color} hidden sm:inline`}>
            {grade.label}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
              <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3 border border-border">
                <BarChart3 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">How this is scored</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{dim.howScored}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  💡 Tips to Improve
                </p>
                <div className="space-y-2">
                  {dim.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Editable slider input
───────────────────────────────────────────── */
function SliderInput({
  label, icon: Icon, iconClass, value, onChange, description,
}: {
  label: string; icon: React.ElementType; iconClass: string;
  value: number; onChange: (v: number) => void; description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconClass}`} />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onChange(Math.max(0, value - 5))} className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
            <Minus className="w-3 h-3 text-muted-foreground" />
          </button>
          <span className="w-10 text-center font-bold text-foreground text-sm">{value}</span>
          <button onClick={() => onChange(Math.min(100, value + 5))} className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
            <Plus className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>
      <input
        type="range" min={0} max={100} step={5} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110"
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Radar chart — pure SVG, no library
───────────────────────────────────────────── */
function RadarChart({ dims }: { dims: Dimension[] }) {
  const N = dims.length;
  const cx = 160; const cy = 150; const R = 110;
  const angleStep = (2 * Math.PI) / N;
  const getPoint = (i: number, r: number) => {
    const angle = -Math.PI / 2 + i * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  const dataPoints = dims.map((d, i) => getPoint(i, (d.score / 100) * R));
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 320 300" className="w-full max-w-xs mx-auto">
      {/* Grid rings */}
      {gridLevels.map((lvl, gi) => {
        const pts = dims.map((_, i) => getPoint(i, lvl * R)).map(p => `${p.x},${p.y}`).join(" ");
        return (
          <polygon key={gi} points={pts} fill="none" stroke="hsl(var(--border))"
            strokeWidth={gi === gridLevels.length - 1 ? 1.5 : 0.8} />
        );
      })}
      {/* Spokes */}
      {dims.map((_, i) => {
        const outer = getPoint(i, R);
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="hsl(var(--border))" strokeWidth="0.8" />;
      })}
      {/* Data polygon */}
      <motion.polygon
        points={polygonPoints}
        fill="hsl(var(--primary)/0.18)"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="4.5"
          fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.05 }} />
      ))}
      {/* Labels */}
      {dims.map((d, i) => {
        const pt = getPoint(i, R + 22);
        const Icon = d.icon;
        return (
          <text key={i} x={pt.x} y={pt.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fontWeight="600" fill="hsl(var(--muted-foreground))">
            {d.label.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Action Plan item
───────────────────────────────────────────── */
function ActionCard({ rank, item, delay }: { rank: number; item: { title: string; why: string; impact: "High" | "Medium" | "Low" }; delay: number }) {
  const impactColor = item.impact === "High" ? "bg-destructive/12 text-destructive" : item.impact === "Medium" ? "bg-warning/12 text-warning" : "bg-info/12 text-info";
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className="flex items-start gap-3 bg-muted/40 border border-border rounded-xl p-4"
    >
      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{rank}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${impactColor}`}>{item.impact} Impact</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.why}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function PlacementReadiness() {
  const { prepTasks, applications } = useAppState();

  // Auto-computed scores
  const completedTasks = prepTasks.filter(t => t.completed).length;
  const prepPct = prepScore(completedTasks, prepTasks.length);
  const skillsPct = skillsCoverageScore(studentProfile.skills);
  const cgpaNorm = parseCGPA(studentProfile.cgpa);
  const academicPct = cgpaScore(cgpaNorm);
  const appPct = applicationScore(applications.length);

  // User-controlled inputs
  const [resumeScore, setResumeScore] = useState(60);
  const [mockInterviewScore, setMockInterviewScore] = useState(55);
  const [extraScore, setExtraScore] = useState(50);  // Extra-curriculars / leadership

  const [showAssessment, setShowAssessment] = useState(true);
  const [showPlan, setShowPlan] = useState(false);
  const [assessed, setAssessed] = useState(false);

  /* ────── Dimensions definition ────── */
  const dimensions: Dimension[] = useMemo(() => [
    {
      key: "resume",
      label: "Resume Strength",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-500/12",
      accentColor: "#3b82f6",
      weight: 20,
      score: resumeScore,
      description: "Quality & impact of your MBA resume.",
      howScored: "Based on your self-assessment (use the Resume Analyzer tool for an objective score). Considers quantified impact bullets, format, ATS compatibility, and section completeness.",
      tips: [
        "Lead every bullet with an action verb + quantified result (₹ or %).",
        "Run your resume through the Resume Analyzer in the sidebar for an objective ATS score.",
        "Tailor your resume to each job description — mirror their keywords.",
        "Get a senior friend or placement cell coordinator to review your draft.",
      ],
    },
    {
      key: "skills",
      label: "Skills Coverage",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/12",
      accentColor: "#f59e0b",
      weight: 20,
      score: skillsPct,
      description: "Breadth of MBA-relevant skills you've declared.",
      howScored: `Auto-calculated: ${studentProfile.skills.length} skills in your profile are matched against a pool of 32 in-demand MBA skills. Add more skills in your profile to improve this score.`,
      tips: [
        "Add skills to your Profile page — the score updates automatically.",
        "Prioritise depth over breadth — 'Advanced Excel' beats 'MS Office'.",
        "Add certifications (CFA L1, Google Analytics, NISM) as skills.",
        "Use the Skill Gap Detector to see which skills matter most for your target companies.",
      ],
    },
    {
      key: "mock",
      label: "Mock Interview",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-500/12",
      accentColor: "#8b5cf6",
      weight: 25,
      score: mockInterviewScore,
      description: "Your self-assessed mock interview performance.",
      howScored: "Enter your average score across case and HR mock interviews you've done. 0 = haven't practised, 100 = consistently cracking interviews with strong feedback.",
      tips: [
        "Practise at least 3 mock cases per week on PrepLounge or with a batch-mate.",
        "Record yourself answering HR questions — body language matters as much as content.",
        "Join case interview prep clubs on campus and sign up for mock sessions.",
        "Use the STAR method for behavioural questions — Situation, Task, Action, Result.",
      ],
    },
    {
      key: "academic",
      label: "Academic Performance",
      icon: GraduationCap,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/12",
      accentColor: "#10b981",
      weight: 15,
      score: academicPct,
      description: `Auto-loaded from profile CGPA: ${studentProfile.cgpa}`,
      howScored: "Your normalised CGPA (vs max) is converted to a placement-readiness scale. Top-tier recruiters like Goldman Sachs and McKinsey typically filter at ≥3.3/4.0 or ≥7.5/10.",
      tips: [
        "If CGPA is borderline, build exceptional extra-curricular and project credentials to compensate.",
        "Highlight a strong upward CGPA trend if early semesters were weaker.",
        "Focus on domain-specific electives that are valued by your target sector (e.g. Derivatives for IB, CRM for Marketing).",
      ],
    },
    {
      key: "prep",
      label: "Prep Progress",
      icon: BookOpen,
      color: "text-pink-600",
      bgColor: "bg-pink-500/12",
      accentColor: "#ec4899",
      weight: 10,
      score: prepPct,
      description: `${completedTasks} of ${prepTasks.length} tasks done on the Preparation page.`,
      howScored: "Automatically computed from how many Preparation checklist tasks you've marked complete. Each completed task across Finance, Marketing, Consulting, and other domains contributes to this score.",
      tips: [
        "Open the Preparation page and tick off tasks as you complete them.",
        "Focus on domain-specific tasks first — quality beats quantity.",
        "Set a weekly target: 2 tasks per domain per week leading up to placement season.",
      ],
    },
    {
      key: "applications",
      label: "Application Activity",
      icon: Briefcase,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/12",
      accentColor: "#06b6d4",
      weight: 5,
      score: appPct,
      description: `${applications.length} companies applied/tracked in the system.`,
      howScored: "Based on how actively you're applying to placement opportunities. 0 applications = 10%, 1 = 40%, 2 = 65%, 3+ = 85%+. Tracking companies you're interested in also counts.",
      tips: [
        "Apply to at least 5–6 companies across sectors to keep your options open.",
        "Don't wait for 'perfect' readiness — apply and prepare simultaneously.",
        "Track every company in the Opportunities page to monitor deadlines.",
      ],
    },
    {
      key: "extra",
      label: "Leadership & Extra-curriculars",
      icon: Star,
      color: "text-rose-500",
      bgColor: "bg-rose-500/12",
      accentColor: "#f43f5e",
      weight: 5,
      score: extraScore,
      description: "Clubs, PORs, competitions, and case contests.",
      howScored: "Self-assessed score for positions of responsibility, case competition wins, club leadership, and campus initiatives. These are critical differentiators at the shortlisting stage.",
      tips: [
        "Hold a POR (club head, fest coordinator, committee lead) and document the scale (e.g. team of 20, 500 attendees).",
        "Participate in national case competitions — wins and even participation boost your profile.",
        "Add leadership stories to your resume bullets with measurable outcomes.",
        "Volunteering and CSR roles at scale (district/national) also count strongly.",
      ],
    },
  ], [resumeScore, mockInterviewScore, extraScore, skillsPct, academicPct, prepPct, completedTasks, prepTasks.length, applications.length]);

  /* ────── Weighted overall score ────── */
  const overallScore = useMemo(() => {
    const total = dimensions.reduce((sum, d) => sum + (d.score * d.weight) / 100, 0);
    return Math.round(total);
  }, [dimensions]);

  const grade = getGrade(overallScore);

  /* ────── Generate action plan ────── */
  type Impact = "High" | "Medium" | "Low";

  const actionPlan: { title: string; why: string; impact: Impact }[] = useMemo(() => {
    const sorted = [...dimensions].sort((a, b) => (a.score * a.weight) - (b.score * b.weight));
    return sorted.slice(0, 5).map(d => ({
      title: d.label,
      why: d.score < 40
        ? `Critical bottleneck — currently only ${d.score}%. This has a ${d.weight}% weight in your overall score.`
        : d.score < 65
        ? `Room for improvement at ${d.score}%. Improving by 20pts here adds ~${Math.round(d.weight * 0.2)} to your total score.`
        : `Solid at ${d.score}%. Small gains here (10pts) still add ~${Math.round(d.weight * 0.1)} to your total.`,
      impact: (d.score < 40 ? "High" : d.score < 65 ? "Medium" : "Low") as Impact,
    }));
  }, [dimensions]);

  /* ────── Percentile estimate ────── */
  const percentile = overallScore >= 85 ? "top 10%" : overallScore >= 70 ? "top 25%" : overallScore >= 55 ? "top 40%" : "bottom 50%";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" /> Placement Readiness Score
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          A holistic, weighted score across Resume, Skills, Mock Interviews, Academics, Prep Progress, and more.
          Adjust the sliders to reflect your current state and see where to focus.
        </p>
      </motion.div>

      {/* Score Hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl border border-border shadow-card p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Ring */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <ScoreRing score={overallScore} color={grade.ring} />
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${grade.bg} ${grade.color}`}>
              {grade.label}
            </span>
            <p className="text-xs text-muted-foreground text-center">
              Estimated <strong className="text-foreground">{percentile}</strong> of your MBA batch
            </p>
          </div>

          <div className="hidden md:block w-px self-stretch bg-border" />

          {/* Radar */}
          <div className="flex-1 min-w-0">
            <RadarChart dims={dimensions} />
          </div>

          <div className="hidden md:block w-px self-stretch bg-border" />

          {/* Quick stats */}
          <div className="flex flex-col gap-3 min-w-[160px]">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Score Breakdown</p>
            {dimensions.map(d => (
              <div key={d.key} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.accentColor }} />
                <span className="text-xs text-muted-foreground flex-1 truncate">{d.label}</span>
                <span className="text-xs font-bold text-foreground">{d.score}%</span>
              </div>
            ))}
            <div className="border-t border-border pt-2">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-bold text-foreground">Overall</span>
                <span className="text-xs font-extrabold text-primary ml-auto">{overallScore}/100</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inputs section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border shadow-card"
      >
        <button
          onClick={() => setShowAssessment(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">Self-Assessment Inputs</span>
            <span className="text-xs text-muted-foreground ml-1">— adjust to match your reality</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showAssessment ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showAssessment && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-border pt-5 grid sm:grid-cols-3 gap-6">
                <SliderInput
                  label="Resume Strength" icon={FileText} iconClass="text-blue-500"
                  value={resumeScore} onChange={setResumeScore}
                  description="0 = No resume / very weak; 100 = Polished, ATS-optimised, quantified bullets"
                />
                <SliderInput
                  label="Mock Interview Score" icon={Users} iconClass="text-purple-500"
                  value={mockInterviewScore} onChange={setMockInterviewScore}
                  description="0 = Never practised; 100 = Consistently cracking all case + HR rounds"
                />
                <SliderInput
                  label="Leadership & Extra-curriculars" icon={Star} iconClass="text-rose-500"
                  value={extraScore} onChange={setExtraScore}
                  description="0 = No PORs or competitions; 100 = Multiple club leadership + prize-winning cases"
                />
              </div>
              <div className="px-6 pb-5 grid sm:grid-cols-3 gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-3 bg-muted/40 rounded-lg px-3 py-2.5 border border-border">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Skills Coverage</p>
                    <p className="text-sm font-bold text-foreground">{skillsPct}% <span className="text-xs font-normal text-muted-foreground">— auto from profile</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/40 rounded-lg px-3 py-2.5 border border-border">
                  <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Academic CGPA</p>
                    <p className="text-sm font-bold text-foreground">{studentProfile.cgpa} <span className="text-xs font-normal text-muted-foreground">→ {academicPct}%</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/40 rounded-lg px-3 py-2.5 border border-border">
                  <BookOpen className="w-4 h-4 text-pink-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Prep Tasks Done</p>
                    <p className="text-sm font-bold text-foreground">{completedTasks}/{prepTasks.length} <span className="text-xs font-normal text-muted-foreground">→ {prepPct}%</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dimension breakdown */}
      <div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-primary" /> Dimension Breakdown
          <span className="text-xs text-muted-foreground font-normal ml-1">— click to expand tips</span>
        </motion.p>
        <div className="space-y-3">
          {dimensions.map((d, i) => (
            <DimensionBar key={d.key} dim={d} delay={0.18 + i * 0.05} />
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="bg-card rounded-2xl border border-border shadow-card"
      >
        <button
          onClick={() => setShowPlan(o => !o)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">🗓️ Personalised Action Plan</span>
            <span className="text-xs text-muted-foreground ml-1">— your top 5 priorities</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showPlan ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showPlan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-border pt-5 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Ranked by the biggest score impact — highest-priority bottlenecks first.
                </p>
                {actionPlan.map((item, i) => (
                  <ActionCard key={item.title} rank={i + 1} item={item} delay={0.05 + i * 0.06} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Motivational footer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className={`rounded-xl border px-5 py-4 flex items-start gap-3 ${overallScore >= 70 ? "border-success/30 bg-success/8" : overallScore >= 50 ? "border-warning/30 bg-warning/8" : "border-destructive/30 bg-destructive/8"}`}
      >
        {overallScore >= 70 ? (
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">
            {overallScore >= 85
              ? "You're in great shape — keep the momentum going into placement season!"
              : overallScore >= 70
              ? "Strong foundation! Focus your energy on mock interview practice and skill depth."
              : overallScore >= 50
              ? "You're on the right track. Use the Action Plan above to systematically close your gaps."
              : "Now is the time to invest heavily in preparation. Every point in your score translates to more company shortlists."}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the <span className="font-medium text-foreground">Skill Gap Detector</span>, <span className="font-medium text-foreground">Career Predictor</span>, and <span className="font-medium text-foreground">Resume Analyzer</span> alongside this score for a complete placement prep strategy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
