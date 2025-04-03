import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Trash2, AlertCircle, Info, Image as ImageIcon, Hash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const MAX_AVATAR_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_AVATAR_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_COVER_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_IMAGE_DIMENSION = 200;
const MAX_IMAGE_DIMENSION = 1000;
const RECOMMENDED_COVER_WIDTH = 960;
const RECOMMENDED_COVER_HEIGHT = 479;

const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' })
    .max(20, { message: 'Имя пользователя должно содержать не более 20 символов' })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { 
      message: 'Имя пользователя должно начинаться с буквы и может содержать только латинские буквы, цифры и символ подчеркивания' 
    }),
  firstName: z.string().max(30).optional(),
  lastName: z.string().max(30).optional(),
  bio: z.string().max(500).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileEditor: React.FC = () => {
  const { user, updateProfile, toggleHideSubscriptions, toggleGlobalComments } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(user?.coverImageUrl || null);
  const [coverError, setCoverError] = useState<string | null>(null);

  const bioTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });

  const validateImageDimensions = (file: File, minWidth: number, minHeight: number, maxWidth: number, maxHeight: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src);
        
        if (width < minWidth || height < minHeight) {
          setAvatarError(t('profile.imageTooSmall') || `Изображение слишком маленькое. Минимальный размер ${minWidth}x${minHeight} пикселей`);
          resolve(false);
        } else if (width > maxWidth || height > maxHeight) {
          setAvatarError(t('profile.imageTooLarge') || `Изображение слишком большое. Максимальный размер ${maxWidth}x${maxWidth} пикселей`);
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

  const validateCoverDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src);
        
        const isOptimal = width === RECOMMENDED_COVER_WIDTH && height === RECOMMENDED_COVER_HEIGHT;
        if (!isOptimal) {
          setCoverError(t('profile.invalidCoverDimensions'));
          toast({
            title: t('profile.invalidCoverDimensionsTitle'),
            description: t('profile.invalidCoverDimensions'),
            variant: "info",
          });
        } else {
          setCoverError(null);
        }
        resolve(true);
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
      
      if (file.size > MAX_AVATAR_SIZE) {
        setAvatarError(t('profile.imageTooLarge') || 'Размер аватара не должен превышать 10МБ');
        toast({
          title: t('profile.imageTooLargeTitle') || 'Ошибка загрузки аватара',
          description: t('profile.imageTooLarge') || 'Размер аватара не должен превышать 10МБ',
          variant: 'destructive',
        });
        return;
      }
      
      if (!ALLOWED_AVATAR_FILE_TYPES.includes(file.type)) {
        setAvatarError(t('profile.unsupportedFormat') || 'Неподдерживаемый формат файла. Поддерживаются только JPEG, PNG и GIF');
        toast({
          title: t('profile.unsupportedFormatTitle') || 'Ошибка формата',
          description: t('profile.unsupportedFormat') || 'Неподдерживаемый формат файла. Поддерживаются только JPEG, PNG и GIF',
          variant: 'destructive',
        });
        return;
      }
      
      const isValidDimensions = await validateImageDimensions(file, MIN_IMAGE_DIMENSION, MIN_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION);
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

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > MAX_COVER_SIZE) {
        setCoverError(t('profile.coverTooLarge'));
        toast({
          title: t('profile.coverTooLargeTitle'),
          description: t('profile.coverTooLarge'),
          variant: 'destructive',
        });
        return;
      }
      
      if (!ALLOWED_COVER_FILE_TYPES.includes(file.type)) {
        setCoverError(t('profile.unsupportedCoverFormat'));
        toast({
          title: t('profile.unsupportedCoverFormatTitle'),
          description: t('profile.unsupportedCoverFormat'),
          variant: 'destructive',
        });
        return;
      }
      
      await validateCoverDimensions(file);
      
      setCoverFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
  };

  const handleDeleteCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setCoverError(null);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({ 
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio,
        avatarUrl: avatarPreview || undefined,
        coverImageUrl: coverPreview || undefined
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

  const addHashtag = () => {
    const bioField = form.getValues('bio') || '';
    const textarea = bioTextareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        const newBio = `${bioField.slice(0, start)}# ${bioField.slice(end)}`;
        form.setValue('bio', newBio);
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      } else {
        const selectedText = bioField.slice(start, end);
        const newBio = `${bioField.slice(0, start)}#${selectedText}${bioField.slice(end)}`;
        form.setValue('bio', newBio);
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(end + 1, end + 1);
        }, 0);
      }
    } else {
      form.setValue('bio', `${bioField} #`);
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
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">{t('profile.coverImage')}</h3>
              <div className="relative group rounded-md overflow-hidden border-2 border-border">
                <AspectRatio ratio={960/479} className="bg-muted">
                  {coverPreview ? (
                    <img 
                      src={coverPreview} 
                      alt="Cover" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-muted">
                      <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                    </div>
                  )}
                  
                  <label 
                    htmlFor="cover-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-8 w-8" />
                      <span className="text-sm font-medium">{t('profile.changeCover')}</span>
                    </div>
                    <input 
                      id="cover-upload" 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      className="sr-only" 
                      onChange={handleCoverChange} 
                    />
                  </label>
                </AspectRatio>
                
                {coverPreview && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/70" 
                    onClick={handleDeleteCover}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t('profile.deleteAvatar')}</span>
                  </Button>
                )}
              </div>
              
              {coverError && (
                <Alert variant="info" className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {coverError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert variant="info" className="mt-3">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    <li>{t('profile.coverSizeLimit')}</li>
                    <li>{t('profile.coverFormats')}</li>
                    <li>{t('profile.coverDimensions')}</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            
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
                    <li>{t('profile.avatarSizeLimit')}</li>
                    <li>{t('profile.avatarFormats')}</li>
                    <li>{t('profile.avatarDimensions')}</li>
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
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('profile.bio') || 'О себе'}</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs flex items-center gap-1"
                      onClick={addHashtag}
                    >
                      <Hash className="h-3 w-3" style={{ color: "#3B426E" }} />
                      <span>{t('editor.hashtag') || 'Хэштег'}</span>
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder={t('profile.bioPlaceholder') || 'Расскажите что-нибудь о себе...'}
                      className="min-h-[120px]"
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        bioTextareaRef.current = e;
                      }}
                    />
                  </FormControl>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>{t('profile.bioUseTips') || 'Совет:'} </span>
                    <span style={{ color: "#3B426E" }}>#хэштеги</span> 
                    {t('profile.bioUseHashtags') || ' можно использовать для выделения важных тем'}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading || !!avatarError || !!coverError}>
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
