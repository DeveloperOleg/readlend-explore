
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, AlertTriangle, Shield, Info, Copy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Defiance System ban levels
const banLevels = [
  { level: 1, name: 'Caution', nameLoc: 'Осторожность', description: 'Warning issued to the user' },
  { level: 2, name: '24-Hour Restriction', nameLoc: 'Ограничение на 24 часа', description: 'User restricted for 24 hours' },
  { level: 3, name: 'Week of Silence', nameLoc: 'Неделя молчания', description: 'User cannot post for 7 days' },
  { level: 4, name: '30-Day Isolation', nameLoc: '30-дневная изоляция', description: 'User cannot interact for 30 days' },
  { level: 5, name: 'Ultimate Ban', nameLoc: 'Окончательный бан', description: 'Account blocked at device level' }
];

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

  const getBanStatus = () => {
    // For demo purposes, return no ban status for test accounts
    // In a real app, this would come from the user's banStatus field
    if (user?.banStatus) {
      const banLevel = banLevels.find(level => level.level === user.banStatus!.level);
      return {
        ...user.banStatus,
        levelInfo: banLevel
      };
    }
    return null;
  };

  const handleCopyUserId = () => {
    if (user?.displayId) {
      navigator.clipboard.writeText(user.displayId);
      toast({
        title: t('profile.usernameCopied') || 'ID скопирован',
        description: `#${user.displayId}`,
      });
    }
  };

  const banStatus = getBanStatus();

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('settings.account')}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">Об аккаунте</TabsTrigger>
            <TabsTrigger value="status">Статус аккаунта</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
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
                  <Label className="flex items-center gap-2">
                    {t('profile.userID') || 'ID пользователя'}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleCopyUserId}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </Label>
                  <Input 
                    value={`#${user?.displayId || ''}`} 
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
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Статус аккаунта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {banStatus ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-medium text-red-800">Аккаунт заблокирован</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-red-700">
                          <span className="font-medium">Уровень:</span> {banStatus.levelInfo?.level} - {banStatus.levelInfo?.nameLoc}
                        </p>
                        {banStatus.reason && (
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Причина:</span> {banStatus.reason}
                          </p>
                        )}
                        {banStatus.expiresAt && (
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Истекает:</span> {new Date(banStatus.expiresAt).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-green-800">Аккаунт активен</h3>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Ваш аккаунт находится в хорошем состоянии и не имеет ограничений.
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Defiance System (Система Неповиновения)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    В будущем будет интегрирована система бана по уровням в полноценной версии приложения.
                  </p>
                  <div className="space-y-3">
                    {banLevels.map((level) => (
                      <div 
                        key={level.level} 
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          banStatus?.level === level.level 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          banStatus?.level === level.level
                            ? 'bg-red-100 text-red-600'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {level.level}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            banStatus?.level === level.level ? 'text-red-800' : ''
                          }`}>
                            {level.name} ({level.nameLoc})
                          </p>
                          <p className={`text-xs ${
                            banStatus?.level === level.level ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {level.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default AccountSettings;
