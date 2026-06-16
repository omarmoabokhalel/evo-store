import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Sparkles,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { demoProducts, sizeChart, colorOptions } from '@/data/products'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { toast } from 'sonner'

export default function ProductDetail() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const product = demoProducts.find((p) => p.id === productId)
  const { addItem } = useCartStore()
  const { addViewed } = useAuthStore()

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showAITryOn, setShowAITryOn] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Track viewed
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0])
      setSelectedSize(product.sizes[Math.floor(product.sizes.length / 2)])
      addViewed({ id: product.id, name: product.name, image: product.image, viewedAt: new Date().toISOString() })
    }
  }, [product, addViewed])

  if (!product) {
    return (
      <main className="min-h-screen bg-background pt-28 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-foreground">{t.productNotFound}</h1>
          <Link to="/shop" className="text-[#6B46C1] hover:underline font-bold">
            {t.backToShop}
          </Link>
        </div>
      </main>
    )
  }

  const discountedPrice = product.price * (1 - product.discount / 100)
  const relatedProducts = demoProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error(language === 'ar' ? 'من فضلك اختار المقاس واللون أولاً!' : 'Please select size and color')
      return
    }
    addItem(product, selectedSize, selectedColor)
    toast.success(language === 'ar' ? 'تمت الإضافة للشنطة بنجاح! 🛍️' : 'Added to cart successfully!')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } catch {
      navigator.clipboard.writeText(window.location.href)
      toast.success(language === 'ar' ? 'تم نسخ الرابط لشير سهل! 🔗' : 'Link copied to clipboard!')
    }
  }

  const getColorName = (value: string) => {
    const originalName = colorOptions.find((c) => c.value === value)?.name || value
    if (language === 'en') return originalName
    
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
    }
    return colorMap[originalName] || originalName
  }

  const getCategoryLabel = (catId: string) => {
    if (catId === 'men') return t.navMen
    if (catId === 'women') return t.navWomen
    return language === 'ar' ? 'للجنسين' : 'Unisex'
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors font-medium">{t.navHome}</Link>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Link to="/shop" className="hover:text-foreground transition-colors font-medium">{t.navShop}</Link>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Link to={`/shop/${product.category}`} className="hover:text-foreground transition-colors capitalize font-medium">
            {getCategoryLabel(product.category)}
          </Link>
          {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="text-foreground truncate max-w-[200px] font-bold">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-foreground/5 border border-border/30">
              <img
                src={product.images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-4 start-4 px-4 py-2 rounded-full bg-[#FF2A2A] text-white font-bold text-sm shadow-md">
                  -{product.discount}% {t.off}
                </span>
              )}
              {product.stock < 20 && (
                <div className="absolute bottom-4 start-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm shadow-sm text-white">
                  <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />
                  <span className="text-sm font-medium">{t.inStockLeft.replace('{count}', String(product.stock))}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-foreground/5 transition-all ${
                    activeImage === i ? 'border-[#6B46C1] scale-95 shadow-sm' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {product.isNew && (
                  <span className="px-3 py-1 rounded-full bg-[#6B46C1]/20 text-[#6B46C1] text-xs font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'جديد' : 'New Arrival'}
                  </span>
                )}
                {product.isSpecial && (
                  <span className="px-3 py-1 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'تصميم مميز' : 'Special Design'}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground mb-3">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gradient">${discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  <span className="px-3 py-1 rounded-full bg-[#FF2A2A]/20 text-[#FF2A2A] text-sm font-bold shadow-sm">
                    {t.saveAmount.replace('{amount}', `$${(product.price - discountedPrice).toFixed(2)}`)}
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{t.color}: <span className="text-muted-foreground font-normal">{getColorName(selectedColor)}</span></h3>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative w-12 h-12 rounded-full transition-all border border-border shadow-sm ${
                      selectedColor === color
                        ? 'ring-2 ring-[#6B46C1] ring-offset-2 ring-offset-background scale-95'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-5 h-5 ${color === '#FFFFFF' || color === '#F5F5DC' || color === '#FFC0CB' ? 'text-black' : 'text-white'}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{t.size}: <span className="text-muted-foreground font-normal">{selectedSize}</span></h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="flex items-center gap-1.5 text-sm text-[#6B46C1] hover:text-[#3B82F6] font-bold transition-colors"
                >
                  <Ruler className="w-4 h-4" />
                  {t.sizeGuide}
                </button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-xl font-bold text-sm transition-all border ${
                      selectedSize === size
                        ? 'bg-[#6B46C1] border-[#6B46C1] text-white shadow-md'
                        : 'bg-foreground/5 border-border text-muted-foreground hover:bg-foreground/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-center gap-3 bg-card border border-border rounded-full px-2 py-2 w-full sm:w-auto shrink-0 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-foreground text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                {t.addToCart}
              </button>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-border shadow-sm ${
                    isWishlisted
                      ? 'bg-[#FF2A2A]/20 text-[#FF2A2A] border-transparent'
                      : 'bg-card text-muted-foreground hover:bg-foreground/5'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="w-14 h-14 rounded-full bg-card border border-border text-muted-foreground hover:bg-foreground/5 flex items-center justify-center transition-all shadow-sm"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Try On */}
            <button
              onClick={() => setShowAITryOn(true)}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-[#6B46C1]/30 bg-[#6B46C1]/5 hover:bg-[#6B46C1]/10 transition-all shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-[#6B46C1]" />
              <span className="font-bold text-foreground">{t.tryWithAI}</span>
              <span className="text-muted-foreground text-sm">- {t.aiTryOnDesc}</span>
            </button>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
              {[
                { icon: Truck, label: t.freeShipping, desc: t.freeShippingDesc },
                { icon: RotateCcw, label: t.easyReturns, desc: t.easyReturnsDesc },
                { icon: Shield, label: t.securePayment, desc: t.securePaymentDesc },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center flex flex-col items-center">
                  <Icon className="w-6 h-6 text-[#6B46C1] mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 max-w-[150px]">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-16">
            <h2 className="text-2xl font-bold mb-8 text-foreground">{t.youMightAlsoLike}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-foreground/5 border border-border/30 mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.discount > 0 && (
                      <span className="absolute top-3 start-3 px-2 py-1 rounded-full bg-[#FF2A2A] text-white text-xs font-bold shadow-sm">
                        -{p.discount}%
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium group-hover:text-[#6B46C1] text-foreground transition-colors line-clamp-1">{p.name}</h3>
                  <p className="font-bold text-sm text-foreground mt-1">
                    ${(p.price * (1 - p.discount / 100)).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-2xl font-bold text-foreground">{t.sizeGuideTitle}</h2>
                <button onClick={() => setShowSizeChart(false)} className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Men */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  {t.sizeGuideMen}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-border bg-background">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-foreground/[0.02] text-foreground">
                        <th className="text-start py-3 px-4 font-semibold">{t.size}</th>
                        <th className="text-start py-3 px-4 font-semibold">{t.tableChest}</th>
                        <th className="text-start py-3 px-4 font-semibold">{t.tableLength}</th>
                        <th className="text-start py-3 px-4 font-semibold">{t.tableWeight}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.men.map((row) => (
                        <tr key={row.size} className="border-b border-border last:border-0 hover:bg-foreground/[0.01] transition-colors text-foreground">
                          <td className="py-3 px-4 font-bold">{row.size}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.chest}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.length}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Women */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <span className="w-3 h-3 rounded-full bg-[#EC4899]" />
                  {t.sizeGuideWomen}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-border bg-background">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-foreground/[0.02] text-foreground">
                        <th className="text-start py-3 px-4 font-semibold">{t.size}</th>
                        <th className="text-start py-3 px-4 font-semibold">{t.tableChest}</th>
                        <th className="text-start py-3 px-4 font-semibold">{t.tableLength}</th>
                        <th className="text-start py-3 px-4 font-semibold">{t.tableWeight}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.women.map((row) => (
                        <tr key={row.size} className="border-b border-border last:border-0 hover:bg-foreground/[0.01] transition-colors text-foreground">
                          <td className="py-3 px-4 font-bold">{row.size}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.chest}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.length}</td>
                          <td className="py-3 px-4 text-muted-foreground">{row.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Try On Modal */}
      <AnimatePresence>
        {showAITryOn && (
          <AITryOnModal
            product={product}
            selectedColor={selectedColor}
            onClose={() => setShowAITryOn(false)}
            t={t}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function AITryOnModal({
  product,
  selectedColor,
  onClose,
  t,
}: {
  product: typeof demoProducts[0]
  selectedColor: string
  onClose: () => void
  t: any
}) {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        setStep('processing')
        // Simulate AI processing
        setTimeout(() => {
          setStep('result')
        }, 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{t.aiTryOnTitle}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'upload' && (
          <div>
            <p className="text-muted-foreground mb-6">
              {t.aiTryOnInstructions}
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-[#6B46C1]/50 rounded-2xl p-12 text-center cursor-pointer hover:bg-foreground/[0.02] transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4 border border-border">
                <Sparkles className="w-8 h-8 text-[#6B46C1]" />
              </div>
              <p className="font-bold mb-2 text-foreground">{t.clickToUpload}</p>
              <p className="text-muted-foreground text-sm">{t.uploadLimits}</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#6B46C1]/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#6B46C1] animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#6B46C1]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{t.aiProcessing}</h3>
            <p className="text-muted-foreground">{t.aiDesigning}</p>
          </div>
        )}

        {step === 'result' && (
          <div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-foreground/5 border border-border/50 mb-6">
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <img src={uploadedImage} alt="Your photo" className="w-full h-full object-cover" />
                  {/* Overlay design preview */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div
                      className="w-48 h-60 rounded-xl border-2 border-[#6B46C1]/50 flex flex-col items-center justify-center p-4 backdrop-blur-xs"
                      style={{ backgroundColor: selectedColor + '40' }}
                    >
                      <img
                        src={product.image}
                        alt="Design"
                        className="w-32 h-40 object-contain opacity-85 mix-blend-overlay"
                      />
                      <p className="text-xs text-white/80 mt-2 text-center font-bold">AI Preview</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm text-center mb-4">
              {t.aiSimulatedPreview}
            </p>
            <button
              onClick={() => { setStep('upload'); setUploadedImage(null); }}
              className="w-full py-3 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold transition-all border border-border"
            >
              {t.tryAnotherPhoto}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
