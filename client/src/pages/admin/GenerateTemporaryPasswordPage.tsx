import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Copy, AlertCircle, Check, Info, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  requiresPasswordChange: boolean;
}

export default function GenerateTemporaryPasswordPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState<boolean>(true);
  const [requireChange, setRequireChange] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  // Get patients for admin to select
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users", { role: "patient" }],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/users?role=patient");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!user && (user.role === "admin" || user.isSuperadmin),
  });

  // Filter users based on search
  const filteredUsers = users?.filter(user => 
    !searchEmail || user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  // Generate and set temporary password
  const generatePasswordMutation = useMutation({
    mutationFn: async (data: {
      userId: number;
      email: string;
      passwordOptions: {
        length: number;
        includeUppercase: boolean;
        includeLowercase: boolean;
        includeNumbers: boolean;
        includeSpecialChars: boolean;
        requireChange: boolean;
      };
    }) => {
      const res = await apiRequest("POST", "/api/admin/generate-temp-password", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate temporary password");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedPassword(data.temporaryPassword);
      setShowSuccessMessage(true);
      toast({
        title: "Password Generated",
        description: "Temporary password has been generated successfully.",
      });
      
      // Invalidate user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "Copied!",
      description: "Temporary password copied to clipboard.",
    });
  };

  const handleGeneratePassword = () => {
    if (!selectedUserId || !selectedUserEmail) {
      toast({
        title: "Error",
        description: "Please select a user first.",
        variant: "destructive",
      });
      return;
    }

    generatePasswordMutation.mutate({
      userId: selectedUserId,
      email: selectedUserEmail,
      passwordOptions: {
        length: passwordLength,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSpecialChars,
        requireChange,
      },
    });
  };

  const handleSelectUser = (user: User) => {
    setSelectedUserId(user.id);
    setSelectedUserEmail(user.email);
  };

  if (!user || (user.role !== "admin" && !user.isSuperadmin)) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Generate Temporary Passwords</h1>
      <p className="text-muted-foreground mb-8">
        Create temporary passwords for patient accounts. These passwords can be configured to require a change on first login.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
            <CardDescription>
              Choose a patient account to generate a temporary password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-email">Search by Email</Label>
                <Input
                  id="search-email"
                  placeholder="Enter email to search"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>

              <div className="border rounded-md overflow-hidden">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className={selectedUserId === user.id ? "bg-muted/50" : ""}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.requiresPasswordChange ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                Password Change Required
                              </Badge>
                            ) : user.lastLoginAt ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                Never Logged In
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSelectUser(user)}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchEmail ? "No matching users found" : "No patient users available"}
                  </div>
                )}
              </div>

              {selectedUserId && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Selected Patient</AlertTitle>
                  <AlertDescription>
                    {selectedUserEmail}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Password Options</CardTitle>
            <CardDescription>
              Configure the temporary password settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password-length">Password Length</Label>
                <Select 
                  value={passwordLength.toString()} 
                  onValueChange={(value) => setPasswordLength(parseInt(value))}
                >
                  <SelectTrigger id="password-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 characters</SelectItem>
                    <SelectItem value="10">10 characters</SelectItem>
                    <SelectItem value="12">12 characters</SelectItem>
                    <SelectItem value="16">16 characters</SelectItem>
                    <SelectItem value="20">20 characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Character Types</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-uppercase" 
                    checked={includeUppercase} 
                    onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                  />
                  <Label htmlFor="include-uppercase" className="cursor-pointer">
                    Include uppercase letters (A-Z)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-lowercase" 
                    checked={includeLowercase} 
                    onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                  />
                  <Label htmlFor="include-lowercase" className="cursor-pointer">
                    Include lowercase letters (a-z)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-numbers" 
                    checked={includeNumbers} 
                    onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                  />
                  <Label htmlFor="include-numbers" className="cursor-pointer">
                    Include numbers (0-9)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-special" 
                    checked={includeSpecialChars} 
                    onCheckedChange={(checked) => setIncludeSpecialChars(checked as boolean)}
                  />
                  <Label htmlFor="include-special" className="cursor-pointer">
                    Include special characters (!@#$%^&*)
                  </Label>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="require-change" 
                    checked={requireChange} 
                    onCheckedChange={(checked) => setRequireChange(checked as boolean)}
                  />
                  <Label htmlFor="require-change" className="cursor-pointer">
                    Require password change on first login
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGeneratePassword} 
              disabled={!selectedUserId || generatePasswordMutation.isPending}
              className="w-full"
            >
              {generatePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Temporary Password"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {showSuccessMessage && generatedPassword && (
        <Card className="mt-6">
          <CardHeader className="bg-green-50">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle>Temporary Password Generated</CardTitle>
            </div>
            <CardDescription>
              {requireChange ? 
                "The user will be required to change this password on first login." :
                "This temporary password has been set for the selected user."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-muted p-4 rounded-md flex justify-between items-center">
              <code className="text-lg font-mono">{generatedPassword}</code>
              <Button variant="outline" size="sm" onClick={handleCopyPassword}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Make sure to securely communicate this password to the patient. 
              This password will not be displayed again once you leave this page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}