import { useLocation, useNavigate } from 'react-router-dom';
import { GoHome, GoTools } from "react-icons/go";
import { BsViewList } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { AiOutlineMessage } from "react-icons/ai";
import '../styles/components/Navbar.css';
import { useAuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiPackage } from 'react-icons/fi';            // Outline-style item icon
import { RiUserSettingsLine } from 'react-icons/ri';   // Worker icon, outlined


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const tabs = [
    { icon: <FiPackage  />, path: '/', label: t('navigation.home') },
    { icon: <RiUserSettingsLine  />, path: '/services', label: t('navigation.services') },
    { icon: <AiOutlineMessage />, path: '/messages', label: t('navigation.messages') },
    { icon: <BsViewList />, path: '/my-items', label: t('navigation.my_items') },
    { icon: <VscAccount />, path: user ? '/dashboard' : '/account', label: t('navigation.account') },
  ];

  return (
    <nav className="bottom-nav" dir={t('navigation.home') === 'מוצרים' ? 'rtl' : 'ltr'}>
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
          aria-label={tab.label}
        >
          {tab.icon}
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navbar;