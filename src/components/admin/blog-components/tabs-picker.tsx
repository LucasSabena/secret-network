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
  const tabListItems = tabs.map(tab => 
    `<button data-tab="${tab.id}" style="
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      color: #94a3b8;
      transition: all 0.2s;
    " onmouseover="this.style.backgroundColor='#1e293b'; this.style.color='#f1f5f9'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#94a3b8'">${tab.label}</button>`
  ).join('\n    ');

  const tabContents = tabs.map((tab, index) => 
    `<div data-tab-content="${tab.id}" style="display: ${index === 0 ? 'block' : 'none'}; padding: 1rem 0;">
      ${tab.content}
    </div>`
  ).join('\n  ');

  return `
<div style="margin: 1.5rem 0; border: 1px solid #334155; border-radius: 0.5rem; padding: 1rem; background: #0f172a;">
  <div style="display: flex; gap: 0.25rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; margin-bottom: 1rem;">
    ${tabListItems}
  </div>
  ${tabContents}
</div>

<script>
(function() {
  const buttons = document.querySelectorAll('[data-tab]');
  const contents = document.querySelectorAll('[data-tab-content]');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Reset all buttons
      buttons.forEach(b => {
        b.style.backgroundColor = 'transparent';
        b.style.color = '#94a3b8';
        b.style.borderColor = 'transparent';
      });
      
      // Activate clicked button
      btn.style.backgroundColor = '#1e293b';
      btn.style.color = '#f1f5f9';
      btn.style.borderColor = '#475569';
      
      // Hide all contents
      contents.forEach(c => c.style.display = 'none');
      
      // Show selected content
      document.querySelector('[data-tab-content="' + tabId + '"]').style.display = 'block';
    });
  });
  
  // Activate first tab by default
  if (buttons.length > 0) {
    buttons[0].style.backgroundColor = '#1e293b';
    buttons[0].style.color = '#f1f5f9';
    buttons[0].style.borderColor = '#475569';
  }
})();
</script>
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
