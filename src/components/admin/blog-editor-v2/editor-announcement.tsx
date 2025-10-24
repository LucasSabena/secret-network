// FILE: src/components/admin/blog-editor-v2/editor-announcement.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';

const ANNOUNCEMENT_KEY = 'blog-editor-v2-announcement-dismissed';

export function EditorAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            ¡Nuevo Editor Drag-and-Drop! 🎉
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Hemos creado un editor completamente nuevo para el blog. Es más
            intuitivo, visual y fácil de usar. Pruébalo haciendo clic en el
            botón "🎨 Nuevo Editor" arriba.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={handleDismiss}>
              ¡Entendido!
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // Abrir documentación
                window.open(
                  'https://github.com/tu-repo/blob/main/.informacion-admin/NUEVO_EDITOR_BLOG.md',
                  '_blank'
                );
              }}
            >
              Ver guía
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
