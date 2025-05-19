import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, ShieldCheck, KeyRound, Smartphone, LockIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MobileAuthPanel from "@/components/MobileAuthPanel";

// Password change schema with complexity requirements
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

export default function SecuritySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("password");

  // Password change form
  const form = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordChangeForm) => {
      const res = await apiRequest("POST", "/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to change password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit handler for password change
  const onSubmit = (data: PasswordChangeForm) => {
    changePasswordMutation.mutate(data);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Security Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="password" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Devices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="password" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockIcon className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password with a strong, unique combination of characters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 10 characters and include uppercase, lowercase, 
                          numbers, and special characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert variant="default" className="bg-muted/50">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Password Security</AlertTitle>
                    <AlertDescription>
                      Strong passwords are essential for protecting your account and sensitive healthcare data.
                      Use a unique password that you don't use for other services.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <MobileAuthPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}