import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { WelcomePage } from "./components/WelcomePage";
import { PersonalInfoPage } from "./components/PersonalInfoPage";
import { EmploymentInfoPage } from "./components/EmploymentInfoPage";
import { AssetsLiabilitiesPage } from "./components/AssetsLiabilitiesPage";
import { RealEstateInfoPage } from "./components/RealEstateInfoPage";
import { LoanPropertyInfoPage } from "./components/LoanPropertyInfoPage";
import { ReviewPage } from "./components/ReviewPage";
import { Layout } from "./functions/Layout";
import { ScrollToTop } from "./functions/ScrollToTop";
import { DeclarationsPage } from "./components/DeclarationsPage";

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Layout>
                <WelcomePage />
              </Layout>
            }
          />
          <Route
            path="/personal-info"
            element={
              <Layout>
                <PersonalInfoPage />
              </Layout>
            }
          />
          <Route
            path="/employment-info"
            element={
              <Layout>
                <EmploymentInfoPage />
              </Layout>
            }
          />
          <Route
            path="/assets-liabilities"
            element={
              <Layout>
                <AssetsLiabilitiesPage />
              </Layout>
            }
          />
          <Route
            path="/real-estate-info"
            element={
              <Layout>
                <RealEstateInfoPage />
              </Layout>
            }
          />
          <Route
            path="/loan-property-info"
            element={
              <Layout>
                <LoanPropertyInfoPage />
              </Layout>
            }
          />
          <Route
            path="/declarations"
            element={
              <Layout>
                <DeclarationsPage />
              </Layout>
            }
          />
          <Route
            path="/review"
            element={
              <Layout>
                <ReviewPage />
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;