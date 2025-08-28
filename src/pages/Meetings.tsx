
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { MeetingsTable } from '@/components/meetings/MeetingsTable';
import { CreateMeetingModal } from '@/components/meetings/CreateMeetingModal';
import { EditMeetingModal } from '@/components/meetings/EditMeetingModal';
import { MeetingsImportExport } from '@/components/meetings/MeetingsImportExport';
import { useToast } from '@/hooks/use-toast';

interface Meeting {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime: string;
  duration?: number;
  participants: string[];
  organizer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  description?: string;
  teams_meeting_link?: string;
  teams_meeting_id?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  modified_by?: string;
}

export default function Meetings() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meetings = [], isLoading } = useQuery({
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

  const handleCreateMeeting = async (meetingData: any) => {
    try {
      // Create Teams meeting first
      const { data: teamsData, error: teamsError } = await supabase.functions.invoke('create-teams-meeting', {
        body: {
          subject: meetingData.title,
          attendees: meetingData.participants,
          startTime: meetingData.start_datetime,
          endTime: meetingData.end_datetime
        }
      });

      if (teamsError) throw teamsError;

      // Insert meeting into database
      const meetingRecord = {
        title: meetingData.title,
        start_datetime: meetingData.start_datetime,
        end_datetime: meetingData.end_datetime,
        duration: meetingData.duration,
        participants: meetingData.participants,
        organizer: user?.id || '',
        status: 'Scheduled' as const,
        description: meetingData.description || null,
        teams_meeting_link: teamsData?.meeting?.joinUrl || null,
        teams_meeting_id: teamsData?.meeting?.id || null,
        created_by: user?.id || '',
        modified_by: user?.id || ''
      };

      const { error: insertError } = await supabase
        .from('meetings')
        .insert([meetingRecord]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Meeting created successfully and Teams meeting scheduled",
      });

      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const handleEditMeeting = async (meetingData: any) => {
    if (!selectedMeeting) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          ...meetingData,
          modified_by: user?.id
        })
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      setIsEditModalOpen(false);
      setSelectedMeeting(null);
    } catch (error: any) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update meeting",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete meeting",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meetings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your meetings and Microsoft Teams integration
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Meeting
        </Button>
      </div>

      <div className="space-y-6">
        <MeetingsImportExport meetings={meetings} />
        
        <Card>
          <CardHeader>
            <CardTitle>All Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <MeetingsTable
              meetings={meetings}
              isLoading={isLoading}
              onEdit={handleEditClick}
              onDelete={handleDeleteMeeting}
            />
          </CardContent>
        </Card>
      </div>

      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMeeting}
      />

      {selectedMeeting && (
        <EditMeetingModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMeeting(null);
          }}
          onSubmit={handleEditMeeting}
          meeting={selectedMeeting}
        />
      )}
    </div>
  );
}
