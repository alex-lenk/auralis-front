import { ThemeToggle } from '@/components/ui/ThemeToggle'
// import { Button } from '@/components/ui/Button'

export default function Header() {
  //const router = useRouter()

  return (
    <header className="container mx-auto flex items-center justify-between p-4">
      {/*<Link href="/" className="flex items-center">
        <img
          src="/assets/img/logo/logo-ico.svg"
          width={65}
          height={44}
          alt="Auralis"
        />
      </Link>
*/}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/*<Button variant="secondary" onClick={() => router.push('/auth/login')}>Войти</Button>*/}
      </div>
    </header>
  )
}
