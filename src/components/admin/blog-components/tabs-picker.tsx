// FILE: src/components/admin/blog-components/tabs-picker.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  content: string;
}

interface TabsPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

function generateTabsHTML(tabs: Tab[]): string {
  const uniqueId = `tabs-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const radioButtons = tabs.map((tab, index) => 
    `<input type="radio" id="${uniqueId}-${tab.id}" name="${uniqueId}" class="tab-radio-${uniqueId}" ${index === 0 ? 'checked' : ''} />`
  ).join('\n');

  const tabLabels = tabs.map(tab => 
    `<label for="${uniqueId}-${tab.id}" class="tab-label-${uniqueId}" data-tab="${tab.id}">${tab.label}</label>`
  ).join('\n    ');

  const tabContents = tabs.map((tab, index) => 
    `<div class="tab-content-${uniqueId}" data-tab="${tab.id}">
      ${tab.content}
    </div>`
  ).join('\n    ');

  const radioStyles = tabs.map(tab => 
    `#${uniqueId}-${tab.id}:checked ~ .tabs-list-${uniqueId} .tab-label-${uniqueId}[data-tab="${tab.id}"] {
      background: rgb(30, 41, 59) !important;
      color: rgb(241, 245, 249) !important;
      border-color: rgb(71, 85, 105) !important;
    }
    #${uniqueId}-${tab.id}:checked ~ .tabs-content-${uniqueId} .tab-content-${uniqueId}[data-tab="${tab.id}"] {
      display: block !important;
    }`
  ).join('\n  ');

  return `
<div class="blog-tabs-container-${uniqueId}" style="margin: 1.5rem 0 !important; border: 1px solid rgb(51, 65, 85) !important; border-radius: 0.5rem !important; padding: 1rem !important; background: rgb(15, 23, 42) !important;">
  ${radioButtons}
  
  <div class="tabs-list-${uniqueId}" style="display: flex !important; gap: 0.25rem !important; border-bottom: 1px solid rgb(51, 65, 85) !important; padding-bottom: 0.5rem !important; margin-bottom: 1rem !important; flex-wrap: wrap !important;">
    ${tabLabels}
  </div>
  
  <div class="tabs-content-${uniqueId}">
    ${tabContents}
  </div>
</div>

<style>
  .tab-radio-${uniqueId} {
    display: none !important;
  }
  
  .tab-label-${uniqueId} {
    padding: 0.5rem 1rem !important;
    border-radius: 0.375rem !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    border: 1px solid transparent !important;
    background: transparent !important;
    color: rgb(148, 163, 184) !important;
    transition: all 0.2s !important;
    user-select: none !important;
    display: inline-block !important;
    margin: 0 !important;
  }
  
  .tab-content-${uniqueId} {
    display: none !important;
    padding: 1rem 0 !important;
    color: rgb(203, 213, 225) !important;
    line-height: 1.6 !important;
  }
  
  ${radioStyles}
  
  .tab-label-${uniqueId}:hover {
    background: rgb(30, 41, 59) !important;
    color: rgb(241, 245, 249) !important;
  }
</style>
  `.trim();
}

export function TabsPicker({ isOpen, onClose, onInsert }: TabsPickerProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'tab1', label: 'Tab 1', content: '' },
    { id: 'tab2', label: 'Tab 2', content: '' },
  ]);
  const [activeTab, setActiveTab] = useState('tab1');

  const addTab = () => {
    const newId = `tab${tabs.length + 1}`;
    setTabs([...tabs, { id: newId, label: `Tab ${tabs.length + 1}`, content: '' }]);
  };

  const removeTab = (id: string) => {
    if (tabs.length <= 2) return; // Mínimo 2 tabs
    setTabs(tabs.filter(t => t.id !== id));
    if (activeTab === id) {
      setActiveTab(tabs[0].id);
    }
  };

  const updateTabLabel = (id: string, label: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, label } : t));
  };

  const updateTabContent = (id: string, content: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, content } : t));
  };

  const handleInsert = () => {
    if (tabs.some(t => !t.content.trim())) return;
    const html = generateTabsHTML(tabs);
    onInsert(html);
    
    // Reset
    setTabs([
      { id: 'tab1', label: 'Tab 1', content: '' },
      { id: 'tab2', label: 'Tab 2', content: '' },
    ]);
    setActiveTab('tab1');
    onClose();
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Insertar Tabs</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs Preview */}
          <div className="space-y-2">
            <Label>Vista Previa y Edición</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-2">
                <TabsList>
                  {tabs.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTab}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Tab
                </Button>
              </div>

              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                  {/* Label */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Etiqueta del Tab</Label>
                      {tabs.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTab(tab.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={tab.label}
                      onChange={(e) => updateTabLabel(tab.id, e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Ej: macOS"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label>Contenido del Tab</Label>
                    <Textarea
                      value={tab.content}
                      onChange={(e) => updateTabContent(tab.id, e.target.value)}
                      rows={6}
                      placeholder="Escribe el contenido de este tab..."
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleInsert}
              disabled={tabs.some(t => !t.content.trim())}
            >
              Insertar Tabs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
