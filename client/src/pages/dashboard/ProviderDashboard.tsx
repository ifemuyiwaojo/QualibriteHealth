import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ClipboardList, User, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user || user.role !== "provider") {
    return null;
  }

  const dashboardItems = [
    {
      title: "Today's Schedule",
      icon: Calendar,
      link: "/schedule",
      description: "View and manage your appointments"
    },
    {
      title: "Patient List",
      icon: Users,
      link: "/patients",
      description: "Access your patient records"
    },
    {
      title: "Medical Records",
      icon: ClipboardList,
      link: "/records",
      description: "View and update medical records"
    },
    {
      title: "Profile",
      icon: User,
      link: "/profile",
      description: "Manage your provider profile"
    }
  ];

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

      <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search dashboard..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={item.link}>View {item.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}