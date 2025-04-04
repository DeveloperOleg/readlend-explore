
import React from 'react';
import { useInternet } from '@/context/InternetContext';
import { useToast } from "@/hooks/use-toast";
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface InternetRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showToast?: boolean;
}

const InternetRequired: React.FC<InternetRequiredProps> = ({ 
  children, 
  fallback, 
  showToast = true 
}) => {
  const { isOnline } = useInternet();

  // If online, render children normally
  if (isOnline) {
    return <>{children}</>;
  }

  // If offline and showToast is true, show the offline toast using sonner
  if (showToast) {
    toast.error("Нет подключения к интернету", {
      description: "Это действие требует подключения к интернету. Проверьте своё соединение.",
      position: "bottom-center",
    });
  }

  // If fallback provided, render it; otherwise render nothing
  return fallback ? <>{fallback}</> : null;
};

export default InternetRequired;
