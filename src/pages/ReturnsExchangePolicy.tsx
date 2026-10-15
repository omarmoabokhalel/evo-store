import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { RotateCcw, CheckCircle2, AlertCircle, MessageCircle, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { getWhatsAppExchangeUrl } from '@/config/brand'

export default function ReturnsExchangePolicy() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'
  const whatsappUrl = getWhatsAppExchangeUrl(undefined, isAr)

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
            {isAr ? 'سياسة الاستبدال والاسترجاع' : 'Returns & Exchange Policy'}
          </span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <RotateCcw className="w-4 h-4" />
            {isAr ? 'مرونة وضمان المقاس' : 'Hassle-Free Size Exchanges'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {isAr ? 'سياسة استبدال المقاس (14 يوماً)' : '14-Day Size Exchange Policy'}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'حرصاً منا على تجربة ستريت وير مثالية، نوفر لك سياسة استبدال مقاس واقعية ومباشرة وسريعة خلال 14 يوماً عبر واتساب.'
              : 'To guarantee the perfect streetwear fit, we offer a realistic and fast 14-day size exchange process directly coordinated via WhatsApp.'}
          </p>
        </motion.div>

        {/* Highlight Card */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-white mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#6B46C1]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              {isAr ? 'ضمان المقاس المضبوط' : 'Perfect Fit Guarantee'}
            </span>
            <h2 className="text-2xl font-bold">
              {isAr ? 'المقاس مش مظبوط عليك أو حابب تبدله؟' : 'Need a different size?'}
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {isAr
                ? 'لو التيشيرت الأوفرسايز طلع واسع زيادة أو محتاج مقاس أكبر/أصغر، متاح تبدله بين (M, L, XL, 2XL) خلال 14 يوم من الاستلام، بشرط أن تكون القطعة بحالتها الأصلية غير ملبوسة ومعها التيكت والغلاف.'
                : 'If your oversized t-shirt feels too big or you need a different size (M, L, XL, 2XL), you can request an exchange within 14 days of delivery, provided the item is unworn, unwashed, and in its original packaging with tags.'}
            </p>
          </div>
        </div>

        {/* Eligibility Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Accepted */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              {isAr ? 'شروط قبول الاستبدال' : 'Exchange Acceptance Criteria'}
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{isAr ? 'تقديم طلب الاستبدال خلال 14 يوماً من تاريخ استلام الشحنة.' : 'Request submitted within 14 days of receiving your order.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{isAr ? 'التيشيرت في حالته الأصلية تماماً: غير ملبوس للخروج، غير مغسول، وبدون أي روائح أو بقع.' : 'Garment is strictly unworn, unwashed, clean, and free of odors or perfumes.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{isAr ? 'وجود بطاقة المقاس (التيكت) وجميع ملحقات التغليف الأصلية.' : 'Original hangtags and internal packaging are intact.'}</span>
              </li>
            </ul>
          </div>

          {/* Not Accepted */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              {isAr ? 'حالات لا يشملها الاستبدال' : 'Non-Eligible Cases'}
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{isAr ? 'المنتجات التي تم غسلها أو كيها مباشرة على الطباعة.' : 'Items that have been washed, dried, or directly ironed over the print.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{isAr ? 'القطع التي تمت إزالة التيكت عنها أو ظهر عليها علامات الاستعمال.' : 'Items with removed tags or showing signs of daily wear.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{isAr ? 'الطلبات التي مر على استلامها أكثر من 14 يوماً.' : 'Exchange requests submitted after the 14-day window.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Step WhatsApp Exchange Process */}
        <div className="p-8 rounded-3xl bg-card border border-border mb-12 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {isAr ? 'كيف تطلب استبدال المقاس عبر واتساب؟ (3 خطوات)' : 'How to Request an Exchange via WhatsApp (3 Steps)'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-foreground/5 border border-border/50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#6B46C1] text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-foreground text-sm">
                {isAr ? 'راسلنا على واتساب' : 'Chat on WhatsApp'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? 'أرسل لنا رقم طلبك وصورة للقطعة مع ذكر المقاس الجديد المطلوب (M, L, XL, 2XL).'
                  : 'Send us your Order # and mention the new size you need (M, L, XL, 2XL).'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-foreground/5 border border-border/50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#6B46C1] text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-foreground text-sm">
                {isAr ? 'تأكيد وحجز المقاس' : 'Size Reservation'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? 'فريق الدعم يؤكد توفر المقاس ويحجز القطعة لك فوراً، ثم يرسل بوليصة استبدال لشركة الشحن.'
                  : 'Our team reserves your new size immediately and dispatches an exchange courier order.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-foreground/5 border border-border/50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#6B46C1] text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-foreground text-sm">
                {isAr ? 'تبادل القطع عند الباب' : 'Doorstep Swap'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? 'المندوب يسلمك المقاس الجديد ويستلم منك القطعة القديمة لباب بيتك (تطبق مصاريف شحن المندوب 25 ج).'
                  : 'Courier brings your new piece and collects the previous one at your doorstep (courier fee 25 EGP).'}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">
            {isAr ? 'محتاج تبدل مقاس طلبك الآن؟' : 'Ready to exchange your size?'}
          </h3>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            {isAr
              ? 'اضغط على الزر التالي للتواصل المباشر مع خدمة عملاء EVO على واتساب لبدء إجراءات الاستبدال في ثوانٍ.'
              : 'Click below to initiate your size exchange with the EVO support team in seconds.'}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <MessageCircle className="w-5 h-5" />
            {isAr ? 'ابدأ طلب استبدال المقاس عبر واتساب' : 'Request Size Exchange on WhatsApp'}
          </a>
        </div>
      </div>
    </main>
  )
}
