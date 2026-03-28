import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.stocks': 'Crop Market',
    'nav.sip': 'Seed Plan',
    'nav.portfolio': 'Farm Portfolio',
    'nav.simulations': 'Paper Farming',
    'nav.learn': 'Learn',
    'nav.puzzles': 'Scenarios',
    'nav.profile': 'Farm Stats',
    'profile.title': 'Farm Stats',
    'profile.logout': 'Logout',
    'profile.language': 'Language',
  },
  hi: {
    'nav.home': 'होम',
    'nav.stocks': 'स्टॉक्स',
    'nav.sip': 'एसआईपी',
    'nav.portfolio': 'पोर्टफोलियो',
    'nav.simulations': 'सिमुलेशन',
    'nav.learn': 'सीखें',
    'nav.puzzles': 'पहेलियाँ',
    'nav.profile': 'प्रोफ़ाइल',
    'profile.title': 'प्रोफ़ाइल',
    'profile.logout': 'लॉग आउट',
    'profile.language': 'भाषा',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('fincoach_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('fincoach_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
