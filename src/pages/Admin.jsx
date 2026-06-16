import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { sendOrderToAdminWhatsApp } from '@/utils/whatsapp';

/* ---------- Constants ---------- */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'elitespace2024';
const CATEGORIES = ['Living Room', 'Bedroom', 'Dining', 'Office'];
const SUBCATEGORIES = {
  'Living Room': ['Sofas', 'Coffee Tables', 'TV Stands'],
  'Bedroom': ['Beds', 'Wardrobes', 'Dressers'],
  'Dining': ['Dining Sets', 'Sideboards'],
  'Office': ['Executive Desks', 'Office Chairs', 'Cabinets'],
};

/* ---------- Design tokens ---------- */
const COLORS = {
  bg: '#fafafa',
  surface: '#ffffff',
  surface2: '#f3f4f6',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.14)',
  green: '#10b981',
  amber: '#f59e0b',
  rust: '#ef4444',
};
const fontDisplay = "'Inter', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";
const BRANCHES = ['Nairobi', 'Mombasa'];
const TODAY = new Date().toISOString().split('T')[0];
const fmt = (n) => `KSh ${Number(n || 0).toLocaleString()}`;

/* ---------- Icons ---------- */
const ic = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconGauge = (p) => <svg {...ic} {...p}><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16 16 10" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg>;
const IconBox = (p) => <svg {...ic} {...p}><path d="M12 3 21 7.5 21 16.5 12 21 3 16.5 3 7.5Z" /><path d="M3 7.5 12 12 21 7.5" /><path d="M12 12 12 21" /></svg>;
const IconBanknote = (p) => <svg {...ic} {...p}><rect x="2" y="6" width="20" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9h.01M18 15h.01" /></svg>;
const IconCard = (p) => <svg {...ic} {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></svg>;
const IconReceipt = (p) => <svg {...ic} {...p}><path d="M5 3h14v18l-2-1.5L15 21l-2-1.5L11 21l-2-1.5L7 21l-2-1.5Z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>;
const IconChart = (p) => <svg {...ic} {...p}><rect x="4" y="11" width="3.5" height="9" /><rect x="10.25" y="6" width="3.5" height="14" /><rect x="16.5" y="14" width="3.5" height="6" /></svg>;
const IconChat = (p) => <svg {...ic} {...p}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-3.3a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 11.6 4 8.4 8.4 0 0 1 21 11.5Z" /></svg>;
const IconDoc = (p) => <svg {...ic} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6M9 9h2" /></svg>;
const IconOrders = (p) => <svg {...ic} {...p}><path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /><path d="M10 7h4M10 11h4M10 15h2" /></svg>;
const IconLogout = (p) => <svg {...ic} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17 21 12 16 7" /><path d="M21 12H9" /></svg>;
const IconPlus = (p) => <svg {...ic} {...p}><path d="M12 5v14M5 12h14" /></svg>;
const IconSearch = (p) => <svg {...ic} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21 16.7 16.7" /></svg>;
const IconTrash = (p) => <svg {...ic} {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6h12Z" /></svg>;
const IconImage = (p) => <svg {...ic} {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>;
const IconEdit = (p) => <svg {...ic} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;

/* Signature joint/tenon mark — used for active nav state */
function JointTab() {
  return (
    <svg width="12" height="32" viewBox="0 0 12 32" style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)' }}>
      <path d="M0 4 H6 V11 H12 V21 H6 V28 H0 Z" fill={COLORS.gold} />
    </svg>
  );
}
/* Logo mark */
function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <rect x="2" y="2" width="11" height="24" fill={COLORS.gold} />
      <rect x="14" y="2" width="6" height="9" fill={COLORS.text} />
      <rect x="14" y="17" width="6" height="9" fill={COLORS.text} />
    </svg>
  );
}

