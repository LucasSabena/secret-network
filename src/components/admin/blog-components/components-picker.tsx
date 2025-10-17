// FILE: src/components/admin/blog-components/components-picker.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProgramCardPicker from './program-card-picker';
import { TabsPicker } from './tabs-picker';
import { AlertPicker } from './alert-picker';
import { AccordionPicker } from './accordion-picker';
import { SeparatorPicker } from './separator-picker';
import { 
  LayoutGrid, 
  Box, 
  AlertCircle, 
  ChevronDown, 
  Minus,
} from 'lucide-react';

type ComponentType = 'program' | 'tabs' | 'alert' | 'accordion' | 'separator' | null;

interface ComponentsPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

const components = [
  {
    type: 'program' as ComponentType,
    label: 'Programa',
    description: 'Inserta una card de programa de la base de datos',
    icon: LayoutGrid,
  },
  {
    type: 'tabs' as ComponentType,
    label: 'Tabs',
    description: 'Organiza contenido en pestañas (ej: instalación, uso, API)',
    icon: Box,
  },
  {
    type: 'alert' as ComponentType,
    label: 'Alerta/Callout',
    description: 'Destaca información importante (info, warning, error, success)',
    icon: AlertCircle,
  },
  {
    type: 'accordion' as ComponentType,
    label: 'Accordion',
    description: 'Secciones colapsables para FAQs o contenido largo',
    icon: ChevronDown,
  },
  {
    type: 'separator' as ComponentType,
    label: 'Separador',
    description: 'Línea divisoria entre secciones',
    icon: Minus,
  },
];

export default function ComponentsPicker({ isOpen, onClose, onInsert }: ComponentsPickerProps) {
  const [selectedType, setSelectedType] = useState<ComponentType>(null);

  const handleComponentSelect = (type: ComponentType) => {
    setSelectedType(type);
  };

  const handleSubPickerClose = () => {
    setSelectedType(null);
  };

  const handleInsert = (html: string) => {
    onInsert(html);
    setSelectedType(null);
    onClose();
  };

  // Render sub-pickers
  if (selectedType === 'program') {
    return <ProgramCardPicker isOpen={true} onClose={handleSubPickerClose} onInsert={handleInsert} />;
  }
  if (selectedType === 'tabs') {
    return <TabsPicker isOpen={true} onClose={handleSubPickerClose} onInsert={handleInsert} />;
  }
  if (selectedType === 'alert') {
    return <AlertPicker isOpen={true} onClose={handleSubPickerClose} onInsert={handleInsert} />;
  }
  if (selectedType === 'accordion') {
    return <AccordionPicker isOpen={true} onClose={handleSubPickerClose} onInsert={handleInsert} />;
  }
  if (selectedType === 'separator') {
    return <SeparatorPicker isOpen={true} onClose={handleSubPickerClose} onInsert={handleInsert} />;
  }

  // Main picker
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Insertar Componente</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Selecciona el tipo de componente que deseas agregar al blog post
          </p>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {components.map((component) => {
            const Icon = component.icon;
            return (
              <button
                key={component.type}
                onClick={() => handleComponentSelect(component.type)}
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{component.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {component.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
