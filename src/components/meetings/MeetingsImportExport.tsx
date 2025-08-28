
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

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

interface MeetingsImportExportProps {
  meetings: Meeting[];
}

export function MeetingsImportExport({ meetings }: MeetingsImportExportProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  const exportToCSV = () => {
    if (meetings.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no meetings to export.',
        variant: 'destructive',
      });
      return;
    }

    const headers = [
      'Title',
      'Start Date',
      'Start Time',
      'End Time',
      'Duration (minutes)',
      'Participants',
      'Organizer',
      'Status',
      'Description',
      'Teams Link',
    ];

    const csvData = meetings.map(meeting => [
      meeting.title,
      new Date(meeting.start_datetime).toLocaleDateString(),
      new Date(meeting.start_datetime).toLocaleTimeString(),
      new Date(meeting.end_datetime).toLocaleTimeString(),
      meeting.duration,
      meeting.participants.join('; '),
      meeting.organizer,
      meeting.status,
      meeting.description || '',
      meeting.teams_meeting_link || '',
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `meetings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export completed',
      description: `Exported ${meetings.length} meetings to CSV.`,
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const data = lines.slice(1);

      const meetings = data.map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        
        const title = values[0];
        const startDate = values[1];
        const startTime = values[2];
        const endTime = values[3];
        const participants = values[5] ? values[5].split(';').map(p => p.trim()) : [];
        const status = values[7] || 'Scheduled';
        const description = values[8] || null;

        if (!title || !startDate || !startTime || !endTime) {
          throw new Error('Missing required fields: Title, Start Date, Start Time, or End Time');
        }

        const startDateTime = new Date(`${startDate} ${startTime}`);
        const endDateTime = new Date(`${startDate} ${endTime}`);
        const duration = Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60));

        return {
          title,
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          duration,
          participants,
          organizer: user?.id,
          created_by: user?.id,
          status: ['Scheduled', 'Completed', 'Cancelled'].includes(status) ? status : 'Scheduled',
          description,
        };
      });

      const { error } = await supabase
        .from('meetings')
        .insert(meetings);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['meetings'] });

      toast({
        title: 'Import completed',
        description: `Successfully imported ${meetings.length} meetings.`,
      });
    } catch (error: any) {
      toast({
        title: 'Import failed',
        description: error.message || 'Failed to import meetings.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={exportToCSV}>
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      
      <div className="relative">
        <Button variant="outline" disabled={isImporting}>
          <Upload className="h-4 w-4 mr-2" />
          {isImporting ? 'Importing...' : 'Import CSV'}
        </Button>
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isImporting}
        />
      </div>
    </div>
  );
}
