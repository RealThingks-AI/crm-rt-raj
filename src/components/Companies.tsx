
import React from 'react';
import { Building2, Users, DollarSign, TrendingUp } from 'lucide-react';

const Companies = () => {
  const companies = [
    {
      id: 1,
      name: 'TechCorp',
      industry: 'Technology',
      contacts: 12,
      revenue: '$2.5M',
      status: 'active',
      growth: '+15%',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'StartupXYZ',
      industry: 'Fintech',
      contacts: 8,
      revenue: '$800K',
      status: 'hot',
      growth: '+45%',
      location: 'New York, NY'
    },
    {
      id: 3,
      name: 'DesignCo',
      industry: 'Design',
      contacts: 15,
      revenue: '$1.2M',
      status: 'warm',
      growth: '+8%',
      location: 'Los Angeles, CA'
    },
    {
      id: 4,
      name: 'Enterprise Inc',
      industry: 'Manufacturing',
      contacts: 25,
      revenue: '$5.8M',
      status: 'active',
      growth: '+12%',
      location: 'Chicago, IL'
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'hot': return 'crm-status-hot';
      case 'warm': return 'crm-status-warm';
      case 'active': return 'crm-status-active';
      default: return 'crm-status-inactive';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="crm-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{company.name}</h3>
                  <p className="text-muted-foreground">{company.industry}</p>
                  <p className="text-sm text-muted-foreground">{company.location}</p>
                </div>
              </div>
              <span className={getStatusClass(company.status)}>
                {company.status}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-card-border">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users size={16} className="text-primary mr-1" />
                  <span className="text-lg font-semibold">{company.contacts}</span>
                </div>
                <p className="text-xs text-muted-foreground">Contacts</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign size={16} className="text-success mr-1" />
                  <span className="text-lg font-semibold">{company.revenue}</span>
                </div>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp size={16} className="text-accent mr-1" />
                  <span className="text-lg font-semibold">{company.growth}</span>
                </div>
                <p className="text-xs text-muted-foreground">Growth</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
