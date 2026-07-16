import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  LayoutGrid,
  LayoutList,
} from 'lucide-react'
import { categories, colorOptions, designTypes } from '@/data/products'
import type { Product } from '@/data/products'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { trpc } from '@/providers/trpc'

export default function Shop() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const { category } = useParams<{ category?: string }>()
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150])
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch products from backend
  const { data: allProducts = [], isLoading } = trpc.products.list.useQuery()
  const { data: categoryProducts = [] } = trpc.products.byCategory.useQuery(
    { category: selectedCategory },
    { enabled: selectedCategory !== 'all' }
  )
  const { data: searchResults = [] } = trpc.products.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  )

  useEffect(() => {
    const query = searchParams.get('search') || ''
    setSearchQuery(query)
  }, [searchParams])

  const sizes = ['S', 'M', 'L', 'XL', 'XXL']

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = searchQuery.length > 0 ? searchResults : (selectedCategory !== 'all' ? categoryProducts : allProducts)

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) => selectedSizes.some((s) => p.sizes?.includes(s)))
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) => selectedColors.some((c) => p.colors?.includes(c)))
    }

    // Design type filter
    if (selectedDesigns.length > 0) {
      result = result.filter((p) => selectedDesigns.includes(p.designType || ''))
    }

    // Price filter
    result = result.filter((p) => {
      const price = parseFloat(p.price.toString())
      const discountedPrice = price * (1 - (p.discount || 0) / 100)
      return discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1]
    })

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()))
        break
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()))
        break
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // newest first (by id, higher = newer)
        result.sort((a, b) => b.id - a.id)
    }

    return result
  }, [selectedCategory, searchQuery, selectedSizes, selectedColors, selectedDesigns, priceRange, sortBy, allProducts, categoryProducts, searchResults])

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const toggleDesign = (design: string) => {
    setSelectedDesigns((prev) =>
      prev.includes(design) ? prev.filter((d) => d !== design) : [...prev, design]
    )
  }

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedDesigns([])
    setPriceRange([0, 150])
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedDesigns.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 150 ||
    searchQuery.length > 0

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#6B46C1]/20 border-t-[#6B46C1] rounded-full animate-spin" />
          </div>
        </div>
      </main>
    )
  }

  const getCategoryLabel = (catId: string) => {
    if (catId === 'all') return t.allProducts
    if (catId === 'men') return t.navMen
    if (catId === 'women') return t.navWomen
    return language === 'ar' ? 'للجنسين' : 'Unisex'
  }

  const getTranslatedDesign = (design: string) => {
    if (language === 'en') return design;
    const designMap: Record<string, string> = {
      geometric: 'هندسي',
      abstract: 'تجريدي',
      cyberpunk: 'سايبر بانك',
      minimalist: 'بسيط (مينيمال)',
      tech: 'تكنولوجي',
      graffiti: 'جرافيتي',
      floral: 'ورود ونباتات',
      military: 'عسكري (تاكتيكال)',
      retro: 'ريترو كلاسيك',
      logo: 'شعار البراند',
      bundle: 'عرض توفير (باقة)',
    }
    return designMap[design] || design;
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
      Pink: 'روز (بمبي)',
      Cream: 'كريمي',
    }
    return colorMap[colorName] || colorName;
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10"
        >
          <h1 className="text-[clamp(2rem,5vw,4rem)] sm:text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] mb-3 sm:mb-4 text-foreground">
            {getCategoryLabel(selectedCategory)}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {filteredProducts.length} {t.productsAvailable}
          </p>
        </motion.div>

        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-12 pe-4 py-2.5 sm:py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border transition-all text-sm sm:text-base ${
                showFilters
                  ? 'bg-[#6B46C1] border-[#6B46C1] text-white'
                  : 'bg-card border-border text-foreground/60 hover:bg-foreground/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{t.filters}</span>
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-white dark:bg-black text-[#6B46C1] text-xs font-bold flex items-center justify-center">
                  !
                </span>
              )}
            </button>
            <div className="flex items-center bg-card rounded-full border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 sm:p-3 ${viewMode === 'grid' ? 'bg-[#6B46C1] text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 sm:p-3 ${viewMode === 'list' ? 'bg-[#6B46C1] text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/shop' : `/shop/${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#6B46C1] text-white'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              {getCategoryLabel(cat.id)}
            </Link>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 rounded-3xl bg-card border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-foreground">{t.filters}</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-[#FF2A2A] hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                  {t.clearAll}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Size Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-foreground">{t.size}</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-[#6B46C1] text-white'
                          : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-foreground">{t.color}</h4>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => toggleColor(color.value)}
                      className={`group relative w-10 h-10 rounded-full transition-all border border-border ${
                        selectedColors.includes(color.value)
                          ? 'ring-2 ring-[#6B46C1] ring-offset-2 ring-offset-background'
                          : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={getTranslatedColor(color.name)}
                    >
                      {selectedColors.includes(color.value) && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-bold ${color.value === '#FFFFFF' ? 'text-black' : 'text-white'}`}>
                            ✓
                          </span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-foreground">{t.priceRange}</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-3 py-2 rounded-xl bg-foreground/5 border border-border text-sm text-center text-foreground"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-3 py-2 rounded-xl bg-foreground/5 border border-border text-sm text-center text-foreground"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[#6B46C1]"
                  />
                </div>
              </div>

              {/* Design Type */}
              <div className="md:col-span-3">
                <h4 className="font-semibold mb-3 text-foreground">{t.designType}</h4>
                <div className="flex flex-wrap gap-2">
                  {designTypes.map((design) => (
                    <button
                      key={design}
                      onClick={() => toggleDesign(design)}
                      className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${
                        selectedDesigns.includes(design)
                          ? 'bg-[#6B46C1] text-white'
                          : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
                      }`}
                    >
                      {getTranslatedDesign(design)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            {t.showingProducts.replace('{showing}', String(filteredProducts.length)).replace('{total}', String(allProducts.length))}
          </p>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-card border border-border rounded-full ps-4 pe-10 py-2.5 text-sm text-muted-foreground focus:outline-none focus:border-[#6B46C1] cursor-pointer"
            >
              <option value="newest">{t.newest}</option>
              <option value="price-low">{t.priceLow}</option>
              <option value="price-high">{t.priceHigh}</option>
              <option value="discount">{t.biggestDiscount}</option>
              <option value="name">{t.nameAZ}</option>
            </select>
            <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">{t.noProductsMatch}</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all shadow-md"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-3 sm:space-y-4'
            }
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} viewMode={viewMode} language={language} t={t} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function ProductCard({
  product,
  index,
  viewMode,
  language,
  t,
}: {
  product: Product
  index: number
  viewMode: 'grid' | 'list'
  language: 'ar' | 'en'
  t: any
}) {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/product/${product.id}`} className="group flex gap-6 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 hover:bg-foreground/[0.02] hover:shadow-md transition-all">
          <div className="relative w-32 h-40 shrink-0 rounded-xl overflow-hidden bg-foreground/5">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            {product.discount > 0 && (
              <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full bg-[#FF2A2A] text-white text-xs font-bold">
                -{product.discount}%
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-[#6B46C1] transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="font-bold text-xl text-foreground">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              {product.colors.slice(0, 4).map((color, ci) => (
                <span key={ci} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: color }} />
              ))}
              <span className="text-muted-foreground text-xs ms-2">
                {product.sizes.join(', ')}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-foreground/5 border border-border/30 mb-3 sm:mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-2 sm:top-3 start-2 sm:start-3 flex flex-col gap-1.5 sm:gap-2">
            {product.isNew && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#6B46C1] text-white text-[10px] sm:text-xs font-bold uppercase shadow-sm">
                {language === 'ar' ? 'جديد' : 'New'}
              </span>
            )}
            {product.discount > 0 && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FF2A2A] text-white text-[10px] sm:text-xs font-bold uppercase shadow-sm">
                -{product.discount}%
              </span>
            )}
          </div>

          {product.stock < 20 && (
            <div className="absolute bottom-2 sm:bottom-3 end-2 sm:end-3">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 text-white text-[10px] sm:text-xs font-medium backdrop-blur-sm shadow-sm">
                {t.onlyLeft.replace('{count}', String(product.stock))}
              </span>
            </div>
          )}

          <div className="absolute bottom-2 sm:bottom-3 start-2 sm:start-3 end-2 sm:end-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <div className="w-full py-2 sm:py-3 rounded-full bg-white text-black text-center text-xs sm:text-sm font-bold shadow-lg">
              {t.quickView}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-[#6B46C1] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-base text-foreground">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-muted-foreground line-through text-xs sm:text-sm">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {product.colors.slice(0, 3).map((color, ci) => (
                <span
                  key={ci}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-muted-foreground text-[10px] sm:text-xs">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
