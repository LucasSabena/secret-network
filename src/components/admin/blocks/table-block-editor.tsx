// FILE: src/components/admin/blocks/table-block-editor.tsx
'use client';

import { TableBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TableBlockEditorProps {
  block: TableBlock;
  onChange: (block: TableBlock) => void;
}

export function TableBlockEditor({ block, onChange }: TableBlockEditorProps) {
  const addColumn = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        headers: [...block.data.headers, 'Nueva columna'],
        rows: block.data.rows.map(row => [...row, '']),
      },
    });
  };

  const addRow = () => {
    onChange({
      ...block,
      data: {
        ...block.data,
        rows: [...block.data.rows, Array(block.data.headers.length).fill('')],
      },
    });
  };

  const removeColumn = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        headers: block.data.headers.filter((_, i) => i !== index),
        rows: block.data.rows.map(row => row.filter((_, i) => i !== index)),
      },
    });
  };

  const removeRow = (index: number) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        rows: block.data.rows.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <Switch
          checked={block.data.striped}
          onCheckedChange={(checked) => onChange({ ...block, data: { ...block.data, striped: checked } })}
        />
        <Label>Filas alternadas</Label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {block.data.headers.map((header, i) => (
                <th key={i} className="border p-2">
                  <div className="flex gap-1">
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...block.data.headers];
                        newHeaders[i] = e.target.value;
                        onChange({ ...block, data: { ...block.data, headers: newHeaders } });
                      }}
                      className="text-sm"
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeColumn(i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border p-2">
                    <Input
                      value={cell}
                      onChange={(e) => {
                        const newRows = [...block.data.rows];
                        newRows[rowIndex][cellIndex] = e.target.value;
                        onChange({ ...block, data: { ...block.data, rows: newRows } });
                      }}
                      className="text-sm"
                    />
                  </td>
                ))}
                <td className="border p-2">
                  <Button size="icon" variant="ghost" onClick={() => removeRow(rowIndex)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <Button onClick={addColumn} size="sm">
          <Plus className="mr-2 h-3 w-3" />
          Columna
        </Button>
        <Button onClick={addRow} size="sm">
          <Plus className="mr-2 h-3 w-3" />
          Fila
        </Button>
      </div>
    </div>
  );
}
