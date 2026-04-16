import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Zap, LogOut, Plus, Pencil, Trash2, Upload, Search, X, Package, Tag } from "lucide-react";

const API = const API = "https://himprash-backend.onrender.com/api";

function formatINR(n) { return new Intl.NumberFormat("en-IN").format(n); }

// ─── Product Form Modal ───
function ProductForm({ product, categories, onSave, onClose }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: "", price: "", offer_price: "", category: "", description: "",
    compatibility: "", image: "", video_url: "", in_stock: true, featured: false,
    ...(product || {}),
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return;
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      offer_price: form.offer_price ? parseFloat(form.offer_price) : null,
      video_url: form.video_url || null,
    };
    await onSave(payload, isEdit ? product.id : null);
    setSaving(false);
  };

  const inputCls = "w-full bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] px-3 py-2 text-sm rounded-md focus:outline-none focus:border-[#0A84FF]";
  const labelCls = "block text-xs text-[#8B8B96] uppercase tracking-wider font-medium mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-12 overflow-y-auto" onClick={onClose}>
      <form
        data-testid="product-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-[#161B22] border border-[#1F2937] rounded-lg w-full max-w-xl p-6 mb-12"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-medium text-[#E8E8ED]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button type="button" onClick={onClose} className="text-[#6B6B78] hover:text-[#E8E8ED]"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className={labelCls}>Product Name *</label>
            <input data-testid="form-name" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Price (INR) *</label>
            <input data-testid="form-price" type="number" step="0.01" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Offer Price (INR)</label>
            <input data-testid="form-offer-price" type="number" step="0.01" className={inputCls} value={form.offer_price || ""} onChange={(e) => set("offer_price", e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className={labelCls}>Category *</label>
            <select data-testid="form-category" className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} required>
              <option value="">Select</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Compatibility</label>
            <input data-testid="form-compatibility" className={inputCls} value={form.compatibility} onChange={(e) => set("compatibility", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <textarea data-testid="form-description" className={`${inputCls} h-20 resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Image URL</label>
            <input data-testid="form-image" className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Video URL</label>
            <input data-testid="form-video" className={inputCls} value={form.video_url || ""} onChange={(e) => set("video_url", e.target.value)} placeholder="Optional" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.in_stock} onChange={(e) => set("in_stock", e.target.checked)} className="accent-[#0A84FF]" />
            <span className="text-sm text-[#A0A0AB]">In Stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-[#0A84FF]" />
            <span className="text-sm text-[#A0A0AB]">Featured</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-[#1F2937] text-[#A0A0AB] hover:text-[#E8E8ED] py-2 text-sm rounded-md transition-colors">Cancel</button>
          <button data-testid="form-submit" type="submit" disabled={saving} className="flex-1 bg-[#0A84FF] text-white hover:bg-[#339DFF] py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Update" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── CSV Upload Modal ───
function CsvUpload({ categories, onDone, onClose }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const text = await file.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) { setResult({ error: "CSV must have a header + data rows" }); setLoading(false); return; }

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map((v) => v.trim());
      if (vals.length < 3) continue;
      const row = {};
      header.forEach((h, idx) => { row[h] = vals[idx] || ""; });
      if (!row.name || !row.price || !row.category) continue;
      products.push({
        name: row.name,
        price: parseFloat(row.price) || 0,
        offer_price: row.offer_price ? parseFloat(row.offer_price) : null,
        category: row.category,
        description: row.description || "",
        compatibility: row.compatibility || "",
        image: row.image || "",
        video_url: row.video_url || null,
        in_stock: true,
        featured: false,
      });
    }

    if (products.length === 0) { setResult({ error: "No valid rows found" }); setLoading(false); return; }

    try {
      const res = await axios.post(`${API}/admin/products/bulk`, products);
      setResult({ success: `${res.data.count} products added successfully` });
      onDone();
    } catch (err) {
      setResult({ error: "Upload failed: " + (err.response?.data?.detail || err.message) });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div data-testid="csv-upload-modal" onClick={(e) => e.stopPropagation()} className="bg-[#161B22] border border-[#1F2937] rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-[#E8E8ED]" style={{ fontFamily: 'Outfit, sans-serif' }}>Bulk Upload CSV</h3>
          <button onClick={onClose} className="text-[#6B6B78] hover:text-[#E8E8ED]"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-[#6B6B78] mb-1">CSV format (header required):</p>
        <code className="block text-xs text-[#0A84FF] bg-[#0E1117] px-3 py-2 rounded mb-4 break-all">
          name,price,category,description,image
        </code>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#1F2937] rounded-lg py-6 cursor-pointer hover:border-[#0A84FF]/40 transition-colors mb-4">
          <Upload className="w-5 h-5 text-[#6B6B78]" strokeWidth={1.5} />
          <span className="text-sm text-[#8B8B96]">{loading ? "Processing..." : "Choose CSV file"}</span>
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" disabled={loading} />
        </label>
        {result?.success && <div data-testid="csv-success" className="bg-[#00FF9D]/10 border border-[#00FF9D]/20 text-[#00FF9D] text-sm px-3 py-2 rounded">{result.success}</div>}
        {result?.error && <div data-testid="csv-error" className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded">{result.error}</div>}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("himprash_admin") !== "true") {
      navigate("/admin-panel-himprash");
    }
  }, [navigate]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([axios.get(`${API}/products`), axios.get(`${API}/categories`)]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => { localStorage.removeItem("himprash_admin"); navigate("/admin-panel-himprash"); };

  const handleSaveProduct = async (data, id) => {
    try {
      if (id) {
        await axios.put(`${API}/admin/products/${id}`, data);
        showToast("Product updated");
      } else {
        await axios.post(`${API}/admin/products`, data);
        showToast("Product added");
      }
      setShowForm(false);
      setEditProduct(null);
      fetchData();
    } catch (e) { showToast("Error: " + (e.response?.data?.detail || e.message)); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`);
      showToast("Product deleted");
      fetchData();
    } catch (e) { showToast("Error deleting"); }
  };

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    try {
      await axios.post(`${API}/admin/categories`, { name: newCat.trim() });
      setNewCat("");
      showToast("Category added");
      fetchData();
    } catch (e) { showToast(e.response?.data?.detail || "Error"); }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await axios.delete(`${API}/admin/categories/${encodeURIComponent(name)}`);
      showToast("Category deleted");
      fetchData();
    } catch (e) { showToast("Error deleting category"); }
  };

  // Filter
  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && p.category !== filterCat) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0E1117]" data-testid="admin-dashboard">
      {/* Toast */}
      {toast && <div className="fixed top-4 right-4 z-50 bg-[#161B22] border border-[#1F2937] text-[#E8E8ED] text-sm px-4 py-2.5 rounded-md shadow-lg">{toast}</div>}

      {/* Header */}
      <header className="bg-[#161B22] border-b border-[#1F2937] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0A84FF] rounded-sm flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-white" /></div>
            <span className="text-base font-semibold text-[#E8E8ED]" style={{ fontFamily: 'Outfit, sans-serif' }}>Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B6B78]">{products.length} products</span>
            <button data-testid="admin-logout" onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-[#8B8B96] hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {[{ id: "products", label: "Products", icon: Package }, { id: "categories", label: "Categories", icon: Tag }].map((t) => (
            <button
              key={t.id}
              data-testid={`tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t.id ? "bg-[#0A84FF] text-white" : "text-[#8B8B96] hover:text-[#E8E8ED] bg-[#161B22]"}`}
            >
              <t.icon className="w-4 h-4" strokeWidth={1.5} /> {t.label}
            </button>
          ))}
        </div>

        {/* ─── Products Tab ─── */}
        {tab === "products" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B78]" strokeWidth={1.5} />
                <input
                  data-testid="admin-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] placeholder-[#6B6B78] pl-9 pr-3 py-2 text-sm rounded-md focus:outline-none focus:border-[#0A84FF]"
                />
              </div>
              <select
                data-testid="admin-filter-category"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] px-3 py-2 text-sm rounded-md focus:outline-none focus:border-[#0A84FF]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2 ml-auto">
                <button data-testid="csv-upload-btn" onClick={() => setShowCsv(true)} className="flex items-center gap-1.5 border border-[#1F2937] text-[#A0A0AB] hover:text-[#E8E8ED] px-3 py-2 text-sm rounded-md transition-colors">
                  <Upload className="w-3.5 h-3.5" strokeWidth={1.5} /> CSV Upload
                </button>
                <button data-testid="add-product-btn" onClick={() => { setEditProduct(null); setShowForm(true); }} className="flex items-center gap-1.5 bg-[#0A84FF] text-white hover:bg-[#339DFF] px-4 py-2 text-sm font-medium rounded-md transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Product
                </button>
              </div>
            </div>

            {/* Product table */}
            <div className="bg-[#161B22] border border-[#1F2937] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="products-table">
                  <thead>
                    <tr className="border-b border-[#1F2937] text-left">
                      <th className="px-4 py-3 text-xs text-[#6B6B78] uppercase tracking-wider font-medium">Name</th>
                      <th className="px-4 py-3 text-xs text-[#6B6B78] uppercase tracking-wider font-medium">Price</th>
                      <th className="px-4 py-3 text-xs text-[#6B6B78] uppercase tracking-wider font-medium">Category</th>
                      <th className="px-4 py-3 text-xs text-[#6B6B78] uppercase tracking-wider font-medium">Stock</th>
                      <th className="px-4 py-3 text-xs text-[#6B6B78] uppercase tracking-wider font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B6B78]">Loading...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6B6B78]">No products found</td></tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id} className="border-b border-[#1F2937]/50 hover:bg-[#1A1F28] transition-colors" data-testid={`row-${p.id}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded object-cover bg-[#0E1117]" loading="lazy" />}
                            <span className="text-[#E8E8ED] font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {p.offer_price ? (
                            <span>
                              <span className="text-[#00FF9D] font-medium">&#8377;{formatINR(p.offer_price)}</span>
                              <span className="text-[#6B6B78] line-through text-xs ml-1.5">&#8377;{formatINR(p.price)}</span>
                            </span>
                          ) : (
                            <span className="text-[#E8E8ED]">&#8377;{formatINR(p.price)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#8B8B96]">{p.category}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${p.in_stock ? "text-[#00FF9D]" : "text-red-400"}`}>
                            {p.in_stock ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              data-testid={`edit-${p.id}`}
                              onClick={() => { setEditProduct(p); setShowForm(true); }}
                              className="p-1.5 text-[#8B8B96] hover:text-[#0A84FF] transition-colors rounded"
                              title="Edit"
                            ><Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                            <button
                              data-testid={`delete-${p.id}`}
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-[#8B8B96] hover:text-red-400 transition-colors rounded"
                              title="Delete"
                            ><Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2.5 border-t border-[#1F2937] text-xs text-[#6B6B78]">
                Showing {filtered.length} of {products.length} products
              </div>
            </div>
          </>
        )}

        {/* ─── Categories Tab ─── */}
        {tab === "categories" && (
          <div className="max-w-lg">
            <div className="flex gap-2 mb-6">
              <input
                data-testid="new-category-input"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                placeholder="New category name..."
                className="flex-1 bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] placeholder-[#6B6B78] px-3 py-2 text-sm rounded-md focus:outline-none focus:border-[#0A84FF]"
              />
              <button
                data-testid="add-category-btn"
                onClick={handleAddCategory}
                className="flex items-center gap-1.5 bg-[#0A84FF] text-white hover:bg-[#339DFF] px-4 py-2 text-sm font-medium rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} /> Add
              </button>
            </div>
            <div className="bg-[#161B22] border border-[#1F2937] rounded-lg overflow-hidden">
              {categories.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[#6B6B78] text-center">No categories</p>
              ) : categories.map((cat) => (
                <div key={cat} data-testid={`cat-row-${cat}`} className="flex items-center justify-between px-4 py-3 border-b border-[#1F2937]/50 last:border-0 hover:bg-[#1A1F28] transition-colors">
                  <span className="text-sm text-[#E8E8ED]">{cat}</span>
                  <button
                    data-testid={`delete-cat-${cat}`}
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1 text-[#6B6B78] hover:text-red-400 transition-colors"
                  ><Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#6B6B78]">{categories.length} categories total</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && <ProductForm product={editProduct} categories={categories} onSave={handleSaveProduct} onClose={() => { setShowForm(false); setEditProduct(null); }} />}
      {showCsv && <CsvUpload categories={categories} onDone={fetchData} onClose={() => setShowCsv(false)} />}
    </div>
  );
}
