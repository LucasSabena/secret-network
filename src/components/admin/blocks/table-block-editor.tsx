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
    const newData = {
      ...block.data,
      headers: [...block.data.headers, 'Nueva columna'],
      rows: block.data.rows.map(row => [...row, '']),
    };
    
    if (block.data.showFooter && block.data.footerRow) {
      newData.footerRow = [...block.data.footerRow, ''];
    }
    
    onChange({ ...block, data: newData });
  };

  const addRow = () => {
    const newRows = [...block.data.rows, Array(block.data.headers.length).fill('')];
    const newData = { ...block.data, rows: newRows };
    
    // Actualizar leftHeaders si están activos
    if (block.data.showLeftHeaders) {
      newData.leftHeaders = [...(block.data.leftHeaders || []), `Fila ${newRows.length}`];
    }
    
    onChange({ ...block, data: newData });
  };

  const removeColumn = (index: number) => {
    const newData = {
      ...block.data,
      headers: block.data.headers.filter((_, i) => i !== index),
      rows: block.data.rows.map(row => row.filter((_, i) => i !== index)),
    };
    
    if (block.data.showFooter && block.data.footerRow) {
      newData.footerRow = block.data.footerRow.filter((_, i) => i !== index);
    }
    
    onChange({ ...block, data: newData });
  };

  const removeRow = (index: number) => {
    const newData = {
      ...block.data,
      rows: block.data.rows.filter((_, i) => i !== index),
    };
    
    if (block.data.showLeftHeaders && block.data.leftHeaders) {
      newData.leftHeaders = block.data.leftHeaders.filter((_, i) => i !== index);
    }
    
    onChange({ ...block, data: newData });
  };

  const toggleLeftHeaders = (checked: boolean) => {
    const newData = { ...block.data, showLeftHeaders: checked };
    
    if (checked && !block.data.leftHeaders) {
      newData.leftHeaders = block.data.rows.map((_, i) => `Fila ${i + 1}`);
    }
    
    onChange({ ...block, data: newData });
  };

  const toggleFooter = (checked: boolean) => {
    const newData = { ...block.data, showFooter: checked };
    
    if (checked && !block.data.footerRow) {
      newData.footerRow = Array(block.data.headers.length).fill('');
    }
    
    onChange({ ...block, data: newData });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Opciones */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={block.data.striped || false}
            onCheckedChange={(checked) => onChange({ ...block, data: { ...block.data, striped: checked } })}
          />
          <Label>Filas alternadas</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={block.data.showLeftHeaders || false}
            onCheckedChange={toggleLeftHeaders}
          />
          <Label>Headers laterales</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={block.data.showFooter || false}
            onCheckedChange={toggleFooter}
          />
          <Label>Fila de pie</Label>
        </div>
      </div>

      {/* Caption */}
      <div>
        <Label>Pie de tabla (opcional)</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) => onChange({ ...block, data: { ...block.data, caption: e.target.value } })}
          placeholder="Descripción o aclaración de la tabla..."
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {block.data.showLeftHeaders && <th className="border p-2 bg-muted"></th>}
              {block.data.headers.map((header, i) => (
                <th key={i} className="border p-2 bg-muted">
                  <div className="flex gap-1">
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...block.data.headers];
                        newHeaders[i] = e.target.value;
                        onChange({ ...block, data: { ...block.data, headers: newHeaders } });
                      }}
                      className="text-sm font-semibold"
                      placeholder="Header"
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeColumn(i)} type="button">
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
                {block.data.showLeftHeaders && (
                  <th className="border p-2 bg-muted">
                    <Input
                      value={block.data.leftHeaders?.[rowIndex] || ''}
                      onChange={(e) => {
                        const newLeftHeaders = [...(block.data.leftHeaders || [])];
                        newLeftHeaders[rowIndex] = e.target.value;
                        onChange({ ...block, data: { ...block.data, leftHeaders: newLeftHeaders } });
                      }}
                      className="text-sm font-semibold"
                      placeholder="Header"
                    />
                  </th>
                )}
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
                      placeholder="Celda"
                    />
                  </td>
                ))}
                <td className="border p-2">
                  <Button size="icon" variant="ghost" onClick={() => removeRow(rowIndex)} type="button">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          {block.data.showFooter && (
            <tfoot>
              <tr>
                {block.data.showLeftHeaders && <td className="border p-2 bg-muted"></td>}
                {block.data.footerRow?.map((cell, i) => (
                  <td key={i} className="border p-2 bg-muted">
                    <Input
                      value={cell}
                      onChange={(e) => {
                        const newFooter = [...(block.data.footerRow || [])];
                        newFooter[i] = e.target.value;
                        onChange({ ...block, data: { ...block.data, footerRow: newFooter } });
                      }}
                      className="text-sm font-semibold"
                      placeholder="Footer"
                    />
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <Button onClick={addColumn} size="sm" type="button">
          <Plus className="mr-2 h-3 w-3" />
          Columna
        </Button>
        <Button onClick={addRow} size="sm" type="button">
          <Plus className="mr-2 h-3 w-3" />
          Fila
        </Button>
      </div>
    </div>
  );
}
