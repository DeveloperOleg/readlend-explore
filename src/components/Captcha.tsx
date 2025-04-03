
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  onCancel: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify, onCancel }) => {
  const [math, setMath] = useState({ a: 0, b: 0, result: 0 });
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isHumanChecked, setIsHumanChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate simple math problem
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMath({ a, b, result: a + b });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isHumanChecked) {
      toast({
        title: "Ошибка проверки",
        description: "Пожалуйста, подтвердите, что вы человек",
        variant: "destructive",
      });
      return;
    }

    const parsedAnswer = parseInt(userAnswer);
    if (isNaN(parsedAnswer)) {
      toast({
        title: "Ошибка проверки",
        description: "Пожалуйста, введите число",
        variant: "destructive",
      });
      return;
    }

    if (parsedAnswer === math.result) {
      toast({
        title: "Проверка пройдена",
        description: "Спасибо за подтверждение",
      });
      onVerify(true);
    } else {
      toast({
        title: "Ошибка проверки",
        description: "Неправильный ответ, попробуйте еще раз",
        variant: "destructive",
      });
      // Generate new math problem
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setMath({ a, b, result: a + b });
      setUserAnswer('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold mb-4">Подтверждение безопасности</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Обнаружено использование VPN. Для защиты от автоматических ботов, пожалуйста, пройдите проверку:
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <p className="font-medium mb-2">Решите простую задачу:</p>
          <p className="text-lg font-bold">{math.a} + {math.b} = ?</p>
          <input 
            type="text" 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="mt-2 w-full p-2 border rounded-md"
            placeholder="Введите ответ"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="human-check"
            checked={isHumanChecked}
            onCheckedChange={(checked) => setIsHumanChecked(!!checked)}
          />
          <Label htmlFor="human-check">
            Я подтверждаю, что я человек
          </Label>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">
            Подтвердить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Captcha;
