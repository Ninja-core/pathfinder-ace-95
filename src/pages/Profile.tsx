import { motion } from "framer-motion";
import { Mail, Phone, GraduationCap, Upload, CheckCircle2 } from "lucide-react";
import { studentProfile } from "@/lib/mockData";
import { useAppState } from "@/lib/AppContext";

const statusColors: Record<string, string> = {
  applied: "bg-info/15 text-info",
  interview: "bg-warning/15 text-warning",
  selected: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
  interested: "bg-muted text-muted-foreground",
};

export default function Profile() {
  const { applications } = useAppState();
  const p = studentProfile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">My Profile</h2>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl shadow-card border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center font-display font-bold text-2xl text-primary-foreground shrink-0">
            {p.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-foreground">{p.name}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{p.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{p.phone}</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{p.branch} • {p.year}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">CGPA: {p.cgpa}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.skills.map(s => (
                <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-sm ${p.resumeUploaded ? "text-success" : "text-muted-foreground"}`}>
            {p.resumeUploaded ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {p.resumeUploaded ? "Resume uploaded" : "No resume uploaded"}
          </div>
          <button className="ml-auto text-sm font-medium text-primary hover:underline">
            {p.resumeUploaded ? "Update Resume" : "Upload Resume"}
          </button>
        </div>
      </motion.div>

      {/* Applied Companies */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl shadow-card border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Applied Companies</h3>
        </div>
        <div className="divide-y divide-border">
          {applications.map(a => (
            <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">{a.companyName}</p>
                <p className="text-xs text-muted-foreground">{a.role} • Applied {a.appliedDate}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[a.status]}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
