import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  BarChart3,
  FileText,
  Puzzle,
  Building2,
  Users,
  HelpCircle,
  Bell,
  Menu,
  Moon,
  Sun,
  Search,
  HomeIcon,
  Settings,
  ArrowLeft,
} from "lucide-react";


export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const menu = [
    { path: "dashboard", label: "Bosh Sahifa", icon: <HomeIcon size={20} /> },    
    { path: "analytics", label: "Statistika", icon: <BarChart3 size={20} /> },
    { path: "companiya", label: "kompaniyalar", icon: <Building2 size={20} /> },
    { path: "users", label: "Foydalanuvchilar", icon: <Users size={20} /> },
    { path: "settings", label: "Sozlamalar", icon: <Settings size={20} /> },    
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && <h2 className="logo-text">Prody</h2>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="search-box">
        <Search size={16} />
        {!collapsed && <input type="text" placeholder="Search..." />}
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        {menu.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={idx} className={isActive ? "active" : ""}>
              <Link to={item.path} className="menu-link">
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <Link to="/help" className="menu-link">
          <HelpCircle size={20} />
          {!collapsed && <span>Help Center</span>}
        </Link>
        <Link to="/notifications" className="menu-link">
          <Bell size={20} />
          {!collapsed && <span>Notifications</span>}
        </Link>
        <Link to={'/login'} className="menu-link">
        <ArrowLeft size={20} />
        {!collapsed && <span>chiqish</span>}
        </Link>

      </div>
    </div>
  );
}
