
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
  
  // Simulate VPN detection when component loads
  useEffect(() => {
    // This is a simulation for demo purposes only
    const simulateVpnCheck = () => {
      // In a real application, this would be an API call to check for VPN
      // Here we're using a random number to simulate VPN detection
      const hasVpn = Math.random() < 0.6; // 60% chance of detecting VPN
      console.log("Initial VPN check:", hasVpn);
      
      if (hasVpn) {
        setVpnDetected(true);
        setShowCaptcha(true);
      } else {
        setVpnDetected(false);
      }
    };
    
    // Run the check when component mounts
    simulateVpnCheck();
  }, []);
  
  // Method for external components to request a VPN check
  const detectVpn = () => {
    const hasVpn = Math.random() < 0.6; // 60% chance of detecting VPN
    console.log("Manual VPN check result:", hasVpn);
    
    setVpnDetected(hasVpn);
    if (hasVpn) {
      setShowCaptcha(true);
    }
    
    return hasVpn;
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
