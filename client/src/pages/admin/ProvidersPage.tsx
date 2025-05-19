import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog, Mail, Phone, Plus } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Provider {
  id: number;
  email: string;
  role: string;
  isSuperadmin: boolean;
  name?: string;
  phone?: string;
  createdAt: string;
}

export default function ProvidersPage() {
  const { user } = useAuth();
  const [isAddingProvider, setIsAddingProvider] = useState(false);

  // Fetch provider users by passing role param to the users API
  const { data: providers, isLoading, error } = useQuery<Provider[]>({
    queryKey: ['/api/admin/users', { role: 'provider' }],
    queryFn: async ({ queryKey }) => {
      // Add credentials to ensure the auth cookie is sent
      const res = await fetch('/api/admin/users?role=provider', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Provider fetch error:", errorData);
        throw new Error(errorData.message || 'Failed to fetch providers');
      }
      
      return res.json();
    }
  });

  if (!user || (user.role !== "admin" && !user.isSuperadmin)) {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Provider Management</h1>
        </div>
        <Button onClick={() => setIsAddingProvider(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Healthcare Providers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">
              Error loading providers. Please try again.
            </div>
          ) : providers && providers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">
                      {provider.name || "No name provided"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {provider.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {provider.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {provider.phone}
                        </div>
                      ) : (
                        "No phone provided"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <UserCog className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No providers found. Add your first provider using the button above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}