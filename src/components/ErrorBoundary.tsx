import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Alt ağaçtaki bir render hatasını yakalar ve boş sayfa yerine
 * anlaşılır bir mesaj gösterir. Kayıtlı görevler etkilenmez.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Arayüzde beklenmeyen bir hata oluştu', error, info)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel max-w-md rounded-panel p-8 text-center">
          <h1 className="text-xl font-semibold">Bir şeyler ters gitti</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Sayfa yüklenirken beklenmeyen bir hata oluştu. Kayıtlı görevlerin
            tarayıcında duruyor, sayfayı yenilemen yeterli.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="glass-button glass-button-accent mt-6 rounded-full px-6 py-2.5 text-[15px] font-medium"
          >
            Sayfayı yenile
          </button>
        </div>
      </div>
    )
  }
}
