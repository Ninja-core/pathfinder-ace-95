import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroIllustration from "@/assets/hero-illustration.png";
import {
  GraduationCap, ArrowRight, BookOpen, Brain, Mic, Filter,
  Calculator, Bell, Award, Shield, Sparkles, Users, CheckCircle2
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "AI Prep Roadmap", desc: "Personalized AI-driven preparation roadmaps tailored to your skills, dream companies, and progress.", color: "bg-primary/10 text-primary" },
  { icon: Brain, title: "Question Prediction", desc: "AI predicts most-likely questions based on company history and latest placement data.", color: "bg-info/10 text-info" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Interactive AI interviews with real-time feedback, scoring, and detailed improvement tips.", color: "bg-success/10 text-success" },
  { icon: Filter, title: "Eligibility Auto-Filter", desc: "Instantly see which drives you qualify for based on your profile — no manual checking.", color: "bg-warning/10 text-warning" },
  { icon: Calculator, title: "Aptitude Streaks", desc: "Daily aptitude drills, streaks & leaderboards to build consistency and speed.", color: "bg-primary/10 text-primary" },
  { icon: Award, title: "Salary Calculator", desc: "Compare offers with in-hand salary calculations, tax breakdown, and benefit analysis.", color: "bg-info/10 text-info" },
  { icon: Bell, title: "Smart Nudges", desc: "Context-aware deadline reminders so you'll never miss a registration or submission.", color: "bg-success/10 text-success" },
  { icon: Sparkles, title: "Celebration Cards", desc: "Auto-generate shareable placement cards when you get selected — celebrate with friends! 🎉", color: "bg-warning/10 text-warning" },
];

const trustPoints = [
  { icon: Shield, title: "Private & safe", desc: "Your data stays yours." },
  { icon: Sparkles, title: "AI-powered", desc: "Smart recommendations." },
  { icon: Users, title: "Student-made", desc: "Built by peers who get it." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">PlaceHub</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium mb-6"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Your placement journey, simplified
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
          >
            From prep to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">placement,</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 rounded-sm -z-0" />
            </span>
            <br />
            we've got you
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            AI-powered prep roadmaps, mock interviews, question prediction, eligibility filters —
            everything an engineering student needs to land their dream job. No stress, get placed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-elevated"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-muted transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <img
              src={heroIllustration}
              alt="Students celebrating placement success"
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-elevated border border-border"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need, one app
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Built by students who survived placement season. Built faster, better, and with zero pain.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-background rounded-xl border border-border p-5 hover:shadow-card transition-shadow group"
              >
                <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / About */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
              Built with care for Indian engineering students
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Your supportive companion through<br />placement season
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We know the anxiety, the FOMO, the confusion. PlaceHub is designed to feel like a supportive
              friend — calming, organized, and always in your corner.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {trustPoints.map((t, i) => (
              <motion.div
                key={t.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto gradient-hero rounded-2xl p-8 sm:p-12 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
            Ready to ace your placements?
          </h2>
          <p className="mt-3 text-primary-foreground/70 text-sm sm:text-base max-w-lg mx-auto">
            Join thousands of students preparing smarter, not harder.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Get Started — It's Free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">PlaceHub</span>
          </div>
          <p>© 2026 PlaceHub. Made with ❤️ for students.</p>
        </div>
      </footer>
    </div>
  );
}
