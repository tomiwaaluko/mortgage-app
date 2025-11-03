import { useContext } from "react";
import type { LoanAppContextType } from "../context/LoanAppContext";
import { LoanAppContext } from "../context/LoanAppContext";

export const useLoanApp = (): LoanAppContextType => {
  const context = useContext(LoanAppContext);
  if (!context) {
    throw new Error("useLoanApp must be used within a LoanAppProvider");
  }
  return context;
};