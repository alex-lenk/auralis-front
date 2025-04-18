import { NavLink } from 'react-router'
import cn from 'classnames'

import { urlPage } from '@/shared/enum/urlPage'
import ThemeToggle from '@/modules/Header/components/ThemeToggle'
import LanguageSwitcher from '@/modules/Header/components/LanguageSwitcher'
// import { Button } from '@/components/ui/Button'
import styles from './styles.module.scss'

const Header = () => {
  return (
    <header className="container mx-auto flex items-center justify-between shrink-0 p-4">
      <NavLink to={ urlPage.Index } className={ cn(styles.logo, 'flex items-center') }>
        <img
          className={styles.logoImg}
          src="/assets/img/logo/logo-auralis-full.svg"
          alt="Auralis"
        />
        <span className={cn(styles.logoName)}>Auralis</span>
      </NavLink>

      <div className="flex items-center gap-4 ms-auto">
        <ThemeToggle />

        <LanguageSwitcher />

        {/*<Button variant="secondary" href={ urlPage.SignIn }>Войти</Button>*/}
      </div>
    </header>
  )
}

export default Header
