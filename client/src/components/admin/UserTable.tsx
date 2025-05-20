import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  LockIcon,
  UnlockIcon,
  ShieldAlert,
  Key,
  Check,
  X,
} from "lucide-react";
import UserSecurityActions from "@/components/admin/UserSecurityActions";

type User = {
  id: number;
  email: string;
  role: string;
  isSuperadmin?: boolean;
  accountLocked?: boolean;
  failedLoginAttempts?: number;
  mfaEnabled?: boolean;
  tempPassword?: boolean;
  changePasswordRequired?: boolean;
};

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onToggleLock: (userId: number, isLocked: boolean) => void;
  currentUserId: number;
};

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleLock,
  currentUserId
}: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Security Info</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>
                <div>
                  {user.email}
                  {user.isSuperadmin && (
                    <Badge variant="secondary" className="ml-2">
                      Superadmin
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.accountLocked ? (
                  <Badge variant="destructive" className="flex gap-1 items-center">
                    <LockIcon className="h-3 w-3" />
                    Locked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex gap-1 items-center text-green-600 border-green-600">
                    <UnlockIcon className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <span>MFA:</span>
                    {user.mfaEnabled ? (
                      <Badge variant="default" className="bg-green-600">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Password:</span>
                    {user.changePasswordRequired ? (
                      <Badge variant="destructive">
                        Temporary
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Permanent
                      </Badge>
                    )}
                  </div>
                  {(user.failedLoginAttempts && user.failedLoginAttempts > 0) && (
                    <div className="flex items-center gap-1">
                      <span>Failed attempts:</span>
                      <Badge variant="secondary">
                        {user.failedLoginAttempts}
                      </Badge>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <UserSecurityActions 
                    userId={user.id} 
                    email={user.email}
                    isLocked={user.accountLocked}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  
                  {/* Don't allow deleting yourself */}
                  {user.id !== currentUserId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="text-destructive border-destructive hover:bg-destructive/10 text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
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