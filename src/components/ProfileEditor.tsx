
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20 bg-[#6366F1] text-white">
              <AvatarImage src={avatarPreview || user?.avatarUrl} alt="Profile" />
              <AvatarFallback className="bg-[#6366F1] text-white text-2xl font-medium">
                {(user?.username || 'T').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Нажмите на аватар, чтобы изменить
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Максимальный размер файла: 10MB</p>
              <p>• Поддерживаемые форматы: JPG, PNG, GIF</p>
              <p>• Рекомендуемый размер: 200×200 to 1000×1000 pixels</p>
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Имя пользователя</FormLabel>
              <FormControl>
                <Input 
                  placeholder={user?.username || 'tester111'} 
                  {...field} 
                  maxLength={20}
                  className="mt-1"
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
              <FormLabel className="text-sm font-medium">Имя</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Введите ваше имя" 
                  {...field} 
                  maxLength={50}
                  className="mt-1"
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
              <FormLabel className="text-sm font-medium">Фамилия</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Введите вашу фамилию (по желанию)" 
                  {...field} 
                  maxLength={50}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <BioSection form={form} />
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !!avatarError}
            className="flex-1 bg-gray-700 hover:bg-gray-800 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Сохранение...</span>
              </div>
            ) : (
              'Сохранить изменения'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditor;
