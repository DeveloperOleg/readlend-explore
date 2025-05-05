
import React, { useState, useEffect } from 'react';
import { HardDrive, Database, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const StorageSettings: React.FC = () => {
  const { t } = useLanguage();
  const [storageData, setStorageData] = useState({
    appSize: '0 MB',
    cacheSize: '0 MB',
    offlineContentSize: '0 MB'
  });
  const [isClearing, setIsClearing] = useState(false);

  // Simulate fetching storage data
  useEffect(() => {
    // In a real app, this would come from the device's storage API
    // For now, we'll use mock data
    setStorageData({
      appSize: '24.5 MB',
      cacheSize: '3.8 MB',
      offlineContentSize: '7.2 MB'
    });
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      // Simulate cache clearing with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the shown cache size
      setStorageData(prev => ({
        ...prev,
        cacheSize: '0 MB'
      }));
      
      toast.success(t('storage.cacheCleared'));
    } catch (error) {
      toast.error(t('storage.clearError'));
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            {t('storage.appSize')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <span className="font-medium">{storageData.appSize}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            {t('storage.cacheSize')}
          </CardTitle>
          <CardDescription>
            {t('storage.cacheDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="font-medium">{storageData.cacheSize}</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex gap-2" 
              onClick={handleClearCache}
              disabled={isClearing || storageData.cacheSize === '0 MB'}
            >
              <Trash className="h-4 w-4" />
              {t('storage.clearCache')}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t('storage.restartRecommended')}
            </p>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            {t('storage.offlineContent')}
          </CardTitle>
          <CardDescription>
            {t('storage.offlineDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <span className="font-medium">{storageData.offlineContentSize}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSettings;
