import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { trpc } from '@/providers/trpc'

export default function NewArrivals() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { language } = useLanguageStore()
  const t = translations[language]
  
  // Fetch products from Supabase
  const { data: supabaseProducts = [] } = trpc.products.list.useQuery()
  
  // Filter new products from Supabase only
  const newProducts = supabaseProducts.filter((p) => p.is_new || p.isNew).slice(0, 6)

  return (
    <section ref={ref} className="relative py-16 sm:py-20 md:py-32 bg-secondary/10 dark:bg-zinc-950/20 border-y border-border transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-12 md:mb-16"
        >
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B46C1]" />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.1em] text-[#6B46C1]">
                {t.freshDrop}
              </span>
            </div>
            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] sm:text-[clamp(1.75rem,4.5vw,3rem)] md:text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.02em] text-foreground">
              {t.newArrivals}
            </h2>
          </div>
          <Link
            to="/shop"
            className="group mt-4 sm:mt-6 md:mt-0 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-xs sm:text-sm"
          >
            {t.viewAllProducts}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {newProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-foreground/5 border border-border/30 mb-2 sm:mb-3 md:mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badges */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      {(product.is_new || product.isNew) && (
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#6B46C1] text-white text-[10px] sm:text-xs font-bold uppercase shadow-sm">
                          {language === 'ar' ? 'جديد' : 'New'}
                        </span>
                      )}
                      {(product.discount || 0) > 0 && (
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FF2A2A] text-white text-[10px] sm:text-xs font-bold uppercase shadow-sm">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick View */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="w-full py-2 sm:py-3 rounded-full bg-white text-black text-center text-[10px] sm:text-xs sm:text-sm font-bold shadow-lg">
                      {t.quickView}
                    </div>
                  </div>

                  {/* Stock */}
                  {(product.stock || 0) < 20 && (
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-foreground/60 text-background text-[10px] sm:text-xs font-medium backdrop-blur-sm shadow-sm">
                        {t.onlyLeft.replace('{count}', String(product.stock))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-foreground group-hover:text-[#6B46C1] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-foreground">
                        ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                      </span>
                      {(product.discount || 0) > 0 && (
                        <span className="text-muted-foreground line-through text-[10px] sm:text-xs md:text-sm">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {(product.colors || []).slice(0, 3).map((color: string, ci: number) => (
                        <span
                          key={ci}
                          className="w-2.5 h-2.5 sm:w-3 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {(product.colors || []).length > 3 && (
                        <span className="text-muted-foreground text-[10px] sm:text-xs">+{(product.colors || []).length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
