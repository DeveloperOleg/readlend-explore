
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, RefreshCw, Copy, Check, Shield, Smartphone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { hashPassword, verifyPassword, isPasswordStrong } from '@/utils/passwordUtils';
import { validateUsername } from '@/utils/validationUtils';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';

const SecuritySettings: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ isStrong: boolean; message: string }>({ isStrong: false, message: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Check if 2FA is already enabled
  useEffect(() => {
    const check2FAStatus = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const factors = await supabase.auth.mfa.listFactors();
          setTwoFactorEnabled(factors.data?.totp && factors.data.totp.length > 0);
        }
      } catch (error) {
        console.error('Error checking 2FA status:', error);
      }
    };
    check2FAStatus();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const enable2FA = async () => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'ReadNest'
      });

      if (error) throw error;

      if (data) {
        setQrCodeUrl(data.totp.qr_code);
        setShowQRCode(true);
        toast({
          title: t('security.twoFactor.qrCodeGenerated'),
        });
      }
    } catch (error: any) {
      console.error('2FA enrollment error:', error);
      toast({
        title: t('security.twoFactor.enableError'),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: t('security.twoFactor.invalidCode'),
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);
      const factors = await supabase.auth.mfa.listFactors();
      const factorId = factors.data?.totp?.[0]?.id;

      if (!factorId) {
        throw new Error('No factor ID found');
      }

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verificationCode
      });

      if (error) throw error;

      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode('');
      toast({
        title: t('security.twoFactor.enabled'),
      });
    } catch (error: any) {
      console.error('2FA verification error:', error);
      toast({
        title: t('security.twoFactor.verificationError'),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const disable2FA = async () => {
    try {
      setIsSaving(true);
      const factors = await supabase.auth.mfa.listFactors();
      const factorId = factors.data?.totp?.[0]?.id;

      if (!factorId) {
        throw new Error('No factor ID found');
      }

      const { error } = await supabase.auth.mfa.unenroll({ factorId });

      if (error) throw error;

      setTwoFactorEnabled(false);
      toast({
        title: t('security.twoFactor.disabled'),
      });
    } catch (error: any) {
      console.error('2FA disable error:', error);
      toast({
        title: t('security.twoFactor.disableError'),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Digit
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special
    
    // Fill the rest randomly
    for (let i = 4; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password
    const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setGeneratedPassword(shuffled);
    setNewPassword(shuffled);
    setConfirmPassword(shuffled);
    
    const strength = isPasswordStrong(shuffled);
    setPasswordStrength(strength);
    
    toast({
      title: 'Пароль сгенерирован',
      description: 'Сильный пароль создан. Рекомендуем скопировать его для сохранения.',
    });
  };

  const copyPassword = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        setIsPasswordCopied(true);
        toast({
          title: 'Пароль скопирован',
          description: 'Пароль скопирован в буфер обмена',
        });
        
        setTimeout(() => {
          setIsPasswordCopied(false);
        }, 2000);
      } catch (error) {
        toast({
          title: 'Ошибка копирования',
          description: 'Не удалось скопировать пароль',
          variant: 'destructive',
        });
      }
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordStrength(isPasswordStrong(value));
  };

  const savePassword = async () => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Пользователь не авторизован',
        variant: 'destructive',
      });
      return;
    }

    if (!currentPassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите текущий пароль',
        variant: 'destructive',
      });
      return;
    }

    const passwordValidation = isPasswordStrong(newPassword);
    if (!passwordValidation.isStrong) {
      toast({
        title: 'Ошибка',
        description: passwordValidation.message,
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Новые пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // For test account, skip password verification
      if (user.isTestAccount) {
        if (currentPassword !== 'tester111') {
          toast({
            title: 'Ошибка',
            description: 'Неверный текущий пароль',
            variant: 'destructive',
          });
          setIsSaving(false);
          return;
        }
      } else {
        // Verify current password for real accounts
        const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
        const accounts = JSON.parse(storedAccounts);
        const userAccount = accounts[user.username];
        
        if (!userAccount) {
          toast({
            title: 'Ошибка',
            description: 'Аккаунт не найден',
            variant: 'destructive',
          });
          setIsSaving(false);
          return;
        }
        
        let currentPasswordValid = false;
        if (userAccount.isHashed) {
          currentPasswordValid = await verifyPassword(currentPassword, userAccount.password);
        } else {
          currentPasswordValid = userAccount.password === currentPassword;
        }
        
        if (!currentPasswordValid) {
          toast({
            title: 'Ошибка',
            description: 'Неверный текущий пароль',
            variant: 'destructive',
          });
          setIsSaving(false);
          return;
        }
        
        // Update stored password with new hashed password
        const hashedNewPassword = await hashPassword(newPassword);
        userAccount.password = hashedNewPassword;
        userAccount.isHashed = true;
        localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
      }
      
      toast({
        title: 'Пароль изменен',
        description: 'Ваш пароль был успешно изменен',
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setGeneratedPassword('');
      setPasswordStrength({ isStrong: false, message: '' });
      
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при изменении пароля',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Безопасность</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Регулярно обновляйте пароль и используйте сильные пароли для защиты вашего аккаунта.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Изменить пароль
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Текущий пароль</Label>
                <div className="relative mt-1">
                  <Input 
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Введите текущий пароль"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Новый пароль</Label>
                <div className="relative mt-1">
                  <Input 
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    className="pr-10"
                    placeholder="Введите новый пароль"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {newPassword && (
                  <p className={`text-sm mt-1 ${passwordStrength.isStrong ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordStrength.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Подтвердите новый пароль</Label>
                <div className="relative mt-1">
                  <Input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Повторите новый пароль"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm mt-1 text-red-600">
                    Пароли не совпадают
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={generateSecurePassword}
                  className="flex items-center gap-2 flex-1"
                >
                  <RefreshCw className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Сгенерировать пароль</span>
                </Button>
                
                {generatedPassword && (
                  <Button 
                    variant="outline" 
                    onClick={copyPassword}
                    className="flex items-center gap-2 flex-shrink-0 min-w-0"
                  >
                    {isPasswordCopied ? (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {isPasswordCopied ? 'Скопировано' : 'Копировать'}
                    </span>
                  </Button>
                )}
              </div>

              <Button 
                onClick={savePassword}
                disabled={isSaving || !passwordStrength.isStrong || newPassword !== confirmPassword}
                className="w-full"
              >
                {isSaving ? 'Сохранение...' : 'Сохранить пароль'}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <CardTitle>{t('security.twoFactor.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('security.twoFactor.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('security.twoFactor.status')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled ? t('security.twoFactor.enabled') : t('security.twoFactor.disabled')}
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      enable2FA();
                    } else {
                      disable2FA();
                    }
                  }}
                  disabled={isSaving || showQRCode}
                />
              </div>

              {showQRCode && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">{t('security.twoFactor.scanQR')}</p>
                    {qrCodeUrl && (
                      <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">{t('security.twoFactor.enterCode')}</Label>
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={verify2FA}
                      disabled={isSaving || verificationCode.length !== 6}
                      className="flex-1"
                    >
                      {isSaving ? t('common.saving') : t('security.twoFactor.verify')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowQRCode(false);
                        setVerificationCode('');
                      }}
                      disabled={isSaving}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SecuritySettings;
