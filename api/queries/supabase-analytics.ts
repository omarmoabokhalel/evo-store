import { supabase } from '../lib/supabase'

export async function trackPageView(data: {
  page: string
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
}) {
  const { error } = await supabase
    .from('page_views')
    .insert({
      page: data.page,
      user_id: data.userId || null,
      session_id: data.sessionId || null,
      ip_address: data.ipAddress || null,
      user_agent: data.userAgent || null,
    })

  if (error) {
    console.error('Error tracking page view:', error)
    // Don't throw error to avoid blocking user experience
  }
}

export async function getPageViewsStats(days: number = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('page_views')
    .select('created_at, page')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) throw error

  // Group by day
  const stats = data.reduce((acc: any, view) => {
    const day = new Date(view.created_at).toLocaleDateString('en-US', { weekday: 'short' })
    if (!acc[day]) {
      acc[day] = { name: day, views: 0, uniquePages: new Set() }
    }
    acc[day].views++
    acc[day].uniquePages.add(view.page)
    return acc
  }, {})

  return Object.values(stats).map((stat: any) => ({
    name: stat.name,
    views: stat.views,
    uniquePages: stat.uniquePages.size
  }))
}

export async function getTotalViews() {
  const { count, error } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

export async function getTopPages(limit: number = 10) {
  const { data, error } = await supabase
    .from('page_views')
    .select('page')
    .order('created_at', { ascending: false })

  if (error) throw error

  const pageCounts = data.reduce((acc: any, view) => {
    if (!acc[view.page]) {
      acc[view.page] = { page: view.page, views: 0 }
    }
    acc[view.page].views++
    return acc
  }, {})

  return Object.values(pageCounts)
    .sort((a: any, b: any) => b.views - a.views)
    .slice(0, limit)
}

export async function getViewsByPage() {
  const { data, error } = await supabase
    .from('page_views')
    .select('page')

  if (error) throw error

  const pageCounts = data.reduce((acc: any, view) => {
    if (!acc[view.page]) {
      acc[view.page] = 0
    }
    acc[view.page]++
    return acc
  }, {})

  return Object.entries(pageCounts).map(([page, views]) => ({
    page,
    views: views as number
  }))
}

export async function getViewsForPeriod(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { count, error } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())

  if (error) throw error
  return count || 0
}

export async function getOrdersForPeriod(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())

  if (error) throw error
  return count || 0
}

export async function getRevenueForPeriod(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', startDate.toISOString())

  if (error) throw error

  return data?.reduce((acc, order) => acc + (order.total || 0), 0) || 0
}

