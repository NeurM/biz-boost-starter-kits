
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'nl' | 'fr' | 'ar' | 'es';

// Translation interface
export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Sample translations for key phrases
export const translations: Translations = {
  // Common UI elements
  'nav.home': {
    en: 'Home',
    nl: 'Hoofdpagina',
    fr: 'Accueil',
    ar: 'الرئيسية',
    es: 'Inicio',
  },
  'nav.about': {
    en: 'About',
    nl: 'Over ons',
    fr: 'À propos',
    ar: 'عن الشركة',
    es: 'Acerca de',
  },
  'nav.services': {
    en: 'Services',
    nl: 'Diensten',
    fr: 'Services',
    ar: 'الخدمات',
    es: 'Servicios',
  },
  'nav.products': {
    en: 'Products',
    nl: 'Producten',
    fr: 'Produits',
    ar: 'المنتجات',
    es: 'Productos',
  },
  'nav.blog': {
    en: 'Blog',
    nl: 'Blog',
    fr: 'Blog',
    ar: 'المدونة',
    es: 'Blog',
  },
  'nav.contact': {
    en: 'Contact',
    nl: 'Contact',
    fr: 'Contact',
    ar: 'اتصل بنا',
    es: 'Contacto',
  },
  'cta.contact': {
    en: 'Contact Us',
    nl: 'Neem contact op',
    fr: 'Contactez-nous',
    ar: 'اتصل بنا',
    es: 'Contáctenos',
  },
  'cta.getStarted': {
    en: 'Get Started',
    nl: 'Aan de slag',
    fr: 'Commencer',
    ar: 'ابدأ الآن',
    es: 'Comenzar',
  },
  'cta.bookNow': {
    en: 'Book Now',
    nl: 'Nu boeken',
    fr: 'Réserver',
    ar: 'احجز الآن',
    es: 'Reservar ahora',
  },
  'cta.learnMore': {
    en: 'Learn More',
    nl: 'Meer informatie',
    fr: 'En savoir plus',
    ar: 'اعرف المزيد',
    es: 'Más información',
  },
  // Hero section
  'hero.title': {
    en: 'Professional services for your business',
    nl: 'Professionele diensten voor uw bedrijf',
    fr: 'Services professionnels pour votre entreprise',
    ar: 'خدمات احترافية لعملك',
    es: 'Servicios profesionales para su negocio',
  },
  'hero.subtitle': {
    en: 'Quality solutions tailored to your needs',
    nl: 'Kwaliteitsoplossingen op maat van uw behoeften',
    fr: 'Solutions de qualité adaptées à vos besoins',
    ar: 'حلول جودة مصممة حسب احتياجاتك',
    es: 'Soluciones de calidad adaptadas a sus necesidades',
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  direction: 'ltr',
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Define translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    if (!translations[key][language]) {
      console.warn(`Translation not available for key "${key}" in language "${language}"`);
      return translations[key]['en'] || key; // Fallback to English or key itself
    }
    
    return translations[key][language];
  };
  
  // Handle text direction for RTL languages like Arabic
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  
  // Store language preference
  React.useEffect(() => {
    localStorage.setItem('preferred_language', language);
    
    // Set direction on document for RTL support
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);
  
  // Load saved language preference
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage && ['en', 'nl', 'fr', 'ar', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};
