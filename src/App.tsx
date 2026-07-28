import { Routes, Route } from 'react-router'
import { lazy, Suspense, useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import { SupabaseAuthProvider } from '@/providers/SupabaseAuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import WheelOfFortune from '@/components/WheelOfFortune'
import { Toaster } from '@/components/ui/sonner'
import { Spinner } from '@/components/ui/spinner'
import ScrollToTop from '@/components/ScrollToTop'

const Home = lazy(() => import('@/pages/Home'))
const Shop = lazy(() => import('@/pages/Shop'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Profile = lazy(() => import('@/pages/Profile'))
const OrderTracking = lazy(() => import('@/pages/OrderTracking'))
const Customizer = lazy(() => import('@/pages/Customizer'))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'))
const Login = lazy(() => import('@/pages/Login'))
const AdminLogin = lazy(() => import('@/pages/AdminLogin'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Spinner className="w-8 h-8 text-[#6B46C1]" />
    </div>
  )
}

export default function App() {
  const { isDark } = useThemeStore()
  const { language } = useLanguageStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  return (
    <SupabaseAuthProvider>
      <div className={`min-h-screen transition-colors duration-300 bg-background text-foreground`}>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/track-order/:orderId" element={<OrderTracking />} />
            <Route path="/customizer" element={<Customizer />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
        <CartDrawer />
        <WheelOfFortune />
        <Toaster position="top-center" />
      </div>
    </SupabaseAuthProvider>
  )
}
