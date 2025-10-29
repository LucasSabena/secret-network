'use client';

import { FileText } from 'lucide-react';

interface BlogResultsInfoProps {
  totalResults: number;
  currentPage: number;
  postsPerPage: number;
  isFiltered: boolean;
}

export function BlogResultsInfo({
  totalResults,
  currentPage,
  postsPerPage,
  isFiltered,
}: BlogResultsInfoProps) {
  const startIndex = (currentPage - 1) * postsPerPage + 1;
  const endIndex = Math.min(currentPage * postsPerPage, totalResults);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 border-t border-b">
      <FileText className="h-4 w-4" />
      <span>
        {isFiltered ? (
          <>
            Mostrando <span className="font-medium text-foreground">{startIndex}-{endIndex}</span> de{' '}
            <span className="font-medium text-foreground">{totalResults}</span> resultados
          </>
        ) : (
          <>
            Mostrando <span className="font-medium text-foreground">{startIndex}-{endIndex}</span> de{' '}
            <span className="font-medium text-foreground">{totalResults}</span> artículos
          </>
        )}
      </span>
    </div>
  );
}
