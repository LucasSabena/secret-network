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
  const accordionItems = items.map((item, index) => `
  <div style="border-bottom: 1px solid #334155;">
    <button 
      data-accordion-trigger="${item.id}"
      style="
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
        font-weight: 500;
        cursor: pointer;
        background: transparent;
        border: none;
        text-align: left;
        color: #f1f5f9;
        transition: all 0.2s;
      "
      onmouseover="this.style.color='#ff3399'"
      onmouseout="this.style.color='#f1f5f9'"
    >
      <span>${item.title}</span>
      <svg 
        data-accordion-icon="${item.id}"
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        style="transition: transform 0.2s;"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <div 
      data-accordion-content="${item.id}"
      style="
        display: none;
        overflow: hidden;
        padding-bottom: 1rem;
        color: #cbd5e1;
        font-size: 0.875rem;
        line-height: 1.5;
      "
    >
      ${item.content}
    </div>
  </div>
  `).join('');

  return `
<div style="margin: 1.5rem 0; border: 1px solid #334155; border-radius: 0.5rem; background: #0f172a;">
  ${accordionItems}
</div>

<script>
(function() {
  const triggers = document.querySelectorAll('[data-accordion-trigger]');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-accordion-trigger');
      const content = document.querySelector('[data-accordion-content="' + id + '"]');
      const icon = document.querySelector('[data-accordion-icon="' + id + '"]');
      
      if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
      } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });
})();
</script>
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
