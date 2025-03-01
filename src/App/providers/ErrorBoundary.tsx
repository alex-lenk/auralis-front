import { isRouteErrorResponse, useRouteError } from 'react-router'

function ErrorBoundary() {
  const error = useRouteError() // Получаем ошибку из React Router

  if (isRouteErrorResponse(error)) {
    // Обработка ошибок, связанных с маршрутизацией (например, 404)
    return (
      <div>
        <h1>{ error.status } { error.statusText }</h1>
        <p>{ error.data }</p>
        <a href="/">Вернуться на главную</a>
      </div>
    )
  } else if (error instanceof Error) {
    // Обработка обычных ошибок (например, исключений)
    return (
      <div>
        <h1>Ошибка</h1>
        <p>{ error.message }</p>
        <pre>{ error.stack }</pre>
        <a href="/">Вернуться на главную</a>
      </div>
    )
  } else {
    // Обработка неизвестных ошибок
    return (
      <div>
        <h1>Неизвестная ошибка</h1>
        <a href="/">Вернуться на главную</a>
      </div>
    )
  }
}

export default ErrorBoundary
