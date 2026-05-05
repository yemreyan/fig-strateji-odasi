import React, { createContext, useContext, useState } from "react";
import type { Lang } from "./i18n";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LangCtx>({ lang: "tr", setLang: () => {} });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem("fig-v3-lang") as Lang) ?? "tr"
  );

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("fig-v3-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
