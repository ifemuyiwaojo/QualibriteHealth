import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCog, 
  Settings, 
  ActivitySquare, 
  Shield, 
  FileText,
  AlertTriangle,
  UserPlus,
  ArrowLeft,
  Search
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || user.role !== "admin") {
    return null;
  }

  const dashboardItems = [
    {
      title: "User Management",
      icon: Users,
      link: "/admin/users",
      description: "Manage user accounts, roles, and permissions"
    },
    {
      title: "Provider Management",
      icon: UserCog,
      link: "/admin/providers",
      description: "Manage healthcare providers and their credentials"
    },
    {
      title: "Audit Logs",
      icon: ActivitySquare,
      link: "/admin/audit-logs",
      description: "View detailed system activity and security logs"
    },
    {
      title: "System Settings",
      icon: Settings,
      link: "/admin/settings",
      description: "Configure system-wide settings and security policies"
    },
    {
      title: "Compliance Reports",
      icon: FileText,
      link: "/admin/compliance",
      description: "Generate and view HIPAA compliance reports"
    },
    {
      title: "Security Center",
      icon: Shield,
      link: "/admin/security",
      description: "Monitor security alerts and system health"
    }
  ];

  if (user.isSuperadmin) {
    dashboardItems.unshift({
      title: "Admin Management",
      icon: UserPlus,
      link: "/admin/users",
      description: "Create and manage admin accounts"
    });
  }

  const filteredItems = dashboardItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search dashboard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 max-w-sm"
            />
          </div>
          <Button variant="destructive" size="sm" asChild className="gap-2">
            <Link href="/admin/security">
              <AlertTriangle className="h-4 w-4" />
              Emergency Access
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={item.link}>Access {item.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}