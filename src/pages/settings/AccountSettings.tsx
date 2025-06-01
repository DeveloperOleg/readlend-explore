
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AccountSettings: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const saveEmail = async () => {
    if (!email.trim()) {
      toast({
        title: t('common.error'),
        description: 'Email не может быть пустым',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    // Симуляция сохранения email
    setTimeout(() => {
      toast({
        title: t('account.emailSaved'),
        description: 'Email для восстановления аккаунта сохранен',
      });
      setIsSaving(false);
    }, 1000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getRegistrationDate = () => {
    // Для тестового аккаунта возвращаем фиксированную дату
    if (user?.isTestAccount) {
      return '22.03.2025';
    }
    // Для реальных аккаунтов можно извлечь дату из ID или использовать другую логику
    return '22.03.2025';
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('settings.account')}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Информация об аккаунте
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('account.username')}</Label>
                <Input 
                  value={user?.username || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>

              <div>
                <Label>{t('account.email')}</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    type="email"
                    placeholder={t('account.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button 
                    onClick={saveEmail}
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('account.registrationDate')}
                </Label>
                <Input 
                  value={getRegistrationDate()} 
                  disabled 
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Управление аккаунтом
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    {t('account.deactivateAccount')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Деактивировать аккаунт</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите деактивировать свой аккаунт? Это действие временно скроет ваш профиль и контент от других пользователей.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction className="bg-orange-600 hover:bg-orange-700">
                      Деактивировать
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    {t('account.deleteAccount')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить аккаунт</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите навсегда удалить свой аккаунт? Это действие необратимо и приведет к удалению всех ваших данных, включая книги и комментарии.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Удалить навсегда
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AccountSettings;
