import { AppShell, Container } from '@mantine/core';
import { useReducer } from 'react';
import { initialState, reducer } from './game/state';
import { BriefingScreen } from './screens/BriefingScreen';
import { EndScreen } from './screens/EndScreen';
import { HostSetupScreen } from './screens/HostSetupScreen';
import { PassRevealScreen } from './screens/PassRevealScreen';
import { PlayersSetupScreen } from './screens/PlayersSetupScreen';

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

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
            <div key={state.phase} className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {state.phase === 'host-setup' && <HostSetupScreen state={state} dispatch={dispatch} />}
              {state.phase === 'players-setup' && <PlayersSetupScreen state={state} dispatch={dispatch} />}
              {state.phase === 'briefing' && <BriefingScreen state={state} dispatch={dispatch} />}
              {state.phase === 'pass-reveal' && <PassRevealScreen state={state} dispatch={dispatch} />}
              {state.phase === 'end' && <EndScreen state={state} dispatch={dispatch} />}
            </div>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
