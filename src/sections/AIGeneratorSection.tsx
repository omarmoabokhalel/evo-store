import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { Sparkles, ArrowRight, Upload, Wand2, Shirt } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'

export default function AIGeneratorSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { language } = useLanguageStore()
  const t = translations[language]

  const steps = [
    { icon: Upload, title: t.step1Title, desc: t.step1Desc },
    { icon: Wand2, title: t.step2Title, desc: t.step2Desc },
    { icon: Shirt, title: t.step3Title, desc: t.step3Desc },
  ]

  return (
    <section ref={ref} className="relative py-16 sm:py-20 md:py-32 bg-background border-t border-border overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-[#6B46C1]/10 rounded-full blur-[150px] sm:blur-[200px]" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
              {/* Glowing ring */}
              <div className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full border-2 border-[#6B46C1]/20 animate-pulse" />
              <div className="absolute inset-8 sm:inset-12 md:inset-16 rounded-full border border-[#3B82F6]/20" />

              {/* T-shirt visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-52 sm:w-52 sm:h-64 md:w-64 md:h-80">
                  {/* T-shirt shape */}
                  <div className="absolute inset-0 bg-card border border-border rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm shadow-xl">
                    <Shirt className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-foreground/10 mb-2 sm:mb-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48 bg-gradient-to-br from-[#6B46C1]/30 to-[#3B82F6]/30 rounded-xl flex items-center justify-center border border-border">
                        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#6B46C1] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute -top-4 sm:-top-5 md:-top-6 -right-4 sm:-right-5 md:-right-6 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center shadow-2xl"
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                    className="absolute -bottom-3 sm:-bottom-4 md:-bottom-4 -left-3 sm:-left-4 md:-left-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border shadow-md"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gradient">{t.aiPowered}</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B46C1]" />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.1em] text-[#6B46C1]">
                {t.aiTech}
              </span>
            </div>

            <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] sm:text-[clamp(1.75rem,4.5vw,3rem)] md:text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.02em] mb-4 sm:mb-6 leading-[1.1] text-foreground">
              {language === 'ar' ? (
                <>صمم <span className="text-gradient">ستايلك الفريد</span> بنفسك</>
              ) : (
                <>Design Your Own <span className="text-gradient">Unique Style</span></>
              )}
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10">
              {t.aiSectionDesc}
            </p>

            {/* Steps */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 md:mb-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] shrink-0 shadow-sm">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/customizer"
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#3B82F6] text-white font-bold text-sm sm:text-base hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              {t.launchStudio}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
