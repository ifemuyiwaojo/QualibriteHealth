import { Switch, Route, Redirect } from "wouter";
import { AuthContext, useAuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ChangePassword from "@/pages/auth/ChangePassword";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import ProviderDashboard from "@/pages/dashboard/ProviderDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import NotFound from "@/pages/not-found";
import { memo } from "react";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import SecurityCenterPage from "@/pages/admin/SecurityCenterPage";
import CompliancePage from "@/pages/admin/CompliancePage";
import SettingsPage from "@/pages/admin/SettingsPage";
import ProvidersPage from "@/pages/admin/ProvidersPage";
import TelehealthPage from "@/pages/telehealth/TelehealthPage";

const DashboardRouter = memo(function DashboardRouter() {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
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
    default:
      return <Redirect to="/auth/login" />;
  }
});

const AuthenticatedRoute = memo(function AuthenticatedRoute({
  component: Component
}: {
  component: React.ComponentType
}) {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  // Force password change for authenticated routes as well
  if (user.changePasswordRequired) {
    return <Redirect to="/auth/change-password" />;
  }

  return <Component />;
});

const AdminRoute = memo(function AdminRoute({
  component: Component,
}: {
  component: React.ComponentType;
}) {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
});

const Router = memo(function Router() {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
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

          {/* Protected Routes */}
          <Route path="/dashboard">
            {!user ? <Redirect to="/auth/login" /> : <DashboardRouter />}
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/users" component={() => <AdminRoute component={AdminUsersPage} />} />
          <Route path="/admin/providers" component={() => <AdminRoute component={ProvidersPage} />} />
          <Route path="/admin/audit-logs" component={() => <AdminRoute component={AuditLogsPage} />} />
          <Route path="/admin/settings" component={() => <AdminRoute component={SettingsPage} />} />
          <Route path="/admin/compliance" component={() => <AdminRoute component={CompliancePage} />} />
          <Route path="/admin/security" component={() => <AdminRoute component={SecurityCenterPage} />} />

          {/* Patient Routes */}
           <Route path="/telehealth">
            {!user ? <Redirect to="/auth/login" /> : <TelehealthPage />}
          </Route>
          <Route path="/patient/appointments">
            {!user ? <Redirect to="/auth/login" /> : <div>Appointments Page</div>}
          </Route>
          <Route path="/patient/records">
            {!user ? <Redirect to="/auth/login" /> : <div>Medical Records Page</div>}
          </Route>
          <Route path="/patient/profile">
            {!user ? <Redirect to="/auth/login" /> : <div>Patient Profile Page</div>}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
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