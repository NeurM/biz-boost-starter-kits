
import React, { createContext, useContext, useState, useCallback } from 'react';

// Supported language codes
const SUPPORTED_LANGUAGES = ['en', 'nl', 'fr', 'ar', 'es'] as const;
type Language = (typeof SUPPORTED_LANGUAGES)[number];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.templates": "Templates",
    "nav.dashboard": "Dashboard",
    "nav.savedwebsites": "Saved Websites",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.loggedOut": "Logged out successfully",
    "auth.logoutSuccess": "You have been logged out of your account.",
    "auth.logoutFailed": "Logout Failed",
    "templates.title": "Choose Your Template",
    "templates.subtitle": "Select from our professionally designed templates to get started quickly",
    "nav.userMenu": "User Menu",
    "actions.edit": "Edit",
    "actions.publish": "Publish",
  },
  nl: {},
  fr: {},
  ar: {},
  es: {},
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string) => {
    // Try current language, then fallback to 'en', then fallback to key
    return (
      translations[language][key] ||
      translations['en'][key] ||
      key
    );
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export type { Language };
