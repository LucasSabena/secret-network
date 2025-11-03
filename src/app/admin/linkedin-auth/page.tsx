'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink } from 'lucide-react';

/**
 * Página para obtener el Access Token de LinkedIn
 * Solo para uso del admin
 */
export default function LinkedInAuthPage() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [code, setCode] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [personUrn, setPersonUrn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Detectar si volvimos del redirect de LinkedIn
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const errorParam = urlParams.get('error');
    
    if (authCode) {
      setCode(authCode);
    }
    
    if (errorParam) {
      setError(`Error de LinkedIn: ${errorParam}`);
    }
  }, []);

  const handleAuthorize = () => {
    if (!clientId) {
      setError('Ingresa el Client ID primero');
      return;
    }

    const redirectUri = `${window.location.origin}/admin/linkedin-auth`;
    const state = Math.random().toString(36).substring(7);
    
    // Guardar state en sessionStorage para validar después
    sessionStorage.setItem('linkedin_oauth_state', state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=w_member_social`;

    window.location.href = authUrl;
  };

  const handleExchangeToken = async () => {
    if (!clientId || !clientSecret || !code) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const redirectUri = `${window.location.origin}/admin/linkedin-auth`;

      // Usar nuestro API endpoint para evitar CORS
      const response = await fetch('/api/linkedin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          clientId: clientId,
          clientSecret: clientSecret,
          redirectUri: redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener token');
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      setPersonUrn(data.person_urn);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Configurar LinkedIn OAuth</CardTitle>
          <CardDescription>
            Obtén el Access Token para auto-postear blogs en LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paso 1: Configurar App */}
          <div className="space-y-4">
            <h3 className="font-semibold">Paso 1: Configurar App en LinkedIn</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Ve a <a href="https://www.linkedin.com/developers/apps" target="_blank" className="text-primary hover:underline">LinkedIn Developers</a></li>
              <li>Crea una app o selecciona una existente</li>
              <li>En "Auth" → "Redirect URLs" agrega: <code className="bg-muted px-2 py-1 rounded">{typeof window !== 'undefined' ? `${window.location.origin}/admin/linkedin-auth` : ''}</code></li>
              <li>Solicita acceso a "Share on LinkedIn" product</li>
              <li>Copia el Client ID y Client Secret</li>
            </ol>
          </div>

          {/* Paso 2: Ingresar credenciales */}
          <div className="space-y-4">
            <h3 className="font-semibold">Paso 2: Ingresar Credenciales</h3>
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Tu Client ID de LinkedIn"
              />
            </div>
            <div className="space-y-2">
              <Label>Client Secret</Label>
              <Input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Tu Client Secret de LinkedIn"
              />
            </div>
            <Button onClick={handleAuthorize} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Autorizar con LinkedIn
            </Button>
          </div>

          {/* Paso 3: Intercambiar código por token */}
          {code && (
            <div className="space-y-4">
              <h3 className="font-semibold">Paso 3: Obtener Access Token</h3>
              <div className="space-y-2">
                <Label>Authorization Code (obtenido)</Label>
                <Input value={code} readOnly />
              </div>
              <Button 
                onClick={handleExchangeToken} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Obteniendo token...' : 'Obtener Access Token'}
              </Button>
            </div>
          )}

          {/* Resultados */}
          {accessToken && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-green-600">✅ Tokens Obtenidos</h3>
              
              <div className="space-y-2">
                <Label>Access Token</Label>
                <div className="flex gap-2">
                  <Input value={accessToken} readOnly className="font-mono text-xs" />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => copyToClipboard(accessToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {personUrn && (
                <div className="space-y-2">
                  <Label>Person URN</Label>
                  <div className="flex gap-2">
                    <Input value={personUrn} readOnly className="font-mono text-xs" />
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => copyToClipboard(personUrn)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Alert>
                <AlertDescription>
                  <strong>Copia estos valores a tu .env.local:</strong>
                  <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-x-auto">
{`LINKEDIN_CLIENT_ID=${clientId}
LINKEDIN_CLIENT_SECRET=${clientSecret}
LINKEDIN_ACCESS_TOKEN=${accessToken}
LINKEDIN_PERSON_URN=${personUrn}`}
                  </pre>
                  <p className="mt-2 text-sm text-muted-foreground">
                    ⚠️ El token expira en 60 días. Deberás repetir este proceso.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Errores */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
