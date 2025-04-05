
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, BookMarked, Plus, Search, Bell } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PublishBookDialog from './PublishBookDialog';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 backdrop-blur-lg">
      <nav className="container flex items-center justify-around h-14 relative">
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${isMobile ? 'px-2' : 'px-4'}`
          }
          end
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">{t('nav.home')}</span>
        </NavLink>
        
        <NavLink 
          to="/notifications" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${isMobile ? 'px-2' : 'px-4'}`
          }
        >
          <Bell className="h-5 w-5" />
          <span className="text-[10px]">Уведомления</span>
        </NavLink>
        
        <div className="flex justify-center items-center">
          <button 
            type="button"
            className="neon-button flex items-center justify-center"
            aria-label="Add new book"
            onClick={() => setPublishDialogOpen(true)}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
        
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${isMobile ? 'px-2' : 'px-4'}`
          }
        >
          <Heart className="h-5 w-5" />
          <span className="text-[10px]">{t('nav.favorites')}</span>
        </NavLink>
        
        <NavLink 
          to="/search" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${isMobile ? 'px-2' : 'px-4'}`
          }
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px]">Поиск</span>
        </NavLink>
      </nav>
      
      <PublishBookDialog 
        open={publishDialogOpen} 
        onOpenChange={setPublishDialogOpen} 
      />
    </div>
  );
};

export default BottomNav;
