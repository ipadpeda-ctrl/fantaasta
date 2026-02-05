
'use client';

import { useState } from 'react';
import { useAuction } from '@/hooks/useAuction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Team } from '@/lib/auctionState';

export default function SetupWizard({ onComplete }: { onComplete: () => void }) {
    const { setupTeams } = useAuction();
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState(500);
    const [teamCount, setTeamCount] = useState(8);
    const [slots, setSlots] = useState({ P: 3, D: 8, C: 8, A: 6 });
    const [teamNames, setTeamNames] = useState<string[]>([]);

    const handleGeneralSubmit = () => {
        setTeamNames(Array(teamCount).fill('').map((_, i) => `Squadra ${i + 1}`));
        setStep(2);
    };

    const handleSquadsSubmit = () => {
        setStep(3);
    };

    const handleTeamsSubmit = () => {
        const teams: Team[] = teamNames.map((name, i) => ({
            id: `team-${i}`,
            name,
            credits: budget,
            roster: [],
            slots: { ...slots }
        }));
        setupTeams(teams);
        onComplete();
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-3xl text-primary font-bold">
                        {step === 1 && "Impostazioni Generali"}
                        {step === 2 && "Composizione Rose"}
                        {step === 3 && "Nomi Squadre"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Budget Iniziale</label>
                                <Input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Numero Partecipanti</label>
                                <Input
                                    type="number"
                                    value={teamCount}
                                    onChange={(e) => setTeamCount(Number(e.target.value))}
                                />
                            </div>
                            <Button onClick={handleGeneralSubmit} className="w-full">Avanti</Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="text-muted-foreground text-sm">Definisci gli slot per ogni ruolo.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-yellow-500">Portieri</label>
                                    <Input type="number" value={slots.P} onChange={(e) => setSlots({ ...slots, P: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-green-500">Difensori</label>
                                    <Input type="number" value={slots.D} onChange={(e) => setSlots({ ...slots, D: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-blue-500">Centrocampisti</label>
                                    <Input type="number" value={slots.C} onChange={(e) => setSlots({ ...slots, C: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-red-500">Attaccanti</label>
                                    <Input type="number" value={slots.A} onChange={(e) => setSlots({ ...slots, A: Number(e.target.value) })} />
                                </div>
                            </div>
                            <Button onClick={handleSquadsSubmit} className="w-full">Avanti</Button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {teamNames.map((name, i) => (
                                    <div key={i}>
                                        <Input
                                            value={name}
                                            onChange={(e) => {
                                                const newNames = [...teamNames];
                                                newNames[i] = e.target.value;
                                                setTeamNames(newNames);
                                            }}
                                            placeholder={`Nome Squadra ${i + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleTeamsSubmit} className="w-full bg-green-600 hover:bg-green-700">
                                Crea Lega e Inizia
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
