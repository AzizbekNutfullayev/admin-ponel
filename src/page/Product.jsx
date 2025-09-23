import { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    barcode: "",
    description: "",
    unit: "dona",
    cost_price: "",
    selling_price: "",
    quantity: "",
    manufacture_date: "",
    expiration_date: "",
    company_id: 13,
    warehouse_id: 1,
    category_id: 1,
    supplier_id: 1,
    user_id: 1,
  });

  const token = localStorage.getItem("access");

  // 🔹 GET
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("❌ GET error:", err.response?.data || err.message);
    }
  };

  // 🔹 POST
  const addProduct = async () => {
    if (!form.title.trim() || !form.barcode.trim()) {
      alert("Title va Barcode kiritilishi shart!");
      return;
    }

    try {
      const payload = {
        ...form,
        cost_price: Number(form.cost_price) || 0,
        selling_price: Number(form.selling_price) || 0,
        quantity: Number(form.quantity) || 0,
        manufacture_date: form.manufacture_date || null,
        expiration_date: form.expiration_date || null,
      };

      console.log("➡️ POST payload:", payload);

      await axios.post("/api/admin/products/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      fetchProducts();
      setForm({
        title: "",
        barcode: "",
        description: "",
        unit: "dona",
        cost_price: "",
        selling_price: "",
        quantity: "",
        manufacture_date: "",
        expiration_date: "",
        company_id: 13,
        warehouse_id: 1,
        category_id: 1,
        supplier_id: 1,
        user_id: 1,
      });
    } catch (err) {
      console.error("❌ POST xatolik:", err.response?.data || err.message);
      alert("Mahsulot qo‘shishda xatolik!");
    }
  };

  // 🔹 PUT (to‘liq yangilash)
  const updateProduct = async (id) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const payload = {
        ...product, // eski qiymatlar
        ...form, // formdagi yangi qiymatlar
        cost_price: Number(form.cost_price) || Number(product.cost_price) || 0,
        selling_price: Number(form.selling_price) || Number(product.selling_price) || 0,
        quantity: Number(form.quantity) || Number(product.quantity) || 0,
        manufacture_date: form.manufacture_date || product.manufacture_date || null,
        expiration_date: form.expiration_date || product.expiration_date || null,
      };

      console.log("➡️ PUT payload:", payload);

      await axios.put(`/api/admin/products/${id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      fetchProducts();
    } catch (err) {
      console.error("❌ PUT xatolik:", err.response?.data || err.message);
      alert("Yangilashda xatolik!");
    }
  };

  // 🔹 PATCH
  const patchProductTitle = async (id, newTitle) => {
    try {
      await axios.patch(
        `/api/admin/products/${id}/`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      console.error("❌ PATCH xatolik:", err.response?.data || err.message);
    }
  };

  // 🔹 DELETE
  const deleteProduct = async (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirishni xohlaysizmi?")) return;

    try {
      await axios.delete(`/api/admin/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("❌ DELETE error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-container">
      <h1>📦 Products</h1>

      {/* Form */}
      <div className="form_container_product">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Barcode"
          value={form.barcode}
          onChange={(e) => setForm({ ...form, barcode: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Cost Price"
          type="number"
          value={form.cost_price}
          onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
        />
        <input
          placeholder="Selling Price"
          type="number"
          value={form.selling_price}
          onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
        />
        <input
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          type="date"
          value={form.manufacture_date}
          onChange={(e) =>
            setForm({ ...form, manufacture_date: e.target.value })
          }
        />
        <input
          type="date"
          value={form.expiration_date}
          onChange={(e) =>
            setForm({ ...form, expiration_date: e.target.value })
          }
        />
        <button className="btn_add_product" onClick={addProduct}>
          ➕ Add
        </button>
      </div>

      {/* Products list */}
      <div className="list-container_product">
        {products.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.title}</h3>
            <p>💰 {p.selling_price} so‘m</p>
            <p>📦 {p.quantity} {p.unit}</p>
            <div className="card-actions_product">
              <button className="btn edit" onClick={() => updateProduct(p.id)}>
                ✏️ Edit
              </button>
              <button
                className="btn patch"
                onClick={() => patchProductTitle(p.id, "Yangi nom")}
              >
                🔄 Patch Name
              </button>
              <button className="btn delete" onClick={() => deleteProduct(p.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
