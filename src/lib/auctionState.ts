
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export type Role = 'P' | 'D' | 'C' | 'A';

export interface Player {
  id: string;
  name: string;
  team: string; // Serie A team
  role: Role;
  quotation: number; // Quotazione attuale
  fvm: number; // Fantamedia (mocked for now)
}

export interface Bid {
  amount: number;
  bidderTeamId: string;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  credits: number;
  roster: Player[];
  slots: {
    P: number;
    D: number;
    C: number;
    A: number;
  };
}

export interface AuctionState {
  status: 'IDLE' | 'ACTIVE' | 'PAUSED' | 'SOLD';
  currentPlayer: Player | null;
  currentBid: Bid | null;
  endTime: number | null; // For the timer
  teams: Team[];
  history: { player: Player, amount: number, teamId: string }[];
}

// Initial Mock Data
export const INITIAL_TEAMS: Team[] = [];

export const INITIAL_STATE: AuctionState = {
  status: 'IDLE',
  currentPlayer: null,
  currentBid: null,
  endTime: null,
  teams: [],
  history: [],
};

// Simple In-Memory Store for now (will attach to LowDB in route)
class AuctionStore {
  state: AuctionState = { ...INITIAL_STATE };
  
  // Helpers to mutate state safely
  reset() {
    this.state = { ...INITIAL_STATE };
  }

  setTeams(teams: Team[]) {
    this.state.teams = teams;
  }
}

export const auctionStore = new AuctionStore();
