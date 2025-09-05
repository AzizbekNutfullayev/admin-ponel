import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Header({ apiAdminUrl = "http://localhost:5000/admins" }) {
  const [admin, setAdmin] = useState({ name: "Admin", image: "https://randomuser.me/api/portraits/men/75.jpg" });
  const [lang, setLang] = useState(localStorage.getItem("appLang") || "uz");
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const langRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // Try to fetch admin info (optional). If fails, fallback to default above.
    axios.get(apiAdminUrl)
      .then(res => {
        // If API returns array or object — handle common shapes
        const data = res.data;
        if (Array.isArray(data) && data.length) {
          setAdmin({ name: data[0].name || "Admin", image: data[0].image || admin.image });
        } else if (data && data.name) {
          setAdmin({ name: data.name, image: data.image || admin.image });
        }
      })
      .catch(() => {
        // ignore, keep default
      });
  }, [apiAdminUrl]);

  useEffect(() => {
    localStorage.setItem("appLang", lang);
  }, [lang]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    setLangOpen(false);
    // optionally: emit event or call API to save preference
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="admin-info" ref={menuRef}>
          <img className="admin-avatar" src={admin.image} alt="Admin avatar" />
          <div className="admin-name">{admin.name}</div>

          <button
            className="profile-toggle"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="Profile menu"
          >
            ▾
          </button>

          {menuOpen && (
            <div className="profile-menu">
              <button className="profile-item" onClick={() => { window.location.href = "/settings"; }}>
                Sozlamalar
              </button>
              <button className="profile-item profile-logout" onClick={() => { alert("Chiqish..."); }}>
                Chiqish
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        <div className="lang-switch" ref={langRef}>
          <button
            className="lang-btn"
            onClick={() => setLangOpen(prev => !prev)}
            aria-haspopup="true"
            aria-expanded={langOpen}
          >
            {lang.toUpperCase()}
            <span className="caret">▾</span>
          </button>
          {langOpen && (
            <div className="lang-dropdown" role="menu">
              <button className={`lang-item ${lang === "uz" ? "active" : ""}`} onClick={() => changeLang("uz")}>Oʻzbekcha (UZ)</button>
              <button className={`lang-item ${lang === "ru" ? "active" : ""}`} onClick={() => changeLang("ru")}>Русский (RU)</button>
              <button className={`lang-item ${lang === "en" ? "active" : ""}`} onClick={() => changeLang("en")}>English (EN)</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
