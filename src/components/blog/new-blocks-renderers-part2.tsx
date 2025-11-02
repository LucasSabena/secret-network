'use client';

/**
 * Renderizadores para los nuevos bloques en el frontend - Parte 2
 */

import { Block } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Check, Star, AlertTriangle, Info, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ProgramCard } from '@/components/shared/program-card';

// Helper para obtener iconos dinámicamente
const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.HelpCircle;
};

// Helper para generar fingerprint del navegador
const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const canvasData = canvas.toDataURL();
  
  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    canvasData,
  ].join('|');

  // Simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'fp_' + Math.abs(hash).toString(36);
};

// ============================================================================
// AUTHOR BIO RENDERER
// ============================================================================
export function AuthorBioBlockComponent({ block }: { block: Extract<Block, { type: 'author-bio' }> }) {
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      const { data } = await supabaseBrowserClient
        .from('autores')
        .select('*')
        .eq('id', block.data.authorId)
        .single();

      setAuthor(data);
      setLoading(false);
    };

    if (block.data.authorId) {
      fetchAuthor();
    } else {
      setLoading(false);
    }
  }, [block.data.authorId]);

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg my-8" />;
  }

  if (!author) {
    return null;
  }

  return (
    <div className="my-8 border rounded-lg p-6 bg-muted/30">
      <div className="flex gap-4">
        {author.avatar_url && (
          <img
            src={author.avatar_url}
            alt={author.nombre}
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">{author.nombre}</h3>
          {author.bio && (
            <p className="text-sm text-muted-foreground mb-3">{author.bio}</p>
          )}
          {block.data.showSocial !== false && (
            <div className="flex gap-3 text-sm">
              {author.website_url && (
                <a href={author.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Website
                </a>
              )}
              {author.twitter_handle && (
                <a href={`https://twitter.com/${author.twitter_handle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Twitter
                </a>
              )}
              {author.linkedin_url && (
                <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// POLL RENDERER
// ============================================================================
export function PollBlockComponent({ block }: { block: Extract<Block, { type: 'poll' }> }) {
  const [poll, setPoll] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchPoll();
    checkIfVoted();
  }, [block.data.pollId]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${block.data.pollId}`);
      if (response.ok) {
        const data = await response.json();
        setPoll(data);
      } else {
        // Si el poll no existe, crearlo
        await createPoll();
      }
    } catch (error) {
      console.error('Error al cargar poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${block.data.pollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: block.data.question,
          options: block.data.options,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPoll(data);
      }
    } catch (error) {
      console.error('Error al crear poll:', error);
    }
  };

  const checkIfVoted = () => {
    const voted = localStorage.getItem(`poll_voted_${block.data.pollId}`);
    setHasVoted(!!voted);
  };

  const handleVote = async (optionId: string) => {
    if (hasVoted || voting) return;

    setVoting(true);
    const fingerprint = generateFingerprint();

    try {
      const response = await fetch(`/api/polls/${block.data.pollId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, fingerprint }),
      });

      if (response.ok) {
        const data = await response.json();
        setPoll(data.poll);
        setHasVoted(true);
        setSelectedOption(optionId);
        localStorage.setItem(`poll_voted_${block.data.pollId}`, 'true');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al votar');
      }
    } catch (error) {
      console.error('Error al votar:', error);
      alert('Error al procesar tu voto');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-muted h-48 rounded-lg my-8" />;
  }

  if (!poll) {
    return null;
  }

  const totalVotes = poll.total_votes || 0;

  return (
    <div className="my-8 border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((option: any) => {
          const votes = option.votes || 0;
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || voting}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all relative overflow-hidden',
                hasVoted
                  ? 'cursor-default'
                  : 'hover:border-primary cursor-pointer',
                isSelected && 'border-primary bg-primary/5'
              )}
            >
              {hasVoted && (
                <div
                  className="absolute inset-0 bg-primary/10"
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="font-medium">{option.text}</span>
                {hasVoted && (
                  <span className="text-sm text-muted-foreground">
                    {percentage.toFixed(1)}% ({votes})
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {hasVoted && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Total de votos: {totalVotes}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// PROGRESS BAR RENDERER
// ============================================================================
export function ProgressBarBlockComponent({ block }: { block: Extract<Block, { type: 'progress-bar' }> }) {
  return (
    <div className="my-8 space-y-4">
      {block.data.items.map((item) => (
        <div key={item.id}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm text-muted-foreground">{item.value}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color || '#3b82f6',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CHECKLIST RENDERER
// ============================================================================
export function ChecklistBlockComponent({ block }: { block: Extract<Block, { type: 'checklist' }> }) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar estado desde localStorage
    const saved = localStorage.getItem(`checklist_${block.id}`);
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)));
    }
  }, [block.id]);

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
    localStorage.setItem(`checklist_${block.id}`, JSON.stringify(Array.from(newChecked)));
  };

  return (
    <div className="my-8 border rounded-lg p-6 bg-card">
      {block.data.title && (
        <h3 className="text-lg font-semibold mb-4">{block.data.title}</h3>
      )}
      <div className="space-y-2">
        {block.data.items.map((item) => {
          const isChecked = checkedItems.has(item.id);
          return (
            <label
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item.id)}
                className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary"
              />
              <span className={cn(
                'flex-1',
                isChecked && 'line-through text-muted-foreground'
              )}>
                {item.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// CHANGELOG RENDERER
// ============================================================================
export function ChangelogBlockComponent({ block }: { block: Extract<Block, { type: 'changelog' }> }) {
  const typeColors = {
    added: 'text-green-600 dark:text-green-400',
    fixed: 'text-blue-600 dark:text-blue-400',
    changed: 'text-yellow-600 dark:text-yellow-400',
    removed: 'text-red-600 dark:text-red-400',
  };

  const typeLabels = {
    added: 'Agregado',
    fixed: 'Corregido',
    changed: 'Cambiado',
    removed: 'Eliminado',
  };

  return (
    <div className="my-8 space-y-6">
      {block.data.entries.map((entry) => (
        <div key={entry.id} className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold">{entry.version}</span>
            <span className="text-sm text-muted-foreground">{entry.date}</span>
            {entry.type && (
              <span className={cn('text-xs font-medium uppercase', typeColors[entry.type])}>
                {typeLabels[entry.type]}
              </span>
            )}
          </div>
          <ul className="space-y-1">
            {entry.changes.map((change, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <div 
                  className="flex-1 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: change }}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Continúa en el siguiente mensaje...
