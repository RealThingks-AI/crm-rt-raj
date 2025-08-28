
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MeetingsTable } from '@/components/meetings/MeetingsTable';
import { CreateMeetingModal } from '@/components/meetings/CreateMeetingModal';
import { EditMeetingModal } from '@/components/meetings/EditMeetingModal';
import { MeetingsImportExport } from '@/components/meetings/MeetingsImportExport';

interface Meeting {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime: string;
  duration: number;
  participants: string[];
  organizer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  teams_meeting_link: string | null;
  teams_meeting_id: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function Meetings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('start_datetime', { ascending: false });
      
      if (error) throw error;
      return data as Meeting[];
    },
  });

  const createMeetingMutation = useMutation({
    mutationFn: async (meetingData: Partial<Meeting>) => {
      // First create the Teams meeting
      const { data: teamsData, error: teamsError } = await supabase.functions.invoke(
        'create-teams-meeting',
        {
          body: {
            subject: meetingData.title,
            startTime: meetingData.start_datetime,
            endTime: meetingData.end_datetime,
            attendees: meetingData.participants || [],
          },
        }
      );

      if (teamsError) throw teamsError;

      // Then save to database
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          ...meetingData,
          organizer: user?.id,
          created_by: user?.id,
          teams_meeting_link: teamsData?.meeting?.joinUrl,
          teams_meeting_id: teamsData?.meeting?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: 'Success',
        description: 'Meeting created and Teams invitation sent.',
      });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create meeting.',
        variant: 'destructive',
      });
    },
  });

  const updateMeetingMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Meeting> & { id: string }) => {
      const { data, error } = await supabase
        .from('meetings')
        .update({
          ...updateData,
          modified_by: user?.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: 'Success',
        description: 'Meeting updated successfully.',
      });
      setEditingMeeting(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update meeting.',
        variant: 'destructive',
      });
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: 'Success',
        description: 'Meeting deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete meeting.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateMeeting = (data: Partial<Meeting>) => {
    createMeetingMutation.mutate(data);
  };

  const handleUpdateMeeting = (data: Partial<Meeting> & { id: string }) => {
    updateMeetingMutation.mutate(data);
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteMeetingMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Manage your meetings and Teams integrations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <MeetingsImportExport meetings={meetings || []} />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Meeting
          </Button>
        </div>
      </div>

      <MeetingsTable
        meetings={meetings || []}
        isLoading={isLoading}
        onEdit={setEditingMeeting}
        onDelete={handleDeleteMeeting}
      />

      <CreateMeetingModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateMeeting}
        isLoading={createMeetingMutation.isPending}
      />

      {editingMeeting && (
        <EditMeetingModal
          meeting={editingMeeting}
          open={!!editingMeeting}
          onOpenChange={(open) => !open && setEditingMeeting(null)}
          onSubmit={handleUpdateMeeting}
          isLoading={updateMeetingMutation.isPending}
        />
      )}
    </div>
  );
}
