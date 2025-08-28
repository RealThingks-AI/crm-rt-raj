
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, ExternalLink, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Meeting {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime: string;
  participants: string[];
  organizer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  teams_meeting_link?: string;
}

interface MeetingsTableProps {
  meetings: Meeting[];
  isLoading: boolean;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
}

export function MeetingsTable({ meetings, isLoading, onEdit, onDelete }: MeetingsTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'default';
      case 'Completed':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDateTime = (datetime: string) => {
    try {
      const date = new Date(datetime);
      return {
        date: format(date, 'MMM dd, yyyy'),
        time: format(date, 'HH:mm')
      };
    } catch {
      return { date: 'Invalid date', time: '' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading meetings...</div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No meetings found</h3>
        <p className="text-muted-foreground">Create your first meeting to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Teams Link</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => {
            const startDateTime = formatDateTime(meeting.start_datetime);
            const endDateTime = formatDateTime(meeting.end_datetime);
            
            return (
              <TableRow key={meeting.id}>
                <TableCell className="font-medium">{meeting.title}</TableCell>
                <TableCell>{startDateTime.date}</TableCell>
                <TableCell>
                  {startDateTime.time} - {endDateTime.time}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.participants.length}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(meeting.status)}>
                    {meeting.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {meeting.teams_meeting_link ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(meeting.teams_meeting_link, '_blank')}
                      className="h-8 px-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">No link</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(meeting)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this meeting? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(meeting.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