/* ---------- Shared styles ---------- */
const inputStyle = { width: '100%', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: '9px 12px', color: COLORS.text, fontFamily: fontBody, fontSize: 14, outline: 'none' };
const labelStyle = { display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6, fontWeight: 700 };
const cardStyle = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const thStyle = { textAlign: 'left', padding: '12px 16px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, fontWeight: 700, borderBottom: `1px solid ${COLORS.border}` };
const tdStyle = { padding: '14px 16px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 14 };
const sectionTitleStyle = { fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 12 };
const rowItemStyle = { padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}` };

function useForm(initial) {
  const [values, setValues] = useState(initial);
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  return [values, set, setValues];
}

/* ---------- Small building blocks ---------- */
function Badge({ children, color }) {
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontFamily: fontMono, letterSpacing: '0.04em', textTransform: 'uppercase', color, background: color + '22', border: `1px solid ${color}55` }}>
      {children}
    </span>
  );
}
function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="flex justify-between items-start" style={{ marginBottom: 28 }}>
      <div>
        <div style={{ fontSize: 12, letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>{eyebrow}</div>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 32, fontWeight: 600, color: COLORS.text, margin: 0 }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...cardStyle, padding: '18px 20px', borderTop: `2px solid ${accent}` }}>
      <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 500, color: COLORS.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function EmptyRow({ text }) {
  return <div style={{ padding: '32px 16px', textAlign: 'center', color: COLORS.muted, fontSize: 13 }}>{text}</div>;
}
function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="flex justify-between" style={{ marginBottom: 4, fontSize: 13 }}>
        <span style={{ color: COLORS.muted }}>{label}</span>
        <span style={{ fontFamily: fontMono, color: COLORS.text }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 8, background: COLORS.bg, borderRadius: 4, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,8,6,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 600, color: COLORS.text, margin: 0 }}>{title}</h3>
          <button onClick={onClose} className="cg-icon-btn" aria-label="Close"><svg {...ic} width="20" height="20"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Forms ---------- */
const TRANSPORT_METHODS = ['Truck', 'Pickup Van', 'Courier', 'Manual Arrangement'];
const DELIVERY_REGIONS = ['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri'];

function ProductForm({ onSubmit, onCancel, initialData }) {
  const [v, set, setValues] = useForm(initialData || { 
    name: '', category: 'Living Room', subcategory: '', 
    price: '', discount_price: '', 
    description: '', size: '', in_stock: true, featured: false, 
    image: '', images: [], badge: '', rating: 5.0, review_count: 0,
    delivery_nairobi: '600', transport_method: '', delivery_outside: '{}'
  });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [outsidePrices, setOutsidePrices] = useState(() => {
    try {
      return JSON.parse((initialData?.delivery_outside) || '{}') || {};
    } catch {
      return {};
    }
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImg(true);
    
    const processFile = (file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/webp', 0.8));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    const dataUrls = await Promise.all(files.map(processFile));

    setValues((prev) => {
      const newImages = [...(prev.images || []), ...dataUrls];
      return { ...prev, images: newImages, image: newImages[0] || '' };
    });
    setUploadingImg(false);
  };

  const removeImage = (index) => {
    setValues((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages, image: newImages[0] || '' };
    });
  };

  const updateOutsidePrice = (region, price) => {
    setOutsidePrices(prev => {
      const updated = { ...prev };
      if (price === '' || price === undefined) { delete updated[region]; }
      else { updated[region] = Number(price) || 0; }
      return updated;
    });
  };

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      onSubmit({ 
        ...v, 
        price: Number(v.price) || null,
        discount_price: Number(v.discount_price) || null,
        rating: Number(v.rating) || 5.0,
        review_count: Number(v.review_count) || 0,
        delivery_nairobi: Number(v.delivery_nairobi) || 600,
        delivery_outside: JSON.stringify(outsidePrices),
        transport_method: v.transport_method || null,
      }); 
    }}>
      <div className="space-y-4">
        <div><label style={labelStyle}>Product name *</label><input style={inputStyle} className="cg-input" value={v.name} onChange={set('name')} required placeholder="e.g. Chesterfield Sofa Set" /></div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Category *</label>
            <select style={inputStyle} className="cg-input" value={v.category} onChange={set('category')} required>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Subcategory</label>
            <select style={inputStyle} className="cg-input" value={v.subcategory} onChange={set('subcategory')} disabled={!v.category}>
              <option value="">Select...</option>
              {(SUBCATEGORIES[v.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div><label style={labelStyle}>Regular Price (KSh)</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.price} onChange={set('price')} placeholder="Leave blank for POA" /></div>
          <div><label style={labelStyle}>Discount Price</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.discount_price} onChange={set('discount_price')} placeholder="Optional" /></div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} className="cg-input" value={v.in_stock ? 'In Stock' : 'Out of Stock'} onChange={(e) => setValues(prev => ({ ...prev, in_stock: e.target.value === 'In Stock' }))}>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label style={labelStyle}>Badge</label>
            <select style={inputStyle} className="cg-input" value={v.badge || ''} onChange={set('badge')}>
              <option value="">None</option>
              <option value="New">New</option>
              <option value="Best Seller">Best Seller</option>
              <option value="Sale">Sale</option>
              <option value="Limited Stock">Limited Stock</option>
            </select>
          </div>
          <div><label style={labelStyle}>Rating (1-5)</label><input style={inputStyle} className="cg-input" type="number" min="1" max="5" step="0.1" value={v.rating} onChange={set('rating')} /></div>
          <div><label style={labelStyle}>Review Count</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.review_count} onChange={set('review_count')} /></div>
        </div>

        {/* Delivery Pricing Section */}
        <div style={{ background: '#f9fafb', border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ ...labelStyle, fontSize: 12, color: COLORS.gold, marginBottom: 12 }}>🚛 DELIVERY PRICING</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Nairobi Delivery (KSh)</label>
              <input style={inputStyle} className="cg-input" type="number" min="0" value={v.delivery_nairobi} onChange={set('delivery_nairobi')} placeholder="600" />
            </div>
            <div>
              <label style={labelStyle}>Transport Method</label>
              <select style={inputStyle} className="cg-input" value={v.transport_method} onChange={set('transport_method')}>
                <option value="">Select...</option>
                {TRANSPORT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Outside Nairobi Delivery Prices</label>
            <div className="grid grid-cols-3 gap-3" style={{ marginTop: 6 }}>
              {DELIVERY_REGIONS.map(region => (
                <div key={region}>
                  <label style={{ fontSize: 11, color: COLORS.muted, display: 'block', marginBottom: 3 }}>{region}</label>
                  <input
                    style={{ ...inputStyle, fontSize: 12 }}
                    className="cg-input"
                    type="number"
                    min="0"
                    placeholder="KSh"
                    value={outsidePrices[region] || ''}
                    onChange={(e) => updateOutsidePrice(region, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{...inputStyle, resize: 'none'}} rows={3} className="cg-input" value={v.description} onChange={set('description')} />
        </div>

        <div>
          <label style={labelStyle}>Item Size / Dimensions (Optional)</label>
          <input style={inputStyle} className="cg-input" value={v.size || ''} onChange={set('size')} placeholder="e.g. 1.2m x 0.6m" />
        </div>

        <div>
          <label style={labelStyle}>Product Images (Upload Multiple)</label>
          <div className="flex items-center gap-4 flex-wrap">
            {(v.images && v.images.length > 0 ? v.images : (v.image ? [v.image] : [])).map((imgUrl, i) => (
              <div key={i} className="relative group">
                <img src={imgUrl} alt={`preview-${i}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 4, border: `1px solid ${COLORS.border}` }} />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            <label style={{ cursor: uploadingImg ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, border: `1px dashed ${COLORS.border}`, borderRadius: 6 }}>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImg} />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.muted} strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
            </label>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-2">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={v.featured} onChange={set('featured')} />
            Featured Product
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3" style={{ marginTop: 24 }}>
        <button type="button" className="cg-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="cg-btn-primary">Save product</button>
      </div>
    </form>
  );
}

