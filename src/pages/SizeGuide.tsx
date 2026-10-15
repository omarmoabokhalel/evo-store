import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Ruler, Sparkles, User, HelpCircle, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { sizeChart } from '@/data/products'
import { BRAND_CONFIG, getWhatsAppSupportUrl } from '@/config/brand'

export default function SizeGuide() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'
  const whatsappUrl = getWhatsAppSupportUrl(
    isAr ? 'مرحبا EVO، أحتاج مساعدة في اختيار المقاس المناسب لتيشيرت الأوفرسايز' : 'Hi EVO, I need help choosing the right oversized t-shirt size for me',
    isAr
  )

  const chartData = sizeChart.unisex

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
            {isAr ? 'دليل المقاسات الأوفرسايز' : 'Size Guide'}
          </span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <Ruler className="w-4 h-4" />
            {isAr ? 'قصة ستريت وير أوفرسايز' : 'Streetwear Oversized Fit'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {isAr ? 'جدول المقاسات والأبعاد بالسنتمتر' : 'EVO Oversized Size Guide'}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'تصاميم EVO مصممة بقصة أوفرسايز بوكسي (Boxy Fit) مع أكتاف منسدلة (Dropped Shoulders). اطلع على القياسات الدقيقة بالسنتيمتر لاختيار مقاسك المفضل.'
              : 'All EVO t-shirts are tailored with a relaxed boxy oversized streetwear silhouette and dropped shoulders. Review exact centimeter measurements below.'}
          </p>
        </motion.div>

        {/* Model Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-white mb-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs text-[#6B46C1] dark:text-[#A78BFA] font-bold uppercase tracking-wider block">
                {isAr ? 'مرجع الموديل للتصوير' : 'Photo Shoot Model Reference'}
              </span>
              <p className="text-lg sm:text-xl font-black">
                {isAr ? BRAND_CONFIG.modelInfoAr : BRAND_CONFIG.modelInfo}
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                {isAr
                  ? 'وزن الموديل 78 كجم بطول 180 سم، يرتدي مقاس L لإطلالة أوفرسايز مريحة.'
                  : 'Model weight: 78kg, Height: 180cm, wearing Size L for a natural oversized streetwear silhouette.'}
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="shrink-0 px-6 py-3 rounded-full bg-white text-black text-xs sm:text-sm font-bold hover:bg-zinc-200 transition-colors"
          >
            {isAr ? 'تسوق التيشيرتات' : 'Shop T-Shirts'}
          </Link>
        </motion.div>

        {/* Size Chart Table */}
        <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm mb-12">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isAr ? 'جدول القياسات بالسنتيمتر (CM)' : 'Centimeter Size Chart (CM)'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {isAr ? 'القياسات مأخوذة بشكل مسطح للتيشيرت' : 'Measurements taken flat across the garment'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-muted-foreground text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#6B46C1]" />
              {isAr ? 'للجنسين (Unisex)' : 'Unisex Streetwear Fit'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="bg-foreground/5 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                  <th className="py-4 px-6 text-start font-bold text-foreground">{isAr ? 'المقاس' : 'Size'}</th>
                  <th className="py-4 px-6 text-start font-bold">{isAr ? 'عرض الصدر (سم)' : 'Chest Width (cm)'}</th>
                  <th className="py-4 px-6 text-start font-bold">{isAr ? 'طول التيشيرت (سم)' : 'Body Length (cm)'}</th>
                  <th className="py-4 px-6 text-start font-bold">{isAr ? 'الوزن الموصى به (كجم)' : 'Recommended Weight (kg)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {chartData.map((row) => (
                  <tr key={row.size} className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="py-4 px-6 font-black text-base text-[#6B46C1]">
                      {row.size}
                    </td>
                    <td className="py-4 px-6 text-foreground font-semibold">
                      {row.chest} cm
                    </td>
                    <td className="py-4 px-6 text-foreground font-semibold">
                      {row.length} cm
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {row.weight} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure & Fit Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Ruler className="w-5 h-5 text-[#6B46C1]" />
              {isAr ? 'كيف تقيس تيشيرتك المفضل؟' : 'How to Measure at Home'}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">{isAr ? 'عرض الصدر (Chest Width):' : 'Chest Width:'}</strong>{' '}
                {isAr
                  ? 'افرد تيشيرت مفضل لديك على سطح مستوٍ وقس المسافة بين الإبطين بالسنتيمتر.'
                  : 'Lay your favorite t-shirt flat and measure across from armpit to armpit in centimeters.'}
              </p>
              <p>
                <strong className="text-foreground">{isAr ? 'طول التيشيرت (Body Length):' : 'Body Length:'}</strong>{' '}
                {isAr
                  ? 'قس من أعلى نقطة عند الكتف بجانب الياقة وحتى نهاية الحافة السفلية للتيشيرت.'
                  : 'Measure from the highest point of the shoulder down to the bottom hem.'}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#3B82F6]" />
              {isAr ? 'نصيحة اختيار الستايل (Fit Advice)' : 'Fit & Styling Advice'}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">{isAr ? 'لإطلالة ستريت وير أوفرسايز:' : 'For True Oversized Streetwear:'}</strong>{' '}
                {isAr
                  ? 'اطلب مقاسك المعتاد؛ التيشيرت مصمم تلقائياً ليكون واسعاً ومريحاً مع أكتاف منسدلة عصرية.'
                  : 'Order your standard size; the silhouette is naturally designed to drape with dropped shoulders and a boxy chest.'}
              </p>
              <p>
                <strong className="text-foreground">{isAr ? 'لإطلالة مظبوطة كلاسيك:' : 'For a Regular Fit:'}</strong>{' '}
                {isAr
                  ? 'إذا كنت تفضل التيشيرت غير واسع كثيراً، اختر مقاساً أقل بدرجة واحدة.'
                  : 'If you prefer a closer, traditional fit, consider sizing down one size.'}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Assistance Banner */}
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">
            {isAr ? 'محتار تختار بين مقاسين؟' : 'Still unsure about which size to pick?'}
          </h3>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            {isAr
              ? 'أرسل لنا طولك ووزنك عبر واتساب وسيقوم فريق EVO بمساعدتك في اختيار المقاس المثالي لجسمك فوراً.'
              : 'Send us your height and weight on WhatsApp and our team will recommend your perfect fit instantly.'}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:opacity-90 transition-all shadow-lg text-sm sm:text-base"
          >
            <MessageCircle className="w-5 h-5" />
            {isAr ? 'اسأل عن مقاسك عبر واتساب' : 'Ask Sizing Advice on WhatsApp'}
          </a>
        </div>
      </div>
    </main>
  )
}
