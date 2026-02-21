import React, { createContext, useContext, useState } from "react";
import { Application, PrepTask, initialApplications, initialPrepTasks, Company } from "@/lib/mockData";

interface AppState {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  prepTasks: PrepTask[];
  setPrepTasks: React.Dispatch<React.SetStateAction<PrepTask[]>>;
  applyToCompany: (company: Company) => void;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [prepTasks, setPrepTasks] = useState<PrepTask[]>(initialPrepTasks);

  const applyToCompany = (company: Company) => {
    if (applications.find(a => a.companyId === company.id)) return;
    setApplications(prev => [...prev, {
      id: `a${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      role: company.role,
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
    }]);
  };

  const updateApplicationStatus = (id: string, status: Application["status"]) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <AppContext.Provider value={{ applications, setApplications, prepTasks, setPrepTasks, applyToCompany, updateApplicationStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be within AppProvider");
  return ctx;
};
