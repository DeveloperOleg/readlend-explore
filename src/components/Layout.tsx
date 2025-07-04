
import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Moon, 
  Sun, 
  LogOut,
  Flame,
  Bell,
  Settings as SettingsIcon,
  Trophy,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from './BottomNav';
import ConnectionStatus from './ConnectionStatus';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Layout: React.FC = () => {
  const { baseTheme, toggleBaseTheme } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const pullThreshold = 100; // Minimum pull distance to trigger refresh
  
  // Swipe state for sidebar
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [swipeStartY, setSwipeStartY] = useState(0);
  const [isSwipingHorizontally, setIsSwipingHorizontally] = useState(false);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToNotifications = () => {
    navigate('/notifications');
  };

  const navigateToSettings = () => {
    navigate('/settings');
    setSidebarOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeStartX(touch.clientX);
    setSwipeStartY(touch.clientY);
    setIsSwipingHorizontally(false);
    
    // Only enable pull to refresh when at the top of the page
    if (window.scrollY === 0) {
      setStartY(touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;
    
    // Check if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      setIsSwipingHorizontally(true);
      
      // Swipe right from left edge to open sidebar
      if (swipeStartX < 50 && deltaX > 100 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    }
    
    // Pull to refresh logic (only if not swiping horizontally)
    if (!isSwipingHorizontally && startY !== 0 && window.scrollY === 0) {
      const currentY = touch.clientY;
      const distance = currentY - startY;
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance * 0.5, pullThreshold * 1.5));
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwipingHorizontally && pullDistance >= pullThreshold) {
      performRefresh();
    }
    
    setStartY(0);
    setPullDistance(0);
    setIsSwipingHorizontally(false);
    setSwipeStartX(0);
    setSwipeStartY(0);
  };

  const performRefresh = () => {
    setRefreshing(true);
    toast.info(t('common.refreshing'));
    
    // Simulate refresh
    setTimeout(() => {
      // Reload the current page
      window.location.reload();
      setRefreshing(false);
    }, 1000);
  };

  const sheetWidth = isMobile ? 'w-[280px]' : 'w-[280px] sm:w-[350px]';
  
  // Format display name
  const displayName = user?.firstName || user?.username || 'Пользователь';

  // Check if we're on pages where header elements should be hidden
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isBookPage = location.pathname.startsWith('/book/');
  const isSearchPage = location.pathname === '/search';
  const isFavoritesPage = location.pathname === '/favorites';
  const isSavedPage = location.pathname === '/saved';
  const isTopReadsPage = location.pathname === '/top-reads';
  const isAchievementsPage = location.pathname === '/achievements';
  const isProfilePage = location.pathname === '/profile' || location.pathname.startsWith('/profile/');

  // Pages where both sidebar and notifications should be hidden
  const shouldHideHeaderElements = isSettingsPage || isBookPage || isSearchPage || 
    isFavoritesPage || isSavedPage || isTopReadsPage || isAchievementsPage || isProfilePage;

  return (
    <div 
      className="relative min-h-screen pb-16 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center bg-background/70 backdrop-blur-sm z-50 transition-all duration-200"
          style={{ height: `${pullDistance}px` }}
        >
          <div className={`transition-all duration-300 ${refreshing ? 'animate-spin' : ''}`}>
            <RefreshCw size={24} className={pullDistance >= pullThreshold ? 'text-primary' : 'text-muted-foreground'} />
          </div>
        </div>
      )}
      
      {/* Sidebar/Menu - hidden on specified pages */}
      {!shouldHideHeaderElements && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-2 left-2 z-50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={`${sheetWidth} bg-sidebar backdrop-blur-lg border-sidebar-border`}>
            <div className="flex flex-col h-full text-sidebar-foreground">
              {/* User profile section */}
              <div className="py-6 px-4">
                <div className="flex items-center justify-between">
                  <SheetClose asChild>
                    <Link to="/profile" className="flex items-center gap-4 hover:bg-sidebar-accent/10 rounded-lg transition-colors">
                      <Avatar className="h-14 w-14 border-2 border-sidebar-accent">
                        <AvatarImage src={user?.avatarUrl} alt={displayName} />
                        <AvatarFallback className="text-xl">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h2 className="text-xl font-semibold tracking-tight">
                          {displayName}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          {user?.username ? `@${user.username}` : '@username'}
                        </span>
                      </div>
                    </Link>
                  </SheetClose>
                  
                  {/* Theme Toggle Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleBaseTheme}
                    className="rounded-full h-10 w-10 flex items-center justify-center ml-4"
                  >
                    {baseTheme === 'dark' ? 
                      <Moon className="h-5 w-5" /> : 
                      <Sun className="h-5 w-5" />
                    }
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-sidebar-border" />
              
              <div className="flex-1 py-4 space-y-5">
                {/* Top Reads link */}
                <div className="flex items-center px-4">
                  <SheetClose asChild>
                    <Link 
                      to="/top-reads" 
                      className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors"
                    >
                      <Flame className="h-5 w-5" />
                      <span>{t('nav.topReads')}</span>
                    </Link>
                  </SheetClose>
                </div>
                
                {/* Achievements link */}
                <div className="flex items-center px-4">
                  <SheetClose asChild>
                    <Link 
                      to="/achievements" 
                      className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors"
                    >
                      <Trophy className="h-5 w-5" />
                      <span>{t('pages.achievements')}</span>
                    </Link>
                  </SheetClose>
                </div>
                
                {/* Settings button */}
                <div className="flex items-center px-4">
                  <button
                    onClick={navigateToSettings}
                    className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors"
                  >
                    <SettingsIcon className="h-5 w-5" />
                    <span>{t('sidebar.settings')}</span>
                  </button>
                </div>
              </div>
              
              <Separator className="bg-sidebar-border" />
              
              {/* Logout button */}
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 justify-start py-4 px-4 w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-none"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('sidebar.logout')}</span>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Notifications button (top right) - hidden on specified pages */}
      {!shouldHideHeaderElements && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-2 right-2 z-50"
          onClick={navigateToNotifications}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Уведомления</span>
        </Button>
      )}
      
      {/* Connection status alert */}
      <div className="container px-2">
        <ConnectionStatus />
      </div>
      
      {/* Main content */}
      <main className="animate-fade-in">
        <Outlet />
      </main>
      
      {/* Bottom navigation - fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
