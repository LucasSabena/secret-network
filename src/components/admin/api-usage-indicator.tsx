'use client';

import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApiUsage {
    remaining: number;
    used: number;
    daily_limit: number;
    reset_at: string;
}

export default function ApiUsageIndicator() {
    const [usage, setUsage] = useState<ApiUsage | null>(null);

    useEffect(() => {
        async function fetchUsage() {
            try {
                const res = await fetch('/api/api-usage');
                const data = await res.json();
                setUsage(data.microlink);
            } catch (e) {
                console.log('Could not fetch API usage');
            }
        }
        fetchUsage();
        // Refresh every 30 seconds
        const interval = setInterval(fetchUsage, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!usage) return null;

    const isLow = usage.remaining < 10;
    const isEmpty = usage.remaining === 0;

    return (
        <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isEmpty
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : isLow
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-muted text-muted-foreground'
                }`}
            title={`Capturas de pantalla: ${usage.used}/${usage.daily_limit} usadas hoy`}
        >
            <Camera className="h-3 w-3" />
            <span>{usage.remaining}/{usage.daily_limit}</span>
        </div>
    );
}
