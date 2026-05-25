import { Group, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconArrowRight, IconHandStop, IconUserOff } from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import type { Action } from '../game/state';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

type Stage = 'pass' | 'reveal';

export function PassRevealScreen({ state, dispatch }: Props) {
  const [stage, setStage] = useState<Stage>('pass');
  const [pressed, setPressed] = useState(false);

  if (!state.round) return null;
  const round = state.round;
  const player = round.players[round.currentRevealIndex];
  const isLast = round.currentRevealIndex === round.players.length - 1;
  const progress = ((round.currentRevealIndex + (stage === 'reveal' ? 0.5 : 0)) / round.players.length) * 100;

  function startHold() {
    setPressed(true);
    if (!player.hasSeenWord) {
      dispatch({ type: 'MARK_REVEALED', playerId: player.id });
    }
  }
  function endHold() {
    setPressed(false);
  }
  function next() {
    if (isLast) {
      dispatch({ type: 'END_ROUND' });
    } else {
      dispatch({ type: 'ADVANCE_REVEAL' });
      setStage('pass');
      setPressed(false);
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
            <Avatar seed={player.seed} size={160} />
          </div>
          <Title order={1} className="wordmark" style={{ fontSize: 52 }} ta="center">
            {player.name.toUpperCase()}
          </Title>
          <Text c="white" size="xs" ta="center" maw={300} style={{ opacity: 0.75 }}>
            Make sure no one else can see the screen
          </Text>
          <CandyButton color="pink" onClick={() => setStage('reveal')}>
            I'm {player.name}
          </CandyButton>
        </Stack>
      ) : (
        <Stack gap="md" align="center" style={{ flex: 1 }}>
          <span className="candy-chip">
            <Avatar seed={player.seed} size={28} />
            <span>{player.name}</span>
          </span>

          <UnstyledButton
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onPointerCancel={endHold}
            onContextMenu={(e) => e.preventDefault()}
            style={{ width: '100%', flex: 1, display: 'flex' }}
          >
            <div
              className={pressed ? (player.isImposter ? 'imposter-card' : 'crew-card') : 'hold-card'}
              style={{
                flex: 1,
                minHeight: 360,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: 24
              }}
            >
              {pressed ? (
                player.isImposter ? (
                  <Stack gap="sm" align="center">
                    <span className="candy-chip candy-chip--yellow">
                      <IconUserOff size={16} />
                      <span>YOU ARE THE IMPOSTER</span>
                    </span>
                    <Text size="xs" tt="uppercase" fw={800} mt="sm"
                      style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.85)' }}
                    >
                      You only know the category
                    </Text>
                    <Title order={2} style={{ color: 'white' }} ta="center">
                      {round.category}
                    </Title>
                    <Text c="white" size="sm" ta="center" maw={260} mt="sm" style={{ opacity: 0.9 }}>
                      Bluff your way through. Figure out the word from what others say.
                    </Text>
                  </Stack>
                ) : (
                  <Stack gap="sm" align="center">
                    <Text size="xs" tt="uppercase" fw={800}
                      style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.95)' }}
                    >
                      {round.category}
                    </Text>
                    <Title order={1} style={{ fontSize: 52, color: 'white' }} ta="center">
                      {round.word}
                    </Title>
                    <Text size="sm" mt="sm" c="white" style={{ opacity: 0.9 }}>
                      Don't say the word directly!
                    </Text>
                  </Stack>
                )
              ) : (
                <Stack gap="sm" align="center">
                  <IconHandStop size={64} stroke={1.2} color="rgba(255,255,255,0.55)" />
                  <Text fw={700} size="lg" c="white">Press &amp; hold to reveal</Text>
                  <Text c="white" size="xs" style={{ opacity: 0.65 }}>
                    Release to hide instantly
                  </Text>
                </Stack>
              )}
            </div>
          </UnstyledButton>

          <CandyButton
            color={player.hasSeenWord ? (isLast ? 'green' : 'pink') : 'violet'}
            onClick={next}
            disabled={!player.hasSeenWord}
            rightIcon={<IconArrowRight size={22} />}
          >
            {isLast ? 'Done — start playing' : 'Give back to host'}
          </CandyButton>
          {!player.hasSeenWord && (
            <Text c="white" size="xs" ta="center" style={{ opacity: 0.7 }}>
              Hold the card first
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
}
