import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.scss';
import Button from '../../common/components/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Здесь можно отправить ошибку в сервис логирования
    // например, Sentry, LogRocket и т.д.
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>Что-то пошло не так</h1>
            <p className={styles.errorMessage}>
              Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
            </p>

            <div className={styles.errorActions}>
              <Button onClick={this.handleReset}>Попробовать снова</Button>
              <Button buttonType='secondary' onClick={() => (window.location.href = '/')}>
                На главную
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
