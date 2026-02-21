import { motion } from "framer-motion";
import { Clock, TrendingUp, CheckCircle2, AlertTriangle, Calendar, ArrowRight, Bell } from "lucide-react";
import { companies, announcements } from "@/lib/mockData";
import { useAppState } from "@/lib/AppContext";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
  applied: "bg-info/15 text-info",
  interview: "bg-warning/15 text-warning",
  selected: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
  interested: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  applied: "Applied",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
  interested: "Interested",
};

function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Dashboard() {
  const { applications, prepTasks } = useAppState();

  const completedTasks = prepTasks.filter(t => t.completed).length;
  const upcomingDeadlines = companies
    .filter(c => daysUntil(c.deadline) > 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 4);

  const stats = [
    { label: "Applications", value: applications.filter(a => a.status !== "interested").length, icon: TrendingUp, color: "gradient-primary" },
    { label: "Interviews", value: applications.filter(a => a.status === "interview").length, icon: Calendar, color: "gradient-accent" },
    { label: "Tasks Done", value: `${completedTasks}/${prepTasks.length}`, icon: CheckCircle2, color: "gradient-primary" },
    { label: "Upcoming", value: upcomingDeadlines.length, icon: Clock, color: "gradient-accent" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Welcome back, Arjun 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">Here's your placement overview for today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-4 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Deadlines */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">Upcoming Deadlines</h3>
            <Link to="/opportunities" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingDeadlines.map(c => {
              const days = daysUntil(c.deadline);
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">{c.logo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{c.name} — {c.role}</p>
                    <p className="text-xs text-muted-foreground">{c.package}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${days <= 3 ? "bg-destructive/15 text-destructive" : days <= 7 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"}`}>
                    {days <= 3 && <AlertTriangle className="w-3 h-3" />}
                    {days}d left
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Application Status */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl shadow-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground">My Applications</h3>
          </div>
          <div className="divide-y divide-border">
            {applications.map(a => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-sm text-foreground">{a.companyName}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[a.status]}`}>
                  {statusLabels[a.status]}
                </span>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">No applications yet</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Announcements */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl shadow-card border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Announcements</h3>
        </div>
        <div className="divide-y divide-border">
          {announcements.map(a => (
            <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
              {a.urgent ? <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> : <Bell className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />}
              <div>
                <p className="text-sm text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
