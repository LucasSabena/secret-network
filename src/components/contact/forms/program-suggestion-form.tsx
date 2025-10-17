// FILE: src/components/contact/forms/program-suggestion-form.tsx

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

interface ProgramSuggestionFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ProgramSuggestionForm({
  onSubmit,
  isSubmitting,
}: ProgramSuggestionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    programName: '',
    programWebsite: '',
    category: '',
    isOpenSource: '',
    description: '',
    whyAdd: '',
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
      subject: 'program',
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">Tu nombre (opcional)</Label>
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

      {/* Nombre del programa */}
      <div className="space-y-2">
        <Label htmlFor="programName">
          Nombre del programa <span className="text-destructive">*</span>
        </Label>
        <Input
          id="programName"
          name="programName"
          placeholder="ej: Figma, Photoshop, Blender..."
          value={formData.programName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Website del programa */}
      <div className="space-y-2">
        <Label htmlFor="programWebsite">
          Website oficial <span className="text-destructive">*</span>
        </Label>
        <Input
          id="programWebsite"
          name="programWebsite"
          type="url"
          placeholder="https://..."
          value={formData.programWebsite}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Categoría <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleccioná una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ui-design">Diseño UI/UX</SelectItem>
              <SelectItem value="graphic-design">Diseño Gráfico</SelectItem>
              <SelectItem value="3d">3D y Modelado</SelectItem>
              <SelectItem value="video">Video y Animación</SelectItem>
              <SelectItem value="photo">Fotografía</SelectItem>
              <SelectItem value="prototyping">Prototipado</SelectItem>
              <SelectItem value="illustration">Ilustración</SelectItem>
              <SelectItem value="other">Otra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Es Open Source */}
        <div className="space-y-2">
          <Label htmlFor="isOpenSource">
            ¿Es Open Source? <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.isOpenSource}
            onValueChange={(value) => handleSelectChange('isOpenSource', value)}
            required
          >
            <SelectTrigger id="isOpenSource">
              <SelectValue placeholder="Seleccioná una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Sí</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="freemium">Freemium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descripción del programa <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="¿Qué hace este programa? ¿Para qué sirve?"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Por qué agregarlo */}
      <div className="space-y-2">
        <Label htmlFor="whyAdd">¿Por qué debería estar en Secret Network?</Label>
        <Textarea
          id="whyAdd"
          name="whyAdd"
          placeholder="Contanos por qué este programa sería útil para la comunidad..."
          rows={3}
          value={formData.whyAdd}
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
          'Enviar sugerencia'
        )}
      </Button>
    </form>
  );
}
