import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Truck,
  Clock,
  ChevronRight,
  ChevronLeft,
  Search,
  MessageCircle,
  Banknote,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { getWhatsAppTrackingUrl } from '@/config/brand'

export default function OrderTracking() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'
  const t = translations[language]

  const { orderId } = useParams<{ orderId?: string }>()
  const initialId = orderId && orderId !== 'demo' ? orderId : ''
  const [typedOrderId, setTypedOrderId] = useState(initialId)

  // Direct WhatsApp URL based on order ID
  const whatsappUrl = getWhatsAppTrackingUrl(typedOrderId, isAr)

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t.navHome}
          </Link>
          {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="text-foreground font-semibold">
            {t.trackTitle}
          </span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <MessageCircle className="w-4 h-4" />
            {isAr ? 'تتبع فوري ومباشر عبر واتساب' : 'Direct WhatsApp Order Tracking'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {t.trackTitle}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t.trackSubtitle}
          </p>
        </motion.div>

        {/* Tracking Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleTrackSubmit} className="relative z-10 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                {t.trackOrderNo}
              </label>
              <div className="relative">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder={t.enterOrderNumber}
                  value={typedOrderId}
                  onChange={(e) => setTypedOrderId(e.target.value)}
                  className="w-full ps-12 pe-4 py-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-base"
                />
              </div>
            </div>

            {/* Prominent WhatsApp Tracking Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base sm:text-lg transition-all shadow-xl hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              <span>{t.trackViaWhatsApp}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </a>

            <p className="text-center text-xs text-zinc-400">
              {isAr
                ? 'سيتم توجيهك مباشرة لمحادثة فريق متابعة الشحن في EVO على واتساب برقم طلبك.'
                : 'You will be redirected to EVO Customer Care on WhatsApp with your order reference.'}
            </p>
          </form>
        </motion.div>

        {/* Shipping Promises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Truck className="w-4 h-4 text-[#6B46C1]" />
              {isAr ? 'شحن موحد 25 ج.م' : 'Flat 25 EGP Shipping'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isAr ? 'شحن ثابت لجميع المحافظات بدون أي مصاريف إضافية.' : 'Nominal fixed fee across all Egyptian governorates.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              {isAr ? '3-5 أيام عمل' : '3-5 Business Days'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isAr ? 'تجهيز سريع وفحص جودة قبل خروج الشحنة مع المندوب.' : 'Fast preparation and delivery straight to your doorstep.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Banknote className="w-4 h-4 text-emerald-500" />
              {isAr ? 'الدفع كاش عند الاستلام' : 'Cash on Delivery (COD)'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isAr ? 'معاينة تامة للتيشيرت والخامة قبل دفع المبلغ للمندوب.' : 'Inspect fabric, fit, and print before paying the courier.'}
            </p>
          </div>
        </div>

        {/* Why WhatsApp Tracking Explanation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#6B46C1]" />
            {t.trackingHelpTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t.trackingHelpDesc}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#6B46C1]">
            <Link to="/shipping-policy" className="hover:underline">
              {isAr ? '← تفاصيل سياسة الشحن' : 'Shipping Policy →'}
            </Link>
            <Link to="/returns-exchange-policy" className="hover:underline">
              {isAr ? '← سياسة استبدال المقاس' : 'Size Exchange Policy →'}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
