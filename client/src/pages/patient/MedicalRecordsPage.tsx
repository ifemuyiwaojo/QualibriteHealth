import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownToLine, Calendar, Download, Filter, FileText, Share2, Clock, 
  ArrowUpDown, ChevronDown, Search, FileBarChart, FileSpreadsheet
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// This will be replaced with actual API calls when EHR is integrated
const useMockMedicalRecords = (userId: number) => {
  return useQuery({
    queryKey: [`/api/patient/${userId}/medical-records`],
    queryFn: async () => {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        records: [
          {
            id: 101,
            date: "2025-05-01T10:15:00Z",
            type: "progress_note",
            provider: "Dr. Sarah Wilson",
            summary: "Monthly follow-up for anxiety management. Patient reports improved symptoms with current medication.",
            content: {
              assessment: "Generalized anxiety disorder, moderate, improving",
              plan: "Continue current medication. Follow up in 1 month"
            }
          },
          {
            id: 102,
            date: "2025-04-15T14:30:00Z",
            type: "prescription",
            provider: "Dr. Sarah Wilson",
            summary: "Adjusted Buspirone dosage to 15mg twice daily.",
            content: {
              medication: "Buspirone",
              dosage: "15mg",
              instructions: "Take twice daily with food",
              quantity: "60 tablets",
              refills: 3
            }
          },
          {
            id: 103,
            date: "2025-04-01T09:00:00Z",
            type: "lab_result",
            provider: "Dr. James Roberts",
            summary: "Complete blood count within normal limits.",
            content: {
              test: "Complete Blood Count",
              result: "Normal",
              notes: "All values within reference range"
            }
          },
          {
            id: 104,
            date: "2025-03-15T13:45:00Z",
            type: "diagnosis",
            provider: "Dr. Sarah Wilson",
            summary: "Initial diagnosis of Generalized Anxiety Disorder (GAD) and Major Depressive Disorder (MDD), mild.",
            content: {
              primaryDiagnosis: "Generalized Anxiety Disorder (F41.1)",
              secondaryDiagnosis: "Major Depressive Disorder, single episode, mild (F32.0)",
              assessmentDetails: "Patient meets DSM-5 criteria for both GAD and MDD based on reported symptoms and clinical assessment."
            }
          },
          {
            id: 105,
            date: "2025-03-01T10:30:00Z",
            type: "prescription",
            provider: "Dr. Sarah Wilson",
            summary: "Initial prescription for Escitalopram 10mg daily.",
            content: {
              medication: "Escitalopram",
              dosage: "10mg",
              instructions: "Take once daily in the morning",
              quantity: "30 tablets",
              refills: 2
            }
          }
        ]
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  });
};

const getRecordTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    "progress_note": "Progress Note",
    "prescription": "Prescription",
    "lab_result": "Lab Result",
    "diagnosis": "Diagnosis"
  };
  
  return types[type] || type;
};

