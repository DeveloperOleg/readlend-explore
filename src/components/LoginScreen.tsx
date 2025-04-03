
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import RegisterForm from './RegisterForm';
import Captcha from './Captcha';

export default function LoginScreen() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [vpnDetected, setVpnDetected] = useState(false);
  
  // Simulate VPN detection - in a real app, this would be done with an API
  const detectVpn = () => {
    // For demo, randomly detect VPN 30% of the time
    const isVpn = Math.random() < 0.3;
    setVpnDetected(isVpn);
    setShowCaptcha(isVpn);
    return isVpn;
  };
  
  const handleCaptchaVerify = (verified: boolean) => {
    if (verified) {
      setShowCaptcha(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">ReadNest</h1>
      <p className="text-muted-foreground mb-6 text-center text-sm">
        {t('auth.welcome') || 'Добро пожаловать в ReadNest - платформу для писателей и читателей'}
      </p>
      
      {showCaptcha ? (
        <Captcha 
          onVerify={handleCaptchaVerify} 
          onCancel={() => setShowCaptcha(false)} 
        />
      ) : (
        <RegisterForm detectVpn={detectVpn} vpnDetected={vpnDetected} />
      )}
      
      <div className="text-xs text-muted-foreground mt-6 text-center">
        <p>© 2024 ReadNest. Все права защищены.</p>
        <p className="mt-1">
          {t('auth.terms') || 'Используя это приложение, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности.'}
        </p>
      </div>
    </div>
  );
}