function SaleForm({ onSubmit, onCancel }) {
  const [v, set] = useForm({ customer: '', item: '', branch: 'Nairobi', amount: '', payment: 'Full', method: 'M-PESA' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...v, amount: Number(v.amount) || 0, date: TODAY, id: Date.now() }); }}>
      <div className="space-y-4">
        <div><label style={labelStyle}>Customer name</label><input style={inputStyle} className="cg-input" value={v.customer} onChange={set('customer')} required /></div>
        <div><label style={labelStyle}>Item(s) sold</label><input style={inputStyle} className="cg-input" value={v.item} onChange={set('item')} required placeholder="e.g. Glass Coffee Table" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Amount (KSh)</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.amount} onChange={set('amount')} required /></div>
          <div><label style={labelStyle}>Branch</label>
            <select style={inputStyle} className="cg-input" value={v.branch} onChange={set('branch')}>{BRANCHES.map((b) => <option key={b}>{b}</option>)}</select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Payment</label>
            <select style={inputStyle} className="cg-input" value={v.payment} onChange={set('payment')}><option>Full</option><option>Deposit</option></select>
          </div>
          <div><label style={labelStyle}>Method</label>
            <select style={inputStyle} className="cg-input" value={v.method} onChange={set('method')}><option>M-PESA</option><option>Cash</option><option>Bank Transfer</option></select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3" style={{ marginTop: 24 }}>
        <button type="button" className="cg-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="cg-btn-primary">Save sale</button>
      </div>
    </form>
  );
}
function CreditForm({ onSubmit, onCancel }) {
  const [v, set] = useForm({ customer: '', phone: '', item: '', total: '', deposit: '', dueDate: '', branch: 'Nairobi' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...v, total: Number(v.total) || 0, paid: Number(v.deposit) || 0, id: Date.now() }); }}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Customer name</label><input style={inputStyle} className="cg-input" value={v.customer} onChange={set('customer')} required /></div>
          <div><label style={labelStyle}>Phone</label><input style={inputStyle} className="cg-input" value={v.phone} onChange={set('phone')} placeholder="07xx xxx xxx" required /></div>
        </div>
        <div><label style={labelStyle}>Item(s)</label><input style={inputStyle} className="cg-input" value={v.item} onChange={set('item')} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Total amount (KSh)</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.total} onChange={set('total')} required /></div>
          <div><label style={labelStyle}>Deposit paid (KSh)</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.deposit} onChange={set('deposit')} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Balance due date</label><input style={inputStyle} className="cg-input" type="date" value={v.dueDate} onChange={set('dueDate')} required /></div>
          <div><label style={labelStyle}>Branch</label>
            <select style={inputStyle} className="cg-input" value={v.branch} onChange={set('branch')}>{BRANCHES.map((b) => <option key={b}>{b}</option>)}</select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3" style={{ marginTop: 24 }}>
        <button type="button" className="cg-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="cg-btn-primary">Save credit sale</button>
      </div>
    </form>
  );
}
function ExpenseForm({ onSubmit, onCancel }) {
  const [v, set] = useForm({ date: TODAY, category: 'Materials', description: '', amount: '', branch: 'Nairobi' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...v, amount: Number(v.amount) || 0, id: Date.now() }); }}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Date</label><input style={inputStyle} className="cg-input" type="date" value={v.date} onChange={set('date')} required /></div>
          <div><label style={labelStyle}>Category</label>
            <select style={inputStyle} className="cg-input" value={v.category} onChange={set('category')}>
              {['Materials', 'Transport', 'Wages', 'Rent', 'Utilities', 'Marketing', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div><label style={labelStyle}>Description</label><input style={inputStyle} className="cg-input" value={v.description} onChange={set('description')} required placeholder="What was this for?" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={labelStyle}>Amount (KSh)</label><input style={inputStyle} className="cg-input" type="number" min="0" value={v.amount} onChange={set('amount')} required /></div>
          <div><label style={labelStyle}>Branch</label>
            <select style={inputStyle} className="cg-input" value={v.branch} onChange={set('branch')}>{BRANCHES.map((b) => <option key={b}>{b}</option>)}</select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3" style={{ marginTop: 24 }}>
        <button type="button" className="cg-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="cg-btn-primary">Save expense</button>
      </div>
    </form>
  );
}
function PaymentForm({ record, onSubmit, onCancel }) {
  const [amount, setAmount] = useState('');
  const balance = record.total - record.paid;
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(Number(amount) || 0); }}>
      <div style={{ marginBottom: 16, fontSize: 14, color: COLORS.muted }}>
        {record.customer} — balance <span style={{ fontFamily: fontMono, color: COLORS.text }}>{fmt(balance)}</span>
      </div>
      <label style={labelStyle}>Payment amount (KSh)</label>
      <input style={inputStyle} className="cg-input" type="number" min="0" max={balance} value={amount} onChange={(e) => setAmount(e.target.value)} required autoFocus />
      <div className="flex justify-end gap-3" style={{ marginTop: 24 }}>
        <button type="button" className="cg-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="cg-btn-primary">Record payment</button>
      </div>
    </form>
  );
}

