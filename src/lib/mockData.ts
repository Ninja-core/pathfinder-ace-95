export interface Company {
  id: string;
  name: string;
  logo: string;
  role: string;
  package: string;
  eligibility: string;
  deadline: string;
  type: string;
  location: string;
  description: string;
}

export interface Application {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  status: "applied" | "interview" | "selected" | "rejected" | "interested";
  appliedDate: string;
}

export interface PrepTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export const companies: Company[] = [
  {
    id: "1", name: "Goldman Sachs", logo: "GS", role: "Investment Banking Analyst", package: "₹28 LPA",
    eligibility: "MBA Finance, CGPA ≥ 3.5/4.0", deadline: "2026-03-05", type: "Investment Bank",
    location: "Mumbai", description: "Work on M&A deals, IPOs, and capital market transactions for Fortune 500 clients."
  },
  {
    id: "2", name: "McKinsey & Company", logo: "MC", role: "Business Analyst", package: "₹32 LPA",
    eligibility: "MBA (Any Specialisation), CGPA ≥ 3.3/4.0", deadline: "2026-03-10", type: "Consulting",
    location: "Delhi / Mumbai", description: "Drive strategic transformations for leading corporations and governments."
  },
  {
    id: "3", name: "Hindustan Unilever", logo: "HU", role: "Brand Manager Trainee", package: "₹24 LPA",
    eligibility: "MBA Marketing / Finance, CGPA ≥ 3.0/4.0", deadline: "2026-03-02", type: "FMCG",
    location: "Mumbai", description: "Lead brand strategy, consumer insights, and go-to-market plans for iconic HUL brands."
  },
  {
    id: "4", name: "HDFC Bank", logo: "HD", role: "Management Trainee – Corporate Banking", package: "₹14 LPA",
    eligibility: "MBA Finance, CGPA ≥ 3.0/4.0", deadline: "2026-03-20", type: "Banking",
    location: "Pan India", description: "Manage corporate client relationships, credit analysis, and treasury operations."
  },
  {
    id: "5", name: "Deloitte", logo: "DL", role: "Consultant – Financial Advisory", package: "₹18 LPA",
    eligibility: "MBA Finance / Strategy, All Specialisations", deadline: "2026-03-15", type: "Consulting",
    location: "Bangalore / Hyderabad", description: "Deliver financial due diligence, restructuring, and risk advisory services."
  },
  {
    id: "6", name: "P&G India", logo: "PG", role: "Assistant Brand Manager", package: "₹22 LPA",
    eligibility: "MBA Marketing, CGPA ≥ 3.2/4.0", deadline: "2026-03-08", type: "FMCG",
    location: "Mumbai", description: "Own the P&L of a brand, drive digital marketing, and lead cross-functional teams."
  },
  {
    id: "7", name: "Kotak Mahindra Bank", logo: "KM", role: "Associate – Wealth Management", package: "₹16 LPA",
    eligibility: "MBA Finance, CGPA ≥ 3.0/4.0", deadline: "2026-03-12", type: "Banking",
    location: "Mumbai / Pune", description: "Manage HNI portfolios, conduct financial planning, and grow assets under management."
  },
  {
    id: "8", name: "Nestlé India", logo: "NE", role: "Area Sales Manager", package: "₹15 LPA",
    eligibility: "MBA Marketing / Rural Management", deadline: "2026-03-18", type: "FMCG",
    location: "Pan India", description: "Drive channel sales, distributor networks, and market penetration for Nestlé products."
  },
];

export const initialApplications: Application[] = [
  { id: "a1", companyId: "1", companyName: "Goldman Sachs", role: "Investment Banking Analyst", status: "interview", appliedDate: "2026-02-15" },
  { id: "a2", companyId: "4", companyName: "HDFC Bank", role: "Management Trainee – Corporate Banking", status: "applied", appliedDate: "2026-02-18" },
  { id: "a3", companyId: "3", companyName: "Hindustan Unilever", role: "Brand Manager Trainee", status: "interested", appliedDate: "2026-02-20" },
];

export const initialPrepTasks: PrepTask[] = [
  // Finance
  { id: "t1", title: "Build a 3-statement financial model in Excel (Income → Balance Sheet → Cash Flow)", category: "Finance", completed: true },
  { id: "t2", title: "Complete a DCF valuation for a listed mid-cap company", category: "Finance", completed: false },
  { id: "t3", title: "Solve 10 financial ratio analysis questions (ROE, ROCE, EV/EBITDA)", category: "Finance", completed: false },
  { id: "t4", title: "Read one company's Annual Report end-to-end and write a 1-page brief", category: "Finance", completed: false },
  // Marketing
  { id: "t5", title: "Design a Brand Plan: Audit → STP → 4Ps → KPIs for any FMCG brand", category: "Marketing", completed: true },
  { id: "t6", title: "Solve 5 FMCG case studies (declining sales, new product launch, pricing)", category: "Marketing", completed: false },
  { id: "t7", title: "Study HUL & P&G Annual Reports — understand brand-wise revenue contribution", category: "Marketing", completed: false },
  { id: "t8", title: "Learn consumer segmentation models: Psychographic, Behavioural, Demographic", category: "Marketing", completed: false },
  // Consulting
  { id: "t9", title: "Practice 20 consulting cases using MECE frameworks (McKinsey / BCG style)", category: "Consulting", completed: true },
  { id: "t10", title: "Complete Preplounge Beginner Case Level and get feedback", category: "Consulting", completed: false },
  { id: "t11", title: "Prepare 6 STAR behavioural stories for leadership & impact questions", category: "Consulting", completed: false },
  // Entrepreneurship
  { id: "t12", title: "Develop a Business Model Canvas (BMC) for a startup idea", category: "Entrepreneurship", completed: false },
  { id: "t13", title: "Conduct 10 customer discovery interviews and write key insights", category: "Entrepreneurship", completed: false },
  // Digital Marketing
  { id: "t14", title: "Earn Google Analytics 4 (GA4) Certification from Skillshop", category: "Digital Marketing", completed: false },
  { id: "t15", title: "Run a real Meta Ads or Google Ads campaign with even a ₹500 budget", category: "Digital Marketing", completed: false },
  // General
  { id: "t16", title: "Read Economic Times or Mint for 15 minutes daily — track for 30 days", category: "General", completed: true },
  { id: "t17", title: "Update resume — quantify every bullet with an impact metric", category: "General", completed: true },
  { id: "t18", title: "Attend 2 alumni interaction sessions and follow up with LinkedIn notes", category: "General", completed: false },
];

export const studentProfile = {
  name: "Bhawna Vig",
  email: "bhawna.vig@mba.edu",
  branch: "MBA – Finance & Marketing",
  year: "2nd Year",
  cgpa: "8.3/10",
  phone: "+91 98765 43210",
  skills: ["Financial Modelling", "Excel", "Brand Management", "Case Analysis", "Market Research", "Power BI"],
  resumeUploaded: true,
};

export const announcements = [
  { id: "n1", title: "Goldman Sachs PPO talk tomorrow at 3 PM — attendance mandatory", time: "2 hours ago", urgent: true },
  { id: "n2", title: "HUL resume submission deadline extended by 3 days", time: "5 hours ago", urgent: false },
  { id: "n3", title: "Mock case interview slots open — register by midnight", time: "1 day ago", urgent: false },
];