
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, RotateCw } from "lucide-react";

interface InternetContextType {
  isOnline: boolean;
  checkConnection: () => Promise<boolean>;
  lastChecked: Date | null;
}

const defaultContext: InternetContextType = {
  isOnline: navigator.onLine,
  checkConnection: () => Promise.resolve(navigator.onLine),
  lastChecked: null,
};

export const InternetContext = createContext<InternetContextType>(defaultContext);

interface InternetProviderProps {
  children: ReactNode;
}

export const InternetProvider: React.FC<InternetProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to check actual connectivity
      await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-cache',
        // Short timeout to avoid long waits
        signal: AbortSignal.timeout(5000) 
      });
      setIsOnline(true);
      setLastChecked(new Date());
      return true;
    } catch (error) {
      setIsOnline(false);
      setLastChecked(new Date());
      return false;
    }
  }, []);

  const handleConnectionChange = useCallback(() => {
    const previousState = isOnline;
    const currentState = navigator.onLine;
    
    if (previousState !== currentState) {
      setIsOnline(currentState);
      
      if (currentState) {
        // Connection restored
        toast.success("Соединение восстановлено", {
          description: "Приложение снова в сети",
          position: "bottom-center",
        });
      } else {
        // Connection lost
        toast.error("Наше приложение скучает по интернету...🥺", {
          description: "Пожалуйста, проверьте ваше подключение и дайте нам снова соединиться.",
          position: "bottom-center",
          duration: 10000,
          action: {
            label: "Повторить попытку",
            onClick: () => checkConnection(),
          },
        });
      }
    }
  }, [isOnline, checkConnection]);

  useEffect(() => {
    // Initial connection check
    checkConnection();

    // Add event listeners for online/offline events
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Set up periodic connection checks
    const intervalId = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      clearInterval(intervalId);
    };
  }, [checkConnection, handleConnectionChange]);

  return (
    <InternetContext.Provider value={{ isOnline, checkConnection, lastChecked }}>
      {children}
    </InternetContext.Provider>
  );
};

export const useInternet = () => {
  const context = React.useContext(InternetContext);
  if (context === undefined) {
    throw new Error('useInternet must be used within an InternetProvider');
  }
  return context;
};
