import { Switch, Route, Redirect } from "wouter";
import { AuthContext, useAuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ConvaiWidget } from "@/components/ConvaiWidget";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loading } from "@/components/ui/loading";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ChangePassword from "@/pages/auth/ChangePassword";
import ProfilePage from "@/pages/auth/ProfilePage";
import MfaSetupPage from "@/pages/auth/MfaSetupPage";
import MfaEnforcePage from "@/pages/auth/MfaEnforcePage";
import SecuritySettings from "@/pages/profile/SecuritySettings";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import ProviderDashboard from "@/pages/dashboard/ProviderDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import PracticeManagerDashboard from "@/pages/dashboard/PracticeManagerDashboard";
import BillingDashboard from "@/pages/dashboard/BillingDashboard";
import IntakeCoordinatorDashboard from "@/pages/dashboard/IntakeCoordinatorDashboard";
import ITSupportDashboard from "@/pages/dashboard/ITSupportDashboard";
import MarketingDashboard from "@/pages/dashboard/MarketingDashboard";
import NotFound from "@/pages/not-found";
import { memo } from "react";
import UserManagement from "@/pages/admin/UserManagement";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import SecurityCenterPage from "@/pages/admin/SecurityCenterPage";
import CompliancePage from "@/pages/admin/CompliancePage";
import SettingsPage from "@/pages/admin/SettingsPage";
import ProvidersPage from "@/pages/admin/ProvidersPage";
import GenerateTemporaryPasswordPage from "@/pages/admin/GenerateTemporaryPasswordPage";
import AccountUnlockPage from "@/pages/admin/AccountUnlockPage";
import UserSecurityPage from "@/pages/admin/UserSecurityPage";
import TelehealthPage from "@/pages/telehealth/TelehealthPage";
import AppointmentsPage from "@/pages/patient/AppointmentsPage";
import MedicalRecordsPage from "@/pages/patient/MedicalRecordsPage";
import SchedulePage from "@/pages/provider/SchedulePage";
import PatientListPage from "@/pages/provider/PatientListPage";
import RecordsPage from "@/pages/provider/RecordsPage";
import ProviderProfilePage from "@/pages/provider/ProviderProfilePage";


const DashboardRouter = memo(function DashboardRouter() {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return <Loading fullScreen text="Loading your dashboard..." />;
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  // Force password change before accessing dashboard
  if (user.changePasswordRequired) {
    return <Redirect to="/auth/change-password" />;
  }

  switch (user.role) {
    case "patient":
      return <PatientDashboard />;
    case "provider":
      return <ProviderDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "practice_manager":
      return <PracticeManagerDashboard />;
    case "billing":
      return <BillingDashboard />;
    case "intake_coordinator":
      return <IntakeCoordinatorDashboard />;
    case "it_support":
      return <ITSupportDashboard />;
    case "marketing":
      return <MarketingDashboard />;
    default:
      return <Redirect to="/auth/login" />;
  }
});

// Replaced with ProtectedRoute component
// This component is kept for backward compatibility but now just delegates to ProtectedRoute
const AuthenticatedRoute = memo(function AuthenticatedRoute({
  component
}: {
  component: React.ComponentType
}) {
  return <ProtectedRoute component={component} />;
});

// Role-restricted route specifically for admin users
const AdminRoute = memo(function AdminRoute({
  component,
}: {
  component: React.ComponentType;
}) {
  // Use our reusable ProtectedRoute with role restriction
  return <ProtectedRoute component={component} roles={["admin"]} />;
});

export const Router = memo(function Router() {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow w-full max-w-[1920px] mx-auto px-4 md:px-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />

          {/* Auth Routes */}
          <Route path="/auth/login">
            {user ? (
              user.changePasswordRequired ? (
                <Redirect to="/auth/change-password" />
              ) : (
                <Redirect to="/dashboard" />
              )
            ) : (
              <Login />
            )}
          </Route>
          <Route path="/auth/register">
            {user ? <Redirect to="/dashboard" /> : <Register />}
          </Route>
          <Route path="/auth/change-password">
            {!user ? <Redirect to="/auth/login" /> : <ChangePassword />}
          </Route>
          <Route path="/auth/profile">
            {!user ? <Redirect to="/auth/login" /> : <ProfilePage />}
          </Route>
          <Route path="/auth/mfa-setup">
            {!user ? <Redirect to="/auth/login" /> : <MfaSetupPage />}
          </Route>
          <Route path="/auth/mfa-enforce">
            {!user ? <Redirect to="/auth/login" /> : <MfaEnforcePage />}
          </Route>
          <Route path="/profile/security">
            {!user ? <Redirect to="/auth/login" /> : <SecuritySettings />}
          </Route>

          {/* Protected Routes */}
          <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardRouter} />} />

          {/* Admin Routes */}
          <Route path="/admin/users" component={() => <ProtectedRoute component={UserManagement} roles={["admin"]} />} />
          <Route path="/admin/providers" component={() => <ProtectedRoute component={ProvidersPage} roles={["admin"]} />} />
          <Route path="/admin/audit-logs" component={() => <ProtectedRoute component={AuditLogsPage} roles={["admin"]} />} />
          <Route path="/admin/settings" component={() => <ProtectedRoute component={SettingsPage} roles={["admin"]} />} />
          <Route path="/admin/compliance" component={() => <ProtectedRoute component={CompliancePage} roles={["admin"]} />} />
          <Route path="/admin/security" component={() => <ProtectedRoute component={SecurityCenterPage} roles={["admin"]} />} />
          <Route path="/admin/generate-temp-password" component={() => <ProtectedRoute component={GenerateTemporaryPasswordPage} roles={["admin"]} />} />
          <Route path="/admin/account-unlock" component={() => <ProtectedRoute component={AccountUnlockPage} roles={["admin", "it_support"]} />} />
          <Route path="/admin/user-security/:userId" component={() => <ProtectedRoute component={UserSecurityPage} roles={["admin", "it_support"]} />} />

          {/* Patient Routes */}
          <Route path="/telehealth" component={() => <ProtectedRoute component={TelehealthPage} />} />
          <Route path="/patient/appointments" component={() => <ProtectedRoute component={AppointmentsPage} roles={["patient"]} />} />
          <Route path="/patient/records" component={() => <ProtectedRoute component={MedicalRecordsPage} roles={["patient"]} />} />
          <Route path="/patient/profile" component={() => <ProtectedRoute component={() => <div>Patient Profile Page</div>} roles={["patient"]} />} />


          {/* Provider Routes */}
          <Route path="/provider/schedule" component={() => <ProtectedRoute component={SchedulePage} roles={["provider"]} />} />
          <Route path="/provider/patients" component={() => <ProtectedRoute component={PatientListPage} roles={["provider"]} />} />
          <Route path="/provider/records" component={() => <ProtectedRoute component={RecordsPage} roles={["provider"]} />} />
          <Route path="/provider/profile" component={() => <ProtectedRoute component={ProviderProfilePage} roles={["provider"]} />} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ConvaiWidget />
    </div>
  );
});

function App() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <Router />
      <Toaster />
    </AuthContext.Provider>
  );
}

export default memo(App);