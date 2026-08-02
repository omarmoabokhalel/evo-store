import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Upload, ArrowRight, CheckCircle } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { useMutation } from '@tanstack/react-query'
import { uploadReceipt as uploadReceiptService } from '@/services/orders'
import { toast } from 'sonner'

export default function UploadReceipt() {
  const { language } = useLanguageStore()
  const t = translations[language]
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadReceiptMutation = useMutation({ mutationFn: uploadReceiptService })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !orderId) {
      toast.error(language === 'ar' ? 'يرجى اختيار صورة الإيصال' : 'Please select a receipt image')
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string

        await uploadReceiptMutation.mutateAsync({
          orderId,
          receiptImage: base64
        })

        toast.success(language === 'ar' ? 'تم رفع الإيصال بنجاح! 🎉' : 'Receipt uploaded successfully!')
        navigate(`/track-order/${orderId}`)
      }
      reader.readAsDataURL(selectedFile)
    } catch (error: any) {
      toast.error(error.message || (language === 'ar' ? 'فشل رفع الإيصال' : 'Failed to upload receipt'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground mb-2">
            {language === 'ar' ? 'رفع إيصال الدفع' : 'Upload Payment Receipt'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'يرجى رفع صورة الإيصال لإتمام طلبك' : 'Please upload receipt image to complete your order'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-card border border-border shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-[#6B46C1] transition-colors cursor-pointer">
              <input
                type="file"
                id="receipt"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="receipt" className="cursor-pointer">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Receipt preview"
                      className="max-h-64 mx-auto rounded-xl"
                    />
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'انقر لتغيير الصورة' : 'Click to change image'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-[#6B46C1] mx-auto" />
                    <div>
                      <p className="font-bold text-foreground">
                        {language === 'ar' ? 'انقر لرفع الإيصال' : 'Click to upload receipt'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'ar' ? 'PNG, JPG حتى 10MB' : 'PNG, JPG up to 10MB'}
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Instructions */}
            <div className="p-4 rounded-2xl bg-foreground/5 border border-border">
              <h3 className="font-bold text-foreground mb-2">
                {language === 'ar' ? 'تعليمات:' : 'Instructions:'}
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>{language === 'ar' ? 'تأكد من وضوح صورة الإيصال' : 'Ensure receipt image is clear'}</li>
                <li>{language === 'ar' ? 'يجب أن يظهر المبلغ المحول' : 'Transfer amount must be visible'}</li>
                <li>{language === 'ar' ? 'يجب أن يظهر رقم المحفظة' : 'Wallet number must be visible'}</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className={`w-full py-4 rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                !selectedFile || isUploading
                  ? 'bg-foreground/10 text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white hover:opacity-90 hover:scale-101'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                </>
              ) : (
                <>
                  {language === 'ar' ? 'رفع الإيصال' : 'Upload Receipt'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Skip for now */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {language === 'ar' ? 'رفع لاحقاً' : 'Upload later'}
          </button>
        </motion.div>
      </div>
    </main>
  )
}
