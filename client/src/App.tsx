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
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import ProviderDashboard from "@/pages/dashboard/ProviderDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import NotFound from "@/pages/not-found";
import { memo } from "react";

const DashboardRouter = memo(function DashboardRouter() {
  const { user, isLoading } = useAuthProvider();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  switch (user.role) {
    case "patient":
      return <PatientDashboard />;
    case "provider":
      return <ProviderDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <NotFound />;
  }
});

const Router = memo(function Router() {
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
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
          <Route path="/dashboard" component={DashboardRouter} />
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