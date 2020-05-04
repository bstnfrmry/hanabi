import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Select } from "~/components/ui/forms";
import useLocalStorage from "~/hooks/localStorage";

const Languages = {
  en: "🇬🇧 English",
  fr: "🇫🇷 Français",
  nl: "🇳🇱 Dutch",
};

interface Props {
  outlined?: boolean;
}

export default function LanguageSelector(props: Props) {
  const { outlined = false } = props;

  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage("lang", i18n.language);

  useEffect(() => {
    if (!lang) return;

    i18n.changeLanguage(lang);
  }, [lang]);

  return <Select options={Languages} outlined={outlined} value={lang} onChange={e => setLang(e.target.value)} />;
}
