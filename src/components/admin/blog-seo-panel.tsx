// FILE: src/components/admin/blog-seo-panel.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

interface BlogSEOPanelProps {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onKeywordsChange: (value: string[]) => void;
}

export function BlogSEOPanel({
  metaTitle,
  metaDescription,
  keywords,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onKeywordsChange,
}: BlogSEOPanelProps) {
  const [keywordsInput, setKeywordsInput] = useState(keywords.join(', '));

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    const keywordArray = value.split(',').map(k => k.trim()).filter(Boolean);
    onKeywordsChange(keywordArray);
  };

  // Validaciones SEO
  const titleLength = metaTitle.length;
  const descriptionLength = metaDescription.length;
  const titleValid = titleLength >= 30 && titleLength <= 60;
  const descriptionValid = descriptionLength >= 120 && descriptionLength <= 160;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          SEO Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input
            id="meta-title"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="Título optimizado para SEO (30-60 caracteres)"
            maxLength={60}
          />
          <div className="flex items-center justify-between text-xs">
            <span className={titleValid ? 'text-green-600' : 'text-orange-600'}>
              {titleLength}/60 caracteres
            </span>
            {!titleValid && (
              <span className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-3 w-3" />
                Recomendado: 30-60 caracteres
              </span>
            )}
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Descripción optimizada para SEO (120-160 caracteres)"
            maxLength={160}
            rows={3}
          />
          <div className="flex items-center justify-between text-xs">
            <span className={descriptionValid ? 'text-green-600' : 'text-orange-600'}>
              {descriptionLength}/160 caracteres
            </span>
            {!descriptionValid && (
              <span className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-3 w-3" />
                Recomendado: 120-160 caracteres
              </span>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords (separadas por comas)</Label>
          <Input
            id="keywords"
            value={keywordsInput}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            placeholder="diseño web, UI/UX, herramientas"
          />
          <p className="text-xs text-muted-foreground">
            {keywords.length} keywords • Recomendado: 5-10
          </p>
        </div>

        {/* SEO Score */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SEO Score</span>
            <span className={`text-sm font-bold flex items-center gap-1 ${
              titleValid && descriptionValid && keywords.length >= 5
                ? 'text-green-600'
                : 'text-orange-600'
            }`}>
              {titleValid && descriptionValid && keywords.length >= 5 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Bueno
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Mejorable
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
