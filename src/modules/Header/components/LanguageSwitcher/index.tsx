import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import useStore from '@/stores/StoreContext';
import Button from '@/components/Button';
import styles from './styles.module.scss';

const LanguageSwitcher = observer(() => {
  const { languageStore } = useStore();

  return (
    <div className="relative">
      <Button
        variant="transparent"
        size="md"
        className={clsx(styles.lang, 'flex items-center cursor-pointer uppercase')}
        onClick={() => languageStore.toggleMenu()}
      >
        {languageStore.language}
      </Button>

      {languageStore.isOpen && (
        <div className={clsx(
          styles.langPanel, 'absolute top-10 right-0 border overflow-hidden flex flex-col'
        )}>
          {languageStore.languages.map(({ code }) => (
            <Button
              key={code}
              variant="transparent"
              size="md"
              className={clsx(
                'uppercase',
                styles.btn,
                languageStore.language === code && styles.active,
              )}
              onClick={() => languageStore.setLanguage(code)}
            >
              {code}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
});

export default LanguageSwitcher;
