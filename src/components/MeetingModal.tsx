
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
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
}

interface MeetingModalProps {
  open: boolean;
  onClose: () => void;
  meeting?: Meeting | null;
  onSave: () => void;
}

interface FormData {
  title: string;
  start_datetime: string;
  end_datetime: string;
  description: string;
  status: string;
  teams_meeting_link: string;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  open,
  onClose,
  meeting,
  onSave,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const watchStartDateTime = watch('start_datetime');

  useEffect(() => {
    if (meeting) {
      setValue('title', meeting.title);
      setValue('start_datetime', format(new Date(meeting.start_datetime), "yyyy-MM-dd'T'HH:mm"));
      setValue('end_datetime', format(new Date(meeting.end_datetime), "yyyy-MM-dd'T'HH:mm"));
      setValue('description', meeting.description || '');
      setValue('status', meeting.status);
      setValue('teams_meeting_link', meeting.teams_meeting_link || '');
      setParticipants(meeting.participants || []);
    } else {
      reset();
      setParticipants([]);
    }
  }, [meeting, setValue, reset]);

  useEffect(() => {
    if (watchStartDateTime) {
      const startDate = new Date(watchStartDateTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      setValue('end_datetime', format(endDate, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [watchStartDateTime, setValue]);

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter(p => p !== email));
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const startDate = new Date(data.start_datetime);
      const endDate = new Date(data.end_datetime);
      const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

      const meetingData = {
        title: data.title,
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        duration,
        participants,
        organizer: user.id,
        status: data.status,
        teams_meeting_link: data.teams_meeting_link || null,
        description: data.description || null,
        created_by: user.id,
        modified_by: user.id,
      };

      if (meeting) {
        const { error } = await supabase
          .from('meetings')
          .update(meetingData)
          .eq('id', meeting.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Meeting updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('meetings')
          .insert([meetingData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Meeting created successfully",
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save meeting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!meeting) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meeting.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete meeting",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meeting ? 'Edit Meeting' : 'Create New Meeting'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Meeting title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_datetime">Start Date & Time *</Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                {...register('start_datetime', { required: 'Start date is required' })}
              />
              {errors.start_datetime && (
                <p className="text-sm text-red-600">{errors.start_datetime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_datetime">End Date & Time *</Label>
              <Input
                id="end_datetime"
                type="datetime-local"
                {...register('end_datetime', { required: 'End date is required' })}
              />
              {errors.end_datetime && (
                <p className="text-sm text-red-600">{errors.end_datetime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value)} defaultValue="Scheduled">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="flex space-x-2">
              <Input
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              />
              <Button type="button" onClick={addParticipant} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {participants.map((email, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {email}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => removeParticipant(email)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teams_meeting_link">Teams Meeting Link</Label>
            <Input
              id="teams_meeting_link"
              {...register('teams_meeting_link')}
              placeholder="https://teams.microsoft.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Meeting description or agenda"
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {meeting && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Meeting
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : meeting ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
