import { useAuth } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TelehealthSession } from "@/components/TelehealthSession";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ApiService } from "@/services/api/ApiService";
import { initializeApi } from "@/services/api/initializeApi";
import { useEffect, useState } from "react";
import { Appointment } from "@/services/adapters/ApiAdapter";

const scheduleFormSchema = z.object({
  scheduledTime: z.date({
    required_error: "Please select a date and time for your appointment",
  }),
  duration: z.string().min(1, "Please select appointment duration"),
  isGroupSession: z.boolean().default(false),
});

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiService, setApiService] = useState<ApiService | null>(null);
  const [apiInitialized, setApiInitialized] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Initialize the API service
  useEffect(() => {
    const initApi = async () => {
      try {
        // Currently using 'mock' adapter while waiting for TherapyNotes API credentials
        const service = await initializeApi('mock');
        setApiService(service);
        setApiInitialized(true);
      } catch (error) {
        console.error('Failed to initialize API service:', error);
        toast({
          title: 'API Connection Error',
          description: 'Failed to connect to appointment scheduling service. Please try again later.',
          variant: 'destructive'
        });
      }
    };

    initApi();
  }, [toast]);

  // Fetch existing appointments when API is ready
  const { isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!apiInitialized || !apiService || !user) return [];
      
      try {
        const appointments = await apiService.getAppointments(user.id.toString());
        setAppointments(appointments);
        return appointments;
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your appointments. Please try again.',
          variant: 'destructive'
        });
        return [];
      }
    },
    enabled: apiInitialized && !!user
  });

  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      duration: "30",
      isGroupSession: false,
    },
  });

  const createVisitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof scheduleFormSchema>) => {
      const response = await fetch("/api/telehealth/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientIds: [user?.id.toString()],
          patientNames: [user?.email],
          providerId: "provider-1",
          providerName: "Dr. Smith",
          scheduledTime: values.scheduledTime.toISOString(),
          duration: parseInt(values.duration),
          isGroupSession: values.isGroupSession,
          visitType: values.isGroupSession ? 'GROUP' : 'VIDEO',
          reasonForVisit: "Scheduled Visit",
          maxParticipants: values.isGroupSession ? 8 : 2
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to schedule appointment");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
    await createVisitMutation.mutateAsync(values);
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Schedule Appointment</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date and Time</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the length of your appointment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createVisitMutation.isPending}>
                  {createVisitMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <TelehealthSession isProvider={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}