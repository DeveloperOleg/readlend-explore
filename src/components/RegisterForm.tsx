
import React, { useState, useEffect } from 'react';
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

interface RegisterFormProps {
  detectVpn?: () => boolean;
  vpnDetected?: boolean;
}

const userFormSchema = z.object({
  username: z.string()
    .min(3, { message: 'Имя пользователя должно содержать не менее 3 символов' })
    .max(20, { message: 'Имя пользователя должно содержать не более 20 символов' })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { 
      message: 'Имя пользователя должно начинаться с буквы и может содержать только латинские буквы, цифры и символ подчеркивания' 
    }),
  password: z.string()
    .min(6, { message: 'Пароль должен содержать не менее 6 символов' }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const RegisterForm: React.FC<RegisterFormProps> = ({ detectVpn = () => false, vpnDetected = false }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Мониторим изменения vpnDetected
  useEffect(() => {
    if (vpnDetected) {
      console.log("RegisterForm: VPN detected");
    }
  }, [vpnDetected]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    try {
      // Проверяем, если VPN уже обнаружен и еще не прошел проверку
      if (vpnDetected) {
        // VPN обнаружен, логика обрабатывается в LoginScreen компоненте
        console.log("VPN is detected during form submission");
        detectVpn(); // Вызываем для показа капчи
        setIsLoading(false);
        return;
      }
      
      let success: boolean;
      
      if (activeTab === 'login') {
        success = await login(values.username, values.password);
      } else {
        success = await register(values.username, values.password);
      }
      
      if (!success) {
        form.setError('root', { 
          message: activeTab === 'login' 
            ? 'Неверное имя пользователя или пароль' 
            : 'Ошибка при регистрации'
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обработке запроса",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
    form.reset();
  };

  const handleDemo = async () => {
    setIsLoading(true);
    
    // Проверяем VPN и для демо-входа тоже
    if (vpnDetected) {
      console.log("VPN is detected during demo login");
      detectVpn(); // Вызываем для показа капчи
      setIsLoading(false);
      return;
    }
    
    await login('tester111', 'tester111');
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите имя пользователя" {...field} />
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
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Введите пароль" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {activeTab === 'login' ? 'Вход...' : 'Регистрация...'}
                  </div>
                ) : (
                  activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  или
                </span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4" onClick={handleDemo} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Вход в демо...
                </div>
              ) : (
                'Использовать демо-аккаунт'
              )}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default RegisterForm;
