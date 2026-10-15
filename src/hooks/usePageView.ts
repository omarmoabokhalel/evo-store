import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { trackPageView } from '@/services/analytics'
import { trackPixelPageView } from '@/services/pixel'

export function usePageView() {
  const location = useLocation()
  const trackPageViewMutation = useMutation({ mutationFn: trackPageView })

  useEffect(() => {
    // Generate a session ID if not exists
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('session_id', sessionId)
    }

    // Track internal analytics
    trackPageViewMutation.mutate({
      page: location.pathname,
      sessionId,
    })

    // Track Meta Pixel PageView
    trackPixelPageView(location.pathname)
  }, [location.pathname])
}
