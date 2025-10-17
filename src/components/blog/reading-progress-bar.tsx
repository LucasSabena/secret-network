// FILE: src/components/blog/reading-progress-bar.tsx
'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Calcular el scroll total disponible
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calcular el porcentaje de scroll actual
      const scrolled = window.scrollY;
      const progressPercentage = (scrolled / scrollHeight) * 100;
      
      setProgress(Math.min(100, Math.max(0, progressPercentage)));
    };

    // Actualizar al hacer scroll
    window.addEventListener('scroll', updateProgress);
    
    // Calcular inicialmente
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
