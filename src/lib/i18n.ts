import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { en } from "~/locales/en";
import { es } from "~/locales/es";
import { fr } from "~/locales/fr";
import { it } from "~/locales/it";
import { nl } from "~/locales/nl";
import { pt } from "~/locales/pt";
import { ru } from "~/locales/ru";
import { de } from "~/locales/de";
import { sk } from "~/locales/sk";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      es: {
        translation: es,
      },
      it: {
        translation: it,
      },
      nl: {
        translation: nl,
      },
      ru: {
        translation: ru,
      },
      pt: {
        translation: pt,
      },
      de: {
        translation: de,
      },
      sk: {
        translation: sk,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n };
