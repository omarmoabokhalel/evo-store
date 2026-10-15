import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { Truck, ShieldCheck, Banknote } from 'lucide-react'

export default function AnnouncementBar() {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <div className="bg-zinc-950 text-zinc-200 border-b border-white/10 text-xs sm:text-sm py-2 px-4 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 sm:gap-4 text-center font-medium tracking-wide">
        <div className="flex items-center gap-1.5 shrink-0 text-[#6B46C1] dark:text-[#8B5CF6]">
          <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <p className="truncate sm:whitespace-normal">
          {t.topAnnouncement}
        </p>
        <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-xs">
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#3B82F6]" />
            {language === 'ar' ? 'معاينة عند الاستلام' : 'Inspect upon delivery'}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {language === 'ar' ? 'قطن مصري 100%' : '100% Egyptian Cotton'}
          </span>
        </div>
      </div>
    </div>
  )
}
