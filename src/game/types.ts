export type Phase =
  | 'splash'
  | 'home'
  | 'host-setup'
  | 'players-setup'
  | 'briefing'
  | 'pass-reveal'
  | 'end';

export type GameMode = 'imposter' | 'mafia';

export type Role = 'imposter' | 'crew' | 'mafia' | 'doctor' | 'detective' | 'villager';

export interface Player {
  id: number;
  name: string;
  seed: string;
  role: Role;
  hasSeenWord: boolean;
}

export interface Round {
  mode: GameMode;
  category: string;
  word: string;
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
  gameMode: GameMode | null;
  hostName: string;
  hostSeed: string;
  playerNames: string[];
  playerSeeds: string[];
  imposterCount: number;
  mafiaCount: number;
  hasDoctor: boolean;
  hasDetective: boolean;
  customOverride: CustomOverride;
  lastImposterIds: number[];
  removedByHostFilter: { name: string; seed: string } | null;
  round: Round | null;
}
