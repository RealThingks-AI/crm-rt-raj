
-- Create a table for meetings
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in minutes
  participants TEXT[] NOT NULL DEFAULT '{}',
  organizer UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'Scheduled',
  teams_meeting_link TEXT,
  teams_meeting_id TEXT,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  modified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to meetings table
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings
CREATE POLICY "Users can view meetings they organize or participate in" 
  ON public.meetings 
  FOR SELECT 
  USING (
    auth.uid() = organizer OR 
    auth.uid()::text IN (SELECT unnest(participants)) OR
    get_user_role(auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can create meetings" 
  ON public.meetings 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = organizer AND 
    auth.uid() = created_by
  );

CREATE POLICY "Users can update meetings they organize" 
  ON public.meetings 
  FOR UPDATE 
  USING (
    auth.uid() = organizer OR 
    get_user_role(auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can delete meetings they organize" 
  ON public.meetings 
  FOR DELETE 
  USING (
    auth.uid() = organizer OR 
    get_user_role(auth.uid()) IN ('admin', 'manager')
  );
