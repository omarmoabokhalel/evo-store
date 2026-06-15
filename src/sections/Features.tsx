import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Shirt, Truck, Palette, Shield, Clock } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { language } = useLanguageStore()
  const t = translations[language]

  const features = [
    {
      icon: Sparkles,
      title: t.feat1Title,
      description: t.feat1Desc,
      gradient: 'from-[#6B46C1] to-[#3B82F6]',
    },
    {
      icon: Palette,
      title: t.feat2Title,
      description: t.feat2Desc,
      gradient: 'from-[#3B82F6] to-[#10B981]',
    },
    {
      icon: Shirt,
      title: t.feat3Title,
      description: t.feat3Desc,
      gradient: 'from-[#10B981] to-[#FBBF24]',
    },
    {
      icon: Truck,
      title: t.feat4Title,
      description: t.feat4Desc,
      gradient: 'from-[#FBBF24] to-[#FF2A2A]',
    },
    {
      icon: Shield,
      title: t.feat5Title,
      description: t.feat5Desc,
      gradient: 'from-[#FF2A2A] to-[#6B46C1]',
    },
    {
      icon: Clock,
      title: t.feat6Title,
      description: t.feat6Desc,
      gradient: 'from-[#6B46C1] to-[#EC4899]',
    },
  ]

  return (
    <section ref={ref} className="relative py-32 bg-background border-t border-border transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6B46C1]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.02em] mb-4 text-foreground">
            {language === 'ar' ? (
              <>ليه تختار <span className="text-gradient">EVO</span>؟</>
            ) : (
              <>Why <span className="text-gradient">EVO</span>?</>
            )}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.whyEvoDesc}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:bg-foreground/[0.02] hover:shadow-lg transition-all duration-500 overflow-hidden"
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-sm`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
