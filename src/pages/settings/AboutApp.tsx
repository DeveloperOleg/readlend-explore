import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, User, Mail, MessageCircle, Bug, Play, Square, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  details?: any;
}

const AboutAppPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showSymbol, setShowSymbol] = useState(false);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const originalConsole = useRef<any>({});
  const eventListenersRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Store original console methods
    originalConsole.current = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };

    return () => {
      // Cleanup: restore original console methods and remove event listeners
      if (isLogging) {
        stopLogging();
      }
    };
  }, []);

  const addLog = (level: LogEntry['level'], message: string, details?: any) => {
    if (!isLogging) return;
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };
    
    setLogs(prev => [...prev, logEntry]);
  };

  const startLogging = () => {
    setIsLogging(true);
    setLogs([]);
    
    // Clear previous event listeners
    eventListenersRef.current.forEach(cleanup => cleanup());
    eventListenersRef.current = [];
    
    // Add initial log entry
    const initialLog: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Logging session started',
      details: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    };
    setLogs([initialLog]);

    // Override console methods to capture logs
    console.log = (...args) => {
      originalConsole.current.log(...args);
      addLog('info', args.join(' '), args);
    };

    console.warn = (...args) => {
      originalConsole.current.warn(...args);
      addLog('warn', args.join(' '), args);
    };

    console.error = (...args) => {
      originalConsole.current.error(...args);
      addLog('error', args.join(' '), args);
    };

    console.info = (...args) => {
      originalConsole.current.info(...args);
      addLog('info', args.join(' '), args);
    };

    // Log navigation changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      addLog('debug', 'Navigation: pushState', args);
      return originalPushState.apply(this, args);
    };

    // Log clicks and interactions
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      addLog('debug', 'User interaction: click', {
        element: target.tagName,
        className: target.className,
        textContent: target.textContent?.substring(0, 50)
      });
    };

    document.addEventListener('click', clickHandler);
    
    // Store cleanup function
    eventListenersRef.current.push(() => {
      document.removeEventListener('click', clickHandler);
      history.pushState = originalPushState;
    });

    toast.success('Logging started', {
      description: 'Application behavior is now being tracked',
      position: "bottom-center"
    });
  };

  const stopLogging = () => {
    if (!isLogging) return;
    
    setIsLogging(false);
    
    // Restore original console methods
    console.log = originalConsole.current.log;
    console.warn = originalConsole.current.warn;
    console.error = originalConsole.current.error;
    console.info = originalConsole.current.info;

    // Clean up event listeners
    eventListenersRef.current.forEach(cleanup => cleanup());
    eventListenersRef.current = [];

    // Add final log entry
    addLog('info', 'Logging session ended', {
      totalLogs: logs.length,
      sessionDuration: logs.length > 0 ? 
        new Date().getTime() - new Date(logs[0].timestamp).getTime() : 0
    });

    toast.success('Logging stopped', {
      description: `Captured ${logs.length} log entries`,
      position: "bottom-center"
    });
  };

  const downloadLogs = () => {
    if (logs.length === 0) {
      toast.error('No logs to download');
      return;
    }

    const logData = {
      sessionInfo: {
        startTime: logs[0]?.timestamp,
        endTime: new Date().toISOString(),
        totalEntries: logs.length,
        userAgent: navigator.userAgent,
        url: window.location.href,
        appVersion: '1.0.0'
      },
      logs: logs,
      systemInfo: {
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    const dataStr = JSON.stringify(logData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `readnest-logs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Logs downloaded successfully');
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleVersionClick = () => {
    setShowSymbol(true);
    setTimeout(() => setShowSymbol(false), 2000);
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

            {/* Logging Section */}
            <div className="border rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Application Logging</h4>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isLogging ? (
                    <Square className="h-4 w-4 text-red-500" />
                  ) : (
                    <Play className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    {isLogging ? 'Logging Active' : 'Logging Inactive'}
                  </span>
                </div>
                <Switch 
                  checked={isLogging}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      startLogging();
                    } else {
                      stopLogging();
                    }
                  }}
                />
              </div>

              {logs.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  Current session: {logs.length} entries
                </div>
              )}

              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start" 
                onClick={downloadLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Log File
              </Button>
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
