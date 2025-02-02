import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface TelehealthSessionProps {
  visitId?: string;
  isProvider?: boolean;
}

export const TelehealthSession: React.FC<TelehealthSessionProps> = ({
  visitId,
  isProvider = false,
}) => {
  const { toast } = useToast();

  const { data: visit, isLoading, error } = useQuery({
    queryKey: ['telehealth-visit', visitId],
    queryFn: async () => {
      if (!visitId) return null;
      const response = await fetch(`/api/telehealth/visit/${visitId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch visit');
      }
      return response.json();
    },
    enabled: !!visitId,
  });

  const { data: upcomingVisits } = useQuery({
    queryKey: ['telehealth-visits-upcoming'],
    queryFn: async () => {
      const response = await fetch('/api/telehealth/visits/upcoming');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch upcoming visits');
      }
      return response.json();
    },
  });

  const joinVisitMutation = useMutation({
    mutationFn: async (visitId: string) => {
      const response = await fetch(`/api/telehealth/visit/${visitId}/join`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join visit');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.roomUrl) {
        window.open(data.roomUrl, '_blank', 'width=1280,height=720');
      } else {
        toast({
          title: 'Error',
          description: 'Room URL not available',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join visit',
        variant: 'destructive',
      });
    },
  });

  const joinVisit = async (visitId: string) => {
    try {
      await joinVisitMutation.mutateAsync(visitId);
    } catch (error) {
      // Error is handled by the mutation callbacks
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          Error loading visit: {error instanceof Error ? error.message : 'Unknown error'}
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
      <h2 className="text-2xl font-bold mb-4">Telehealth Visit</h2>
      {visit?.visit ? (
        <div className="space-y-4">
          <p>Visit ID: {visit.visit.id}</p>
          <p>Status: {visit.visit.status}</p>
          {visit.visit.scheduled_time && (
            <p>Scheduled: {new Date(visit.visit.scheduled_time).toLocaleString()}</p>
          )}
          {visit.visit.duration_minutes && (
            <p>Duration: {visit.visit.duration_minutes} minutes</p>
          )}
          <Button 
            onClick={() => joinVisit(visit.visit.id)}
            disabled={joinVisitMutation.isPending}
          >
            {joinVisitMutation.isPending ? 'Connecting...' : isProvider ? 'Start Visit' : 'Join Visit'}
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4">No active visit</p>
          {upcomingVisits?.visits && upcomingVisits.visits.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Upcoming Visits</h3>
              <div className="space-y-2">
                {upcomingVisits.visits.map((visit: any) => (
                  <div key={visit.id} className="p-3 border rounded">
                    <p>Date: {new Date(visit.scheduled_time).toLocaleString()}</p>
                    <p>Duration: {visit.duration_minutes} minutes</p>
                    <p>Status: {visit.status}</p>
                    {visit.status === 'SCHEDULED' && (
                      <Button 
                        onClick={() => joinVisit(visit.id)}
                        disabled={joinVisitMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        {joinVisitMutation.isPending ? 'Connecting...' : isProvider ? 'Start Visit' : 'Join Visit'}
                      </Button>
                    )}
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