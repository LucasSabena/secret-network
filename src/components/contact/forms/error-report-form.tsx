// FILE: src/components/contact/forms/error-report-form.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ErrorReportFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ErrorReportForm({
  onSubmit,
  isSubmitting,
}: ErrorReportFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    errorType: '',
    pageUrl: '',
    description: '',
    stepsToReproduce: '',
    browser: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      subject: 'error',
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre (opcional)</Label>
          <Input
            id="name"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Tipo de error */}
      <div className="space-y-2">
        <Label htmlFor="errorType">
          Tipo de error <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.errorType}
          onValueChange={(value) => handleSelectChange('errorType', value)}
          required
        >
          <SelectTrigger id="errorType">
            <SelectValue placeholder="Seleccioná el tipo de error" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visual">Error visual / UI</SelectItem>
            <SelectItem value="functional">Error funcional</SelectItem>
            <SelectItem value="data">Datos incorrectos</SelectItem>
            <SelectItem value="performance">Problemas de rendimiento</SelectItem>
            <SelectItem value="link">Link roto</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* URL de la página */}
      <div className="space-y-2">
        <Label htmlFor="pageUrl">
          URL donde ocurre el error <span className="text-destructive">*</span>
        </Label>
        <Input
          id="pageUrl"
          name="pageUrl"
          type="url"
          placeholder="https://secretnetwork.co/..."
          value={formData.pageUrl}
          onChange={handleChange}
          required
        />
      </div>

      {/* Navegador */}
      <div className="space-y-2">
        <Label htmlFor="browser">Navegador (opcional)</Label>
        <Select
          value={formData.browser}
          onValueChange={(value) => handleSelectChange('browser', value)}
        >
          <SelectTrigger id="browser">
            <SelectValue placeholder="Seleccioná tu navegador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chrome">Google Chrome</SelectItem>
            <SelectItem value="firefox">Mozilla Firefox</SelectItem>
            <SelectItem value="safari">Safari</SelectItem>
            <SelectItem value="edge">Microsoft Edge</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Descripción del error */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descripción del error <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe qué error encontraste..."
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Pasos para reproducir */}
      <div className="space-y-2">
        <Label htmlFor="stepsToReproduce">
          Pasos para reproducir (opcional)
        </Label>
        <Textarea
          id="stepsToReproduce"
          name="stepsToReproduce"
          placeholder="1. Entro a la página...&#10;2. Hago clic en...&#10;3. El error aparece..."
          rows={4}
          value={formData.stepsToReproduce}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Reportar error'
        )}
      </Button>
    </form>
  );
}
