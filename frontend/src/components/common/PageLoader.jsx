import './PageLoader.css';
import { useLanguage } from '../../i18n/LanguageContext';

const PageLoader = ({ inline = false }) => {
  const { t } = useLanguage();

  return (
    <div
      className={`page-loader${inline ? ' page-loader--inline' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={t('common.loadingAria')}
    >
      <div className="page-loader-spinner" />
    </div>
  );
};

export default PageLoader;
