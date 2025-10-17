// FILE: src/components/admin/blog-components/alert-picker.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning';

interface AlertPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

const variantConfig = {
  default: {
    label: 'Informativo',
    icon: 'Info',
    bgColor: '#1e293b',
    textColor: '#f1f5f9',
    borderColor: '#475569',
  },
  destructive: {
    label: 'Error/Peligro',
    icon: 'XCircle',
    bgColor: '#450a0a',
    textColor: '#fecaca',
    borderColor: '#7f1d1d',
  },
  success: {
    label: 'Éxito',
    icon: 'CheckCircle2',
    bgColor: '#052e16',
    textColor: '#bbf7d0',
    borderColor: '#166534',
  },
  warning: {
    label: 'Advertencia',
    icon: 'AlertTriangle',
    bgColor: '#451a03',
    textColor: '#fed7aa',
    borderColor: '#92400e',
  },
};

function generateAlertHTML(variant: AlertVariant, title: string, description: string): string {
  const config = variantConfig[variant];
  
  // Iconos SVG
  const icons = {
    Info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    XCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    CheckCircle2: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    AlertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  };

  return `
<div style="
  background-color: ${config.bgColor};
  border: 1px solid ${config.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1.5rem 0;
  display: flex;
  gap: 0.75rem;
  color: ${config.textColor};
">
  <div style="flex-shrink: 0; margin-top: 0.125rem;">
    ${icons[config.icon as keyof typeof icons]}
  </div>
  <div style="flex: 1;">
    ${title ? `<h5 style="font-weight: 600; margin-bottom: 0.25rem; font-size: 1rem;">${title}</h5>` : ''}
    <div style="font-size: 0.875rem; line-height: 1.5;">${description}</div>
  </div>
</div>
  `.trim();
}

export function AlertPicker({ isOpen, onClose, onInsert }: AlertPickerProps) {
  const [variant, setVariant] = useState<AlertVariant>('default');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleInsert = () => {
    if (!description.trim()) return;
    const html = generateAlertHTML(variant, title, description);
    onInsert(html);
    
    // Reset
    setVariant('default');
    setTitle('');
    setDescription('');
    onClose();
  };

  const renderIcon = (variant: AlertVariant) => {
    switch (variant) {
      case 'destructive': return <XCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Insertar Alerta / Callout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Variant */}
          <div className="space-y-2">
            <Label>Tipo de Alerta</Label>
            <Select value={variant} onValueChange={(v) => setVariant(v as AlertVariant)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(variantConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Título (Opcional)</Label>
            <input
              type="text"
              placeholder="Ej: Importante"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Contenido</Label>
            <Textarea
              placeholder="Escribe el contenido de la alerta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Vista Previa</Label>
            <Alert variant={variant === 'success' || variant === 'warning' ? 'default' : variant}>
              <div className="flex gap-2">
                {renderIcon(variant)}
                <div className="flex-1">
                  {title && <AlertTitle>{title}</AlertTitle>}
                  <AlertDescription>
                    {description || 'Tu contenido aparecerá aquí...'}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleInsert} disabled={!description.trim()}>
              Insertar Alerta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
