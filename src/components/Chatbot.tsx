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
  companies: `Here are the upcoming companies visiting campus:\n\n${companies.map(c => `• **${c.name}** — ${c.role} (${c.package}), Deadline: ${c.deadline}`).join("\n")}`,
  eligibility: "Eligibility criteria vary by company. Most product companies require CGPA ≥ 7.5 in CSE/IT, while service companies accept all branches with CGPA ≥ 6.0. Check the Opportunities page for specific details!",
  prepare: "Great question! Here's a preparation plan:\n\n1. **Coding**: Solve 50+ LeetCode problems (Arrays, Trees, DP)\n2. **Aptitude**: Practice on GeeksforGeeks & IndiaBix\n3. **Interview**: Do mock interviews with friends\n4. **Resume**: Keep it concise, 1 page, highlight projects\n5. **System Design**: Learn basics if targeting product companies",
  status: "You can track your application status on the **Dashboard**. Your current applications show statuses like Applied, Interview Scheduled, Selected, or Rejected. Keep checking for updates!",
  help: "I can help you with:\n\n• 📋 **Upcoming companies** — type 'companies'\n• ✅ **Eligibility criteria** — type 'eligibility'\n• 📚 **How to prepare** — type 'prepare'\n• 📊 **Application status** — type 'status'\n\nJust ask me anything about placements!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("compan") || lower.includes("upcoming") || lower.includes("visiting")) return botResponses.companies;
  if (lower.includes("eligib") || lower.includes("criteria") || lower.includes("cgpa")) return botResponses.eligibility;
  if (lower.includes("prepar") || lower.includes("study") || lower.includes("practice") || lower.includes("how to")) return botResponses.prepare;
  if (lower.includes("status") || lower.includes("application") || lower.includes("applied")) return botResponses.status;
  if (lower.includes("help") || lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) return botResponses.help;
  return "I'm not sure about that, but I can help with upcoming companies, eligibility, preparation tips, or application status. Type **help** to see what I can do! 😊";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 👋 I'm your placement assistant. Ask me about upcoming companies, eligibility, preparation tips, or your application status!" },
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
                  placeholder="Ask about placements..."
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
