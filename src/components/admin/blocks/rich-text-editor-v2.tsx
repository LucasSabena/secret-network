'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from './tiptap-extensions/font-size';
import Highlight from '@tiptap/extension-highlight';
import { useEffect, useState, useCallback } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Strikethrough, Code, Link2, 
  List, ListOrdered, Quote,
  Undo, Redo, Palette, Upload, Package, ChevronDown, Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlashCommands, suggestion } from './tiptap-extensions/slash-commands';
import { ProgramNode } from './tiptap-extensions/program-node';
import { BadgeNode, BADGE_COLORS, BadgeColor } from './tiptap-extensions/badge-node';
import { BadgeDialog } from './tiptap-extensions/badge-dialog';
import { useToast } from '@/components/ui/use-toast';

interface RichTextEditorV2Props {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditorV2({ content, onChange, placeholder }: RichTextEditorV2Props) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [showProgramPopover, setShowProgramPopover] = useState(false);
  const [programSearch, setProgramSearch] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<'small' | 'medium' | 'large'>('medium');
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const { toast } = useToast();

  // Buscar programas
  useEffect(() => {
    const searchPrograms = async () => {
      if (programSearch.length < 2) {
        setPrograms([]);
        return;
      }

      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('id, nombre, icono_url')
        .ilike('nombre', `%${programSearch}%`)
        .limit(10);

      setPrograms(data || []);
    };

    const debounce = setTimeout(searchPrograms, 300);
    return () => clearTimeout(debounce);
  }, [programSearch]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Deshabilitar markdown shortcuts
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic',
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Escribe "/" para comandos...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto cursor-pointer',
        },
      }),
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      ProgramNode,
      BadgeNode,
      SlashCommands.configure({
        suggestion,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            uploadImage(file);
            return true;
          }
        }
        return false;
      },
      // NO capturar paste de imágenes - eso debe manejarse en bloques de imagen dedicados
      handlePaste: (view, event) => {
        // Permitir que el paste normal funcione (texto, links, etc.)
        // pero NO capturar imágenes aquí
        return false;
      },
      handleKeyDown: (view, event) => {
        // Permitir eliminar imágenes con Delete o Backspace
        const { selection } = view.state;
        const { $from } = selection;
        const node = $from.node();
        
        if (node && node.type.name === 'image' && (event.key === 'Delete' || event.key === 'Backspace')) {
          return false; // Permitir eliminación
        }
        
        return false;
      },
    },
  });

  const uploadImage = useCallback(async (file: File) => {
    if (!editor) return;

    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary-upload');
      const url = await uploadToCloudinary(file, 'blog/images');
      
      // Insertar imagen inline en el editor de texto
      editor.chain().focus().setImage({ src: url }).run();
      
      toast({
        title: 'Imagen subida',
        description: 'La imagen se insertó en el texto',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Error al subir la imagen',
        variant: 'destructive',
      });
    }
  }, [editor, toast]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkPopover(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar Principal */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Selector de Formato */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 min-w-[120px] justify-between"
            >
              <span className="text-xs">
                {editor.isActive('heading', { level: 1 }) ? 'Título 1' :
                 editor.isActive('heading', { level: 2 }) ? 'Título 2' :
                 editor.isActive('heading', { level: 3 }) ? 'Título 3' :
                 editor.isActive('heading', { level: 4 }) ? 'Título 4' :
                 editor.isActive('heading', { level: 5 }) ? 'Título 5' :
                 editor.isActive('heading', { level: 6 }) ? 'Título 6' :
                 'Párrafo'}
              </span>
              <ChevronDown className="h-3 w-3 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => editor.chain().focus().setParagraph().run()}
              >
                Párrafo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-2xl font-bold"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                Título 1
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xl font-bold"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                Título 2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-lg font-bold"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                Título 3
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-base font-semibold"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              >
                Título 4
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm font-semibold"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
              >
                Título 5
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs font-semibold"
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
              >
                Título 6
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Selector de Tamaño */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-16 justify-between"
            >
              <span className="text-xs">
                {editor.getAttributes('textStyle').fontSize || '16px'}
              </span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-2">
            <div className="space-y-1">
              {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => editor.chain().focus().setMark('textStyle', { fontSize: size }).run()}
                >
                  {size}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-accent')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-accent')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-accent')}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('code') && 'bg-accent')}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-accent')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-accent')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('blockquote') && 'bg-accent')}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Link */}
        <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-accent')}
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label>URL del enlace</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={setLink}>
                  Agregar
                </Button>
                {editor.isActive('link') && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setShowLinkPopover(false);
                    }}
                  >
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <Label>Color de texto</Label>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="ghost"
                    size="sm"
                    title={`Color ${color}`}
                    aria-label={`Seleccionar color ${color}`}
                    className="w-8 h-8 p-0 rounded border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => editor.chain().focus().unsetColor().run()}
              >
                Quitar color
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Imagen */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => document.getElementById('image-upload')?.click()}
          title="Subir imagen"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          title="Subir imagen"
          aria-label="Subir imagen"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />

        {/* Programa */}
        <Popover open={showProgramPopover} onOpenChange={setShowProgramPopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Insertar programa"
            >
              <Package className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-3">
              <div>
                <Label>Buscar Programa</Label>
                <Input
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  placeholder="Escribe el nombre del programa..."
                  autoFocus
                />
              </div>

              {programs.length > 0 && (
                <div className="max-h-64 overflow-y-auto space-y-1 border rounded-lg p-2">
                  {programs.map((program) => (
                    <button
                      key={program.id}
                      type="button"
                      className="w-full flex items-center gap-3 p-2 hover:bg-accent rounded-lg text-left transition-colors"
                      onClick={() => {
                        editor?.commands.insertContent({
                          type: 'programCard',
                          attrs: { 
                            programId: program.id,
                            variant: selectedVariant,
                          },
                        });
                        setProgramSearch('');
                        setPrograms([]);
                        setShowProgramPopover(false);
                      }}
                    >
                      {program.icono_url && (
                        <img 
                          src={program.icono_url} 
                          alt={program.nombre}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="text-sm font-medium">{program.nombre}</span>
                    </button>
                  ))}
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Tamaño de card</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={selectedVariant === 'small' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVariant('small')}
                  >
                    Pequeña
                  </Button>
                  <Button
                    type="button"
                    variant={selectedVariant === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVariant('medium')}
                  >
                    Mediana
                  </Button>
                  <Button
                    type="button"
                    variant={selectedVariant === 'large' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVariant('large')}
                  >
                    Grande
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Badge */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Insertar badge"
          onClick={() => setShowBadgeDialog(true)}
        >
          <Tag className="h-4 w-4" />
        </Button>
      </div>



      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Helper Text */}
      <div className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
        <span className="font-medium">Atajos:</span> Escribe / para ver comandos disponibles | 
        <span className="ml-2 font-medium">Drag & Drop:</span> Arrastra imágenes para insertarlas inline
      </div>

      {/* Badge Dialog */}
      <BadgeDialog
        open={showBadgeDialog}
        onOpenChange={setShowBadgeDialog}
        onInsert={(text, color) => {
          editor?.commands.setBadge({ text, color });
        }}
      />
    </div>
  );
}
