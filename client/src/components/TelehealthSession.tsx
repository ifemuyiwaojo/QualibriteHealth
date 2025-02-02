import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface TelehealthSessionProps {
  sessionId?: string;
  isProvider?: boolean;
}

export const TelehealthSession: React.FC<TelehealthSessionProps> = ({
  sessionId,
  isProvider = false,
}) => {
  const { toast } = useToast();

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['telehealth-session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await fetch(`/api/telehealth/session/${sessionId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch session');
      }
      return response.json();
    },
    enabled: !!sessionId,
  });

  const { data: upcomingSessions } = useQuery({
    queryKey: ['telehealth-sessions-upcoming'],
    queryFn: async () => {
      const response = await fetch('/api/telehealth/sessions/upcoming');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch upcoming sessions');
      }
      return response.json();
    },
  });

  const joinSession = async () => {
    if (!session?.session?.join_url && !session?.session?.host_url) {
      toast({
        title: 'Error',
        description: 'Session URL not available',
        variant: 'destructive',
      });
      return;
    }

    // Open VSee session in a new window
    window.open(
      isProvider ? session.session.host_url : session.session.join_url,
      '_blank',
      'width=1280,height=720'
    );
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          Error loading session: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Telehealth Session</h2>
      {session?.session ? (
        <div className="space-y-4">
          <p>Session ID: {session.session.id}</p>
          <p>Status: {session.session.status}</p>
          {session.session.scheduled_time && (
            <p>Scheduled: {new Date(session.session.scheduled_time).toLocaleString()}</p>
          )}
          {session.session.duration_minutes && (
            <p>Duration: {session.session.duration_minutes} minutes</p>
          )}
          <Button onClick={joinSession}>
            {isProvider ? 'Start Session' : 'Join Session'}
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4">No active session</p>
          {upcomingSessions?.sessions && upcomingSessions.sessions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Upcoming Sessions</h3>
              <div className="space-y-2">
                {upcomingSessions.sessions.map((session: any) => (
                  <div key={session.id} className="p-3 border rounded">
                    <p>Date: {new Date(session.scheduled_time).toLocaleString()}</p>
                    <p>Duration: {session.duration_minutes} minutes</p>
                    <p>Status: {session.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};