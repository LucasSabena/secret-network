'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Clipboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface QuickAssetEditorProps {
    programa: {
        id: number;
        nombre: string;
        slug: string;
        icono_url?: string | null;
        captura_url?: string | null;
    };
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

export default function QuickAssetEditor({ programa, isOpen, onClose, onUpdate }: QuickAssetEditorProps) {
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [capturaFile, setCapturaFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(programa.icono_url || null);
    const [capturaPreview, setCapturaPreview] = useState<string | null>(programa.captura_url || null);
    const [isSaving, setIsSaving] = useState(false);
    const [pasteMode, setPasteMode] = useState<'icon' | 'captura' | null>(null);
    const capturaDropRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Reset on program change
    useEffect(() => {
        setIconPreview(programa.icono_url || null);
        setCapturaPreview(programa.captura_url || null);
        setIconFile(null);
        setCapturaFile(null);
    }, [programa]);

    // Handle paste from clipboard
    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    if (pasteMode === 'icon') {
                        setIconFile(file);
                        setIconPreview(URL.createObjectURL(file));
                    } else {
                        setCapturaFile(file);
                        setCapturaPreview(URL.createObjectURL(file));
                    }
                    toast({ title: '✅ Imagen pegada', description: 'Guardá para aplicar los cambios' });
                }
            }
        }
    }, [pasteMode, toast]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('paste', handlePaste);
            return () => document.removeEventListener('paste', handlePaste);
        }
    }, [isOpen, handlePaste]);

    function handleIconFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                toast({ title: 'Error', description: validation.error, variant: 'destructive' });
                return;
            }
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
        }
    }

    function handleCapturaFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
                toast({ title: 'Error', description: validation.error, variant: 'destructive' });
                return;
            }
            setCapturaFile(file);
            setCapturaPreview(URL.createObjectURL(file));
        }
    }

    async function handleSave() {
        if (!iconFile && !capturaFile) {
            toast({ title: 'Sin cambios', description: 'No hay imágenes nuevas para guardar' });
            return;
        }

        setIsSaving(true);
        try {
            const updates: { icono_url?: string; captura_url?: string } = {};

            if (iconFile) {
                const iconUrl = await uploadToCloudinary(iconFile, 'programas/icons', `${programa.slug}-icon`);
                updates.icono_url = iconUrl;
            }

            if (capturaFile) {
                const capturaUrl = await uploadToCloudinary(capturaFile, 'programas/screenshots', `${programa.slug}-screenshot`);
                updates.captura_url = capturaUrl;
            }

            const { error } = await supabaseBrowserClient
                .from('programas')
                .update(updates)
                .eq('id', programa.id);

            if (error) throw error;

            toast({ title: '✅ Assets actualizados' });
            onUpdate?.();
            onClose();
        } catch (e) {
            toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-pink-500" />
                        {programa.nombre}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Icono */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Icono</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPasteMode(pasteMode === 'icon' ? null : 'icon')}
                                className={pasteMode === 'icon' ? 'bg-pink-100 text-pink-700' : ''}
                            >
                                <Clipboard className="h-3 w-3 mr-1" />
                                {pasteMode === 'icon' ? 'Esperando Ctrl+V...' : 'Pegar'}
                            </Button>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted/30 shrink-0">
                                {iconPreview ? (
                                    <img src={iconPreview} alt="Icono" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Upload className="h-6 w-6 text-muted-foreground opacity-50" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIconFileChange}
                                    className="text-sm"
                                />
                                {iconFile && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Nuevo archivo listo
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Captura */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Captura de pantalla</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPasteMode(pasteMode === 'captura' ? null : 'captura')}
                                className={pasteMode === 'captura' ? 'bg-pink-100 text-pink-700' : ''}
                            >
                                <Clipboard className="h-3 w-3 mr-1" />
                                {pasteMode === 'captura' ? 'Esperando Ctrl+V...' : 'Pegar'}
                            </Button>
                        </div>
                        <div
                            ref={capturaDropRef}
                            className={`aspect-video border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-muted/30 ${pasteMode === 'captura' ? 'border-pink-400 bg-pink-50' : ''}`}
                        >
                            {capturaPreview ? (
                                <img src={capturaPreview} alt="Captura" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Subí o pegá una captura</p>
                                </div>
                            )}
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleCapturaFileChange}
                            className="text-sm"
                        />
                        {capturaFile && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <Check className="h-3 w-3" /> Nuevo archivo listo
                            </p>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        💡 Podés pegar imágenes directamente con Ctrl+V
                    </p>

                    {/* Actions */}
                    <div className="flex justify-between pt-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || (!iconFile && !capturaFile)}
                            className="gap-2 bg-pink-500 hover:bg-pink-600"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Guardar cambios
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
