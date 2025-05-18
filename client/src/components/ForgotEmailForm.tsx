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
  identifier: z.string().min(3, "Please enter at least 3 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotEmailForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdminRecovery, setIsAdminRecovery] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
    },
  });

  // Check if this might be an admin recovery attempt based on the information provided
  const checkIfPossibleAdminRecovery = (identifier: string): boolean => {
    // Check for common admin-related terms
    const adminTerms = [
      'admin',
      'administrator',
      'superadmin',
      'manager',
      'system',
      'supervisor',
      'security',
      'dashboard'
    ];
    return adminTerms.some(term => identifier.toLowerCase().includes(term));
  };

  async function onSubmit(data: FormData) {
    // Check if this might be an admin account recovery attempt
    if (checkIfPossibleAdminRecovery(data.identifier)) {
      setIsAdminRecovery(true);
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/forgot-email", data);
      setIsSuccess(true);
      toast({
        title: "Request submitted",
        description: "If we can identify your account, we'll send an email with your login information to your registered email address.",
      });
    } catch (error) {
      console.error("Email recovery error:", error);
      toast({
        title: "Error",
        description: "There was a problem with your request. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 px-2">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter information that can help us identify your account.
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            {isAdminRecovery ? (
              <div className="text-sm">
                <p className="font-semibold mb-2">Admin Account Notice</p>
                <p>For security reasons, admin account email recovery is restricted.</p>
                <p className="mt-2">Please contact your system administrator or the superadmin for assistance.</p>
              </div>
            ) : (
              <p className="text-sm">If we can identify your account, we'll send your login information to your registered email address.</p>
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
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Information</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone number, name, or other identifying information"
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
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
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