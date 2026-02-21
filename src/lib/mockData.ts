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
    id: "1", name: "Google", logo: "G", role: "Software Engineer", package: "₹45 LPA",
    eligibility: "CGPA ≥ 8.0, CSE/IT", deadline: "2026-03-05", type: "Product",
    location: "Bangalore", description: "Work on large-scale distributed systems and cutting-edge technology."
  },
  {
    id: "2", name: "Microsoft", logo: "M", role: "SDE-1", package: "₹42 LPA",
    eligibility: "CGPA ≥ 7.5, All Branches", deadline: "2026-03-10", type: "Product",
    location: "Hyderabad", description: "Build products used by billions. Focus on cloud computing and AI."
  },
  {
    id: "3", name: "Amazon", logo: "A", role: "SDE Intern", package: "₹36 LPA",
    eligibility: "CGPA ≥ 7.0, CSE/IT/ECE", deadline: "2026-03-02", type: "Product",
    location: "Bangalore", description: "Innovate at scale across e-commerce, AWS, and Alexa."
  },
  {
    id: "4", name: "Infosys", logo: "I", role: "Systems Engineer", package: "₹6.5 LPA",
    eligibility: "CGPA ≥ 6.0, All Branches", deadline: "2026-03-20", type: "Service",
    location: "Pune", description: "Join a global leader in IT services and consulting."
  },
  {
    id: "5", name: "TCS", logo: "T", role: "Digital Lead", package: "₹9 LPA",
    eligibility: "CGPA ≥ 7.0, CSE/IT", deadline: "2026-03-15", type: "Service",
    location: "Mumbai", description: "Be part of digital transformation projects for Fortune 500 clients."
  },
  {
    id: "6", name: "Flipkart", logo: "F", role: "Frontend Engineer", package: "₹32 LPA",
    eligibility: "CGPA ≥ 7.5, CSE/IT", deadline: "2026-03-08", type: "Product",
    location: "Bangalore", description: "Build India's largest e-commerce platform experiences."
  },
];

export const initialApplications: Application[] = [
  { id: "a1", companyId: "1", companyName: "Google", role: "Software Engineer", status: "interview", appliedDate: "2026-02-15" },
  { id: "a2", companyId: "4", companyName: "Infosys", role: "Systems Engineer", status: "applied", appliedDate: "2026-02-18" },
  { id: "a3", companyId: "3", companyName: "Amazon", role: "SDE Intern", status: "interested", appliedDate: "2026-02-20" },
];

export const initialPrepTasks: PrepTask[] = [
  { id: "t1", title: "Complete 50 LeetCode problems", category: "Coding", completed: true },
  { id: "t2", title: "Practice SQL queries", category: "Coding", completed: false },
  { id: "t3", title: "Mock interview with friend", category: "Interview", completed: false },
  { id: "t4", title: "Review OS concepts", category: "Aptitude", completed: true },
  { id: "t5", title: "Prepare STAR stories", category: "Interview", completed: false },
  { id: "t6", title: "Aptitude test practice", category: "Aptitude", completed: false },
  { id: "t7", title: "System design basics", category: "Coding", completed: false },
  { id: "t8", title: "Update resume", category: "General", completed: true },
];

export const studentProfile = {
  name: "Bhawna Vig",
  email: "bhawna.vig@college.edu",
  branch: "Computer Science & Engineering",
  year: "Final Year",
  cgpa: "8.4",
  phone: "+91 98765 43210",
  skills: ["React", "Python", "Java", "SQL", "Machine Learning", "Node.js"],
  resumeUploaded: true,
};

export const announcements = [
  { id: "n1", title: "Google pre-placement talk tomorrow at 3 PM", time: "2 hours ago", urgent: true },
  { id: "n2", title: "Resume submission deadline extended for TCS", time: "5 hours ago", urgent: false },
  { id: "n3", title: "Mock interview slots open — sign up now", time: "1 day ago", urgent: false },
];
