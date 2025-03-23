
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
import { Camera } from 'lucide-react';

// Схема валидации для формы профиля
const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' })
    .max(20, { message: 'Имя пользователя должно содержать не более 20 символов' })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: 'Имя пользователя может содержать только латинские буквы, цифры и символ подчеркивания' 
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileEditor: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app we would upload the avatar file to a server
      // For this demo we'll just use the preview URL
      await updateProfile({ 
        username: values.username,
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

  return (
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
                accept="image/*" 
                className="sr-only" 
                onChange={handleAvatarChange} 
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t('profile.changeAvatar') || 'Нажмите на аватарку, чтобы изменить'}
          </p>
        </div>
      
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.username') || 'Имя пользователя'}</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
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
