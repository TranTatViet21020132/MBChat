import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import localesResourse from "@/locales";
import * as RNLocalize from "react-native-localize";

const languageDetector = {
  type: "languageDetector",
  detect: () => RNLocalize.getLocales()[0].languageCode,
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(reactI18nextModule)
  .use(languageDetector)
  .init({
    resources: localesResourse,
    fallbackLng: "vi",
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true
    }
  });

export default i18n;
