import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';;
import useStore from '@/stores/StoreContext';
import { Theme } from '@/shared/enum/theme';
import Sprite from '@/shared/ui/Sprite';
import { Icons } from '@/shared/ui/Sprite/iconsList';
import styles from './styles.module.scss';

const ThemeToggle = observer(() => {
  const { themeToggleStore } = useStore();
  const isDark = themeToggleStore.theme === Theme.Dark;

  return (
    <div
      className={clsx(
        styles.toggle,
        isDark ? styles.toggleSun : ''
      )}
      onClick={ () => themeToggleStore.toggleTheme() }
    >
      <Sprite
        icon={ isDark ? Icons.sun : Icons.moon }
        className={clsx(styles.icon)}
      />
    </div>
  );
});

export default ThemeToggle;
