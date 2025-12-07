'use client';

import { useState } from 'react';
import { Wand2, Loader2, ImageIcon, Camera, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface AutoAssetFetcherProps {
    url: string;
    slug: string;
    onIconFetched?: (url: string) => void;
    onScreenshotFetched?: (url: string) => void;
    onComplete?: (result: { logoUrl?: string; screenshotUrl?: string }) => void;
    variant?: 'button' | 'icon' | 'dropdown';
    size?: 'sm' | 'default' | 'lg';
    disabled?: boolean;
    className?: string;
}

type FetchType = 'all' | 'icon' | 'screenshot';

export default function AutoAssetFetcher({
    url,
    slug,
    onIconFetched,
    onScreenshotFetched,
    onComplete,
    variant = 'dropdown',
    size = 'default',
    disabled = false,
    className = ''
}: AutoAssetFetcherProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [lastResult, setLastResult] = useState<{ icon?: boolean; screenshot?: boolean } | null>(null);
    const { toast } = useToast();

    async function handleFetch(type: FetchType) {
        if (!url) {
            toast({ title: 'URL requerida', description: 'Ingresa la URL del sitio web primero.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        setLastResult(null);

        try {
            let cleanUrl = url;
            if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`;

            const res = await fetch('/api/auto-assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: cleanUrl, slug, type })
            });

            const data = await res.json();

            if (data.logoUrl) {
                onIconFetched?.(data.logoUrl);
            }
            if (data.screenshotUrl) {
                onScreenshotFetched?.(data.screenshotUrl);
            }

            onComplete?.(data);

            setLastResult({
                icon: type === 'all' || type === 'icon' ? !!data.logoUrl : undefined,
                screenshot: type === 'all' || type === 'screenshot' ? !!data.screenshotUrl : undefined
            });

            // Toast feedback
            const iconOk = data.logoUrl ? '✓ Icono' : '';
            const screenOk = data.screenshotUrl ? '✓ Captura' : '';
            const found = [iconOk, screenOk].filter(Boolean).join(' | ');

            if (found) {
                toast({ title: 'Assets encontrados', description: found });
            } else {
                toast({ title: 'Sin resultados', description: 'No se encontraron assets.', variant: 'destructive' });
            }
        } catch (e) {
            toast({ title: 'Error', description: 'Fallo al obtener assets.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    if (variant === 'icon') {
        return (
            <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled || isLoading}
                onClick={() => handleFetch('all')}
                className={className}
                title="Auto-detectar Icono y Captura"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-pink-500" />}
            </Button>
        );
    }

    if (variant === 'button') {
        // Determine type based on which callbacks are set
        const autoType: FetchType = onIconFetched && !onScreenshotFetched
            ? 'icon'
            : !onIconFetched && onScreenshotFetched
                ? 'screenshot'
                : 'all';

        const label = autoType === 'icon'
            ? 'Auto Icono'
            : autoType === 'screenshot'
                ? 'Auto Captura'
                : 'Auto-detectar';

        return (
            <Button
                type="button"
                variant="ghost"
                size={size}
                disabled={disabled || isLoading}
                onClick={() => handleFetch(autoType)}
                className={`gap-2 text-pink-500 ${className}`}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {label}
            </Button>
        );
    }

    // Dropdown variant (default) - shows all 3 options
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size={size}
                    disabled={disabled || isLoading}
                    className={`gap-2 ${className}`}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-pink-500" />}
                    Auto Assets
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleFetch('all')} className="gap-2">
                    <Wand2 className="h-4 w-4" />
                    Detectar Todo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFetch('icon')} className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Solo Icono
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFetch('screenshot')} className="gap-2">
                    <Camera className="h-4 w-4" />
                    Solo Captura
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
