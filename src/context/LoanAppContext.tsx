import { createContext } from "react";

export interface PersonalInfo {
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
  monthlyPayment?: string;
  previousAddress?: string;
}

export interface EmploymentInfo {
  employerName?: string;
  phone?: string;
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  position?: string;
  startDate?: string;
  yearsInLineOfWork?: string;
  monthsInLineOfWork?: string;
  isSelfEmployed?: boolean;
  isEmployedByFamily?: boolean;
  ownershipShare?: string;
  monthlyIncomeBase?: string;
  monthlyIncomeOvertime?: string;
  monthlyIncomeBonus?: string;
  monthlyIncomeCommission?: string;
  monthlyIncomeMilitary?: string;
  monthlyIncomeOther?: string;
  otherIncome?: { source: string; amount: string }[];
}

export interface AssetsLiabilitiesInfo {
  assetsAccounts?: { accountType: string; institution: string; accountNumber: string; value: string }[];
  otherAssets?: { type: string; value: string }[];
  liabilities?: { accountType: string; company: string; accountNumber: string; balance: string; payment: string; toBePaidOff: boolean }[];
  otherLiabilities?: { type: string; payment: string }[];
}

export interface RealEstateInfo {
  ownsRealEstate?: string;
  properties?: {
    address: string;
    propertyValue: string;
    status: string;
    occupancy: string;
    monthlyPayment: string;
    rentalIncome: string;
  }[];
}

export interface LoanPropertyInfo {
  underContract?: string;
  salesPrice?: string;
  downPayment?: string;
  propertyAddress?: string;
  occupancy?: string;
  receivingGift?: string;
  giftAssetType?: string;
  giftDeposited?: string;
  giftSource?: string;
  giftValue?: string;
}

export interface DeclarationsInfo {
  occupyAsPrimary?: string;
  ownedPropertyLast3Years?: string;
  typeOfProperty?: string;
  titleHeld?: string;
  relationshipWithSeller?: string;
  borrowingMoney?: string;
  borrowingMoneyAmount?: string;
  mortgageOnOtherProperty?: string;
  obligatedOnLoan?: string;
  cosigner?: string;
  borrowedDownPayment?: string;
  declaredForeclosure?: string;
  declaredBankruptcy?: string;
  bankruptcyTypes?: string[];
}

export interface LoanAppData {
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  assetsLiabilities: AssetsLiabilitiesInfo;
  realEstate: RealEstateInfo;
  loanProperty: LoanPropertyInfo;
  declarations: DeclarationsInfo;
}

export interface LoanAppContextType {
  data: LoanAppData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateEmploymentInfo: (info: Partial<EmploymentInfo>) => void;
  updateAssetsLiabilities: (info: Partial<AssetsLiabilitiesInfo>) => void;
  updateRealEstate: (info: Partial<RealEstateInfo>) => void;
  updateLoanProperty: (info: Partial<LoanPropertyInfo>) => void;
  updateDeclarations: (info: Partial<DeclarationsInfo>) => void;
}

export const LoanAppContext = createContext<LoanAppContextType | undefined>(undefined);
