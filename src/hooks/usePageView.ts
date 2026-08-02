import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trpc } from '@/providers/trpc'

export function usePageView() {
  const location = useLocation()
  const trackPageView = trpc.analytics.track.useMutation()

  useEffect(() => {
    // Generate a session ID if not exists
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('session_id', sessionId)
    }

    // Track page view
    console.log('Tracking page view:', location.pathname)
    trackPageView.mutate({
      page: location.pathname,
      sessionId,
    })
  }, [location.pathname])
}
