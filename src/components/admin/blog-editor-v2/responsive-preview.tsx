// FILE: src/components/admin/blog-editor-v2/responsive-preview.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block } from '@/lib/types';
import { BlockRenderer } from '@/components/blog/block-renderer';

interface ResponsivePreviewProps {
  blocks: Block[];
  title: string;
  description?: string;
  authorName?: string;
  coverImage?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
};

const DEVICE_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

const DEVICE_LABELS = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

export function ResponsivePreview({
  blocks,
  title,
  description,
  authorName,
  coverImage,
}: ResponsivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  const width = DEVICE_WIDTHS[device];

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Toolbar */}
      <div className="border-b bg-background p-4 flex items-center justify-center gap-2">
        {(Object.keys(DEVICE_WIDTHS) as DeviceType[]).map((deviceType) => {
          const Icon = DEVICE_ICONS[deviceType];
          return (
            <Button
              key={deviceType}
              variant={device === deviceType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice(deviceType)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{DEVICE_LABELS[deviceType]}</span>
              <span className="text-xs text-muted-foreground hidden md:inline">
                {DEVICE_WIDTHS[deviceType]}px
              </span>
            </Button>
          );
        })}
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
        <div
          className={cn(
            'transition-all duration-300 bg-background shadow-2xl',
            device === 'mobile' && 'rounded-[2.5rem] border-[14px] border-gray-800',
            device === 'tablet' && 'rounded-[1.5rem] border-[10px] border-gray-700',
            device === 'desktop' && 'rounded-lg'
          )}
          style={{
            width: `${width}px`,
            maxWidth: '100%',
          }}
        >
          <div
            className={cn(
              'overflow-y-auto bg-background',
              device === 'mobile' && 'rounded-[1.5rem] h-[667px]',
              device === 'tablet' && 'rounded-[0.75rem] h-[1024px]',
              device === 'desktop' && 'rounded-lg min-h-[800px]'
            )}
          >
            <Card className="p-4 md:p-8 border-0 shadow-none">
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Portada"
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="space-y-4">
                <h1 className={cn(
                  'font-bold',
                  device === 'mobile' && 'text-2xl',
                  device === 'tablet' && 'text-3xl',
                  device === 'desktop' && 'text-4xl'
                )}>
                  {title || 'Título del Post'}
                </h1>

                <div className={cn(
                  'flex items-center gap-4 text-muted-foreground border-b pb-4',
                  device === 'mobile' && 'text-xs',
                  device === 'tablet' && 'text-sm',
                  device === 'desktop' && 'text-sm'
                )}>
                  <span>Por {authorName || 'Autor'}</span>
                  <span>•</span>
                  <span>
                    {new Date().toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {description && (
                  <p className={cn(
                    'text-muted-foreground italic border-l-4 border-primary pl-4',
                    device === 'mobile' && 'text-sm',
                    device === 'tablet' && 'text-base',
                    device === 'desktop' && 'text-lg'
                  )}>
                    {description}
                  </p>
                )}

                <div className={cn(
                  'prose dark:prose-invert max-w-none pt-8',
                  device === 'mobile' && 'prose-sm',
                  device === 'tablet' && 'prose-base',
                  device === 'desktop' && 'prose-lg'
                )}>
                  <BlockRenderer blocks={blocks} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="border-t bg-background p-2 text-center text-xs text-muted-foreground">
        Vista previa: {DEVICE_LABELS[device]} ({width}px)
      </div>
    </div>
  );
}
