import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/integrations/i18n';

interface LanguageContextType {
  t: (key: string) => string;
  i18n: typeof i18n;
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

const translations = {
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
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  // Initialize missing keys in i18n
  i18n.addResourceBundle('en', 'translation', translations.en, true, true);

  return (
    <LanguageContext.Provider value={{ t, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};
