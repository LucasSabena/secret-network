// LinkedIn API integration para auto-post de blogs
// Documentación: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api

interface LinkedInPostData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

interface LinkedInShareResponse {
  id: string;
  success: boolean;
  error?: string;
}

/**
 * Publica un post en LinkedIn
 * Solo se ejecuta cuando un blog pasa de borrador a publicado
 */
export async function postToLinkedIn(data: LinkedInPostData): Promise<LinkedInShareResponse> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    console.warn('LinkedIn credentials not configured');
    return {
      id: '',
      success: false,
      error: 'LinkedIn credentials not configured'
    };
  }

  try {
    // Construir el payload según LinkedIn Share API v2
    const sharePayload = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `${data.title}\n\n${data.description}\n\n🔗 Lee más: ${data.url}`
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              originalUrl: data.url,
              title: {
                text: data.title
              },
              description: {
                text: data.description
              },
              ...(data.imageUrl && {
                thumbnails: [
                  {
                    url: data.imageUrl
                  }
                ]
              })
            }
          ]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(sharePayload)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LinkedIn API error:', error);
      return {
        id: '',
        success: false,
        error: error.message || 'Failed to post to LinkedIn'
      };
    }

    const result = await response.json();
    
    return {
      id: result.id,
      success: true
    };

  } catch (error: any) {
    console.error('Error posting to LinkedIn:', error);
    return {
      id: '',
      success: false,
      error: error.message
    };
  }
}

/**
 * Genera un snippet optimizado para LinkedIn
 * Máximo 3000 caracteres, pero recomendado 150-250 para mejor engagement
 */
export function generateLinkedInSnippet(
  title: string, 
  description: string, 
  maxLength: number = 250
): string {
  const snippet = `${title}\n\n${description}`;
  
  if (snippet.length <= maxLength) {
    return snippet;
  }

  // Truncar y agregar "..."
  return snippet.substring(0, maxLength - 3) + '...';
}

/**
 * Valida si las credenciales de LinkedIn están configuradas
 */
export function isLinkedInConfigured(): boolean {
  return !!(
    process.env.LINKEDIN_ACCESS_TOKEN && 
    process.env.LINKEDIN_PERSON_URN
  );
}
