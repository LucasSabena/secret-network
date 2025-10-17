// FILE: src/components/admin/blocks/tabs-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface TabsBlockEditorProps {
  block: Extract<Block, { type: 'tabs' }>;
  onChange: (block: Extract<Block, { type: 'tabs' }>) => void;
}

export function TabsBlockEditor({ block, onChange }: TabsBlockEditorProps) {
  const generateId = () => `tab-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const addTab = () => {
    onChange({
      ...block,
      data: {
        tabs: [...block.data.tabs, { id: generateId(), label: `Tab ${block.data.tabs.length + 1}`, content: '' }],
      },
    });
  };

  const removeTab = (id: string) => {
    if (block.data.tabs.length === 1) return; // Mantener al menos 1 tab
    onChange({
      ...block,
      data: {
        tabs: block.data.tabs.filter((tab) => tab.id !== id),
      },
    });
  };

  const updateTab = (id: string, field: 'label' | 'content', value: string) => {
    onChange({
      ...block,
      data: {
        tabs: block.data.tabs.map((tab) => (tab.id === id ? { ...tab, [field]: value } : tab)),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Pestañas (Tabs)</Label>
        <Button onClick={addTab} size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Tab
        </Button>
      </div>

      <div className="space-y-4">
        {block.data.tabs.map((tab, index) => (
          <div key={tab.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Tab {index + 1}</Label>
              {block.data.tabs.length > 1 && (
                <Button
                  onClick={() => removeTab(tab.id)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Label className="text-xs mb-1 block">Etiqueta:</Label>
              <Input
                value={tab.label}
                onChange={(e) => updateTab(tab.id, 'label', e.target.value)}
                placeholder="Nombre de la pestaña"
              />
            </div>

            <div>
              <Label className="text-xs mb-1 block">Contenido:</Label>
              <Textarea
                value={tab.content}
                onChange={(e) => updateTab(tab.id, 'content', e.target.value)}
                placeholder="Contenido de la pestaña (puedes usar HTML)"
                className="min-h-[100px] font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
