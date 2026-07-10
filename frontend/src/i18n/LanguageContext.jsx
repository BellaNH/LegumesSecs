import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, SUPPORTED_LANGS, translations } from './translations';

const LanguageContext = createContext(null);

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function interpolate(template, vars = {}) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`
  );
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('legumesec_lang');
    if (SUPPORTED_LANGS.includes(saved)) return saved;
    return DEFAULT_LANG;
  });

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGS.includes(next)) return;
    setLangState(next);
    localStorage.setItem('legumesec_lang', next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'fr' : 'en');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations[DEFAULT_LANG];
      let value = getByPath(dict, key);

      if (value == null && vars?.count != null) {
        const pluralKey = `${key}_plural`;
        const plural = getByPath(dict, pluralKey);
        if (plural != null && Number(vars.count) !== 1) {
          value = plural;
        }
      }

      if (value == null) {
        value = getByPath(translations[DEFAULT_LANG], key) ?? key;
      }

      return interpolate(value, vars);
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export default LanguageContext;
