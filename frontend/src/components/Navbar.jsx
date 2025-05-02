import { useLocation, useNavigate } from 'react-router-dom';
import { GoHome, GoTools } from "react-icons/go";
import { BsViewList } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { AiOutlineMessage } from "react-icons/ai";
import '../styles/components/Navbar.css';
import { useAuthContext } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const tabs = [
    { icon: <GoHome />, path: '/', label: 'Home' },
    { icon: <GoTools />, path: '/services', label: 'Services' },
    { icon: <AiOutlineMessage />, path: '/messages', label: 'Messages' },
    { icon: <BsViewList />, path: '/my-items', label: 'My Items' },
    { icon: <VscAccount />, path: user ? '/dashboard' : '/account', label: 'Account' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
          aria-label={tab.label}
        >
          {tab.icon}
        </button>
      ))}
    </nav>
  );
}

export default Navbar;