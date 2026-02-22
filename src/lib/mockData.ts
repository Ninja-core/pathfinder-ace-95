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
  { id: "t1", title: "Practice 30 case interviews (McKinsey / BCG style)", category: "Interview", completed: true },
  { id: "t2", title: "Revise Financial Modelling & DCF Valuation", category: "Finance", completed: false },
  { id: "t3", title: "Prepare STAR stories for HR rounds", category: "Interview", completed: false },
  { id: "t4", title: "Learn Excel: VLOOKUP, Pivot Tables, Power Query", category: "Finance", completed: true },
  { id: "t5", title: "Study brand management frameworks (STP, 4Ps)", category: "Marketing", completed: false },
  { id: "t6", title: "Solve quantitative aptitude mock tests", category: "Aptitude", completed: false },
  { id: "t7", title: "Read Economic Times & Business Standard daily", category: "General", completed: true },
  { id: "t8", title: "Update resume — highlight internship impact metrics", category: "General", completed: true },
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