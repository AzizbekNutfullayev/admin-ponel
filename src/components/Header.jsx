import React, { useState, useRef, useEffect } from "react";

export default function Header({ search, setSearch }) {
  const [lang, setLang] = useState(localStorage.getItem("appLang") || "uz");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // Oddiy admin object
  const admin = {
    name: "Admin",
    image: "/admin-avatar.png", // public papkaga qo‘yilgan rasm
  };

  useEffect(() => {
    localStorage.setItem("appLang", lang);
  }, [lang]);

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    setLangOpen(false);
  };

  return (
    <div className="container_header">
      <header className="app-header">
        {/* Left side - Admin */}
        <div className="header-left-header">
          <img
            className="admin-avatar-header"
            src={admin.image}
            alt="Admin avatar"
          />
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
              onClick={() => setLangOpen((prev) => !prev)}
            >
              {lang.toUpperCase()} ▾
            </button>
            {langOpen && (
              <div className="lang-dropdown-header">
                <button
                  className={`lang-item-header ${
                    lang === "uz" ? "active-header" : ""
                  }`}
                  onClick={() => changeLang("uz")}
                >
                  🇺🇿 UZ
                </button>
                <button
                  className={`lang-item-header ${
                    lang === "ru" ? "active-header" : ""
                  }`}
                  onClick={() => changeLang("ru")}
                >
                  🇷🇺 RU
                </button>
                <button
                  className={`lang-item-header ${
                    lang === "en" ? "active-header" : ""
                  }`}
                  onClick={() => changeLang("en")}
                >
                  🇬🇧 EN
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
