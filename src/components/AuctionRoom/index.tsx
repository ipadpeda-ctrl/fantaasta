'use client';

import { cn } from '@/lib/utils';

import { useState } from 'react';
import { useAuction } from '@/hooks/useAuction';
import { Button } from '@/components/ui/button';
import { Team } from '@/lib/auctionState';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Timer from './Timer';
import { Badge } from '@/components/ui/badge'; // I need to create Badge
import { Hammer, User, UserPlus, BarChart3, Crown } from 'lucide-react';
import Modal from '@/components/ui/modal';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';

export default function AuctionRoom() {
    const { state, startAuction, placeBid, sold, reset } = useAuction();
    const [playerName, setPlayerName] = useState('');
    const [basePrice, setBasePrice] = useState(1);
    const [myTeamId, setMyTeamId] = useState<string>('');
    const [adminMode, setAdminMode] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    if (!state) return null;

    // Simple "Login" to pick who you are (for MVP without Auth)
    if (!myTeamId) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-xl font-bold">Chi sei?</h2>
                <div className="grid grid-cols-2 gap-4 w-full">
                    {state.teams.map(t => (
                        <Button key={t.id} onClick={() => setMyTeamId(t.id)}>
                            {t.name}
                        </Button>
                    ))}
                    <Button variant="outline" className="col-span-2 mt-4" onClick={() => { setMyTeamId('ADMIN'); setAdminMode(true); }}>
                        👑 Entra solo come Regista (Admin)
                    </Button>
                </div>
            </div>
        );
    }

    const myTeam = state.teams.find(t => t.id === myTeamId);
    const isAdmin = myTeamId === 'ADMIN' || adminMode;

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-lg backdrop-blur">
                <div className="flex items-center gap-2">
                    {isAdmin ? <Badge variant="destructive" onClick={() => setAdminMode(!adminMode)} className="cursor-pointer">ADMIN MODE (Click to Toggle)</Badge> : <Badge variant="outline" className="cursor-pointer" onClick={() => setAdminMode(true)}>{myTeam?.name}</Badge>}
                    {myTeam && <span className="font-mono text-yellow-400 font-bold">{myTeam.credits} crediti</span>}
                    {myTeam && !isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => setAdminMode(true)} title="Diventa Admin">
                            <Crown className="w-4 h-4 text-yellow-500 opacity-50 hover:opacity-100" />
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAnalytics(true)}>
                        <BarChart3 className="mr-2 h-4 w-4" /> Analisi
                    </Button>
                    {isAdmin && <Button variant="ghost" size="sm" onClick={() => { if (confirm('Reset?')) reset() }}>Reset</Button>}
                </div>
            </div>

            <Modal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} title="Dashboard Asta">
                <AnalyticsDashboard />
            </Modal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Main Stage */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Active Player Card */}
                    <Card className="min-h-[400px] flex flex-col relative overflow-hidden border-primary/50 shadow-2xl shadow-primary/10">
                        {state.status === 'ACTIVE' && state.currentPlayer ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 animate-in zoom-in-95">
                                <div className="absolute top-4 right-4">
                                    <Timer endTime={state.endTime} />
                                </div>

                                <div className="text-center space-y-2">
                                    <h2 className="text-5xl font-black uppercase tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                        {state.currentPlayer.name}
                                    </h2>
                                    <Badge className="text-xl px-4 py-1">{state.currentPlayer.role === 'P' ? 'Portiere' : state.currentPlayer.role === 'D' ? 'Difensore' : state.currentPlayer.role === 'C' ? 'Centrocampista' : 'Attaccante'}</Badge>
                                    {/* Mock FVM */}
                                    <div className="flex gap-4 justify-center mt-4">
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground">Qt. Attuale</div>
                                            <div className="font-bold text-xl">{state.currentPlayer.quotation}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground">FantaMedia</div>
                                            <div className="font-bold text-xl text-green-400">7.5</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Bid Display */}
                                <div className="w-full bg-secondary/50 p-6 rounded-xl flex justify-between items-center border border-white/10">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Offerta Attuale</div>
                                        <div className="text-4xl font-bold tabular-nums text-yellow-400">{state.currentBid?.amount}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground">Miglior Offerente</div>
                                        <div className="text-2xl font-bold truncate max-w-[200px]">
                                            {state.teams.find(t => t.id === state.currentBid?.bidderTeamId)?.name || 'Admin'}
                                        </div>
                                    </div>
                                </div>

                                {/* Bidding Controls */}
                                <div className="flex gap-2 w-full pt-4">
                                    {!isAdmin && myTeam && (
                                        <>
                                            <Button className="flex-1 h-14 text-lg font-bold bg-green-600 hover:bg-green-700"
                                                onClick={() => placeBid(myTeamId, (state.currentBid?.amount || 0) + 1)}
                                                disabled={myTeam.credits < (state.currentBid?.amount || 0) + 1}>
                                                +1
                                            </Button>
                                            <Button className="flex-1 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                                                onClick={() => placeBid(myTeamId, (state.currentBid?.amount || 0) + 5)}
                                                disabled={myTeam.credits < (state.currentBid?.amount || 0) + 5}>
                                                +5
                                            </Button>
                                        </>
                                    )}
                                    {isAdmin && (
                                        <Button className="w-full h-14 text-xl font-bold bg-destructive hover:bg-destructive/90 animate-pulse"
                                            onClick={sold}>
                                            <Hammer className="mr-2 h-6 w-6" /> AGGIUDICA
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                <UserPlus className="w-16 h-16 opacity-20" />
                                <p className="text-xl">In attesa del prossimo giocatore...</p>
                            </div>
                        )}
                    </Card>

                    {/* Admin Controls */}
                    {isAdmin && state.status !== 'ACTIVE' && (
                        <Card>
                            <CardContent className="p-6 flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Nome Giocatore</label>
                                    <Input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Es. Lukaku" />
                                </div>
                                <div className="w-24 space-y-2">
                                    <label className="text-sm font-medium">Base</label>
                                    <Input type="number" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} />
                                </div>
                                <Button onClick={() => startAuction({ id: Date.now().toString(), name: playerName, role: 'A', quotation: 1, team: 'FA', fvm: 6 }, basePrice)}>
                                    Chiama
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                </div>

                {/* RIGHT: Sidebar (Teams & History) */}
                <div className="space-y-6">
                    <Card className="h-[600px] overflow-y-auto">
                        <div className="p-4 space-y-4">
                            <h3 className="font-bold border-b pb-2">Classifica Budget</h3>
                            {state.teams.slice().sort((a, b) => b.credits - a.credits).map((t: Team) => (
                                <div key={t.id} className={cn("flex justify-between items-center p-3 rounded",
                                    state.currentBid?.bidderTeamId === t.id ? "bg-primary/20 border border-primary" : "bg-muted/50")}>
                                    <span className="font-medium">{t.name}</span>
                                    <span className="font-mono">{t.credits}</span>
                                </div>
                            ))}

                            <h3 className="font-bold border-b pb-2 pt-4">Ultimi Acquisti</h3>
                            <div className="space-y-2">
                                {state.history.slice().reverse().map((h, i) => (
                                    <div key={i} className="text-sm flex justify-between text-muted-foreground">
                                        <span>{h.player.name}</span>
                                        <span>{h.amount} ({state.teams.find(t => t.id === h.teamId)?.name})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
