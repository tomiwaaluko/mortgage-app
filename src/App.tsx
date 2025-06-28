import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { WelcomePage } from "./components/WelcomePage";
import { PersonalInfoPage } from "./components/PersonalInfoPage";
import { EmploymentInfoPage } from "./components/EmploymentInfoPage";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";

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
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;