import { Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconDice5 } from '@tabler/icons-react';
import { Avatar } from '../components/Avatar';
import { CandyButton, CandyIconButton } from '../components/CandyButton';
import { Sparkle, StarShape } from '../components/icons';
import { useGameStore } from '../game/store';

export function HostSetupScreen() {
  const hostName = useGameStore((s) => s.hostName);
  const hostSeed = useGameStore((s) => s.hostSeed);
  const gameMode = useGameStore((s) => s.gameMode);
  const setHostName = useGameStore((s) => s.setHostName);
  const rerollHostAvatar = useGameStore((s) => s.rerollHostAvatar);
  const continueToPlayers = useGameStore((s) => s.continueToPlayers);
  const backToHome = useGameStore((s) => s.backToHome);

  const canContinue = hostName.trim().length > 0;
  const gameLabel = gameMode === 'mafia' ? 'MAFIA' : 'IMPOSTER';

  return (
    <Stack gap="md" style={{ flex: 1 }} justify="space-between">
      <Group justify="space-between" mt="sm" align="center">
        <CandyIconButton color="violet" onClick={backToHome} ariaLabel="back to home">
          <IconArrowLeft size={20} />
        </CandyIconButton>
        <div className="ribbon">{gameLabel}</div>
        <div style={{ width: 48 }} />
      </Group>

      <Stack gap={6} mt={4} align="center" className="title-stack">
        <Text className="tagline">step 1 of 2</Text>
        <Title className="wordmark" style={{ fontSize: 'clamp(36px, 12vw, 52px)' }}>
          {gameLabel}
        </Title>
        <Text size="sm" mt={2} ta="center" maw={300} c="white" style={{ opacity: 0.8 }}>
          {gameMode === 'mafia'
            ? 'Mafia hides among the town. Catch them at trial.'
            : 'One of you is lying.'}
        </Text>
        <span className="star-deco" style={{ top: -2, left: 10 }}><Sparkle size={22} color="#ffd866" /></span>
        <span className="star-deco" style={{ top: 36, right: 6, animationDelay: '0.5s' }}><StarShape size={18} color="#ff6cc4" /></span>
      </Stack>

      <Stack gap="md" align="center">
        <div className="speech-bubble" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>tap me to swap</span>
          <IconDice5 size={16} stroke={2.5} />
        </div>
        <div className="spotlight">
          <div className="hero-avatar-ring">
            <Avatar
              seed={hostSeed}
              size={132}
              onClick={rerollHostAvatar}
              ariaLabel="reroll host avatar"
            />
          </div>
        </div>

        <input
          className="candy-input"
          placeholder="Your name, host"
          value={hostName}
          onChange={(e) => setHostName(e.currentTarget.value)}
          maxLength={20}
          autoFocus
        />
      </Stack>

      <div className={canContinue ? 'cta-bounce' : ''}>
        <CandyButton
          color="pink"
          onClick={continueToPlayers}
          disabled={!canContinue}
          rightIcon={<IconArrowRight size={22} />}
        >
          {canContinue ? "Let's play" : 'Enter your name'}
        </CandyButton>
      </div>
    </Stack>
  );
}
