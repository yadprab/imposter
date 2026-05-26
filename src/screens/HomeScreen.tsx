import { Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconUserOff, IconUsersGroup } from '@tabler/icons-react';
import { useGameStore } from '../game/store';

export function HomeScreen() {
  const selectGameMode = useGameStore((s) => s.selectGameMode);

  return (
    <Stack gap="lg" style={{ flex: 1 }} justify="space-between">
      <Stack gap={6} mt={8} align="center" className="title-stack">
        <Text className="tagline">trip squad games</Text>
        <Title className="wordmark" style={{ fontSize: 'clamp(40px, 13vw, 58px)' }}>
          CRM TRIP
        </Title>
        <Text size="sm" mt={2} ta="center" maw={300} c="white" style={{ opacity: 0.8 }}>
          Two games, one phone.<br />Pick what's next.
        </Text>
      </Stack>

      <Stack gap="md" align="stretch">
        <UnstyledButton onClick={() => selectGameMode('imposter')} style={{ width: '100%' }}>
          <div
            className="card-covered"
            style={{
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              minHeight: 110
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
                border: '3px solid #80082b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 6px 0 #80082b'
              }}
            >
              <IconUserOff size={32} color="white" stroke={2.5} />
            </div>
            <Stack gap={2} style={{ flex: 1, textAlign: 'left' }}>
              <Text fw={800} size="xl" c="white">Imposter</Text>
              <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                One sneaky liar. Catch them before they figure out the word.
              </Text>
            </Stack>
          </div>
        </UnstyledButton>

        <UnstyledButton onClick={() => selectGameMode('mafia')} style={{ width: '100%' }}>
          <div
            className="card-covered"
            style={{
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              minHeight: 110
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #b197fc, #4226a3)',
                border: '3px solid #2a1668',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 6px 0 #2a1668'
              }}
            >
              <IconUsersGroup size={32} color="white" stroke={2.5} />
            </div>
            <Stack gap={2} style={{ flex: 1, textAlign: 'left' }}>
              <Text fw={800} size="xl" c="white">Mafia</Text>
              <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                Mafia vs town. Detective hunts, doctor saves, civilians vote.
              </Text>
            </Stack>
          </div>
        </UnstyledButton>
      </Stack>

      <Text c="white" size="xs" ta="center" style={{ opacity: 0.5 }}>
        Pass-the-phone, fully offline.
      </Text>
    </Stack>
  );
}
