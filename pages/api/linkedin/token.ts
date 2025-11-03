import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API endpoint para intercambiar código de LinkedIn por access token
 * Evita problemas de CORS al hacer la llamada desde el servidor
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, clientId, clientSecret, redirectUri } = req.body;

    if (!code || !clientId || !clientSecret || !redirectUri) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Intercambiar código por token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('LinkedIn token error:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error_description: errorText };
      }
      return res.status(400).json({
        error: errorData.error_description || errorData.error || 'Error al obtener token'
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Obtener información del usuario (Person URN)
    const meResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    let personUrn = '';
    if (meResponse.ok) {
      const meData = await meResponse.json();
      personUrn = `urn:li:person:${meData.id}`;
    }

    return res.status(200).json({
      access_token: accessToken,
      person_urn: personUrn,
      expires_in: tokenData.expires_in
    });

  } catch (error: any) {
    console.error('LinkedIn token exchange error:', error);
    return res.status(500).json({
      error: `Error interno del servidor: ${error.message}`
    });
  }
}
