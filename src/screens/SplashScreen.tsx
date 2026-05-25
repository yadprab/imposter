import { Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { Action } from '../game/state';

interface Props {
  dispatch: React.Dispatch<Action>;
}

const DURATION = 1800;

export function SplashScreen({ dispatch }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => dispatch({ type: 'LEAVE_SPLASH' }), 220);
      }
    }, 40);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <Stack
      gap="xl"
      style={{ flex: 1 }}
      justify="center"
      align="center"
      onClick={() => dispatch({ type: 'LEAVE_SPLASH' })}
    >
      <div style={{ position: 'relative' }}>
        <Stack gap={4} align="center" className="title-stack splash-rise">
          <Text className="tagline">a party game</Text>
          <Title
            className="wordmark splash-stamp"
            style={{ fontSize: 'clamp(56px, 18vw, 84px)' }}
          >
            IMPOSTER
          </Title>
        </Stack>
        <span className="star-deco" style={{ top: -10, left: -8, fontSize: 28 }}>✦</span>
        <span className="star-deco" style={{ top: 30, right: -10, fontSize: 22, animationDelay: '0.5s' }}>★</span>
        <span className="star-deco" style={{ bottom: -20, left: 24, fontSize: 18, animationDelay: '1.0s' }}>✦</span>
        <span className="star-deco" style={{ bottom: -5, right: 18, fontSize: 24, animationDelay: '1.4s' }}>★</span>
      </div>

      <Stack gap={8} align="center" w="80%" maw={280}>
        <div className="candy-progress" style={{ width: '100%' }}>
          <div className="candy-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <Text size="xs" c="white" style={{ opacity: 0.7, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
          Loading the squad…
        </Text>
      </Stack>

      <Text size="xs" c="white" style={{ position: 'absolute', bottom: 24, opacity: 0.4 }}>
        tap anywhere to skip
      </Text>
    </Stack>
  );
}
