import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Language, type TranslationKey, translations } from "./i18n";

const LANGUAGE_KEY = "pranvardhan_language";

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => any;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved === "hi" || saved === "en") {
        setLang(saved);
      }
      setLoaded(true);
    });
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    AsyncStorage.setItem(LANGUAGE_KEY, newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): any => {
      return translations[lang][key];
    },
    [lang]
  );

  if (!loaded) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
