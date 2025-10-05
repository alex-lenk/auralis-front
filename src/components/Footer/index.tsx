import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { externalLinks, urlPage } from '@/shared/enum/urlPage';
import StorageConsent from '@/components/StorageConsent';
import styles from './styles.module.scss';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className={clsx(styles.footer, 'container mx-auto shrink-0 py-4 px-4 mt-auto d:flex')}>
        <div className={clsx(styles.footerCopy, 'whitespace-pre-line')}>
          ©{currentYear} <span className="font-accent">Auralis</span> {t('footer.copy')}
         <NavLink
          to={externalLinks.AlexLenk}
          className="font-accent font-bold"
          target="_blank"
        >&nbsp;AlexLenk</NavLink>
        </div>

        <NavLink className={clsx('font-accent')} to={urlPage.Policy}>
          {t('footer.consent')}
        </NavLink>
      </footer>

      <StorageConsent />
    </>
  );
};

export default Footer;
