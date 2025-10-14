'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function AdminHeader() {
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogout() {
    try {
      const supabase = supabaseBrowserClient();
      await supabase.auth.signOut();
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has salido del panel de administración',
      });
      
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la sesión',
        variant: 'destructive',
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-pink-500" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Volver al sitio
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
