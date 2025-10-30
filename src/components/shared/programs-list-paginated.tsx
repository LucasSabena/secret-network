"use client";

import { useState } from "react";
import { ProgramCard } from "@/components/shared/program-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Programa {
  id: number;
  nombre: string;
  slug: string;
  descripcion_corta?: string;
  icono_url?: string;
  es_open_source: boolean;
  es_recomendado: boolean;
  categoria?: {
    id: number;
    nombre: string;
    slug: string;
  };
  subcategorias?: Array<{
    id: number;
    nombre: string;
    slug: string;
  }>;
}

interface ProgramsListPaginatedProps {
  initialPrograms: Programa[];
  totalCount: number;
  pageSize?: number;
}

export function ProgramsListPaginated({
  initialPrograms,
  totalCount,
  pageSize = 24,
}: ProgramsListPaginatedProps) {
  const [programs, setPrograms] = useState<Programa[]>(initialPrograms);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = programs.length < totalCount;

  const loadMore = async () => {
    setLoading(true);
    try {
      // Fetch next page from API
      const response = await fetch(
        `/api/programs?page=${page + 1}&limit=${pageSize}`
      );
      const data = await response.json();
      
      setPrograms([...programs, ...data.programs]);
      setPage(page + 1);
    } catch (error) {
      console.error('Error loading more programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Programs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((programa) => (
          <ProgramCard key={programa.id} program={programa as any} variant="large" />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            size="lg"
            variant="outline"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                Cargar más programas
                <span className="ml-2 text-xs text-muted-foreground">
                  ({programs.length} de {totalCount})
                </span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* End message */}
      {!hasMore && programs.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Has visto todos los {totalCount} programas
        </p>
      )}
    </div>
  );
}
