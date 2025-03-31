import { Component, ErrorInfo, ReactNode } from 'react'
import { urlPage } from '@/shared/enum/urlPage'

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Ошибка в ${ this.props.componentName || 'неизвестном компоненте' }:`, error, errorInfo.componentStack)
    this.setState({ error, errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = urlPage.Index
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback, componentName } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      console.info('error: ', error)
      console.info('errorInfo: ', errorInfo)

      return (
        <div>
          <p>
            Произошла ошибка{ componentName ? ` в ${ componentName }` : '' }. Пожалуйста, попробуйте
            <strong className="as-link ml-2 mr-2" onClick={ this.handleReload }>
              обновить страницу
            </strong>
            или
            <strong className="as-link ml-2 mr-2" onClick={ this.handleGoHome }>
              вернуться на главную
            </strong>
          </p>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
