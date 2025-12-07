'use client';

import { useState, useEffect } from 'react';
import {
    Check, Copy, FileJson, Upload, Loader2,
    AlertCircle, X, ChevronRight, Wand2, Image as ImageIcon,
    ArrowRight, CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Programa } from '@/lib/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ProgramaJsonInput {
    nombre: string;
    slug: string;
    web_oficial_url?: string;
    descripcion_corta?: string;
    descripcion_larga?: string;
    categoria_slug: string;
    subcategorias?: string[];
    plataformas?: string[];
    modelos_precio?: string[];
    usos?: string[];
    es_recomendado?: boolean;
    es_open_source?: boolean;
    dificultad?: 'Facil' | 'Intermedio' | 'Dificil';
}

const AI_PROMPT = `Actúa como un experto curador de software para una base de datos de alta calidad.
Genera un array de objetos JSON para la siguiente lista de programas.

CRITERIOS CRÍTICOS:
1. **Recomendado (es_recomendado)**: Marca como *true* ÚNICAMENTE si el programa es el estándar de oro de su industria (ej: Photoshop, VS Code, OBS) o una joya oculta indispensable. Sé selectivo.
2. **Descripciones**: 
   - Corta: 60-140 caracteres, persuasiva y orientada a beneficios (SEO).
   - Larga: 2-3 párrafos en Markdown, detallando POR QUÉ usarlo y características clave.

Estructura requerida:
[
  {
    "nombre": "Nombre Exacto",
    "slug": "kebab-case-nombre",
    "web_oficial_url": "https://...",
    "descripcion_corta": "...",
    "descripcion_larga": "...",
    "categoria_slug": "slug-existente-ver-abajo",
    "subcategorias": ["Sub1", "Sub2"],
    "plataformas": ["Windows", "macOS", "Web", "iOS", "Android", "Linux"],
    "modelos_precio": ["Gratis", "Freemium", "Pago único", "Suscripción", "Open Source"],
    "usos": ["Tag1", "Tag2"],
    "es_recomendado": boolean
  }
]

Consulta el archivo de contexto para obtener los slugs de categoría válidos.

Dame los programas de: [PEGAR LISTA AQUÍ]`;

