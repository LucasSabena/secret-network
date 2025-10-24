'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Componente que habilita smooth scroll en toda la app
 * excepto en rutas /admin
 */
export function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const html = document.documentElement;
    
    // Aplicar o remover smooth scroll según la ruta
    if (isAdminRoute) {
      html.classList.add('admin-route');
      html.style.scrollBehavior = 'auto';
    } else {
      html.classList.remove('admin-route');
      html.style.scrollBehavior = 'smooth';
    }

    // Cleanup
    return () => {
      html.classList.remove('admin-route');
    };
  }, [isAdminRoute]);

  return <>{children}</>;
}
