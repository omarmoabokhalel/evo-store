import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { addToCart as addShopifyCartLine } from '@/services/shopifyCart'
import { createShopifyCheckout } from '@/services/shopifyCheckout'

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
  X,
  Check,
  AlertTriangle,
  Star,
  Shirt,
  CheckCircle,
  PenLine,
} from 'lucide-react'
import { sizeChart, colorOptions, demoProducts } from '@/data/products'
import type { Product } from '@/data/products'
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductById, getProducts } from '@/services/products'
import { getProductByHandle as getShopifyProductByHandle, getAllProducts as getShopifyProducts, shopifyProductToAppProduct } from '@/services/shopifyProducts'
import { shouldUseShopify } from '@/config/shopify'
import { addCartItem } from '@/services/cart'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { trackPixelViewContent, trackPixelAddToCart } from '@/services/pixel'
import { toast } from 'sonner'

export default function ProductDetail() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'
  const t = translations[language]
  const { user } = useSupabaseAuth()

  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const useShopify = shouldUseShopify()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (useShopify) {
        const shopifyProduct = await getShopifyProductByHandle(id || '')
        if (shopifyProduct) {
          return shopifyProductToAppProduct(shopifyProduct)
        }
        // Fallback to demo products if handle not directly matched
        const demo = demoProducts.find(p => p.handle === id || String(p.id) === id)
        if (demo) return demo
        return null
      }
      const supabaseProduct = await getProductById(id || '')
      if (supabaseProduct) return supabaseProduct
      return demoProducts.find(p => p.handle === id || String(p.id) === id) || null
    },
    enabled: !!id
  })

  const addToCart = useMutation({
    mutationFn: addCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  // Normalize product
  const normalizedProduct: Product | null = product ? {
    ...product,
    isNew: product.isNew ?? product.is_new ?? true,
    isSpecial: product.isSpecial ?? product.is_special ?? false,
    designType: product.designType ?? product.design_type ?? 'streetwear',
    price: product.price || 599,
    sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['M', 'L', 'XL', '2XL'],
    colors: product.colors && product.colors.length > 0 ? product.colors : ['#000000', '#FFFFFF', '#4A3525'],
  } : null

  // Meta Pixel ViewContent event
  useEffect(() => {
    if (normalizedProduct) {
      trackPixelViewContent({
        content_name: normalizedProduct.name,
        content_ids: [normalizedProduct.id],
        value: parseFloat(normalizedProduct.price.toString()) || 599,
        currency: 'EGP',
      })
    }
  }, [normalizedProduct?.id])

  // Check wishlist
  useEffect(() => {
    if (normalizedProduct) {
      const saved = localStorage.getItem('favorites')
      const favorites = saved ? JSON.parse(saved) : []
      setIsWishlisted(favorites.some((f: any) => f.id === normalizedProduct.id))
    }
  }, [normalizedProduct?.id])

  const toggleFavorite = () => {
    if (!normalizedProduct) return
    const saved = localStorage.getItem('favorites')
    let favorites = saved ? JSON.parse(saved) : []

    if (isWishlisted) {
      favorites = favorites.filter((f: any) => f.id !== normalizedProduct.id)
      toast.success(isAr ? 'تمت الإزالة من المفضلة' : 'Removed from favorites')
    } else {
      favorites.push({
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        image: normalizedProduct.image,
        price: normalizedProduct.price,
      })
      toast.success(isAr ? 'تمت الإضافة للمفضلة' : 'Added to favorites')
    }
    localStorage.setItem('favorites', JSON.stringify(favorites))
    setIsWishlisted(!isWishlisted)
  }

  // Pre-select default size (L) and first color
  useEffect(() => {
    if (normalizedProduct) {
      if (!selectedColor && normalizedProduct.colors?.length) {
        setSelectedColor(normalizedProduct.colors[0])
      }
      if (!selectedSize && normalizedProduct.sizes?.length) {
        const defaultSize = normalizedProduct.sizes.includes('L') ? 'L' : normalizedProduct.sizes[0]
        setSelectedSize(defaultSize)
      }
    }
  }, [normalizedProduct?.id])

  const discountedPrice = normalizedProduct
    ? parseFloat(normalizedProduct.price.toString()) * (1 - (normalizedProduct.discount || 0) / 100)
    : 599

  // Related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', normalizedProduct?.category || ''],
    queryFn: async () => {
      if (useShopify) {
        const shopifyProducts = await getShopifyProducts()
        const mapped = shopifyProducts.map(shopifyProductToAppProduct)
        return mapped.length > 0 ? mapped : demoProducts
      }
      const prods = await getProducts()
      return prods && prods.length > 0 ? prods : demoProducts
    },
    enabled: !!normalizedProduct
  })

  const filteredRelatedProducts = (
    relatedProducts.filter((p) => String(p.id) !== String(normalizedProduct?.id)).length > 0
      ? relatedProducts.filter((p) => String(p.id) !== String(normalizedProduct?.id))
      : demoProducts.filter((p) => String(p.id) !== String(normalizedProduct?.id))
  ).slice(0, 4)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-32 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6B46C1]/20 border-t-[#6B46C1] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{isAr ? 'جاري تجهيز القطعة...' : 'Loading product...'}</p>
        </div>
      </main>
    )
  }

  if (error || !normalizedProduct) {
    return (
      <main className="min-h-screen bg-background pt-32 flex items-center justify-center transition-colors duration-300">
        <div className="text-center bg-card border border-border p-8 rounded-3xl max-w-md shadow-xl">
          <AlertTriangle className="w-16 h-16 text-[#6B46C1] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-foreground">{t.productNotFound}</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            {isAr ? 'قد يكون هذا التصميم نفد أو تم نقله.' : 'This product may have moved or is temporarily unavailable.'}
          </p>
          <Link to="/shop" className="inline-block px-8 py-3.5 rounded-full bg-[#6B46C1] text-white font-bold hover:opacity-90 transition-all shadow-md">
            {t.backToShop}
          </Link>
        </div>
      </main>
    )
  }

  const getSelectedVariant = () => {
    if (!normalizedProduct.variants || normalizedProduct.variants.length === 0) {
      return null
    }

    const colorName = colorOptions.find((c) => c.value === selectedColor)?.name || selectedColor

    // Strict match first
    let variant = normalizedProduct.variants.find((v: any) => {
      const hasSize = v.options.some((opt: any) => opt.name === 'Size' && opt.value.toLowerCase() === selectedSize.toLowerCase())
      const hasColor = v.options.some((opt: any) => opt.name === 'Color' && opt.value.toLowerCase() === colorName.toLowerCase())
      return hasSize && hasColor
    })

    // Fallback: match by size
    if (!variant) {
      variant = normalizedProduct.variants.find((v: any) =>
        v.options.some((opt: any) => opt.name === 'Size' && opt.value.toLowerCase() === selectedSize.toLowerCase())
      )
    }

    // Fallback: first variant
    if (!variant && normalizedProduct.variants.length > 0) {
      variant = normalizedProduct.variants[0]
    }

    return variant
  }

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error(isAr ? 'من فضلك اختار المقاس واللون أولاً!' : 'Please select size and color')
      return
    }

    // Track Meta Pixel AddToCart
    trackPixelAddToCart({
      content_name: normalizedProduct.name,
      content_ids: [normalizedProduct.id],
      value: discountedPrice,
      currency: 'EGP',
      content_type: 'product',
    })

    const variant = getSelectedVariant()
    if (!variant) {
      // If variant is not in Shopify, direct to cart drawer
      window.dispatchEvent(new Event('toggle-cart'))
      return
    }

    setIsBuyingNow(true)
    try {
      const checkoutUrl = await createShopifyCheckout([{ variantId: variant.id, quantity }])
      window.location.href = checkoutUrl
    } catch (err: any) {
      console.error('Buy now error:', err)
      toast.error(err.message || (isAr ? 'فشل إنشاء الطلب' : 'Failed to create checkout'))
      setIsBuyingNow(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error(isAr ? 'من فضلك اختار المقاس واللون أولاً!' : 'Please select size and color')
      return
    }

    // Track Meta Pixel AddToCart
    trackPixelAddToCart({
      content_name: normalizedProduct.name,
      content_ids: [normalizedProduct.id],
      value: discountedPrice,
      currency: 'EGP',
      content_type: 'product',
    })

    if (useShopify) {
      try {
        const variant = getSelectedVariant()
        if (!variant) {
          toast.error(isAr ? 'هذا المقاس غير متوفر حالياً' : 'Size not available')
          return
        }

        const updatedCart = await addShopifyCartLine(variant.id, quantity)
        queryClient.setQueryData(['shopify-cart'], updatedCart)
        window.dispatchEvent(new Event('toggle-cart'))
        toast.success(isAr ? 'تمت الإضافة للشنطة بنجاح! 🛍️' : 'Added to cart successfully!')
      } catch (err: any) {
        console.error('Shopify add to cart error:', err)
        toast.error(err.message || (isAr ? 'فشل الإضافة للشنطة' : 'Failed to add to cart'))
      }
      return
    }

    // Supabase Cart fallback
    if (!user) {
      toast.error(isAr ? 'يرجى تسجيل الدخول أولاً' : 'Please login first')
      return
    }

    try {
      await addToCart.mutateAsync({
        userId: user.id,
        productId: String(normalizedProduct.id),
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
      toast.success(isAr ? 'تمت الإضافة للشنطة بنجاح! 🛍️' : 'Added to cart successfully!')
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'فشل الإضافة للشنطة' : 'Failed to add to cart'))
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: normalizedProduct.name,
        text: normalizedProduct.description,
        url: window.location.href,
      })
    } catch {
      navigator.clipboard.writeText(window.location.href)
      toast.success(isAr ? 'تم نسخ الرابط! 🔗' : 'Link copied to clipboard!')
    }
  }

  const getColorName = (value: string) => {
    const originalName = colorOptions.find((c) => c.value === value)?.name || value
    if (language === 'en') return originalName
    const colorMap: Record<string, string> = {
      Black: 'أسود',
      White: 'أبيض',
      Brown: 'بني شوكولاتة',
      Grey: 'رمادي',
      Navy: 'كحلي',
      Cream: 'كريمي',
    }
    return colorMap[originalName] || originalName
  }

  const customerReviews = [
    {
      author: isAr ? 'عمر خ.' : 'Omar K.',
      city: isAr ? 'القاهرة' : 'Cairo',
      rating: 5,
      date: isAr ? 'منذ 3 أيام' : '3 days ago',
      comment: isAr
        ? 'الخامة تقيلة ومحترمة جداً قطن مصري 100%، والأوفرسايز مظبوط بالمللي. التوصيل جه في 3 أيام واستلمت وعاينت مع المندوب.'
        : 'Heavyweight 100% Egyptian cotton, and the oversized cut is spot-on. Delivered in 3 days with smooth COD inspection.',
    },
    {
      author: isAr ? 'يوسف م.' : 'Youssef M.',
      city: isAr ? 'الإسكندرية' : 'Alexandria',
      rating: 5,
      date: isAr ? 'منذ أسبوع' : '1 week ago',
      comment: isAr
        ? 'The graphic screen print quality is insane! غسلته وثبات الطباعة زي ما هو بالظبط. ستايل ستريت وير عالمي بجد.'
        : 'The graphic screen print quality is insane! Washed it and print stayed flawless. World-class streetwear.',
    },
    {
      author: isAr ? 'كريم ع.' : 'Karim A.',
      city: isAr ? 'الجيزة' : 'Giza',
      rating: 5,
      date: isAr ? 'منذ أسبوعين' : '2 weeks ago',
      comment: isAr
        ? 'أحسن تيشيرت أوفرسايز اشتريته في مصر. التقفيل عالي والقصة مريحة جداً، ومقاس L طلع مثالي على طولي 180 سم.'
        : 'Best oversized t-shirt I bought in Egypt. Premium finish, and size L fit my 180cm frame perfectly.',
    },
    {
      author: isAr ? 'سلمى ح.' : 'Salma H.',
      city: isAr ? 'المنصورة' : 'Mansoura',
      rating: 5,
      date: isAr ? 'منذ 3 أسابيع' : '3 weeks ago',
      comment: isAr
        ? 'القصة اليونيسكس تحفة ومقاس M طلع أوفرسايز مظبوط ومريح جداً. المعاينة قبل الدفع طمنتني وسعر الشحن 25 ج ممتاز.'
        : 'The unisex cut is amazing! Size M fits comfortably relaxed. Inspecting before payment gave me full peace of mind.',
    },
  ]

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-foreground transition-colors font-medium shrink-0">{t.navHome}</Link>
          {isAr ? <ChevronLeft className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
          <Link to="/shop" className="hover:text-foreground transition-colors font-medium shrink-0">{t.navShop}</Link>
          {isAr ? <ChevronLeft className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
          <span className="text-foreground truncate max-w-[200px] font-bold">{normalizedProduct.name}</span>
        </nav>

        {/* Product Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-foreground/5 border border-border/40 shadow-sm">
              <img
                src={(normalizedProduct.images && normalizedProduct.images[activeImage]) || normalizedProduct.image}
                alt={normalizedProduct.name}
                className="w-full h-full object-cover"
              />
              {normalizedProduct.isNew && (
                <span className="absolute top-4 start-4 px-3.5 py-1 rounded-full bg-[#6B46C1] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                  {isAr ? 'جديد | New Drop' : 'New Drop'}
                </span>
              )}
            </div>
            {normalizedProduct.images && normalizedProduct.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {normalizedProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-foreground/5 transition-all shrink-0 ${
                      activeImage === i ? 'border-[#6B46C1] scale-95 shadow-sm' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details & Purchase Form */}
          <motion.div
            key={`${selectedColor}-${selectedSize}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 text-xs font-bold uppercase tracking-wider">
                  {isAr ? 'ستريت وير أوفرسايز (Unisex)' : 'Unisex Oversized Streetwear'}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                  {isAr ? 'قطن مصري 100%' : '100% Egyptian Cotton'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
                {normalizedProduct.name}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {normalizedProduct.description}
              </p>
            </div>

            {/* Price & Delivery Transparency */}
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-gradient">
                  {discountedPrice.toFixed(0)} EGP
                </span>
                {(normalizedProduct.discount || 0) > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {parseFloat(normalizedProduct.price.toString()).toFixed(0)} EGP
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground">
                <Truck className="w-4 h-4 text-[#6B46C1] shrink-0" />
                <span>{t.shippingNoticePDP}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isAr
                  ? '⚡ شحن سريع لجميع محافظات مصر خلال 3-5 أيام عمل | عاين التيشيرت مع المندوب قبل الدفع'
                  : '⚡ Fast nationwide delivery in 3-5 business days | Inspect with the courier before paying'}
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                {t.color}: <span className="text-muted-foreground font-normal">{getColorName(selectedColor)}</span>
              </h3>
              <div className="flex gap-3">
                {normalizedProduct.colors?.map((color, index) => (
                  <button
                    key={`color-${index}`}
                    onClick={() => setSelectedColor(color)}
                    className="group relative w-12 h-12 rounded-full transition-all border border-border shadow-sm hover:scale-110"
                    style={{
                      backgroundColor: color,
                      ...(selectedColor === color && {
                        boxShadow: '0 0 0 3px #6B46C1',
                        transform: 'scale(0.95)',
                      })
                    }}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-5 h-5 ${color === '#FFFFFF' || color === '#F5F5DC' ? 'text-black' : 'text-white'}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection & Size Guide Helper */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">
                  {t.size}: <span className="text-muted-foreground font-normal">{selectedSize}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B46C1] hover:text-[#3B82F6] font-bold transition-colors"
                >
                  <Ruler className="w-4 h-4" />
                  {t.sizeGuide}
                </button>
              </div>
              <div className="flex gap-2">
                {['M', 'L', 'XL', '2XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-2xl font-bold text-sm transition-all border ${
                      selectedSize === size
                        ? '!bg-[#6B46C1] !border-[#6B46C1] !text-white !shadow-lg scale-105'
                        : 'bg-foreground/5 border-border text-muted-foreground hover:bg-foreground/10 hover:text-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                📌 {t.sizeGuideModel}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center gap-3 bg-card border border-border rounded-full px-3 py-1.5 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-foreground text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(normalizedProduct.stock || 50, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart + Buy Now */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isBuyingNow}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-card border-2 border-[#6B46C1] text-[#6B46C1] font-bold hover:bg-[#6B46C1]/5 transition-all shadow-sm text-sm sm:text-base disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.addToCart}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base disabled:opacity-70"
              >
                {isBuyingNow
                  ? (isAr ? 'جاري التحويل...' : 'Redirecting...')
                  : (isAr ? 'اشتري الآن (دفع عند الاستلام)' : 'Buy Now (COD)')}
              </button>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={toggleFavorite}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border border-border shadow-sm ${
                    isWishlisted ? 'bg-[#FF2A2A]/20 text-[#FF2A2A] border-transparent' : 'bg-card text-muted-foreground hover:bg-foreground/5'
                  }`}
                  title="Save to favorites"
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

            {/* Benefits Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
              <div className="text-center p-3 rounded-2xl bg-foreground/[0.02] border border-border/50 flex flex-col items-center">
                <Truck className="w-5 h-5 text-[#6B46C1] mb-1" />
                <p className="text-xs font-bold text-foreground">{t.fixedShippingPDP}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.fixedShippingDescPDP}</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-foreground/[0.02] border border-border/50 flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-[#3B82F6] mb-1" />
                <p className="text-xs font-bold text-foreground">{t.easyReturns}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.easyReturnsDesc}</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-foreground/[0.02] border border-border/50 flex flex-col items-center">
                <Shield className="w-5 h-5 text-emerald-500 mb-1" />
                <p className="text-xs font-bold text-foreground">{t.securePayment}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t.securePaymentDesc}</p>
              </div>
            </div>

            {/* Structured Specifications Section */}
            <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Shirt className="w-4 h-4 text-[#6B46C1]" />
                <h3 className="font-bold text-sm text-foreground">
                  {t.productSpecsTitle}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-foreground/5 space-y-0.5">
                  <span className="font-bold text-foreground block">{t.specFabricLabel}</span>
                  <span className="text-muted-foreground leading-relaxed block">{t.specFabricValue}</span>
                </div>
                <div className="p-3 rounded-xl bg-foreground/5 space-y-0.5">
                  <span className="font-bold text-foreground block">{t.specCutLabel}</span>
                  <span className="text-muted-foreground leading-relaxed block">{t.specCutValue}</span>
                </div>
                <div className="p-3 rounded-xl bg-foreground/5 space-y-0.5">
                  <span className="font-bold text-foreground block">{t.specPrintLabel}</span>
                  <span className="text-muted-foreground leading-relaxed block">{t.specPrintValue}</span>
                </div>
                <div className="p-3 rounded-xl bg-foreground/5 space-y-0.5">
                  <span className="font-bold text-foreground block">{t.specCareLabel}</span>
                  <span className="text-muted-foreground leading-relaxed block">{t.specCareValue}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Proof / Customer Reviews Section */}
        <div className="border-t border-border pt-12 sm:pt-16 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
                <span className="font-bold text-base sm:text-lg text-foreground ms-1">4.9 / 5.0</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t.customerReviewsTitle}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                {t.customerReviewsSubtitle} • {t.basedOnReviews}
              </p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-xs sm:text-sm font-bold hover:bg-foreground/5 transition-all shadow-sm"
            >
              <PenLine className="w-4 h-4 text-[#6B46C1]" />
              {t.writeReview}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {customerReviews.map((rev, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-sm hover:border-primary/20 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(rev.rating)].map((_, si) => (
                        <Star key={si} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground block">{rev.author}</span>
                    <span className="text-[11px] text-muted-foreground">{rev.city}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3" />
                    {t.verifiedBuyer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="border-t border-border pt-12 sm:pt-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-foreground">{t.youMightAlsoLike}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredRelatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.handle || p.id}`} className="group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-foreground/5 border border-border/40 mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base group-hover:text-[#6B46C1] text-foreground transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="font-bold text-xs sm:text-sm text-foreground mt-1">
                    {(parseFloat(p.price.toString()) * (1 - (p.discount || 0) / 100)).toFixed(0)} EGP
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
            className="fixed inset-0 z-[60] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t.sizeGuideTitle}</h2>
                  <p className="text-xs text-[#6B46C1] font-semibold mt-1">📌 {t.sizeGuideModel}</p>
                </div>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border bg-background mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-foreground/[0.02] text-foreground text-xs uppercase">
                      <th className="text-start py-3 px-4 font-bold">{t.size}</th>
                      <th className="text-start py-3 px-4 font-bold">{t.tableChest}</th>
                      <th className="text-start py-3 px-4 font-bold">{t.tableLength}</th>
                      <th className="text-start py-3 px-4 font-bold">{t.tableWeight}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sizeChart.unisex.map((row) => (
                      <tr key={row.size} className="hover:bg-foreground/[0.02] transition-colors">
                        <td className="py-3 px-4 font-black text-[#6B46C1]">{row.size}</td>
                        <td className="py-3 px-4 font-medium">{row.chest} cm</td>
                        <td className="py-3 px-4 font-medium">{row.length} cm</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.weight} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-2xl bg-foreground/5 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  {isAr ? '💡 نصيحة القياس:' : '💡 Sizing Advice:'}
                </p>
                <p>
                  {isAr
                    ? 'التيشيرت مصمم بقصة أوفرسايز بوكسي وأكتاف منسدلة. اختر مقاسك العادي للحصول على نفس ستايل الموديل.'
                    : 'The t-shirt is designed with dropped shoulders and a boxy silhouette. Order your normal size for the intended streetwear drape.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-lg text-foreground">{t.writeReview}</h3>
                <button onClick={() => setShowReviewModal(false)} className="p-1 rounded-full text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success(isAr ? 'شكراً لتقييمك! تم إرسال تقييمك بنجاح ⭐' : 'Thank you! Review submitted successfully ⭐')
                  setShowReviewModal(false)
                }}
                className="space-y-4 text-sm"
              >
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {isAr ? 'اسمك' : 'Your Name'}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={isAr ? 'مثال: أحمد م.' : 'e.g. Ahmed M.'}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-[#6B46C1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {isAr ? 'التقييم' : 'Rating'}
                  </label>
                  <div className="flex gap-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 fill-current cursor-pointer hover:scale-110 transition-transform" />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {isAr ? 'رأيك في الخامة والمقاس' : 'Your Feedback on Fit & Fabric'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={isAr ? 'اكتب تجربتك مع تيشيرت إيفو...' : 'Share your thoughts on the quality...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-[#6B46C1]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#6B46C1] text-white font-bold hover:opacity-90 transition-all shadow-md"
                >
                  {isAr ? 'نشر التقييم' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
