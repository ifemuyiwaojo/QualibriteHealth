import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
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
  PlusCircle, 
  UserPlus, 
  Settings, 
  User, 
  Shield, 
  LockIcon, 
  UnlockIcon, 
  Trash2, 
  Edit, 
  AlertCircle
} from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Schema for user creation
  const createUserSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    role: z.string({ required_error: "Please select a role" }),
    isSuperadmin: z.boolean().default(false),
    requirePasswordChange: z.boolean().default(true),
    name: z.string().optional(),
    phone: z.string().optional(),
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

  // Create user form
  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
      isSuperadmin: false,
      requirePasswordChange: true,
    },
  });

  // Update user form
  const updateUserForm = useForm({
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
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create user
  const onCreateUserSubmit = async (data) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      toast({
        title: "User created",
        description: "New user has been created successfully",
      });

      setIsNewUserDialogOpen(false);
      createUserForm.reset();
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update user
  const onUpdateUserSubmit = async (data) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const responseData = await response.json();
      
      // If a temporary password was generated, show it to the admin
      if (responseData.generatedPassword) {
        toast({
          title: "Password Reset",
          description: `Temporary password: ${responseData.generatedPassword}`,
        });
      }

      toast({
        title: "User updated",
        description: "User has been updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      toast({
        title: "User deleted",
        description: "User has been deleted successfully",
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Lock/unlock user
  const handleToggleLock = async (id, action) => {
    try {
      const response = await fetch(`/api/admin/users/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} user account`);
      }

      toast({
        title: action === 'lock' ? "Account locked" : "Account unlocked",
        description: `User account has been ${action === 'lock' ? 'locked' : 'unlocked'} successfully`,
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handler for editing a user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    
    // Parse metadata to get name and phone
    let metadata = {};
    try {
      if (user.metadata && typeof user.metadata === 'string') {
        metadata = JSON.parse(user.metadata);
      } else if (user.metadata && typeof user.metadata === 'object') {
        metadata = user.metadata;
      }
    } catch (e) {
      console.error("Error parsing user metadata", e);
    }

    updateUserForm.reset({
      email: user.email,
      role: user.role,
      isSuperadmin: user.isSuperadmin || false,
      isActive: user.isActive !== false, // Default to true if not specified
      resetPassword: false,
      name: metadata.name || "",
      phone: metadata.phone || "",
    });
    
    setIsEditDialogOpen(true);
  };

  // Role options
  const roleOptions = [
    { value: "patient", label: "Patient" },
    { value: "provider", label: "Provider" },
    { value: "admin", label: "Administrator" },
    { value: "billing", label: "Billing/RCM Staff" },
    { value: "intake_coordinator", label: "Intake Coordinator" },
    { value: "it_support", label: "IT Support" },
    { value: "marketing", label: "Marketing & Outreach" },
    { value: "practice_manager", label: "Practice Manager" },
  ];

  // Format timestamp
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  // Check if user has a locked status
  const isUserLocked = (user) => {
    if (!user) return false;
    
    // Check if the user has locked metadata
    if (user.metadata) {
      try {
        const metadata = typeof user.metadata === 'string' ? 
          JSON.parse(user.metadata) : user.metadata;
        
        if (metadata.lockedUntil) {
          const lockTime = new Date(metadata.lockedUntil);
          if (lockTime > new Date()) {
            return true;
          }
        }
      } catch (e) {
        console.error("Error parsing metadata", e);
      }
    }
    
    // Check for failedLoginAttempts
    return user.failedLoginAttempts >= 5;
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
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

      {!isLoading && !error && users.length === 0 && (
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

      {!isLoading && !error && users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Email / Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  // Parse metadata for each user
                  let metadata = {};
                  try {
                    if (user.metadata && typeof user.metadata === 'string') {
                      metadata = JSON.parse(user.metadata);
                    } else if (user.metadata && typeof user.metadata === 'object') {
                      metadata = user.metadata;
                    }
                  } catch (e) {
                    console.error("Error parsing user metadata", e);
                  }

                  const userLocked = isUserLocked(user);
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{user.email}</div>
                          {metadata.name && (
                            <div className="text-sm text-muted-foreground">{metadata.name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.isSuperadmin ? (
                            <Badge variant="default" className="bg-purple-500">Superadmin</Badge>
                          ) : (
                            <Badge variant="outline">
                              {roleOptions.find(r => r.value === user.role)?.label || user.role}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {userLocked ? (
                          <Badge variant="destructive" className="flex items-center">
                            <LockIcon className="w-3 h-3 mr-1" /> Locked
                          </Badge>
                        ) : user.isActive !== false ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {user.id !== (user?.id || 0) && (
                            <>
                              {userLocked ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleLock(user.id, 'unlock')}
                                  title="Unlock account"
                                >
                                  <UnlockIcon className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleLock(user.id, 'lock')}
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
                                      onClick={() => handleDeleteUser(user.id)}
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
                  );
                })}
              </TableBody>
            </Table>
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
                  className="w-full"
                >
                  Create User
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
                        <Input placeholder="John Doe" {...field} />
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
                        <Input placeholder="(555) 123-4567" {...field} />
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
                  className="w-full"
                >
                  Update User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}