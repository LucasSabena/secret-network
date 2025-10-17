// FILE: src/components/contact/contact-form.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { SponsorForm } from './forms/sponsor-form';
import { ErrorReportForm } from './forms/error-report-form';
import { ProgramSuggestionForm } from './forms/program-suggestion-form';
import { GeneralContactForm } from './forms/general-contact-form';

export type ContactSubject =
  | 'sponsor'
  | 'error'
  | 'program'
  | 'general'
  | null;

export interface BaseFormData {
  name: string;
  email: string;
  subject: ContactSubject;
}

export function ContactForm() {
  const [selectedSubject, setSelectedSubject] = useState<ContactSubject>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value as ContactSubject);
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      toast({
        title: '¡Mensaje enviado!',
        description: 'Te responderemos lo antes posible.',
      });

      // Reset form
      setSelectedSubject(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al enviar',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error. Por favor, intentá de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-lg md:p-8">
      <h2 className="mb-6 text-2xl font-semibold">
        Completa el formulario
      </h2>

      {/* Selector de asunto */}
      <div className="mb-8 space-y-2">
        <Label htmlFor="subject" className="text-base">
          ¿Sobre qué querés hablar? <span className="text-destructive">*</span>
        </Label>
        <Select value={selectedSubject || ''} onValueChange={handleSubjectChange}>
          <SelectTrigger id="subject" className="w-full">
            <SelectValue placeholder="Seleccioná un tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sponsor">
              Quiero ser sponsor
            </SelectItem>
            <SelectItem value="error">
              Encontré un error
            </SelectItem>
            <SelectItem value="program">
              Quiero sugerir un programa
            </SelectItem>
            <SelectItem value="general">
              Consulta general
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Según tu selección, te mostraremos los campos necesarios
        </p>
      </div>

      {/* Formularios dinámicos con animación */}
      <AnimatePresence mode="wait">
        {selectedSubject && (
          <motion.div
            key={selectedSubject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedSubject === 'sponsor' && (
              <SponsorForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {selectedSubject === 'error' && (
              <ErrorReportForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {selectedSubject === 'program' && (
              <ProgramSuggestionForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {selectedSubject === 'general' && (
              <GeneralContactForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedSubject && (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground">
            Seleccioná un tema arriba para comenzar
          </p>
        </div>
      )}
    </div>
  );
}
