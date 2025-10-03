import { FC, ReactNode, Ref } from 'react';
import { clsx } from 'clsx';

import Sprite from '@/shared/ui/Sprite';
import { Icons } from '@/shared/ui/Sprite/iconsList';
import styles from './styles.module.scss';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'transparent' | 'white' | 'disabled';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  type?: 'submit' | 'button';
  iconName?: keyof typeof Icons;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  href?: string;
  target?: '_self' | '_blank';
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  type = 'button',
  iconName,
  iconPosition,
  children,
  onClick,
  disabled = false,
  className,
  href,
  target,
  ref,
}) => {
  const classes = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className,
    { [styles.disabled]: disabled }
  );

  const content = (
    <>
      {iconName && (
        <Sprite
          icon={Icons[iconName]}
          className={clsx(styles.icon, styles[`icon--${iconPosition}`])}
        />
      )}
      {children && (
        <span className={clsx(styles.text, { [styles.textDisabled]: disabled })}>
          {children}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      ref={ref as Ref<HTMLButtonElement>}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
