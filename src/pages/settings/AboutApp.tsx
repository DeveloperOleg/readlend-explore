
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, User, Mail, MessageCircle, Bug } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AboutAppPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showSymbol, setShowSymbol] = useState(false);
  const [showDebugMenu, setShowDebugMenu] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const handleVersionClick = () => {
    setShowSymbol(true);
    setTimeout(() => setShowSymbol(false), 2000); // Hide symbol after 2 seconds
  };

  const handleVersionDoubleClick = () => {
    setShowDebugMenu(true);
  };

  const clearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Error clearing cache');
    }
  };

  const exportLogs = () => {
    const logs = {
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `readnest-debug-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Debug logs exported');
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('settings.about')}</h1>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('settings.about')}</h2>
      </div>

      <div className="space-y-4">
        {/* Version Section */}
        <div className="rounded-lg border p-3">
          <h3 className="font-medium text-base mb-2">
            {t('settings.version')}
          </h3>
          <div 
            className="text-sm text-muted-foreground cursor-pointer select-none"
            onClick={handleVersionClick}
            onDoubleClick={handleVersionDoubleClick}
          >
            <p className="font-medium flex items-center gap-2">
              1.0.0
              {showSymbol && <span className="text-lg">¯\_(ツ)_/¯</span>}
            </p>
            <p className="italic mt-1">{t('settings.earlyVersion')}</p>
          </div>
        </div>

        {/* Developer Information */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-base">Developer</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Olegaxaca</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg border p-3">
          <h3 className="font-medium text-base mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Email:</span>
              <a 
                href="mailto:oefanov75@gmail.com" 
                className="text-primary hover:underline"
              >
                oefanov75@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Telegram:</span>
              <a 
                href="https://t.me/GaxacaBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @GaxacaBot
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Menu Dialog */}
      <Dialog open={showDebugMenu} onOpenChange={setShowDebugMenu}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" />
              <DialogTitle>Debug Menu</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Test version debugging tools</p>
              <p className="text-xs mt-1">Use with caution - these actions may affect app functionality</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={clearCache}
              >
                Clear All Cache
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={exportLogs}
              >
                Export Debug Logs
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => window.location.reload()}
              >
                Force Reload App
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground border-t pt-2">
              <p>Debug Menu v1.0</p>
              <p>Build: {new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutAppPage;
