import { Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import type { Action } from '../game/state';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

export function HostSetupScreen({ state, dispatch }: Props) {
  const canContinue = state.hostName.trim().length > 0;

  return (
    <Stack gap="md" style={{ flex: 1 }} justify="space-between">
      <Stack gap={6} mt={4} align="center" className="title-stack">
        <Text className="tagline">a party game</Text>
        <Title className="wordmark" style={{ fontSize: 'clamp(44px, 14vw, 64px)' }}>
          IMPOSTER
        </Title>
        <Text size="sm" mt={2} ta="center" maw={300} c="white" style={{ opacity: 0.85, lineHeight: 1.4 }}>
          One of you is lying.<br />Catch them.
        </Text>
        <span className="star-deco" style={{ top: -2, left: 10, fontSize: 22 }}>✦</span>
        <span className="star-deco" style={{ top: 36, right: 6, fontSize: 18, animationDelay: '0.5s' }}>★</span>
        <span className="star-deco" style={{ top: 12, right: 38, fontSize: 14, animationDelay: '1.1s' }}>✦</span>
        <span className="star-deco" style={{ top: 80, left: 26, fontSize: 16, animationDelay: '1.6s' }}>★</span>
      </Stack>

      <Stack gap="md" align="center">
        <div className="speech-bubble">tap me to swap 🎲</div>
        <div className="spotlight">
          <div className="hero-avatar-ring">
            <Avatar
              seed={state.hostSeed}
              size={132}
              onClick={() => dispatch({ type: 'REROLL_HOST_AVATAR' })}
              ariaLabel="reroll host avatar"
            />
          </div>
        </div>

        <input
          className="candy-input"
          placeholder="Your name, host"
          value={state.hostName}
          onChange={(e) => dispatch({ type: 'SET_HOST_NAME', name: e.currentTarget.value })}
          maxLength={20}
          autoFocus
        />
      </Stack>

      <div className={canContinue ? 'cta-bounce' : ''}>
        <CandyButton
          color="pink"
          onClick={() => dispatch({ type: 'CONTINUE_TO_PLAYERS' })}
          disabled={!canContinue}
          rightIcon={<IconArrowRight size={22} />}
        >
          {canContinue ? "Let's play" : 'Enter your name'}
        </CandyButton>
      </div>
    </Stack>
  );
}
