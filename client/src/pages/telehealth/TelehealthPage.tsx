import { useAuth } from "@/lib/auth";
import { VSeeVideo } from "@/components/VSeeVideo";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TelehealthPage() {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch active session if exists
  const { data: activeSession } = useQuery({
    queryKey: ['/api/telehealth/active-session'],
    enabled: !!user,
  });

  const startSession = async () => {
    try {
      const response = await fetch('/api/telehealth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          role: user?.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  if (!user) {
    return null;
  }

  const currentSessionId = sessionId || activeSession?.sessionId;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Video Visit</h1>

      {currentSessionId ? (
        <VSeeVideo 
          sessionId={currentSessionId} 
          isProvider={user.role === 'provider'} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Start Video Session</h2>
          <Button onClick={startSession}>
            {user.role === 'provider' ? 'Start Session' : 'Join Session'}
          </Button>
        </div>
      )}
    </div>
  );
}