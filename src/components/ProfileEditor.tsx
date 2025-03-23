
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile({ username: values.username });
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
