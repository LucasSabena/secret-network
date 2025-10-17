// FILE: src/components/blog/programs-grid.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProgramCard } from '@/components/shared/program-card';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

interface ProgramsGridProps {
  programIds: number[];
  variant?: 'small' | 'medium' | 'large';
}

/**
 * Componente para mostrar un grid de programas en blogs
 * - Desktop: 3 columnas (o según cantidad de programas)
 * - Tablet/Mobile: 1 columna vertical
 */
export function ProgramsGrid({ programIds, variant = 'small' }: ProgramsGridProps) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabaseBrowserClient
        .from('programas')
        .select('*')
        .in('id', programIds);
      
      if (data) {
        // Ordenar según el orden de programIds
        const ordered = programIds
          .map(id => data.find(p => p.id === id))
          .filter(Boolean);
        setPrograms(ordered);
      }
      setLoading(false);
    };

    if (programIds.length > 0) {
      fetchPrograms();
    } else {
      setLoading(false);
    }
  }, [programIds]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {[...Array(programIds.length)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} variant={variant} />
      ))}
    </div>
  );
}
