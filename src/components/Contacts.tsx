
import React, { useState } from 'react';
import { Plus, Mail, Phone, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp',
      position: 'Marketing Director',
      status: 'hot',
      location: 'San Francisco, CA',
      lastContact: '2 days ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@startupxyz.com',
      phone: '+1 (555) 987-6543',
      company: 'StartupXYZ',
      position: 'CEO',
      status: 'warm',
      location: 'New York, NY',
      lastContact: '1 week ago'
    },
    {
      id: 3,
      name: 'Lisa Wang',
      email: 'lisa@designco.com',
      phone: '+1 (555) 456-7890',
      company: 'DesignCo',
      position: 'Creative Lead',
      status: 'active',
      location: 'Los Angeles, CA',
      lastContact: '3 days ago'
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john@enterprise.com',
      phone: '+1 (555) 321-0987',
      company: 'Enterprise Inc',
      position: 'VP of Sales',
      status: 'inactive',
      location: 'Chicago, IL',
      lastContact: '2 weeks ago'
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'hot': return 'crm-status-hot';
      case 'warm': return 'crm-status-warm';
      case 'active': return 'crm-status-active';
      case 'inactive': return 'crm-status-inactive';
      default: return 'crm-status-inactive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
        </div>
        
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="crm-contact-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">{contact.position}</p>
                  <p className="text-sm font-medium text-primary">{contact.company}</p>
                </div>
              </div>
              <span className={getStatusClass(contact.status)}>
                {contact.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{contact.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-card-border">
              <span className="text-xs text-muted-foreground">
                Last contact: {contact.lastContact}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Mail size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Phone size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
