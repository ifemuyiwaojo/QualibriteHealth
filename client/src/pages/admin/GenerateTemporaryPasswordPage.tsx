import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clipboard, Key, ShieldAlert, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  userId: z.string().min(1, { message: "Please select a patient" }),
});

type FormData = z.infer<typeof formSchema>;

export default function GenerateTemporaryPasswordPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  // Query to fetch all patients
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ["/api/admin/temp-password/patients"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/temp-password/patients");
      return await response.json();
    }
  });

  // Mutation to generate temporary password
  const generatePasswordMutation = useMutation({
    mutationFn: async (data: { userId: number }) => {
      const response = await apiRequest("POST", "/api/admin/temp-password/generate", data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedPassword(data.tempPassword);
        toast({
          title: "Success",
          description: "Temporary password generated successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to generate password",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate password",
        variant: "destructive",
      });
    }
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const userId = parseInt(data.userId, 10);
    const patient = patients?.find((p: any) => p.id === userId);
    setSelectedPatient(patient);
    generatePasswordMutation.mutate({ userId });
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
        variant: "default",
      });
    }
  };

  const formatUserName = (patient: any) => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName} (${patient.email})`;
    }
    return patient?.email || patient?.username || `User #${patient.id}`;
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Generate Temporary Password</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
            <CardDescription>
              Choose a patient to generate a temporary password. The patient will be required to change their
              password upon first login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="h-72">
                            {patients?.map((patient: any) => (
                              <SelectItem key={patient.id} value={patient.id.toString()}>
                                {formatUserName(patient)}
                                {patient.changePasswordRequired && " (Password change required)"}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a patient account to generate a temporary password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || generatePasswordMutation.isPending}
                  className="w-full gap-2"
                >
                  {generatePasswordMutation.isPending ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      Generate Temporary Password
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Could not load patients. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {generatedPassword && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Temporary Password Generated
                </CardTitle>
                <CardDescription>
                  Password for {selectedPatient && formatUserName(selectedPatient)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Security Notice</AlertTitle>
                  <AlertDescription>
                    This temporary password will only be shown once. The patient will be required to change
                    their password upon first login.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-muted rounded-md font-mono text-center break-all">
                  {generatedPassword}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={copyToClipboard} className="w-full gap-2">
                  <Clipboard className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Password Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li>Generated passwords meet HIPAA security requirements</li>
                <li>Patients are required to change their password on first login</li>
                <li>All password generation events are securely logged</li>
                <li>Email notifications are sent to patients when available</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}