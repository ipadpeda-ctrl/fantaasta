
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Timer as TimerIcon } from 'lucide-react';

export default function Timer({ endTime, onExpire }: { endTime: number | null, onExpire?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!endTime) {
            setTimeLeft(0);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.ceil((endTime - now) / 1000);

            if (diff <= 0) {
                setTimeLeft(0);
                if (onExpire) onExpire();
            } else {
                setTimeLeft(diff);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [endTime, onExpire]);

    if (!endTime) return null;

    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-4 rounded-full border-4 w-32 h-32 transition-colors",
            timeLeft <= 5 ? "border-red-500 text-red-500 animate-pulse bg-red-500/10" : "border-green-500 text-green-500 bg-green-500/10"
        )}>
            <TimerIcon className="w-6 h-6 mb-1" />
            <span className="text-4xl font-bold font-mono">{timeLeft}</span>
        </div>
    );
}
