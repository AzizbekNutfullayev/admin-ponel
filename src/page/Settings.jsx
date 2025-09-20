import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [settings, setSettings] = useState({
    username: "",
    email: "",
    language: "uz",
    theme: "light",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🔹 Sozlamalarni olish
  useEffect(() => {
    axios
      .get("/api/admin/settings/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => setSettings(res.data))
      .catch((err) => console.error("GET xato:", err));
  }, []);

  // 🔹 Profil va tizim sozlamalarini yangilash
  const updateSettings = () => {
    axios
      .patch("/api/admin/settings/", settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => alert("✅ Sozlamalar yangilandi!"))
      .catch((err) => console.error("PATCH xato:", err));
  };

  // 🔹 Parolni yangilash
  const updatePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("❌ Yangi parol mos emas!");
      return;
    }
    axios
      .patch("/api/admin/settings/password/", passwords, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then(() => alert("✅ Parol yangilandi!"))
      .catch((err) => console.error("PATCH password xato:", err));
  };

  return (
    <div className="settings">
      <h2 className="settings__title">⚙️ Sozlamalar</h2>

      {/* Profil sozlamalari */}
      <div className="card">
        <h3>👤 Profil ma’lumotlari</h3>
        <label>
          Foydalanuvchi nomi:
          <input
            type="text"
            value={settings.username}
            onChange={(e) => setSettings({ ...settings, username: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          />
        </label>
        <button className="btn btn--primary" onClick={updateSettings}>
          💾 Saqlash
        </button>
      </div>

      {/* Parol sozlamalari */}
      <div className="card">
        <h3>🔒 Parolni o‘zgartirish</h3>
        <label>
          Eski parol:
          <input
            type="password"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
        </label>
        <label>
          Yangi parol:
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </label>
        <label>
          Yangi parolni tasdiqlash:
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
          />
        </label>
        <button className="btn btn--primary" onClick={updatePassword}>
          🔑 Yangilash
        </button>
      </div>

      {/* Tizim sozlamalari */}
      <div className="card">
        <h3>🎨 Tizim sozlamalari</h3>
        <label>
          Til:
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          >
            <option value="uz">O‘zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          Tema:
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          >
            <option value="light">☀️ Oq tema</option>
            <option value="dark">🌙 Qora tema</option>
          </select>
        </label>
        <button className="btn btn--primary" onClick={updateSettings}>
          💾 Saqlash
        </button>
      </div>
    </div>
  );
}
