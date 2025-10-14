'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  async function checkAuth() {
    try {
      const supabase = supabaseBrowserClient();
      
      // Si estamos en la página de login, no verificar
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      // Obtener usuario autenticado
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/admin/login');
        return;
      }

      // Verificar si es admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  }

  // Si estamos en login, mostrar la página directamente
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya redirigió)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, mostrar contenido
  return <>{children}</>;
}
