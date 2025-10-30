// FILE: src/components/blog/blog-grid-improved.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { calculateReadingTimeFromBlocks } from '@/lib/reading-time';
import { BlogPagination } from './blog-pagination';
import { BlogSearchBar } from './blog-search-bar';
import { BlogFilters } from './blog-filters';
import { BlogTimelineView } from './blog-timeline-view';
import { BlogSeriesView } from './blog-series-view';
import { BlogResultsInfo } from './blog-results-info';

interface Post {
  id: number;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  imagen_portada_url: string | null;
  fecha_publicacion: string;
  autor: string | null;
  contenido_bloques: any[];
  categories: any[];
  tags: string[] | null;
}

interface BlogGridImprovedProps {
  posts: Post[];
}

const POSTS_PER_PAGE = 12;

export function BlogGridImproved({ posts }: BlogGridImprovedProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('categoria');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'series' | 'timeline'>('all');

  // Filtrar y ordenar posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(post => 
        post.categories?.some((cat: any) => cat?.slug === selectedCategory)
      );
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.titulo.toLowerCase().includes(query) ||
        post.descripcion_corta?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(post => 
        new Date(post.fecha_publicacion) >= filterDate
      );
    }

    // Ordenar (crear nueva copia para no mutar)
    const sorted = [...filtered];
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => 
          new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) => 
          new Date(a.fecha_publicacion).getTime() - new Date(b.fecha_publicacion).getTime()
        );
        break;
      case 'title':
        sorted.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
    }

    return sorted;
  }, [posts, selectedCategory, searchQuery, sortBy, dateFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset página cuando cambian los filtros
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, sortBy, dateFilter, selectedCategory]);

  // Vistas alternativas
  if (viewMode === 'timeline') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <BlogSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            resultsCount={filteredPosts.length}
          />
          <BlogFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        <BlogTimelineView posts={filteredPosts} />
      </div>
    );
  }

  if (viewMode === 'series') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <BlogSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            resultsCount={filteredPosts.length}
          />
          <BlogFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        <BlogSeriesView posts={filteredPosts} />
      </div>
    );
  }

  // Vista normal con grid
  if (filteredPosts.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <BlogSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            resultsCount={0}
          />
          <BlogFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground text-lg mb-2">
            No se encontraron artículos
          </p>
          <p className="text-sm text-muted-foreground">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <BlogSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          resultsCount={filteredPosts.length}
        />
        <BlogFilters
          sortBy={sortBy}
          onSortChange={setSortBy}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Información de resultados */}
      <BlogResultsInfo
        totalResults={filteredPosts.length}
        currentPage={currentPage}
        postsPerPage={POSTS_PER_PAGE}
        isFiltered={searchQuery !== '' || dateFilter !== 'all' || sortBy !== 'recent'}
      />

      <div className="space-y-12">
      {/* Grid de Posts - TODOS con el mismo tamaño */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group"
          >
            <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              {/* Imagen */}
              {post.imagen_portada_url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.imagen_portada_url}
                    alt={post.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Categorías */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.slice(0, 2).map((cat: any) => (
                      <span
                        key={cat.id}
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.nombre}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.titulo}
                </h3>

                {post.descripcion_corta && (
                  <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {post.descripcion_corta}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.fecha_publicacion).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {calculateReadingTimeFromBlocks(post.contenido_bloques).minutes} min
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Paginación */}
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </div>
    </div>
  );
}
