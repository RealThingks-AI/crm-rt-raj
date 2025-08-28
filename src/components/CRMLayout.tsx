
import React from 'react';
import { Building2, Users, Calendar, BarChart3, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CRMLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const CRMLayout = ({ children, currentPage, onPageChange }: CRMLayoutProps) => {
  const navigation = [
    { name: 'Dashboard', icon: BarChart3, page: 'dashboard' },
    { name: 'Contacts', icon: Users, page: 'contacts' },
    { name: 'Companies', icon: Building2, page: 'companies' },
    { name: 'Activities', icon: Calendar, page: 'activities' },
    { name: 'Settings', icon: Settings, page: 'settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border animate-slide-in">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">CRM Pro</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            
            return (
              <button
                key={item.name}
                onClick={() => onPageChange(item.page)}
                className={isActive ? 'crm-sidebar-item-active w-full' : 'crm-sidebar-item w-full'}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground capitalize">
              {currentPage}
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CRMLayout;
