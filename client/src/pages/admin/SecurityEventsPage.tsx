import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Shield, AlertTriangle, Filter, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { DatePicker } from "@/components/ui/date-picker";

// Type definitions for security events
type SecurityEvent = {
  id: number;
  eventType: string;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  userId: number;
  targetUserId?: number;
  resourceType?: string;
  resourceId?: string;
  timestamp: string;
  ipAddress?: string;
  outcome?: "success" | "failure" | "denied" | "warning";
};

type SecurityEventFilter = {
  severity?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: number;
  resourceType?: string;
};

export default function SecurityEventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState<SecurityEventFilter>({});
  
  // Get security events with optional filtering
  const { 
    data: securityEvents, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['/api/admin/security-events', filters],
    enabled: user?.role === "admin" || user?.isSuperadmin
  });

  // Helper for severity badge styling
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'HIGH': return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case 'MEDIUM': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'LOW': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Helper for outcome badge styling
  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'success': return "bg-green-100 text-green-800";
      case 'failure': return "bg-red-100 text-red-800";
      case 'denied': return "bg-orange-100 text-orange-800";
      case 'warning': return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format timestamp to readable date/time
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Export events as CSV
  const exportEvents = () => {
    if (!securityEvents || securityEvents.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no security events matching your criteria.",
        variant: "destructive"
      });
      return;
    }

    // Create CSV content
    const headers = ["ID", "Event Type", "Severity", "Message", "User ID", "Resource Type", "Resource ID", "Timestamp", "IP Address", "Outcome"];
    const csvContent = [
      headers.join(","),
      ...securityEvents.map(event => [
        event.id,
        event.eventType,
        event.severity,
        `"${event.message.replace(/"/g, '""')}"`, // Escape quotes in message
        event.userId,
        event.resourceType || "",
        event.resourceId || "",
        event.timestamp,
        event.ipAddress || "",
        event.outcome || ""
      ].join(","))
    ].join("\n");

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `security-events-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle filter changes
  const updateFilter = (key: keyof SecurityEventFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/admin/security-center">
                <Shield className="h-4 w-4" />
                Security Center
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Security Event Logs</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportEvents} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Severity</label>
              <Select
                value={filters.severity}
                onValueChange={(value) => updateFilter('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All severities</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Event Type</label>
              <Select
                value={filters.eventType}
                onValueChange={(value) => updateFilter('eventType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All event types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All event types</SelectItem>
                  <SelectItem value="LOGIN_SUCCESS">Login Success</SelectItem>
                  <SelectItem value="LOGIN_FAILURE">Login Failure</SelectItem>
                  <SelectItem value="PASSWORD_CHANGE">Password Change</SelectItem>
                  <SelectItem value="ACCESS_DENIED">Access Denied</SelectItem>
                  <SelectItem value="PHI_ACCESS">PHI Access</SelectItem>
                  <SelectItem value="SUSPICIOUS_ACTIVITY">Suspicious Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <DatePicker
                selected={filters.startDate}
                onSelect={(date) => updateFilter('startDate', date)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <DatePicker
                selected={filters.endDate}
                onSelect={(date) => updateFilter('endDate', date)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">User ID</label>
              <Input
                value={filters.userId || ''}
                onChange={(e) => updateFilter('userId', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Filter by user ID"
                type="number"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={() => setFilters({})}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !securityEvents || securityEvents.length === 0 ? (
            <div className="py-8 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-4" />
              <h3 className="font-medium text-lg">No security events found</h3>
              <p className="text-muted-foreground">Try changing the filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="w-[300px]">Message</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap">
                        {event.eventType}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {event.message}
                      </TableCell>
                      <TableCell>
                        {event.userId}
                        {event.targetUserId && (
                          <span className="text-xs text-muted-foreground ml-1">
                            → {event.targetUserId}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.resourceType && (
                          <span className="text-xs font-medium">
                            {event.resourceType}
                            {event.resourceId && <span>:{event.resourceId}</span>}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(event.timestamp)}
                      </TableCell>
                      <TableCell>
                        {event.outcome && (
                          <Badge variant="outline" className={getOutcomeColor(event.outcome)}>
                            {event.outcome}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}