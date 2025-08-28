
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GenericCSVExporter } from '@/hooks/import-export/genericCSVExporter';
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
  description?: string;
  teams_meeting_link?: string;
  teams_meeting_id?: string;
  created_at: string;
  updated_at: string;
}

interface MeetingsImportExportProps {
  meetings: Meeting[];
}

export function MeetingsImportExport({ meetings }: MeetingsImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      if (meetings.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no meetings to export.",
          variant: "destructive",
        });
        return;
      }

      const exportData = meetings.map(meeting => ({
        title: meeting.title,
        start_datetime: meeting.start_datetime,
        end_datetime: meeting.end_datetime,
        duration: meeting.duration || '',
        participants: meeting.participants.join(', '),
        organizer: meeting.organizer,
        status: meeting.status,
        description: meeting.description || '',
        teams_meeting_link: meeting.teams_meeting_link || '',
        teams_meeting_id: meeting.teams_meeting_id || '',
        created_at: meeting.created_at,
        updated_at: meeting.updated_at
      }));

      const fieldsOrder = [
        'title',
        'start_datetime',
        'end_datetime',
        'duration',
        'participants',
        'organizer',
        'status',
        'description',
        'teams_meeting_link',
        'teams_meeting_id',
        'created_at',
        'updated_at'
      ];

      const exporter = new GenericCSVExporter();
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filename = `meetings_export_${timestamp}.csv`;

      await exporter.exportToCSV(exportData, filename, fieldsOrder);

      toast({
        title: "Export completed",
        description: `Successfully exported ${meetings.length} meetings to ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export meetings data",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value so the same file can be selected again
    event.target.value = '';

    toast({
      title: "Import feature coming soon",
      description: "Meeting import functionality will be available in a future update.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import & Export
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
          
          <Button onClick={handleImportClick} variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import from CSV
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p><strong>Export:</strong> Download all meeting data as CSV file</p>
          <p><strong>Import:</strong> Upload CSV file to bulk create meetings (coming soon)</p>
        </div>
      </CardContent>
    </Card>
  );
}
