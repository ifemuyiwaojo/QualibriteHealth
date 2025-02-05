import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function SchedulePage() {
  const { user } = useAuth();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/provider/schedule'],
  });

  if (!user || user.role !== "provider") {
    return null;
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
        <h1 className="text-3xl font-bold">Today's Schedule</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading appointments...</div>
          ) : (
            <div className="space-y-4">
              {appointments?.map((appointment: any) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="grid gap-2">
                      <div>
                        <span className="font-semibold">Patient: </span>
                        {appointment.patientName}
                      </div>
                      <div>
                        <span className="font-semibold">Time: </span>
                        {format(new Date(appointment.dateTime), 'h:mm a')}
                      </div>
                      <div>
                        <span className="font-semibold">Type: </span>
                        {appointment.type.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-semibold">Status: </span>
                        <span className={`capitalize ${
                          appointment.status === 'completed' ? 'text-green-600' :
                          appointment.status === 'scheduled' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      {appointment.notes && (
                        <div>
                          <span className="font-semibold">Notes: </span>
                          {appointment.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )) ?? <div>No appointments scheduled for today.</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}