import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  Briefcase,
  Trophy,
  Star,
  ChevronRight,
  RefreshCw,
  Shield,
  BarChart3,
  Lightbulb,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface SectionScore {
  key: string;
  label: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  color: string;
  suggestions: string[];
}

interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  sections: SectionScore[];
  generalSuggestions: string[];
  strengths: string[];
}

/* ─────────────────────────────────────────────
   MBA-focused demo analyser (deterministic seed)
───────────────────────────────────────────── */
function analyzeResume(file: File): AnalysisResult {
  const seed = file.name.length % 5; // 0-4

  const sections: SectionScore[] = [
    {
      key: "work-experience",
      label: "Work Experience",
      icon: Briefcase,
      score: 14 + seed * 2,
      maxScore: 25,
      color: "text-blue-500",
      suggestions:
        seed < 3
          ? [
              "Lead each bullet with a strong action verb: 'Managed', 'Drove', 'Delivered', 'Restructured'.",
              "Quantify every impact — e.g. '₹12 Cr revenue generated', 'Cost reduced by 18%'.",
              "Mention cross-functional leadership, team size, and stakeholder levels.",
            ]
          : [
              "Highlight P&L responsibility or budget ownership explicitly.",
              "Show progression — promotions, expanded scope, or additional responsibilities.",
            ],
    },
    {
      key: "internships",
      label: "MBA Internships",
      icon: TrendingUp,
      score: 11 + seed * 2,
      maxScore: 25,
      color: "text-purple-500",
      suggestions:
        seed < 3
          ? [
              "State the company, role, duration, and the business problem you solved.",
              "Include your key deliverable and the outcome in one line: 'Built a GTM strategy → 25% faster launch'.",
              "Mention tools/frameworks used: DCF, STP, MECE, SAP, Excel, Power BI.",
            ]
          : [
              "Distinguish your individual contribution from team output.",
              "Add a one-line recommendation or award if received.",
            ],
    },
    {
      key: "academic-projects",
      label: "Academic Projects",
      icon: BookOpen,
      score: 10 + seed * 2,
      maxScore: 20,
      color: "text-green-500",
      suggestions:
        seed < 3
          ? [
              "Frame every project as: Problem → Approach → Outcome.",
              "Mention the dataset or company studied (e.g. 'HUL brand equity study, sample n=200').",
              "Include relevant tools: R, SPSS, Tableau, Excel, Python for analytics projects.",
            ]
          : [
              "Highlight any publication, competition win, or faculty recognition.",
              "Add a GitHub / report link if the project is publicly accessible.",
            ],
    },
    {
      key: "skills",
      label: "Skills & Certifications",
      icon: GraduationCap,
      score: 8 + seed,
      maxScore: 15,
      color: "text-amber-500",
      suggestions:
        seed < 4
          ? [
              "Group skills: Finance Tools (Excel, Bloomberg, Tally), Analytics (Power BI, Tableau, SQL), Soft (Negotiation, Facilitation).",
              "Add certifications: CFA Level 1, Google Analytics, Bloomberg Market Concepts (BMC), Six Sigma.",
              "Remove generic skills like 'MS Office' unless they are advanced (e.g. Advanced Excel / VBA).",
            ]
          : [
              "List language proficiency (IELTS / TOEFL score if applicable for global roles).",
            ],
    },
    {
      key: "leadership",
      label: "Leadership & Achievements",
      icon: Trophy,
      score: 8 + seed,
      maxScore: 15,
      color: "text-rose-500",
      suggestions:
        seed < 3
          ? [
              "Include positions of responsibility: Club president, Fest coordinator, Committee head.",
              "Add case competition wins, scholarships, national-level ranks, or paper presentations.",
              "Format: 'Position, Organisation | Outcome or scale (e.g. 500 participants managed)'.",
            ]
          : [
              "Add volunteer work or CSR initiatives with measurable impact.",
              "Mention star ratings, Dean's List, or merit scholarships.",
            ],
    },
  ];

  const totalScore = sections.reduce((s, sec) => s + sec.score, 0);
  const atsScore = Math.min(100, Math.round(totalScore * 1.08 + seed * 3));

  const generalSuggestions = [
    "Use a clean, single-column layout — avoid tables, text boxes, and graphics for ATS compatibility.",
    "Tailor your resume to each JD: mirror keywords like 'P&L ownership', 'GTM strategy', 'credit analysis'.",
    "Keep it to one page for under 5 years of experience; two pages max for 5+ years.",
    "Use a consistent date format throughout (e.g. Jun 2023 – Aug 2023).",
    "Have a crisp Profile Summary (3–4 lines) at the top highlighting your specialisation, sector preference, and top achievement.",
  ];

  const strengths =
    totalScore >= 65
      ? ["Strong quantified impact statements", "Clear MBA specialisation positioning", "Good use of domain keywords"]
      : totalScore >= 45
      ? ["Decent internship descriptions", "Relevant skill listing"]
      : ["Resume has all standard sections", "Readable formatting"];

  return { overallScore: totalScore, atsScore, sections, generalSuggestions, strengths };
}

