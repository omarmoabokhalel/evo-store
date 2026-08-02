import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { trackPageView } from '@/services/analytics'

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

    // Track page view
    console.log('Tracking page view:', location.pathname)
    trackPageViewMutation.mutate({
      page: location.pathname,
      sessionId,
    })
  }, [location.pathname])
}
