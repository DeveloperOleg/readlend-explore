
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2, AlertCircle, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_AVATAR_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MIN_IMAGE_DIMENSION = 200;
const MAX_IMAGE_DIMENSION = 1000;

const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' })
    .max(20, { message: 'Имя пользователя должно содержать не более 20 символов' })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { 
      message: 'Имя пользователя должно начинаться с буквы и может содержать только латинские буквы, цифры и символ подчеркивания' 
    }),
  firstName: z.string().max(30).optional(),
  lastName: z.string().max(30).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileEditor: React.FC = () => {
  const { user, updateProfile, toggleHideSubscriptions, toggleGlobalComments } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src);
        
        if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
          setAvatarError(t('profile.imageTooSmall') || `Изображение слишком маленькое. Минимальный размер ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION} пикселей`);
          resolve(false);
        } else if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          setAvatarError(t('profile.imageTooLarge') || `Изображение слишком большое. Максимальный размер ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} пикселей`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      
      img.onerror = () => {
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Проверка размера файла
      if (file.size > MAX_AVATAR_SIZE) {
        setAvatarError(t('profile.avatarTooLarge') || 'Размер аватара не должен превышать 10МБ');
        toast({
          title: t('profile.avatarTooLargeTitle') || 'Ошибка загрузки аватара',
          description: t('profile.avatarTooLarge') || 'Размер аватара не должен превышать 10МБ',
          variant: 'destructive',
        });
        return;
      }
      
      // Проверка формата файла
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setAvatarError(t('profile.unsupportedFormat') || 'Неподдерживаемый формат файла. Поддерживаются только JPEG, PNG и GIF');
        toast({
          title: t('profile.unsupportedFormatTitle') || 'Ошибка формата',
          description: t('profile.unsupportedFormat') || 'Неподдерживаемый формат файла. Поддерживаются только JPEG, PNG и GIF',
          variant: 'destructive',
        });
        return;
      }
      
      // Проверка размеров изображения
      const isValidDimensions = await validateImageDimensions(file);
      if (!isValidDimensions) {
        toast({
          title: t('profile.invalidDimensionsTitle') || 'Ошибка размеров изображения',
          description: avatarError,
          variant: 'destructive',
        });
        return;
      }
      
      setAvatarFile(file);
      setAvatarError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({ 
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        avatarUrl: avatarPreview || undefined
      });
      
      toast({
        title: t('profile.updateSuccess') || 'Профиль обновлен',
        description: t('profile.updateSuccessMessage') || 'Ваш профиль был успешно обновлен',
      });
    } catch (error) {
      toast({
        title: t('profile.updateError') || 'Ошибка',
        description: t('profile.updateErrorMessage') || 'Произошла ошибка при обновлении профиля',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePrivacy = async (value: boolean) => {
    setIsLoading(true);
    try {
      await toggleHideSubscriptions(value);
      toast({
        title: t('profile.privacyUpdated') || 'Настройки конфиденциальности обновлены',
        description: value 
          ? (t('profile.subscriptionsHidden') || 'Ваши подписки теперь скрыты от других пользователей') 
          : (t('profile.subscriptionsVisible') || 'Ваши подписки теперь видны другим пользователям'),
      });
    } catch (error) {
      toast({
        title: t('profile.updateError') || 'Ошибка',
        description: t('profile.privacyUpdateError') || 'Произошла ошибка при обновлении настроек конфиденциальности',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComments = async (value: boolean) => {
    setIsLoading(true);
    try {
      await toggleGlobalComments(value);
      toast({
        title: t('profile.commentsUpdated') || 'Настройки комментариев обновлены',
        description: value 
          ? (t('profile.commentsEnabled') || 'Комментарии включены для всех ваших книг') 
          : (t('profile.commentsDisabled') || 'Комментарии отключены для всех ваших книг'),
      });
    } catch (error) {
      toast({
        title: t('profile.updateError') || 'Ошибка',
        description: t('profile.commentsUpdateError') || 'Произошла ошибка при обновлении настроек комментариев',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList>
        <TabsTrigger value="info">{t('profile.personalInfo') || 'Личная информация'}</TabsTrigger>
        <TabsTrigger value="privacy">{t('profile.privacy') || 'Конфиденциальность'}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={avatarPreview || ''} alt={user?.username} />
                  <AvatarFallback className="text-2xl">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-6 w-6" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/jpeg,image/png,image/gif" 
                    className="sr-only" 
                    onChange={handleAvatarChange} 
                  />
                </label>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-muted-foreground">
                  {t('profile.changeAvatar') || 'Нажмите на аватарку, чтобы изменить'}
                </p>
                {avatarPreview && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive" 
                    onClick={handleDeleteAvatar}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t('profile.deleteAvatar') || 'Удалить аватар'}</span>
                  </Button>
                )}
              </div>
              
              {avatarError && (
                <Alert variant="destructive" className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {avatarError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert variant="info" className="mt-3">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    <li>{t('profile.avatarSizeLimit') || 'Максимальный размер файла: 10МБ'}</li>
                    <li>{t('profile.avatarFormats') || 'Поддерживаемые форматы: JPEG, PNG, GIF'}</li>
                    <li>{t('profile.avatarDimensions') || 'Рекомендуемый размер: 200x200 до 1000x1000 пикселей'}</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              {user?.displayId && (
                <div className="mt-4 p-2 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {t('profile.userID') || 'ID пользователя'}: <span className="font-mono font-medium">{user.displayId}</span>
                  </p>
                </div>
              )}
            </div>
          
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.username') || 'Имя пользователя'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={field.value ? field.value : "Не указано"} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.firstName') || 'Имя'}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('profile.firstNamePlaceholder') || 'Введите ваше имя'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.lastName') || 'Фамилия'}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('profile.lastNamePlaceholder') || 'Введите вашу фамилию (по желанию)'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading || !!avatarError}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>{t('profile.saving') || 'Сохранение...'}</span>
                </div>
              ) : (
                t('profile.saveChanges') || 'Сохранить изменения'
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="privacy">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.privacySettings') || 'Настройки конфиденциальности'}</CardTitle>
            <CardDescription>
              {t('profile.privacyDescription') || 'Настройте параметры конфиденциальности вашего профиля'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">{t('profile.hideSubscriptions') || 'Скрыть мои подписки'}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('profile.hideSubscriptionsDescription') || 'Другие пользователи не смогут видеть, на кого вы подписаны'}
                </p>
              </div>
              <Switch 
                checked={user?.privacy?.hideSubscriptions || false}
                onCheckedChange={handleTogglePrivacy}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">{t('profile.allowComments') || 'Разрешить комментарии к книгам'}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('profile.allowCommentsDescription') || 'Пользователи смогут оставлять комментарии к вашим книгам'}
                </p>
              </div>
              <Switch 
                checked={user?.privacy?.commentSettings?.global || false}
                onCheckedChange={handleToggleComments}
                disabled={isLoading}
              />
            </div>
            
            {user?.publishedBooks && user.publishedBooks.length > 0 && (
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">
                  {t('profile.perBookCommentsSettings') || 'Настройки комментариев для отдельных книг'}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {t('profile.perBookCommentsDescription') || 'Настройте возможность комментирования для каждой книги отдельно'}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground italic">
                    {t('profile.noPublishedBooks') || 'У вас пока нет опубликованных книг'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileEditor;
