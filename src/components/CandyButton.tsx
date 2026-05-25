import type { ReactNode } from 'react';

type Color = 'pink' | 'green' | 'orange' | 'cyan' | 'violet' | 'yellow';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: Color;
  size?: 'sm' | 'md';
  icon?: ReactNode;
  rightIcon?: ReactNode;
  ariaLabel?: string;
}

export function CandyButton({
  children,
  onClick,
  disabled,
  color = 'pink',
  size = 'md',
  icon,
  rightIcon,
  ariaLabel
}: Props) {
  const classes = ['candy-btn', `candy-btn--${color}`];
  if (size === 'sm') classes.push('candy-btn--sm');
  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

interface IconBtnProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: Color;
  ariaLabel: string;
}

export function CandyIconButton({ children, onClick, disabled, color = 'pink', ariaLabel }: IconBtnProps) {
  return (
    <button
      type="button"
      className={`candy-btn candy-btn--${color} candy-btn--icon`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
