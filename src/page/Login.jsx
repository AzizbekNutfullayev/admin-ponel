import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !password) {
      setError("Iltimos, telefon raqam va parolni kiriting.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/users/login/", {
        phone_number: phone,
        password: password
      });
    
      console.log("Login muvaffaqiyatli:", res.data);
    
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
    
      if (onLogin) onLogin();
    
      navigate("/loyout");
    } catch (err) {
      console.error("❌ Login xatolik:", err);
      setError("Login yoki parol xato!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Kirish</h2>
        <p className="login-sub">Telefon raqam va parol bilan tizimga kiring</p>

        <div className="input-group">
          <label htmlFor="phone">Telefon raqam</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="raqam kiriting"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Parol</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 10 }}>
          <button className="btn_button" type="submit" disabled={loading}>
            {loading ? "Kirish..." : "Kirish"}
          </button>
        </div>
      </form>
    </div>
  );
}
