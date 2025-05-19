import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  component: React.ComponentType;
  roles?: string[]; // Optional array of roles allowed to access the route
};

export function ProtectedRoute({ component: Component, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Verifying credentials...</span>
      </div>
    );
  }

  // Redirect to login page if not authenticated
  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  // Force password change before accessing protected routes
  if (user.changePasswordRequired) {
    return <Redirect to="/auth/change-password" />;
  }
  
  // Force MFA setup if required but not enabled
  const mfaEnabled = user.mfaEnabled === true;
  
  if (user.mfaEnabled === false) {
    return <Redirect to="/auth/mfa-setup" />;
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Log access attempt for security auditing
    console.warn(`Access denied: User ${user.id} with role ${user.role} attempted to access a route restricted to ${roles.join(", ")}`);
    
    // Redirect based on user's role
    switch (user.role) {
      case "patient":
        setLocation("/dashboard");
        break;
      case "provider":
        setLocation("/dashboard");
        break;
      case "admin":
        setLocation("/admin/dashboard");
        break;
      default:
        setLocation("/auth/login");
    }
    
    return null;
  }

  // Render the protected component if all checks pass
  return <Component />;
}