import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/lib/auth';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TelehealthSessionProps {
  visitId?: string;
  isProvider?: boolean;
}

export const TelehealthSession: React.FC<TelehealthSessionProps> = ({
  visitId,
  isProvider = false,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');

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

  const { data: upcomingVisits, refetch: refetchVisits } = useQuery({
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

  const createVisitMutation = useMutation({
    mutationFn: async (data: {
      patientIds: string[];
      patientNames: string[];
      providerId: string;
      scheduledTime: string;
      duration: number;
      isGroupSession?: boolean;
    }) => {
      const response = await fetch('/api/telehealth/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          providerName: "Provider", // Should be fetched from provider details
          visitType: data.isGroupSession ? 'GROUP' : 'VIDEO',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create visit');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Visit created successfully',
      });
      refetchVisits();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create visit',
        variant: 'destructive',
      });
    },
  });

  const addParticipantMutation = useMutation({
    mutationFn: async ({ visitId, participantEmail }: { visitId: string; participantEmail: string }) => {
      const response = await fetch(`/api/telehealth/visit/${visitId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: participantEmail, // Using email as ID temporarily
          participantName: participantEmail,
          role: 'PATIENT'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add participant');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Participant added successfully',
      });
      setShowAddParticipant(false);
      setNewParticipantEmail('');
      refetchVisits();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add participant',
        variant: 'destructive',
      });
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

  const handleAddParticipant = async (visitId: string) => {
    if (!newParticipantEmail) {
      toast({
        title: 'Error',
        description: 'Please enter participant email',
        variant: 'destructive',
      });
      return;
    }

    await addParticipantMutation.mutateAsync({
      visitId,
      participantEmail: newParticipantEmail,
    });
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
          <div className="flex items-center gap-2">
            <p>Visit ID: {visit.visit.id}</p>
            {visit.visit.visit_type === 'GROUP' && (
              <Badge variant="secondary">Group Session</Badge>
            )}
          </div>
          <p>Status: {visit.visit.status}</p>
          {visit.visit.scheduled_at && (
            <p>Scheduled: {new Date(visit.visit.scheduled_at).toLocaleString()}</p>
          )}
          {visit.visit.duration_minutes && (
            <p>Duration: {visit.visit.duration_minutes} minutes</p>
          )}

          {/* Display participants for group sessions */}
          {visit.visit.visit_type === 'GROUP' && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Participants</h3>
              <div className="space-y-2">
                {visit.visit.participants?.map((participant: any) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <span>{participant.name}</span>
                    <Badge variant="outline">{participant.role}</Badge>
                  </div>
                ))}
              </div>

              {/* Add Participant Dialog */}
              {isProvider && (
                <Dialog open={showAddParticipant} onOpenChange={setShowAddParticipant}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Participant
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Participant to Group Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="participant-email">Participant Email</Label>
                        <Input
                          id="participant-email"
                          value={newParticipantEmail}
                          onChange={(e) => setNewParticipantEmail(e.target.value)}
                          placeholder="Enter participant's email"
                        />
                      </div>
                      <Button
                        onClick={() => handleAddParticipant(visit.visit.id)}
                        disabled={addParticipantMutation.isPending}
                      >
                        {addParticipantMutation.isPending ? 'Adding...' : 'Add Participant'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
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
                    <div className="flex items-center gap-2 mb-2">
                      <p>Date: {new Date(visit.scheduled_at).toLocaleString()}</p>
                      {visit.visit_type === 'GROUP' && (
                        <Badge variant="secondary">Group Session</Badge>
                      )}
                    </div>
                    <p>Duration: {visit.duration_minutes} minutes</p>
                    <p>Status: {visit.status}</p>
                    {visit.status === 'SCHEDULED' && (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          onClick={() => joinVisit(visit.id)}
                          disabled={joinVisitMutation.isPending}
                          variant="outline"
                          size="sm"
                        >
                          {joinVisitMutation.isPending ? 'Connecting...' : isProvider ? 'Start Visit' : 'Join Visit'}
                        </Button>
                        {isProvider && visit.visit_type === 'GROUP' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowAddParticipant(true);
                            }}
                          >
                            Add Participant
                          </Button>
                        )}
                      </div>
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