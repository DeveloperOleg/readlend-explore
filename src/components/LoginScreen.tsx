
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
        {t('auth.welcome') || 'Добро пожаловать в ReadNest - платформу для писателей и читателей'}
      </p>
      
      <ConnectionStatus showAlert={!isOnline} />
      
      <RegisterForm />
      
      <div className="text-xs text-muted-foreground mt-6 text-center">
        <p>© 2024 ReadNest. Все права защищены.</p>
        <p className="mt-1">
          {t('auth.terms') || 'Используя это приложение, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности.'}
        </p>
      </div>
    </div>
  );
}
