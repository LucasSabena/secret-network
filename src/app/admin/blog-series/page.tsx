// FILE: src/app/admin/blog-series/page.tsx

'use client';

import { useState, useEffect } from 'react';
import AdminAuthCheck from '@/components/admin/admin-auth-check';
import { BlogSeriesManager } from '@/components/admin/blog-series-manager';

export default function BlogSeriesPage() {
  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Gestión de Series</h1>
            <p className="text-muted-foreground">
              Administra las series de artículos del blog
            </p>
          </div>

          <BlogSeriesManager />
        </div>
      </div>
    </AdminAuthCheck>
  );
}
