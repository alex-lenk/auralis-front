import { NavLink } from 'react-router'
import cn from 'classnames'

import { externalLinks, urlPage } from '@/shared/enum/urlPage'
import StorageConsent from '@/components/StorageConsent'
import styles from './styles.module.scss'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <footer className={cn(styles.footer, "container mx-auto shrink-0 py-3 px-4 mt-auto flex text-gray-500")}>
        <div className={styles.footerCopy}>
          ©{ currentYear } Auralis принадлежит разработчику
          —&nbsp;<NavLink to={ externalLinks.AlexLenk } className="font-bold" target="_blank">AlexLenk</NavLink>
        </div>


        <NavLink className={styles.footerSolution} to={ urlPage.Policy }>Storage Consent</NavLink>
      </footer>

      <StorageConsent />
    </>
  )
}

export default Footer
