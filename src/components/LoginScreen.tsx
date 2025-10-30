
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInternet } from '@/context/InternetContext';
import RegisterForm from './RegisterForm';
import ConnectionStatus from './ConnectionStatus';

export default function LoginScreen() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { isOnline } = useInternet();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">ReadNest</h1>
      <p className="text-muted-foreground mb-6 text-center text-sm">
        {t('auth.welcome')}
      </p>
      
      <ConnectionStatus showAlert={!isOnline} />
      
      <RegisterForm />
      
      <div className="text-xs text-muted-foreground mt-6 text-center">
        <p>© 2025 ReadNest. {t('auth.terms')}</p>
      </div>
    </div>
  );
}
