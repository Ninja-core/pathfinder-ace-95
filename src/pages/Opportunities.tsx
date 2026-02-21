import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, IndianRupee, CheckCircle2 } from "lucide-react";
import { companies } from "@/lib/mockData";
import { useAppState } from "@/lib/AppContext";

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function Opportunities() {
  const { applications, applyToCompany } = useAppState();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || c.type.toLowerCase() === filterType;
      return matchSearch && matchType;
    });
  }, [search, filterType]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Placement Opportunities</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse and apply to companies visiting campus.</p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies or roles..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {["all", "product", "service"].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
            >
              <Filter className="w-3.5 h-3.5 inline mr-1.5" />
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => {
          const applied = applications.some(a => a.companyId === c.id);
          const days = daysUntil(c.deadline);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl shadow-card border border-border p-5 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">{c.logo}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.role}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${c.type === "Product" ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"}`}>
                  {c.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{c.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{c.package}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                <span className="flex items-center gap-1 col-span-2"><Clock className="w-3 h-3" />{days > 0 ? `${days} days left` : "Deadline passed"}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Eligibility: {c.eligibility}</p>
              <div className="mt-auto">
                {applied ? (
                  <button disabled className="w-full py-2.5 rounded-lg text-sm font-medium bg-success/15 text-success flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </button>
                ) : (
                  <button
                    onClick={() => applyToCompany(c)}
                    className="w-full py-2.5 rounded-lg text-sm font-medium gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
