import { Group, Stack, Text, Title } from '@mantine/core';
import { IconHome, IconRefresh } from '@tabler/icons-react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import { useGameStore } from '../game/store';

const IMPOSTER_INSTRUCTIONS = [
  '1. Each player gives one clue, in turn.',
  '2. Repeat a few rounds. Imposters bluff.',
  '3. Vote out loud. Host announces who\'s ejected.',
  '4. Host reveals if you caught the imposter.'
];

const MAFIA_INSTRUCTIONS = [
  '1. Night: host calls "eyes closed."',
  '2. Mafia opens eyes, silently picks a target.',
  '3. Doctor opens, picks one to save.',
  '4. Day: host announces who (if anyone) died. Discuss and vote out loud.',
  '5. Detective already knows the mafia — drop clues without getting killed.',
  '6. Mafia wins if they equal/outnumber the town. Town wins if all mafia are out.'
];

export function EndScreen() {
  const round = useGameStore((s) => s.round);
  const reset = useGameStore((s) => s.reset);
  const newRoundSamePlayers = useGameStore((s) => s.newRoundSamePlayers);

  if (!round) return null;
  const instructions = round.mode === 'mafia' ? MAFIA_INSTRUCTIONS : IMPOSTER_INSTRUCTIONS;

  return (
    <Stack gap="lg" style={{ flex: 1 }} mt="md">
      <Stack gap={6} align="center">
        <div className="ribbon">{round.mode === 'mafia' ? 'Night falls' : 'Round in play'}</div>
        <Title className="wordmark" style={{ fontSize: 44 }} ta="center" mt="sm">
          PLAY!
        </Title>
        <Text c="white" size="sm" ta="center" maw={320} style={{ opacity: 0.85 }}>
          {round.mode === 'mafia'
            ? 'Host moderates the night/day phases out loud. Game knows nothing — you run it.'
            : 'Discuss out loud, drop clues, then vote together. The host knows the truth.'}
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
          {instructions.map((line) => (
            <Text key={line} size="sm" c="white">{line}</Text>
          ))}
        </Stack>
      </div>

      <div style={{ flex: 1 }} />

      <Stack gap="sm">
        <CandyButton
          color="green"
          onClick={newRoundSamePlayers}
          icon={<IconRefresh size={20} />}
        >
          Next round
        </CandyButton>
        <CandyButton
          color="violet"
          onClick={reset}
          icon={<IconHome size={20} />}
        >
          New game
        </CandyButton>
      </Stack>
    </Stack>
  );
}
