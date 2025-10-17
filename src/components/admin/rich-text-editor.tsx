'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Underline as UnderlineIcon,
  Highlighter,
  Loader2,
  Palette,
  Type,
  Blocks,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ComponentsPicker from './blog-components/components-picker';

const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', html);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escribe aquí...',
  className,
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isComponentsPickerOpen, setIsComponentsPickerOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { toast } = useToast();

  const textColors = [
    { name: 'Negro', value: '#000000' },
    { name: 'Gris', value: '#6B7280' },
    { name: 'Blanco', value: '#FFFFFF' },
    { name: 'Rosa (Primary)', value: '#ff3399' },
    { name: 'Verde (Secondary)', value: '#00cc66' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Amarillo', value: '#EAB308' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Morado', value: '#A855F7' },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-muted p-4 rounded-md my-4 overflow-x-auto',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none min-h-[400px] px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          className
        ),
      },
    },
  });

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Error',
          description: validation.error,
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsUploadingImage(true);
        const url = await uploadToCloudinary(file, 'blog-content');
        editor.chain().focus().setImage({ src: url }).run();
        toast({
          title: 'Éxito',
          description: 'Imagen subida correctamente',
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error',
          description: 'No se pudo subir la imagen',
          variant: 'destructive',
        });
      } finally {
        setIsUploadingImage(false);
      }
    };
    input.click();
  }, [editor, toast]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinkDialogOpen(true);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }

    setIsLinkDialogOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const insertComponent = useCallback((html: string) => {
    if (!editor) return;
    
    // Insertar el HTML en la posición actual del cursor
    editor.chain().focus().insertContent(html).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-accent' : ''} title="Negrita">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-accent' : ''} title="Cursiva">
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-accent' : ''} title="Subrayado">
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'bg-accent' : ''} title="Resaltar">
            <Highlighter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''} title="Título 1">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''} title="Título 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''} title="Título 3">
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-accent' : ''} title="Lista">
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-accent' : ''} title="Lista numerada">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''} title="Izquierda">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''} title="Centro">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''} title="Derecha">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-accent' : ''} title="Cita">
            <Quote className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'bg-accent' : ''} title="Código">
            <Code className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 border-r pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            title="Color de texto"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-accent' : ''} title="Enlace">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={addImage} disabled={isUploadingImage} title="Imagen">
            {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsComponentsPickerOpen(true)} 
            title="Insertar componente"
            className="text-primary hover:text-primary/80"
          >
            <Blocks className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
            <Undo className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isColorPickerOpen && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30 mb-2">
          <span className="text-xs font-medium text-muted-foreground w-full">Seleccionar color de texto:</span>
          {textColors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => {
                editor.chain().focus().setColor(color.value).run();
                setIsColorPickerOpen(false);
              }}
              className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setIsColorPickerOpen(false);
            }}
            className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 relative"
            title="Remover color"
          >
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✕</span>
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Enlace</DialogTitle>
            <DialogDescription>Ingresa la URL del enlace. Deja en blanco para remover.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://ejemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setIsLinkDialogOpen(false); setLinkUrl(''); }}>Cancelar</Button>
            <Button type="button" onClick={saveLink}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para insertar componentes */}
      <ComponentsPicker
        isOpen={isComponentsPickerOpen}
        onClose={() => setIsComponentsPickerOpen(false)}
        onInsert={insertComponent}
      />
    </div>
  );
}
