// FILE: src/components/admin/blocks/inline-rich-editor.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Palette,
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InlineRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function InlineRichEditor({
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  minHeight = '100px',
}: InlineRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    if (linkUrl) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (selectedText) {
          const link = document.createElement('a');
          link.href = linkUrl;
          link.textContent = selectedText;
          link.className = 'text-primary hover:underline';
          
          range.deleteContents();
          range.insertNode(link);
          
          range.setStartAfter(link);
          range.setEndAfter(link);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      
      setLinkUrl('');
      handleInput();
    }
  };

  const changeColor = (color: string) => {
    execCommand('foreColor', color);
    setSelectedColor(color);
  };

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#FFFFFF',
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap border-b pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => execCommand('bold')}
          title="Negrita"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => execCommand('italic')}
          title="Cursiva"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => execCommand('underline')}
          title="Subrayado"
        >
          <Underline className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Color"
            >
              <Palette className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={`Color ${color}`}
                  aria-label={`Seleccionar color ${color}`}
                  className={cn(
                    'w-6 h-6 rounded border transition-all',
                    selectedColor === color
                      ? 'border-primary scale-110'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => changeColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Enlace"
            >
              <Link className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-2">
              <Label className="text-xs">URL del enlace</Label>
              <div className="flex gap-2">
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      insertLink();
                    }
                  }}
                />
                <Button type="button" onClick={insertLink} size="sm">
                  Insertar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-5" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => execCommand('insertUnorderedList')}
          title="Lista"
        >
          <List className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => execCommand('insertOrderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={cn(
          'p-3 rounded-md border bg-background',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'prose prose-sm dark:prose-invert max-w-none'
        )}
        style={{ minHeight, whiteSpace: 'pre-wrap' }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
