
'use client';

import { useAuction } from '@/hooks/useAuction';
import SetupWizard from '@/components/SetupWizard';
import AuctionRoom from '@/components/AuctionRoom';

export default function Home() {
  const { state, loading, refresh } = useAuction();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground animate-pulse">Caricamento FantaArea...</div>;
  }

  if (!state) {
    return <div className="text-red-500 text-center mt-20">Errore di connessione al server.</div>;
  }

  // If no teams are set up, show the wizard
  if (state.teams.length === 0) {
    return (
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-background to-background p-4">
        <header className="text-center py-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Fanta<span className="text-primary">Asta</span> Pro
          </h1>
          <p className="text-muted-foreground">Suite di gestione asta di riparazione</p>
        </header>
        <SetupWizard onComplete={refresh} />
      </main>
    );
  }

  // Auction Room
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuctionRoom />
    </main>
  );
}
