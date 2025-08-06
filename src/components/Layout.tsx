
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
          <SheetContent side="left" className={`${sheetWidth} bg-background border-border`}>
            <div className="flex flex-col h-full">
              {/* User profile section */}
              <div className="p-4">
                <SheetClose asChild>
                  <Link to="/profile" className="flex items-center gap-3 hover:bg-accent/50 rounded-lg p-2 transition-colors">
                    <Avatar className="h-12 w-12 bg-[#6366F1] text-white">
                      <AvatarImage src={user?.avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-[#6366F1] text-white font-medium">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user?.username || 'username'}</span>
                      <span className="text-xs text-muted-foreground">@{user?.username || 'username'}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBaseTheme();
                        }} 
                        className="h-6 px-2"
                      >
                        {baseTheme === 'light' ? (
                          <Moon className="h-3 w-3" />
                        ) : (
                          <Sun className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </Link>
                </SheetClose>
              </div>

              <div className="flex-1 px-4 space-y-6">
                {/* Основной section */}
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-3 px-2">Основной</h3>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link 
                        to="/top-reads" 
                        className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span>Топ читаемых</span>
                        </div>
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Новое</span>
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/achievements" 
                        className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span>Достижения</span>
                        </div>
                        <span className="text-xs text-muted-foreground">3</span>
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/saved" 
                        className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-muted-foreground">📚</span>
                          </div>
                          <span>Моя библиотека</span>
                        </div>
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link 
                        to="/favorites" 
                        className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-muted-foreground">♥</span>
                          </div>
                          <span>Избранное</span>
                        </div>
                        <span className="text-xs text-muted-foreground">12</span>
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                {/* Активность section */}
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-3 px-2">Активность</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-muted-foreground">📖</span>
                        </div>
                        <span>История чтения</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-muted-foreground">⭐</span>
                        </div>
                        <span>Мои отзывы</span>
                      </div>
                      <span className="text-xs text-muted-foreground">3</span>
                    </div>
                    
                    <div className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-muted-foreground">🔔</span>
                        </div>
                        <span>Подписки</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Настройки section */}
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-3 px-2">Настройки</h3>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link 
                        to="/notifications" 
                        className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span>Уведомления</span>
                        </div>
                      </Link>
                    </SheetClose>
                    
                    <div 
                      onClick={navigateToSettings}
                      className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span>Настройки</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2 py-2 text-sm hover:bg-accent/50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-muted-foreground">❓</span>
                        </div>
                        <span>Помощь</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exit button at bottom */}
              <div className="mt-auto p-4 border-t">
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Выйти
                </Button>
              </div>
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
