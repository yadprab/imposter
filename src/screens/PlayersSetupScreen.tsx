import { Collapse, Group, NumberInput, Stack, Switch, Text, Title } from '@mantine/core';
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconDice5,
  IconPlayerPlayFilled,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton, CandyIconButton } from '../components/CandyButton';
import type { Action } from '../game/state';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

export function PlayersSetupScreen({ state, dispatch }: Props) {
  const [customOpen, setCustomOpen] = useState(state.customOverride.enabled);
  const playerCount = state.playerNames.length;
  const maxImposters = Math.max(1, Math.floor((playerCount - 1) / 2));
  const namesFilled = state.playerNames.every((n) => n.trim().length > 0);
  const customOk =
    !state.customOverride.enabled ||
    (state.customOverride.category.trim().length > 0 && state.customOverride.word.trim().length > 0);
  const canStart = playerCount >= 3 && namesFilled && customOk;

  return (
    <Stack gap="md" style={{ flex: 1 }}>
      <Group justify="space-between" mt="sm" align="center">
        <CandyIconButton
          color="violet"
          onClick={() => dispatch({ type: 'BACK_TO_HOST' })}
          ariaLabel="back"
        >
          <IconArrowLeft size={20} />
        </CandyIconButton>
        <div className="ribbon">Step 2 of 2</div>
        <div style={{ width: 48 }} />
      </Group>

      <div className="candy-card">
        <Group gap="sm" align="center">
          <div className="avatar-ring-sm">
            <Avatar seed={state.hostSeed} size={48} />
          </div>
          <Stack gap={0} style={{ flex: 1 }}>
            <Text size="xs" tt="uppercase" fw={700} c="yellow.3">Host</Text>
            <Text fw={700} size="lg" c="white">{state.hostName}</Text>
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
              onClick={() => dispatch({ type: 'ADD_PLAYER' })}
              disabled={playerCount >= 12}
              ariaLabel="add player"
            >
              <IconPlus size={22} />
            </CandyIconButton>
          </Group>
          {state.playerNames.map((name, i) => (
            <Group key={i} gap="xs" wrap="nowrap" align="center">
              <div className="avatar-ring-sm">
                <Avatar
                  seed={state.playerSeeds[i]}
                  size={44}
                  onClick={() => dispatch({ type: 'REROLL_AVATAR', index: i })}
                  ariaLabel={`reroll avatar ${i + 1}`}
                />
              </div>
              <input
                className="candy-input"
                placeholder={`Player ${i + 1}`}
                value={name}
                onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', index: i, name: e.currentTarget.value })}
                style={{ flex: 1, textAlign: 'left', fontSize: 16, padding: '10px 14px' }}
                maxLength={20}
              />
              <CandyIconButton
                color="orange"
                onClick={() => dispatch({ type: 'REMOVE_PLAYER', index: i })}
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

      <div className="candy-card">
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Text fw={700} c="white" size="lg">Imposters</Text>
            <Text size="xs" c="white" style={{ opacity: 0.7 }}>How many sneaky ones?</Text>
          </Stack>
          <NumberInput
            value={state.imposterCount}
            onChange={(v) =>
              dispatch({
                type: 'SET_IMPOSTER_COUNT',
                count: Math.max(1, Math.min(maxImposters, Number(v) || 1))
              })
            }
            min={1}
            max={maxImposters}
            w={90}
            size="md"
            radius="xl"
            styles={{ input: { fontWeight: 700, textAlign: 'center', fontSize: 18 } }}
          />
        </Group>
      </div>

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
                checked={state.customOverride.enabled}
                onChange={() => {
                  dispatch({ type: 'TOGGLE_CUSTOM_OVERRIDE' });
                  setCustomOpen(!state.customOverride.enabled);
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
                value={state.customOverride.category}
                onChange={(e) =>
                  dispatch({ type: 'SET_CUSTOM_CATEGORY', category: e.currentTarget.value })
                }
                disabled={!state.customOverride.enabled}
                style={{ fontSize: 16, padding: '12px 16px' }}
              />
              <input
                className="candy-input"
                placeholder="Secret word (e.g. Jailer)"
                value={state.customOverride.word}
                onChange={(e) => dispatch({ type: 'SET_CUSTOM_WORD', word: e.currentTarget.value })}
                disabled={!state.customOverride.enabled}
                style={{ fontSize: 16, padding: '12px 16px' }}
              />
            </Stack>
          </Collapse>
        </Stack>
      </div>

      <div style={{ flex: 1 }} />

      <CandyButton
        color="green"
        onClick={() => dispatch({ type: 'START_ROUND' })}
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
              : 'Custom word needs both category and word'}
        </Text>
      )}
    </Stack>
  );
}
