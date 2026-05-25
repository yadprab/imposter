import { randomSeed } from '../components/Avatar';
import type { CustomOverride, GameState, Player, Round } from './types';
import { pickRandomWord } from './words';

const DEFAULT_PLAYERS = [
  'Ram',
  'Badri',
  'Kannan',
  'Mega',
  'Yaddy',
  'Rinosha',
  'Shalini',
  'Vignesh',
  'Sabz',
  'Rohit',
  'Swetha'
];

export const initialState: GameState = {
  phase: 'splash',
  hostName: '',
  hostSeed: randomSeed(),
  playerNames: DEFAULT_PLAYERS,
  playerSeeds: DEFAULT_PLAYERS.map(() => randomSeed()),
  imposterCount: 1,
  customOverride: { enabled: true, category: '', word: '' },
  lastImposterIds: [],
  round: null
};

export type Action =
  | { type: 'LEAVE_SPLASH' }
  | { type: 'SET_HOST_NAME'; name: string }
  | { type: 'REROLL_HOST_AVATAR' }
  | { type: 'CONTINUE_TO_PLAYERS' }
  | { type: 'BACK_TO_HOST' }
  | { type: 'SET_PLAYER_NAME'; index: number; name: string }
  | { type: 'ADD_PLAYER' }
  | { type: 'REMOVE_PLAYER'; index: number }
  | { type: 'REROLL_AVATAR'; index: number }
  | { type: 'SET_IMPOSTER_COUNT'; count: number }
  | { type: 'TOGGLE_CUSTOM_OVERRIDE' }
  | { type: 'SET_CUSTOM_CATEGORY'; category: string }
  | { type: 'SET_CUSTOM_WORD'; word: string }
  | { type: 'START_ROUND' }
  | { type: 'MARK_HOST_BRIEFED' }
  | { type: 'BEGIN_HANDOFF' }
  | { type: 'MARK_REVEALED'; playerId: number }
  | { type: 'ADVANCE_REVEAL' }
  | { type: 'END_ROUND' }
  | { type: 'NEW_ROUND_SAME_PLAYERS' }
  | { type: 'BACK_TO_PLAYERS' }
  | { type: 'RESET' };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(
  names: string[],
  seeds: string[],
  imposterCount: number,
  override: CustomOverride,
  excludeIds: number[] = []
): Round {
  let category: string;
  let word: string;
  if (override.enabled && override.word.trim() && override.category.trim()) {
    category = override.category.trim();
    word = override.word.trim();
  } else {
    const picked = pickRandomWord();
    category = picked.category;
    word = picked.word;
  }

  const allIndices = names.map((_, i) => i);
  const filtered = allIndices.filter((i) => !excludeIds.includes(i));
  const pool = filtered.length >= imposterCount ? filtered : allIndices;
  const indices = shuffle(pool).slice(0, imposterCount);
  const imposterSet = new Set(indices);
  const players: Player[] = names.map((name, i) => ({
    id: i,
    name: name.trim() || `Player ${i + 1}`,
    seed: seeds[i],
    isImposter: imposterSet.has(i),
    hasSeenWord: false
  }));

  return {
    category,
    word,
    imposterCount,
    players: shuffle(players),
    currentRevealIndex: 0,
    hostBriefed: false
  };
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LEAVE_SPLASH':
      return { ...state, phase: 'host-setup' };
    case 'SET_HOST_NAME':
      return { ...state, hostName: action.name };
    case 'REROLL_HOST_AVATAR':
      return { ...state, hostSeed: randomSeed() };
    case 'CONTINUE_TO_PLAYERS': {
      const host = state.hostName.trim().toLowerCase();
      const keptIdx = state.playerNames
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => n.trim().toLowerCase() !== host)
        .map(({ i }) => i);
      const names = keptIdx.map((i) => state.playerNames[i]);
      const seeds = keptIdx.map((i) => state.playerSeeds[i]);
      const maxImp = Math.max(1, Math.floor((names.length - 1) / 2));
      return {
        ...state,
        phase: 'players-setup',
        playerNames: names.length >= 2 ? names : state.playerNames,
        playerSeeds: names.length >= 2 ? seeds : state.playerSeeds,
        imposterCount: Math.min(state.imposterCount, maxImp)
      };
    }
    case 'BACK_TO_HOST':
      return { ...state, phase: 'host-setup' };
    case 'SET_PLAYER_NAME': {
      const names = [...state.playerNames];
      names[action.index] = action.name;
      return { ...state, playerNames: names };
    }
    case 'ADD_PLAYER':
      if (state.playerNames.length >= 12) return state;
      return {
        ...state,
        playerNames: [...state.playerNames, ''],
        playerSeeds: [...state.playerSeeds, randomSeed()]
      };
    case 'REMOVE_PLAYER': {
      if (state.playerNames.length <= 2) return state;
      const names = state.playerNames.filter((_, i) => i !== action.index);
      const seeds = state.playerSeeds.filter((_, i) => i !== action.index);
      const maxImp = Math.max(1, Math.floor((names.length - 1) / 2));
      return {
        ...state,
        playerNames: names,
        playerSeeds: seeds,
        imposterCount: Math.min(state.imposterCount, maxImp)
      };
    }
    case 'REROLL_AVATAR': {
      const seeds = [...state.playerSeeds];
      seeds[action.index] = randomSeed();
      return { ...state, playerSeeds: seeds };
    }
    case 'SET_IMPOSTER_COUNT':
      return { ...state, imposterCount: action.count };
    case 'TOGGLE_CUSTOM_OVERRIDE':
      return {
        ...state,
        customOverride: { ...state.customOverride, enabled: !state.customOverride.enabled }
      };
    case 'SET_CUSTOM_CATEGORY':
      return {
        ...state,
        customOverride: { ...state.customOverride, category: action.category }
      };
    case 'SET_CUSTOM_WORD':
      return {
        ...state,
        customOverride: { ...state.customOverride, word: action.word }
      };
    case 'START_ROUND': {
      const round = buildRound(
        state.playerNames,
        state.playerSeeds,
        state.imposterCount,
        state.customOverride,
        state.lastImposterIds
      );
      return {
        ...state,
        phase: 'briefing',
        round,
        lastImposterIds: round.players.filter((p) => p.isImposter).map((p) => p.id)
      };
    }
    case 'MARK_HOST_BRIEFED':
      if (!state.round) return state;
      return { ...state, round: { ...state.round, hostBriefed: true } };
    case 'BEGIN_HANDOFF':
      return { ...state, phase: 'pass-reveal' };
    case 'MARK_REVEALED': {
      if (!state.round) return state;
      const players = state.round.players.map((p) =>
        p.id === action.playerId ? { ...p, hasSeenWord: true } : p
      );
      return { ...state, round: { ...state.round, players } };
    }
    case 'ADVANCE_REVEAL': {
      if (!state.round) return state;
      return {
        ...state,
        round: { ...state.round, currentRevealIndex: state.round.currentRevealIndex + 1 }
      };
    }
    case 'END_ROUND':
      return { ...state, phase: 'end' };
    case 'NEW_ROUND_SAME_PLAYERS': {
      const round = buildRound(
        state.playerNames,
        state.playerSeeds,
        state.imposterCount,
        state.customOverride,
        state.lastImposterIds
      );
      return {
        ...state,
        phase: 'briefing',
        round,
        lastImposterIds: round.players.filter((p) => p.isImposter).map((p) => p.id)
      };
    }
    case 'BACK_TO_PLAYERS':
      return { ...state, phase: 'players-setup', round: null };
    case 'RESET':
      return initialState;
  }
}
