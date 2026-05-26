import { AppShell, Container } from '@mantine/core';
import { PWAPrompt } from './components/PWAPrompt';
import { useGameStore } from './game/store';
import { BriefingScreen } from './screens/BriefingScreen';
import { EndScreen } from './screens/EndScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HostSetupScreen } from './screens/HostSetupScreen';
import { PassRevealScreen } from './screens/PassRevealScreen';
import { PlayersSetupScreen } from './screens/PlayersSetupScreen';
import { SplashScreen } from './screens/SplashScreen';

export function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <AppShell padding={0}>
        <AppShell.Main>
          <Container
            size="xs"
            px="md"
            py="lg"
            style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
          >
            <div key={phase} className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {phase === 'splash' && <SplashScreen />}
              {phase === 'home' && <HomeScreen />}
              {phase === 'host-setup' && <HostSetupScreen />}
              {phase === 'players-setup' && <PlayersSetupScreen />}
              {phase === 'briefing' && <BriefingScreen />}
              {phase === 'pass-reveal' && <PassRevealScreen />}
              {phase === 'end' && <EndScreen />}
            </div>
          </Container>
        </AppShell.Main>
      </AppShell>
      <PWAPrompt />
    </>
  );
}
