import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useState, useCallback, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { ForgotEmailForm } from "@/components/ForgotEmailForm";
import { MfaVerification } from "@/components/MfaVerification";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  message: string;
  mfaRequired?: boolean;
  user: {
    id: number;
    email: string;
    role: string;
    requiresPasswordChange?: boolean;
    isSuperadmin?: boolean;
  };
}

export default function Login() {
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState<'none' | 'password' | 'email'>('none');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [pendingUser, setPendingUser] = useState<LoginResponse["user"] | null>(null);
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    if (isSubmitting) return;

    // Clear any previous error message
    setLoginError(null);

    try {
      setIsSubmitting(true);
      console.log("Attempting login...");
      const response = await login(data.email, data.password, data.rememberMe);
      console.log("Login response:", response);

      if (response?.user) {
        // Check if password change is required (this has priority)
        if (response.passwordChangeRequired || response.user.requiresPasswordChange) {
          // Password change required
          console.log("Password change required, redirecting");
          setLocation("/auth/change-password");
          toast({
            title: "Password Change Required",
            description: "For security reasons, you must change your password before continuing.",
          });
        }
        // Then check if MFA verification is required (only for regular logins)
        else if (response.mfaRequired) {
          // Store user data and show MFA verification screen
          console.log("MFA verification required");
          setMfaRequired(true);
          setPendingUser(response.user);
          toast({
            title: "Additional Verification Required",
            description: "Please enter the verification code from your authenticator app",
          });
        } else {
          // Normal login successful
          console.log("Login successful, redirecting to dashboard");
          if (response.user.role === "patient") {
            setLocation("/patient/dashboard");
          } else {
            setLocation("/dashboard");
          }
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Set appropriate error message based on error type/message
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message && (error.message.includes("locked") || error.message.includes("Account is temporarily locked"))) {
        errorMessage = error.message || "Your account is temporarily locked due to multiple failed login attempts. Please try again later or contact support.";
      } else if (error.message && error.message.includes("attempts remaining")) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes("credentials")) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (error.message && error.message.includes("Too many")) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error.message && error.message.includes("locked")) {
        errorMessage = "Your account is locked. Please contact an administrator to unlock it.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Set error message to display on the form
      setLoginError(errorMessage);
      
      // Also show a toast for immediate feedback
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [login, toast, isSubmitting, setLocation]);
  
  // Handle MFA verification completion
  const handleMfaSuccess = useCallback((userData: any) => {
    console.log("MFA success handler called with user data:", userData);
    
    // MFA verification successful, complete login
    setMfaRequired(false);
    setPendingUser(null);
    
    // Show toast first before navigation
    toast({
      title: "Login Successful",
      description: "Identity verified successfully",
    });
    
    // Force a query invalidation to refresh auth state
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(() => {
        console.log("Auth state refreshed, redirecting to dashboard");
        
        // Add a small delay before redirecting
        setTimeout(() => {
          // Check if password change is required
          if (userData.requiresPasswordChange) {
            window.location.href = "/auth/change-password";
          } else {
            window.location.href = "/dashboard";
          }
        }, 300);
      })
      .catch(err => console.error("Error refreshing auth state:", err));
    
  }, [setLocation, toast]);
  
  // Handle MFA verification cancellation
  const handleMfaCancel = useCallback(() => {
    // Reset MFA state
    setMfaRequired(false);
    setPendingUser(null);
    
    // Show message
    toast({
      title: "Verification Cancelled",
      description: "The MFA verification was cancelled",
      variant: "default",
    });
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to dashboard");
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (user) {
    return null; // Return null while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-cyan-200/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/15 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center">
          {/* Logo and branding */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <div className="w-8 h-8 bg-gradient-to-br from-white to-cyan-100 rounded-xl"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Qualibrite Health</h1>
                <p className="text-cyan-100 text-sm">Secure Patient Portal</p>
              </div>
            </div>
          </div>
          
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 bg-gradient-to-r from-slate-50 to-cyan-50/30 pb-8">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent">
                {mfaRequired ? 'Two-Factor Authentication' :
                 forgotMode === 'password' ? 'Forgot Password' :
                 forgotMode === 'email' ? 'Forgot Email' : 'Welcome Back'}
              </CardTitle>
              <p className="text-center text-slate-600 mt-2">
                {mfaRequired ? 'Enter your verification code' :
                 forgotMode === 'password' ? 'Reset your password' :
                 forgotMode === 'email' ? 'Recover your email' : 'Sign in to access your account'}
              </p>
            </CardHeader>
            <CardContent className="p-8">
          {mfaRequired && pendingUser ? (
            <MfaVerification
              email={pendingUser.email}
              onVerificationSuccess={handleMfaSuccess}
              onCancel={handleMfaCancel}
            />
          ) : forgotMode === 'password' ? (
            <ForgotPasswordForm onCancel={() => setForgotMode('none')} />
          ) : forgotMode === 'email' ? (
            <ForgotEmailForm onCancel={() => setForgotMode('none')} />
          ) : (
            <>
              {loginError && (
                <div className="mb-4 p-3 rounded-md border border-destructive bg-destructive/10 text-destructive text-sm">
                  <p className="font-medium">Login failed</p>
                  <p>{loginError}</p>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between items-center">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Remember me</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="px-0"
                      onClick={() => setForgotMode('password')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
              <div className="mt-4 flex justify-between items-center text-sm">
                <span>
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0"
                  onClick={() => setForgotMode('email')}
                >
                  Forgot email?
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}