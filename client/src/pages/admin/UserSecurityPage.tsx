import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation, useRoute } from 'wouter';
import UserSecurityDetails from '@/components/admin/UserSecurityDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserSecurityPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/user-security/:userId');
  const { toast } = useToast();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (params && params.userId) {
      const id = parseInt(params.userId, 10);
      if (!isNaN(id)) {
        setUserId(id);
      } else {
        toast({
          title: "Invalid user ID",
          description: "The provided user ID is not valid.",
          variant: "destructive",
        });
        setLocation('/admin/users');
      }
    }
  }, [params, setLocation, toast]);

  // If user is not authenticated or not an admin, redirect to login
  if (!user || (user.role !== 'admin' && !user.isSuperadmin)) {
    setLocation('/auth');
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          User Security Details
        </h1>
        <Button
          variant="outline"
          onClick={() => setLocation('/admin/users')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </div>

      {userId ? (
        <UserSecurityDetails userId={userId} />
      ) : (
        <div className="p-8 text-center">
          <p>Loading user security details...</p>
        </div>
      )}
    </div>
  );
}