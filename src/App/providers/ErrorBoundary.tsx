import { isRouteErrorResponse, NavLink, useRouteError } from 'react-router'
import { useTranslation } from 'react-i18next'

import { urlPage } from '@/router'

interface RouteError {
  status: number;
  statusText: string;
  data: string;
}

function ErrorBoundary() {
  const error = useRouteError()
  const { t } = useTranslation()

  if (isRouteErrorResponse(error)) {
    const routeError = error as RouteError

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-6xl font-bold">
          { t(`error.${ routeError.status }.title`, { defaultValue: routeError.status.toString() }) }
        </h1>
        <p className="text-xl text-gray-300 mt-4">
          { t(`error.${ routeError.status }.description`, {
            defaultValue: routeError.statusText,
          }) }
        </p>
        <p className="text-lg text-gray-400 mt-2">
          { t(`error.${ routeError.status }.message`, {
            path: window.location.pathname,
            defaultValue: routeError.data,
          }) }
        </p>
        <NavLink
          to={ urlPage.Index }
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          { t('error.backToHome') }
        </NavLink>
      </div>
    )
  } else if (error instanceof Error) {
    // Обработка обычных ошибок (например, исключений)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-6xl font-bold">{ t('error.unknown') }</h1>
        <p className="text-xl text-gray-300 mt-4">{ error.message }</p>
        <pre className="text-lg text-gray-400 mt-2 whitespace-pre-wrap">
          { error.stack }
        </pre>
        <NavLink
          to={ urlPage.Index }
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          { t('error.backToHome') }
        </NavLink>
      </div>
    )
  } else {
    // Обработка неизвестных ошибок
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
        <h1 className="text-6xl font-bold">{ t('error.unknown') }</h1>
        <NavLink
          to={ urlPage.Index }
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          { t('error.backToHome') }
        </NavLink>
      </div>
    )
  }
}

export default ErrorBoundary
