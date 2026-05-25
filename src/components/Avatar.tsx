import { funEmoji } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { UnstyledButton } from '@mantine/core';
import { useMemo } from 'react';

interface Props {
  seed: string;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Avatar({ seed, size = 56, onClick, ariaLabel }: Props) {
  const dataUri = useMemo(
    () => createAvatar(funEmoji, { seed, radius: 50, backgroundType: ['gradientLinear', 'solid'] }).toDataUri(),
    [seed]
  );

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
