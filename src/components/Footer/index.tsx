import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { externalLinks, urlPage } from '@/shared/enum/urlPage';
import StorageConsent from '@/components/StorageConsent';
import styles from './styles.module.scss';

const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();

  const hiddenPaths: string[] = [urlPage.Walkman];
  const widthScreen = document.documentElement.clientWidth;

  if (widthScreen < 1200 && hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <>
      <footer className={clsx(styles.footer, 'container mx-auto shrink-0 py-4 px-4 mt-auto')}>
        <div className={clsx(styles.footerCopy)}>
          ©{currentYear} <span className="font-accent">Auralis</span> {t('footer.copy')}
          <NavLink
            to={externalLinks.AlexLenk}
            className="font-accent font-bold"
            target="_blank"
          >&nbsp;AlexLenk</NavLink>
        </div>

        <NavLink className="font-accent" to={urlPage.Policy}>
          {t('footer.consent')}
        </NavLink>
      </footer>

      <StorageConsent />
    </>
  );
};

export default Footer;
