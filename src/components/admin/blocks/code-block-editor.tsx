// FILE: src/components/admin/blocks/code-block-editor.tsx
'use client';

import { Block } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CodeBlockEditorProps {
  block: Extract<Block, { type: 'code' }>;
  onChange: (block: Extract<Block, { type: 'code' }>) => void;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'jsx', label: 'JSX/React' },
  { value: 'tsx', label: 'TSX/React' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
];

export function CodeBlockEditor({ block, onChange }: CodeBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm mb-2 block">Lenguaje:</Label>
        <Select
          value={block.data.language}
          onValueChange={(value) =>
            onChange({ ...block, data: { ...block.data, language: value } })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm mb-2 block">Código:</Label>
        <Textarea
          value={block.data.code}
          onChange={(e) =>
            onChange({ ...block, data: { ...block.data, code: e.target.value } })
          }
          placeholder="Pega tu código aquí..."
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      {/* Vista previa */}
      {block.data.code && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Vista previa:</Label>
          <pre className="rounded-lg text-sm max-h-[300px] overflow-auto bg-[#1e1e1e] p-4">
            <code className="text-gray-300 font-mono">{block.data.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
