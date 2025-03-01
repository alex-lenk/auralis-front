import { NavLink } from 'react-router'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'

export default function Header() {

  return (
    <header className="container mx-auto flex items-center justify-between p-4">
      <NavLink to="/" className="flex items-center">
        <img
          src="/assets/img/logo/logo-ico.svg"
          alt="Auralis"
        />
      </NavLink>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="secondary" href="/auth/login">Войти</Button>
      </div>
    </header>
  )
}
