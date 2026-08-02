import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Search,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '@/services/orders'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'

export default function OrderTracking() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const { orderId } = useParams<{ orderId: string }>()
  const [searchId, setSearchId] = useState('')

  // Fetch order by ID from Supabase
  const { data: order, isLoading, error } = useQuery({ queryKey: ['order', orderId], queryFn: () => getOrderById(orderId || ''), enabled: !!orderId })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      window.location.href = `/track-order/${searchId.trim()}`
    }
  }

  const getStatusSteps = (status: string) => {
    const steps = [
      {
        id: 'pending',
        label: t.statusPending,
        icon: Package,
        desc: language === 'ar' ? t.trackingSteps.pending : 'We have received your order',
      },
      {
        id: 'processing',
        label: t.statusProcessing,
        icon: Clock,
        desc: language === 'ar' ? t.trackingSteps.processing : 'Preparing your items',
      },
      {
        id: 'shipped',
        label: t.statusShipped,
        icon: Truck,
        desc: language === 'ar' ? t.trackingSteps.shipped : 'Your order is on the way',
      },
      {
        id: 'delivered',
        label: t.statusDelivered,
        icon: CheckCircle,
        desc: language === 'ar' ? t.trackingSteps.delivered : 'Order delivered successfully',
      },
    ]

    const currentIndex = steps.findIndex((s) => s.id === status)
    return steps.map((step, i) => ({
      ...step,
      isComplete: i <= currentIndex,
      isCurrent: i === currentIndex,
    }))
  }

  const getTranslatedColor = (colorName: string) => {
    if (language === 'en') return colorName;
    const colorMap: Record<string, string> = {
      Black: 'أسود',
      White: 'أبيض',
      Grey: 'رمادي',
      Navy: 'كحلي',
      Red: 'أحمر',
      Violet: 'بنفسجي',
      Olive: 'زيتي',
      Pink: 'روز',
      Cream: 'كريمي',
    }
    return colorMap[colorName] || colorName;
  }

  const getTranslatedStatus = (status: string) => {
    if (status === 'pending') return t.statusPending
    if (status === 'processing') return t.statusProcessing
    if (status === 'shipped') return t.statusShipped
    if (status === 'delivered') return t.statusDelivered
    return t.statusCancelled
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#6B46C1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!order || error) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <Search className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-foreground">{t.trackTitle}</h1>
            <p className="text-muted-foreground mb-6">
              {language === 'ar' ? 'أدخل رقم طلبك لمتابعة خط سير الشحنة' : 'Enter your order ID to track your shipment'}
            </p>
            <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: EVO-XXXXX' : 'Enter order ID (e.g., EVO-XXXXX)'}
                className="flex-1 px-4 py-3 rounded-full bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all shadow-sm"
              >
                {language === 'ar' ? 'تتبع' : 'Track'}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  const steps = getStatusSteps(order.status)
  const progress = ((steps.filter((s) => s.isComplete).length - 1) / (steps.length - 1)) * 100

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors font-medium">{t.navHome}</Link>
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Link to="/profile" className="hover:text-foreground transition-colors font-medium">{t.profile}</Link>
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-foreground font-bold">{t.trackTitle}</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground mb-2">
            {language === 'ar' ? 'طلب رقم' : 'Order #'} {order.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {language === 'ar' ? 'تم الطلب في ' : 'Placed on '}
            {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-card border border-border mb-8 shadow-sm"
        >
          {/* Progress Bar */}
          <div className="relative h-2.5 bg-foreground/5 rounded-full mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, progress)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`absolute h-full rounded-full bg-gradient-to-r ${language === 'ar' ? 'from-[#3B82F6] to-[#6B46C1] right-0' : 'from-[#6B46C1] to-[#3B82F6] left-0'}`}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                    step.isComplete
                      ? 'bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] text-white shadow-sm'
                      : 'bg-foreground/5 text-muted-foreground'
                  }`}
                >
                  <step.icon
                    className={`w-5 h-5 ${step.isComplete ? 'text-white' : 'text-muted-foreground/50'}`}
                  />
                </div>
                <p className={`text-xs sm:text-sm font-bold ${step.isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-1 line-clamp-2 leading-relaxed hidden sm:block">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Items */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <h2 className="font-bold text-foreground mb-4 border-b border-border pb-2">
              {language === 'ar' ? 'المنتجات المطلوبة' : 'Order Items'}
            </h2>
            <div className="space-y-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-xl border border-border bg-foreground/5"
                  />
                  <div>
                    <p className="font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.size}: {item.size} / {t.color}: {getTranslatedColor(item.color)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.quantityAbbr}: {item.quantity}
                    </p>
                    <p className="font-bold text-foreground text-sm mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-2">
                <MapPin className="w-5 h-5 text-[#6B46C1]" />
                {t.shippingAddress}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{order.address}</p>
              <div className="flex items-center gap-2 mt-4 text-muted-foreground text-xs font-semibold">
                <Phone className="w-4 h-4 text-[#6B46C1]" />
                <span dir="ltr">{order.phone}</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
              <h2 className="font-bold text-foreground mb-4 border-b border-border pb-2">
                {language === 'ar' ? 'تفاصيل الدفع الكلي' : 'Payment Summary'}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.paymentMethod}</span>
                  <span className="flex items-center gap-1.5 text-foreground font-semibold">
                    {order.payment_method === 'cod' ? (
                      <Banknote className="w-4 h-4 text-[#FBBF24]" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                    )}
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'instapay' ? 'Instapay' : 'Vodafone Cash'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.orderStatus}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                    'bg-[#6B46C1]/10 text-[#6B46C1]'
                  }`}>
                    {getTranslatedStatus(order.status)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border mt-3">
                  <span className="text-foreground">{t.total}</span>
                  <span className="text-gradient">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Track Another */}
        <div className="mt-8 text-center">
          <Link
            to="/track-order/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 border border-border text-muted-foreground hover:text-foreground transition-all shadow-sm"
          >
            <Search className="w-4 h-4" />
            {language === 'ar' ? 'تتبع شحنة تانية' : 'Track Another Order'}
          </Link>
        </div>
      </div>
    </main>
  )
}
