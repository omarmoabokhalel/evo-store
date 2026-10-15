import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, UserCheck, PhoneCall, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'

export default function Privacy() {
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
            {isAr ? 'سياسة الخصوصية وأمان البيانات' : 'Privacy Policy'}
          </span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            {isAr ? 'خصوصية وأمان 100%' : 'Data Privacy Guaranteed'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            {isAr ? 'سياسة الخصوصية — EVO Streetwear' : 'EVO Privacy Policy'}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isAr
              ? 'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية واستخدامها حصراً لتوصيل طلباتك بأمان.'
              : 'We respect your personal privacy and strictly utilize your details for order delivery and courier coordination.'}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#6B46C1]" />
              {isAr ? '1. البيانات التي نجمعها' : '1. Information We Collect'}
            </h2>
            <p>
              {isAr
                ? 'عند إتمام طلبك على متجر EVO، نطلب فقط البيانات الأساسية اللازمة لإيصال الشحنة لباب بيتك: الاسم الكامل، رقم الهاتف (للتواصل عند وصول المندوب)، وعنوان التوصيل التفصيلي والمحافظة.'
                : 'When placing an order, we collect only the essential information needed to fulfill your shipment: customer full name, contact phone number, and delivery street address and governorate.'}
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-500" />
              {isAr ? '2. لا يتم تخزين أي بيانات بنكية أو بطاقات دفع' : '2. Zero Financial Data Stored'}
            </h2>
            <p>
              {isAr
                ? 'نظراً لأن نظام الدفع المعتمد في متجر EVO هو الدفع نقداً عند الاستلام (COD)، فإننا لا نطلب ولا نخزن أي أرقام بطاقات ائتمانية أو بيانات بنكية على الإطلاق، مما يوفر لك أعلى درجات الأمان وراحة البال.'
                : 'Because EVO operates on a Cash on Delivery (COD) basis, we never request or store sensitive banking, credit card, or financial details, ensuring maximum peace of mind.'}
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-blue-500" />
              {isAr ? '3. التواصل عبر واتساب والشحن' : '3. WhatsApp & Courier Communications'}
            </h2>
            <p>
              {isAr
                ? 'يتم استخدام رقم هاتفك لتأكيد تفاصيل الطلب وتحديثات مسار الشحنة عبر واتساب، ولاتصال مندوب شركة الشحن بك لتحديد موعد التسليم. نحن لا نبيع ولا نشارك بياناتك مع أي جهة خارجية تسويقية مطلقاً.'
                : 'Your contact phone number is utilized strictly to provide order tracking updates via WhatsApp and for courier delivery coordination. We never share or sell customer data to third-party marketing entities.'}
            </p>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {isAr ? '4. تواصل مع مسؤول الخصوصية' : '4. Privacy Inquiries'}
            </h2>
            <p>
              {isAr
                ? 'إذا كانت لديك أي استفسارات أو رغبة في تعديل أو حذف بياناتك من سجلات التوصيل، تواصل معنا في أي وقت عبر البريد الإلكتروني: evo.brand.eg@gmail.com أو عبر واتساب: +201277627382'
                : 'If you have questions regarding data privacy or wish to update delivery records, contact us at evo.brand.eg@gmail.com or via WhatsApp at +201277627382.'}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
