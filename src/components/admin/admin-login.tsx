'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = supabaseBrowserClient;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('✅ Usuario autenticado:', data.user.email);
        
        // Verificar si el usuario es admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', data.user.email)
          .single();

        console.log('🔍 Verificando admin...');
        console.log('- Email buscado:', data.user.email);
        console.log('- Resultado:', adminData);
        console.log('- Error:', adminError);

        if (adminError || !adminData) {
          console.error('❌ No es admin:', { adminError, adminData });
          // No es admin, cerrar sesión
          await supabase.auth.signOut();
          throw new Error('No tienes permisos de administrador');
        }

        console.log('✅ Usuario es admin');
        toast({
          title: '¡Bienvenido!',
          description: 'Iniciaste sesión correctamente',
        });

        router.push('/admin');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast({
        title: 'Error de autenticación',
        description: error.message || 'Email o contraseña incorrectos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-pink-950/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-4">
            <Lock className="h-8 w-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Secret Network Admin</p>
        </div>
      </Card>
    </div>
  );
}
