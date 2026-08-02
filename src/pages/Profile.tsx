import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  User,
  ShoppingBag,
  Heart,
  Clock,
  ChevronRight,
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  LogOut,
  Settings,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { useQuery } from '@tanstack/react-query'
import { getOrdersByUserId } from '@/services/orders'

export default function Profile() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const { user, signOut, loading } = useSupabaseAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'settings'>('orders')

  // Fetch orders from Supabase
  const { data: orders = [] } = useQuery({ queryKey: ['orders', user?.id], queryFn: () => getOrdersByUserId(user?.id || ''), enabled: !!user })

  // Fetch favorites from localStorage
  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  // Re-fetch favorites when tab changes to favorites
  useEffect(() => {
    if (activeTab === 'favorites') {
      const saved = localStorage.getItem('favorites')
      setFavorites(saved ? JSON.parse(saved) : [])
    }
  }, [activeTab])

  // Placeholder for recently viewed products (to be implemented)
  const lastViewed: any[] = []

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-28 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6B46C1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-28 flex items-center justify-center transition-colors duration-300">
        <div className="text-center bg-card border border-border p-8 rounded-3xl max-w-sm w-full shadow-sm">
          <User className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            {language === 'ar' ? 'برجاء تسجيل الدخول' : 'Please Login'}
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            {language === 'ar' ? 'سجل دخول عشان تقدر تشوف حسابك وطلباتك بسهولة!' : 'Login to view your profile and orders'}
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all shadow-md"
          >
            {t.login}
          </Link>
        </div>
      </main>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-[#3B82F6] shrink-0" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-[#FF2A2A] shrink-0" />
      default:
        return <Clock className="w-5 h-5 text-[#FBBF24] shrink-0" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-500'
      case 'shipped':
        return 'bg-[#3B82F6]/10 text-[#3B82F6]'
      case 'cancelled':
        return 'bg-[#FF2A2A]/10 text-[#FF2A2A]'
      default:
        return 'bg-[#FBBF24]/10 text-[#FBBF24]'
    }
  }

  const getTranslatedStatus = (status: string) => {
    if (status === 'pending') return t.statusPending
    if (status === 'processing') return t.statusProcessing
    if (status === 'shipped') return t.statusShipped
    if (status === 'delivered') return t.statusDelivered
    return t.statusCancelled
  }

  const stats = [
    { label: language === 'ar' ? 'كل الطلبات' : 'Total Orders', value: orders.length, icon: ShoppingBag },
    { label: language === 'ar' ? 'طلبات نشطة' : 'Active Orders', value: orders.filter((o) => o.status === 'pending' || o.status === 'processing').length, icon: Package },
    { label: language === 'ar' ? 'تم التوصيل' : 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, icon: CheckCircle },
    { label: language === 'ar' ? 'المفضلة' : 'Wishlist', value: favorites.length, icon: Heart },
  ]

  const tabs = [
    { id: 'orders' as const, label: language === 'ar' ? 'طلباتي' : 'My Orders', icon: ShoppingBag },
    { id: 'favorites' as const, label: language === 'ar' ? 'المفضلة' : 'Favorites', icon: Heart },
    { id: 'settings' as const, label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
  ]

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-6 mb-8 flex-wrap sm:flex-nowrap">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center text-3xl font-bold text-white shadow-md">
              {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground">{user?.user_metadata?.name || user?.email?.split('@')[0]}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="ms-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-card border border-border shadow-sm"
              >
                <stat.icon className="w-5 h-5 text-[#6B46C1] mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide border-b border-border pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#6B46C1] text-white shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <ShoppingBag className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">{language === 'ar' ? 'لسة معملتش أي طلبات لحد دلوقتي' : 'No orders yet'}</p>
                  <Link
                    to="/shop"
                    className="inline-block px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all shadow-md"
                  >
                    {language === 'ar' ? 'ابدأ التسوق وعيش' : 'Start Shopping'}
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/track-order/${order.id}`}
                    className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-bold text-foreground">{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ms-auto">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${getStatusColor(order.status)}`}>
                          {getTranslatedStatus(order.status)}
                        </span>
                        {language === 'ar' ? (
                          <ChevronLeft className="w-5 h-5 text-muted-foreground/40" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item: any, i: number) => (
                          <img
                            key={i}
                            src={item.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border-2 border-background bg-foreground/5 shadow-sm"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {language === 'ar' ? 'منتجات' : `item${order.items.length > 1 ? 's' : ''}`} - <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <Heart className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">{language === 'ar' ? 'لسة معملتش أي منتجات مفضلة لحد دلوقتي' : 'No favorites yet'}</p>
                  <Link
                    to="/shop"
                    className="inline-block px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all shadow-md"
                  >
                    {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {favorites.map((item: any) => (
                    <Link key={item.id} to={`/product/${item.id}`} className="group block">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-foreground/5 border border-border/30 mb-3 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            const newFavorites = favorites.filter((f: any) => f.id !== item.id)
                            setFavorites(newFavorites)
                            localStorage.setItem('favorites', JSON.stringify(newFavorites))
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-[#6B46C1] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-[#6B46C1] mt-0.5">${item.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4 border-b border-border pb-2">
                  {language === 'ar' ? 'بيانات الحساب الشخصي' : 'Profile Information'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{language === 'ar' ? 'الاسم بالكامل' : 'Display Name'}</label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.emailAddress}</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground/5 border border-border">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4 border-b border-border pb-2">
                  {language === 'ar' ? 'عنوان التوصيل الافتراضي' : 'Shipping Address'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 text-[#6B46C1] shrink-0" />
                    <span>{language === 'ar' ? '123 منطقة الأزياء، القاهرة، مصر' : '123 Fashion District, Cairo, Egypt'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <Phone className="w-4 h-4 text-[#6B46C1] shrink-0" />
                    <span dir="ltr">+20 123 456 7890</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 rounded-full bg-[#6B46C1] text-white font-bold hover:opacity-90 transition-all shadow-md">
                {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
