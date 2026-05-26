import { Group, Stack, Text, Title } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import { ScratchCard } from '../components/ScratchCard';
import { useGameStore } from '../game/store';
import type { Role } from '../game/types';

const ROLE_CHIP_CLASS: Record<Role, string> = {
  imposter: 'candy-chip candy-chip--pink',
  crew: 'candy-chip',
  mafia: 'candy-chip candy-chip--pink',
  doctor: 'candy-chip',
  god: 'candy-chip',
  villager: 'candy-chip'
};

const ROLE_LABEL: Record<Role, string> = {
  imposter: 'Imposter',
  crew: 'Crew',
  mafia: 'Mafia',
  doctor: 'Doctor',
  god: 'God',
  villager: 'Villager'
};

export function BriefingScreen() {
  const round = useGameStore((s) => s.round);
  const hostName = useGameStore((s) => s.hostName);
  const markHostBriefed = useGameStore((s) => s.markHostBriefed);
  const beginHandoff = useGameStore((s) => s.beginHandoff);
  const [revealed, setRevealed] = useState(false);

  if (!round) return null;
  const currentRound = round;

  function onReveal() {
    setRevealed(true);
    if (!currentRound.hostBriefed) markHostBriefed();
  }

  const isImposter = round.mode === 'imposter';
  const groupedRoles: Record<string, typeof round.players> = {};
  for (const p of round.players) {
    if (!groupedRoles[p.role]) groupedRoles[p.role] = [];
    groupedRoles[p.role].push(p);
  }
  const roleOrder: Role[] = isImposter
    ? ['imposter']
    : ['mafia', 'doctor', 'god', 'villager'];

  return (
    <Stack gap="lg" style={{ flex: 1 }}>
      <Stack gap={6} align="center" mt="md">
        <div className="ribbon">Host briefing</div>
        <Title order={2} className="headline" ta="center" mt="xs">
          For {hostName}'s eyes only
        </Title>
        <Text c="white" size="sm" ta="center" maw={320} style={{ opacity: 0.8 }}>
          Scratch to see {isImposter ? 'the word and who\'s the imposter' : 'who plays what'}. Don't let anyone watch.
        </Text>
      </Stack>

      <ScratchCard
        key={round.players.map((p) => `${p.id}:${p.role}`).join(',')}
        cardClassName="host-secret-card"
        onReveal={onReveal}
      >
        <Stack gap="sm" align="center" w="100%">
          {isImposter ? (
            <>
              <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
                Category
              </Text>
              <Title order={3} style={{ color: '#3d1f00' }}>{round.category}</Title>
              <Text size="xs" tt="uppercase" fw={800} mt="sm" style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
                Secret word
              </Text>
              <Title order={1} style={{ fontSize: 38, color: '#3d1f00' }} ta="center">
                {round.word}
              </Title>
              <Text size="xs" tt="uppercase" fw={800} mt="sm" style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
                {groupedRoles.imposter && groupedRoles.imposter.length > 1 ? 'Imposters' : 'Imposter'}
              </Text>
              <Group justify="center" gap={8} wrap="wrap">
                {groupedRoles.imposter?.map((p) => (
                  <span key={p.id} className="candy-chip candy-chip--pink">
                    <Avatar seed={p.seed} size={24} />
                    <span>{p.name}</span>
                  </span>
                ))}
              </Group>
            </>
          ) : (
            <Stack gap="sm" w="100%">
              {roleOrder.map((role) =>
                groupedRoles[role] && groupedRoles[role].length > 0 ? (
                  <Stack key={role} gap={4}>
                    <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
                      {ROLE_LABEL[role]}{groupedRoles[role].length > 1 ? 's' : ''}
                    </Text>
                    <Group gap={6} wrap="wrap">
                      {groupedRoles[role].map((p) => (
                        <span key={p.id} className={ROLE_CHIP_CLASS[role]}>
                          <Avatar seed={p.seed} size={22} />
                          <span>{p.name}</span>
                        </span>
                      ))}
                    </Group>
                  </Stack>
                ) : null
              )}
            </Stack>
          )}
        </Stack>
      </ScratchCard>

      <div style={{ flex: 1 }} />

      <div className={revealed ? 'cta-bounce' : ''}>
        <CandyButton
          color="green"
          onClick={beginHandoff}
          disabled={!round.hostBriefed}
          icon={<IconEye size={22} />}
        >
          Start handing out
        </CandyButton>
      </div>
      {!round.hostBriefed && (
        <Text c="white" size="xs" ta="center" style={{ opacity: 0.7 }}>
          Scratch the card first
        </Text>
      )}
    </Stack>
  );
}
