// FILE: src/components/admin/blog-schedule-picker.tsx
'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock } from 'lucide-react';

interface BlogSchedulePickerProps {
  scheduledFor: string | null;
  onChange: (date: string | null) => void;
}

export function BlogSchedulePicker({ scheduledFor, onChange }: BlogSchedulePickerProps) {
  const [isScheduled, setIsScheduled] = useState(!!scheduledFor);
  
  const handleToggle = (checked: boolean) => {
    setIsScheduled(checked);
    if (!checked) {
      onChange(null);
    } else {
      // Set default to tomorrow at 9 AM Argentina time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      onChange(tomorrow.toISOString());
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // El input datetime-local ya maneja la zona horaria local del navegador
      const date = new Date(e.target.value);
      onChange(date.toISOString());
    }
  };

  // Convert ISO string to datetime-local format (respeta la zona horaria local)
  const getDateTimeLocalValue = () => {
    if (!scheduledFor) return '';
    const date = new Date(scheduledFor);
    
    // Obtener los valores en la zona horaria local del usuario
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="schedule-toggle">Programar publicación</Label>
        <Switch
          id="schedule-toggle"
          checked={isScheduled}
          onCheckedChange={handleToggle}
        />
      </div>

      {isScheduled && (
        <div className="space-y-2">
          <Label htmlFor="scheduled-date" className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Fecha y hora de publicación
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              id="scheduled-date"
              type="datetime-local"
              value={getDateTimeLocalValue()}
              onChange={handleDateTimeChange}
              className="pl-10"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            El post se publicará automáticamente en la fecha y hora seleccionada (hora local de tu navegador)
          </p>
        </div>
      )}
    </div>
  );
}
