
import React from 'react';
import { Bell } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const Notifications: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Уведомления</h1>
      </div>
      
      <div className="flex justify-center">
        <EmptyState 
          title="Уведомлений пока нет" 
          description="Когда появятся новые уведомления, они будут отображаться здесь" 
          icon="bell"
        />
      </div>
    </div>
  );
};

export default Notifications;
