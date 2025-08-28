
import React from 'react';
import { TrendingUp, Users, Building2, Calendar, DollarSign, Target } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Total Contacts',
      value: '2,847',
      change: '+12%',
      icon: Users,
      trend: 'up',
      color: 'primary'
    },
    {
      title: 'Active Companies',
      value: '324',
      change: '+8%',
      icon: Building2,
      trend: 'up',
      color: 'secondary'
    },
    {
      title: 'Revenue',
      value: '$124,500',
      change: '+23%',
      icon: DollarSign,
      trend: 'up',
      color: 'accent'
    },
    {
      title: 'Conversion Rate',
      value: '64%',
      change: '+5%',
      icon: Target,
      trend: 'up',
      color: 'success'
    }
  ];

  const recentActivities = [
    { type: 'meeting', contact: 'Sarah Johnson', company: 'TechCorp', time: '2 hours ago' },
    { type: 'call', contact: 'Mike Chen', company: 'StartupXYZ', time: '4 hours ago' },
    { type: 'email', contact: 'Lisa Wang', company: 'DesignCo', time: '6 hours ago' },
    { type: 'demo', contact: 'John Smith', company: 'Enterprise Inc', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="crm-metric-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${metric.color}/10`}>
                    <Icon className={`text-${metric.color}`} size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="crm-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          <button className="text-primary hover:text-primary-hover text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {activity.contact}
                </p>
                <p className="text-xs text-muted-foreground">{activity.company}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
