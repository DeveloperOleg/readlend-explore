
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(username, password);
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/50">
      <div className="w-full max-w-md mx-auto animate-scale-in">
        <Card className="glass border-opacity-50 shadow-lg overflow-hidden">
          <CardHeader className="pb-4 pt-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-3 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {t('login.welcome')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  {t('login.username')}
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full backdrop-blur-sm bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('login.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full backdrop-blur-sm bg-background/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>{t('login.submit')}...</span>
                  </div>
                ) : (
                  t('login.submit')
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-8 pb-8 pt-0 opacity-70 text-center">
            <p className="text-sm text-muted-foreground">
              Для тестирования используйте:<br />
              Логин: tester111<br />
              Пароль: tester111
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
