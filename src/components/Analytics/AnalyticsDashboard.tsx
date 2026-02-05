
'use client';

import { useAuction } from '@/hooks/useAuction';
import { Button } from '@/components/ui/button';
import { Team, Role } from '@/lib/auctionState';
import { Download } from 'lucide-react';

export default function AnalyticsDashboard() {
    const { state } = useAuction();

    if (!state) return null;

    const roles: Role[] = ['P', 'D', 'C', 'A'];

    const getRoleCount = (team: Team, role: Role) => team.roster.filter(p => p.role === role).length;

    const calculateSpent = (team: Team, role: Role) => {
        const teamPurchases = state.history.filter(h => h.teamId === team.id && h.player.role === role);
        return teamPurchases.reduce((sum, h) => sum + h.amount, 0);
    };

    const handleExport = () => {
        const headers = ['Squadra', 'Crediti Residui', 'Portieri', 'Difensori', 'Centrocampisti', 'Attaccanti', 'Spesa Totale'];
        const rows = state.teams.map(t => [
            t.name,
            t.credits,
            `${getRoleCount(t, 'P')}/${t.slots.P}`,
            `${getRoleCount(t, 'D')}/${t.slots.D}`,
            `${getRoleCount(t, 'C')}/${t.slots.C}`,
            `${getRoleCount(t, 'A')}/${t.slots.A}`,
            (500 - t.credits) // Assuming 500 start, or calculate sum of spent
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fanta_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Panoramica completa delle rose e delle spese.</p>
                <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" /> Esporta CSV
                </Button>
            </div>

            <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                        <tr>
                            <th className="p-3">Squadra</th>
                            <th className="p-3">Crediti</th>
                            {roles.map(r => <th key={r} className="p-3">{r === 'P' ? 'Por' : r === 'D' ? 'Dif' : r === 'C' ? 'Cen' : 'Att'}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {state.teams.map(t => (
                            <tr key={t.id} className="border-t hover:bg-muted/20">
                                <td className="p-3 font-medium">{t.name}</td>
                                <td className="p-3 font-mono text-yellow-400 font-bold">{t.credits}</td>
                                {roles.map(r => {
                                    const count = getRoleCount(t, r);
                                    const target = t.slots[r];
                                    const spent = calculateSpent(t, r);
                                    const isFull = count >= target;
                                    return (
                                        <td key={r} className="p-3">
                                            <div className="flex flex-col">
                                                <span className={isFull ? "text-green-500" : "text-red-400"}>
                                                    {count}/{target}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{spent} cr</span>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
