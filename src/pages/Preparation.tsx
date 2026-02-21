import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, Code, Users, FileText, ExternalLink } from "lucide-react";
import { useAppState } from "@/lib/AppContext";

const resources = [
  { title: "LeetCode Top 150", category: "Coding", icon: Code, link: "#" },
  { title: "GeeksforGeeks Aptitude", category: "Aptitude", icon: BookOpen, link: "#" },
  { title: "InterviewBit Mock Tests", category: "Interview", icon: Users, link: "#" },
  { title: "Resume Building Guide", category: "General", icon: FileText, link: "#" },
];

const categoryColors: Record<string, string> = {
  Coding: "bg-info/15 text-info",
  Aptitude: "bg-warning/15 text-warning",
  Interview: "bg-success/15 text-success",
  General: "bg-muted text-muted-foreground",
};

export default function Preparation() {
  const { prepTasks, setPrepTasks } = useAppState();

  const toggleTask = (id: string) => {
    setPrepTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completed = prepTasks.filter(t => t.completed).length;
  const pct = Math.round((completed / prepTasks.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Preparation</h2>
        <p className="text-muted-foreground text-sm mt-1">Track your preparation progress and access resources.</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl shadow-card border border-border p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-semibold text-foreground text-sm">Overall Progress</span>
          <span className="text-sm font-medium text-primary">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{completed} of {prepTasks.length} tasks completed</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl shadow-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">Task Checklist</h3>
          </div>
          <div className="divide-y divide-border">
            {prepTasks.map(t => (
              <button key={t.id} onClick={() => toggleTask(t.id)} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors text-left">
                {t.completed ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                <span className={`text-sm flex-1 ${t.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[t.category]}`}>{t.category}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl shadow-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">Resources</h3>
          </div>
          <div className="divide-y divide-border">
            {resources.map(r => (
              <a key={r.title} href={r.link} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${categoryColors[r.category]}`}>
                  <r.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
