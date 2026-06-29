import './PageLoader.css';

const PageLoader = ({ inline = false }) => (
  <div
    className={`page-loader${inline ? ' page-loader--inline' : ''}`}
    role="status"
    aria-live="polite"
    aria-label="Chargement"
  >
    <div className="page-loader-spinner" />
  </div>
);

export default PageLoader;
