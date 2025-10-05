import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import useStore from '@/stores/StoreContext';
import { Theme } from '@/shared/enum/theme';
import { Icons } from '@/shared/ui/Sprite/iconsList';
import Button from '@/components/Button';
import styles from './styles.module.scss';

const ThemeToggle = observer(() => {
  const { themeToggleStore } = useStore();
  const isDark = themeToggleStore.theme === Theme.Dark;

  return (
    <Button
      isIcon={true}
      variant="transparent"
      size="md"
      className={clsx(
        styles.toggle,
        isDark ? styles.toggleSun : ''
      )}
      onClick={() => themeToggleStore.toggleTheme()}
      iconName={isDark ? Icons.sun : Icons.moon}
    >
    </Button>
  );
});

export default ThemeToggle;
