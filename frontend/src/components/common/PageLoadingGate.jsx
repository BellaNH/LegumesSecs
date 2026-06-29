import PageLoader from './PageLoader';

const PageLoadingGate = ({ loading, children, inline = false }) => {
  if (loading) return <PageLoader inline={inline} />;
  return children;
};

export default PageLoadingGate;
