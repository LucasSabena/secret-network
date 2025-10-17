'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Loader2, User, Sparkles, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Autor } from '@/lib/types';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { validateImageFile } from '@/lib/cloudinary-config';

interface AutorFormProps {
  autor: Autor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

type AutorFormData = {
  nombre: string;
  slug: string;
  bio: string;
  email: string;
  website_url: string;
  twitter_handle: string;
  linkedin_url: string;
};

export default function AutorForm({ autor, isOpen, onClose, onSave }: AutorFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AutorFormData>({
    defaultValues: {
      nombre: '',
      slug: '',
      bio: '',
      email: '',
      website_url: '',
      twitter_handle: '',
      linkedin_url: '',
    },
  });

  // Cargar datos del autor si estamos editando
  useEffect(() => {
    if (autor) {
      reset({
        nombre: autor.nombre,
        slug: autor.slug,
        bio: autor.bio || '',
        email: autor.email || '',
        website_url: autor.website_url || '',
        twitter_handle: autor.twitter_handle || '',
        linkedin_url: autor.linkedin_url || '',
      });
    } else {
      reset({
        nombre: '',
        slug: '',
        bio: '',
        email: '',
        website_url: '',
        twitter_handle: '',
        linkedin_url: '',
      });
    }
    setAvatarFile(null);
  }, [autor, reset, isOpen]);

  // Auto-generar slug desde el nombre
  const nombre = watch('nombre');
  useEffect(() => {
    if (!autor && nombre) {
      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [nombre, autor, setValue]);

  // Manejar selección de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: 'Error en el archivo',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setAvatarFile(file);
  };

  // Enviar formulario
  const onSubmit = async (data: AutorFormData) => {
    setIsSaving(true);

    try {
      let avatarUrl = autor?.avatar_url || null;

      // Subir avatar si hay uno nuevo
      if (avatarFile) {
        setIsUploadingAvatar(true);
        avatarUrl = await uploadToCloudinary(avatarFile, 'autores');
        setIsUploadingAvatar(false);
      }

      const autorData = {
        nombre: data.nombre,
        slug: data.slug,
        bio: data.bio || null,
        avatar_url: avatarUrl,
        email: data.email || null,
        website_url: data.website_url || null,
        twitter_handle: data.twitter_handle || null,
        linkedin_url: data.linkedin_url || null,
      };

      if (autor) {
        // Actualizar autor existente
        const { error } = await supabaseBrowserClient
          .from('autores')
          .update(autorData)
          .eq('id', autor.id);

        if (error) throw error;

        toast({
          title: 'Autor actualizado',
          description: `"${data.nombre}" se actualizó correctamente.`,
        });
      } else {
        // Crear nuevo autor
        const { error } = await supabaseBrowserClient
          .from('autores')
          .insert([autorData]);

        if (error) throw error;

        toast({
          title: 'Autor creado',
          description: `"${data.nombre}" se creó correctamente.`,
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: 'Error al guardar autor',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setIsUploadingAvatar(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {autor ? (
              <>
                <Save className="h-6 w-6 text-primary" />
                Editar Autor
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6 text-primary" />
                Nuevo Autor
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Información Básica */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Información Básica</h3>

            <div>
              <Label htmlFor="nombre">
                Nombre completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="Ej: Lucas Sabena"
              />
              {errors.nombre && (
                <p className="text-xs text-destructive mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">
                Slug (URL) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                {...register('slug', { required: 'El slug es obligatorio' })}
                placeholder="lucas-sabena"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se genera automáticamente desde el nombre
              </p>
              {errors.slug && (
                <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Breve descripción del autor (150-300 caracteres)"
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {watch('bio')?.length || 0} / 300 caracteres
              </p>
            </div>
          </Card>

          {/* Avatar */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Avatar</h3>

            <div className="flex items-center gap-4">
              {/* Preview del avatar */}
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                {avatarFile ? (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : autor?.avatar_url ? (
                  <img
                    src={autor.avatar_url}
                    alt={autor.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              {/* Botón de upload */}
              <div className="flex-1">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border hover:border-primary rounded-lg p-4 text-center transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      {avatarFile ? 'Cambiar imagen' : 'Subir avatar'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP • Máx 5MB • Recomendado: 400x400px
                    </p>
                  </div>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
          </Card>

          {/* Contacto y Redes */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Contacto y Redes Sociales</h3>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="autor@secret-network.com"
              />
            </div>

            <div>
              <Label htmlFor="website_url">Sitio Web</Label>
              <Input
                id="website_url"
                type="url"
                {...register('website_url')}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="twitter_handle">Twitter / X</Label>
              <Input
                id="twitter_handle"
                {...register('twitter_handle')}
                placeholder="@usuario (sin @)"
              />
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                type="url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/usuario"
              />
            </div>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploadingAvatar}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isSaving || isUploadingAvatar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploadingAvatar ? 'Subiendo avatar...' : 'Guardando...'}
                </>
              ) : (
                <>
                  {autor ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Actualizar Autor
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Crear Autor
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
