import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Megaphone, Trash2 } from "lucide-react";

interface AdminCompany {
  id: string;
  name: string;
  role: string;
  package: string;
  deadline: string;
}

interface Announcement {
  id: string;
  text: string;
  date: string;
}

export default function Admin() {
  const [companies, setCompanies] = useState<AdminCompany[]>([
    { id: "1", name: "Google", role: "Software Engineer", package: "₹45 LPA", deadline: "2026-03-05" },
    { id: "2", name: "Microsoft", role: "SDE-1", package: "₹42 LPA", deadline: "2026-03-10" },
  ]);
  const [annList, setAnnList] = useState<Announcement[]>([
    { id: "1", text: "Pre-placement talk for Google at 3 PM", date: "2026-02-21" },
  ]);

  const [newComp, setNewComp] = useState({ name: "", role: "", package: "", deadline: "" });
  const [newAnn, setNewAnn] = useState("");

  const addCompany = () => {
    if (!newComp.name || !newComp.role) return;
    setCompanies(prev => [...prev, { ...newComp, id: Date.now().toString() }]);
    setNewComp({ name: "", role: "", package: "", deadline: "" });
  };

  const addAnnouncement = () => {
    if (!newAnn) return;
    setAnnList(prev => [...prev, { id: Date.now().toString(), text: newAnn, date: new Date().toISOString().split("T")[0] }]);
    setNewAnn("");
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage placement drives and announcements.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Company */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl shadow-card border border-border p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Add Company</h3>
          <div className="space-y-3">
            <input className={inputClass} placeholder="Company Name" value={newComp.name} onChange={e => setNewComp(p => ({ ...p, name: e.target.value }))} />
            <input className={inputClass} placeholder="Role" value={newComp.role} onChange={e => setNewComp(p => ({ ...p, role: e.target.value }))} />
            <input className={inputClass} placeholder="Package" value={newComp.package} onChange={e => setNewComp(p => ({ ...p, package: e.target.value }))} />
            <input className={inputClass} type="date" value={newComp.deadline} onChange={e => setNewComp(p => ({ ...p, deadline: e.target.value }))} />
            <button onClick={addCompany} className="w-full py-2.5 rounded-lg text-sm font-medium gradient-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Company
            </button>
          </div>
          <div className="mt-4 divide-y divide-border border-t border-border">
            {companies.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role} • {c.deadline}</p>
                </div>
                <button onClick={() => setCompanies(prev => prev.filter(x => x.id !== c.id))} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl shadow-card border border-border p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Announcements</h3>
          <div className="flex gap-2">
            <input className={`${inputClass} flex-1`} placeholder="New announcement..." value={newAnn} onChange={e => setNewAnn(e.target.value)} />
            <button onClick={addAnnouncement} className="px-4 rounded-lg gradient-accent text-accent-foreground hover:opacity-90 transition-opacity">
              <Megaphone className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 divide-y divide-border border-t border-border">
            {annList.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <button onClick={() => setAnnList(prev => prev.filter(x => x.id !== a.id))} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
