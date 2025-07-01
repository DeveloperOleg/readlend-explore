
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AvatarSection from './profile/AvatarSection';
import BioSection from './profile/BioSection';
import { profileFormSchema, ProfileFormValues } from './profile/ProfileFormSchema';
import { validateUsername, validateBio, sanitizeHtml } from '@/utils/validationUtils';

const ProfileEditor: React.FC = () => {
  const { user, updateProfile } = useAuth();
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
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    // Validate and sanitize inputs
    const usernameValidation = validateUsername(values.username);
    if (!usernameValidation.isValid) {
      toast({
        title: t('profile.updateError') || 'Ошибка',
        description: usernameValidation.message,
        variant: 'destructive',
      });
      return;
    }

    const bioValidation = validateBio(values.bio);
    if (!bioValidation.isValid) {
      toast({
        title: t('profile.updateError') || 'Ошибка',
        description: bioValidation.message,
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Sanitize all inputs
      const sanitizedData = {
        username: sanitizeHtml(values.username.trim()),
        firstName: sanitizeHtml(values.firstName?.trim() || ''),
        lastName: sanitizeHtml(values.lastName?.trim() || ''),
        bio: bioValidation.sanitized,
        avatarUrl: avatarPreview || undefined,
      };

      await updateProfile(sanitizedData);
      
      toast({
        title: t('profile.updateSuccess') || 'Профиль обновлен',
        description: t('profile.updateSuccessMessage') || 'Ваш профиль был успешно обновлен',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: t('profile.updateError') || 'Ошибка',
        description: t('profile.updateErrorMessage') || 'Произошла ошибка при обновлении профиля',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AvatarSection 
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          avatarError={avatarError}
          setAvatarError={setAvatarError}
          username={user?.username}
        />
      
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
                  maxLength={20}
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
                <Input 
                  placeholder={t('profile.firstNamePlaceholder') || 'Введите ваше имя'} 
                  {...field} 
                  maxLength={50}
                />
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
                <Input 
                  placeholder={t('profile.lastNamePlaceholder') || 'Введите вашу фамилию (по желанию)'} 
                  {...field} 
                  maxLength={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <BioSection form={form} />
        
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
  );
};

export default ProfileEditor;
