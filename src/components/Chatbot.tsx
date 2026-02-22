import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { companies } from "@/lib/mockData";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const botResponses: Record<string, string> = {
  companies: `Here are the upcoming recruiters visiting campus:\n\n${companies.map(c => `• **${c.name}** — ${c.role} (${c.package}), Deadline: ${c.deadline}`).join("\n")}`,

  eligibility: "Eligibility varies by recruiter type:\n\n• **Investment Banks** (Goldman Sachs, JPMorgan): MBA Finance, CGPA ≥ 3.5/4.0\n• **Consulting** (McKinsey, BCG, Deloitte): Any MBA specialisation, CGPA ≥ 3.3/4.0\n• **FMCG** (HUL, P&G, Nestlé): MBA Marketing / Finance, CGPA ≥ 3.0/4.0\n• **Banks** (HDFC, ICICI, Kotak): MBA Finance, all branches considered\n\nAlways check the Opportunities page for the latest criteria!",

  prepare: "Here's your MBA placement preparation roadmap:\n\n**Finance Track 🏦**\n1. Master Financial Modelling (DCF, LBO, M&A)\n2. Practise Excel — pivot tables, VLOOKUP, Power Query\n3. Study company annual reports and sector trends\n\n**Marketing Track 📊**\n1. Learn brand management frameworks: STP, 4Ps, Porter's 5 Forces\n2. Practice guesstimate & market-sizing questions\n3. Build a digital marketing case portfolio\n\n**Common 🎯**\n1. Solve 30+ case studies (McKinsey, BCG, Bain style)\n2. Prepare 5–6 strong STAR behavioural stories\n3. Read ET, Mint, or Business Standard daily",

  finance: "Key Finance topics for MBA placements:\n\n• **Valuation**: DCF, Comparable Companies, Precedent Transactions\n• **Financial Statements**: P&L, Balance Sheet, Cash Flow linkages\n• **Ratios**: ROE, ROCE, EV/EBITDA, P/E, Debt-to-Equity\n• **Products**: Bonds, Equities, Derivatives, PE/VC structures\n• **M&A**: Deal structuring, synergies, accretion/dilution analysis\n\nPractise mock interviews on Mergers & Inquisitions or WSJ!",

  marketing: "Key Marketing topics for MBA placements:\n\n• **Brand Management**: STP (Segmentation, Targeting, Positioning)\n• **4Ps / 7Ps**: Product, Price, Place, Promotion\n• **Consumer Behaviour**: Buying decision process, psychographic segmentation\n• **Digital Marketing**: SEO, SEM, social media ROI, funnel analysis\n• **Market Research**: Conjoint analysis, focus groups, NPS\n• **Case types**: Go-to-market, new product launch, declining sales\n\nStudy HUL, P&G, and Unilever brand case studies!",

  case: "Case Interview Preparation Tips:\n\n1. **Structure first**: Always lay out your framework before diving in\n2. **MECE thinking**: Mutually Exclusive, Collectively Exhaustive buckets\n3. **Frameworks**: Profitability, Market Entry, M&A, Pricing, Operations\n4. **Quantitative comfort**: Be quick with mental maths & market sizing\n5. **Communication**: Think out loud, be hypothesis-driven\n\n📚 Resources: Case in Point (Cosentino), Victor Cheng's LOMS, Preplounge",

  resume: "MBA Resume Tips:\n\n• Lead every bullet with an **impact metric** (e.g. 'Increased revenue by 18%')\n• Keep it to **1 page** — use 10–11pt font, clean layout\n• Sections order: Education → Work Experience → Internships → Projects → Leadership → Skills\n• Highlight **cross-functional leadership** and **quantified outcomes**\n• Tailor keywords to the JD: 'P&L ownership', 'credit analysis', 'GTM strategy'\n• Avoid clichés like 'team player' or 'hard worker' — show, don't tell",

  status: "You can track your application status on the **Dashboard**. Statuses include Applied, Interview Scheduled, Selected, or Rejected. Check the Opportunities page for upcoming deadlines!",

  help: "Hi! I'm your MBA Placement Assistant 🎓\n\nI can help you with:\n\n• 🏢 **Upcoming companies** — type 'companies'\n• ✅ **Eligibility criteria** — type 'eligibility'\n• 📚 **How to prepare** — type 'prepare'\n• 🏦 **Finance topics** — type 'finance'\n• 📣 **Marketing topics** — type 'marketing'\n• 🧩 **Case interviews** — type 'case'\n• 📄 **Resume tips** — type 'resume'\n• 📊 **Application status** — type 'status'\n\nJust ask anything about your MBA placements!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("compan") || lower.includes("upcoming") || lower.includes("visiting") || lower.includes("recruiter")) return botResponses.companies;
  if (lower.includes("eligib") || lower.includes("criteria") || lower.includes("cgpa") || lower.includes("gpa") || lower.includes("qualifying")) return botResponses.eligibility;
  if (lower.includes("financ") || lower.includes("dcf") || lower.includes("valuat") || lower.includes("investment bank") || lower.includes("modell") || lower.includes("balance sheet") || lower.includes("ratio")) return botResponses.finance;
  if (lower.includes("market") || lower.includes("brand") || lower.includes("fmcg") || lower.includes("4p") || lower.includes("stp") || lower.includes("consumer") || lower.includes("digital")) return botResponses.marketing;
  if (lower.includes("case") || lower.includes("consulting") || lower.includes("framework") || lower.includes("mece") || lower.includes("guesstimate") || lower.includes("bcg") || lower.includes("mckinsey")) return botResponses.case;
  if (lower.includes("resum") || lower.includes("cv") || lower.includes("bullet") || lower.includes("format")) return botResponses.resume;
  if (lower.includes("prepar") || lower.includes("study") || lower.includes("practice") || lower.includes("how to") || lower.includes("roadmap") || lower.includes("tips")) return botResponses.prepare;
  if (lower.includes("status") || lower.includes("application") || lower.includes("applied") || lower.includes("track")) return botResponses.status;
  if (lower.includes("help") || lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("start")) return botResponses.help;
  return "I'm not sure about that! Try asking about **companies**, **finance**, **marketing**, **case interviews**, **resume tips**, or **eligibility**. Type **help** to see all I can do 🎓";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 👋 I'm your **MBA Placement Assistant**. I can help with upcoming recruiters, finance & marketing prep, case interviews, resume tips, and more. Type **help** to get started!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getResponse(userMsg.content) }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full gradient-primary shadow-elevated flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[calc(100vw-2.5rem)] h-[500px] max-h-[calc(100vh-5rem)] bg-card rounded-2xl shadow-elevated border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-hero px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">PlaceBot</p>
                  <p className="text-[10px] text-primary-foreground/70">Your placement assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-accent" />
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-xl px-4 py-3 rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-soft" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border shrink-0">
              <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about finance, marketing, cases..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity shrink-0">
                  <Send className="w-4 h-4 text-primary-foreground" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
