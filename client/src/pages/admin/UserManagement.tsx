import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, UserPlus, UserCog, Users } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  PlusCircle, 
  UserPlus, 
  Settings, 
  User, 
  Shield, 
  LockIcon, 
  UnlockIcon, 
  Trash2, 
  Edit, 
  Check, 
  X,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the user type
interface UserData {
  id: number;
  email: string;
  role: string;
  isSuperadmin: boolean;
  isActive: boolean;
  createdAt: string;
  lockedUntil?: string | null;
  failedLoginAttempts?: number;
  lastLogin?: string | null;
  metadata?: {
    name?: string;
    phone?: string;
  };
}

// Schema for user creation
const createUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  role: z.string({ required_error: "Please select a role" }),
  isSuperadmin: z.boolean().default(false),
  requirePasswordChange: z.boolean().default(true),
  name: z.string().optional(),
  phone: z.string().optional(),
  skipEmailVerification: z.boolean().default(false),
});

// Schema for user update
const updateUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string({ required_error: "Please select a role" }),
  isSuperadmin: z.boolean().default(false),
  isActive: z.boolean().default(true),
  resetPassword: z.boolean().default(false),
  name: z.string().optional(),
  phone: z.string().optional(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Create user form
  const createUserForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
      isSuperadmin: false,
      requirePasswordChange: true,
      skipEmailVerification: false,
    },
  });

  // Update user form
  const updateUserForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      role: "patient",
      isSuperadmin: false,
      isActive: true,
      resetPassword: false,
    },
  });

  // Fetch users
  const { data: users, isLoading, error, refetch } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isSuperadmin || user?.role === "admin",
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserFormValues) => {
      const res = await apiRequest("POST", "/api/admin/users", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsNewUserDialogOpen(false);
      createUserForm.reset();
      toast({
        title: "User created",
        description: "New user has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserFormValues & { id: number }) => {
      const { id, ...userData } = data;
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, userData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "User updated",
        description: "User has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User deleted",
        description: "User has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Lock/unlock user account mutation
  const toggleLockUserMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'lock' | 'unlock' }) => {
      const res = await apiRequest("POST", `/api/admin/users/${id}/${action}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${action} user account`);
      }
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: variables.action === 'lock' ? "Account locked" : "Account unlocked",
        description: `User account has been ${variables.action === 'lock' ? 'locked' : 'unlocked'} successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for opening edit dialog
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    updateUserForm.reset({
      email: user.email,
      role: user.role,
      isSuperadmin: user.isSuperadmin,
      isActive: user.isActive,
      resetPassword: false,
      name: user.metadata?.name || "",
      phone: user.metadata?.phone || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle form submissions
  const onCreateUserSubmit = (data: CreateUserFormValues) => {
    createUserMutation.mutate(data);
  };

  const onUpdateUserSubmit = (data: UpdateUserFormValues) => {
    if (selectedUser) {
      updateUserMutation.mutate({ ...data, id: selectedUser.id });
    }
  };

  // Handle deleting a user
  const handleDeleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  // Handle locking/unlocking a user account
  const handleToggleLockUser = (id: number, action: 'lock' | 'unlock') => {
    toggleLockUserMutation.mutate({ id, action });
  };

  // Role options
  const roleOptions = [
    { value: "patient", label: "Patient" },
    { value: "provider", label: "Provider" },
    { value: "admin", label: "Administrator" },
    { value: "billing", label: "Billing/RCM Staff" },
    { value: "intake", label: "Intake Coordinator" },
    { value: "it_support", label: "IT Support" },
    { value: "marketing", label: "Marketing & Outreach" },
    { value: "practice_manager", label: "Practice Manager" },
  ];

  // Format timestamp
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  // If user is not a superadmin or admin, redirect or show access denied
  if (user && !user.isSuperadmin && user.role !== "admin") {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
              <p className="text-center">
                You do not have permission to access this page. This area is restricted to administrators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsNewUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading users. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {users && users.length > 0 && (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="admins">Administrators</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <UserTable 
              users={users} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
              onToggleLock={handleToggleLockUser}
              currentUserId={user?.id || 0}
            />
          </TabsContent>

          <TabsContent value="staff">
            <UserTable 
              users={users.filter(u => ["billing", "intake", "it_support", "marketing", "practice_manager"].includes(u.role))} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
              onToggleLock={handleToggleLockUser}
              currentUserId={user?.id || 0}
            />
          </TabsContent>

          <TabsContent value="providers">
            <UserTable 
              users={users.filter(u => u.role === "provider")} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
              onToggleLock={handleToggleLockUser}
              currentUserId={user?.id || 0}
            />
          </TabsContent>

          <TabsContent value="patients">
            <UserTable 
              users={users.filter(u => u.role === "patient")} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
              onToggleLock={handleToggleLockUser}
              currentUserId={user?.id || 0}
            />
          </TabsContent>

          <TabsContent value="admins">
            <UserTable 
              users={users.filter(u => u.role === "admin" || u.isSuperadmin)} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
              onToggleLock={handleToggleLockUser}
              currentUserId={user?.id || 0}
            />
          </TabsContent>
        </Tabs>
      )}

      {users && users.length === 0 && (
        <Card>
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-center">No users found.</p>
            <Button onClick={() => setIsNewUserDialogOpen(true)} variant="outline" className="mt-4">
              <UserPlus className="mr-2 h-4 w-4" />
              Add your first user
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. They will receive login credentials.
            </DialogDescription>
          </DialogHeader>

          <Form {...createUserForm}>
            <form onSubmit={createUserForm.handleSubmit(onCreateUserSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createUserForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createUserForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={createUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-4">
                <FormField
                  control={createUserForm.control}
                  name="requirePasswordChange"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Require password change on first login
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {user?.isSuperadmin && (
                  <FormField
                    control={createUserForm.control}
                    name="isSuperadmin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Grant superadmin privileges
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending}
                  className="w-full"
                >
                  {createUserMutation.isPending ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                      Creating...
                    </span>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>

          <Form {...updateUserForm}>
            <form onSubmit={updateUserForm.handleSubmit(onUpdateUserSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateUserForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateUserForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateUserForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-4">
                <FormField
                  control={updateUserForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Account active
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateUserForm.control}
                  name="resetPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Reset password
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {user?.isSuperadmin && (
                  <FormField
                    control={updateUserForm.control}
                    name="isSuperadmin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Superadmin privileges
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={updateUserMutation.isPending}
                  className="w-full"
                >
                  {updateUserMutation.isPending ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                      Updating...
                    </span>
                  ) : (
                    "Update User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// User table component
function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleLock,
  currentUserId
}: { 
  users: UserData[]; 
  onEdit: (user: UserData) => void; 
  onDelete: (id: number) => void;
  onToggleLock: (id: number, action: 'lock' | 'unlock') => void;
  currentUserId: number;
}) {
  const roleLabels: Record<string, string> = {
    patient: "Patient",
    provider: "Provider",
    admin: "Administrator",
    billing: "Billing/RCM Staff",
    intake: "Intake Coordinator",
    it_support: "IT Support",
    marketing: "Marketing & Outreach",
    practice_manager: "Practice Manager",
  };

  // Format timestamp
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Email / Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{user.email}</div>
                  {user.metadata?.name && (
                    <div className="text-sm text-muted-foreground">{user.metadata.name}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {user.isSuperadmin ? (
                    <Badge variant="default" className="bg-purple-500">Superadmin</Badge>
                  ) : (
                    <Badge variant="outline">{roleLabels[user.role] || user.role}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {user.lockedUntil ? (
                  <Badge variant="destructive" className="flex items-center">
                    <LockIcon className="w-3 h-3 mr-1" /> Locked
                  </Badge>
                ) : user.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Inactive</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">{formatDate(user.lastLogin)}</div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    title="Edit user"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {user.id !== currentUserId && (
                    <>
                      {user.lockedUntil ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleLock(user.id, 'unlock')}
                          title="Unlock account"
                        >
                          <UnlockIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleLock(user.id, 'lock')}
                          title="Lock account"
                        >
                          <LockIcon className="h-4 w-4" />
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the user account for {user.email}.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}