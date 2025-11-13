import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./ui/Layout";
import { ScrollToTop } from "./ui/ScrollToTop";
import AuthRoute from "./ui/AuthRoute";
import { RequireAdmin } from "./ui/RequireAdmin";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Lazy load pages for better code splitting
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home }))
);
const PersonalInfo = lazy(() =>
  import("./pages/PersonalInfo").then((m) => ({ default: m.PersonalInfo }))
);
const EmploymentInfo = lazy(() =>
  import("./pages/EmploymentInfo").then((m) => ({ default: m.EmploymentInfo }))
);
const AssetsLiabilities = lazy(() =>
  import("./pages/AssetsLiabilities").then((m) => ({
    default: m.AssetsLiabilities,
  }))
);
const RealEstateInfo = lazy(() =>
  import("./pages/RealEstateInfo").then((m) => ({ default: m.RealEstateInfo }))
);
const LoanPropertyInfo = lazy(() =>
  import("./pages/LoanPropertyInfo").then((m) => ({
    default: m.LoanPropertyInfo,
  }))
);
const Review = lazy(() =>
  import("./pages/Review").then((m) => ({ default: m.Review }))
);
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AuthPrompt = lazy(() =>
  import("./pages/AuthPrompt").then((m) => ({ default: m.AuthPrompt }))
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const Declarations = lazy(() =>
  import("./pages/Declarations").then((m) => ({ default: m.Declarations }))
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard }))
);
const AdminApplicationDetail = lazy(() =>
  import("./pages/AdminApplicationDetail").then((m) => ({
    default: m.AdminApplicationDetail,
  }))
);
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));

// Loading component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      fontSize: "1.2rem",
      color: "#1a73e8",
    }}
  >
    Loading...
  </div>
);

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
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
            <Route
              path="/forgot-password"
              element={
                <Layout>
                  <ForgotPassword />
                </Layout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <Layout>
                  <ResetPassword />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
}export default App;
