
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, BookMarked, Plus, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInternet } from '@/context/InternetContext';
import PublishBookDialog from './PublishBookDialog';
import { toast } from 'sonner';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isOnline } = useInternet();

  const handlePublishClick = () => {
    if (!isOnline) {
      toast.error("Публикация недоступна", {
        description: "Для публикации книги требуется подключение к интернету",
        position: "bottom-center",
      });
      return;
    }
    setPublishDialogOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 backdrop-blur-lg">
      <nav className="container flex items-center justify-between h-14 relative px-0 sm:px-4">
        <div className="flex items-center justify-start flex-1">
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
            to="/search" 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''} ${isMobile ? 'px-2' : 'px-4'}`
            }
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px]">Поиск</span>
          </NavLink>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center">
          <button 
            type="button"
            className="neon-button flex items-center justify-center"
            aria-label="Add new book"
            onClick={handlePublishClick}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="flex items-center justify-end flex-1">
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
            to="/saved" 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''} ${isMobile ? 'px-2' : 'px-4'}`
            }
          >
            <BookMarked className="h-5 w-5" />
            <span className="text-[10px]">Сохраненные</span>
          </NavLink>
        </div>
      </nav>
      
      <PublishBookDialog 
        open={publishDialogOpen} 
        onOpenChange={setPublishDialogOpen} 
      />
    </div>
  );
};

export default BottomNav;
