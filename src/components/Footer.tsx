import { Link } from 'react-router'
import { Shirt, Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { BRAND_CONFIG, getWhatsAppSupportUrl } from '@/config/brand'

export default function Footer() {
  const { language } = useLanguageStore()
  const isAr = language === 'ar'
  const t = translations[language]
  const whatsappUrl = getWhatsAppSupportUrl(undefined, isAr)

  return (
    <footer className="bg-secondary/20 dark:bg-zinc-950/40 border-t border-border transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] rounded-xl flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-[-0.05em] text-foreground">EVO</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-all text-[#25D366]"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-all text-foreground/60 hover:text-foreground"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${BRAND_CONFIG.supportEmail}`}
                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-all text-foreground/60 hover:text-foreground"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.1em] text-foreground mb-6">
              {t.navShop}
            </h3>
            <ul className="space-y-3">
              {[
                { path: '/shop', label: t.allProducts },
                { path: '/shop/men', label: isAr ? 'رجالي (أوفرسايز)' : 'Men (Oversized)' },
                { path: '/shop/women', label: isAr ? 'حريمي (أوفرسايز)' : 'Women (Oversized)' },
                { path: '/customizer', label: t.navAIShowroom },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.1em] text-foreground mb-6">
              {isAr ? 'الدعم والسياسات' : 'Support & Policies'}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t.sizeGuideTitle, path: '/size-guide' },
                { label: t.trackYourOrder, path: '/track-order' },
                { label: isAr ? 'سياسة الشحن (25 ج)' : 'Shipping Policy (25 EGP)', path: '/shipping-policy' },
                { label: isAr ? 'سياسة استبدال المقاس (14 يوم)' : 'Returns & Exchange (14 Days)', path: '/returns-exchange-policy' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.1em] text-foreground mb-6">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6B46C1] mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {isAr ? BRAND_CONFIG.locationAr : BRAND_CONFIG.location}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#6B46C1] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#25D366] text-sm transition-colors"
                  dir="ltr"
                >
                  +{BRAND_CONFIG.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6B46C1] shrink-0" />
                <a
                  href={`mailto:${BRAND_CONFIG.supportEmail}`}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {BRAND_CONFIG.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-muted-foreground text-xs text-center md:text-start space-y-1">
            <p>&copy; {new Date().getFullYear()} EVO Brand. {t.footerRights}</p>
            <p className="text-primary font-medium text-[11px] tracking-wide">{t.footerMadeInEgypt}</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
            </Link>
            <Link to="/shipping-policy" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {isAr ? 'الشحن والتوصيل' : 'Shipping Info'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
