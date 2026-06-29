import { useEffect, useState } from 'react';
import EspeceSurfaceChart from './EspeceSurfaceChart ';
import ProductionChart from './ProductionChart.jsx';
import TopWilaya from './TopWilaya.jsx';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { FaArrowDown } from 'react-icons/fa';
import Agriculteur from '../pics/Agriculteur.png';
import PrevProdVsProd from './PrevProdVsProd.jsx';
import Amande from '../pics/Amande.png';
import Feu from '../pics/Feu.png';
import Jardinage from '../pics/Jardinage.png';
import PageLoader from '../../components/common/PageLoader';
import './Dashboard.css';

export default function DashboardDisplay() {
  const { url, user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [totalAgri, setTotalAgri] = useState(0);
  const [superficieData, setSuperficieData] = useState([]);
  const [yearlyProduct, setYearlyProduct] = useState([]);
  const [aggregatedSupStats, setAggregatedSupStats] = useState([]);
  const [topWilayaData, setTopWilayaData] = useState([]);
  const [prevProdData, setPrevProdData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [index, setIndex] = useState(0);
  const [agrSupStatsIndex, setAgrSupStatsIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    Promise.all([
      axios.get(`${url}/api/active_this_year/`, { headers }),
      axios.get(`${url}/api/superficie_espece_comparaision/`, { headers }),
      axios.get(`${url}/api/yearly_production/`, { headers }),
      axios.get(`${url}/api/sup_lab_sin_prod/`, { headers }),
      axios.get(`${url}/api/top_wilayas/`, { headers }),
      axios.get(`${url}/api/prev_vs_prod/`, { headers }),
    ])
      .then(([activeRes, superficieRes, yearlyRes, aggregatedRes, topWilayaRes, prevProdRes]) => {
        if (cancelled) return;

        setTotalAgri(activeRes.data.count ?? 0);

        const superficie = Array.isArray(superficieRes.data)
          ? superficieRes.data
          : (superficieRes.data?.results ?? superficieRes.data ?? []);
        setSuperficieData(Array.isArray(superficie) ? superficie : []);

        setYearlyProduct(Array.isArray(yearlyRes.data) ? yearlyRes.data : []);

        const aggregated = aggregatedRes.data;
        setAggregatedSupStats(Array.isArray(aggregated) ? aggregated : []);

        const topWilayas = topWilayaRes.data;
        setTopWilayaData(Array.isArray(topWilayas) ? topWilayas : []);

        const prevProd = prevProdRes.data;
        setPrevProdData(Array.isArray(prevProd) ? prevProd : []);
      })
      .catch(() => {
        if (cancelled) return;
        setTotalAgri(0);
        setSuperficieData([]);
        setYearlyProduct([]);
        setAggregatedSupStats([]);
        setTopWilayaData([]);
        setPrevProdData([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, url]);

  useEffect(() => {
    if (yearlyProduct && yearlyProduct.length > 0) {
      const years = yearlyProduct[0]?.yearly_production.map((entry) => entry.year) || [];
      const result = years.map((year, i) => {
        const entry = { year };
        yearlyProduct.forEach((especeData) => {
          entry[especeData.espece] = especeData.yearly_production[i].total_production;
        });
        return entry;
      });
      setTransformedData(result);
    }
  }, [yearlyProduct]);

  useEffect(() => {
    if (!Array.isArray(superficieData) || superficieData.length === 0) return;
    const lastIndex = superficieData.length - 1;
    if (index < 0) setIndex(lastIndex);
    if (index > lastIndex) setIndex(0);
  }, [index, superficieData]);

  useEffect(() => {
    if (!Array.isArray(aggregatedSupStats) || aggregatedSupStats.length === 0) return;
    const lastIndex = aggregatedSupStats.length - 1;
    if (agrSupStatsIndex < 0) setAgrSupStatsIndex(lastIndex);
    if (agrSupStatsIndex > lastIndex) setAgrSupStatsIndex(0);
  }, [agrSupStatsIndex, aggregatedSupStats]);

  const userName = user?.prenom || user?.nom || 'utilisateur';

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-greeting">Bienvenue, {userName}</h1>
      </header>

      <div className="dashboard-grid">
        {/* Left column — stat cards */}
        <div className="dashboard-col dashboard-col--stats">
          <div className="dashboard-card dashboard-stat-card dashboard-stat-card--agri">
            <div className="dashboard-stat-icon-wrap">
              <img src={Agriculteur} alt="" />
            </div>
            <div className="dashboard-stat-agri-text">
              <p className="dashboard-stat-label">Agriculteurs Active</p>
              <p className="dashboard-stat-value">{totalAgri}</p>
            </div>
          </div>

          <div className="dashboard-card dashboard-stats-carousel">
            <div className="dashboard-stats-carousel-body">
              {Array.isArray(aggregatedSupStats) &&
                aggregatedSupStats.map((statCard, statCardIndex) => {
                  let position = 'next';
                  if (statCardIndex === agrSupStatsIndex) {
                    position = 'active';
                  } else if (
                    statCardIndex ===
                    (agrSupStatsIndex + 1) % aggregatedSupStats.length
                  ) {
                    position = 'next';
                  } else if (
                    statCardIndex ===
                    (agrSupStatsIndex - 1 + aggregatedSupStats.length) %
                      aggregatedSupStats.length
                  ) {
                    position = 'last';
                  }

                  return (
                  <div
                    key={statCardIndex}
                    className={`dashboard-stats-slide dashboard-stats-slide--${position}`}
                  >
                    <StatCard
                      icon={<img src={Jardinage} alt="" />}
                      title="Superficie labouree"
                      value={statCard.total_production}
                    />
                    <StatCard
                      icon={<img src={Feu} alt="" />}
                      title="Superficie sinistree"
                      value={statCard.total_sup_labouree}
                    />
                    <StatCard
                      icon={<img src={Amande} alt="" />}
                      title="Total production"
                      value={statCard.total_sup_sinistree}
                    />
                  </div>
                  );
                })}
            </div>
            {Array.isArray(aggregatedSupStats) && aggregatedSupStats.length > 0 && (
              <div
                className="dashboard-stats-carousel-footer"
                onClick={() =>
                  setAgrSupStatsIndex((agrSupStatsIndex + 1) % aggregatedSupStats.length)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setAgrSupStatsIndex((agrSupStatsIndex + 1) % aggregatedSupStats.length);
                  }
                }}
              >
                <span>{aggregatedSupStats[agrSupStatsIndex]?.espece ?? '—'}</span>
                <FaArrowDown size={14} />
              </div>
            )}
          </div>
        </div>

        {/* Center column — charts */}
        <div className="dashboard-col">
          <div className="dashboard-card dashboard-chart-card dashboard-chart-card--bar">
            {Array.isArray(superficieData) && superficieData.length > 0 ? (
              superficieData.map((chart, chartIndex) => (
                <div
                  key={chartIndex}
                  className={`dashboard-chart-slide${
                    index === chartIndex
                      ? ' dashboard-chart-slide--active'
                      : ' dashboard-chart-slide--hidden'
                  }`}
                >
                  <EspeceSurfaceChart data={[chart]} />
                </div>
              ))
            ) : (
              <div className="dashboard-chart-empty">Aucune donnée disponible</div>
            )}
            {Array.isArray(superficieData) && superficieData.length > 1 && (
              <button
                type="button"
                className="dashboard-chart-nav"
                onClick={() => setIndex(index + 1)}
                aria-label="Graphique suivant"
              >
                <MdOutlineNavigateNext size={18} />
              </button>
            )}
          </div>

          <div className="dashboard-card dashboard-chart-card dashboard-chart-card--line">
            <ProductionChart data={transformedData} />
          </div>
        </div>

        {/* Right column — top wilayas & prev vs prod */}
        <div className="dashboard-col">
          <div className="dashboard-card dashboard-card--grow">
            <h2 className="dashboard-panel-title">Top Wilayas</h2>
            <TopWilaya data={topWilayaData} />
          </div>
          <div className="dashboard-card dashboard-card--grow">
            <h2 className="dashboard-panel-title">Prévision vs Production</h2>
            <PrevProdVsProd data={prevProdData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="dashboard-stat-inner">
      <div className="dashboard-stat-icon-wrap dashboard-stat-icon-wrap--sm">{icon}</div>
      <p className="dashboard-stat-label">{title}</p>
      <p className="dashboard-stat-value">{value}</p>
    </div>
  );
}
