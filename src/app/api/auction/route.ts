
import { NextResponse } from 'next/server';
import { auctionStore, INITIAL_STATE, Bid, Player } from '@/lib/auctionState';

export async function GET() {
    return NextResponse.json(auctionStore.state);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { action, payload } = body;
    const state = auctionStore.state;

    switch (action) {
        case 'RESET':
            auctionStore.reset();
            break;

        case 'SETUP_TEAMS':
            // payload: { teams: Team[] }
            auctionStore.setTeams(payload.teams);
            break;

        case 'START_PLAYER':
            // payload: { player: Player, basePrice: number }
            if (state.status !== 'IDLE' && state.status !== 'SOLD' && state.status !== 'PAUSED') {
                // Optionally allow simple override
            }
            state.currentPlayer = payload.player;
            state.currentBid = {
                amount: payload.basePrice,
                bidderTeamId: 'ADMIN', // specific admin ID
                timestamp: Date.now()
            };
            state.status = 'ACTIVE';
            state.endTime = Date.now() + 30000; // 30s initial timer
            break;

        case 'BID':
            // payload: { teamId: string, amount: number }
            if (state.status !== 'ACTIVE') {
                return NextResponse.json({ error: 'Auction not active' }, { status: 400 });
            }
            if (!state.currentBid || payload.amount > state.currentBid.amount) {
                state.currentBid = {
                    amount: payload.amount,
                    bidderTeamId: payload.teamId,
                    timestamp: Date.now()
                };
                // Reset Timer on bid (e.g. +15s, but capped? or simple reset to 15s if <15s?)
                // Simple rule: Reset to 15s from now.
                state.endTime = Date.now() + 15000;
            }
            break;

        case 'SOLD':
            // Logic to finalize
            if (state.currentPlayer && state.currentBid) {
                state.history.push({
                    player: state.currentPlayer,
                    amount: state.currentBid.amount,
                    teamId: state.currentBid.bidderTeamId
                });

                // Deduct credits and add player to team
                const winningTeam = state.teams.find(t => t.id === state.currentBid?.bidderTeamId);
                if (winningTeam) {
                    winningTeam.credits -= state.currentBid.amount;
                    winningTeam.roster.push(state.currentPlayer);
                    // Decrement slot count based on role logic locally or in UI
                }

                state.status = 'SOLD';
                state.currentPlayer = null;
                state.currentBid = null;
                state.endTime = null;
            }
            break;

        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(state);
}
