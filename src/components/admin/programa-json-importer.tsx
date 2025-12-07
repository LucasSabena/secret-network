'use client';

import { useState } from 'react';
import { Copy, Check, FileJson, Upload, Loader2, AlertCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

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
    dificultad?: 'Facil' | 'Intermedio' | 'Dificil';
    es_open_source?: boolean;
    es_recomendado?: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AI_PROMPT = `Necesito que generes un JSON con información de programas/software para importar a una base de datos. El formato debe ser exactamente así:

\`\`\`json
[
  {
    "nombre": "Nombre del Programa",
    "slug": "nombre-del-programa",
    "web_oficial_url": "https://ejemplo.com",
    "descripcion_corta": "Descripción breve de 1-2 líneas",
    "descripcion_larga": "Descripción más detallada del programa y sus características principales",
    "categoria_slug": "slug-de-la-categoria",
    "subcategorias": ["subcategoria1", "subcategoria2"],
    "usos": ["Edición de fotos", "Retoque digital", "Diseño gráfico"],
    "plataformas": ["windows", "macos", "linux", "web", "android", "ios"],
    "modelos_precio": ["gratis", "freemium", "pago-unico", "suscripcion"],
    "dificultad": "Facil|Intermedio|Dificil",
    "es_open_source": true|false,
    "es_recomendado": false
  }
]
\`\`\`

Reglas:
- El slug debe ser lowercase, sin espacios, usando guiones
- descripcion_corta máximo 200 caracteres
- usos: lista de 3-5 funcionalidades principales (ej: "Edición de PDFs", "Firmas digitales")
- dificultad solo puede ser: "Facil", "Intermedio", o "Dificil"
- plataformas disponibles: windows, macos, linux, web, android, ios
- modelos_precio: gratis, freemium, pago-unico, suscripcion
- Devuelve SOLO el JSON, sin texto adicional

Dame los programas de: [DESCRIBE QUÉ PROGRAMAS NECESITAS]`;

export default function ProgramaJsonImporter({ isOpen, onClose, onSuccess }: Props) {
    const [step, setStep] = useState(1);
    const [jsonInput, setJsonInput] = useState('');
    const [parsedPrograms, setParsedPrograms] = useState<ProgramaJsonInput[]>([]);
    const [parseError, setParseError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResults, setImportResults] = useState<{ success: number; errors: string[] }>({ success: 0, errors: [] });
    const { toast } = useToast();

    function handleCopyPrompt() {
        navigator.clipboard.writeText(AI_PROMPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: 'Prompt copiado',
            description: 'Pegalo en tu IA favorita (ChatGPT, Claude, etc.)',
        });
    }

    function handleParseJson() {
        setParseError(null);
        try {
            // Intentar limpiar el JSON si viene con markdown
            let cleanJson = jsonInput.trim();
            if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
            }

            const parsed = JSON.parse(cleanJson);
            const programs = Array.isArray(parsed) ? parsed : [parsed];

            // Validar campos requeridos
            const validated: ProgramaJsonInput[] = [];
            const errors: string[] = [];

            programs.forEach((prog, idx) => {
                if (!prog.nombre) {
                    errors.push(`Programa ${idx + 1}: falta "nombre"`);
                    return;
                }
                if (!prog.slug) {
                    errors.push(`Programa ${idx + 1}: falta "slug"`);
                    return;
                }
                if (!prog.categoria_slug) {
                    errors.push(`Programa ${idx + 1}: falta "categoria_slug"`);
                    return;
                }
                validated.push({
                    nombre: prog.nombre,
                    slug: prog.slug.toLowerCase().replace(/\s+/g, '-'),
                    web_oficial_url: prog.web_oficial_url || null,
                    descripcion_corta: prog.descripcion_corta || null,
                    descripcion_larga: prog.descripcion_larga || null,
                    categoria_slug: prog.categoria_slug,
                    subcategorias: prog.subcategorias || [],
                    plataformas: prog.plataformas || [],
                    modelos_precio: prog.modelos_precio || [],
                    usos: prog.usos || [],
                    dificultad: prog.dificultad || 'Intermedio',
                    es_open_source: prog.es_open_source || false,
                    es_recomendado: prog.es_recomendado || false,
                });
            });

            if (errors.length > 0) {
                setParseError(errors.join('\n'));
                return;
            }

            if (validated.length === 0) {
                setParseError('No se encontraron programas válidos en el JSON');
                return;
            }

            setParsedPrograms(validated);
            setStep(3);
        } catch (e) {
            setParseError(`Error de sintaxis JSON: ${(e as Error).message}`);
        }
    }

    async function handleImport() {
        setIsImporting(true);
        const results = { success: 0, errors: [] as string[] };

        try {
            const supabase = supabaseBrowserClient;

            // Cargar categorías y subcategorías para mapear slugs a IDs
            const { data: categorias } = await supabase.from('categorias').select('id, slug, id_categoria_padre');
            const categoriasMap = new Map(categorias?.map(c => [c.slug, c]) || []);

            // Cargar plataformas
            const { data: plataformas } = await supabase.from('Plataformas').select('id, slug, nombre');
            const plataformasMap = new Map(plataformas?.map(p => [p.slug?.toLowerCase() || p.nombre.toLowerCase(), p.id]) || []);

            // Cargar modelos de precio
            const { data: precios } = await supabase.from('Modelos de Precios').select('id, slug, nombre');
            const preciosMap = new Map(precios?.map(p => [p.slug?.toLowerCase() || p.nombre.toLowerCase(), p.id]) || []);

            for (const prog of parsedPrograms) {
                try {
                    // Buscar categoría
                    const categoria = categoriasMap.get(prog.categoria_slug);
                    if (!categoria) {
                        results.errors.push(`${prog.nombre}: categoría "${prog.categoria_slug}" no encontrada`);
                        continue;
                    }

                    // Insertar programa
                    const { data: inserted, error: insertError } = await supabase
                        .from('programas')
                        .insert({
                            nombre: prog.nombre,
                            slug: prog.slug,
                            web_oficial_url: prog.web_oficial_url,
                            descripcion_corta: prog.descripcion_corta,
                            descripcion_larga: prog.descripcion_larga,
                            categoria_id: categoria.id,
                            categoria_slug: prog.categoria_slug,
                            dificultad: prog.dificultad,
                            es_open_source: prog.es_open_source,
                            es_recomendado: prog.es_recomendado,
                            usos: prog.usos && prog.usos.length > 0 ? prog.usos : null,
                        })
                        .select()
                        .single();

                    if (insertError) {
                        if (insertError.code === '23505') {
                            results.errors.push(`${prog.nombre}: ya existe (slug duplicado)`);
                        } else {
                            results.errors.push(`${prog.nombre}: ${insertError.message}`);
                        }
                        continue;
                    }

                    const programaId = inserted.id;

                    // Insertar subcategorías
                    if (prog.subcategorias && prog.subcategorias.length > 0) {
                        const subcatInserts = prog.subcategorias
                            .map(slug => {
                                const subcat = categoriasMap.get(slug);
                                return subcat ? { programa_id: programaId, subcategoria_id: subcat.id } : null;
                            })
                            .filter(Boolean);

                        if (subcatInserts.length > 0) {
                            await supabase.from('programas_subcategorias').insert(subcatInserts);
                        }
                    }

                    // Insertar plataformas
                    if (prog.plataformas && prog.plataformas.length > 0) {
                        const platInserts = prog.plataformas
                            .map(name => {
                                const platId = plataformasMap.get(name.toLowerCase());
                                return platId ? { programa_id: programaId, plataforma_id: platId } : null;
                            })
                            .filter(Boolean);

                        if (platInserts.length > 0) {
                            await supabase.from('programas_plataformas').insert(platInserts);
                        }
                    }

                    // Insertar modelos de precio
                    if (prog.modelos_precio && prog.modelos_precio.length > 0) {
                        const precioInserts = prog.modelos_precio
                            .map(name => {
                                const precioId = preciosMap.get(name.toLowerCase().replace(/\s+/g, '-'));
                                return precioId ? { programa_id: programaId, precio_id: precioId } : null;
                            })
                            .filter(Boolean);

                        if (precioInserts.length > 0) {
                            await supabase.from('programas_precios').insert(precioInserts);
                        }
                    }

                    results.success++;
                } catch (e) {
                    results.errors.push(`${prog.nombre}: ${(e as Error).message}`);
                }
            }

            setImportResults(results);
            setStep(4);

            if (results.success > 0) {
                toast({
                    title: '✅ Importación completada',
                    description: `${results.success} programa(s) importado(s)${results.errors.length > 0 ? `, ${results.errors.length} con errores` : ''}`,
                });
            }
        } catch (e) {
            toast({
                title: 'Error',
                description: (e as Error).message,
                variant: 'destructive',
            });
        } finally {
            setIsImporting(false);
        }
    }

    function handleClose() {
        setStep(1);
        setJsonInput('');
        setParsedPrograms([]);
        setParseError(null);
        setImportResults({ success: 0, errors: [] });
        onClose();
        if (importResults.success > 0) {
            onSuccess();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileJson className="h-5 w-5" />
                        Importar Programas con JSON
                    </DialogTitle>
                </DialogHeader>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s
                                ? 'bg-pink-500 text-white'
                                : step > s
                                    ? 'bg-green-500 text-white'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {step > s ? '✓' : s}
                        </div>
                    ))}
                </div>

                {/* Step 1: Copy Prompt */}
                {step === 1 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Copiá este prompt y pegalo en ChatGPT, Claude, o cualquier IA para generar el JSON de programas.
                        </p>
                        <div className="relative">
                            <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">
                                {AI_PROMPT}
                            </pre>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2 gap-2"
                                onClick={handleCopyPrompt}
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </Button>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => setStep(2)} className="gap-2">
                                Siguiente
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Paste JSON or Upload File */}
                {step === 2 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Pegá el JSON o subí un archivo <code>.json</code>
                        </p>

                        {/* File upload */}
                        <div className="flex items-center gap-2">
                            <label className="flex-1">
                                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors">
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Subir archivo .json
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept=".json,application/json"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setJsonInput(event.target?.result as string || '');
                                            };
                                            reader.readAsText(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-muted"></div>
                            <span className="flex-shrink mx-3 text-xs text-muted-foreground">o pegá el texto</span>
                            <div className="flex-grow border-t border-muted"></div>
                        </div>

                        <Textarea
                            placeholder='[{"nombre": "Figma", "slug": "figma", ...}]'
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="min-h-[160px] font-mono text-sm"
                        />
                        {parseError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="whitespace-pre-wrap">{parseError}</AlertDescription>
                            </Alert>
                        )}
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Atrás
                            </Button>
                            <Button onClick={handleParseJson} disabled={!jsonInput.trim()} className="gap-2">
                                Validar JSON
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Preview & Import */}
                {step === 3 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Se encontraron <strong>{parsedPrograms.length}</strong> programa(s) para importar:
                        </p>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {parsedPrograms.map((prog, idx) => (
                                <div key={idx} className="p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{prog.nombre}</span>
                                        <Badge variant="outline" className="text-xs">{prog.categoria_slug}</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {prog.descripcion_corta?.substring(0, 80)}
                                        {prog.descripcion_corta && prog.descripcion_corta.length > 80 ? '...' : ''}
                                    </div>
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {prog.plataformas?.map((p) => (
                                            <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Los iconos y capturas se pueden agregar después con "Auto-completar" en cada programa.
                            </AlertDescription>
                        </Alert>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Atrás
                            </Button>
                            <Button onClick={handleImport} disabled={isImporting} className="gap-2 bg-pink-500 hover:bg-pink-600">
                                {isImporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Importando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Importar {parsedPrograms.length} programa(s)
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Results */}
                {step === 4 && (
                    <div className="space-y-4">
                        <div className="text-center py-4">
                            <div className="text-4xl mb-2">
                                {importResults.errors.length === 0 ? '🎉' : '⚠️'}
                            </div>
                            <h3 className="text-lg font-semibold">
                                {importResults.success} programa(s) importado(s)
                            </h3>
                            {importResults.errors.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {importResults.errors.length} con errores
                                </p>
                            )}
                        </div>

                        {importResults.errors.length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <ul className="list-disc list-inside text-sm">
                                        {importResults.errors.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={handleClose} className="gap-2">
                                <X className="h-4 w-4" />
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
