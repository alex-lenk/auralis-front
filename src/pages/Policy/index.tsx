import useDocumentTitle from '@/shared/hooks/useDocumentTitle'

const Policy = () => {
  useDocumentTitle('Auralis - где звук встречается с безмятежностью')

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <h1 className="mb-6 text-3xl font-bold">Политика использования данных</h1>

      <div className="max-w-3xl">
        <p className="mb-4">
          На сайте Auralis используются современные технологии, такие как LocalStorage, IndexedDB, Session Storage
          и&nbsp;cookies чтобы улучшить ваш опыт. Они помогают сохранять ваши настройки, обеспечивать
          быструю работу сайта и&nbsp;запоминать ваши предпочтения.
        </p>
        <p className="mb-4">
          Сайт не использует куки для отслеживания или&nbsp;сбора личных данных. Всё, что&nbsp;собирается,
          направлено на&nbsp;то, чтобы ваш опыт был максимально комфортным.
        </p>
        <p>
          Если у вас есть вопросы, напишите мне на
          <a href={`mailto:${import.meta.env.VITE_API_EMAIL}`} className="ms-2 text-blue-500 hover:underline">
            {import.meta.env.VITE_API_EMAIL}
          </a>
          . Спасибо за ваше доверие!
        </p>
      </div>
    </div>
  )
}

export default Policy