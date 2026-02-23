import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/AppContext";
import AppLayout from "@/components/AppLayout";
import Chatbot from "@/components/Chatbot";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Opportunities from "@/pages/Opportunities";
import Preparation from "@/pages/Preparation";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";
import CareerPredictor from "@/pages/CareerPredictor";
import SkillGapDetector from "@/pages/SkillGapDetector";
import PlacementReadiness from "@/pages/PlacementReadiness";
import OfferComparison from "@/pages/OfferComparison";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <AppLayout>{children}</AppLayout>
    <Chatbot />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<WithLayout><Dashboard /></WithLayout>} />
            <Route path="/opportunities" element={<WithLayout><Opportunities /></WithLayout>} />
            <Route path="/preparation" element={<WithLayout><Preparation /></WithLayout>} />
            <Route path="/resume-analyzer" element={<WithLayout><ResumeAnalyzer /></WithLayout>} />
            <Route path="/career-predictor" element={<WithLayout><CareerPredictor /></WithLayout>} />
            <Route path="/skill-gap" element={<WithLayout><SkillGapDetector /></WithLayout>} />
            <Route path="/readiness" element={<WithLayout><PlacementReadiness /></WithLayout>} />
            <Route path="/offers" element={<WithLayout><OfferComparison /></WithLayout>} />
            <Route path="/profile" element={<WithLayout><Profile /></WithLayout>} />
            <Route path="/admin" element={<WithLayout><Admin /></WithLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
