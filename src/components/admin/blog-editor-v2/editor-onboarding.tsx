// FILE: src/components/admin/blog-editor-v2/editor-onboarding.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const ONBOARDING_KEY = 'blog-editor-v2-onboarding-completed';

const STEPS = [
  {
    title: '¡Bienvenido al Nuevo Editor! 🎉',
    description:
      'Este es un editor drag-and-drop completamente nuevo, diseñado para hacer la creación de posts más intuitiva y visual.',
    image: '🎨',
  },
  {
    title: 'Panel de Bloques',
    description:
      'A la izquierda encontrarás todos los bloques disponibles: texto, imágenes, programas, pestañas, acordeones y más. Simplemente arrástralos al canvas.',
    image: '📦',
  },
  {
    title: 'Canvas Central',
    description:
      'El área central es tu canvas de trabajo. Aquí construyes tu post arrastrando bloques. Haz clic en cualquier bloque para editarlo.',
    image: '✏️',
  },
  {
    title: 'Panel de Propiedades',
    description:
      'A la derecha verás información sobre el bloque seleccionado. También encontrarás tips y ayuda contextual.',
    image: '⚙️',
  },
  {
    title: 'Reordenar y Eliminar',
    description:
      'Usa el ícono de arrastre para reordenar bloques. El ícono de basura elimina el bloque. Todo es visual e intuitivo.',
    image: '🔄',
  },
  {
    title: '¡Listo para Empezar!',
    description:
      'Ya estás listo para crear contenido increíble. Recuerda: puedes ver la ayuda en cualquier momento haciendo clic en el ícono ? en la esquina superior.',
    image: '🚀',
  },
];

export function EditorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Verificar si ya completó el onboarding
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Tutorial Rápido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Indicador de progreso */}
          <div className="flex gap-2">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Contenido del paso */}
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">{step.image}</div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {step.description}
            </p>
          </Card>

          {/* Navegación */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Saltar tutorial
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              <Button onClick={handleNext}>
                {isLastStep ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    ¡Empezar!
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Contador */}
          <p className="text-center text-xs text-muted-foreground">
            Paso {currentStep + 1} de {STEPS.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook para resetear el onboarding (útil para testing)
export function useResetOnboarding() {
  return () => {
    localStorage.removeItem(ONBOARDING_KEY);
  };
}
