import loginImage from '../assets/login.jpg';
import './AuthShell.css';

export default function AuthShell({ title, description, children }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-visual">
          <img src={loginImage} alt="" />
          <div className="login-visual-overlay" aria-hidden="true" />
        </div>

        <div className="login-panel">
          <div className="login-panel-inner">
            <div className="login-brand">
              <span className="login-brand-dot" />
              <span className="login-brand-name">LegumeSec</span>
            </div>

            <h1 className="login-title">{title}</h1>
            {description ? <p className="login-subtitle">{description}</p> : null}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
