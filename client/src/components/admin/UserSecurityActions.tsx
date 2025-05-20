import { Button } from "@/components/ui/button";
import { Shield, Key, LockOpen } from "lucide-react";
import { useLocation } from "wouter";

type UserSecurityActionsProps = {
  userId: number;
  email: string;
  isLocked?: boolean;
};

export default function UserSecurityActions({ userId, email, isLocked }: UserSecurityActionsProps) {
  const [, setLocation] = useLocation();
  
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5"
        onClick={() => setLocation(`/admin/user-security/${userId}`)}
      >
        <Shield className="w-3.5 h-3.5" />
        View Security
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        className="text-xs flex items-center gap-1.5"
        onClick={() => setLocation(`/admin/generate-temp-password?userId=${userId}&email=${encodeURIComponent(email)}`)}
      >
        <Key className="w-3.5 h-3.5" />
        Temp Password
      </Button>
      
      {isLocked && (
        <Button 
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1.5 text-amber-500 border-amber-500 hover:bg-amber-500/10"
          onClick={() => setLocation(`/admin/account-unlock?userId=${userId}&email=${encodeURIComponent(email)}`)}
        >
          <LockOpen className="w-3.5 h-3.5" />
          Unlock Account
        </Button>
      )}
    </div>
  );
}