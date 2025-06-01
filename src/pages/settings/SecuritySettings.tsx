
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SecuritySettings: React.FC = () => {
  const { t } = useLanguage();
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

  const goBack = () => {
    navigate(-1);
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setNewPassword(password);
    setConfirmPassword(password);
    
    toast({
      title: t('security.passwordGenerated'),
      description: 'Рекомендуем скопировать пароль для сохранения',
    });
  };

  const copyPassword = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setIsPasswordCopied(true);
      toast({
        title: t('security.passwordCopied'),
        description: 'Пароль скопирован в буфер обмена',
      });
      
      setTimeout(() => {
        setIsPasswordCopied(false);
      }, 2000);
    }
  };

  const savePassword = async () => {
    if (!currentPassword) {
      toast({
        title: t('common.error'),
        description: 'Введите текущий пароль',
        variant: 'destructive',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast({
        title: t('common.error'),
        description: 'Новый пароль должен содержать не менее 6 символов',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t('security.passwordMismatch'),
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    // Симуляция проверки текущего пароля и сохранения нового
    setTimeout(() => {
      // Здесь должна быть логика проверки текущего пароля
      toast({
        title: t('security.passwordChanged'),
        description: 'Ваш пароль был успешно изменен',
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setGeneratedPassword('');
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('settings.security')}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t('security.changePassword')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('security.currentPassword')}</Label>
              <div className="relative mt-1">
                <Input 
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
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
              <Label>{t('security.newPassword')}</Label>
              <div className="relative mt-1">
                <Input 
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
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
            </div>

            <div>
              <Label>{t('security.confirmPassword')}</Label>
              <div className="relative mt-1">
                <Input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
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
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={generateSecurePassword}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('security.generatePassword')}
              </Button>
              
              {generatedPassword && (
                <Button 
                  variant="outline" 
                  onClick={copyPassword}
                  className="flex items-center gap-2"
                >
                  {isPasswordCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {isPasswordCopied ? 'Скопировано' : t('security.copyPassword')}
                </Button>
              )}
            </div>

            <Button 
              onClick={savePassword}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Сохранение...' : t('security.savePassword')}
            </Button>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default SecuritySettings;
