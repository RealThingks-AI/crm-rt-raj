
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, Clock, Video } from 'lucide-react';
import { MeetingModal } from '@/components/MeetingModal';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime: string;
  duration?: number;
  participants: string[];
  organizer: string;
  status: string;
  teams_meeting_link?: string;
  teams_meeting_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const Meetings = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const { data: meetings, isLoading, refetch } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('start_datetime', { ascending: true });
      
      if (error) throw error;
      return data as Meeting[];
    },
    enabled: !!user,
  });

  const handleCreateMeeting = () => {
    setSelectedMeeting(null);
    setIsModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Manage and track your meetings
          </p>
        </div>
        <Button onClick={handleCreateMeeting}>
          <Plus className="h-4 w-4 mr-2" />
          New Meeting
        </Button>
      </div>

      <div className="grid gap-4">
        {meetings?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No meetings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first meeting.
                </p>
                <Button onClick={handleCreateMeeting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          meetings?.map((meeting) => (
            <Card 
              key={meeting.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEditMeeting(meeting)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                </div>
                {meeting.description && (
                  <CardDescription>{meeting.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(meeting.start_datetime), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {format(new Date(meeting.start_datetime), 'HH:mm')} - {format(new Date(meeting.end_datetime), 'HH:mm')}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {meeting.participants.length} participant(s)
                  </div>
                </div>
                {meeting.teams_meeting_link && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Video className="h-4 w-4 mr-2" />
                      Teams Meeting Available
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <MeetingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meeting={selectedMeeting}
        onSave={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Meetings;