const getRecordTypeIcon = (type: string) => {
  switch (type) {
    case "progress_note":
      return <FileText className="h-4 w-4" />;
    case "prescription":
      return <FileSpreadsheet className="h-4 w-4" />;
    case "lab_result":
      return <FileBarChart className="h-4 w-4" />;
    case "diagnosis":
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [recordType, setRecordType] = useState<string>("all");
  const [recordView, setRecordView] = useState("list");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  
  if (!user) {
    return null;
  }
  
  // This will be replaced with actual API integration
  const { data, isLoading } = useMockMedicalRecords(user.id);
  
  const filteredRecords = data?.records
    ? data.records.filter(record => {
        const matchesType = recordType === "all" || record.type === recordType;
        const matchesSearch = !searchTerm || 
          record.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
          record.summary.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      })
    : [];
  
  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
  };
  
  const handleDownloadRecord = (record: any) => {
    // This will be replaced with actual download functionality when EHR is integrated
    toast({
      title: "Record Downloaded",
      description: `${getRecordTypeLabel(record.type)} from ${formatDate(record.date)} has been downloaded.`,
    });
  };
  
  const handleShareRecord = (record: any) => {
    setSelectedRecord(record);
    setOpenShareDialog(true);
  };
  
  const handleShareSubmit = () => {
    // This will be replaced with actual sharing functionality when EHR is integrated
    toast({
      title: "Record Shared",
      description: "Your medical record has been securely shared.",
    });
    setOpenShareDialog(false);
  };
  
  const renderRecordDetails = (record: any) => {
    if (!record) return null;
    
    const { type, content } = record;
    
    switch (type) {
      case "progress_note":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Assessment</h4>
              <p className="mt-1">{content.assessment}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Plan</h4>
              <p className="mt-1">{content.plan}</p>
            </div>
          </div>
        );
      case "prescription":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Medication</h4>
                <p className="mt-1">{content.medication}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Dosage</h4>
                <p className="mt-1">{content.dosage}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium">Instructions</h4>
              <p className="mt-1">{content.instructions}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Quantity</h4>
                <p className="mt-1">{content.quantity}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Refills</h4>
                <p className="mt-1">{content.refills}</p>
              </div>
            </div>
          </div>
        );
      case "lab_result":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Test</h4>
              <p className="mt-1">{content.test}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Result</h4>
              <p className="mt-1">{content.result}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Notes</h4>
              <p className="mt-1">{content.notes}</p>
            </div>
          </div>
        );
      case "diagnosis":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Primary Diagnosis</h4>
              <p className="mt-1">{content.primaryDiagnosis}</p>
            </div>
            {content.secondaryDiagnosis && (
              <div>
                <h4 className="text-sm font-medium">Secondary Diagnosis</h4>
                <p className="mt-1">{content.secondaryDiagnosis}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium">Assessment Details</h4>
              <p className="mt-1">{content.assessmentDetails}</p>
            </div>
          </div>
        );
      default:
        return <p>No details available</p>;
    }
  };
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">Access, view, and share your medical information</p>
        </div>
      </div>
      
      <Tabs defaultValue="records" className="space-y-6">
        <TabsList>
          <TabsTrigger value="records">All Records</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>View your complete medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="w-full md:w-1/2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10 w-full"
                    placeholder="Search by provider or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Select
                    value={recordType}
                    onValueChange={setRecordType}
                  >
                    <SelectTrigger className="w-[160px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Record Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="progress_note">Progress Notes</SelectItem>
                      <SelectItem value="prescription">Prescriptions</SelectItem>
                      <SelectItem value="lab_result">Lab Results</SelectItem>
                      <SelectItem value="diagnosis">Diagnoses</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-1">
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        Sort
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Newest First</DropdownMenuItem>
                      <DropdownMenuItem>Oldest First</DropdownMenuItem>
                      <DropdownMenuItem>By Type</DropdownMenuItem>
                      <DropdownMenuItem>By Provider</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex border rounded-md">
                    <Button
                      variant={recordView === "list" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => setRecordView("list")}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant={recordView === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setRecordView("grid")}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 py-4 border-b last:border-0">
                      <div className="h-10 w-10 rounded-full bg-muted"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recordView === "list" ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="whitespace-nowrap">
                              {formatDate(record.date)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getRecordTypeIcon(record.type)}
                                <span>{getRecordTypeLabel(record.type)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{record.provider}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {record.summary}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewRecord(record)}>
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadRecord(record)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleShareRecord(record)}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No medical records found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <Card key={record.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="font-normal">
                              {getRecordTypeLabel(record.type)}
                            </Badge>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(record.date)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <h3 className="font-medium truncate">{record.summary}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Provider: {record.provider}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>
                            View Details
                          </Button>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleDownloadRecord(record)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShareRecord(record)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                      No medical records found matching your criteria.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <ArrowDownToLine className="h-4 w-4" />
                Download All Records
              </Button>
              <div className="text-sm text-muted-foreground">
                {filteredRecords.length} records found
              </div>
            </CardFooter>
          </Card>
          
          {/* Record details dialog */}
          {selectedRecord && (
            <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getRecordTypeIcon(selectedRecord.type)}
                    {getRecordTypeLabel(selectedRecord.type)}
                  </DialogTitle>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(selectedRecord.date)} • {selectedRecord.provider}
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Summary</h3>
                    <p className="mt-1">{selectedRecord.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Details</h3>
                    {renderRecordDetails(selectedRecord)}
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between items-center gap-4 sm:gap-0">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleDownloadRecord(selectedRecord)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => handleShareRecord(selectedRecord)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedRecord(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Share dialog */}
          <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Medical Record</DialogTitle>
                <DialogDescription>
                  Share this record securely with healthcare providers or family members.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Record Type</h4>
                  <p>{selectedRecord && getRecordTypeLabel(selectedRecord.type)}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Date</h4>
                  <p>{selectedRecord && formatDate(selectedRecord.date)}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recipient's Email</h4>
                  <Input placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Message (Optional)</h4>
                  <Input placeholder="Add a message for the recipient" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenShareDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShareSubmit}>
                  Share Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="lab-results">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
              <CardDescription>View your lab test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Lab results will be available when integrated with the external EHR system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
              <CardDescription>View your current and past medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Medication history will be available when integrated with the external EHR system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Access your medical documents and forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Documents will be available when integrated with the external EHR system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}