import { useState } from 'react';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa6';
import { IoDocumentOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { useGlobalContext } from '../context';
import { useLanguage } from '../i18n/LanguageContext';
import './Sidebar.css';

const SidebarDropdown = ({ id, label, isOpen, isActive, onToggle, onActivate, openLabel, closeLabel, children }) => (
  <div>
    <div
      id={id}
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onActivate();
      }}
      className={`app-sidebar-item${isActive ? ' app-sidebar-item--active' : ''}`}
    >
      <span>{label}</span>
      <button
        type="button"
        className="app-sidebar-toggle"
        aria-expanded={isOpen}
        aria-label={isOpen ? closeLabel : openLabel}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {isOpen ? <RiArrowDropUpLine size={24} /> : <RiArrowDropDownLine size={24} />}
      </button>
    </div>
    <div className={`app-sidebar-submenu${isOpen ? ' app-sidebar-submenu--open' : ' app-sidebar-submenu--closed'}`}>
      {children}
    </div>
  </div>
);

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [active, setActive] = useState('');
  const { user, logout } = useGlobalContext();
  const { t } = useLanguage();

  const toggleDropDownMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const setActiveItem = (id) => {
    setActive(id);
  };

  const canAccessUtilisateur =
    user?.role?.nom === 'admin' ||
    user?.permissions?.some((p) => p.model === 'Utilisateur' && (p.create || p.retrieve));

  const canAccessObjectif =
    user?.role?.nom === 'admin' ||
    user?.permissions?.some((p) => p.model === 'Objectif' && (p.create || p.retrieve));

  const canAccessAgriculteur =
    user?.role?.nom === 'admin' ||
    user?.permissions?.some((p) => p.model === 'Agriculteur' && (p.create || p.retrieve));

  const canAccessExploitation =
    user?.role?.nom === 'admin' ||
    user?.permissions?.some((p) => p.model === 'Exploitation' && (p.create || p.retrieve));

  const menuAria = (label) => ({
    openLabel: t('nav.openMenu', { label }),
    closeLabel: t('nav.closeMenu', { label }),
  });

  return (
    <nav className="app-sidebar" role="navigation" aria-label={t('nav.main')}>
      <div className="app-sidebar-scroll">
        <SidebarDropdown
          id="profile"
          label={t('nav.profile')}
          isOpen={openMenu === 'profile'}
          isActive={active === 'profile'}
          onToggle={() => toggleDropDownMenu('profile')}
          onActivate={() => setActiveItem('profile')}
          {...menuAria(t('nav.profile'))}
        >
          <NavLink to="/profile" className="app-sidebar-sublink" onClick={() => setActiveItem('profile')}>
            <CgProfile size={18} />
            <span>{t('nav.viewProfile')}</span>
          </NavLink>
          <button type="button" className="app-sidebar-sublink" onClick={logout}>
            <IoDocumentOutline size={18} />
            <span>{t('nav.logout')}</span>
          </button>
        </SidebarDropdown>

        <NavLink
          id="dashboard"
          to="/dashboard"
          onClick={() => setActiveItem('dashboard')}
          className={`app-sidebar-item${active === 'dashboard' ? ' app-sidebar-item--active' : ''}`}
        >
          {t('nav.dashboard')}
        </NavLink>

        {canAccessUtilisateur && (
          <SidebarDropdown
            id="utilisateur"
            label={t('nav.user')}
            isOpen={openMenu === 'utilisateur'}
            isActive={active === 'utilisateur'}
            onToggle={() => toggleDropDownMenu('utilisateur')}
            onActivate={() => setActiveItem('utilisateur')}
            {...menuAria(t('nav.user'))}
          >
            <NavLink to="/ajouter-utilisateur" className="app-sidebar-sublink">
              <FaPlus size={16} />
              <span>{t('nav.add')}</span>
            </NavLink>
            <NavLink to="/utilisateurs" className="app-sidebar-sublink">
              <IoDocumentOutline size={18} />
              <span>{t('nav.browse')}</span>
            </NavLink>
          </SidebarDropdown>
        )}

        {user?.role?.nom === 'admin' && (
          <NavLink
            id="role"
            to="/role"
            onClick={() => setActiveItem('role')}
            className={`app-sidebar-item${active === 'role' ? ' app-sidebar-item--active' : ''}`}
          >
            {t('nav.role')}
          </NavLink>
        )}

        {user?.role?.nom === 'admin' && (
          <NavLink
            id="Wilaya"
            to="/wilayas"
            onClick={() => setActiveItem('Wilaya')}
            className={`app-sidebar-item${active === 'Wilaya' ? ' app-sidebar-item--active' : ''}`}
          >
            {t('nav.wilaya')}
          </NavLink>
        )}

        {user?.role?.nom === 'admin' && (
          <NavLink
            id="Subdivision"
            to="/subdivisions"
            onClick={() => setActiveItem('Subdivision')}
            className={`app-sidebar-item${active === 'Subdivision' ? ' app-sidebar-item--active' : ''}`}
          >
            {t('nav.subdivision')}
          </NavLink>
        )}

        {user?.role?.nom === 'admin' && (
          <NavLink
            id="commune"
            to="/communes"
            onClick={() => setActiveItem('commune')}
            className={`app-sidebar-item${active === 'commune' ? ' app-sidebar-item--active' : ''}`}
          >
            {t('nav.commune')}
          </NavLink>
        )}

        {user?.role?.nom === 'admin' && (
          <NavLink
            id="espece"
            to="/espece"
            onClick={() => setActiveItem('espece')}
            className={`app-sidebar-item${active === 'espece' ? ' app-sidebar-item--active' : ''}`}
          >
            {t('nav.crop')}
          </NavLink>
        )}

        {canAccessObjectif && (
          <SidebarDropdown
            id="objectif"
            label={t('nav.goal')}
            isOpen={openMenu === 'objectif'}
            isActive={active === 'objectif'}
            onToggle={() => toggleDropDownMenu('objectif')}
            onActivate={() => setActiveItem('objectif')}
            {...menuAria(t('nav.goal'))}
          >
            <NavLink to="/ajouterobjectif" className="app-sidebar-sublink">
              <FaPlus size={16} />
              <span>{t('nav.add')}</span>
            </NavLink>
            <NavLink to="/objectifs" className="app-sidebar-sublink">
              <IoDocumentOutline size={18} />
              <span>{t('nav.browse')}</span>
            </NavLink>
          </SidebarDropdown>
        )}

        {canAccessAgriculteur && (
          <SidebarDropdown
            id="Agriculteur"
            label={t('nav.farmer')}
            isOpen={openMenu === 'Agriculteur'}
            isActive={active === 'Agriculteur'}
            onToggle={() => toggleDropDownMenu('Agriculteur')}
            onActivate={() => setActiveItem('Agriculteur')}
            {...menuAria(t('nav.farmer'))}
          >
            <NavLink to="/ajouteragriculteur" className="app-sidebar-sublink">
              <FaPlus size={16} />
              <span>{t('nav.add')}</span>
            </NavLink>
            <NavLink to="/agriculteurs" className="app-sidebar-sublink">
              <IoDocumentOutline size={18} />
              <span>{t('nav.browse')}</span>
            </NavLink>
          </SidebarDropdown>
        )}

        {canAccessExploitation && (
          <SidebarDropdown
            id="Exploitation"
            label={t('nav.farm')}
            isOpen={openMenu === 'Exploitation'}
            isActive={active === 'Exploitation'}
            onToggle={() => toggleDropDownMenu('Exploitation')}
            onActivate={() => setActiveItem('Exploitation')}
            {...menuAria(t('nav.farm'))}
          >
            <NavLink to="/ajouterexploitation" className="app-sidebar-sublink">
              <FaPlus size={16} />
              <span>{t('nav.add')}</span>
            </NavLink>
            <NavLink to="/exploitations" className="app-sidebar-sublink">
              <IoDocumentOutline size={18} />
              <span>{t('nav.browse')}</span>
            </NavLink>
          </SidebarDropdown>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
