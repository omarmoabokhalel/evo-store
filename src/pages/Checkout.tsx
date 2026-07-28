import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  CreditCard,
  Banknote,
  ChevronRight,
  ChevronLeft,
  Lock,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider'
import { trpc } from '@/providers/trpc'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { toast } from 'sonner'
import { colorOptions } from '@/data/products'

export default function Checkout() {
  const { language } = useLanguageStore()
  const t = translations[language]
  // Helper to get localized color name
  const getColorName = (value: string) => {
    const originalName = colorOptions.find((c) => c.value === value)?.name || value;
    if (language === 'en') return originalName;
    const colorMap: Record<string, string> = {
      Black: 'أسود',
      White: 'أبيض',
      Grey: 'رمادي',
      Navy: 'كحلي',
      Red: 'أحمر',
      Violet: 'بنفسجي',
      Olive: 'زيتي',
      Pink: 'روز (بمبي)',
      Cream: 'كريمي',
    };
    return colorMap[originalName] || originalName;
  };
  const { user } = useSupabaseAuth()
  const { data: cartItems } = trpc.cart.get.useQuery(undefined, {
    enabled: !!user
  })
  const createOrder = trpc.orders.create.useMutation()
  const clearCart = trpc.cart.clear.useMutation()
  const navigate = useNavigate()

  const items = cartItems || []

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod' as 'cod' | 'online',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const discount = 0 // TODO: Add wheel discount from Supabase
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * (1 - item.product.discount / 100) * item.quantity), 0)
  const discountAmount = subtotal * (discount / 100)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal - discountAmount + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error(t.emptyCartTitle)
      return
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة! ⚠️' : 'Please fill all required fields')
      return
    }

    setIsProcessing(true)

    try {
      const order = await createOrder.mutateAsync({
        total,
        paymentMethod: formData.paymentMethod,
        address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        phone: formData.phone,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      })

      await clearCart.mutateAsync()

      toast.success(language === 'ar' ? 'تم تأكيد طلبك بنجاح! 🎉' : 'Order placed successfully!')
      navigate(`/track-order/${order.id}`)
    } catch (error: any) {
      toast.error(error.message || (language === 'ar' ? 'فشل إنشاء الطلب' : 'Failed to create order'))
    } finally {
      setIsProcessing(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-28 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-foreground">{t.emptyCartTitle}</h1>
          <p className="text-muted-foreground mb-6">{t.emptyCartDesc}</p>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all shadow-md"
          >
            {t.continueShopping}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors font-medium">{t.navHome}</Link>
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Link to="/shop" className="hover:text-foreground transition-colors font-medium">{t.navShop}</Link>
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-foreground font-bold">{t.checkout}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground">{t.checkoutTitle}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm"
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-[#6B46C1]" />
                  {t.billingDetails}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-muted-foreground mb-2">{t.fullName} *</label>
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                      placeholder={language === 'ar' ? 'أحمد محمد' : 'John Doe'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.emailAddress} *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.phoneNumber} *</label>
                    <div className="relative">
                      <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full ps-11 pe-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                        placeholder="+20 123 456 7890"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm"
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-[#6B46C1]" />
                  {language === 'ar' ? 'عنوان التوصيل' : 'Shipping Address'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.shippingAddress} *</label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                      placeholder={language === 'ar' ? 'اسم الشارع، رقم العمارة والشقة' : '123 Street Name, Building'}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{language === 'ar' ? 'المحافظة / المدينة *' : 'City *'}</label>
                      <input
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                        placeholder={language === 'ar' ? 'القاهرة / الجيزة' : 'Cairo'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{language === 'ar' ? 'الرمز البريدي (اختياري)' : 'Postal Code'}</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm"
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Lock className="w-5 h-5 text-[#6B46C1]" />
                  {t.paymentMethod}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField('paymentMethod', 'cod')}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#6B46C1] bg-[#6B46C1]/5'
                        : 'border-border hover:border-foreground/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center shrink-0">
                      <Banknote className="w-6 h-6 text-[#FBBF24]" />
                    </div>
                    <div className="text-start">
                      <p className="font-bold text-foreground">{t.codLabel}</p>
                      <p className="text-sm text-muted-foreground">{t.codDesc}</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('paymentMethod', 'online')}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === 'online'
                        ? 'border-[#6B46C1] bg-[#6B46C1]/5'
                        : 'border-border hover:border-foreground/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-[#3B82F6]" />
                    </div>
                    <div className="text-start">
                      <p className="font-bold text-foreground">{t.onlineLabel}</p>
                      <p className="text-sm text-muted-foreground">{t.onlineDesc}</p>
                    </div>
                  </button>
                </div>
              </motion.div>

              {!isLoggedIn && (
                <div className="p-4 rounded-2xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-sm text-[#FBBF24]">
                  <Link to="/login" className="underline hover:no-underline font-bold">
                    {t.login}
                  </Link>{' '}
                  {language === 'ar'
                    ? 'لحفظ سجل مشترياتك وتتبع شحنتك بسهولة في أي وقت!'
                    : 'to save your order history and track your orders easily.'}
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">{t.orderSummary}</h2>

              {/* Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-xl border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} / {getColorName(item.color)}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-2">
                        ${(item.product.price * (1 - item.product.discount / 100) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500 font-bold">{t.wheelDiscount.replace('{percent}', String(discount))}</span>
                    <span className="text-green-500 font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'ar' ? 'الشحن والتوصيل' : 'Shipping'}</span>
                  <span className={shipping === 0 ? 'text-green-500 font-bold' : 'text-foreground font-medium'}>
                    {shipping === 0 ? (language === 'ar' ? 'مجاناً' : 'Free') : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span className="text-foreground">{t.total}</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full py-4 rounded-full font-bold transition-all shadow-md ${
                  isProcessing
                    ? 'bg-foreground/10 text-muted-foreground cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white hover:opacity-90 hover:scale-101'
                }`}
              >
                {isProcessing ? t.orderProcessing : `${t.placeOrder} - $${total.toFixed(2)}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-green-500" />
                {language === 'ar' ? 'دفع آمن ومشفر 100%' : 'Secure SSL Encrypted Payment'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
