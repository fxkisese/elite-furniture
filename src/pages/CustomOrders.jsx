import React, { useState, useEffect, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { CheckCircle2, ArrowRight, Plus, Trash2, Package, PenLine, ImageOff, X, Search, Upload } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const TIMELINES = ['ASAP (Rushed)', '2-4 Weeks', '1-2 Months', 'Flexible'];

// Fallback catalogue used if Supabase has no products yet
const FALLBACK_CATALOG = [
  { id: 1, title: 'Floating TV Unit', category: 'TV Units', price: 38000, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'King Platform Bed', category: 'Beds', price: 68000, imageUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: '4-Door Sliding Wardrobe', category: 'Wardrobes', price: 72000, imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Executive Mahogany Desk', category: 'Office', price: 65000, imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Tempered Glass Coffee Table', category: 'Glass', price: 28000, imageUrl: 'https://images.unsplash.com/photo-1533090481728-8b5c62ae2434?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Chesterfield Leather Sofa', category: 'Living Room', price: 150000, imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' },
  { id: 7, title: 'Minimalist Platform Bed', category: 'Bedroom', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800' },
  { id: 8, title: 'Rustic Dining Chairs (Set of 6)', category: 'Dining', price: 54000, imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
  { id: 9, title: 'Ergonomic Office Chair', category: 'Office', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800' },
  { id: 10, title: '8-Seater Dining Set', category: 'Dining Sets', price: 110000, imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800' },
  { id: 11, title: 'Velvet Accent Chair', category: 'Living Room', price: 42000, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
  { id: 12, title: 'Mvuli Wardrobe (3-Door)', category: 'Wardrobe', price: 110000, imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800' },
  { id: 13, title: '6-Drawer Dresser', category: 'Dressers', price: 42000, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { id: 14, title: 'Modern Bookshelf', category: 'Storage', price: 48000, imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800' },
  { id: 15, title: 'Glass Dining Table', category: 'Glass', price: 90000, imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800' },
  { id: 16, title: '4-Seater Dining Set', category: 'Dining Sets', price: 58000, imageUrl: 'https://images.unsplash.com/photo-1604480557873-ae065e9d1cb8?auto=format&fit=crop&q=80&w=800' },
  { id: 17, title: 'Bedside Table (Pair)', category: 'Bedroom', price: 30000, imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800' },
];

const emptyItem = () => ({
  id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `item-${Date.now()}-${Math.random()}`,
  source: 'catalog', // 'catalog' | 'custom'
  productId: '',
  name: '',
  image: '',
  category: '',
  quantity: 1,
  dimensions: '',
  price: '',
  description: '',
});

export default function CustomOrders() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [catalog, setCatalog] = useState(FALLBACK_CATALOG);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('in_stock', true);
        if (!error && data && data.length > 0) {
          setCatalog(data);
        }
      } catch (err) {
        console.error('Failed to load product catalog from Supabase:', err);
      }
    }
    loadCatalog();
  }, []);

  const catalogByCategory = useMemo(() => {
    const groups = {};
    catalog.forEach(p => {
      const cat = p.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [catalog]);

  const updateItem = (id, changes) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...changes } : it));
  };

  const addItem = () => {
    setItems(prev => [...prev, emptyItem()]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== id) : prev);
  };

  const handleSourceChange = (id, source) => {
    updateItem(id, source === 'custom'
      ? { source, productId: '', image: '', category: '', name: '' }
      : { source, name: '', image: '', category: '', price: '' }
    );
  };

  const handleCatalogPick = (id, productId) => {
    const product = catalog.find(p => String(p.id) === String(productId));
    if (!product) {
      updateItem(id, { productId: '', name: '', image: '', category: '', price: '' });
      return;
    }
    updateItem(id, {
      productId,
      name: product.title || product.name || '',
      image: product.imageUrl || product.image || '',
      category: product.category || '',
      price: product.price ?? '',
    });
  };

  const itemTotal = (item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return qty * price;
  };

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + itemTotal(item), 0),
    [items]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const invalidItem = items.find(it => !it.name.trim() || Number(it.quantity) <= 0);
    if (invalidItem) {
      toast.error('Each item needs a name and a quantity of at least 1.');
      return;
    }

    setLoading(true);

    const quoteItems = items.map(item => ({
      source: item.source,
      product_id: item.source === 'catalog' ? item.productId || null : null,
      name: item.name.trim(),
      image: item.image || null,
      category: item.category || null,
      quantity: Number(item.quantity) || 0,
      dimensions: item.dimensions.trim(),
      price_per_item: Number(item.price) || 0,
      total: itemTotal(item),
      description: item.description.trim(),
    }));

    const itemsSummary = quoteItems.map((it, idx) =>
      `${idx + 1}. ${it.name} x${it.quantity}${it.dimensions ? ` (${it.dimensions})` : ''} \u2014 ${formatPrice(it.price_per_item)} each = ${formatPrice(it.total)}${it.description ? `\n   Description: ${it.description}` : ''}`
    ).join('\n');

    const notes = `Timeline: ${timeline || 'Not specified'}\nGrand Total: ${formatPrice(grandTotal)}\n\nItems:\n${itemsSummary}`;

    const data = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      items: quoteItems,
      grand_total: grandTotal,
      notes: notes,
    };

    const { error } = await supabase.from('quotes').insert([data]);

    if (error) {
      toast.error('Failed to submit quote. Please try again.');
      console.error(error);
    } else {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  const steps = [
    { title: 'Build Your Quote', desc: 'Add items from our catalog or describe custom pieces' },
    { title: 'We Review', desc: 'We confirm pricing, availability & 3D mockups' },
    { title: 'The Deposit', desc: '60% downpayment to start' },
    { title: 'Delivery', desc: 'Free delivery within Nairobi' }
  ];

  if (success) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-24 max-w-3xl text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Quote Request Received!</h1>
          <p className="text-xl text-muted-foreground mb-10">
            Thank you for trusting Craftsman Galore with your order. Our team is reviewing your quote and will get back to you within 24 hours to confirm pricing and next steps.
          </p>
          <button onClick={() => { setSuccess(false); setItems([emptyItem()]); setTimeline(''); }} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">Build Another Quote</button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-gray-900">Build Your Quote</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Add items from our catalogue or describe a custom piece \u2014 set quantities, dimensions and pricing, and we'll confirm your total.
          </p>
        </div>

        {/* 4-Step Process */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-[#faf7f0] border border-gray-200 text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#b8903a] text-white flex items-center justify-center font-bold absolute -top-4 left-1/2 -translate-x-1/2">
                  {idx + 1}
                </div>
                <h3 className="font-bold mb-2 mt-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-12">

              {/* Contact Details */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">1. Contact Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
                    <input id="name" name="name" required placeholder="John Doe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" required placeholder="+254 700 000 000" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input id="email" name="email" type="email" placeholder="john@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                </div>
              </section>

              {/* Quote Items */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-2xl font-bold">2. Quote Items</h2>
                  <span className="text-sm text-gray-500 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div className="space-y-6">
                  {items.map((item, idx) => (
                    <QuoteItemRow
                      key={item.id}
                      index={idx}
                      item={item}
                      total={itemTotal(item)}
                      catalog={catalog}
                      catalogByCategory={catalogByCategory}
                      onSourceChange={(source) => handleSourceChange(item.id, source)}
                      onCatalogPick={(productId) => handleCatalogPick(item.id, productId)}
                      onChange={(changes) => updateItem(item.id, changes)}
                      onRemove={() => removeItem(item.id)}
                      canRemove={items.length > 1}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#D4AF37] hover:text-[#0A0A0A] font-semibold text-sm py-4 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Another Item
                </button>

                {/* Grand Total */}
                <div className="flex items-center justify-between bg-[#0A0A0A] text-white rounded-xl px-6 py-5">
                  <span className="font-bold tracking-widest uppercase text-sm">Estimated Grand Total</span>
                  <span className="text-2xl font-black text-[#D4AF37]">{formatPrice(grandTotal)}</span>
                </div>
              </section>

              {/* Logistics */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">3. Delivery Timeline</h2>
                <div className="space-y-2 flex flex-col">
                  <label htmlFor="timeline" className="text-sm font-medium">When do you need this delivered? (Optional)</label>
                  <input
                    id="timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. ASAP, By end of next month, Flexible"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </section>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-full text-lg">
                  {loading ? 'Submitting Quote...' : 'Submit Quote Request'}
                </button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Prices shown are estimates. Our team will confirm final pricing, including any custom work, before the deposit is requested.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function QuoteItemRow({ index, item, total, catalog, catalogByCategory, onSourceChange, onCatalogPick, onChange, onRemove, canRemove }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    
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
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        onChange({ image: dataUrl });
        setUploadingImg(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5 md:p-6">
      {/* Row header: number, source toggle, remove */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#0A0A0A] text-white text-xs font-bold flex items-center justify-center">{index + 1}</span>
          <div className="inline-flex rounded-full border border-gray-300 overflow-hidden text-xs font-bold">
            <button
              type="button"
              onClick={() => onSourceChange('catalog')}
              className={cn("px-4 py-2 transition-colors flex items-center gap-1.5", item.source === 'catalog' ? "bg-[#0A0A0A] text-white" : "bg-white text-gray-600 hover:bg-gray-100")}
            >
              <Package className="w-3.5 h-3.5" /> CATALOG ITEM
            </button>
            <button
              type="button"
              onClick={() => onSourceChange('custom')}
              className={cn("px-4 py-2 transition-colors flex items-center gap-1.5", item.source === 'custom' ? "bg-[#0A0A0A] text-white" : "bg-white text-gray-600 hover:bg-gray-100")}
            >
              <PenLine className="w-3.5 h-3.5" /> CUSTOM ITEM
            </button>
          </div>
        </div>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1.5">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-[100px_1fr] gap-5">
        {/* Image preview */}
        <div className="flex flex-col gap-2 shrink-0 w-full md:w-[100px]">
          <div className="w-full aspect-square rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center relative group">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300 gap-1">
                <ImageOff className="w-6 h-6" />
                <span className="text-[10px] font-medium">No image</span>
              </div>
            )}
            
            {item.source === 'custom' && (
              <label className={cn(
                "absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center transition-opacity cursor-pointer",
                uploadingImg ? "opacity-100 cursor-wait" : "opacity-0 group-hover:opacity-100"
              )}>
                {uploadingImg ? (
                  <span className="text-[10px] font-medium animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mb-1 text-[#D4AF37]" />
                    <span className="text-[10px] font-medium text-center leading-tight">Upload<br/>Ref Image</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImg} />
              </label>
            )}
          </div>
          {item.source === 'custom' && item.image && (
            <button type="button" onClick={() => onChange({ image: '' })} className="text-[10px] text-red-500 hover:text-red-700 font-semibold text-center transition-colors">Remove Image</button>
          )}
        </div>

        <div className="space-y-4">
          {/* Item name / catalog picker */}
          {item.source === 'catalog' ? (
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Item *</label>
              {item.productId ? (
                <div className="flex items-center justify-between h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <span className="font-medium text-gray-900 truncate">{item.name}</span>
                  <button type="button" onClick={() => setIsModalOpen(true)} className="text-xs font-bold text-[#D4AF37] hover:text-black">CHANGE</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center h-10 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-600 hover:border-[#D4AF37] hover:text-[#0A0A0A] hover:bg-white transition-all"
                >
                  <Search className="w-4 h-4 mr-2" /> Browse Catalog
                </button>
              )}
              
              <ProductSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                catalog={catalog}
                onSelect={onCatalogPick}
              />
            </div>
          ) : (
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Item Name *</label>
              <input
                value={item.name}
                onChange={(e) => onChange({ name: e.target.value })}
                required
                placeholder="e.g. Custom L-Shaped Sofa"
                className={inputClass}
              />
            </div>
          )}

          {/* Quantity, dimensions, price, total */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Quantity *</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onChange({ quantity: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Dimensions</label>
              <input
                value={item.dimensions}
                onChange={(e) => onChange({ dimensions: e.target.value })}
                placeholder="W x H x D cm"
                className={inputClass}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Price / Item (KSh)</label>
              <input
                type="number"
                min="0"
                value={item.price}
                onChange={(e) => onChange({ price: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Total</label>
              <div className={cn(inputClass, "flex items-center font-bold bg-gray-100 text-gray-900")}>
                {formatPrice(total)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium">
              Description {item.source === 'custom' && <span className="text-gray-400 font-normal">(include material, finish, color, design details)</span>}
            </label>
            <textarea
              value={item.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder={item.source === 'custom'
                ? "Describe the design, materials, finish, color and any specific requirements..."
                : "Any customization notes for this item (optional)..."}
              className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSelectorModal({ isOpen, onClose, catalog, onSelect }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', ...new Set(catalog.map(p => p.category || 'Other'))];

  const filtered = catalog.filter(p => {
    if (category !== 'All' && (p.category || 'Other') !== category) return false;
    if (search && !((p.title || p.name || '').toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select a Product</h2>
            <p className="text-sm text-gray-500">Browse our catalogue to add items to your quote</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-5 border-b bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search catalog by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex h-11 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A570]"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex h-11 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A570] sm:w-[220px]"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Grid */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {filtered.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <Package className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-900">No products found</p>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map(product => (
                <button
                  key={product.id}
                  onClick={() => { onSelect(product.id); onClose(); }}
                  className="group flex flex-col text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#D4AF37] hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    {(product.imageUrl || product.image) ? (
                      <img src={product.imageUrl || product.image} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageOff className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mb-1">{product.category || 'Other'}</span>
                    <span className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 flex-1 group-hover:text-[#D4AF37] transition-colors">{product.title || product.name}</span>
                    <span className="font-black text-sm">{formatPrice(product.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

