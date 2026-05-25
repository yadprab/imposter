import { Group, Stack, Text, Title } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import { ScratchCard } from '../components/ScratchCard';
import type { Action } from '../game/state';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

export function BriefingScreen({ state, dispatch }: Props) {
  const [revealed, setRevealed] = useState(false);
  if (!state.round) return null;
  const round = state.round;
  const imposters = round.players.filter((p) => p.isImposter);

  function onReveal() {
    setRevealed(true);
    if (!round.hostBriefed) dispatch({ type: 'MARK_HOST_BRIEFED' });
  }

  return (
    <Stack gap="lg" style={{ flex: 1 }}>
      <Stack gap={6} align="center" mt="md">
        <div className="ribbon">Host briefing</div>
        <Title order={2} className="headline" ta="center" mt="xs">
          For {state.hostName}'s eyes only
        </Title>
        <Text c="white" size="sm" ta="center" maw={320} style={{ opacity: 0.8 }}>
          Scratch the card to see the word and who's the imposter. Don't let anyone watch.
        </Text>
      </Stack>

      <ScratchCard
        key={round.players.map((p) => p.id).join(',')}
        cardClassName="host-secret-card"
        hint="SCRATCH TO REVEAL"
        surfaceFrom="#8957e5"
        surfaceTo="#3a1a8a"
        hintColor="#ffd866"
        onReveal={onReveal}
      >
        <Stack gap="sm" align="center" w="100%">
          <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
            Category
          </Text>
          <Title order={3} style={{ color: '#3d1f00' }}>{round.category}</Title>
          <Text size="xs" tt="uppercase" fw={800} mt="sm" style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
            Secret word
          </Text>
          <Title order={1} style={{ fontSize: 42, color: '#3d1f00' }} ta="center">
            {round.word}
          </Title>
          <Text size="xs" tt="uppercase" fw={800} mt="sm" style={{ letterSpacing: '0.2em', color: '#7a3d00' }}>
            {imposters.length > 1 ? 'Imposters' : 'Imposter'}
          </Text>
          <Group justify="center" gap={8} wrap="wrap">
            {imposters.map((p) => (
              <span key={p.id} className="candy-chip candy-chip--pink">
                <Avatar seed={p.seed} size={24} />
                <span>{p.name}</span>
              </span>
            ))}
          </Group>
        </Stack>
      </ScratchCard>

      <div style={{ flex: 1 }} />

      <div className={revealed ? 'cta-bounce' : ''}>
        <CandyButton
          color="green"
          onClick={() => dispatch({ type: 'BEGIN_HANDOFF' })}
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
