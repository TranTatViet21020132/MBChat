import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, vi } from "@/locales";
import { getLocales } from 'expo-localization';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

const languageDetector = {
  type: "languageDetector",
  detect: async () => {
    const locales = getLocales();
    return locales.length > 0 ? locales[0].languageCode : "en";
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(initReactI18next)
  .init({
    debug: false,
    lng: 'en',
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources,
    detection: languageDetector
  });

export default i18next;
