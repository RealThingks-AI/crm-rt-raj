
import React from 'react';
import { Calendar, Phone, Mail, Video, Clock } from 'lucide-react';

const Activities = () => {
  const activities = [
    {
      id: 1,
      type: 'meeting',
      title: 'Product Demo with TechCorp',
      contact: 'Sarah Johnson',
      company: 'TechCorp',
      time: '10:00 AM',
      date: 'Today',
      status: 'upcoming'
    },
    {
      id: 2,
      type: 'call',
      title: 'Follow-up Call',
      contact: 'Mike Chen',
      company: 'StartupXYZ',
      time: '2:30 PM',
      date: 'Today',
      status: 'upcoming'
    },
    {
      id: 3,
      type: 'email',
      title: 'Proposal Sent',
      contact: 'Lisa Wang',
      company: 'DesignCo',
      time: '9:15 AM',
      date: 'Yesterday',
      status: 'completed'
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Contract Discussion',
      contact: 'John Smith',
      company: 'Enterprise Inc',
      time: '3:00 PM',
      date: 'Yesterday',
      status: 'completed'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting': return Video;
      case 'call': return Phone;
      case 'email': return Mail;
      default: return Calendar;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'call': return 'secondary';
      case 'email': return 'accent';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const color = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="crm-card p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-${color}/10 flex items-center justify-center`}>
                  <Icon className={`text-${color}`} size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.contact} • {activity.company}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{activity.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'upcoming' 
                        ? 'bg-accent-light text-accent' 
                        : 'bg-success/10 text-success'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activities;
