export type Phase =
  | 'splash'
  | 'host-setup'
  | 'players-setup'
  | 'briefing'
  | 'pass-reveal'
  | 'end';

export interface Player {
  id: number;
  name: string;
  seed: string;
  isImposter: boolean;
  hasSeenWord: boolean;
}

export interface Round {
  category: string;
  word: string;
  imposterCount: number;
  players: Player[];
  currentRevealIndex: number;
  hostBriefed: boolean;
}

export interface CustomOverride {
  enabled: boolean;
  category: string;
  word: string;
}

export interface GameState {
  phase: Phase;
  hostName: string;
  hostSeed: string;
  playerNames: string[];
  playerSeeds: string[];
  imposterCount: number;
  customOverride: CustomOverride;
  lastImposterIds: number[];
  round: Round | null;
}