/* ─────────────────────────────────────────────
   Score Ring
───────────────────────────────────────────── */
function ScoreRing({
  score, max, size = 120, stroke = 10, label, color,
}: {
  score: number; max: number; size?: number; stroke?: number; label: string; color: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / max) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
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
          <motion.span className="font-display font-bold text-2xl text-foreground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground">/{max}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section Card
───────────────────────────────────────────── */
function SectionCard({ section, delay }: { section: SectionScore; delay: number }) {
  const [open, setOpen] = useState(false);
  const pct = (section.score / section.maxScore) * 100;
  const grade = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Fair" : "Needs Work";
  const gradeColor =
    pct >= 80 ? "bg-success/15 text-success"
    : pct >= 60 ? "bg-info/15 text-info"
    : pct >= 40 ? "bg-warning/15 text-warning"
    : "bg-destructive/15 text-destructive";
  const barColor =
    pct >= 80 ? "hsl(var(--success))"
    : pct >= 60 ? "hsl(var(--info))"
    : pct >= 40 ? "hsl(var(--warning))"
    : "hsl(var(--destructive))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
    >
      <button
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-muted ${section.color}`}>
          <section.icon className="w-4 h-4" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-foreground">{section.label}</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden w-48">
            <motion.div
              className="h-full rounded-full"
              style={{ background: barColor }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${gradeColor}`}>{grade}</span>
          <span className="text-sm font-bold text-foreground">{section.score}/{section.maxScore}</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1 border-t border-border space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2 mb-1">Suggestions</p>
              {section.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ResumeAnalyzer() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((f: File) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setAnalysing(true);
    setTimeout(() => { setResult(analyzeResume(f)); setAnalysing(false); }, 2000);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) processFile(picked);
  };

  const reset = () => {
    setFile(null); setResult(null); setAnalysing(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const overallPct = result ? result.overallScore : 0;
  const overallGrade =
    overallPct >= 80 ? { label: "Excellent", color: "text-success", bg: "bg-success/15" }
    : overallPct >= 60 ? { label: "Good", color: "text-info", bg: "bg-info/15" }
    : overallPct >= 40 ? { label: "Needs Improvement", color: "text-warning", bg: "bg-warning/15" }
    : { label: "Poor", color: "text-destructive", bg: "bg-destructive/15" };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">MBA Resume Strength Analyzer</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Upload your MBA resume to get a strength score across Work Experience, Internships, Projects, Skills,
          and Leadership — plus ATS compatibility and tailored improvement tips.
        </p>
      </motion.div>

      {/* Upload Zone */}
      {!file && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center justify-center gap-4 text-center
            ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-muted/30 bg-card"}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileInput} />
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-primary/20" : "bg-muted"}`}>
            <Upload className={`w-7 h-7 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-lg">
              {dragOver ? "Drop your MBA resume here" : "Drag & drop your resume"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              or <span className="text-primary font-medium underline underline-offset-2">browse files</span> · PDF, DOC, DOCX, TXT
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Private &amp; Secure</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Analysis</span>
            <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> MBA-Focused Report</span>
          </div>
        </motion.div>
      )}

      {/* Analysing */}
      {file && analysing && (
        <motion.div
          key="analysing" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border shadow-card p-10 flex flex-col items-center gap-5"
        >
          <div className="relative w-20 h-20">
            <svg className="w-full h-full animate-spin" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                strokeLinecap="round" strokeDasharray="50 165" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground">Analysing your MBA resume…</p>
            <p className="text-sm text-muted-foreground mt-1">Scanning experience, internships, skills & ATS compatibility</p>
          </div>
          <div className="flex gap-2">
            {["Experience", "Internships", "Projects", "Skills", "Leadership"].map((s, i) => (
              <motion.span key={s}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4] }}
                transition={{ delay: i * 0.28, repeat: Infinity, duration: 1.2 }}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && !analysing && (
        <AnimatePresence>
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* File bar */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3 shadow-card">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file!.name}</p>
                <p className="text-xs text-muted-foreground">{(file!.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={reset}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 hover:bg-muted rounded-lg">
                <RefreshCw className="w-3.5 h-3.5" /> New Upload
              </button>
            </motion.div>

            {/* Score Rings */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={result.overallScore} max={100} size={130} stroke={11}
                    label="Overall Score" color="hsl(var(--primary))" />
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${overallGrade.bg} ${overallGrade.color}`}>
                    {overallGrade.label}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-28 bg-border" />
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={result.atsScore} max={100} size={130} stroke={11}
                    label="ATS Compatibility" color="#10b981" />
                  <span className="text-xs text-muted-foreground">Applicant Tracking System</span>
                </div>
                <div className="hidden sm:block w-px h-28 bg-border" />
                <div className="flex flex-col gap-2 max-w-[200px]">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Strengths</p>
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" /><span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Section Breakdown */}
            <div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Section Breakdown
              </motion.p>
              <div className="space-y-3">
                {result.sections.map((sec, i) => (
                  <SectionCard key={sec.key} section={sec} delay={0.12 + i * 0.06} />
                ))}
              </div>
            </div>

            {/* General Tips */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="bg-card rounded-2xl border border-border shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400" /> General MBA Resume Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.generalSuggestions.map((tip, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
                    <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
