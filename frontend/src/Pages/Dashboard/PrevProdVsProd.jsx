import { useLanguage } from '../../i18n/LanguageContext';

export default function PrevProdVsProd({ data = [] }) {
  const { t } = useLanguage();
  const prevProdVsProductionData = Array.isArray(data) ? data : [];

  return (
    <div className="dashboard-prev-prod">
      <div className="dashboard-prev-prod-header">
        <span>{t('dashboard.crop')}</span>
        <span>{t('dashboard.forecast')}</span>
        <span>{t('dashboard.production')}</span>
      </div>

      <div className="dashboard-prev-prod-body">
        {prevProdVsProductionData.length > 0 ? (
          prevProdVsProductionData.map((item, i) => (
            <div key={i} className="dashboard-prev-prod-row">
              <span className="dashboard-prev-prod-espece">{item.espece}</span>
              <span className="dashboard-prev-prod-prev">{item.prev_de_production}</span>
              <span className="dashboard-prev-prod-prod">{item.production}</span>
            </div>
          ))
        ) : (
          <div className="dashboard-prev-prod-empty">{t('common.noData')}</div>
        )}
      </div>
    </div>
  );
}
