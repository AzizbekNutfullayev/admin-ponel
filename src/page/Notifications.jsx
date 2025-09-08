import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck, MailOpen, Search, Trash2 } from "lucide-react";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");  
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/notifications");
      setNotifs(res.data || []);
    } catch (err) {
      console.error("Notiflarni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/notifications/${id}`, { read: true });
      fetchNotifs();
    } catch (err) {
      console.error("Read qilishda xato:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`http://localhost:5000/notifications/mark-all-read`);
      fetchNotifs();
    } catch (err) {
      console.error("Barchasini read qilishda xato:", err);
    }
  };

  const deleteNotif = async (id) => {
    if (!window.confirm("O'chirishni xohlaysizmi?")) return;
    try {
      await axios.delete(`http://localhost:5000/notifications/${id}`);
      fetchNotifs();
    } catch (err) {
      console.error("Notif o'chirishda xato:", err);
    }
  };

  const filtered = notifs
    .filter((n) =>
      filter === "all" ? true : filter === "read" ? n.read : !n.read
    )
    .filter((n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.message.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="notifs">
      <div className="notifs__header">
        <div>
          <h2 className="notifs__title">
            <Bell size={20} /> Bildirishnomalar
          </h2>
          <p className="notifs__sub">Sizning tizim bildirishnomalaringiz</p>
        </div>
        <div className="notifs__controls">
          <div className="search">
            <Search size={16} />
            <input
              placeholder="Qidirish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select"
          >
            <option value="all">Barchasi</option>
            <option value="unread">O‘qilmagan</option>
            <option value="read">O‘qilgan</option>
          </select>

          <button className="btn primary" onClick={markAllAsRead}>
            <CheckCheck size={14} /> Barchasini read qilish
          </button>
        </div>
      </div>

      {loading ? (
        <p className="muted">⏳ Yuklanmoqda...</p>
      ) : (
        <>
          <div className="notif-list">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${n.read ? "read" : "unread"}`}
                onClick={() => setModal(n)}
              >
                <div className="notif-content">
                  <h4>{n.title}</h4>
                  <p>{n.message.slice(0, 60)}...</p>
                  <span className="notif-date">{new Date(n.date).toLocaleString()}</span>
                </div>
                <div className="notif-actions">
                  {!n.read && (
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.id);
                      }}
                    >
                      <MailOpen size={16} />
                    </button>
                  )}
                  <button
                    className="icon-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotif(n.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="muted small">Bildirishnoma yo‘q</div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.title}</h3>
            <p className="modal-msg">{modal.message}</p>
            <div className="modal-footer">
              <span className="notif-date">{new Date(modal.date).toLocaleString()}</span>
              <button className="btn" onClick={() => setModal(null)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
