import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { X, Gift } from 'lucide-react'
import { toast } from 'sonner'

const WHEEL_SEGMENTS = [
  { discount: 5, color: '#374151', label: '5%' },
  { discount: 10, color: '#6B46C1', label: '10%' },
  { discount: 15, color: '#3B82F6', label: '15%' },
  { discount: 20, color: '#6B46C1', label: '20%' },
  { discount: 25, color: '#3B82F6', label: '25%' },
  { discount: 30, color: '#FF2A2A', label: '30%' },
  { discount: 5, color: '#374151', label: '5%' },
  { discount: 10, color: '#6B46C1', label: '10%' },
  { discount: 15, color: '#3B82F6', label: '15%' },
  { discount: 20, color: '#6B46C1', label: '20%' },
  { discount: 25, color: '#3B82F6', label: '25%' },
  { discount: 30, color: '#FF2A2A', label: '30%' },
]

export default function WheelOfFortune() {
  const { isLoggedIn, wheelDiscount, wheelUsed, wheelExpiry, setWheelDiscount } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoggedIn && wheelDiscount === null && !wheelUsed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, wheelDiscount, wheelUsed])

  const spinWheel = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setShowResult(false)

    // Random result (30% max as per requirements)
    const validSegments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const chosenIndex = validSegments[Math.floor(Math.random() * validSegments.length)]
    const segmentAngle = 360 / 12
    const targetRotation = 360 * 5 + (360 - chosenIndex * segmentAngle - segmentAngle / 2)

    setRotation(targetRotation)

    setTimeout(() => {
      const discount = WHEEL_SEGMENTS[chosenIndex].discount
      setResult(discount)
      setIsSpinning(false)
      setShowResult(true)

      // Set expiry to 3 days from now
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 3)
      setWheelDiscount(discount, expiry.toISOString())

      toast.success(`You won ${discount}% discount!`, {
        description: `Valid for 3 days. Use it at checkout!`,
        duration: 5000,
      })
    }, 4000)
  }, [isSpinning, setWheelDiscount])

  const closeWheel = () => {
    if (!isSpinning) {
      setIsVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 max-w-lg w-full"
          >
            {/* Close Button */}
            {!isSpinning && (
              <button
                onClick={closeWheel}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Spin & Win!</h2>
              <p className="text-white/60 text-sm">
                Welcome to EVO! Spin the wheel to win a discount on your first order.
              </p>
            </div>

            {/* Wheel */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#FF2A2A]" />
              </div>

              {/* Wheel */}
              <div
                ref={wheelRef}
                className="w-64 h-64 rounded-full border-4 border-white/10 relative overflow-hidden transition-transform"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? '4s' : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
                }}
              >
                {WHEEL_SEGMENTS.map((segment, i) => {
                  const angle = (360 / 12) * i
                  return (
                    <div
                      key={i}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 85% 15%)',
                      }}
                    >
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: segment.color }}
                      />
                    </div>
                  )
                })}

                {/* Center Labels */}
                {WHEEL_SEGMENTS.map((segment, i) => {
                  const angle = (360 / 12) * i + (360 / 24)
                  return (
                    <div
                      key={`label-${i}`}
                      className="absolute top-1/2 left-1/2 text-white font-bold text-xs"
                      style={{
                        transform: `rotate(${angle}deg) translateY(-85px) translateX(-50%)`,
                        transformOrigin: '0 0',
                      }}
                    >
                      {segment.label}
                    </div>
                  )
                })}

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0F0F0F] border-4 border-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold">EVO</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {showResult && result !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#6B46C1]/20 to-[#3B82F6]/20 border border-[#6B46C1]/30"
                >
                  <p className="text-lg font-bold text-gradient">
                    You won {result}% discount!
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    Valid for 3 days. Applied automatically at checkout.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spin Button */}
            {!showResult && (
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                  isSpinning
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white hover:opacity-90'
                }`}
              >
                {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
              </button>
            )}

            {showResult && (
              <button
                onClick={() => setIsVisible(false)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-bold hover:opacity-90 transition-all"
              >
                Start Shopping
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
