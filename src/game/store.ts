import { create } from 'zustand';
import { randomSeed } from '../components/Avatar';
import type {
  CustomOverride,
  GameMode,
  GameState,
  Player,
  Role,
  Round
} from './types';
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

function makeInitialState(): GameState {
  return {
    phase: 'splash',
    gameMode: null,
    hostName: '',
    hostSeed: randomSeed(),
    playerNames: [...DEFAULT_PLAYERS],
    playerSeeds: DEFAULT_PLAYERS.map(() => randomSeed()),
    imposterCount: 1,
    mafiaCount: 1,
    hasDoctor: true,
    hasDetective: true,
    customOverride: { enabled: true, category: '', word: '' },
    lastImposterIds: [],
    removedByHostFilter: null,
    round: null
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface BuildArgs {
  mode: GameMode;
  names: string[];
  seeds: string[];
  imposterCount: number;
  mafiaCount: number;
  hasDoctor: boolean;
  hasDetective: boolean;
  override: CustomOverride;
  excludeIds?: number[];
}

function buildRound({
  mode,
  names,
  seeds,
  imposterCount,
  mafiaCount,
  hasDoctor,
  hasDetective,
  override,
  excludeIds = []
}: BuildArgs): Round {
  let category = '';
  let word = '';
  if (mode === 'imposter') {
    if (override.enabled && override.word.trim() && override.category.trim()) {
      category = override.category.trim();
      word = override.word.trim();
    } else {
      const picked = pickRandomWord();
      category = picked.category;
      word = picked.word;
    }
  }

  const allIndices = names.map((_, i) => i);
  const filtered = allIndices.filter((i) => !excludeIds.includes(i));
  const usable = filtered.length >= 1 ? filtered : allIndices;
  const shuffledIdx = shuffle(usable);

  const roleByIdx = new Map<number, Role>();
  if (mode === 'imposter') {
    const imposters = shuffledIdx.slice(0, imposterCount);
    for (const i of imposters) roleByIdx.set(i, 'imposter');
    for (const i of allIndices) if (!roleByIdx.has(i)) roleByIdx.set(i, 'crew');
  } else {
    let cursor = 0;
    const take = (n: number, role: Role) => {
      const slice = shuffledIdx.slice(cursor, cursor + n);
      for (const i of slice) roleByIdx.set(i, role);
      cursor += n;
    };
    take(mafiaCount, 'mafia');
    if (hasDoctor) take(1, 'doctor');
    if (hasDetective) take(1, 'detective');
    for (const i of allIndices) if (!roleByIdx.has(i)) roleByIdx.set(i, 'villager');
  }

  const players: Player[] = names.map((name, i) => ({
    id: i,
    name: name.trim() || `Player ${i + 1}`,
    seed: seeds[i],
    role: roleByIdx.get(i) ?? (mode === 'imposter' ? 'crew' : 'villager'),
    hasSeenWord: false
  }));

  return {
    mode,
    category,
    word,
    players: shuffle(players),
    currentRevealIndex: 0,
    hostBriefed: false
  };
}

interface GameStore extends GameState {
  leaveSplash: () => void;
  backToHome: () => void;
  selectGameMode: (mode: GameMode) => void;

  setHostName: (name: string) => void;
  rerollHostAvatar: () => void;
  continueToPlayers: () => void;
  backToHost: () => void;

  setPlayerName: (index: number, name: string) => void;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  rerollAvatar: (index: number) => void;

  setImposterCount: (count: number) => void;
  setMafiaCount: (count: number) => void;
  toggleDoctor: () => void;
  toggleDetective: () => void;

  toggleCustomOverride: () => void;
  setCustomCategory: (category: string) => void;
  setCustomWord: (word: string) => void;
  randomizeCustomWord: () => void;

  startRound: () => void;
  markHostBriefed: () => void;
  beginHandoff: () => void;
  markRevealed: (playerId: number) => void;
  advanceReveal: () => void;
  endRound: () => void;
  newRoundSamePlayers: () => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...makeInitialState(),

  leaveSplash: () => set({ phase: 'home' }),
  backToHome: () => set({ phase: 'home', gameMode: null, round: null, lastImposterIds: [] }),
  selectGameMode: (mode) => set({ gameMode: mode, phase: 'host-setup' }),

  setHostName: (name) => set({ hostName: name }),
  rerollHostAvatar: () => set({ hostSeed: randomSeed() }),

  continueToPlayers: () => {
    const state = get();
    const host = state.hostName.trim().toLowerCase();
    const matchIdx = state.playerNames.findIndex(
      (n) => n.trim().toLowerCase() === host && host.length > 0
    );
    if (matchIdx < 0) {
      set({ phase: 'players-setup', removedByHostFilter: null });
      return;
    }
    const names = state.playerNames.filter((_, i) => i !== matchIdx);
    const seeds = state.playerSeeds.filter((_, i) => i !== matchIdx);
    if (names.length < 2) {
      set({ phase: 'players-setup', removedByHostFilter: null });
      return;
    }
    const maxImp = Math.max(1, Math.floor((names.length - 1) / 2));
    set({
      phase: 'players-setup',
      playerNames: names,
      playerSeeds: seeds,
      imposterCount: Math.min(state.imposterCount, maxImp),
      removedByHostFilter: {
        name: state.playerNames[matchIdx],
        seed: state.playerSeeds[matchIdx]
      },
      lastImposterIds: []
    });
  },

  backToHost: () => {
    const state = get();
    if (state.removedByHostFilter) {
      set({
        phase: 'host-setup',
        playerNames: [...state.playerNames, state.removedByHostFilter.name],
        playerSeeds: [...state.playerSeeds, state.removedByHostFilter.seed],
        removedByHostFilter: null,
        lastImposterIds: []
      });
      return;
    }
    set({ phase: 'host-setup' });
  },

  setPlayerName: (index, name) => {
    const names = [...get().playerNames];
    names[index] = name;
    set({ playerNames: names });
  },

  addPlayer: () => {
    const { playerNames, playerSeeds } = get();
    if (playerNames.length >= 12) return;
    set({
      playerNames: [...playerNames, ''],
      playerSeeds: [...playerSeeds, randomSeed()]
    });
  },

  removePlayer: (index) => {
    const state = get();
    if (state.playerNames.length <= 2) return;
    if (index < 0 || index >= state.playerNames.length) return;
    const names = state.playerNames.filter((_, i) => i !== index);
    const seeds = state.playerSeeds.filter((_, i) => i !== index);
    const maxImp = Math.max(1, Math.floor((names.length - 1) / 2));
    set({
      playerNames: names,
      playerSeeds: seeds,
      imposterCount: Math.min(state.imposterCount, maxImp),
      lastImposterIds: []
    });
  },

  rerollAvatar: (index) => {
    const seeds = [...get().playerSeeds];
    seeds[index] = randomSeed();
    set({ playerSeeds: seeds });
  },

  setImposterCount: (count) => set({ imposterCount: count }),
  setMafiaCount: (count) => set({ mafiaCount: count }),
  toggleDoctor: () => set({ hasDoctor: !get().hasDoctor }),
  toggleDetective: () => set({ hasDetective: !get().hasDetective }),

  toggleCustomOverride: () =>
    set({
      customOverride: { ...get().customOverride, enabled: !get().customOverride.enabled }
    }),
  setCustomCategory: (category) =>
    set({ customOverride: { ...get().customOverride, category } }),
  setCustomWord: (word) => set({ customOverride: { ...get().customOverride, word } }),
  randomizeCustomWord: () => {
    const picked = pickRandomWord();
    set({
      customOverride: { enabled: true, category: picked.category, word: picked.word }
    });
  },

  startRound: () => {
    const state = get();
    if (!state.gameMode) return;
    const round = buildRound({
      mode: state.gameMode,
      names: state.playerNames,
      seeds: state.playerSeeds,
      imposterCount: state.imposterCount,
      mafiaCount: state.mafiaCount,
      hasDoctor: state.hasDoctor,
      hasDetective: state.hasDetective,
      override: state.customOverride,
      excludeIds: state.lastImposterIds
    });
    const consumed =
      state.gameMode === 'imposter' &&
      state.customOverride.enabled &&
      state.customOverride.word.trim().length > 0 &&
      state.customOverride.category.trim().length > 0;
    set({
      phase: 'briefing',
      round,
      lastImposterIds:
        state.gameMode === 'imposter'
          ? round.players.filter((p) => p.role === 'imposter').map((p) => p.id)
          : [],
      customOverride: consumed
        ? { ...state.customOverride, word: '', category: '' }
        : state.customOverride
    });
  },

  markHostBriefed: () => {
    const round = get().round;
    if (!round) return;
    set({ round: { ...round, hostBriefed: true } });
  },

  beginHandoff: () => set({ phase: 'pass-reveal' }),

  markRevealed: (playerId) => {
    const round = get().round;
    if (!round) return;
    const players = round.players.map((p) =>
      p.id === playerId ? { ...p, hasSeenWord: true } : p
    );
    set({ round: { ...round, players } });
  },

  advanceReveal: () => {
    const round = get().round;
    if (!round) return;
    set({ round: { ...round, currentRevealIndex: round.currentRevealIndex + 1 } });
  },

  endRound: () => set({ phase: 'end' }),

  newRoundSamePlayers: () => {
    const state = get();
    if (!state.gameMode) return;
    const round = buildRound({
      mode: state.gameMode,
      names: state.playerNames,
      seeds: state.playerSeeds,
      imposterCount: state.imposterCount,
      mafiaCount: state.mafiaCount,
      hasDoctor: state.hasDoctor,
      hasDetective: state.hasDetective,
      override: state.customOverride,
      excludeIds: state.lastImposterIds
    });
    const consumed =
      state.gameMode === 'imposter' &&
      state.customOverride.enabled &&
      state.customOverride.word.trim().length > 0 &&
      state.customOverride.category.trim().length > 0;
    set({
      phase: 'briefing',
      round,
      lastImposterIds:
        state.gameMode === 'imposter'
          ? round.players.filter((p) => p.role === 'imposter').map((p) => p.id)
          : [],
      customOverride: consumed
        ? { ...state.customOverride, word: '', category: '' }
        : state.customOverride
    });
  },

  reset: () => set(makeInitialState())
}));