export default function ProgramaJsonImporter({ isOpen, onClose, onSuccess }: Props) {
    const [step, setStep] = useState(1);
    const [jsonInput, setJsonInput] = useState('');
    const [parsedPrograms, setParsedPrograms] = useState<ProgramaJsonInput[]>([]);
    const [importResults, setImportResults] = useState<{
        success: number;
        errors: string[];
        imported: { nombre: string; slug: string; url?: string; status: 'pending' | 'success' | 'checking_assets' | 'assets_found' | 'assets_failed'; }[]
    }>({ success: 0, errors: [], imported: [] });

    const [isImporting, setIsImporting] = useState(false);
    const [isAutoCompleting, setIsAutoCompleting] = useState(false);
    const { toast } = useToast();

    const steps = [
        { number: 1, title: 'Input JSON' },
        { number: 2, title: 'Validar' },
        { number: 3, title: 'Importar' },
        { number: 4, title: 'Assets' }
    ];

    function handleParse() {
        try {
            let clean = jsonInput.trim();
            clean = clean.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '');
            const parsed = JSON.parse(clean);
            const array = Array.isArray(parsed) ? parsed : [parsed];

            const valid = array.filter(p => p.nombre && p.slug && p.categoria_slug);
            setParsedPrograms(valid);

            if (valid.length > 0) {
                setStep(2);
            } else {
                toast({ title: 'JSON Inválido', description: 'No se encontraron programas válidos', variant: 'destructive' });
            }
        } catch (e) {
            toast({ title: 'Error de Sintaxis', description: 'El JSON no es válido.', variant: 'destructive' });
        }
    }

    async function handleImport() {
        setIsImporting(true);
        const results = { success: 0, errors: [] as string[], imported: [] as any[] };
        const supabase = supabaseBrowserClient;

        const [catsRes, platsRes, preciosRes] = await Promise.all([
            supabase.from('categorias').select('id, slug'),
            supabase.from('Plataformas').select('id, nombre'),
            supabase.from('Modelos de Precios').select('id, nombre')
        ]);

        const catMap = new Map(catsRes.data?.map(c => [c.slug, c.id]));

        // Simplificación para no complicar el código en este paso críitico
        // Asumimos mapeo por nombre o slug

        for (const p of parsedPrograms) {
            try {
                const catId = catMap.get(p.categoria_slug);
                if (!catId) throw new Error(`Categoría desconocida: ${p.categoria_slug}`);

                // Sanitize usos - ensure it's an array of strings
                let sanitizedUsos = null;
                if (p.usos) {
                    if (Array.isArray(p.usos)) {
                        sanitizedUsos = p.usos.filter((u: any) => typeof u === 'string');
                    } else if (typeof p.usos === 'string') {
                        sanitizedUsos = [p.usos];
                    }
                }

                const insertData = {
                    nombre: p.nombre,
                    slug: p.slug,
                    web_oficial_url: p.web_oficial_url || null,
                    descripcion_corta: p.descripcion_corta || null,
                    descripcion_larga: p.descripcion_larga || null,
                    categoria_id: catId,
                    usos: sanitizedUsos,
                    es_recomendado: Boolean(p.es_recomendado),
                    es_open_source: Boolean(p.es_open_source),
                    dificultad: p.dificultad && ['Facil', 'Intermedio', 'Dificil'].includes(p.dificultad) ? p.dificultad : null
                };

                console.log('Inserting program:', p.nombre, insertData);

                const { data: prog, error } = await supabase.from('programas').insert(insertData).select().single();

                if (error) {
                    console.error('Insert error for', p.nombre, ':', error);
                    throw error;
                }

                // Aquí iría la lógica de relaciones si el JSON las incluye bien
                // Por brevedad y robustez, nos enfocamos en el core program primero

                results.success++;
                results.imported.push({
                    nombre: p.nombre,
                    slug: p.slug,
                    url: p.web_oficial_url,
                    status: 'success'
                });
            } catch (e: any) {
                console.error('Error importing', p.nombre, ':', e);
                results.errors.push(`${p.nombre}: ${e.message || JSON.stringify(e)}`);
            }
        }

        setImportResults(results);
        setIsImporting(false);
        setStep(4);

        if (results.success > 0) {
            handleAutoAssets(results.imported);
        }
    }

    async function handleAutoAssets(items: any[]) {
        setIsAutoCompleting(true);
        const newImported = [...items];

        for (let i = 0; i < newImported.length; i++) {
            const item = newImported[i];
            if (item.status !== 'success' || !item.url) continue;

            item.status = 'checking_assets';
            setImportResults(prev => ({ ...prev, imported: [...newImported] }));

            try {
                let url = item.url;
                if (!url.startsWith('http')) url = `https://${url}`;

                const res = await fetch('/api/auto-assets', {
                    method: 'POST',
                    body: JSON.stringify({ url, slug: item.slug })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.logoUrl || data.screenshotUrl) {
                        item.status = 'assets_found';
                        await supabaseBrowserClient.from('programas').update({
                            ...(data.logoUrl && { icono_url: data.logoUrl }),
                            ...(data.screenshotUrl && { captura_url: data.screenshotUrl })
                        }).eq('slug', item.slug);
                    } else {
                        item.status = 'assets_failed';
                    }
                } else {
                    item.status = 'assets_failed';
                }
            } catch {
                item.status = 'assets_failed';
            }
            setImportResults(prev => ({ ...prev, imported: [...newImported] }));
            await new Promise(r => setTimeout(r, 800));
        }
        setIsAutoCompleting(false);
    }

    function copyPrompt() {
        navigator.clipboard.writeText(AI_PROMPT);
        toast({ title: 'Prompt copiado' });
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { if (!isImporting && !isAutoCompleting) onClose(); }}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">

                {/* Header */}
                <div className="p-6 border-b bg-muted/20">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Importador AI
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
                    </div>

                    <div className="flex justify-between px-10 relative">
                        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-muted -z-10 -translate-y-1/2" />
                        {steps.map((s, i) => (
                            <div key={s.number} className="flex flex-col items-center gap-2 bg-background px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s.number ? 'bg-pink-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                    {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                                </div>
                                <span className={`text-xs font-medium ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="space-y-4 h-full flex flex-col">
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 text-blue-800 dark:text-blue-300">
                                <Wand2 className="h-4 w-4" />
                                <AlertDescription className="flex justify-between items-center">
                                    <span>Copia el prompt y úsalo en tu IA para generar el JSON.</span>
                                    <Button size="sm" variant="outline" onClick={copyPrompt} className="gap-2 bg-background/50 hover:bg-background h-7">
                                        <Copy className="h-3 w-3" /> Prompt
                                    </Button>
                                </AlertDescription>
                            </Alert>

                            <Textarea
                                value={jsonInput}
                                onChange={e => setJsonInput(e.target.value)}
                                className="flex-1 font-mono text-xs resize-none p-4"
                                placeholder="Pegar JSON generado aquí..."
                            />

                            <div className="flex justify-end">
                                <Button onClick={handleParse} disabled={!jsonInput.trim()} className="bg-pink-600 hover:bg-pink-700">
                                    Validar JSON <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Programas detectados ({parsedPrograms.length})</h3>
                                <Button variant="ghost" onClick={() => setStep(1)} size="sm">Volver</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {parsedPrograms.map((p, i) => (
                                    <div key={i} className="p-3 rounded-lg border bg-card flex gap-3 relative overflow-hidden">
                                        {p.es_recomendado && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] px-2 font-bold uppercase rounded-bl">Top</div>}
                                        <FileJson className="h-8 w-8 text-pink-500/50 shrink-0" />
                                        <div className="min-w-0">
                                            <div className="font-medium truncate">{p.nombre}</div>
                                            <div className="text-xs text-muted-foreground truncate">{p.categoria_slug}</div>
                                            <div className="flex gap-1 mt-1">
                                                {p.web_oficial_url && <Badge variant="outline" className="text-[10px]">URL</Badge>}
                                                {p.usos && <Badge variant="outline" className="text-[10px]">{p.usos.length} usos</Badge>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button onClick={handleImport} className="bg-pink-600 hover:bg-pink-700 min-w-[150px]">
                                    <Upload className="mr-2 h-4 w-4" /> Importar Todo
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 & 4 */}
                    {(step === 3 || step === 4) && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="text-center py-6">
                                {isImporting ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
                                        <p className="text-lg font-medium">Importando...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                                        <h3 className="text-2xl font-bold">{importResults.success} Importados</h3>
                                        <p className="text-muted-foreground">Procesando assets...</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 border rounded-xl overflow-hidden bg-card">
                                <div className="bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between">
                                    <span>Programa</span>
                                    <span>Estado</span>
                                </div>
                                <div className="divide-y max-h-[400px] overflow-y-auto">
                                    {importResults.imported.map((item, i) => (
                                        <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-gray-300' : item.status.includes('assets_found') ? 'bg-green-500' : 'bg-red-400'}`} />
                                                <span className="font-medium">{item.nombre}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {item.status === 'checking_assets' && (
                                                    <span className="flex items-center text-xs text-blue-500">
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" /> Assets...
                                                    </span>
                                                )}
                                                {item.status === 'assets_found' && (
                                                    <span className="flex items-center text-xs text-green-600 font-medium">
                                                        <ImageIcon className="h-3 w-3 mr-1" /> OK
                                                    </span>
                                                )}
                                                {item.status === 'assets_failed' && <span className="text-xs text-muted-foreground">-</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!isImporting && !isAutoCompleting && (
                                <div className="flex justify-center pt-4">
                                    <Button onClick={() => { onClose(); onSuccess(); }} className="min-w-[200px]">
                                        Finalizar
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
