// FILE: src/components/admin/blog-status-badge.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, Eye, FileText, Archive } from 'lucide-react';

interface BlogStatusBadgeProps {
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduledFor?: string | null;
}

export function BlogStatusBadge({ status, scheduledFor }: BlogStatusBadgeProps) {
  const config = {
    draft: {
      label: 'Borrador',
      className: 'bg-yellow-500/10 text-yellow-500',
      icon: FileText,
    },
    scheduled: {
      label: scheduledFor 
        ? `Programado ${new Date(scheduledFor).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}`
        : 'Programado',
      className: 'bg-blue-500/10 text-blue-500',
      icon: Clock,
    },
    published: {
      label: 'Publicado',
      className: 'bg-green-500/10 text-green-500',
      icon: Eye,
    },
    archived: {
      label: 'Archivado',
      className: 'bg-gray-500/10 text-gray-500',
      icon: Archive,
    },
  };

  const { label, className, icon: Icon } = config[status];

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}
