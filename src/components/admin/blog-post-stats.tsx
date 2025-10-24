// FILE: src/components/admin/blog-post-stats.tsx
'use client';

import { useEffect, useState } from 'react';
import { Eye, MousePointerClick, Share2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPostStatsProps {
  postId: number;
}

interface Stats {
  views: number;
  clicks: number;
  shares: number;
  total: number;
}

export function BlogPostStats({ postId }: BlogPostStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/analytics/stats/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [postId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      label: 'Vistas',
      value: stats.views,
      icon: Eye,
      color: 'text-blue-500',
    },
    {
      label: 'Clicks',
      value: stats.clicks,
      icon: MousePointerClick,
      color: 'text-green-500',
    },
    {
      label: 'Compartidos',
      value: stats.shares,
      icon: Share2,
      color: 'text-purple-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Estadísticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className={`h-5 w-5 mx-auto mb-1 ${item.color}`} />
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
