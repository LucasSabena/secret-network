'use client';

import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FAQBlockEditorProps {
  block: Extract<Block, { type: 'faq' }>;
  onChange: (block: Extract<Block, { type: 'faq' }>) => void;
}

export function FAQBlockEditor({ block, onChange }: FAQBlockEditorProps) {
  const addItem = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: [
          ...block.data.items,
          { id: `faq-${Date.now()}`, question: '', answer: '' },
        ],
      },
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: block.data.items.filter((item) => item.id !== id),
      },
    });
  };

  const updateItem = (id: string, field: 'question' | 'answer', value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: block.data.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Preguntas Frecuentes</Label>
        <Button type="button" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </div>

      <div className="space-y-3">
        {block.data.items.map((item, index) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
              <div className="flex-1 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Pregunta {index + 1}
                  </Label>
                  <Input
                    value={item.question}
                    onChange={(e) => updateItem(item.id, 'question', e.target.value)}
                    placeholder="¿Tu pregunta aquí?"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Respuesta</Label>
                  <Textarea
                    value={item.answer}
                    onChange={(e) => updateItem(item.id, 'answer', e.target.value)}
                    placeholder="Respuesta detallada... (soporta HTML básico)"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Puedes usar HTML: &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {block.data.items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No hay preguntas. Haz clic en "Agregar" para comenzar.
        </div>
      )}
    </div>
  );
}
