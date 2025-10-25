import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { ProgramCard } from '@/components/shared/program-card';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export const ProgramNode = Node.create({
  name: 'programCard',

  group: 'block',

  atom: true,

  selectable: true,

  addAttributes() {
    return {
      programId: {
        default: null,
      },
      variant: {
        default: 'medium',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="program-card"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'program-card' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProgramNodeView);
  },
});

function ProgramNodeView({ node, updateAttributes, deleteNode, selected }: any) {
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!node.attrs.programId) {
        setLoading(false);
        return;
      }

      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('*')
        .eq('id', node.attrs.programId)
        .single();

      setProgram(data);
      setLoading(false);
    };

    fetchProgram();
  }, [node.attrs.programId]);

  if (loading) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="animate-pulse bg-muted h-32 rounded-lg" />
      </NodeViewWrapper>
    );
  }

  if (!program) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
          Programa no encontrado
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={`my-4 relative group ${selected ? 'ring-2 ring-primary rounded-lg' : ''}`}>
      {/* Toolbar al seleccionar */}
      {selected && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-background border rounded-lg shadow-lg p-1 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2"
              >
                <Settings className="h-3 w-3 mr-1" />
                Variante
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tamaño de card</Label>
                <Button
                  type="button"
                  variant={node.attrs.variant === 'small' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => updateAttributes({ variant: 'small' })}
                >
                  Pequeña
                </Button>
                <Button
                  type="button"
                  variant={node.attrs.variant === 'medium' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => updateAttributes({ variant: 'medium' })}
                >
                  Mediana
                </Button>
                <Button
                  type="button"
                  variant={node.attrs.variant === 'large' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => updateAttributes({ variant: 'large' })}
                >
                  Grande
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={deleteNode}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      <ProgramCard program={program} variant={node.attrs.variant as any} />
    </NodeViewWrapper>
  );
}
