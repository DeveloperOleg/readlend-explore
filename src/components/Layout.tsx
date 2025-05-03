
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Moon, 
  Sun, 
  Languages,
  LogOut,
  MessageCircle,
  User,
  Flame,
  Bell,
  Settings as SettingsIcon,
  Trophy
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from './BottomNav';
import SearchBar from './SearchBar';
import ConnectionStatus from './ConnectionStatus';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Layout: React.FC = () => {
  const { baseTheme, toggleBaseTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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

  const sheetWidth = isMobile ? 'w-[280px]' : 'w-[280px] sm:w-[350px]';

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* Sidebar/Menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 left-2 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`${sheetWidth} bg-sidebar backdrop-blur-lg border-sidebar-border`}>
          <div className="flex flex-col h-full text-sidebar-foreground">
            {/* User profile section with improved spacing */}
            <div className="py-6 px-4">
              <div className="flex items-center justify-between">
                <SheetClose asChild>
                  <Link to="/profile" className="flex items-center gap-4 hover:bg-sidebar-accent/10 rounded-lg transition-colors">
                    <Avatar className="h-14 w-14 border-2 border-sidebar-accent">
                      <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                      <AvatarFallback className="text-xl">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold tracking-tight">
                        {user?.firstName || user?.username || 'Имя пользователя'}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {user?.username ? `@${user.username}` : '@username'}
                      </span>
                    </div>
                  </Link>
                </SheetClose>
                
                {/* Theme Toggle Button with better spacing */}
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
              {/* Language toggle */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  <span>{t('sidebar.language')}</span>
                </div>
                <Switch 
                  id="language-toggle"
                  checked={language === 'en'}
                  onCheckedChange={toggleLanguage}
                />
              </div>
              
              {/* Top Reads link */}
              <div className="flex items-center px-4">
                <SheetClose asChild>
                  <Link 
                    to="/top-reads" 
                    className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors"
                  >
                    <Flame className="h-5 w-5" />
                    <span>{t('nav.topReads') || 'Топ читаемых'}</span>
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
                    <span>Достижения</span>
                  </Link>
                </SheetClose>
              </div>
              
              {/* Telegram chat link */}
              <div className="flex items-center px-4">
                <a 
                  href="https://t.me/+LeR5l4MeHVE4NjBi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Telegram чат</span>
                </a>
              </div>
              
              {/* Profile link */}
              <div className="flex items-center px-4">
                <SheetClose asChild>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-sidebar-foreground hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>{t('sidebar.profile') || 'Профиль'}</span>
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
      
      {/* Notifications button (top right) */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 z-50"
        onClick={navigateToNotifications}
      >
        <Bell className="h-5 w-5" />
        <span className="sr-only">Уведомления</span>
      </Button>
      
      {/* Connection status alert */}
      <div className="container px-2">
        <ConnectionStatus />
      </div>
      
      {/* Main content */}
      <main className="container px-2 pt-12 pb-2 animate-fade-in">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
