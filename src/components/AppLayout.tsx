import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, BookOpen, User, Shield, Bell, GraduationCap, FileSearch, Sparkles, Target, Award, Scale } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "@/lib/mockData";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/opportunities", icon: Building2, label: "Opportunities" },
  { to: "/preparation", icon: BookOpen, label: "Preparation" },
  { to: "/resume-analyzer", icon: FileSearch, label: "Resume Analyzer" },
  { to: "/career-predictor", icon: Sparkles, label: "Career Predictor" },
  { to: "/skill-gap", icon: Target, label: "Skill Gap Detector" },
  { to: "/readiness", icon: Award, label: "Readiness Score" },
  { to: "/offers", icon: Scale, label: "Offer Comparison" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/admin", icon: Shield, label: "Admin" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-sidebar-primary-foreground">PlaceHub</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">AS</div>
            <div className="text-xs">
              <div className="font-medium text-sidebar-accent-foreground">Bhawna Vig</div>
              <div className="text-sidebar-foreground/60">CSE • Final Year</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-sidebar-primary-foreground">PlaceHub</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`
                  }
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <button className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg" onClick={() => setMobileOpen(true)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
          </button>
          <h1 className="font-display font-semibold text-foreground text-base md:text-lg">
            {navItems.find(n => n.to === location.pathname)?.label || "Dashboard"}
          </h1>
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 hover:bg-muted rounded-lg relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border font-display font-semibold text-sm">Notifications</div>
                  {announcements.map(a => (
                    <div key={a.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-2">
                        {a.urgent && <span className="mt-1 w-2 h-2 rounded-full bg-destructive shrink-0" />}
                        <div>
                          <p className="text-sm text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
