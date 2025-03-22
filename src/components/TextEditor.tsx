
import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, Palette } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
  const { t } = useLanguage();
  const [selectedColor, setSelectedColor] = useState("#000000");
  
  const formatText = (format: string) => {
    let formattedText = content;
    let selection;
    
    if (typeof window !== "undefined") {
      selection = window.getSelection()?.toString();
    }
    
    if (!selection) return;
    
    switch (format) {
      case 'bold':
        formattedText = content.replace(selection, `**${selection}**`);
        break;
      case 'italic':
        formattedText = content.replace(selection, `*${selection}*`);
        break;
      case 'underline':
        formattedText = content.replace(selection, `__${selection}__`);
        break;
      case 'strikethrough':
        formattedText = content.replace(selection, `~~${selection}~~`);
        break;
      case 'color':
        formattedText = content.replace(selection, `[color=${selectedColor}]${selection}[/color]`);
        break;
      default:
        break;
    }
    
    onChange(formattedText);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
          <ToggleGroupItem value="bold" onClick={() => formatText('bold')} aria-label={t('editor.bold') || 'Жирный'}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" onClick={() => formatText('italic')} aria-label={t('editor.italic') || 'Курсив'}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" onClick={() => formatText('underline')} aria-label={t('editor.underline') || 'Подчеркнутый'}>
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" onClick={() => formatText('strikethrough')} aria-label={t('editor.strikethrough') || 'Зачеркнутый'}>
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 border-dashed">
              <Palette className="h-4 w-4" style={{ color: selectedColor }} />
              <span className="sr-only">{t('editor.color') || 'Цвет'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="space-y-2">
              <Input 
                type="color" 
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-32 h-8 p-1"
              />
              <Button 
                size="sm" 
                onClick={() => formatText('color')}
                className="w-full"
              >
                {t('editor.applyColor') || 'Применить цвет'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Textarea 
        value={content} 
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-y"
        placeholder={t('editor.writeSomething') || 'Напишите что-нибудь здесь...'}
      />
      
      <div className="p-3 bg-muted/20 border rounded-md mt-4">
        <h4 className="font-medium mb-2">{t('editor.formatting') || 'Поддерживаемое форматирование'}:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>
            <span className="font-bold">{t('editor.bold') || 'Жирный шрифт'}</span>: **текст**
          </li>
          <li>
            <span className="italic">{t('editor.italic') || 'Курсив'}</span>: *текст*
          </li>
          <li>
            <span className="underline">{t('editor.underline') || 'Подчеркивание'}</span>: __текст__
          </li>
          <li>
            <span className="line-through">{t('editor.strikethrough') || 'Зачеркивание'}</span>: ~~текст~~
          </li>
          <li>
            <span style={{ color: "#ff5555" }}>{t('editor.color') || 'Цветной текст'}</span>: [color=#ff5555]текст[/color]
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TextEditor;
