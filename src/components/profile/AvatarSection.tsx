import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Trash2, AlertCircle, Info } from 'lucide-react';

const MAX_AVATAR_SIZE = 10; // in MB
const ALLOWED_AVATAR_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MIN_IMAGE_DIMENSION = 200;
const MAX_IMAGE_DIMENSION = 1000;

interface AvatarSectionProps {
  avatarPreview: string | null;
  setAvatarPreview: (preview: string | null) => void;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  avatarError: string | null;
  setAvatarError: (error: string | null) => void;
  username: string | undefined;
  displayId?: string;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarPreview,
  setAvatarPreview,
  avatarFile,
  setAvatarFile,
  avatarError,
  setAvatarError,
  username,
  displayId
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const validateImageDimensions = (file: File, minWidth: number, minHeight: number, maxWidth: number, maxHeight: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src);
        
        if (width < minWidth || height < minHeight) {
          setAvatarError(t('profile.imageTooSmall') || `Изображение слишком маленькое. Минимальный размер ${minWidth}x${minHeight} пикселей`);
          resolve(false);
        } else if (width > maxWidth || height > maxHeight) {
          setAvatarError(t('profile.imageTooLarge') || `Изображение слишком большое. Максимальный размер ${maxWidth}x${maxWidth} пикселей`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      
      img.onerror = () => {
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Calculate file size in MB correctly
      const fileSizeInMB = file.size / (1024 * 1024);
      
      // Debug log to see actual file size
      console.log(`Selected file: ${file.name}`);
      console.log(`File size: ${fileSizeInMB.toFixed(2)} MB (${file.size} bytes)`);
      console.log(`File type: ${file.type}`);
      console.log(`MAX_AVATAR_SIZE: ${MAX_AVATAR_SIZE} MB`);
      console.log(`Size check: ${fileSizeInMB} > ${MAX_AVATAR_SIZE} = ${fileSizeInMB > MAX_AVATAR_SIZE}`);
      
      // Check file size - FIXED: Use proper comparison
      if (fileSizeInMB > MAX_AVATAR_SIZE) {
        const errorMessage = t('profile.imageTooLarge') || `Размер аватара не должен превышать ${MAX_AVATAR_SIZE}МБ`;
        setAvatarError(errorMessage);
        toast({
          title: t('profile.imageTooLargeTitle') || 'Ошибка загрузки аватара',
          description: `${errorMessage}. Текущий размер: ${fileSizeInMB.toFixed(2)}МБ`,
          variant: 'destructive',
        });
        return;
      }
      
      if (!ALLOWED_AVATAR_FILE_TYPES.includes(file.type)) {
        const errorMessage = t('profile.unsupportedFormat') || 'Неподдерживаемый формат файла. Поддерживаются только JPEG, PNG и GIF';
        setAvatarError(errorMessage);
        toast({
          title: t('profile.unsupportedFormatTitle') || 'Ошибка формата',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }
      
      const isValidDimensions = await validateImageDimensions(file, MIN_IMAGE_DIMENSION, MIN_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION);
      if (!isValidDimensions) {
        toast({
          title: t('profile.invalidDimensionsTitle') || 'Ошибка размеров изображения',
          description: avatarError,
          variant: 'destructive',
        });
        return;
      }
      
      // Clearing previous errors since file passed all validations
      setAvatarError(null);
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Success feedback
      toast({
        title: 'Аватар загружен',
        description: `Файл ${file.name} (${fileSizeInMB.toFixed(2)}МБ) успешно загружен`,
      });
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={avatarPreview || ''} alt={username} />
          <AvatarFallback className="text-2xl">
            {username ? username.charAt(0).toUpperCase() : 'U'}
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
            accept="image/jpeg,image/png,image/gif" 
            className="sr-only" 
            onChange={handleAvatarChange} 
          />
        </label>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <p className="text-sm text-muted-foreground">
          {t('profile.changeAvatar') || 'Нажмите на аватарку, чтобы изменить'}
        </p>
        {avatarPreview && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive" 
            onClick={handleDeleteAvatar}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('profile.deleteAvatar') || 'Удалить аватар'}</span>
          </Button>
        )}
      </div>
      
      {avatarError && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {avatarError}
          </AlertDescription>
        </Alert>
      )}
      
      <Alert variant="default" className="mt-3">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <ul className="text-xs list-disc pl-4 space-y-1">
            <li>{t('profile.avatarSizeLimit') || 'Максимальный размер файла: 10МБ'}</li>
            <li>{t('profile.avatarFormats') || 'Поддерживаемые форматы: JPEG, PNG, GIF'}</li>
            <li>{t('profile.avatarDimensions') || 'Рекомендуемый размер: 200x200 до 1000x1000 пикселей'}</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      {displayId && (
        <div className="mt-4 p-2 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            {t('profile.userID') || 'ID пользователя'}: <span className="font-mono font-medium">{displayId}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarSection;
