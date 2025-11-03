// FILE: src/components/blog/blog-share-buttons.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { trackShare } from '@/lib/analytics-tracker';

interface BlogShareButtonsProps {
  postId: number;
  title: string;
  url: string;
  className?: string;
}

/**
 * Botones para compartir el post en redes sociales
 */
export function BlogShareButtons({ postId, title, url, className }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = (platform: string, shareUrl: string) => {
    trackShare(postId, platform);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackShare(postId, 'copy-link');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-[#1DA1F2]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-[#0A66C2]',
    },
  ];
  
  console.log('[BlogShareButtons] Share links:', shareLinks.map(l => ({ name: l.name, hasIcon: !!l.icon })));

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          Compartir:
        </span>
        <div className="flex gap-1">
          {shareLinks.map((link) => {
            console.log('[BlogShareButtons] Rendering link:', link.name, 'Icon:', link.icon);
            if (!link.icon) {
              console.error('[BlogShareButtons] Missing icon for:', link.name);
              return null;
            }
            const IconComponent = link.icon;
            return (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                onClick={() => handleShare(link.name.toLowerCase(), link.url)}
                className={link.color}
                title={`Compartir en ${link.name}`}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className={copied ? 'text-green-500' : ''}
            title="Copiar enlace"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
