
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useInternet } from '@/context/InternetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, WifiOff, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

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

const RegisterForm: React.FC = () => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const { toast: uiToast } = useToast();
  const { isOnline } = useInternet();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    if (!isOnline) {
      toast({
        title: "Ошибка подключения",
        description: "Для авторизации требуется подключение к интернету",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        const success = await login(values.username, values.password);
        
        if (!success) {
          form.setError('root', { message: 'Неверное имя пользователя или пароль' });
        }
      } else {
        // Блокируем регистрацию в тестовой версии
        toast.error("Регистрация временно недоступна", {
          description: "В тестовой версии приложения регистрация отключена. Используйте демо-аккаунт для входа.",
          duration: 5000,
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
    if (!isOnline) {
      toast({
        title: "Ошибка подключения",
        description: "Для авторизации требуется подключение к интернету",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    await login('tester111', 'tester111');
    setIsLoading(false);
  };

  useEffect(() => {
    // Предупреждение о регистрации, если пользователь переключается на вкладку регистрации
    if (activeTab === 'register') {
      toast.info("Информация о регистрации", {
        description: "В тестовой версии приложения регистрация отключена. Используйте демо-аккаунт для входа.",
        icon: <Info className="h-4 w-4" />,
        duration: 5000,
      });
    }
  }, [activeTab]);

  // Если нет интернета, показываем предупреждение
  if (!isOnline) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Нет подключения к интернету</AlertTitle>
          <AlertDescription>
            Для входа в аккаунт требуется подключение к интернету.
            Пожалуйста, проверьте ваше соединение и попробуйте снова.
          </AlertDescription>
        </Alert>
        
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
                          <Input placeholder="Введите имя пользователя" {...field} disabled />
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
                          <Input type="password" placeholder="Введите пароль" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled>
                    {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
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
                
                <Button variant="outline" className="w-full mt-4" disabled>
                  Использовать демо-аккаунт
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {activeTab === 'register' && (
            <Alert variant="info" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Регистрация временно недоступна</AlertTitle>
              <AlertDescription>
                В тестовой версии приложения регистрация отключена. Используйте демо-аккаунт для входа.
              </AlertDescription>
            </Alert>
          )}
          
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
              
              <Button type="submit" className="w-full" disabled={isLoading || (activeTab === 'register')}>
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
