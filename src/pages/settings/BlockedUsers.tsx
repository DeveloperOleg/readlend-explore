
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ban } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import UserBlocked from '@/components/UserBlocked';

const BlockedUsersPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('blocked.title')}</h1>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Ban className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('blocked.title')}</h2>
      </div>

      <UserBlocked />
    </div>
  );
};

export default BlockedUsersPage;
