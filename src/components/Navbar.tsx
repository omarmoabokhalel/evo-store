import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Sparkles,
  Search,
  Heart,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { isDark, toggle } = useThemeStore()
  const { isLoggedIn, isAdmin, user, setLoggedOut } = useAuthStore()
  const { getTotalItems } = useCartStore()
  const { language, setLanguage } = useLanguageStore()
  const t = translations[language]
  
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileSearch.trim()) {
      setIsMobileMenuOpen(false)
      navigate(`/shop?search=${encodeURIComponent(mobileSearch.trim())}`)
      setMobileSearch('')
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }, [location.pathname])

  const navLinks = [
    { path: '/', label: t.navHome },
    { path: '/shop', label: t.navShop },
    { path: '/shop/men', label: t.navMen },
    { path: '/shop/women', label: t.navWomen },
    { path: '/customizer', label: t.navAIShowroom, icon: Sparkles },
  ]

  // Dynamic state for styling. Nav is active (showing glass background) if scrolled OR on any subpage except home.
  // This guarantees perfect visibility and premium readability on both themes.
  const isNavActive = isScrolled || location.pathname !== '/'

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isNavActive
            ? 'bg-background/80 backdrop-blur-md border-b border-border/50 py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="h-6 w-6" />
                <span className={`text-2xl font-bold tracking-[-0.05em] transition-colors ${isNavActive ? 'text-foreground' : 'text-white'}`}>EVO</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path))
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium tracking-[0.05em] uppercase transition-all duration-300 ${
                      isActive
                        ? isNavActive
                          ? 'bg-foreground/10 text-foreground'
                          : 'bg-white/20 text-white shadow-sm'
                        : isNavActive
                          ? 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.icon && <link.icon className="w-3.5 h-3.5" />}
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/shop"
                className={`hidden lg:inline-flex p-2 rounded-full transition-all duration-300 ${
                  isNavActive
                    ? 'text-foreground/60 hover:text-foreground hover:bg-foreground/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={t.searchPlaceholder}
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className={`hidden lg:inline-flex px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  isNavActive
                    ? 'text-foreground bg-foreground/5 hover:bg-foreground/10 border-border'
                    : 'text-white bg-white/10 hover:bg-white/20 border-white/10'
                }`}
                title={language === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}
              >
                {language === 'ar' ? 'EN' : 'عربي'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isNavActive
                    ? 'text-foreground/60 hover:text-foreground hover:bg-foreground/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={isDark ? t.themeLight : t.themeDark}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/profile"
                className={`hidden lg:inline-flex p-2 rounded-full transition-all duration-300 relative ${
                  isNavActive
                    ? 'text-foreground/60 hover:text-foreground hover:bg-foreground/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => {
                  const event = new CustomEvent('toggle-cart')
                  window.dispatchEvent(event)
                }}
                className={`p-2 rounded-full transition-all duration-300 relative ${
                  isNavActive
                    ? 'text-foreground/60 hover:text-foreground hover:bg-foreground/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={t.cartTitle}
              >
                <ShoppingBag className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#6B46C1] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User / Profile menu */}
              {isLoggedIn ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-1.5 pl-1.5 pr-2 sm:pl-2 sm:pr-3 py-1 rounded-full transition-all duration-300 ${
                      isNavActive
                        ? 'bg-foreground/10 hover:bg-foreground/20 text-foreground'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-xs sm:text-sm font-medium hidden md:block">{user?.name}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute end-0 top-full mt-2 w-56 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-[60]"
                      >
                        <div className="p-4 border-b border-border">
                          <p className="font-semibold text-sm text-foreground">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all"
                          >
                            <User className="w-4 h-4 text-[#6B46C1]" />
                            {t.profile}
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-[#6B46C1]" />
                              {t.dashboard}
                            </Link>
                          )}
                          <Link
                            to="/customizer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all"
                          >
                            <Sparkles className="w-4 h-4 text-[#6B46C1]" />
                            {t.navAIShowroom}
                          </Link>
                          <button
                            onClick={() => {
                              setLoggedOut()
                              setIsProfileOpen(false)
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            {t.logout}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden lg:flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isNavActive
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {t.login}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-full transition-all duration-300 ${
                  isNavActive
                    ? 'text-foreground/60 hover:text-foreground hover:bg-foreground/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl lg:hidden overflow-y-auto px-6 py-24 flex flex-col gap-8"
          >
            {/* User Profile Card Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="w-full bg-card border border-border p-5 rounded-3xl flex flex-col gap-4 shadow-sm"
            >
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center text-base font-bold text-white shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-base text-foreground truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-foreground/5 transition-all"
                    >
                      <User className="w-4 h-4 text-[#6B46C1]" />
                      {t.profile}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-foreground/5 transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#6B46C1]" />
                        {t.dashboard}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setLoggedOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">{language === 'ar' ? 'سجل دخولك عشان تتابع طلباتك وتصمم بالـ AI' : 'Sign in to track orders and customize with AI'}</p>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-all"
                  >
                    <User className="w-4 h-4" />
                    {t.login}
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Mobile Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleMobileSearchSubmit}
              className="relative w-full"
            >
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6B46C1] transition-colors text-sm shadow-xs"
              />
              <button
                type="submit"
                className="absolute end-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#6B46C1] text-white text-xs font-bold shadow-sm"
              >
                {language === 'ar' ? 'بحث' : 'Search'}
              </button>
            </motion.form>

            {/* Nav Links */}
            <div className="flex flex-col gap-3 my-4">
              {navLinks.map((link, i) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path))
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 py-3.5 px-5 rounded-2xl text-xl font-bold transition-all border ${
                        isActive
                          ? 'bg-foreground/5 border-border text-foreground'
                          : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {link.icon ? (
                        <link.icon className="w-5 h-5 text-[#6B46C1]" />
                      ) : (
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full bg-[#6B46C1]/60" />
                        </div>
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Actions Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pt-6 border-t border-border flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">{language === 'ar' ? 'اللغة' : 'Language'}</span>
                <button
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="px-4 py-2 rounded-full text-xs font-bold border border-border text-foreground bg-card hover:bg-foreground/5 transition-all shadow-xs"
                >
                  {language === 'ar' ? 'English (EN)' : 'العربية (عربي)'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
