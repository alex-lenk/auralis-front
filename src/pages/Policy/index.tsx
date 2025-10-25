import { useTranslation } from 'react-i18next';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';

const Policy = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('general.headTitle'));

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-6 text-3xl font-bold">
        {t('policy.title')}
      </h1>

      <div className="max-w-3xl whitespace-pre-line">
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('policy.text1') }} />

        <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('policy.text2') }} />

        <p>
          {t('policy.text3')}
          <a href={`mailto:${import.meta.env.VITE_API_EMAIL}`} className="ms-2 text-blue-500 hover:underline">
            {import.meta.env.VITE_API_EMAIL}
          </a>.
          <br />
          <br />
          {t('policy.text4')}
        </p>
      </div>
    </div>
  );
};

export default Policy;
