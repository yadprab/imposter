import { create } from 'zustand';
import { randomSeed } from '../components/Avatar';
import type {
  CustomOverride,
  GameMode,
  GameState,
  ManualRoles,
  Player,
  Role,
  Round
} from './types';
import { pickRandomWord } from './words';

const HISTORY_KEY = 'crm-trip-villain-history';

function nameKey(name: string): string {
  return name.trim().toLowerCase();
}

function loadHistory(): Record<string, number> {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveHistory(history: Record<string, number>) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

function chooseVillains(
  candidates: number[],
  count: number,
  names: string[],
  history: Record<string, number>
): number[] {
  const pool = [...candidates];
  const chosen: number[] = [];
  while (chosen.length < count && pool.length > 0) {
    const counts = pool.map((i) => history[nameKey(names[i])] ?? 0);
    const minCount = Math.min(...counts);
    const tier = pool.filter((i) => (history[nameKey(names[i])] ?? 0) === minCount);
    const pick = tier[Math.floor(Math.random() * tier.length)];
    chosen.push(pick);
    pool.splice(pool.indexOf(pick), 1);
  }
  return chosen;
}

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
    hasGod: true,
    customOverride: { enabled: true, category: '', word: '' },
    manualRoles: { enabled: false, byIndex: {} },
    imposterHistory: loadHistory(),
    lastImposterIds: [],
    removedByHostFilter: null,
    round: null
  };
}

export function manualComplete(
  mode: GameMode,
  manual: ManualRoles,
  imposterCount: number,
  mafiaCount: number,
  hasDoctor: boolean,
  hasGod: boolean
): boolean {
  if (!manual.enabled) return false;
  const roles = Object.values(manual.byIndex);
  const count = (r: Role) => roles.filter((x) => x === r).length;
  if (mode === 'imposter') {
    return count('imposter') === imposterCount && roles.length === imposterCount;
  }
  return (
    count('mafia') === mafiaCount &&
    count('doctor') === (hasDoctor ? 1 : 0) &&
    count('god') === (hasGod ? 1 : 0)
  );
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
  hasGod: boolean;
  override: CustomOverride;
  manual: ManualRoles;
  history: Record<string, number>;
  excludeIds?: number[];
}

function buildRound({
  mode,
  names,
  seeds,
  imposterCount,
  mafiaCount,
  hasDoctor,
  hasGod,
  override,
  manual,
  history,
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
  const baseRole: Role = mode === 'imposter' ? 'crew' : 'villager';
  const roleByIdx = new Map<number, Role>();

  if (manualComplete(mode, manual, imposterCount, mafiaCount, hasDoctor, hasGod)) {
    for (const [idx, role] of Object.entries(manual.byIndex)) {
      roleByIdx.set(Number(idx), role);
    }
    for (const i of allIndices) if (!roleByIdx.has(i)) roleByIdx.set(i, baseRole);
  } else {
    const villainCount = mode === 'imposter' ? imposterCount : mafiaCount;
    const hasEnough = allIndices.length - excludeIds.length >= villainCount;
    const villainCandidates = hasEnough
      ? allIndices.filter((i) => !excludeIds.includes(i))
      : allIndices;
    const villains = chooseVillains(villainCandidates, villainCount, names, history);
    const villainRole: Role = mode === 'imposter' ? 'imposter' : 'mafia';
    for (const i of villains) roleByIdx.set(i, villainRole);

    if (mode === 'imposter') {
      for (const i of allIndices) if (!roleByIdx.has(i)) roleByIdx.set(i, 'crew');
    } else {
      const remaining = shuffle(allIndices.filter((i) => !roleByIdx.has(i)));
      let cursor = 0;
      if (hasDoctor && cursor < remaining.length) roleByIdx.set(remaining[cursor++], 'doctor');
      if (hasGod && cursor < remaining.length) roleByIdx.set(remaining[cursor++], 'god');
      for (const i of allIndices) if (!roleByIdx.has(i)) roleByIdx.set(i, 'villager');
    }
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
  toggleGod: () => void;

  toggleCustomOverride: () => void;
  setCustomCategory: (category: string) => void;
  setCustomWord: (word: string) => void;
  randomizeCustomWord: () => void;

  toggleManualRoles: () => void;
  setManualRole: (index: number, role: Role | null) => void;

  startRound: () => void;
  markHostBriefed: () => void;
  beginHandoff: () => void;
  markRevealed: (playerId: number) => void;
  advanceReveal: () => void;
  endRound: () => void;
  nextRoundSetup: () => void;
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
      playerSeeds: [...playerSeeds, randomSeed()],
      manualRoles: { enabled: false, byIndex: {} }
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
      manualRoles: { enabled: false, byIndex: {} },
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
  toggleGod: () => set({ hasGod: !get().hasGod }),

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

  toggleManualRoles: () => {
    const manual = get().manualRoles;
    set({ manualRoles: { enabled: !manual.enabled, byIndex: {} } });
  },

  setManualRole: (index, role) => {
    const byIndex = { ...get().manualRoles.byIndex };
    if (role === null) {
      delete byIndex[index];
    } else {
      byIndex[index] = role;
    }
    set({ manualRoles: { enabled: true, byIndex } });
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
      hasGod: state.hasGod,
      override: state.customOverride,
      manual: state.manualRoles,
      history: state.imposterHistory,
      excludeIds: state.lastImposterIds
    });
    const villainRole = state.gameMode === 'imposter' ? 'imposter' : 'mafia';
    const villains = round.players.filter((p) => p.role === villainRole);
    const history = { ...state.imposterHistory };
    for (const v of villains) {
      const key = nameKey(v.name);
      history[key] = (history[key] ?? 0) + 1;
    }
    saveHistory(history);
    const consumed =
      state.gameMode === 'imposter' &&
      state.customOverride.enabled &&
      state.customOverride.word.trim().length > 0 &&
      state.customOverride.category.trim().length > 0;
    set({
      phase: 'briefing',
      round,
      imposterHistory: history,
      lastImposterIds: villains.map((p) => p.id),
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

  nextRoundSetup: () => set({ phase: 'players-setup', round: null }),

  reset: () => set(makeInitialState())
}));
