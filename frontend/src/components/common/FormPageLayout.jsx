import { Link } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import { useLanguage } from '../../i18n/LanguageContext';
import '../../styles/FormPage.css';

const FormPageLayout = ({
  title,
  subtitle,
  listLink,
  listLabel,
  isModal = false,
  children,
}) => {
  const { t } = useLanguage();
  const resolvedListLabel = listLabel || t('form.viewList');

  const content = (
    <div className="form-page">
      <div className="form-page-header">
        <h1 className="form-page-title">{title}</h1>
        {subtitle && <p className="form-page-subtitle">{subtitle}</p>}
      </div>

      <div className="form-page-card">
        <aside className="form-page-aside">
          <div className="form-page-aside-orb form-page-aside-orb--top" aria-hidden="true" />
          <div className="form-page-aside-orb" aria-hidden="true" />
          <p className="form-page-aside-text">{t('form.aside')}</p>
          <Link to={listLink} className="form-page-aside-link">
            <span>{resolvedListLabel}</span>
            <IoArrowForward className="form-page-aside-arrow" />
          </Link>
        </aside>

        <div className="form-page-body">{children}</div>
      </div>
    </div>
  );

  if (isModal) {
    return <div className="form-page-overlay">{content}</div>;
  }

  return content;
};

export default FormPageLayout;
