import React, { createContext, useState, useContext } from "react";

interface PersonalInfo {
  fullName?: string;
  ssn?: string;
  dob?: string;
  citizenship?: string;
  maritalStatus?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  residencyYears?: string;
  residencyMonths?: string;
  housingType?: string;
  previousAddress?: string;
}

// You can later add EmploymentInfo, AssetsInfo, etc.
interface LoanAppData {
  personalInfo: PersonalInfo;
}

interface LoanAppContextType {
  data: LoanAppData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
}

const LoanAppContext = createContext<LoanAppContextType | undefined>(undefined);

export const LoanAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LoanAppData>({
    personalInfo: {},
  });

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  return (
    <LoanAppContext.Provider value={{ data, updatePersonalInfo }}>
      {children}
    </LoanAppContext.Provider>
  );
};

export const useLoanApp = (): LoanAppContextType => {
  const context = useContext(LoanAppContext);
  if (!context) {
    throw new Error("useLoanApp must be used within a LoanAppProvider");
  }
  return context;
};