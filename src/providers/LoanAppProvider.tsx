import { useState } from "react";
import type { 
    LoanAppData ,
    PersonalInfo,
    EmploymentInfo,
    AssetsLiabilitiesInfo,
    RealEstateInfo,
    LoanPropertyInfo,
    DeclarationsInfo,
} from "../context/LoanAppContext";
import { LoanAppContext } from "../context/LoanAppContext";

export const LoanAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LoanAppData>({
    personalInfo: {},
    employmentInfo: {},
    assetsLiabilities: {},
    realEstate: {},
    loanProperty: {},
    declarations: {},
  });

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const updateEmploymentInfo = (info: Partial<EmploymentInfo>) => {
    setData(prev => ({
      ...prev,
      employmentInfo: { ...prev.employmentInfo, ...info },
    }));
  };

  const updateAssetsLiabilities = (info: Partial<AssetsLiabilitiesInfo>) => {
    setData(prev => ({
      ...prev,
      assetsLiabilities: { ...prev.assetsLiabilities, ...info },
    }));
  };

  const updateRealEstate = (info: Partial<RealEstateInfo>) => {
    setData(prev => ({
      ...prev,
      realEstate: { ...prev.realEstate, ...info },
    }));
  };

  const updateLoanProperty = (info: Partial<LoanPropertyInfo>) => {
    setData(prev => ({
      ...prev,
      loanProperty: { ...prev.loanProperty, ...info },
    }));
  };

  const updateDeclarations = (info: Partial<DeclarationsInfo>) => {
    setData(prev => ({
      ...prev,
      declarations: { ...prev.declarations, ...info },
    }));
  };

  return (
    <LoanAppContext.Provider
      value={{
        data,
        updatePersonalInfo,
        updateEmploymentInfo,
        updateAssetsLiabilities,
        updateRealEstate,
        updateLoanProperty,
        updateDeclarations,
      }}
    >
      {children}
    </LoanAppContext.Provider>
  );
};