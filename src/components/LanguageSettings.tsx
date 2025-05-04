
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const LanguageSettings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'ru' | 'en');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Languages className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Язык</h2>
      </div>

      <RadioGroup 
        defaultValue={language} 
        onValueChange={handleLanguageChange}
        className="space-y-3"
      >
        <div className="flex items-start space-x-4 border p-4 rounded-lg">
          <RadioGroupItem value="ru" id="russian" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="russian" className="text-lg font-medium">Русский</Label>
            <p className="text-sm text-muted-foreground">Russian</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 border p-4 rounded-lg">
          <RadioGroupItem value="en" id="english" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="english" className="text-lg font-medium">English</Label>
            <p className="text-sm text-muted-foreground">English</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default LanguageSettings;
