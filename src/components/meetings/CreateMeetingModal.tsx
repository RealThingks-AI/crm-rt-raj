
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateMeetingModal({ isOpen, onClose, onSubmit }: CreateMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    participants: [] as string[],
    newParticipantEmail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch leads for participant suggestions
  const { data: leads = [] } = useQuery({
    queryKey: ['leads-for-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('email, lead_name')
        .not('email', 'is', null)
        .order('lead_name');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        participants: [],
        newParticipantEmail: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (formData.participants.length === 0) {
      newErrors.participants = 'At least one participant is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2024-01-01 ${formData.startTime}`);
    const end = new Date(`2024-01-01 ${formData.endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60)); // Duration in minutes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const startDateTime = `${formData.date}T${formData.startTime}:00`;
    const endDateTime = `${formData.date}T${formData.endTime}:00`;

    onSubmit({
      title: formData.title,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      duration: calculateDuration(),
      participants: formData.participants,
      description: formData.description
    });
  };

  const addParticipant = (email: string) => {
    if (email && !formData.participants.includes(email)) {
      setFormData({
        ...formData,
        participants: [...formData.participants, email],
        newParticipantEmail: ''
      });
      setErrors({ ...errors, participants: '' });
    }
  };

  const removeParticipant = (email: string) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter(p => p !== email)
    });
  };

  const handleAddNewParticipant = () => {
    const email = formData.newParticipantEmail.trim();
    if (email && email.includes('@')) {
      addParticipant(email);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter meeting title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={errors.date ? 'border-destructive' : ''}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={errors.startTime ? 'border-destructive' : ''}
              />
              {errors.startTime && <p className="text-sm text-destructive">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={errors.endTime ? 'border-destructive' : ''}
              />
              {errors.endTime && <p className="text-sm text-destructive">{errors.endTime}</p>}
            </div>
          </div>

          {formData.startTime && formData.endTime && (
            <p className="text-sm text-muted-foreground">
              Duration: {calculateDuration()} minutes
            </p>
          )}

          <div className="space-y-4">
            <Label>Participants *</Label>
            
            {leads.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Add from Leads</Label>
                <Select onValueChange={(email) => addParticipant(email)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead to add as participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.email} value={lead.email}>
                        {lead.lead_name} ({lead.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm">Add Manual Email</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={formData.newParticipantEmail}
                  onChange={(e) => setFormData({ ...formData, newParticipantEmail: e.target.value })}
                  placeholder="Enter email address"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewParticipant())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddNewParticipant}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.participants.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Selected Participants</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.participants.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <button
                        type="button"
                        onClick={() => removeParticipant(email)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {errors.participants && <p className="text-sm text-destructive">{errors.participants}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter meeting description (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Meeting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
