
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
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from './BottomNav';
import SearchBar from './SearchBar';
import SettingsDialog from './SettingsDialog';
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
    // Перенаправляем на главную страницу после выхода
    navigate('/');
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
            <SheetClose asChild>
              <Link to="/profile" className="py-4 px-4 flex items-center gap-3 hover:bg-sidebar-accent/10 rounded-lg transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                  <AvatarFallback className="text-lg">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {user?.username ? `@${user.username}` : 'Имя пользователя не указано'}
                  </h2>
                  <span className="text-sm text-muted-foreground hover:text-sidebar-foreground transition-colors">
                    {t('sidebar.viewProfile') || 'Посмотреть профиль'}
                  </span>
                </div>
              </Link>
            </SheetClose>
            
            <Separator className="bg-sidebar-border" />
            
            <div className="flex-1 py-4 space-y-5">
              {/* Theme toggle */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  {baseTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span>{t('sidebar.theme')}</span>
                </div>
                <Switch 
                  id="theme-mode"
                  checked={baseTheme === 'dark'}
                  onCheckedChange={toggleBaseTheme}
                />
              </div>
              
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
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span>{t('sidebar.settings')}</span>
                </div>
                <SettingsDialog />
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
      
      {/* Search bar */}
      <SearchBar />
      
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
