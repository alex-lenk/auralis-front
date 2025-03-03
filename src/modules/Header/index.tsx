import { NavLink } from 'react-router'

import { urlPage } from '@/shared/enum/urlPage'
import { ThemeToggle } from '@/modules/Header/components/ThemeToggle'
import LanguageSwitcher from '@/modules/Header/components/LanguageSwitcher'
import { Button } from '@/components/ui/Button'

export default function Header() {
  return (
    <header className="container mx-auto flex items-center justify-between p-4">
      <NavLink to={urlPage.Index} className="flex items-center">
        <img
          src="/assets/img/logo/logo-ico.svg"
          alt="Auralis"
        />
      </NavLink>

      <div className="flex items-center gap-4 ms-auto">
        <ThemeToggle />

        <LanguageSwitcher />

        <Button variant="secondary" href={urlPage.SignIn}>Войти</Button>
      </div>
    </header>
  )
}
