import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

export default function Terms() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 text-foreground transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="text-foreground font-semibold">
            {isAr ? 'شروط الخدمة والاستخدام' : 'Terms of Service'}
          </span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4" />
            {isAr ? 'اتفاقية الاستخدام' : 'Legal Terms'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {isAr ? 'شروط الخدمة والتعاقد — EVO' : 'EVO Terms of Service'}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isAr
              ? 'آخر تحديث: 2026. تطبق هذه الشروط على جميع عمليات الشراء والطلبات داخل جمهورية مصر العربية.'
              : 'Last Updated: 2026. These terms govern all orders and interactions across Egypt.'}
          </p>
        </motion.div>

        {/* Content Blocks */}
        <div className="space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isAr ? '1. مقدمة وهوية المتجر' : '1. Overview & Brand Identity'}
            </h2>
            <p>
              {isAr
                ? 'مرحباً بك في متجر EVO Streetwear. تمثل هذه الاتفاقية عقداً ملزماً بين العميل ومتجر EVO بجمهورية مصر العربية. استخدامك للموقع وطلبك لأي من منتجاتنا يعني موافقتك الصريحة على جميع الشروط الواردة في هذه الوثيقة وقوانين حماية المستهلك المصري (القانون رقم 181 لسنة 2018).'
                : 'Welcome to EVO Streetwear. By accessing our platform or placing an order, you agree to these Terms governed by Egyptian E-Commerce and Consumer Protection laws (Law No. 181 of 2018).'}
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isAr ? '2. الطلبات والأسعار والشحن' : '2. Orders, Pricing & Fixed Shipping'}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {isAr
                  ? 'جميع الأسعار المعروضة بالجنيه المصري (EGP) شاملة قيمة المنتج.'
                  : 'All prices are clearly stated in Egyptian Pounds (EGP).'}
              </li>
              <li>
                {isAr
                  ? 'تطبق مصاريف شحن موحدة وثابتة بقيمة 25 ج.م لجميع المحافظات بدون أي زيادة، ولا نوفر شحناً مجانياً تحت أي مسمى.'
                  : 'A fixed nationwide delivery fee of 25 EGP applies to all orders across Egypt. We do not offer free shipping.'}
              </li>
              <li>
                {isAr
                  ? 'طريقة الدفع المعتمدة هي الدفع نقداً عند الاستلام (COD) لباب البيت.'
                  : 'All transactions are finalized via Cash on Delivery (COD) upon inspection.'}
              </li>
            </ul>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isAr ? '3. سياسة المعاينة والاستبدال' : '3. Inspection & 14-Day Exchange'}
            </h2>
            <p>
              {isAr
                ? 'يحق للعميل معاينة التيشيرت وفحص القماش والمقاس أمام مندوب الشحن قبل سداد القيمة. كما نوفر خدمة استبدال المقاس خلال 14 يوماً من الاستلام بشرط بقاء المنتج غير ملبوس وفي حالته وتغليفه الأصلي مع التيكت، ويتم التنسيق عبر واتساب الرسمي.'
                : 'Customers are entitled to inspect garments upon delivery before payment. Size exchanges are supported within 14 days of delivery for unworn, unwashed items with tags intact via our official WhatsApp channel.'}
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isAr ? '4. حقوق الملكية الفكرية' : '4. Intellectual Property & Artwork'}
            </h2>
            <p>
              {isAr
                ? 'جميع التصاميم الجرافيكية، الشعارات، الصور الفوتوغرافية، والهوية البصرية لعلامة EVO هي ملكية حصرية ولا يجوز نسخها أو إعادة إنتاجها تجارياً دون إذن كتابي مسبق.'
                : 'All graphic designs, artwork, typography, and photography featured on EVO are proprietary intellectual property. Unauthorized commercial reproduction is prohibited.'}
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isAr ? '5. خدمة العملاء والتواصل' : '5. Support & Inquiries'}
            </h2>
            <p>
              {isAr
                ? 'لأي استفسار أو متابعة شحنة أو طلب استبدال، تواصل مباشرة مع فريق EVO عبر واتساب على الرقم: +201277627382 أو عبر البريد: evo.brand.eg@gmail.com'
                : 'For inquiries or support, contact EVO directly via WhatsApp at +201277627382 or email us at evo.brand.eg@gmail.com'}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
