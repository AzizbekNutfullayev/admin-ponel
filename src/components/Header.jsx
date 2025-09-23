import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Header({ apiAdminUrl = "http://localhost:5000/admins" }) {
  const [admin, setAdmin] = useState({ name: "Admin", image: "https://randomuser.me/api/portraits/men/75.jpg" });
  const [lang, setLang] = useState(localStorage.getItem("appLang") || "uz");
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const langRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    axios.get(apiAdminUrl)  
      .then(res => {
        const data = res.data;
        if (Array.isArray(data) && data.length) {
          setAdmin({ name: data[0].name || "Admin", image: data[0].image || admin.image });
        } else if (data && data.name) {
          setAdmin({ name: data.name, image: data.image || admin.image });
        }
      })
      .catch(() => {});
  }, [apiAdminUrl]);

  useEffect(() => {
    localStorage.setItem("appLang", lang);
  }, [lang]);

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
  };

  return (
    <header className="app-header">
      {/* Left side - Admin */}
      <div className="header-left-header" ref={menuRef}>
        <img className="admin-avatar-header" src={admin.image} alt="Admin avatar" />
        <div className="admin-name-header">{admin.name}</div>


      </div>

      {/* Right side - Search + Lang */}
      <div className="header-right-header">
        {/* Search */}
        <div className="search-box-header">
          <input
            type="text"
            placeholder="🔍 Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Language */}
        <div className="lang-switch-header" ref={langRef}>
          <button
            className="lang-btn-header"
            onClick={() => setLangOpen(prev => !prev)}
          >
            {lang.toUpperCase()} ▾
          </button>
          {langOpen && (
            <div className="lang-dropdown-header">
              <button className={`lang-item-header ${lang === "uz" ? "active-header" : ""}`} onClick={() => changeLang("uz")}>🇺🇿 UZ</button>
              <button className={`lang-item-header ${lang === "ru" ? "active-header" : ""}`} onClick={() => changeLang("ru")}>🇷🇺 RU</button>
              <button className={`lang-item-header ${lang === "en" ? "active-header" : ""}`} onClick={() => changeLang("en")}>🇬🇧 EN</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
