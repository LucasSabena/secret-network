// FILE: src/components/shared/external-link.tsx
'use client';

import { AnchorHTMLAttributes, ReactNode } from 'react';
import { addUTMParams, UTMParams } from '@/lib/utm-tracker';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: ReactNode;
  utmParams?: UTMParams;
  showIcon?: boolean;
  trackClick?: boolean;
}

/**
 * Componente para enlaces externos con UTM tracking automático
 * Agrega parámetros UTM, target="_blank" y rel="noopener noreferrer"
 */
export function ExternalLink({
  href,
  children,
  utmParams = {},
  showIcon = false,
  trackClick = true,
  className = '',
  ...props
}: ExternalLinkProps) {
  // Agregar UTM params a la URL
  const urlWithUTM = addUTMParams(href, utmParams);

  const handleClick = () => {
    if (trackClick && typeof window !== 'undefined' && window.gtag) {
      // Track click en Google Analytics si está disponible
      window.gtag('event', 'click', {
        event_category: 'external_link',
        event_label: href,
        value: 1,
      });
    }
  };

  return (
    <a
      href={urlWithUTM}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
      {showIcon && <ExternalLinkIcon className="inline-block ml-1 h-3 w-3" />}
    </a>
  );
}
