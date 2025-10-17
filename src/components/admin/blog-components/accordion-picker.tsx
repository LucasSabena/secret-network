// FILE: src/components/admin/blog-components/accordion-picker.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2 } from 'lucide-react';

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

function generateAccordionHTML(items: AccordionItemData[]): string {
  const uniqueId = `accordion-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const accordionItems = items.map((item, index) => `
  <details class="blog-accordion-item-${uniqueId}" style="border-bottom: 1px solid rgb(51, 65, 85) !important; padding: 1rem 0 !important; margin: 0 !important;">
    <summary style="
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      color: rgb(241, 245, 249) !important;
      list-style: none !important;
      user-select: none !important;
      margin: 0 !important;
      padding: 0 !important;
    ">
      <span style="flex: 1 !important;">${item.title}</span>
      <svg 
        class="accordion-icon-${uniqueId}"
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        style="flex-shrink: 0 !important; transition: transform 0.2s !important; transform: rotate(0deg) !important;"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </summary>
    <div style="
      margin-top: 0.75rem !important;
      padding-left: 0.5rem !important;
      color: rgb(203, 213, 225) !important;
      font-size: 0.875rem !important;
      line-height: 1.6 !important;
    ">
      ${item.content}
    </div>
  </details>
  `).join('');

  return `
<div class="blog-accordion-${uniqueId}" style="margin: 1.5rem 0 !important; border: 1px solid rgb(51, 65, 85) !important; border-radius: 0.5rem !important; background: rgb(15, 23, 42) !important; overflow: hidden !important; padding: 0 1rem !important;">
  ${accordionItems}
</div>

<style>
  .blog-accordion-item-${uniqueId}[open] > summary .accordion-icon-${uniqueId} {
    transform: rotate(180deg) !important;
  }
  .blog-accordion-item-${uniqueId} > summary:hover {
    color: rgb(255, 51, 153) !important;
  }
  .blog-accordion-item-${uniqueId} > summary::-webkit-details-marker {
    display: none !important;
  }
  .blog-accordion-item-${uniqueId}:last-child {
    border-bottom: none !important;
  }
</style>
  `.trim();
}

export function AccordionPicker({ isOpen, onClose, onInsert }: AccordionPickerProps) {
  const [items, setItems] = useState<AccordionItemData[]>([
    { id: 'item1', title: '', content: '' },
    { id: 'item2', title: '', content: '' },
  ]);

  const addItem = () => {
    const newId = `item${items.length + 1}`;
    setItems([...items, { id: newId, title: '', content: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return; // Mínimo 1 item
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: 'title' | 'content', value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleInsert = () => {
    if (items.some(i => !i.title.trim() || !i.content.trim())) return;
    const html = generateAccordionHTML(items);
    onInsert(html);
    
    // Reset
    setItems([
      { id: 'item1', title: '', content: '' },
      { id: 'item2', title: '', content: '' },
    ]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Insertar Accordion</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Item {index + 1}</Label>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Título/Pregunta</Label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Ej: ¿Cómo instalo este programa?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contenido/Respuesta</Label>
                  <Textarea
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                    rows={3}
                    placeholder="Escribe la respuesta o contenido..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Item
          </Button>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Vista Previa</Label>
            <Accordion type="single" collapsible className="border rounded-lg">
              {items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>
                    {item.title || 'Título del item...'}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.content || 'Contenido del item...'}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleInsert}
              disabled={items.some(i => !i.title.trim() || !i.content.trim())}
            >
              Insertar Accordion
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
