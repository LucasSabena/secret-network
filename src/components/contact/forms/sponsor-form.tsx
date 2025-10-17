// FILE: src/components/contact/forms/sponsor-form.tsx

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

interface SponsorFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function SponsorForm({ onSubmit, isSubmitting }: SponsorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    budget: '',
    sponsorType: '',
    message: '',
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
      subject: 'sponsor',
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            required
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
            placeholder="juan@empresa.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Empresa */}
        <div className="space-y-2">
          <Label htmlFor="company">
            Empresa <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="Mi Empresa SRL"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Website (opcional)</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://miempresa.com"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Tipo de sponsoreo */}
      <div className="space-y-2">
        <Label htmlFor="sponsorType">
          Tipo de sponsoreo <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.sponsorType}
          onValueChange={(value) => handleSelectChange('sponsorType', value)}
          required
        >
          <SelectTrigger id="sponsorType">
            <SelectValue placeholder="Seleccioná una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Banner en homepage</SelectItem>
            <SelectItem value="newsletter">Newsletter sponsor</SelectItem>
            <SelectItem value="category">Categoría destacada</SelectItem>
            <SelectItem value="custom">Propuesta personalizada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Presupuesto */}
      <div className="space-y-2">
        <Label htmlFor="budget">
          Presupuesto estimado <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.budget}
          onValueChange={(value) => handleSelectChange('budget', value)}
          required
        >
          <SelectTrigger id="budget">
            <SelectValue placeholder="Seleccioná un rango" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1000">Menos de $1,000</SelectItem>
            <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
            <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
            <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
            <SelectItem value="25000+">$25,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mensaje */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Mensaje <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Contanos sobre tu empresa y qué tipo de colaboración te interesa..."
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
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
          'Enviar propuesta'
        )}
      </Button>
    </form>
  );
}
