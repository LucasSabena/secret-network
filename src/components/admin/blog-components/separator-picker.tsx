// FILE: src/components/admin/blog-components/separator-picker.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface SeparatorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

type SeparatorStyle = 'solid' | 'dashed' | 'dotted';

function generateSeparatorHTML(style: SeparatorStyle): string {
  const uniqueId = `separator-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  return `<hr class="blog-separator-${uniqueId}" style="border: none !important; border-top: 1px ${style} #334155 !important; margin: 2rem 0 !important;" />`;
}

export function SeparatorPicker({ isOpen, onClose, onInsert }: SeparatorPickerProps) {
  const [style, setStyle] = useState<SeparatorStyle>('solid');

  const handleInsert = () => {
    const html = generateSeparatorHTML(style);
    onInsert(html);
    setStyle('solid');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Insertar Separador</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Style Selection */}
          <div className="space-y-3">
            <Label>Estilo</Label>
            <div className="space-y-2">
              {(['solid', 'dashed', 'dotted'] as SeparatorStyle[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`w-full p-3 border rounded-lg text-left transition-colors ${
                    style === s
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium capitalize mb-2">{s}</div>
                  <Separator
                    className={`${
                      s === 'dashed' ? 'border-dashed' : s === 'dotted' ? 'border-dotted' : ''
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleInsert}>
              Insertar Separador
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
