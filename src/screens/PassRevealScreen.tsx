import { Group, Stack, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconEye,
  IconHeartFilled,
  IconUserOff,
  IconUsers
} from '@tabler/icons-react';
import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { CandyButton } from '../components/CandyButton';
import { VillainMask } from '../components/icons';
import { ScratchCard } from '../components/ScratchCard';
import { useGameStore } from '../game/store';
import type { Role } from '../game/types';

type Stage = 'pass' | 'reveal';

const ROLE_CARD_CLASS: Record<Role, string> = {
  imposter: 'imposter-villain',
  crew: 'crew-card',
  mafia: 'mafia-card',
  doctor: 'doctor-card',
  god: 'god-card',
  villager: 'villager-card'
};

export function PassRevealScreen() {
  const round = useGameStore((s) => s.round);
  const markRevealed = useGameStore((s) => s.markRevealed);
  const advanceReveal = useGameStore((s) => s.advanceReveal);
  const endRound = useGameStore((s) => s.endRound);
  const [stage, setStage] = useState<Stage>('pass');
  const [revealed, setRevealed] = useState(false);

  if (!round) return null;
  const player = round.players[round.currentRevealIndex];
  const isLast = round.currentRevealIndex === round.players.length - 1;
  const nextPlayer = !isLast ? round.players[round.currentRevealIndex + 1] : null;
  const progress =
    ((round.currentRevealIndex + (stage === 'reveal' ? 0.5 : 0)) / round.players.length) * 100;

  function onReveal() {
    setRevealed(true);
    if (!player.hasSeenWord) markRevealed(player.id);
  }

  function next() {
    if (isLast) {
      endRound();
    } else {
      advanceReveal();
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
          {round.mode === 'imposter' && <span className="candy-chip">{round.category}</span>}
          {round.mode === 'mafia' && <span className="candy-chip">Mafia</span>}
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
            cardClassName={ROLE_CARD_CLASS[player.role]}
            onReveal={onReveal}
            minHeight={360}
          >
            <RoleContent
              role={player.role}
              category={round.category}
              word={round.word}
              currentPlayerId={player.id}
              mafiaPlayers={round.players.filter((p) => p.role === 'mafia')}
            />
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

interface ContentProps {
  role: Role;
  category: string;
  word: string;
  currentPlayerId: number;
  mafiaPlayers: { id: number; name: string; seed: string }[];
}

function RoleContent({ role, category, word, currentPlayerId, mafiaPlayers }: ContentProps) {
  if (role === 'imposter') {
    return (
      <Stack gap="xs" align="center">
        <div className="villain-mask"><VillainMask size={64} /></div>
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
        <Text size="lg" fw={700} mt={6} c="white">{category}</Text>
        <Text size="xs" c="white" ta="center" maw={240} mt="sm" style={{ opacity: 0.85, fontStyle: 'italic' }}>
          Deceive. Bluff. Don't get caught.
        </Text>
      </Stack>
    );
  }
  if (role === 'crew') {
    return (
      <Stack gap="sm" align="center">
        <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.95)' }}>
          {category}
        </Text>
        <Title order={1} style={{ fontSize: 52, color: 'white' }} ta="center">{word}</Title>
        <Text size="sm" mt="sm" c="white" style={{ opacity: 0.9 }}>
          Don't say the word directly!
        </Text>
      </Stack>
    );
  }
  if (role === 'mafia') {
    const teammates = mafiaPlayers.filter((p) => p.id !== currentPlayerId);
    return (
      <Stack gap="xs" align="center">
        <div className="villain-mask"><VillainMask size={56} /></div>
        <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.3em', color: '#ffb3c1' }}>
          you are the
        </Text>
        <Title className="imposter-text" style={{ fontSize: 44, lineHeight: 1 }} ta="center">
          MAFIA
        </Title>
        {teammates.length > 0 && (
          <>
            <Text size="xs" tt="uppercase" fw={800} mt="sm"
              style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.9)' }}
            >
              {teammates.length > 1 ? 'Your team' : 'Your partner'}
            </Text>
            <Group justify="center" gap={6} wrap="wrap">
              {teammates.map((m) => (
                <span key={m.id} className="candy-chip candy-chip--pink">
                  <Avatar seed={m.seed} size={22} />
                  <span>{m.name}</span>
                </span>
              ))}
            </Group>
          </>
        )}
        <Text size="xs" c="white" ta="center" maw={260} mt="sm" style={{ opacity: 0.85, fontStyle: 'italic' }}>
          At night, agree silently on a target. By day, blend in.
        </Text>
      </Stack>
    );
  }
  if (role === 'doctor') {
    return (
      <Stack gap="xs" align="center">
        <IconHeartFilled size={56} color="#fff" style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' }} />
        <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.9)' }}>
          you are the
        </Text>
        <Title style={{ fontSize: 44, color: 'white', lineHeight: 1 }} ta="center">DOCTOR</Title>
        <Text size="xs" c="white" ta="center" maw={260} mt="sm" style={{ opacity: 0.9, fontStyle: 'italic' }}>
          Each night, pick one player to save from the mafia.
        </Text>
      </Stack>
    );
  }
  if (role === 'god') {
    return (
      <Stack gap="xs" align="center">
        <IconEye size={52} color="#fff" stroke={2.5} style={{ filter: 'drop-shadow(0 0 14px rgba(255,255,255,0.7))' }} />
        <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.9)' }}>
          you are
        </Text>
        <Title style={{ fontSize: 48, color: 'white', lineHeight: 1 }} ta="center">GOD</Title>
        <Text size="xs" tt="uppercase" fw={800} mt="sm"
          style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.95)' }}
        >
          {mafiaPlayers.length > 1 ? 'The mafia are' : 'The mafia is'}
        </Text>
        <Group justify="center" gap={6} wrap="wrap">
          {mafiaPlayers.map((m) => (
            <span key={m.id} className="candy-chip candy-chip--pink">
              <Avatar seed={m.seed} size={22} />
              <span>{m.name}</span>
            </span>
          ))}
        </Group>
        <Text size="xs" c="white" ta="center" maw={260} mt="sm" style={{ opacity: 0.9, fontStyle: 'italic' }}>
          You see everything. Guide the vote without outing yourself too early.
        </Text>
      </Stack>
    );
  }
  // villager
  return (
    <Stack gap="xs" align="center">
      <IconUsers size={56} color="#fff" stroke={2.5} style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.5))' }} />
      <Text size="xs" tt="uppercase" fw={800} style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.9)' }}>
        you are a
      </Text>
      <Title style={{ fontSize: 44, color: 'white', lineHeight: 1 }} ta="center">VILLAGER</Title>
      <Text size="xs" c="white" ta="center" maw={260} mt="sm" style={{ opacity: 0.9, fontStyle: 'italic' }}>
        Sleep at night. By day, vote to find the mafia.
      </Text>
    </Stack>
  );
}
