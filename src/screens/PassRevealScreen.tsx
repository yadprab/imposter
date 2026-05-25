import { Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight, IconUserOff } from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import { VillainMask } from '../components/icons';
import { ScratchCard } from '../components/ScratchCard';
import type { Action } from '../game/state';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

type Stage = 'pass' | 'reveal';

export function PassRevealScreen({ state, dispatch }: Props) {
  const [stage, setStage] = useState<Stage>('pass');
  const [revealed, setRevealed] = useState(false);

  if (!state.round) return null;
  const round = state.round;
  const player = round.players[round.currentRevealIndex];
  const isLast = round.currentRevealIndex === round.players.length - 1;
  const nextPlayer = !isLast ? round.players[round.currentRevealIndex + 1] : null;
  const progress = ((round.currentRevealIndex + (stage === 'reveal' ? 0.5 : 0)) / round.players.length) * 100;

  function onReveal() {
    setRevealed(true);
    if (!player.hasSeenWord) {
      dispatch({ type: 'MARK_REVEALED', playerId: player.id });
    }
  }
  function next() {
    if (isLast) {
      dispatch({ type: 'END_ROUND' });
    } else {
      dispatch({ type: 'ADVANCE_REVEAL' });
      setStage('pass');
      setRevealed(false);
    }
  }

  return (
    <Stack gap="md" style={{ flex: 1 }}>
      <Stack gap={6} mt="sm">
        <Group justify="space-between" align="center">
          <Text className="tagline">
            {round.currentRevealIndex + 1} of {round.players.length}
          </Text>
          <span className="candy-chip">{round.category}</span>
        </Group>
        <div className="candy-progress">
          <div className="candy-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </Stack>

      {stage === 'pass' ? (
        <Stack gap="lg" align="center" justify="center" style={{ flex: 1 }}>
          <div className="ribbon">Pass to</div>
          <div className="hero-avatar-ring">
            <Avatar seed={player.seed} size={150} />
          </div>
          <Title order={1} className="wordmark" style={{ fontSize: 'clamp(36px, 12vw, 52px)' }} ta="center">
            {player.name.toUpperCase()}
          </Title>
          <Text c="white" size="xs" ta="center" maw={300} style={{ opacity: 0.75 }}>
            Make sure no one else can see the screen
          </Text>
          <div className="cta-bounce">
            <CandyButton color="pink" onClick={() => setStage('reveal')}>
              I'm {player.name}
            </CandyButton>
          </div>
        </Stack>
      ) : (
        <Stack gap="md" align="center" style={{ flex: 1 }}>
          <span className="candy-chip">
            <Avatar seed={player.seed} size={28} />
            <span>{player.name}</span>
          </span>

          <ScratchCard
            key={player.id}
            cardClassName={player.isImposter ? 'imposter-villain' : 'crew-card'}
            hint={player.isImposter ? 'SCRATCH IF YOU DARE' : 'SCRATCH TO REVEAL'}
            surfaceFrom={player.isImposter ? '#3a0612' : '#8957e5'}
            surfaceTo={player.isImposter ? '#1a0207' : '#3a1a8a'}
            hintColor={player.isImposter ? '#ff4d6d' : '#ffd866'}
            onReveal={onReveal}
            minHeight={360}
          >
            {player.isImposter ? (
              <Stack gap="xs" align="center" className="villain-content">
                <div className="villain-mask">
                  <VillainMask size={64} />
                </div>
                <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.3em', color: '#ffb3c1' }}>
                  you are the
                </Text>
                <Title className="imposter-text" style={{ fontSize: 48, lineHeight: 1 }} ta="center">
                  IMPOSTER
                </Title>
                <span className="candy-chip candy-chip--pink" style={{ marginTop: 4 }}>
                  <IconUserOff size={14} />
                  <span>category only</span>
                </span>
                <Text size="lg" fw={700} mt={6} c="white">
                  {round.category}
                </Text>
                <Text size="xs" c="white" ta="center" maw={240} mt="sm" style={{ opacity: 0.85, fontStyle: 'italic' }}>
                  Deceive. Bluff. Don't get caught.
                </Text>
              </Stack>
            ) : (
              <Stack gap="sm" align="center">
                <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.95)' }}>
                  {round.category}
                </Text>
                <Title order={1} style={{ fontSize: 52, color: 'white' }} ta="center">
                  {round.word}
                </Title>
                <Text size="sm" mt="sm" c="white" style={{ opacity: 0.9 }}>
                  Don't say the word directly!
                </Text>
              </Stack>
            )}
          </ScratchCard>

          <div className={revealed ? 'cta-bounce' : ''}>
            <CandyButton
              color={revealed ? (isLast ? 'green' : 'pink') : 'violet'}
              onClick={next}
              disabled={!revealed}
              rightIcon={<IconArrowRight size={22} />}
            >
              {isLast ? 'Done — start playing' : `Pass to ${nextPlayer?.name}`}
            </CandyButton>
          </div>
          {!revealed && (
            <Text c="white" size="xs" ta="center" style={{ opacity: 0.7 }}>
              Scratch the card first
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
}
