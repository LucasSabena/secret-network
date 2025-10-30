'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = false,
  sizes,
  width,
  height,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className={`absolute inset-0 ${className}`} />
      )}
      <Image
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        fill={fill}
        sizes={sizes}
        width={width}
        height={height}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        loading={priority ? 'eager' : 'lazy'}
        quality={75}
      />
    </div>
  );
}
