
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Heart, BookMarked, Plus, Search, Zap } from 'lucide-react';
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
  const location = useLocation();
  const homeClickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [homeClickCount, setHomeClickCount] = useState(0);

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

  const handleHomeClick = () => {
    // Only activate double-click behavior when already on home page
    if (location.pathname === '/home') {
      setHomeClickCount(prev => prev + 1);
      
      if (homeClickTimerRef.current) {
        clearTimeout(homeClickTimerRef.current);
      }
      
      homeClickTimerRef.current = setTimeout(() => {
        if (homeClickCount === 1) {
          // Double click detected
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          toast.success("Прокручено вверх", { 
            duration: 2000,
            position: "bottom-center"
          });
        }
        setHomeClickCount(0);
      }, 300);
    }
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (homeClickTimerRef.current) {
        clearTimeout(homeClickTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-background border-t border-border">
      <nav className="container flex items-center justify-between h-14 relative px-0 sm:px-4">
        <div className="flex items-center justify-start flex-1 max-w-[40%]">
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active text-blue-500' : 'text-muted-foreground hover:text-blue-500'} flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-3 transition-colors`
            }
            onClick={handleHomeClick}
            end
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-none text-center">{t('nav.home')}</span>
          </NavLink>
          
          <NavLink 
            to="/search" 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active text-blue-500' : 'text-muted-foreground hover:text-blue-500'} flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-3 transition-colors`
            }
          >
            <Search className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-none text-center">{t('nav.search')}</span>
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
        
        <div className="flex items-center justify-end flex-1 max-w-[40%] ml-auto">
          <NavLink 
            to="/comics" 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active text-blue-500' : 'text-muted-foreground hover:text-blue-500'} flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-3 transition-colors`
            }
          >
            <Zap className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-none text-center">Комиксы</span>
          </NavLink>
          
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active text-blue-500' : 'text-muted-foreground hover:text-blue-500'} flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-3 transition-colors`
            }
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-[10px] leading-none text-center">{t('nav.favorites')}</span>
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
