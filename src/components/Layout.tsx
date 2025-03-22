
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Menu, 
  Moon, 
  Sun, 
  Languages, 
  LogOut
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import BottomNav from './BottomNav';
import SearchBar from './SearchBar';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Layout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* Sidebar/Menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-sidebar backdrop-blur-lg border-sidebar-border">
          <div className="flex flex-col h-full text-sidebar-foreground">
            <div className="py-6">
              <h2 className="text-2xl font-semibold tracking-tight px-4">ReadNest</h2>
            </div>
            
            <Separator className="bg-sidebar-border" />
            
            <div className="flex-1 py-6 space-y-6">
              {/* Theme toggle */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span>{t('sidebar.theme')}</span>
                </div>
                <Switch 
                  id="theme-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
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
            </div>
            
            <Separator className="bg-sidebar-border" />
            
            {/* Logout button */}
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 justify-start py-6 px-4 w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-none"
                onClick={logout}
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
      
      {/* Main content */}
      <main className="container px-4 pt-16 pb-4 animate-fade-in">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
