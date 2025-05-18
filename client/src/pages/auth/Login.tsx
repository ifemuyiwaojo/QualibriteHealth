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
import { useState, useCallback } from "react";
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
        // Check if MFA verification is required
        if (response.mfaRequired) {
          // Store user data and show MFA verification screen
          setMfaRequired(true);
          setPendingUser(response.user);
          toast({
            title: "Additional Verification Required",
            description: "Please enter the verification code from your authenticator app",
          });
        } else if (response.user.requiresPasswordChange) {
          // Password change required
          setLocation("/auth/change-password");
        } else {
          // Normal login successful
          setLocation("/dashboard");
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
      
      if (error.message && error.message.includes("credentials")) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (error.message && error.message.includes("Too many")) {
        errorMessage = "Too many login attempts. Please try again later.";
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
    // MFA verification successful, complete login
    setMfaRequired(false);
    setPendingUser(null);
    
    // Check if password change is required
    if (userData.requiresPasswordChange) {
      setLocation("/auth/change-password");
    } else {
      setLocation("/dashboard");
      toast({
        title: "Login Successful",
        description: "Identity verified successfully",
      });
    }
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

  if (user) {
    console.log("User already logged in, redirecting to dashboard");
    return <Link href="/dashboard" replace />;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {mfaRequired ? 'Two-Factor Authentication' :
             forgotMode === 'password' ? 'Forgot Password' :
             forgotMode === 'email' ? 'Forgot Email' : 'Sign in'}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
  );
}