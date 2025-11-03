import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import { PersonalInfo } from "./pages/PersonalInfo";
import { EmploymentInfo } from "./pages/EmploymentInfo";
import { AssetsLiabilities } from "./pages/AssetsLiabilities";
import { RealEstateInfo } from "./pages/RealEstateInfo";
import { LoanPropertyInfo } from "./pages/LoanPropertyInfo";
import { Review } from "./pages/Review";
import { Layout } from "./ui/Layout";
import { ScrollToTop } from "./ui/ScrollToTop";
import { Declarations } from "./pages/Declarations";

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
                <Home />
              </Layout>
            }
          />
          <Route
            path="/personal-info"
            element={
              <Layout>
                <PersonalInfo />
              </Layout>
            }
          />
          <Route
            path="/employment-info"
            element={
              <Layout>
                <EmploymentInfo />
              </Layout>
            }
          />
          <Route
            path="/assets-liabilities"
            element={
              <Layout>
                <AssetsLiabilities />
              </Layout>
            }
          />
          <Route
            path="/real-estate-info"
            element={
              <Layout>
                <RealEstateInfo />
              </Layout>
            }
          />
          <Route
            path="/loan-property-info"
            element={
              <Layout>
                <LoanPropertyInfo />
              </Layout>
            }
          />
          <Route
            path="/declarations"
            element={
              <Layout>
                <Declarations />
              </Layout>
            }
          />
          <Route
            path="/review"
            element={
              <Layout>
                <Review />
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;