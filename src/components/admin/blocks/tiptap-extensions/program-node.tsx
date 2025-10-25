import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { ProgramCard } from '@/components/shared/program-card';

export const ProgramNode = Node.create({
  name: 'programCard',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      programId: {
        default: null,
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

function ProgramNodeView({ node }: any) {
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
    <NodeViewWrapper className="my-4">
      <ProgramCard program={program} variant="medium" />
    </NodeViewWrapper>
  );
}
