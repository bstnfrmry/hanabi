import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import useLocalStorage from "~/hooks/localStorage";

const Flags = {
  en: "🇬🇧",
  fr: "🇫🇷",
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage("lang", null);

  useEffect(() => {
    if (!lang) return;

    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <div className="flex">
      {Object.entries(Flags).map(([lang, flag]) => {
        return (
          <a
            key={lang}
            className="no-underline mh2 pointer f3"
            onClick={() => {
              setLang(lang);
            }}
          >
            {flag}
          </a>
        );
      })}
    </div>
  );
}
