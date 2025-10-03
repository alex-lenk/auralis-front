import { NavLink } from 'react-router';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import useStore from '@/stores/StoreContext';
import { Theme } from '@/shared/enum/theme';
import { urlPage } from '@/shared/enum/urlPage';
import ThemeToggle from '@/modules/Header/components/ThemeToggle';
import LanguageSwitcher from '@/modules/Header/components/LanguageSwitcher';
import styles from './styles.module.scss';

const Header = observer(() => {
  const { themeToggleStore } = useStore();
  return (
    <header className={clsx(styles.header, 'container mx-auto flex items-center justify-between shrink-0 px-4')}>
      <NavLink to={urlPage.Index} className={clsx(styles.logo, 'flex items-center')}>
        <img
          className="max-h-full"
          src={themeToggleStore.theme === Theme.Dark ? '/assets/img/logo/logo.svg' : '/assets/img/logo/logo-dark.svg'}
          alt="Auralis"
        />
      </NavLink>

      <div className="flex items-center gap-4 ms-auto">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
});

export default Header;
