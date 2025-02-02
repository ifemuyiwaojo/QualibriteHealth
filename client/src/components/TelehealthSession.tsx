import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';

interface TelehealthSessionProps {
  sessionId?: string;
  isProvider?: boolean;
}

export const TelehealthSession: React.FC<TelehealthSessionProps> = ({
  sessionId,
  isProvider = false,
}) => {
  const { toast } = useToast();

  const { data: session, isLoading } = useQuery({
    queryKey: ['telehealth-session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await fetch(`/api/telehealth/session/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch session');
      return response.json();
    },
    enabled: !!sessionId,
  });

  const joinSession = async () => {
    if (!session?.session?.joinUrl) {
      toast({
        title: 'Error',
        description: 'Session URL not available',
        variant: 'destructive',
      });
      return;
    }
    
    // Open VSee session in a new window
    window.open(
      isProvider ? session.session.hostUrl : session.session.joinUrl,
      '_blank',
      'width=1280,height=720'
    );
  };

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Telehealth Session</h2>
      {session?.session ? (
        <div className="space-y-4">
          <p>Session ID: {session.session.id}</p>
          <p>Status: {session.session.status}</p>
          <Button onClick={joinSession}>
            {isProvider ? 'Start Session' : 'Join Session'}
          </Button>
        </div>
      ) : (
        <p>No session available</p>
      )}
    </Card>
  );
};
