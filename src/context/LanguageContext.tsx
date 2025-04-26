
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  'nav.templates': {
    en: 'Templates',
    nl: 'Sjablonen',
    fr: 'Modèles',
    ar: 'قوالب',
    es: 'Plantillas',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    nl: 'Dashboard',
    fr: 'Tableau de bord',
    ar: 'لوحة التحكم',
    es: 'Panel',
  },
  'nav.savedwebsites': {
    en: 'Saved Websites',
    nl: 'Opgeslagen websites',
    fr: 'Sites web enregistrés',
    ar: 'المواقع المحفوظة',
    es: 'Sitios web guardados',
  },
  'cta.contact': {
    en: 'Contact Us',
    nl: 'Neem contact op',
    fr: 'Contactez-nous',
    ar: 'اتصل بنا',
    es: 'Contáctenos',
  },
  'cta.getstarted': {
    en: 'Get Started',
    nl: 'Aan de slag',
    fr: 'Commencer',
    ar: 'ابدأ الآن',
    es: 'Comenzar',
  },
  'cta.booknow': {
    en: 'Book Now',
    nl: 'Nu boeken',
    fr: 'Réserver',
    ar: 'احجز الآن',
    es: 'Reservar ahora',
  },
  'cta.learnmore': {
    en: 'Learn More',
    nl: 'Meer informatie',
    fr: 'En savoir plus',
    ar: 'اعرف المزيد',
    es: 'Más información',
  },
  'cta.shopnow': {
    en: 'Shop Now',
    nl: 'Nu winkelen',
    fr: 'Acheter',
    ar: 'تسوق الآن',
    es: 'Comprar ahora',
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
  // Templates section
  'templates.title': {
    en: 'Choose Your Template',
    nl: 'Kies Je Sjabloon',
    fr: 'Choisissez Votre Modèle',
    ar: 'اختر قالبك',
    es: 'Elige Tu Plantilla',
  },
  'templates.subtitle': {
    en: 'Select from our professionally designed templates',
    nl: 'Kies uit onze professioneel ontworpen sjablonen',
    fr: 'Sélectionnez parmi nos modèles conçus professionnellement',
    ar: 'اختر من قوالبنا المصممة احترافياً',
    es: 'Selecciona entre nuestras plantillas diseñadas profesionalmente',
  },
  'templates.ourTemplates': {
    en: 'Our Templates',
    nl: 'Onze Sjablonen',
    fr: 'Nos Modèles',
    ar: 'قوالبنا',
    es: 'Nuestras Plantillas',
  },
  'templates.tradecraft.desc': {
    en: 'Perfect for trade businesses like plumbers, electricians, and contractors',
    nl: 'Perfect voor handelbedrijven zoals loodgieters, elektriciens en aannemers',
    fr: 'Parfait pour les métiers comme plombiers, électriciens et entrepreneurs',
    ar: 'مثالي للأعمال التجارية مثل السباكين والكهربائيين والمقاولين',
    es: 'Perfecto para negocios comerciales como plomeros, electricistas y contratistas',
  },
  'templates.retail.desc': {
    en: 'Ideal for retail stores, shops and e-commerce businesses',
    nl: 'Ideaal voor winkels en e-commerce bedrijven',
    fr: 'Idéal pour les magasins de détail et les entreprises e-commerce',
    ar: 'مثالي للمتاجر ومحلات البيع بالتجزئة والتجارة الإلكترونية',
    es: 'Ideal para tiendas minoristas y negocios de comercio electrónico',
  },
  'templates.service.desc': {
    en: 'For service-based businesses like consultants and professionals',
    nl: 'Voor dienstverlenende bedrijven zoals consultants en professionals',
    fr: 'Pour les entreprises de services comme les consultants et les professionnels',
    ar: 'للشركات الخدمية مثل المستشارين والمهنيين',
    es: 'Para empresas de servicios como consultores y profesionales',
  },
  'templates.expert.desc': {
    en: 'Perfect for local experts and specialized service providers',
    nl: 'Perfect voor lokale experts en gespecialiseerde dienstverleners',
    fr: 'Parfait pour les experts locaux et les prestataires de services spécialisés',
    ar: 'مثالي للخبراء المحليين ومقدمي الخدمات المتخصصة',
    es: 'Perfecto para expertos locales y proveedores de servicios especializados',
  },
  'templates.cleanslate.desc': {
    en: 'Start from scratch with a minimal template',
    nl: 'Begin vanaf nul met een minimaal sjabloon',
    fr: 'Commencer de zéro avec un modèle minimal',
    ar: 'ابدأ من الصفر بقالب بسيط',
    es: 'Empieza desde cero con una plantilla mínima',
  },
  // Form fields
  'form.companyName': {
    en: 'Company Name',
    nl: 'Bedrijfsnaam',
    fr: 'Nom de l\'entreprise',
    ar: 'اسم الشركة',
    es: 'Nombre de la empresa',
  },
  'form.domainName': {
    en: 'Domain Name',
    nl: 'Domeinnaam',
    fr: 'Nom de domaine',
    ar: 'اسم النطاق',
    es: 'Nombre de dominio',
  },
  'form.logo': {
    en: 'Logo URL (optional)',
    nl: 'Logo URL (optioneel)',
    fr: 'URL du logo (optionnel)',
    ar: 'رابط الشعار (اختياري)',
    es: 'URL del logo (opcional)',
  },
  'form.primaryColor': {
    en: 'Primary Color',
    nl: 'Primaire Kleur',
    fr: 'Couleur Principale',
    ar: 'اللون الأساسي',
    es: 'Color Primario',
  },
  'form.secondaryColor': {
    en: 'Secondary Color',
    nl: 'Secundaire Kleur',
    fr: 'Couleur Secondaire',
    ar: 'اللون الثانوي',
    es: 'Color Secundario',
  },
  // Buttons
  'buttons.createWebsite': {
    en: 'Create Website',
    nl: 'Website Maken',
    fr: 'Créer le Site',
    ar: 'إنشاء موقع',
    es: 'Crear Sitio Web',
  },
  'buttons.selectTemplate': {
    en: 'Select Template',
    nl: 'Selecteer Sjabloon',
    fr: 'Sélectionner le Modèle',
    ar: 'اختر القالب',
    es: 'Seleccionar Plantilla',
  },
  'buttons.cancel': {
    en: 'Cancel',
    nl: 'Annuleren',
    fr: 'Annuler',
    ar: 'إلغاء',
    es: 'Cancelar',
  },
  'buttons.viewTemplate': {
    en: 'View Template',
    nl: 'Bekijk Sjabloon',
    fr: 'Voir le Modèle',
    ar: 'عرض القالب',
    es: 'Ver Plantilla',
  },
  'buttons.viewAllTemplates': {
    en: 'View All Templates',
    nl: 'Bekijk Alle Sjablonen',
    fr: 'Voir Tous les Modèles',
    ar: 'عرض جميع القوالب',
    es: 'Ver Todas las Plantillas',
  },
  // Why choose section
  'why.title': {
    en: 'Why Choose Our Platform',
    nl: 'Waarom Ons Platform Kiezen',
    fr: 'Pourquoi Choisir Notre Plateforme',
    ar: 'لماذا تختار منصتنا',
    es: 'Por Qué Elegir Nuestra Plataforma',
  },
  'why.design.title': {
    en: 'Professionally Designed',
    nl: 'Professioneel Ontworpen',
    fr: 'Conçu Professionnellement',
    ar: 'تصميم احترافي',
    es: 'Diseñado Profesionalmente',
  },
  'why.design.desc': {
    en: 'Templates created by experienced designers',
    nl: 'Sjablonen gemaakt door ervaren ontwerpers',
    fr: 'Modèles créés par des designers expérimentés',
    ar: 'قوالب من تصميم مصممين ذوي خبرة',
    es: 'Plantillas creadas por diseñadores experimentados',
  },
  'why.responsive.title': {
    en: 'Fully Responsive',
    nl: 'Volledig Responsief',
    fr: 'Entièrement Responsive',
    ar: 'تجاوب كامل',
    es: 'Totalmente Responsivo',
  },
  'why.responsive.desc': {
    en: 'Look great on all devices, from mobile to desktop',
    nl: 'Ziet er geweldig uit op alle apparaten, van mobiel tot desktop',
    fr: 'Aspect optimal sur tous les appareils, du mobile au desktop',
    ar: 'مظهر رائع على جميع الأجهزة، من المحمول إلى سطح المكتب',
    es: 'Se ve genial en todos los dispositivos, desde móviles hasta escritorio',
  },
  'why.custom.title': {
    en: 'Easy Customization',
    nl: 'Eenvoudige Aanpassing',
    fr: 'Personnalisation Facile',
    ar: 'تخصيص سهل',
    es: 'Fácil Personalización',
  },
  'why.custom.desc': {
    en: 'Simple tools to match your brand and needs',
    nl: 'Eenvoudige tools om aan te sluiten bij uw merk en behoeften',
    fr: 'Outils simples pour correspondre à votre marque et vos besoins',
    ar: 'أدوات بسيطة لتتناسب مع علامتك التجارية واحتياجاتك',
    es: 'Herramientas simples para adaptarse a su marca y necesidades',
  },
  // Errors
  'errors.missingFields': {
    en: 'Missing Required Fields',
    nl: 'Verplichte Velden Ontbreken',
    fr: 'Champs Obligatoires Manquants',
    ar: 'حقول مطلوبة مفقودة',
    es: 'Faltan Campos Requeridos',
  },
  'errors.fillRequired': {
    en: 'Please fill in all required fields',
    nl: 'Vul alle verplichte velden in',
    fr: 'Veuillez remplir tous les champs obligatoires',
    ar: 'يرجى ملء جميع الحقول المطلوبة',
    es: 'Por favor complete todos los campos requeridos',
  },
  // App general
  'app.name': {
    en: 'TemplateBuilder',
    nl: 'TemplateBuilder',
    fr: 'TemplateBuilder',
    ar: 'منشئ القوالب',
    es: 'TemplateBuilder',
  },
  'app.description': {
    en: 'Create stunning websites for your clients',
    nl: 'Maak prachtige websites voor uw klanten',
    fr: 'Créez des sites web magnifiques pour vos clients',
    ar: 'أنشئ مواقع مذهلة لعملائك',
    es: 'Crea sitios web impresionantes para tus clientes',
  },
  // Footer
  'footer.rights': {
    en: 'All rights reserved',
    nl: 'Alle rechten voorbehouden',
    fr: 'Tous droits réservés',
    ar: 'جميع الحقوق محفوظة',
    es: 'Todos los derechos reservados',
  },
  'footer.contact': {
    en: 'Contact Us',
    nl: 'Neem Contact Op',
    fr: 'Contactez-nous',
    ar: 'اتصل بنا',
    es: 'Contáctenos',
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
  useEffect(() => {
    localStorage.setItem('preferred_language', language);
    
    // Set direction on document for RTL support
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);
  
  // Load saved language preference
  useEffect(() => {
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
