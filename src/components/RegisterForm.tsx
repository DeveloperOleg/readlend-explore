import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Create schema with translations
  const userFormSchema = useMemo(() => z.object({
    username: z.string()
      .min(3, { message: t('auth.usernameMinLength') })
      .max(20, { message: t('auth.usernameMaxLength') })
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { 
        message: t('auth.usernameFormat')
      }),
    password: z.string()
      .min(8, { message: t('auth.passwordMinLength') }),
    confirmPassword: z.string().optional()
  }).refine((data) => {
    if (data.confirmPassword !== undefined) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: t('auth.passwordMismatch'),
    path: ["confirmPassword"],
  }), [t]);

  type UserFormValues = z.infer<typeof userFormSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        const success = await login(values.username, values.password);
        
        if (!success) {
          toast({
            title: t('auth.error'),
            description: t('auth.invalidCredentials'),
            variant: 'destructive'
          });
        }
      } else {
        const success = await register(values.username, values.password);
        
        if (!success) {
          toast({
            title: t('auth.error'),
            description: t('auth.registrationFailed'),
            variant: 'destructive'
          });
        } else {
          toast({
            title: t('auth.success'),
            description: t('auth.registrationSuccess')
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: t('auth.error'),
        description: t('auth.unexpectedError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
    form.reset();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg border shadow-sm p-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="login" className="data-[state=active]:bg-background">
            {t('auth.login')}
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-background">
            {t('auth.register')}
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {t('auth.username')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('auth.usernamePlaceholder')} 
                        {...field} 
                        className="h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {t('auth.password')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder={t('auth.passwordPlaceholder')} 
                          {...field} 
                          className="h-11 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {activeTab === 'register' && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {t('auth.confirmPassword')}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder={t('auth.confirmPasswordPlaceholder')} 
                          {...field} 
                          className="h-11"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {activeTab === 'login' 
                      ? t('auth.loggingIn') 
                      : t('auth.registering')
                    }
                  </div>
                ) : (
                  activeTab === 'login' 
                    ? t('auth.login') 
                    : t('auth.register')
                )}
              </Button>
            </form>
          </Form>
        </div>
      </Tabs>
    </div>
  );
};

export default RegisterForm;
