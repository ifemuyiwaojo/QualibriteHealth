import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdminAccount, setIsAdminAccount] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Check if email is likely an admin account without exposing the validation to the user
  const checkIfLikelyAdmin = (email: string): boolean => {
    // Simple check for common admin email patterns
    const adminPatterns = [
      'admin@',
      'superadmin@',
      'sysadmin@',
      'administrator@',
      'support@',
      'system@'
    ];
    return adminPatterns.some(pattern => email.toLowerCase().includes(pattern));
  };

  async function onSubmit(data: FormData) {
    // Check if email potentially belongs to an admin account
    if (checkIfLikelyAdmin(data.email)) {
      setIsAdminAccount(true);
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/forgot-password", data);
      setIsSuccess(true);
      toast({
        title: "Reset link sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 px-2">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            {isAdminAccount ? (
              <div className="text-sm">
                <p className="font-semibold mb-2">Admin Account Notice</p>
                <p>For security reasons, admin account passwords can only be reset by a superadmin.</p>
                <p className="mt-2">Please contact your system administrator for assistance.</p>
              </div>
            ) : (
              <p className="text-sm">Check your email for a password reset link.</p>
            )}
          </div>
          <Button onClick={onCancel} className="w-full" variant="outline">
            Back to Login
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                disabled={isSubmitting}
              >
                Back to login
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}