import { useLanguage } from '../../i18n/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <span
        className={`lang-toggle-thumb${lang === 'fr' ? ' lang-toggle-thumb--fr' : ''}`}
        aria-hidden="true"
      />
      <button
        type="button"
        className={`lang-toggle-btn${lang === 'en' ? ' lang-toggle-btn--active' : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-toggle-btn${lang === 'fr' ? ' lang-toggle-btn--active' : ''}`}
        onClick={() => setLang('fr')}
        aria-pressed={lang === 'fr'}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageToggle;
