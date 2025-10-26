'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BADGE_COLORS, BadgeColor } from './badge-node';

interface BadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (text: string, color: BadgeColor) => void;
}

export function BadgeDialog({ open, onOpenChange, onInsert }: BadgeDialogProps) {
  const [text, setText] = useState('');
  const [color, setColor] = useState<BadgeColor>('primary');

  const handleInsert = () => {
    if (text.trim()) {
      onInsert(text, color);
      setText('');
      setColor('primary');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insertar Badge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="badge-text">Texto del Badge</Label>
            <Input
              id="badge-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej: Software / Diseño AR/VR"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInsert();
                }
              }}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Color del Badge</Label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(BADGE_COLORS).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  className={`h-10 rounded-md transition-all ${config.bg} ${config.text} text-xs font-medium hover:scale-105 ${
                    color === key ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => setColor(key as BadgeColor)}
                  title={config.label}
                >
                  {config.label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setText('');
                setColor('primary');
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleInsert} disabled={!text.trim()}>
              Insertar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
