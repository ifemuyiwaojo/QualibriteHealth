import { useAuth } from "@/lib/auth";
import { VSeeVideo } from "@/components/VSeeVideo";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function TelehealthPage() {
  const { user } = useAuth();
  const { toast } = useToast();
    const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch active session if exists
  const { data: activeSession } = useQuery({
    queryKey: ['/api/telehealth/active-session'],
    enabled: !!user,
  });

  const startSession = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/telehealth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          role: user.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      toast({
        title: "Success",
        description: "Video session started successfully",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start video session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const currentSessionId = sessionId || activeSession?.sessionId;

  return (
    <div className="container py-10">
       <Button
        variant="outline"
        className="mb-4"
        onClick={() => setLocation("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold mb-8">Video Visit</h1>

      {currentSessionId ? (
        <VSeeVideo 
          sessionId={currentSessionId} 
          isProvider={user.role === 'provider'} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Start Video Session</h2>
          <Button 
            onClick={startSession} 
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              user.role === 'provider' ? 'Start Session' : 'Join Session'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}