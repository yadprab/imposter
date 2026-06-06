import { Collapse, Group, Stack, Text, Title } from '@mantine/core';
import { IconEye, IconEyeOff, IconHome, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import { useGameStore } from '../game/store';
import type { Role } from '../game/types';

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
  '5. God already knows the mafia — drop clues without getting killed.',
  '6. Mafia wins if they equal/outnumber the town. Town wins if all mafia are out.'
];

const ROLE_LABEL: Record<Role, string> = {
  imposter: 'Imposter',
  crew: 'Crew',
  mafia: 'Mafia',
  doctor: 'Doctor',
  god: 'God',
  villager: 'Villager'
};

const IMPOSTER_ROLE_ORDER: Role[] = ['imposter', 'crew'];
const MAFIA_ROLE_ORDER: Role[] = ['mafia', 'doctor', 'god', 'villager'];

export function EndScreen() {
  const round = useGameStore((s) => s.round);
  const reset = useGameStore((s) => s.reset);
  const nextRoundSetup = useGameStore((s) => s.nextRoundSetup);
  const [showKey, setShowKey] = useState(false);

  if (!round) return null;
  const isMafia = round.mode === 'mafia';
  const instructions = isMafia ? MAFIA_INSTRUCTIONS : IMPOSTER_INSTRUCTIONS;

  const grouped: Record<string, typeof round.players> = {};
  for (const p of round.players) {
    (grouped[p.role] ||= []).push(p);
  }
  const roleOrder = isMafia ? MAFIA_ROLE_ORDER : IMPOSTER_ROLE_ORDER;

  return (
    <Stack gap="lg" style={{ flex: 1 }} mt="md">
      <Stack gap={6} align="center">
        <div className="ribbon">{isMafia ? 'Night falls' : 'Round in play'}</div>
        <Title className="wordmark" style={{ fontSize: 44 }} ta="center" mt="sm">
          PLAY!
        </Title>
        <Text c="white" size="sm" ta="center" maw={320} style={{ opacity: 0.85 }}>
          {isMafia
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
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Stack gap={0}>
              <Text fw={700} c="white" size="lg">Answer key</Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>Host only — don't let players peek</Text>
            </Stack>
            <CandyButton
              color={showKey ? 'orange' : 'violet'}
              size="sm"
              onClick={() => setShowKey((v) => !v)}
              icon={showKey ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            >
              {showKey ? 'Hide' : 'Show'}
            </CandyButton>
          </Group>
          <Collapse in={showKey}>
            <Stack gap="sm" pt="xs">
              {!isMafia && (
                <Stack gap={2}>
                  <Text size="xs" tt="uppercase" fw={800} c="yellow.3" style={{ letterSpacing: '0.2em' }}>
                    {round.category}
                  </Text>
                  <Title order={2} c="white">{round.word}</Title>
                </Stack>
              )}
              {roleOrder.map((role) =>
                grouped[role]?.length ? (
                  <Stack key={role} gap={4}>
                    <Text size="xs" tt="uppercase" fw={800} c="white" style={{ letterSpacing: '0.2em', opacity: 0.85 }}>
                      {ROLE_LABEL[role]}{grouped[role].length > 1 ? 's' : ''}
                    </Text>
                    <Group gap={6} wrap="wrap">
                      {grouped[role].map((p) => (
                        <span
                          key={p.id}
                          className={
                            role === 'imposter' || role === 'mafia'
                              ? 'candy-chip candy-chip--pink'
                              : 'candy-chip'
                          }
                        >
                          <Avatar seed={p.seed} size={22} />
                          <span>{p.name}</span>
                        </span>
                      ))}
                    </Group>
                  </Stack>
                ) : null
              )}
            </Stack>
          </Collapse>
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
          onClick={nextRoundSetup}
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
