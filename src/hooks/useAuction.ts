
import { useState, useEffect, useCallback } from 'react';
import { AuctionState, Player, Team } from '@/lib/auctionState';

export function useAuction() {
    const [state, setState] = useState<AuctionState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchState = useCallback(async () => {
        try {
            const res = await fetch('/api/auction');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setState(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Connection lost');
        } finally {
            setLoading(false);
        }
    }, []);

    // Poll every 1 second
    useEffect(() => {
        fetchState();
        const interval = setInterval(fetchState, 1000);
        return () => clearInterval(interval);
    }, [fetchState]);

    const sendAction = async (action: string, payload: any) => {
        try {
            await fetch('/api/auction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, payload }),
            });
            fetchState(); // Immediate update
        } catch (err) {
            console.error(err);
        }
    };

    return {
        state,
        loading,
        error,
        refresh: fetchState,
        startAuction: (player: Player, basePrice: number) => sendAction('START_PLAYER', { player, basePrice }),
        placeBid: (teamId: string, amount: number) => sendAction('BID', { teamId, amount }),
        sold: () => sendAction('SOLD', {}),
        reset: () => sendAction('RESET', {}),
        setupTeams: (teams: Team[]) => sendAction('SETUP_TEAMS', { teams }),
    };
}
