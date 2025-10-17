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
  const uniqueId = `alert-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  // Iconos SVG
  const icons = {
    Info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    XCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    CheckCircle2: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    AlertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  };

  return `
<div class="blog-alert-${uniqueId}" style="
  background-color: ${config.bgColor} !important;
  border: 1px solid ${config.borderColor} !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  margin: 1.5rem 0 !important;
  display: flex !important;
  gap: 0.75rem !important;
  color: ${config.textColor} !important;
">
  <div class="alert-icon-${uniqueId}" style="flex-shrink: 0 !important; margin-top: 0.125rem !important;">
    ${icons[config.icon as keyof typeof icons]}
  </div>
  <div class="alert-content-${uniqueId}" style="flex: 1 !important;">
    ${title ? `<h5 class="alert-title-${uniqueId}" style="font-weight: 600 !important; margin: 0 0 0.25rem 0 !important; padding: 0 !important; font-size: 1rem !important; color: ${config.textColor} !important;">${title}</h5>` : ''}
    <div class="alert-description-${uniqueId}" style="font-size: 0.875rem !important; line-height: 1.5 !important; margin: 0 !important; padding: 0 !important; color: ${config.textColor} !important;">${description}</div>
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
