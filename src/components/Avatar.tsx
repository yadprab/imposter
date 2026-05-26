import { bottts, notionists } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { UnstyledButton } from '@mantine/core';
import { useMemo } from 'react';
import { useGameStore } from '../game/store';

interface Props {
  seed: string;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

const BG_COLORS = ['ff6cc4', 'ffd866', '66d9e8', '69db7c', 'ffa94d', 'b197fc', 'ff8aa0'];

export function Avatar({ seed, size = 56, onClick, ariaLabel }: Props) {
  const gameMode = useGameStore((s) => s.gameMode);

  const dataUri = useMemo(() => {
    const opts = {
      seed,
      radius: 50,
      backgroundColor: BG_COLORS,
      backgroundType: ['solid', 'gradientLinear'] as ('solid' | 'gradientLinear')[]
    };
    return gameMode === 'mafia'
      ? createAvatar(notionists, opts).toDataUri()
      : createAvatar(bottts, opts).toDataUri();
  }, [seed, gameMode]);

  const img = (
    <img
      src={dataUri}
      width={size}
      height={size}
      alt={ariaLabel || 'avatar'}
      draggable={false}
      style={{
        display: 'block',
        borderRadius: '50%',
        background: 'var(--mantine-color-dark-6)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
      }}
    />
  );

  if (onClick) {
    return (
      <UnstyledButton onClick={onClick} aria-label={ariaLabel || 'reroll avatar'}>
        {img}
      </UnstyledButton>
    );
  }
  return img;
}

export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
