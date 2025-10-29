'use client';

import { BlogSeriesCard } from './blog-series-card';

interface Post {
  id: number;
  titulo: string;
  slug: string;
  tags: string[] | null;
  imagen_portada_url: string | null;
}

interface BlogSeriesViewProps {
  posts: Post[];
}

export function BlogSeriesView({ posts }: BlogSeriesViewProps) {
  // Extraer series de los tags
  const seriesMap = new Map<string, { posts: Post[]; color: string }>();

  posts.forEach((post) => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((tag) => {
        // Considerar tags que parecen series (más de 2 palabras o contienen números/años)
        if (tag.split(' ').length >= 2 || /\d{4}/.test(tag)) {
          if (!seriesMap.has(tag)) {
            seriesMap.set(tag, {
              posts: [],
              color: getColorForSeries(tag),
            });
          }
          seriesMap.get(tag)!.posts.push(post);
        }
      });
    }
  });

  // Filtrar series con al menos 2 posts
  const series = Array.from(seriesMap.entries())
    .filter(([_, data]) => data.posts.length >= 2)
    .sort((a, b) => b[1].posts.length - a[1].posts.length);

  if (series.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay series disponibles todavía. Las series se crean automáticamente cuando varios artículos comparten tags relacionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Series de Artículos</h2>
        <p className="text-muted-foreground">
          Colecciones de artículos relacionados sobre temas específicos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map(([name, data]) => (
          <BlogSeriesCard
            key={name}
            name={name}
            slug={createSlug(name)}
            description={`Una colección de ${data.posts.length} artículos sobre ${name}`}
            postsCount={data.posts.length}
            coverImage={data.posts[0]?.imagen_portada_url || undefined}
            color={data.color}
          />
        ))}
      </div>
    </div>
  );
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getColorForSeries(name: string): string {
  const colors = [
    '#ff3399', // Rosa principal
    '#FF6B6B', // Rojo
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul
    '#FFA07A', // Naranja
    '#98D8C8', // Verde agua
    '#F7DC6F', // Amarillo
    '#BB8FCE', // Púrpura
  ];
  
  // Generar color basado en el hash del nombre
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
