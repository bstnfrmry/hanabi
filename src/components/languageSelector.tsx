import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Select } from "~/components/ui/forms";
import useLocalStorage from "~/hooks/localStorage";

const Languages = {
  en: "English",
  fr: "Français",
  es: "Español",
  nl: "Dutch",
  ru: "Russian",
  pt: "Português",
};

interface Props {
  outlined?: boolean;
}

export default function LanguageSelector(props: Props) {
  const { outlined = false } = props;

  const { t, i18n } = useTranslation();
  // Will be stored as "fr-FR" after automatic language detecion
  const [defaultLanguage] = i18n.language.split("-");

  const [lang, setLang] = useLocalStorage("lang", defaultLanguage);

  useEffect(() => {
    if (!lang) return;

    i18n.changeLanguage(lang);
  }, [lang]);

  const languages = {
    ...Languages,
    new: `🎁 ${t("contributeLanguage")}`,
  };

  return (
    <label title={t("selectLanguage")}>
      <Select
        options={languages}
        outlined={outlined}
        value={lang}
        onChange={e => {
          if (e.target.value === "new") {
            window.open("https://github.com/bstnfrmry/hanabi/issues/180", "_blank").focus();
            return;
          }

          setLang(e.target.value);
        }}
      />
    </label>
  );
}
