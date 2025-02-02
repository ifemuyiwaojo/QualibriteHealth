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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
          providerId: "provider-1", // This should be dynamic based on provider selection
          providerName: "Dr. Smith", // This should be dynamic based on provider selection
          scheduledTime: values.scheduledTime.toISOString(),
          duration: parseInt(values.duration),
          isGroupSession: values.isGroupSession,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to schedule appointment");
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
      <h1 className="text-3xl font-bold mb-8">Schedule Appointment</h1>

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

        {/* List of upcoming appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* We'll reuse the TelehealthSession component here */}
              <p>Your scheduled appointments will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
