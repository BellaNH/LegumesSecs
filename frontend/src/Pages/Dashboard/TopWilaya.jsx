import { useState, useEffect } from 'react';
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md';
import Une from '../pics/Une.png';
import Deux from '../pics/Deux.png';
import Trois from '../pics/Trois.png';

export default function TopWilaya({ data = [] }) {
  const [index, setIndex] = useState(0);
  const topthreeWilaya = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!topthreeWilaya.length) return;
    const lastIndex = topthreeWilaya.length - 1;
    if (index < 0) setIndex(lastIndex);
    if (index > lastIndex) setIndex(0);
  }, [index, topthreeWilaya]);

  if (!topthreeWilaya.length) {
    return <div className="dashboard-prev-prod-empty">Aucune donnée disponible</div>;
  }

  return (
    <div className="dashboard-top-wilaya">
      {topthreeWilaya.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className={`dashboard-top-wilaya-slide${
            index === itemIndex ? ' dashboard-top-wilaya-slide--active' : ' dashboard-top-wilaya-slide--hidden'
          }`}
        >
          <h3 className="dashboard-top-wilaya-espece">{item.espece}</h3>
          {item.top_locations[0] && (
            <div className="dashboard-top-wilaya-row">
              <img src={Une} alt="" className="dashboard-top-wilaya-rank" />
              <span className="dashboard-top-wilaya-name">{item.top_locations[0].label}</span>
              <span className="dashboard-top-wilaya-value">{item.top_locations[0].total_production}</span>
            </div>
          )}
          {item.top_locations.length > 1 && (
            <div className="dashboard-top-wilaya-row">
              <img src={Deux} alt="" className="dashboard-top-wilaya-rank" />
              <span className="dashboard-top-wilaya-name">{item.top_locations[1]?.label}</span>
              <span className="dashboard-top-wilaya-value">{item.top_locations[1]?.total_production}</span>
            </div>
          )}
          {item.top_locations.length > 2 && (
            <div className="dashboard-top-wilaya-row">
              <img src={Trois} alt="" className="dashboard-top-wilaya-rank" />
              <span className="dashboard-top-wilaya-name">{item.top_locations[2]?.label}</span>
              <span className="dashboard-top-wilaya-value">{item.top_locations[2]?.total_production}</span>
            </div>
          )}
        </div>
      ))}

      <div className="dashboard-top-wilaya-nav">
        <button
          type="button"
          className="dashboard-nav-btn"
          onClick={() => setIndex(index - 1)}
          aria-label="Précédent"
        >
          <MdOutlineNavigateBefore size={18} />
        </button>
        <button
          type="button"
          className="dashboard-nav-btn"
          onClick={() => setIndex(index + 1)}
          aria-label="Suivant"
        >
          <MdOutlineNavigateNext size={18} />
        </button>
      </div>
    </div>
  );
}
