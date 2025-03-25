
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, BookMarked, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import PublishBookDialog from './PublishBookDialog';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 backdrop-blur-lg">
      <nav className="container flex items-center justify-around h-16">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `nav-item pl-8 ${isActive ? 'active' : ''}`
          }
          end
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">{t('nav.home')}</span>
        </NavLink>
        
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs">{t('nav.favorites')}</span>
        </NavLink>
        
        <div className="flex justify-center -mt-6">
          <button 
            type="button"
            className="neon-button"
            aria-label="Add new book"
            onClick={() => setPublishDialogOpen(true)}
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>
        
        <NavLink 
          to="/saved" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <BookMarked className="h-5 w-5" />
          <span className="text-xs">{t('nav.saved')}</span>
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