/* ---------- Pages ---------- */
function DashboardPage({ products, sales, credit, expenses }) {
  const todaySales = sales.filter((s) => s.date === TODAY).reduce((a, s) => a + s.amount, 0);
  const outstanding = credit.filter((c) => c.total > c.paid);
  const outstandingTotal = outstanding.reduce((a, c) => a + (c.total - c.paid), 0);
  const monthExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const lowStock = products.filter((p) => p.in_stock === false).length;

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" />
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 32 }}>
        <StatCard label="Today's sales" value={fmt(todaySales)} accent={COLORS.green} />
        <StatCard label="Credit outstanding" value={fmt(outstandingTotal)} sub={`${outstanding.length} account${outstanding.length === 1 ? '' : 's'}`} accent={COLORS.amber} />
        <StatCard label="Expenses this month" value={fmt(monthExpenses)} accent={COLORS.rust} />
        <StatCard label="Out of stock items" value={lowStock} sub="Check Products" accent={COLORS.gold} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 style={sectionTitleStyle}>Recent sales</h3>
          <div style={cardStyle}>
            {sales.length === 0 && <EmptyRow text="No sales recorded yet." />}
            {sales.slice(-5).reverse().map((s) => (
              <div key={s.id} className="flex justify-between items-center cg-list-row" style={rowItemStyle}>
                <div>
                  <div style={{ fontWeight: 500 }}>{s.customer}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{s.item} · {s.branch}</div>
                </div>
                <div style={{ fontFamily: fontMono, fontWeight: 500 }}>{fmt(s.amount)}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={sectionTitleStyle}>Credit due soon</h3>
          <div style={cardStyle}>
            {outstanding.length === 0 && <EmptyRow text="No outstanding credit." />}
            {outstanding.map((c) => (
              <div key={c.id} className="flex justify-between items-center cg-list-row" style={rowItemStyle}>
                <div>
                  <div style={{ fontWeight: 500 }}>{c.customer}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Due {c.dueDate} · {c.branch}</div>
                </div>
                <div style={{ fontFamily: fontMono, fontWeight: 500, color: COLORS.amber }}>{fmt(c.total - c.paid)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPage({ products, handleDeleteProduct, openModal }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter((p) => (category === 'All' || p.category === category) && (p.name || p.title || '').toLowerCase().includes(search.toLowerCase()));
  const statusColor = { 'In Stock': COLORS.green, 'Out of Stock': COLORS.rust };

  return (
    <div>
      <PageHeader eyebrow="Inventory" title="Products" action={
        <button className="cg-btn-primary" onClick={() => openModal('product')}><IconPlus /> Add product</button>
      } />
      <div className="flex gap-3" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <IconSearch style={{ position: 'absolute', left: 12, top: 11, color: COLORS.muted }} />
          <input style={{ ...inputStyle, paddingLeft: 36 }} className="cg-input" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inputStyle, width: 180 }} className="cg-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={cardStyle}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: COLORS.surface2 }}>
            <th style={thStyle}>Product</th><th style={thStyle}>Category</th><th style={thStyle}>Price</th>
            <th style={thStyle}>Status</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="cg-table-row">
                <td style={tdStyle}>
                  <div className="flex items-center gap-3">
                    {p.image || p.imageUrl ? (
                      <img src={p.image || p.imageUrl} alt={p.name || p.title} style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: 4, background: COLORS.surface2 }} />
                    )}
                    {p.name || p.title}
                  </div>
                </td>
                <td style={{ ...tdStyle, color: COLORS.muted }}>{p.category}</td>
                <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(p.price)}</td>
                <td style={tdStyle}><Badge color={p.in_stock ? statusColor['In Stock'] : statusColor['Out of Stock']}>{p.in_stock ? 'In Stock' : 'Out of Stock'}</Badge></td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button className="cg-icon-btn" onClick={() => openModal({ type: 'edit_product', product: p })} aria-label="Edit" style={{ color: COLORS.gold, marginRight: 8 }}><IconEdit /></button>
                  <button className="cg-icon-btn" onClick={() => handleDeleteProduct(p.id)} aria-label="Delete"><IconTrash /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5}><EmptyRow text="No products match. Add one above." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesPage({ messages }) {
  return (
    <div>
      <PageHeader eyebrow="Inbox" title="Messages" />
      {messages.length === 0 ? (
        <div style={{ ...cardStyle, padding: '48px 16px', textAlign: 'center', color: COLORS.muted, fontSize: 13 }}>No messages yet.</div>
      ) : (
        <div style={cardStyle}>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: COLORS.surface2 }}>
              <th style={thStyle}>Name</th><th style={thStyle}>Contact</th><th style={thStyle}>Message</th>
            </tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="cg-table-row">
                  <td style={{...tdStyle, fontWeight: 500}}>{m.name}</td>
                  <td style={{...tdStyle, color: COLORS.muted, fontSize: 12}}>
                    {m.email && <div>{m.email}</div>}
                    {m.phone && <div>{m.phone}</div>}
                  </td>
                  <td style={{...tdStyle, color: COLORS.muted}}>{m.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function QuotesPage({ quotes }) {
  return (
    <div>
      <PageHeader eyebrow="Custom orders" title="Quotes" />
      {quotes.length === 0 ? (
        <div style={{ ...cardStyle, padding: '48px 16px', textAlign: 'center', color: COLORS.muted, fontSize: 13 }}>No quote requests yet.</div>
      ) : (
        <div style={cardStyle}>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: COLORS.surface2 }}>
              <th style={thStyle}>Customer</th><th style={thStyle}>Contact</th><th style={thStyle}>Request</th><th style={thStyle}>Status</th>
            </tr></thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="cg-table-row">
                  <td style={{...tdStyle, fontWeight: 500}}>{q.name}</td>
                  <td style={{...tdStyle, color: COLORS.muted, fontSize: 12}}>
                    {q.email && <div>{q.email}</div>}
                    {q.phone && <div>{q.phone}</div>}
                  </td>
                  <td style={{...tdStyle, color: COLORS.muted}}>
                    <div><span style={{color: COLORS.text}}>Type:</span> {q.furniture_type}</div>
                    {q.measurements && <div><span style={{color: COLORS.text}}>Size:</span> {q.measurements}</div>}
                    {q.notes && <div className="mt-1 text-sm italic">"{q.notes}"</div>}
                  </td>
                  <td style={tdStyle}><Badge color={COLORS.amber}>{(q.status || 'NEW').toUpperCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SalesPage({ sales, handleDeleteItem, openModal }) {
  const paymentColor = { Full: COLORS.green, Deposit: COLORS.amber };
  return (
    <div>
      <PageHeader eyebrow="Transactions" title="Sales" action={
        <button className="cg-btn-primary" onClick={() => openModal('sale')}><IconPlus /> Record sale</button>
      } />
      <div style={cardStyle}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: COLORS.surface2 }}>
            <th style={thStyle}>Date</th><th style={thStyle}>Customer</th><th style={thStyle}>Item</th>
            <th style={thStyle}>Branch</th><th style={thStyle}>Amount</th><th style={thStyle}>Payment</th>
            <th style={thStyle}>Method</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {sales.slice().reverse().map((s) => (
              <tr key={s.id} className="cg-table-row">
                <td style={{ ...tdStyle, fontFamily: fontMono, color: COLORS.muted }}>{s.date}</td>
                <td style={tdStyle}>{s.customer}</td>
                <td style={{ ...tdStyle, color: COLORS.muted }}>{s.item}</td>
                <td style={tdStyle}>{s.branch}</td>
                <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(s.amount)}</td>
                <td style={tdStyle}><Badge color={paymentColor[s.payment]}>{s.payment}</Badge></td>
                <td style={{ ...tdStyle, color: COLORS.muted }}>{s.method}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button className="cg-icon-btn" onClick={() => handleDeleteItem('sales', s.id)} aria-label="Delete"><IconTrash /></button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && <tr><td colSpan={8}><EmptyRow text="No sales recorded yet. Record one above." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreditPage({ credit, handleDeleteItem, openModal, openPayment }) {
  return (
    <div>
      <PageHeader eyebrow="Accounts receivable" title="Credit Book" action={
        <button className="cg-btn-primary" onClick={() => openModal('credit')}><IconPlus /> Add credit sale</button>
      } />
      <div style={cardStyle}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: COLORS.surface2 }}>
            <th style={thStyle}>Customer</th><th style={thStyle}>Phone</th><th style={thStyle}>Item</th>
            <th style={thStyle}>Total</th><th style={thStyle}>Paid</th><th style={thStyle}>Balance</th>
            <th style={thStyle}>Due date</th><th style={thStyle}>Branch</th><th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {credit.slice().reverse().map((c) => {
              const balance = c.total - c.paid;
              const overdue = balance > 0 && c.dueDate < TODAY;
              const status = balance <= 0 ? 'Settled' : overdue ? 'Overdue' : 'Current';
              const statusColor = balance <= 0 ? COLORS.green : overdue ? COLORS.rust : COLORS.amber;
              return (
                <tr key={c.id} className="cg-table-row">
                  <td style={tdStyle}>{c.customer}</td>
                  <td style={{ ...tdStyle, fontFamily: fontMono, color: COLORS.muted }}>{c.phone}</td>
                  <td style={{ ...tdStyle, color: COLORS.muted }}>{c.item}</td>
                  <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(c.total)}</td>
                  <td style={{ ...tdStyle, fontFamily: fontMono }}>{fmt(c.paid)}</td>
                  <td style={{ ...tdStyle, fontFamily: fontMono, color: balance > 0 ? COLORS.amber : COLORS.muted }}>{fmt(balance)}</td>
                  <td style={{ ...tdStyle, fontFamily: fontMono, color: COLORS.muted }}>{c.dueDate}</td>
                  <td style={tdStyle}>{c.branch}</td>
                  <td style={tdStyle}><Badge color={statusColor}>{status}</Badge></td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div className="flex justify-end gap-1">
                      {balance > 0 && <button className="cg-icon-btn" style={{ color: COLORS.gold }} onClick={() => openPayment(c.id)} aria-label="Record payment"><IconBanknote /></button>}
                      <button className="cg-icon-btn" onClick={() => handleDeleteItem('credit', c.id)} aria-label="Delete"><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {credit.length === 0 && <tr><td colSpan={10}><EmptyRow text="No credit accounts yet. Add one above." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpensesPage({ expenses, handleDeleteItem, openModal }) {
  const total = expenses.reduce((a, e) => a + e.amount, 0);
  return (
    <div>
      <PageHeader eyebrow="Outgoings" title="Expenses" action={
        <button className="cg-btn-primary" onClick={() => openModal('expense')}><IconPlus /> Add expense</button>
      } />
      <div style={{ marginBottom: 16 }}>
        <StatCard label="Total recorded" value={fmt(total)} sub={`${expenses.length} entries`} accent={COLORS.rust} />
      </div>
      <div style={cardStyle}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: COLORS.surface2 }}>
            <th style={thStyle}>Date</th><th style={thStyle}>Category</th><th style={thStyle}>Description</th>
            <th style={thStyle}>Branch</th><th style={thStyle}>Amount</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {expenses.slice().reverse().map((e) => (
              <tr key={e.id} className="cg-table-row">
                <td style={{ ...tdStyle, fontFamily: fontMono, color: COLORS.muted }}>{e.date}</td>
                <td style={tdStyle}><Badge color={COLORS.gold}>{e.category}</Badge></td>
                <td style={{ ...tdStyle, color: COLORS.muted }}>{e.description}</td>
                <td style={tdStyle}>{e.branch}</td>
                <td style={{ ...tdStyle, fontFamily: fontMono, color: COLORS.rust }}>{fmt(e.amount)}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button className="cg-icon-btn" onClick={() => handleDeleteItem('expenses', e.id)} aria-label="Delete"><IconTrash /></button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan={6}><EmptyRow text="No expenses recorded yet. Add one above." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsPage({ sales, credit, expenses }) {
  const totalSales = sales.reduce((a, s) => a + s.amount, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const outstanding = credit.reduce((a, c) => a + (c.total - c.paid), 0);
  const net = totalSales - totalExpenses;

  const salesByBranch = BRANCHES.map((b) => ({ label: b, value: sales.filter((s) => s.branch === b).reduce((a, s) => a + s.amount, 0) }));
  const expenseCats = Array.from(new Set(expenses.map((e) => e.category)));
  const expensesByCat = expenseCats.map((cat) => ({ label: cat, value: expenses.filter((e) => e.category === cat).reduce((a, e) => a + e.amount, 0) }));
  const maxBranch = Math.max(1, ...salesByBranch.map((x) => x.value));
  const maxCat = Math.max(1, ...expensesByCat.map((x) => x.value));

  return (
    <div>
      <PageHeader eyebrow="Business overview" title="Reports" />
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: 32 }}>
        <StatCard label="Total sales" value={fmt(totalSales)} accent={COLORS.green} />
        <StatCard label="Total expenses" value={fmt(totalExpenses)} accent={COLORS.rust} />
        <StatCard label="Net" value={fmt(net)} accent={net >= 0 ? COLORS.green : COLORS.rust} sub={net >= 0 ? 'Profit' : 'Loss'} />
        <StatCard label="Credit outstanding" value={fmt(outstanding)} accent={COLORS.amber} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 style={sectionTitleStyle}>Sales by branch</h3>
          <div style={{ ...cardStyle, padding: 20 }}>
            {salesByBranch.every((x) => x.value === 0) && <EmptyRow text="No sales recorded yet." />}
            {salesByBranch.map((x) => x.value > 0 && <BarRow key={x.label} label={x.label} value={x.value} max={maxBranch} color={COLORS.green} />)}
          </div>
        </div>
        <div>
          <h3 style={sectionTitleStyle}>Expenses by category</h3>
          <div style={{ ...cardStyle, padding: 20 }}>
            {expensesByCat.length === 0 && <EmptyRow text="No expenses recorded yet." />}
            {expensesByCat.map((x) => <BarRow key={x.label} label={x.label} value={x.value} max={maxCat} color={COLORS.rust} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSlidesPage({ heroSlides, handleDeleteItem, handleUploadSlide, uploadingImg }) {
  return (
    <div>
      <PageHeader eyebrow="Marketing" title="Hero Slides" action={
        <label className="cg-btn-primary" style={{ cursor: uploadingImg ? 'wait' : 'pointer' }}>
          <IconPlus /> {uploadingImg ? 'Uploading...' : 'Upload Slide'}
          <input type="file" accept="image/*" onChange={handleUploadSlide} style={{ display: 'none' }} disabled={uploadingImg} />
        </label>
      } />
      <div style={cardStyle}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: COLORS.surface2 }}>
            <th style={thStyle}>Preview</th><th style={thStyle}>Added</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {heroSlides.map((h) => (
              <tr key={h.id} className="cg-table-row">
                <td style={tdStyle}>
                  <img src={h.image} alt="Slide" style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 4 }} />
                </td>
                <td style={{ ...tdStyle, color: COLORS.muted }}>{new Date(h.created_at).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button className="cg-icon-btn" onClick={() => handleDeleteItem('hero_slides', h.id)} aria-label="Delete"><IconTrash /></button>
                </td>
              </tr>
            ))}
            {heroSlides.length === 0 && <tr><td colSpan={3}><EmptyRow text="No slides added yet. Upload one above." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Orders Page ---------- */
function OrdersPage({ orders, handleUpdateOrderStatus, handleResendWhatsApp }) {
  const ORDER_STATUSES = ['new', 'confirmed', 'processing', 'delivered'];
  const statusColors = { new: COLORS.amber, confirmed: COLORS.green, processing: COLORS.gold, delivered: '#10b981' };
  const paymentColors = { paid: COLORS.green, pending: COLORS.amber, failed: COLORS.rust };

  return (
    <div>
      <PageHeader eyebrow="Customer orders" title="Orders" />
      {orders.length === 0 ? (
        <div style={{ ...cardStyle, padding: '48px 16px', textAlign: 'center', color: COLORS.muted, fontSize: 13 }}>No orders yet.</div>
      ) : (
        <div style={cardStyle}>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: COLORS.surface2 }}>
              <th style={thStyle}>Order #</th><th style={thStyle}>Customer</th><th style={thStyle}>Items</th>
              <th style={thStyle}>Total</th><th style={thStyle}>Payment</th><th style={thStyle}>Delivery</th>
              <th style={thStyle}>Status</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="cg-table-row">
                  <td style={{ ...tdStyle, fontFamily: fontMono, fontSize: 12 }}>{o.order_number}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{o.customer_name}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{o.customer_phone}</div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: COLORS.muted, maxWidth: 200 }}>
                    {(o.items || []).map((it, i) => <div key={i}>{it.name} ×{it.quantity}</div>)}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: fontMono, fontWeight: 500 }}>{fmt(o.grand_total)}</td>
                  <td style={tdStyle}>
                    <Badge color={paymentColors[o.payment_status] || COLORS.muted}>{(o.payment_status || 'pending').toUpperCase()}</Badge>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{(o.payment_method || '').toUpperCase()}</div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: COLORS.muted }}>
                    <div>{o.delivery_location}</div>
                    <div style={{ fontSize: 10 }}>{fmt(o.delivery_fee)} fee</div>
                  </td>
                  <td style={tdStyle}>
                    <select
                      style={{ ...inputStyle, fontSize: 11, padding: '4px 8px', width: 'auto', minWidth: 110 }}
                      className="cg-input"
                      value={o.order_status || 'new'}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div className="flex justify-end gap-1">
                      <button
                        className="cg-icon-btn"
                        style={{ color: '#25D366' }}
                        onClick={() => handleResendWhatsApp(o)}
                        title="Send to WhatsApp"
                      >
                        <IconChat />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Layout ---------- */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: IconGauge },
  { id: 'orders', label: 'Orders', icon: IconOrders },
  { id: 'products', label: 'Products', icon: IconBox },
  { id: 'sales', label: 'Sales', icon: IconBanknote },
  { id: 'credit', label: 'Credit Book', icon: IconCard },
  { id: 'expenses', label: 'Expenses', icon: IconReceipt },
  { id: 'reports', label: 'Reports', icon: IconChart },
  { id: 'messages', label: 'Messages', icon: IconChat },
  { id: 'quotes', label: 'Quotes', icon: IconDoc },
  { id: 'hero', label: 'Hero Slides', icon: IconImage },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside style={{ width: 240, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '22px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: COLORS.text, lineHeight: 1.15 }}>Elite Furniture</div>
            <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Admin</div>
          </div>
        </div>
      </div>
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className="cg-nav-item"
              style={{ position: 'relative', overflow: 'visible', display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 14px', marginBottom: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: active ? COLORS.goldSoft : 'transparent', color: active ? COLORS.gold : COLORS.muted, fontSize: 14, fontWeight: active ? 600 : 400, textAlign: 'left' }}>
              {active && <JointTab />}
              <Icon />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ branch, setBranch, onLogout }) {
  return (
    <header style={{ height: 64, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
      <div style={{ fontSize: 13, color: COLORS.muted }}>
        Admin <span style={{ color: COLORS.border, margin: '0 8px' }}>/</span> <span style={{ color: COLORS.text, fontWeight: 500 }}>Elite Furniture</span>
      </div>
      <div className="flex items-center gap-3">
        <select className="cg-input" style={{ ...inputStyle, width: 160 }} value={branch} onChange={(e) => setBranch(e.target.value)}>
          {['All Branches', ...BRANCHES].map((b) => <option key={b}>{b}</option>)}
        </select>
        <button className="cg-btn-secondary" onClick={onLogout}><IconLogout /> Logout</button>
      </div>
    </header>
  );
}

/* ---------- Main Container App ---------- */
export default function Admin() {
  const { user, isLoadingAuth, signOut } = useAuth();

  // Elite Furniture Live DB State
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [sales, setSales] = useState([]);
  const [credit, setCredit] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [orders, setOrders] = useState([]);

  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [branch, setBranch] = useState('All Branches');
  const [modal, setModal] = useState(null);
  const [uploadingSlide, setUploadingSlide] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [
        { data: pData }, { data: mData }, { data: qData },
        { data: sData }, { data: cData }, { data: eData }, { data: hData },
        { data: oData }
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*').order('created_at', { ascending: false }),
        supabase.from('credit').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('hero_slides').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);
      setProducts(pData || []);
      setMessages(mData || []);
      setQuotes(qData || []);
      setSales(sData || []);
      setCredit(cData || []);
      setExpenses(eData || []);
      setHeroSlides(hData || []);
      setOrders(oData || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data from Supabase');
    }
  };

  const handleUploadSlide = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingSlide(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/webp', 0.85);
        
        const { error } = await supabase.from('hero_slides').insert([{ image: dataUrl }]);
        if (error) { toast.error('Error uploading slide'); console.error(error); }
        else { toast.success('Slide added'); loadData(); }
        setUploadingSlide(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async (data) => {
    const { error } = await supabase.from('products').insert([data]);
    if (error) toast.error('Error adding product');
    else { toast.success('Product added'); loadData(); }
  };

  const handleUpdateProduct = async (id, data) => {
    const { id: _id, created_at, ...updateData } = data; // Ensure id/created_at aren't updated
    const { error } = await supabase.from('products').update(updateData).eq('id', id);
    if (error) toast.error('Error updating product');
    else { toast.success('Product updated'); loadData(); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Error deleting product');
    else { toast.success('Product deleted'); loadData(); }
  };

  const handleRecordSale = async (data) => {
    const { error } = await supabase.from('sales').insert([data]);
    if (error) toast.error('Error recording sale');
    else { toast.success('Sale recorded'); loadData(); }
  };

  const handleAddCredit = async (data) => {
    const { error } = await supabase.from('credit').insert([data]);
    if (error) toast.error('Error adding credit');
    else { toast.success('Credit added'); loadData(); }
  };

  const handleAddExpense = async (data) => {
    const { error } = await supabase.from('expenses').insert([data]);
    if (error) toast.error('Error adding expense');
    else { toast.success('Expense added'); loadData(); }
  };

  const recordPayment = async (id, amount) => {
    const target = credit.find(c => c.id === id);
    if (!target) return;
    const newPaid = Math.min(target.total, target.paid + amount);
    const { error } = await supabase.from('credit').update({ paid: newPaid }).eq('id', id);
    if (error) toast.error('Error recording payment');
    else { toast.success('Payment recorded'); loadData(); }
  };

  const handleDeleteItem = async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) toast.error(`Error deleting from ${table}`);
    else loadData();
  };

  const closeModal = () => setModal(null);
  const openModal = (type) => setModal(type);
  const openPayment = (id) => setModal({ type: 'payment', id });

  const handleUpdateOrderStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', id);
    if (error) toast.error('Error updating order status');
    else { toast.success(`Order marked as ${status}`); loadData(); }
  };

  const handleResendWhatsApp = (order) => {
    sendOrderToAdminWhatsApp(order);
    toast.success('WhatsApp message opened');
  };

  if (isLoadingAuth) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-mono">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: fontBody }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        select { -webkit-appearance: none; appearance: none; }
        .cg-btn-primary { background:#0A0A0A; color:#FFFFFF; font-weight:600; padding:10px 18px; border-radius:8px; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-size:13px; letter-spacing:0.04em; transition:all .15s; font-family:'Inter',sans-serif; }
        .cg-btn-primary:hover { background:${COLORS.gold}; color:#0A0A0A; }
        .cg-btn-secondary { background:transparent; color:${COLORS.text}; border:1px solid ${COLORS.border}; padding:9px 16px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-size:13px; transition: all .15s; font-family:'Inter',sans-serif; }
        .cg-btn-secondary:hover { border-color:${COLORS.gold}; color:${COLORS.gold}; }
        .cg-nav-item:hover { background:${COLORS.surface2} !important; color:${COLORS.text} !important; }
        .cg-input { transition: border-color .15s; }
        .cg-input:focus { border-color:${COLORS.gold} !important; }
        .cg-table-row:hover { background:${COLORS.surface2}; }
        .cg-icon-btn { background:none; border:none; color:${COLORS.muted}; cursor:pointer; padding:6px; border-radius:4px; display:inline-flex; }
        .cg-icon-btn:hover { color:${COLORS.rust}; background:${COLORS.surface2}; }
        .cg-list-row:last-child { border-bottom:none !important; }
        ::-webkit-scrollbar { width:8px; height:8px; }
        ::-webkit-scrollbar-track { background:${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background:${COLORS.border}; border-radius:4px; }
      `}</style>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar branch={branch} setBranch={setBranch} onLogout={signOut} />
        <main style={{ flex: 1, padding: 32, overflowX: 'auto' }}>
          {activeTab === 'dashboard' && <DashboardPage products={products} sales={sales} credit={credit} expenses={expenses} />}
          {activeTab === 'orders' && <OrdersPage orders={orders} handleUpdateOrderStatus={handleUpdateOrderStatus} handleResendWhatsApp={handleResendWhatsApp} />}
          {activeTab === 'products' && <ProductsPage products={products} handleDeleteProduct={handleDeleteProduct} openModal={openModal} />}
          {activeTab === 'sales' && <SalesPage sales={sales} handleDeleteItem={handleDeleteItem} openModal={openModal} />}
          {activeTab === 'credit' && <CreditPage credit={credit} handleDeleteItem={handleDeleteItem} openModal={openModal} openPayment={openPayment} />}
          {activeTab === 'expenses' && <ExpensesPage expenses={expenses} handleDeleteItem={handleDeleteItem} openModal={openModal} />}
          {activeTab === 'reports' && <ReportsPage sales={sales} credit={credit} expenses={expenses} />}
          {activeTab === 'messages' && <MessagesPage messages={messages} />}
          {activeTab === 'quotes' && <QuotesPage quotes={quotes} />}
          {activeTab === 'hero' && <HeroSlidesPage heroSlides={heroSlides} handleDeleteItem={handleDeleteItem} handleUploadSlide={handleUploadSlide} uploadingImg={uploadingSlide} />}
        </main>
      </div>

      {modal === 'product' && <Modal title="Add product" onClose={closeModal}><ProductForm onSubmit={(p) => { handleCreateProduct(p); closeModal(); }} onCancel={closeModal} /></Modal>}
      {modal?.type === 'edit_product' && <Modal title="Edit product" onClose={closeModal}><ProductForm initialData={modal.product} onSubmit={(p) => { handleUpdateProduct(modal.product.id, p); closeModal(); }} onCancel={closeModal} /></Modal>}
      {modal === 'sale' && <Modal title="Record sale" onClose={closeModal}><SaleForm onSubmit={(s) => { handleRecordSale(s); closeModal(); }} onCancel={closeModal} /></Modal>}
      {modal === 'credit' && <Modal title="Add credit sale" onClose={closeModal}><CreditForm onSubmit={(c) => { handleAddCredit(c); closeModal(); }} onCancel={closeModal} /></Modal>}
      {modal === 'expense' && <Modal title="Add expense" onClose={closeModal}><ExpenseForm onSubmit={(e) => { handleAddExpense(e); closeModal(); }} onCancel={closeModal} /></Modal>}
      {modal && modal.type === 'payment' && (
        <Modal title="Record payment" onClose={closeModal}>
          <PaymentForm record={credit.find((c) => c.id === modal.id)} onSubmit={(amt) => { recordPayment(modal.id, amt); closeModal(); }} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}