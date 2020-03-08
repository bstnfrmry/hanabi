import { getLocalizationAsync } from "expo-localization";
import i18n from "i18next";
import React from "react";
import { initReactI18next } from "react-i18next";
import { I18nextProvider } from "react-i18next";

import { en } from "../locales/en";
import { fr } from "../locales/fr";

i18n
  .use({
    type: "languageDetector",
    async: true,
    detect: async (callback: any) => {
      const { locale } = await getLocalizationAsync();

      callback(locale);
    },
    init: () => {
      //
    },
    cacheUserLanguage: () => {
      //
    }
  })
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false
    },
    resources: {
      en,
      fr
    }
  });

export const I18nProvider: React.FC = props => {
  const { children } = props;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
