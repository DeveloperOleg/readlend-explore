
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import RegisterForm from './RegisterForm';
import Captcha from './Captcha';

export default function LoginScreen() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [vpnDetected, setVpnDetected] = useState(false);
  
  // Улучшенная симуляция обнаружения VPN - теперь выполняется при загрузке компонента
  useEffect(() => {
    // Для демо, с вероятностью 60% обнаружим VPN
    const checkVpn = () => {
      const isVpn = Math.random() < 0.6;
      console.log("VPN check result:", isVpn);
      setVpnDetected(isVpn);
      if (isVpn) {
        setShowCaptcha(true);
      }
    };
    
    // Проверяем VPN при монтировании компонента
    checkVpn();
  }, []);
  
  // Метод для внешних компонентов, чтобы запросить проверку VPN
  const detectVpn = () => {
    // Если VPN уже обнаружен, просто возвращаем текущее значение
    if (vpnDetected) {
      setShowCaptcha(true);
      return true;
    }
    
    // Иначе выполняем новую проверку
    const isVpn = Math.random() < 0.6;
    console.log("Manual VPN check result:", isVpn);
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
