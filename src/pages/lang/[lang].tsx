import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import useLocalStorage from "~/hooks/localStorage";
import { i18n } from "~/lib/i18n";
import Home from "~/pages";

export async function getStaticPaths() {
  return {
    paths: ["fr", "en", "nl"].map(lang => ({ params: { lang } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  i18n.changeLanguage(params.lang);

  return { props: params };
}

interface Props {
  lang: string;
}

export default function Lang(props: Props) {
  const { lang } = props;
  const [, setLang] = useLocalStorage("lang", lang);

  const router = useRouter();

  useEffect(() => {
    setLang(lang);
    router.push("/");
  }, []);

  return <Home />;
}
