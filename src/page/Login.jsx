import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log(" Kiritilgan login ma'lumotlari:", { username, password });

      if (!username.trim() || !password) {
      setError("Iltimos, foydalanuvchi nomi va parolni kiriting.");
      console.log("❌ Username yoki password bo‘sh!");
      return;
    }

    setLoading(true);
    console.log("⏳ Login jarayoni boshlandi...");

    if (username === "admin" && password === "1234") {
      console.log(" Username va password to‘g‘ri!");
      if (onLogin) {
        console.log(" onLogin chaqirilmoqda...");
        onLogin();
      }
      console.log("➡️ Navigating to /");
      navigate("/loyout");
    } else {
      console.log("❌ 1Login yoki parol xato!");
      setError("Login yoki parol xato!");
    }

    setLoading(false);
  }

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Kirish</h2>
        <p className="login-sub">Iltimos, foydalanuvchi nomi va parol bilan tizimga kiring.</p>

        <div className="input-group">
          <label htmlFor="username">Foydalanuvchi nomi</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=" admin"
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Parol</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="1234"
            autoComplete="current-password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 10 }}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Kirish..." : "Kirish"}
          </button>
        </div>
      </form>
    </div>
  );
}
