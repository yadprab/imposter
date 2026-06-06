import { Collapse, Group, Stack, Switch, Text, Title } from '@mantine/core';
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconDice5,
  IconMinus,
  IconPlayerPlayFilled,
  IconPlus,
  IconRefresh,
  IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton, CandyIconButton } from '../components/CandyButton';
import { manualComplete, useGameStore } from '../game/store';
import type { Role } from '../game/types';

const MANUAL_ROLE_LABEL: Record<string, string> = {
  base: 'Villager',
  mafia: 'Mafia',
  doctor: 'Doctor',
  god: 'God'
};

export function PlayersSetupScreen() {
  const gameMode = useGameStore((s) => s.gameMode);
  const hostName = useGameStore((s) => s.hostName);
  const hostSeed = useGameStore((s) => s.hostSeed);
  const playerNames = useGameStore((s) => s.playerNames);
  const playerSeeds = useGameStore((s) => s.playerSeeds);
  const imposterCount = useGameStore((s) => s.imposterCount);
  const mafiaCount = useGameStore((s) => s.mafiaCount);
  const hasDoctor = useGameStore((s) => s.hasDoctor);
  const hasGod = useGameStore((s) => s.hasGod);
  const customOverride = useGameStore((s) => s.customOverride);
  const manualRoles = useGameStore((s) => s.manualRoles);

  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const removePlayer = useGameStore((s) => s.removePlayer);
  const rerollAvatar = useGameStore((s) => s.rerollAvatar);
  const setImposterCount = useGameStore((s) => s.setImposterCount);
  const setMafiaCount = useGameStore((s) => s.setMafiaCount);
  const toggleDoctor = useGameStore((s) => s.toggleDoctor);
  const toggleGod = useGameStore((s) => s.toggleGod);
  const toggleCustomOverride = useGameStore((s) => s.toggleCustomOverride);
  const setCustomCategory = useGameStore((s) => s.setCustomCategory);
  const setCustomWord = useGameStore((s) => s.setCustomWord);
  const randomizeCustomWord = useGameStore((s) => s.randomizeCustomWord);
  const toggleManualRoles = useGameStore((s) => s.toggleManualRoles);
  const setManualRole = useGameStore((s) => s.setManualRole);
  const startRound = useGameStore((s) => s.startRound);
  const backToHost = useGameStore((s) => s.backToHost);

  const [customOpen, setCustomOpen] = useState(customOverride.enabled);
  const playerCount = playerNames.length;
  const maxImposters = Math.max(1, Math.floor((playerCount - 1) / 2));
  const specialRoles = (hasDoctor ? 1 : 0) + (hasGod ? 1 : 0);
  const maxMafia = Math.max(1, playerCount - 1 - specialRoles);
  const namesFilled = playerNames.every((n) => n.trim().length > 0);
  const customOk =
    gameMode !== 'imposter' ||
    !customOverride.enabled ||
    (customOverride.category.trim().length > 0 && customOverride.word.trim().length > 0);
  const mode = gameMode === 'mafia' ? 'mafia' : 'imposter';
  const manualOk =
    !manualRoles.enabled ||
    manualComplete(mode, manualRoles, imposterCount, mafiaCount, hasDoctor, hasGod);
  const canStart = playerCount >= 3 && namesFilled && customOk && manualOk;
  const gameLabel = gameMode === 'mafia' ? 'MAFIA' : 'IMPOSTER';

  const manualImposterCount = Object.values(manualRoles.byIndex).filter(
    (r) => r === 'imposter'
  ).length;
  const mafiaCycle: (Role | null)[] = [
    null,
    'mafia',
    ...(hasDoctor ? (['doctor'] as Role[]) : []),
    ...(hasGod ? (['god'] as Role[]) : [])
  ];

  function toggleImposterPick(index: number) {
    if (manualRoles.byIndex[index] === 'imposter') {
      setManualRole(index, null);
    } else if (manualImposterCount < imposterCount) {
      setManualRole(index, 'imposter');
    }
  }

  function cycleMafiaRole(index: number) {
    const current = manualRoles.byIndex[index] ?? null;
    const at = mafiaCycle.indexOf(current);
    const next = mafiaCycle[(at + 1) % mafiaCycle.length];
    setManualRole(index, next);
  }

  return (
    <Stack gap="md" style={{ flex: 1 }}>
      <Group justify="space-between" mt="sm" align="center">
        <CandyIconButton color="violet" onClick={backToHost} ariaLabel="back">
          <IconArrowLeft size={20} />
        </CandyIconButton>
        <div className="ribbon">{gameLabel} · 2/2</div>
        <div style={{ width: 48 }} />
      </Group>

      <div className="candy-card">
        <Group gap="sm" align="center">
          <div className="avatar-ring-sm">
            <Avatar seed={hostSeed} size={48} />
          </div>
          <Stack gap={0} style={{ flex: 1 }}>
            <Text size="xs" tt="uppercase" fw={700} c="yellow.3">Host</Text>
            <Text fw={700} size="lg" c="white">{hostName}</Text>
          </Stack>
        </Group>
      </div>

      <Stack gap={2} mt="sm">
        <Title order={2} className="headline">Add the players</Title>
        <Text c="white" size="sm" style={{ opacity: 0.7 }}>3–12 players. Host is not a player.</Text>
      </Stack>

      <div className="candy-card">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={700} c="white" size="lg">Players ({playerCount})</Text>
            <CandyIconButton
              color="green"
              onClick={addPlayer}
              disabled={playerCount >= 12}
              ariaLabel="add player"
            >
              <IconPlus size={22} />
            </CandyIconButton>
          </Group>
          {playerNames.map((name, i) => (
            <Group key={i} gap="xs" wrap="nowrap" align="center">
              <div className="avatar-ring-sm">
                <Avatar
                  seed={playerSeeds[i]}
                  size={44}
                  onClick={() => rerollAvatar(i)}
                  ariaLabel={`reroll avatar ${i + 1}`}
                />
              </div>
              <input
                className="candy-input"
                placeholder={`Player ${i + 1}`}
                value={name}
                onChange={(e) => setPlayerName(i, e.currentTarget.value)}
                style={{ flex: 1, textAlign: 'left', fontSize: 16, padding: '10px 14px' }}
                maxLength={20}
              />
              <CandyIconButton
                color="orange"
                onClick={() => removePlayer(i)}
                disabled={playerCount <= 2}
                ariaLabel="remove player"
              >
                <IconTrash size={18} />
              </CandyIconButton>
            </Group>
          ))}
          <Text c="white" size="xs" ta="center" style={{ opacity: 0.6 }}>
            Tap an avatar to re-roll
          </Text>
        </Stack>
      </div>

      {gameMode === 'imposter' && (
        <div className="candy-card">
          <Group justify="space-between" align="center">
            <Stack gap={0}>
              <Text fw={700} c="white" size="lg">Imposters</Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>How many sneaky ones?</Text>
            </Stack>
            <Counter
              value={imposterCount}
              min={1}
              max={maxImposters}
              onChange={setImposterCount}
              label="imposters"
            />
          </Group>
        </div>
      )}

      {gameMode === 'imposter' && (
        <div className="candy-card">
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text fw={700} c="white" size="lg">Pick imposters myself</Text>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                  {manualRoles.enabled ? `${manualImposterCount} / ${imposterCount} chosen` : 'Off — random draw'}
                </Text>
              </Stack>
              <Switch
                checked={manualRoles.enabled}
                onChange={toggleManualRoles}
                color="pink"
                size="md"
              />
            </Group>
            {manualRoles.enabled && (
              <Group gap="xs" wrap="wrap">
                {playerNames.map((name, i) => {
                  const picked = manualRoles.byIndex[i] === 'imposter';
                  return (
                    <button
                      key={i}
                      type="button"
                      className={picked ? 'role-pick role-pick--on' : 'role-pick'}
                      onClick={() => toggleImposterPick(i)}
                    >
                      <Avatar seed={playerSeeds[i]} size={24} />
                      <span>{name.trim() || `Player ${i + 1}`}</span>
                    </button>
                  );
                })}
              </Group>
            )}
          </Stack>
        </div>
      )}

      {gameMode === 'mafia' && (
        <div className="candy-card">
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text fw={700} c="white" size="lg">Mafia</Text>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>The bad guys</Text>
              </Stack>
              <Counter
                value={mafiaCount}
                min={1}
                max={maxMafia}
                onChange={setMafiaCount}
                label="mafia"
              />
            </Group>
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text fw={700} c="white" size="lg">Doctor</Text>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>Heals one each night</Text>
              </Stack>
              <Switch
                checked={hasDoctor}
                onChange={toggleDoctor}
                color="green"
                size="md"
              />
            </Group>
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text fw={700} c="white" size="lg">God</Text>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>Knows who the mafia are from the start</Text>
              </Stack>
              <Switch
                checked={hasGod}
                onChange={toggleGod}
                color="cyan"
                size="md"
              />
            </Group>
          </Stack>
        </div>
      )}

      {gameMode === 'mafia' && (
        <div className="candy-card">
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text fw={700} c="white" size="lg">Assign roles myself</Text>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                  {manualRoles.enabled ? 'Tap a player to change role' : 'Off — random draw'}
                </Text>
              </Stack>
              <Switch
                checked={manualRoles.enabled}
                onChange={toggleManualRoles}
                color="pink"
                size="md"
              />
            </Group>
            {manualRoles.enabled && (
              <Stack gap="xs">
                <Text size="xs" c="white" style={{ opacity: 0.85 }}>
                  Mafia {Object.values(manualRoles.byIndex).filter((r) => r === 'mafia').length}/{mafiaCount}
                  {hasDoctor && ` · Doctor ${Object.values(manualRoles.byIndex).filter((r) => r === 'doctor').length}/1`}
                  {hasGod && ` · God ${Object.values(manualRoles.byIndex).filter((r) => r === 'god').length}/1`}
                </Text>
                <Group gap="xs" wrap="wrap">
                  {playerNames.map((name, i) => {
                    const role = manualRoles.byIndex[i] ?? null;
                    const key = role ?? 'base';
                    return (
                      <button
                        key={i}
                        type="button"
                        className={role ? 'role-pick role-pick--on' : 'role-pick'}
                        onClick={() => cycleMafiaRole(i)}
                      >
                        <Avatar seed={playerSeeds[i]} size={24} />
                        <span>{name.trim() || `Player ${i + 1}`}</span>
                        <span className="role-pick-tag">{MANUAL_ROLE_LABEL[key]}</span>
                      </button>
                    );
                  })}
                </Group>
              </Stack>
            )}
          </Stack>
        </div>
      )}

      {gameMode === 'imposter' && (
        <div className="candy-card">
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Group gap={6}>
                  <IconDice5 size={18} color="#ffd866" />
                  <Text fw={700} c="white" size="lg">Custom word</Text>
                </Group>
                <Text size="xs" c="white" style={{ opacity: 0.7 }}>Pick your own instead of random</Text>
              </Stack>
              <Group gap="xs">
                <Switch
                  checked={customOverride.enabled}
                  onChange={() => {
                    toggleCustomOverride();
                    setCustomOpen(!customOverride.enabled);
                  }}
                  color="yellow"
                  size="md"
                />
                <CandyIconButton
                  color="violet"
                  onClick={() => setCustomOpen((o) => !o)}
                  ariaLabel="toggle custom panel"
                >
                  {customOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                </CandyIconButton>
              </Group>
            </Group>
            <Collapse in={customOpen}>
              <Stack gap="sm" pt="xs">
                <input
                  className="candy-input"
                  placeholder="Category (e.g. Kollywood movies)"
                  value={customOverride.category}
                  onChange={(e) => setCustomCategory(e.currentTarget.value)}
                  disabled={!customOverride.enabled}
                  style={{ fontSize: 16, padding: '12px 16px' }}
                />
                <input
                  className="candy-input"
                  placeholder="Secret word (e.g. Jailer)"
                  value={customOverride.word}
                  onChange={(e) => setCustomWord(e.currentTarget.value)}
                  disabled={!customOverride.enabled}
                  style={{ fontSize: 16, padding: '12px 16px' }}
                />
                <CandyButton
                  color="yellow"
                  size="sm"
                  icon={<IconRefresh size={16} />}
                  onClick={randomizeCustomWord}
                  disabled={!customOverride.enabled}
                >
                  Surprise me
                </CandyButton>
              </Stack>
            </Collapse>
          </Stack>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <CandyButton
        color="green"
        onClick={startRound}
        disabled={!canStart}
        icon={<IconPlayerPlayFilled size={22} />}
      >
        Start round
      </CandyButton>
      {!canStart && (
        <Text c="white" size="xs" ta="center" style={{ opacity: 0.7 }}>
          {playerCount < 3
            ? 'Need at least 3 players'
            : !namesFilled
              ? 'Fill in all player names'
              : !manualOk
                ? gameMode === 'imposter'
                  ? `Pick exactly ${imposterCount} imposter${imposterCount > 1 ? 's' : ''}`
                  : 'Assign the exact mafia / doctor / god counts'
                : 'Custom word needs both category and word'}
        </Text>
      )}
    </Stack>
  );
}

interface CounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}

function Counter({ value, min, max, onChange, label }: CounterProps) {
  return (
    <Group gap="xs" align="center" wrap="nowrap">
      <CandyIconButton
        color="violet"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        ariaLabel={`decrease ${label}`}
      >
        <IconMinus size={20} />
      </CandyIconButton>
      <div
        style={{
          minWidth: 56,
          height: 48,
          padding: '0 14px',
          borderRadius: 14,
          background: 'linear-gradient(180deg, #2d1b6b, #1f1454)',
          border: '3px solid #6741d9',
          color: 'white',
          fontWeight: 800,
          fontSize: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.4)'
        }}
      >
        {value}
      </div>
      <CandyIconButton
        color="violet"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        ariaLabel={`increase ${label}`}
      >
        <IconPlus size={20} />
      </CandyIconButton>
    </Group>
  );
}
