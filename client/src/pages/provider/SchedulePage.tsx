import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar as CalendarIcon, User, FileText } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function SchedulePage() {
  const { user } = useAuth();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/provider/schedule'],
  });

  if (!user || user.role !== "provider") {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading appointments...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments?.map((appointment: any) => (
                    <Card key={appointment.id} className="relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        appointment.status === 'completed' ? 'bg-green-500' :
                        appointment.status === 'scheduled' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`} />
                      <CardContent className="p-6">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold">{appointment.patientName}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                              <p className="line-clamp-2">{appointment.notes}</p>
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/patients/${appointment.patientId}`}>
                                View Patient
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/records/${appointment.id}`}>
                                View Records
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) ?? <div className="text-center p-8 text-muted-foreground">No appointments scheduled for today.</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {appointments?.filter((a: any) => a.status === 'scheduled')
                  .map((appointment: any) => (
                    <Card key={appointment.id} className="relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-blue-500`} />
                      <CardContent className="p-6">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold">{appointment.patientName}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                              <p className="line-clamp-2">{appointment.notes}</p>
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/patients/${appointment.patientId}`}>
                                View Patient
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/records/${appointment.id}`}>
                                View Records
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) ?? <div>No scheduled appointments.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {appointments?.filter((a: any) => a.status === 'completed')
                  .map((appointment: any) => (
                    <Card key={appointment.id} className="relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-green-500`} />
                      <CardContent className="p-6">
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold">{appointment.patientName}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(appointment.dateTime), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                              <p className="line-clamp-2">{appointment.notes}</p>
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/patients/${appointment.patientId}`}>
                                View Patient
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/provider/records/${appointment.id}`}>
                                View Records
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) ?? <div>No completed appointments.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}