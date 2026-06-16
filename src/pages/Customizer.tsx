import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Wand2,
  Download,
  Shirt,
  ArrowRight,
  ImagePlus,
  Loader2,
} from 'lucide-react'
import { demoProducts, colorOptions } from '@/data/products'
import { toast } from 'sonner'

export default function Customizer() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [selectedTShirtColor, setSelectedTShirtColor] = useState('#FFFFFF')
  const [prompt, setPrompt] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateDesign = useCallback(() => {
    if (!uploadedImage) {
      toast.error('Please upload an image first')
      return
    }
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      // Create a canvas with the uploaded image on a t-shirt mockup
      const canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 700
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Fill t-shirt background
      ctx.fillStyle = selectedTShirtColor
      ctx.fillRect(100, 50, 400, 550)

      // Rounded corners for t-shirt shape
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.moveTo(120, 50)
      ctx.lineTo(480, 50)
      ctx.quadraticCurveTo(500, 50, 500, 70)
      ctx.lineTo(500, 580)
      ctx.quadraticCurveTo(500, 600, 480, 600)
      ctx.lineTo(120, 600)
      ctx.quadraticCurveTo(100, 600, 100, 580)
      ctx.lineTo(100, 70)
      ctx.quadraticCurveTo(100, 50, 120, 50)
      ctx.fill()

      ctx.globalCompositeOperation = 'source-over'

      // Draw uploaded image in center
      const img = new Image()
      img.onload = () => {
        const aspect = img.width / img.height
        const maxW = 280
        const maxH = 320
        let w = maxW
        let h = w / aspect
        if (h > maxH) {
          h = maxH
          w = h * aspect
        }
        const x = (600 - w) / 2
        const y = 180

        // Add some style effects
        ctx.save()
        ctx.shadowColor = 'rgba(0,0,0,0.3)'
        ctx.shadowBlur = 20
        ctx.drawImage(img, x, y, w, h)
        ctx.restore()

        // Add "EVO AI" watermark
        ctx.font = 'bold 14px sans-serif'
        ctx.fillStyle = 'rgba(107, 70, 193, 0.6)'
        ctx.fillText('EVO AI DESIGN', 260, 520)

        setResult(canvas.toDataURL())
        setIsProcessing(false)
        toast.success('Design generated!')
      }
      img.src = uploadedImage
    }, 2000)
  }, [uploadedImage, selectedTShirtColor])

  const downloadDesign = () => {
    if (result) {
      const link = document.createElement('a')
      link.download = `evo-design-${Date.now()}.png`
      link.href = result
      link.click()
      toast.success('Design downloaded!')
    }
  }

  const tShirtColors = colorOptions.filter((c) =>
    ['#000000', '#FFFFFF', '#808080', '#1E3A5F', '#6B46C1', '#FF2A2A'].includes(c.value)
  )

  return (
    <main className="min-h-screen bg-[#050505] pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#6B46C1]" />
            <span className="text-sm font-medium uppercase tracking-[0.1em] text-[#6B46C1]">
              AI Studio
            </span>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] mb-4">
            Create Your Design
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Upload any image, choose your t-shirt color, and let our AI create a unique wearable design.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Upload & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            <div
              onClick={() => fileRef.current?.click()}
              className="relative aspect-[4/3] rounded-3xl border-2 border-dashed border-white/10 hover:border-[#6B46C1]/50 bg-white/[0.02] hover:bg-[#6B46C1]/5 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden"
            >
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain p-4" />
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <ImagePlus className="w-10 h-10 text-[#6B46C1]" />
                  </div>
                  <p className="font-medium mb-2">Click to upload your image</p>
                  <p className="text-white/40 text-sm">JPG, PNG up to 10MB</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Design Prompt (Optional)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want the design to look..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#6B46C1] resize-none h-24"
              />
            </div>

            {/* T-Shirt Color */}
            <div>
              <label className="block text-sm text-white/60 mb-3">T-Shirt Color</label>
              <div className="flex gap-3">
                {tShirtColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedTShirtColor(color.value)}
                    className={`w-12 h-12 rounded-full transition-all ${
                      selectedTShirtColor === color.value
                        ? 'ring-2 ring-[#6B46C1] ring-offset-2 ring-offset-[#050505]'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateDesign}
              disabled={!uploadedImage || isProcessing}
              className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                !uploadedImage || isProcessing
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white hover:opacity-90'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Design
                </>
              )}
            </button>

            {uploadedImage && (
              <button
                onClick={() => { setUploadedImage(null); setResult(null); }}
                className="w-full py-3 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-all"
              >
                Clear & Start Over
              </button>
            )}
          </motion.div>

          {/* Right - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
              {result ? (
                <img src={result} alt="Generated Design" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6B46C1]/20 to-[#3B82F6]/20 flex items-center justify-center mb-6">
                    <Shirt className="w-12 h-12 text-[#6B46C1]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Design Preview</h3>
                  <p className="text-white/40">
                    Upload an image and click Generate to see your custom t-shirt design here.
                  </p>
                </div>
              )}
            </div>

            {result && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={downloadDesign}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <Link
                  to="/shop"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-medium hover:opacity-90 transition-all"
                >
                  Order This Design
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Inspiration Gallery */}
        <div className="mt-32">
          <h2 className="text-2xl font-bold mb-8">Design Inspiration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demoProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
