import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/cloudinary';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Upload, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = ['Sparklers', 'Rockets', 'Ground Chakkar', 'Bombs', 'Flower Pots', 'Sky Shots', 'Gift Boxes'];
const EMPTY_FORM = { name: '', description: '', price: '', original_price: '', category: 'Sparklers', image_url: '', stock: '', is_active: true };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p, price: String(p.price), original_price: String(p.original_price || ''), stock: String(p.stock) }); setEditing(p.id); setShowModal(true); };

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image_url: url }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed. Check Cloudinary upload preset.');
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, Price, Category are required!');
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category: form.category,
      image_url: form.image_url || null,
      stock: parseInt(form.stock) || 0,
      is_active: form.is_active
    };

    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing);
      toast.success('Product updated!');
    } else {
      await supabase.from('products').insert(payload);
      toast.success('Product added!');
    }
    setShowModal(false);
    fetchProducts();
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.from('products').delete().eq('id', id);
    toast.success('Deleted!');
    fetchProducts();
  }

  async function toggleActive(id, current) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    fetchProducts();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">📦 Products</h1>
        <button className="btn-primary" onClick={openAdd}><Plus size={18} /> Add Product</button>
      </div>

      {loading ? <p className="no-data">Loading...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="table-product-img" />
                      : <div className="table-img-placeholder">🎆</div>}
                  </td>
                  <td><strong>{p.name}</strong><br /><small>{p.description?.slice(0, 40)}...</small></td>
                  <td><span className="cat-pill">{p.category}</span></td>
                  <td>
                    <strong>₹{p.price}</strong>
                    {p.original_price && <s className="old-price"> ₹{p.original_price}</s>}
                  </td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className={`toggle-btn ${p.is_active ? 'active' : 'inactive'}`}
                      onClick={() => toggleActive(p.id, p.is_active)}
                    >
                      {p.is_active ? <><Eye size={14} /> Active</> : <><EyeOff size={14} /> Hidden</>}
                    </button>
                  </td>
                  <td className="action-btns">
                    <button className="btn-edit" onClick={() => openEdit(p)}><Pencil size={16} /></button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id, p.name)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="no-data">No products yet. Add your first product!</p>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? '✏️ Edit Product' : '➕ Add Product'}</h2>
              <button onClick={() => setShowModal(false)}><X size={22} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Magic Sparklers" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sale Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="299" />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input type="number" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} placeholder="499 (for discount)" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="100" />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload-area">
                  {form.image_url ? (
                    <div className="image-preview">
                      <img src={form.image_url} alt="preview" />
                      <button className="remove-img-btn" onClick={() => setForm({ ...form, image_url: '' })}><X size={14} /></button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                      {uploading ? (
                        <span className="uploading">⏳ Uploading...</span>
                      ) : (
                        <span><Upload size={28} /><br />Click to upload image<br /><small>Cloudinary</small></span>
                      )}
                    </label>
                  )}
                </div>
              </div>

              <div className="form-check">
                <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <label htmlFor="isActive">Show on shop (Active)</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>
                {editing ? '💾 Save Changes' : '✅ Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
