import { NavLink } from 'react-router'

import { externalLinks, urlPage } from '@/shared/enum/urlPage'
import StorageConsent from '@/components/StorageConsent'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <>
      <footer className="container mx-auto shrink-0 py-3 px-4 mt-auto flex text-gray-500">
        ©{ currentYear } Auralis принадлежит разработчику
        —&nbsp;<NavLink to={ externalLinks.AlexLenk } className="font-bold" target="_blank">AlexLenk</NavLink>

        <NavLink className="ms-auto" to={ urlPage.Policy }>Storage Consent</NavLink>
      </footer>

      <StorageConsent />
    </>
  )
}

export default Footer
