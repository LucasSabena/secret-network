// FILE: src/components/admin/blog-editor-v2/editor-stats.tsx
'use client';

import { Block } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { FileText, Image, Clock, BarChart3 } from 'lucide-react';

interface EditorStatsProps {
  blocks: Block[];
  title: string;
}

export function EditorStats({ blocks, title }: EditorStatsProps) {
  // Calcular estadísticas
  const stats = {
    totalBlocks: blocks.length,
    textBlocks: blocks.filter((b) => b.type === 'text').length,
    imageBlocks: blocks.filter((b) => b.type === 'image').length,
    wordCount: calculateWordCount(blocks),
    readingTime: calculateReadingTime(blocks),
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      <StatCard
        icon={FileText}
        label="Bloques"
        value={stats.totalBlocks}
        color="text-blue-500"
      />
      <StatCard
        icon={FileText}
        label="Texto"
        value={stats.textBlocks}
        color="text-green-500"
      />
      <StatCard
        icon={Image}
        label="Imágenes"
        value={stats.imageBlocks}
        color="text-purple-500"
      />
      <StatCard
        icon={BarChart3}
        label="Palabras"
        value={stats.wordCount}
        color="text-orange-500"
      />
      <StatCard
        icon={Clock}
        label="Lectura"
        value={`${stats.readingTime} min`}
        color="text-pink-500"
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold truncate">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function calculateWordCount(blocks: Block[]): number {
  let count = 0;

  blocks.forEach((block) => {
    if (block.type === 'text') {
      const text = block.data.content.replace(/<[^>]*>/g, ''); // Remove HTML
      count += text.split(/\s+/).filter((word) => word.length > 0).length;
    } else if (block.type === 'tabs') {
      block.data.tabs.forEach((tab) => {
        const text = tab.content.replace(/<[^>]*>/g, '');
        count += text.split(/\s+/).filter((word) => word.length > 0).length;
      });
    } else if (block.type === 'accordion') {
      block.data.items.forEach((item) => {
        const text = item.content.replace(/<[^>]*>/g, '');
        count += text.split(/\s+/).filter((word) => word.length > 0).length;
      });
    } else if (block.type === 'alert') {
      const text = block.data.description.replace(/<[^>]*>/g, '');
      count += text.split(/\s+/).filter((word) => word.length > 0).length;
    }
  });

  return count;
}

function calculateReadingTime(blocks: Block[]): number {
  const wordCount = calculateWordCount(blocks);
  const wordsPerMinute = 200; // Promedio de lectura
  return Math.ceil(wordCount / wordsPerMinute) || 1;
}
