import { Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconHome, IconRefresh } from '@tabler/icons-react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import type { Action } from '../game/state';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

export function EndScreen({ state, dispatch }: Props) {
  if (!state.round) return null;
  const round = state.round;

  return (
    <Stack gap="lg" style={{ flex: 1 }} mt="md">
      <Stack gap={6} align="center">
        <div className="ribbon">Round in play</div>
        <Title className="wordmark" style={{ fontSize: 44 }} ta="center" mt="sm">
          PLAY!
        </Title>
        <Text c="white" size="sm" ta="center" maw={320} style={{ opacity: 0.85 }}>
          Discuss out loud, drop clues, then vote together. The host knows the truth.
        </Text>
      </Stack>

      <div className="candy-card">
        <Stack gap="sm">
          <Text size="xs" tt="uppercase" fw={800} c="yellow.3" style={{ letterSpacing: '0.2em' }}>
            In play
          </Text>
          <Group gap="xs" wrap="wrap">
            {round.players.map((p) => (
              <span key={p.id} className="candy-chip">
                <Avatar seed={p.seed} size={26} />
                <span>{p.name}</span>
              </span>
            ))}
          </Group>
        </Stack>
      </div>

      <div className="candy-card">
        <Stack gap="xs">
          <Text size="xs" tt="uppercase" fw={800} c="yellow.3" style={{ letterSpacing: '0.2em' }}>
            How to play
          </Text>
          <Text size="sm" c="white">1. Each player gives one clue, in turn.</Text>
          <Text size="sm" c="white">2. Repeat a few rounds. Imposters bluff.</Text>
          <Text size="sm" c="white">3. Vote out loud. Host announces who's ejected.</Text>
          <Text size="sm" c="white">4. Host reveals if you caught the imposter.</Text>
        </Stack>
      </div>

      <div style={{ flex: 1 }} />

      <SimpleGrid cols={2} spacing="sm">
        <CandyButton
          color="violet"
          onClick={() => dispatch({ type: 'RESET' })}
          icon={<IconHome size={20} />}
        >
          New game
        </CandyButton>
        <CandyButton
          color="green"
          onClick={() => dispatch({ type: 'NEW_ROUND_SAME_PLAYERS' })}
          icon={<IconRefresh size={20} />}
        >
          Next round
        </CandyButton>
      </SimpleGrid>
    </Stack>
  );
}
