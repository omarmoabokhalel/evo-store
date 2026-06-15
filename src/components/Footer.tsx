import { Link } from 'react-router'
import { Shirt, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'

export default function Footer() {
  const { language } = useLanguageStore()
  const t = translations[language]

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
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-all"
                  title={label}
                >
                  <Icon className="w-4 h-4 text-foreground/60" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.1em] text-foreground mb-6">
              {t.navShop}
            </h3>
            <ul className="space-y-3">
              {[
                { path: '/shop/men', label: t.navMen },
                { path: '/shop/women', label: t.navWomen },
                { path: '/shop', label: t.allProducts },
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

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.1em] text-foreground mb-6">
              {language === 'ar' ? 'الدعم والمساعدة' : 'Support'}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t.sizeGuideTitle, path: '/shop' },
                { label: t.trackYourOrder, path: '/track-order/demo' },
                { label: language === 'ar' ? 'معلومات الشحن' : 'Shipping Info', path: '/shop' },
                { label: language === 'ar' ? 'سياسة الاسترجاع' : 'Returns Policy', path: '/shop' },
              ].map((link) => (
                <li key={link.label}>
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
              {language === 'ar' ? 'تواصل معنا' : 'Contact'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6B46C1] mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  {language === 'ar' ? 'منطقة الأزياء، القاهرة، مصر' : 'Fashion District, Cairo, Egypt'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#6B46C1] shrink-0" />
                <span className="text-muted-foreground text-sm" dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6B46C1] shrink-0" />
                <span className="text-muted-foreground text-sm">hello@evo-brand.com</span>
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
            <Link to="/" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              {language === 'ar' ? 'سياسة ملفات الارتباط' : 'Cookie Policy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
