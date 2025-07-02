
import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface SearchHistoryProps {
  searchHistory: string[];
  onHistoryItemClick: (item: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchHistory,
  onHistoryItemClick,
  onClearHistory,
  onClose,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-background/95 px-4 py-16 animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('search.searchHistory')}</h3>
            {searchHistory.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearHistory}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('search.clear')}
              </Button>
            )}
          </div>
          
          {searchHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('search.noHistory')}</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => onHistoryItemClick(item)}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{item}</span>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="mt-4 w-full" 
            onClick={onClose}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
