import { Link } from 'react-router'
import { Home, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-[clamp(6rem,15vw,12rem)] font-extrabold tracking-[-0.05em] leading-none text-gradient mb-4">
          404
        </h1>
        <p className="text-2xl font-bold mb-2">Page Not Found</p>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-medium hover:opacity-90 transition-all"
          >
            <Home className="w-4 h-4" />
            Home Page
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
