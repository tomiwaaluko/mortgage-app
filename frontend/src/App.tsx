import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import { PersonalInfo } from "./pages/PersonalInfo";
import { EmploymentInfo } from "./pages/EmploymentInfo";
import { AssetsLiabilities } from "./pages/AssetsLiabilities";
import { RealEstateInfo } from "./pages/RealEstateInfo";
import { LoanPropertyInfo } from "./pages/LoanPropertyInfo";
import { Review } from "./pages/Review";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { AuthPrompt } from "./pages/AuthPrompt";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./ui/Layout";
import { ScrollToTop } from "./ui/ScrollToTop";
import { Declarations } from "./pages/Declarations";
import AuthRoute from "./ui/AuthRoute";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RequireAdmin } from "./ui/RequireAdmin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminApplicationDetail } from "./pages/AdminApplicationDetail";
import VerifyEmail from "./pages/VerifyEmail";

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
            path="/auth-prompt"
            element={
              <Layout>
                <AuthPrompt />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <AuthRoute>
                  <Dashboard />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="sign-in"
            element={
              <Layout>
                <SignIn />
              </Layout>
            }
          />
          <Route
            path="sign-up"
            element={
              <Layout>
                <SignUp />
              </Layout>
            }
          />
          <Route
            path="/personal-info"
            element={
              <Layout>
                <AuthRoute>
                  <PersonalInfo />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/employment-info"
            element={
              <Layout>
                <AuthRoute>
                  <EmploymentInfo />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/assets-liabilities"
            element={
              <Layout>
                <AuthRoute>
                  <AssetsLiabilities />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/real-estate-info"
            element={
              <Layout>
                <AuthRoute>
                  <RealEstateInfo />  
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/loan-property-info"
            element={
              <Layout>
                <AuthRoute>
                  <LoanPropertyInfo />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/declarations"
            element={
              <Layout>
                <AuthRoute>
                  <Declarations />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/review"
            element={
              <Layout>
                <AuthRoute>
                  <Review />
                </AuthRoute>
              </Layout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Layout>
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              </Layout>
            }
          />
          <Route
            path="/admin/applications/:id" 
            element={
              <Layout>
                <RequireAdmin>
                  <AdminApplicationDetail />
                </RequireAdmin>
              </Layout>
            }
          />
          <Route
            path="/verify-email"
            element={
              <Layout>
                <VerifyEmail />
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
