
import React, { useState } from 'react';
import { useInternet } from '@/context/InternetContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wifi, WifiOff, RotateCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ConnectionStatusProps {
  showAlert?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ showAlert = true }) => {
  const { isOnline, checkConnection, lastChecked } = useInternet();
  const [isChecking, setIsChecking] = useState(false);

  const handleRetry = async () => {
    setIsChecking(true);
    const online = await checkConnection();
    setIsChecking(false);
    
    if (online) {
      toast.success("Соединение восстановлено", {
        description: "Приложение снова в сети",
        position: "bottom-center",
      });
    }
  };

  if (isOnline) return null;

  if (!showAlert) return null;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        Наше приложение скучает по интернету...🥺
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          Пожалуйста, проверьте ваше подключение и дайте нам снова соединиться.
        </div>
        <Button
          size="sm"
          className="mt-2 gap-1"
          onClick={handleRetry}
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin" />
              Проверяем...
            </>
          ) : (
            <>
              <RotateCw className="h-4 w-4" />
              Повторить попытку
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
