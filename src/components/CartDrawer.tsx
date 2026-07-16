import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartDrawer() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, getTotalPrice, getDiscountedPrice, clearCart } = useCartStore()
  const { wheelDiscount, wheelUsed } = useAuthStore()
  const discount = wheelDiscount && !wheelUsed ? wheelDiscount : 0
  const finalPrice = getDiscountedPrice() * (1 - discount / 100)

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('toggle-cart', handler)
    return () => window.removeEventListener('toggle-cart', handler)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${language === 'ar' ? 'left-0' : 'right-0'} top-0 bottom-0 w-full sm:max-w-md z-[70] bg-card border-s border-border flex flex-col shadow-2xl transition-colors duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#6B46C1]" />
                <h2 className="text-lg font-bold text-foreground">{t.cartTitle}</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#6B46C1]/20 text-[#6B46C1] text-xs font-bold">
                  {t.cartItemsCount.replace('{count}', String(items.length))}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-foreground/10 mb-4" />
                  <p className="text-foreground/50 text-lg font-bold mb-2">{t.emptyCartTitle}</p>
                  <p className="text-muted-foreground text-sm mb-6">{t.emptyCartDesc}</p>
                  <button
                    onClick={() => { setIsOpen(false) }}
                    className="px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:bg-[#6B46C1]/90 transition-all shadow-md"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, x: language === 'ar' ? -100 : 100 }}
                      className="flex gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-border"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-border/30 bg-foreground/5"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{item.product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground font-bold">{item.size}</span>
                          <span className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: item.color }} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-foreground/5 border border-border/50 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-background hover:bg-foreground/5 flex items-center justify-center text-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-background hover:bg-foreground/5 flex items-center justify-center text-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                              ${(item.product.price * (1 - item.product.discount / 100) * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.subtotal}</span>
                    <span className="font-semibold text-foreground">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  {getDiscountedPrice() < getTotalPrice() && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B46C1] font-bold">{t.productDiscount}</span>
                      <span className="text-[#6B46C1] font-bold">-${(getTotalPrice() - getDiscountedPrice()).toFixed(2)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-500 font-bold">{t.wheelDiscount.replace('{percent}', String(discount))}</span>
                      <span className="text-green-500 font-bold">-${(getDiscountedPrice() * (discount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span className="text-foreground">{t.total}</span>
                    <span className="text-gradient">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                >
                  {t.checkout}
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-red-500/80 hover:text-red-500 font-bold hover:underline transition-colors"
                >
                  {t.clearCart}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
