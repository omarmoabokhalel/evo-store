import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Truck, ShieldAlert, CheckCircle2, Clock, MapPin, Eye, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { getWhatsAppTrackingUrl } from '@/config/brand'

export default function ShippingPolicy() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'
  const whatsappUrl = getWhatsAppTrackingUrl(undefined, isAr)

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="text-foreground font-semibold">
            {isAr ? 'سياسة الشحن والتوصيل' : 'Shipping Policy'}
          </span>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Truck className="w-4 h-4" />
            {isAr ? 'شفافية كاملة في الشحن' : 'Transparent Flat-Rate Shipping'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {isAr ? 'سياسة الشحن والتسليم' : 'EVO Shipping & Delivery Policy'}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'كل ما تحتاج لمعرفته عن شحن طلباتك في مصر، مواعيد التوصيل، وإجراءات المعاينة عند الاستلام.'
              : 'Everything you need to know about order delivery across Egypt, delivery timelines, and courier inspection guidelines.'}
          </p>
        </motion.div>

        {/* Important Notice: NO Free Shipping & Fixed 25 EGP Flat Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 mb-10 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B46C1]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                {isAr ? 'تنويه هام للعملاء' : 'Important Shipping Notice'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isAr ? 'شحن موحد 25 ج.م فقط | لا يوجد شحن مجاني' : 'Fixed 25 EGP Flat Shipping | No Free Shipping'}
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? 'نحن نؤمن بالشفافية المطلقة ولا نرفع أسعار التيشيرتات لتغطية "شحن مجاني وهمي". نحدد مصاريف شحن رمزية ثابتة بقيمة 25 جنيه مصري فقط لجميع محافظات جمهورية مصر العربية بدون أي مصاريف خفية.'
                  : 'We prioritize honest, transparent pricing without inflating garment prices to claim "free shipping". We charge a nominal flat shipping fee of 25 EGP across all Egyptian governorates with zero hidden fees.'}
              </p>
            </div>
            <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 text-center sm:min-w-[150px]">
              <span className="block text-3xl font-black text-gradient">25 EGP</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                {isAr ? 'لكل المحافظات' : 'Nationwide Flat'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Flat 25 EGP */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#6B46C1]/10 text-[#6B46C1] flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {isAr ? 'تغطية لكافة محافظات مصر' : 'All Egyptian Governorates'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isAr
                ? 'القاهرة، الجيزة، الإسكندرية، محافظات الدلتا، القناة، والصعيد. أينما كنت داخل مصر، سعر الشحن ثابت 25 جنيه.'
                : 'Cairo, Giza, Alexandria, Delta, Canal cities, and Upper Egypt. Flat 25 EGP applies everywhere.'}
            </p>
          </div>

          {/* Delivery Window */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {isAr ? 'التوصيل خلال 3-5 أيام عمل' : '3-5 Business Days Delivery'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isAr
                ? 'يتم تجهيز قطعتك وفحص جودتها وشحنها لتصلك لباب البيت في غضون 3 إلى 5 أيام عمل من تاريخ تأكيد الطلب.'
                : 'Orders are prepared, quality-checked, and delivered to your doorstep within 3-5 business days.'}
            </p>
          </div>

          {/* COD & Inspection */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {isAr ? 'معاينة تامة قبل الدفع (COD)' : 'Full Inspection Before Payment'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isAr
                ? 'الدفع نقداً عند الاستلام. يحق لك فتح الطرد ومعاينة التيشيرت والخامة والمقاس أمام مندوب الشحن قبل دفع المبلغ.'
                : 'Cash on delivery. You have the full right to inspect fabric, print, and sizing with the courier before paying.'}
            </p>
          </div>
        </div>

        {/* Detailed Inspection Protocol */}
        <div className="p-8 rounded-3xl bg-card border border-border space-y-6 mb-12 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#6B46C1]" />
            {isAr ? 'إرشادات معاينة الشحنة مع المندوب' : 'Step-by-Step Courier Inspection Guidelines'}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              {isAr
                ? '1. عند وصول مندوب شركة الشحن، اطلب منه الانتظار لمعاينة المنتج والتأكد من مطابقته للطلب.'
                : '1. When the delivery courier arrives, request a moment to inspect your order.'}
            </p>
            <p>
              {isAr
                ? '2. تأكد من سلامة كيس التغليف الداخلي وتطابق المقاس (M, L, XL, 2XL) مع ما قمت باختياره.'
                : '2. Verify that the inner packaging is intact and the size label matches what you selected.'}
            </p>
            <p>
              {isAr
                ? '3. إذا كان التيشيرت مطابقاً وسليماً، سدد قيمة الطلب (599 ج للقطعة + 25 ج مصاريف الشحن) للمندوب نقداً.'
                : '3. If the item is satisfactory, hand the total COD amount (599 EGP per t-shirt + 25 EGP fixed shipping) to the courier.'}
            </p>
            <p>
              {isAr
                ? '4. في حال قررت عدم استلام الشحنة لأي سبب أثناء المعاينة، يمكنك إرجاعها فوراً مع المندوب وسداد مصاريف الشحن فقط (25 ج).'
                : '4. If you decide not to accept the shipment upon inspection, you may return it on the spot with the courier, paying only the 25 EGP courier fee.'}
            </p>
          </div>
        </div>

        {/* WhatsApp Tracking CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">
            {isAr ? 'عايز تتابع حالة شحنتك؟' : 'Need real-time shipment updates?'}
          </h3>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            {isAr
              ? 'فريق الدعم في EVO متاح عبر واتساب لتقديم تحديث لحظي برقم البوليصة وميعاد وصول المندوب.'
              : 'Our EVO support team is ready on WhatsApp to assist with waybill numbers and delivery coordination.'}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {isAr ? 'تتبع شحنتك عبر واتساب' : 'Track Your Shipment on WhatsApp'}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </main>
  )
}
