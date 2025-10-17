'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabaseBrowserClient } from '@/lib/supabase-browser';

export default function SetupPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    verifyToken();
  }, []);

  async function verifyToken() {
    try {
      const supabase = supabaseBrowserClient;
      
      console.log('🔍 URL completa:', window.location.href);
      console.log('🔍 Hash:', window.location.hash);
      
      // Esperar más tiempo para que Supabase procese el hash de la URL automáticamente
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar si hay un usuario en sesión
      const { data: { user }, error } = await supabase.auth.getUser();

      console.log('👤 Usuario:', user);
      console.log('❌ Error:', error);

      if (error || !user) {
        console.error('❌ No hay usuario o hay error');
        toast({
          title: 'Link inválido o expirado',
          description: 'Por favor, solicita una nueva invitación',
          variant: 'destructive',
        });
        setTimeout(() => router.push('/admin/login'), 3000);
        return;
      }

      // Verificar que el usuario esté en admin_users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        toast({
          title: 'No autorizado',
          description: 'Tu email no está registrado como administrador',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
        setTimeout(() => router.push('/admin/login'), 3000);
        return;
      }

      setIsValidToken(true);
    } catch (error) {
      console.error('Error verificando token:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al verificar tu invitación',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleSetupPassword(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones
    if (password.length < 8) {
      toast({
        title: 'Contraseña muy corta',
        description: 'La contraseña debe tener al menos 8 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Las contraseñas no coinciden',
        description: 'Por favor, verifica que ambas contraseñas sean iguales',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = supabaseBrowserClient;

      // Actualizar la contraseña del usuario
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: '¡Contraseña configurada!',
        description: 'Tu cuenta está lista. Redirigiendo al panel de admin...',
      });

      // Esperar un momento y redirigir
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error('Error configurando contraseña:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo configurar la contraseña',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-pink-950/20 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto" />
            <p className="text-muted-foreground">Verificando invitación...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-pink-950/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold">
            Configura tu Contraseña
          </h1>
          <p className="text-muted-foreground">
            Elige una contraseña segura para tu cuenta de administrador
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSetupPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nueva Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
                minLength={8}
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
            <p className="text-xs text-muted-foreground">
              Usa al menos 8 caracteres con letras y números
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
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
                Configurando...
              </>
            ) : (
              'Configurar Contraseña'
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
