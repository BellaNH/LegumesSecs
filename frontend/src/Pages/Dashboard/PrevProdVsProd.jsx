export default function PrevProdVsProd({ data = [] }) {
  const prevProdVsProductionData = Array.isArray(data) ? data : [];

  return (
    <div className="dashboard-prev-prod">
      <div className="dashboard-prev-prod-header">
        <span>Espèce</span>
        <span>Prévision</span>
        <span>Production</span>
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
          <div className="dashboard-prev-prod-empty">Aucune donnée disponible</div>
        )}
      </div>
    </div>
  );
}
