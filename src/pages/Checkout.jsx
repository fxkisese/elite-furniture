import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/lib/CartContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { generateOrderNumber, sendOrderToAdminWhatsApp } from '@/utils/whatsapp';
import { toast } from 'sonner';
import {
  MapPin, CreditCard, Smartphone, Building2, Truck, ChevronRight,
  CheckCircle2, Copy, ExternalLink, ArrowLeft, Package, ShieldCheck, Loader2, Banknote
} from 'lucide-react';

const INTASEND_PUBLIC_KEY = import.meta.env.VITE_INTASEND_PUBLIC_KEY || '';
const NAIROBI_DELIVERY_FEE = 600;

const DELIVERY_ZONES = [
  { id: 'nairobi', label: 'Within Nairobi', fee: NAIROBI_DELIVERY_FEE },
  { id: 'outside', label: 'Outside Nairobi', fee: null },
];

const PAYMENT_METHODS = [
  { id: 'mpesa',    label: 'M-PESA',          subtitle: 'STK Push to your phone',          icon: Smartphone,  color: '#00A651' },
  { id: 'card',     label: 'Card Payment',     subtitle: 'Visa / Mastercard',               icon: CreditCard,  color: '#4F46E5' },
  { id: 'bank',     label: 'Bank Transfer',    subtitle: 'Pay directly to our bank account',icon: Building2,   color: '#0EA5E9' },
  { id: 'cod',      label: 'Cash on Delivery', subtitle: 'Pay when your order arrives',     icon: Banknote,    color: '#D4AF37' },
];

const BANK_DETAILS = {
  bank: 'Equity Bank Kenya',
  account: '0123456789',
  name: 'Elite Furniture Ltd',
  branch: 'Nairobi CBD',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — Delivery
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('nairobi');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Step 2 — Payment
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankCopied, setBankCopied] = useState(false);

  // Step 3 — Confirmation
  const [order, setOrder] = useState(null);

  const deliveryFee = useMemo(() => {
    if (deliveryZone === 'nairobi') return NAIROBI_DELIVERY_FEE;
    const outsideFees = cartItems.reduce((total, item) => {
      if (item.delivery_outside) {
        try {
          const outsidePrices = typeof item.delivery_outside === 'string'
            ? JSON.parse(item.delivery_outside)
            : item.delivery_outside;
          const fees = Object.values(outsidePrices);
          if (fees.length > 0) return total + (Number(fees[0]) || 0) * item.quantity;
        } catch { /* fallback */ }
      }
      return total + 1500 * item.quantity;
    }, 0);
    return outsideFees;
  }, [deliveryZone, cartItems]);

  const grandTotal = cartTotal + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0 && !order) navigate('/products');
  }, [cartItems, order, navigate]);

  // Load IntaSend script
  useEffect(() => {
    if (!document.getElementById('intasend-script')) {
      const script = document.createElement('script');
      script.id = 'intasend-script';
      script.src = 'https://unpkg.com/intasend-inlinejs-sdk@3.0.3/build/intasend-inline.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Please fill in your name and phone number.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createOrderData = (payMethod, payStatus, payRef) => {
    const orderNumber = generateOrderNumber();
    return {
      order_number: orderNumber,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || null,
      customer_phone: customerPhone.trim(),
      delivery_location: deliveryZone === 'nairobi' ? 'Nairobi' : 'Outside Nairobi',
      delivery_address: deliveryAddress.trim() || null,
      delivery_fee: deliveryFee,
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.title || item.name,
        quantity: item.quantity,
        price: item.price || 0,
        image: item.imageUrl || item.image || null,
      })),
      subtotal: cartTotal,
      grand_total: grandTotal,
      payment_method: payMethod,
      payment_status: payStatus,
      payment_reference: payRef || null,
      order_status: 'new',
      notes: notes.trim() || null,
      whatsapp_sent: false,
    };
  };

  const saveAndComplete = async (orderData) => {
    try {
      const { data, error } = await supabase.from('orders').insert([orderData]).select();
      if (error) {
        console.error('Order save error:', error);
        toast.error('Order placed but failed to save. Please contact us.');
      }
      setOrder(orderData);
      try {
        sendOrderToAdminWhatsApp(orderData);
        if (data && data[0]) {
          await supabase.from('orders').update({ whatsapp_sent: true }).eq('id', data[0].id);
        }
      } catch (e) {
        console.warn('WhatsApp forward attempted', e);
      }
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please contact us.');
    }
  };

  const handleIntaSendPayment = () => {
    if (!window.IntaSend) {
      toast.error('Payment system is loading. Please try again in a moment.');
      return;
    }
    setLoading(true);

    const email = customerEmail.trim() || `${customerPhone.replace(/\D/g, '')}@customer.elitefurniture.co.ke`;

    const intasend = new window.IntaSend({
      publicAPIKey: INTASEND_PUBLIC_KEY,
      live: false, // Set to true in production
    });

    intasend
      .on('COMPLETE', async (response) => {
        const orderData = createOrderData(paymentMethod, 'paid', response.tracking_id || response.id);
        await saveAndComplete(orderData);
        setLoading(false);
      })
      .on('FAILED', () => {
        setLoading(false);
        toast.error('Payment failed. Please try again.');
      })
      .on('IN-PROGRESS', () => {
        toast('Payment processing...');
      });

    if (paymentMethod === 'mpesa') {
      intasend.run({
        amount: Math.round(grandTotal),
        currency: 'KES',
        email,
        phone_number: customerPhone.replace(/\D/g, '').replace(/^0/, '254'),
        method: 'M-PESA',
        comment: `Elite Furniture Order - ${customerName}`,
      });
    } else if (paymentMethod === 'card') {
      intasend.run({
        amount: Math.round(grandTotal),
        currency: 'KES',
        email,
        phone_number: customerPhone.replace(/\D/g, '').replace(/^0/, '254'),
        method: 'CARD-PAYMENT',
        comment: `Elite Furniture Order - ${customerName}`,
      });
    }
  };

  const handleOfflinePayment = async () => {
    setLoading(true);
    const status = paymentMethod === 'cod' ? 'pending' : 'awaiting_payment';
    const orderData = createOrderData(paymentMethod, status, null);
    await saveAndComplete(orderData);
    setLoading(false);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }
    if (paymentMethod === 'mpesa' || paymentMethod === 'card') {
      handleIntaSendPayment();
    } else {
      handleOfflinePayment();
    }
  };

  const copyBankDetails = () => {
    navigator.clipboard.writeText(BANK_DETAILS.account);
    setBankCopied(true);
    toast.success('Account number copied!');
    setTimeout(() => setBankCopied(false), 3000);
  };

  // ——— Success Screen ———
  if (step === 3 && order) {
    const isOffline = order.payment_method === 'bank' || order.payment_method === 'cod';
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600">
              Your order <span className="font-mono font-bold text-[#D4AF37]">#{order.order_number}</span> has been received.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
            <div className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold tracking-widest uppercase text-sm">Order Summary</h3>
              <span className="text-xs font-mono text-gray-400">#{order.order_number}</span>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery ({order.delivery_location})</span><span>{formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total {order.payment_method === 'cod' ? 'Due on Delivery' : 'Paid'}</span>
                <span className="text-xl font-black text-[#D4AF37]">{formatPrice(order.grand_total)}</span>
              </div>
            </div>
          </div>

          {/* Bank Transfer Instructions */}
          {order.payment_method === 'bank' && (
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 mb-8">
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 mb-2">Complete Your Bank Transfer</h4>
                  <p className="text-sm text-blue-700 mb-4">Please transfer <strong>{formatPrice(order.grand_total)}</strong> to the account below and use your order number as the reference.</p>
                  <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-semibold">{BANK_DETAILS.bank}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account Name</span><span className="font-semibold">{BANK_DETAILS.name}</span></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Account No.</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{BANK_DETAILS.account}</span>
                        <button onClick={copyBankDetails} className="p-1.5 hover:bg-blue-50 rounded-md transition-colors">
                          {bankCopied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">Branch</span><span className="font-semibold">{BANK_DETAILS.branch}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-mono font-bold text-[#D4AF37]">#{order.order_number}</span></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-3">After payment, send your proof of payment via WhatsApp and we'll confirm your order within 2 hours.</p>
                </div>
              </div>
            </div>
          )}

          {/* COD Notice */}
          {order.payment_method === 'cod' && (
            <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6 mb-8">
              <div className="flex items-start gap-3">
                <Banknote className="w-6 h-6 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-1">Cash on Delivery Confirmed</h4>
                  <p className="text-sm text-yellow-700">Please have <strong>{formatPrice(order.grand_total)}</strong> ready when your order arrives. Our team will contact you to confirm delivery time.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/products')}
              className="flex-1 inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-[#0A0A0A] text-white hover:bg-gray-800 h-12 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => sendOrderToAdminWhatsApp(order)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#128C7E] h-12 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Chat on WhatsApp
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            {['Delivery', 'Payment'].map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <React.Fragment key={label}>
                  {idx > 0 && (
                    <div className={`w-12 h-0.5 transition-colors duration-300 ${isDone ? 'bg-[#D4AF37]' : 'bg-gray-200'}`} />
                  )}
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isDone ? 'bg-[#D4AF37] text-white' :
                      isActive ? 'bg-[#0A0A0A] text-white' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left Panel */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {/* STEP 1 — Delivery */}
            {step === 1 && (
              <form onSubmit={handleDeliverySubmit}>
                <div className="bg-[#0A0A0A] text-white px-6 py-4">
                  <h2 className="font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#D4AF37]" /> Delivery Details
                  </h2>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name *</label>
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} required placeholder="John Doe"
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-shadow" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                        <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required type="tel" placeholder="+254 700 000 000"
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-shadow" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} type="email" placeholder="john@example.com"
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-shadow" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Delivery Location</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {DELIVERY_ZONES.map(zone => (
                        <button key={zone.id} type="button" onClick={() => setDeliveryZone(zone.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryZone === zone.id ? 'border-[#D4AF37] bg-[#faf7f0] shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${deliveryZone === zone.id ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                              {deliveryZone === zone.id && <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{zone.label}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {zone.fee !== null ? `Flat rate: ${formatPrice(zone.fee)}` : 'Price varies by product & distance'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Delivery Address / Landmark</label>
                    <textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Kilimani, Rose Avenue Apartments, Gate 3" rows={2}
                      className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-shadow resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Order Notes (Optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Any special delivery instructions..." rows={2}
                      className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-shadow resize-none" />
                  </div>

                  <button type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold bg-[#0A0A0A] text-white hover:bg-[#D4AF37] hover:text-[#0A0A0A] h-13 py-3.5 transition-colors">
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div>
                <div className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
                  <h2 className="font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Payment Method
                  </h2>
                  <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <p className="text-sm text-gray-600">Select your preferred payment method. All online payments are secure and encrypted.</p>

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(method => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${isSelected ? 'border-[#D4AF37] bg-[#faf7f0] shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: method.color + '18' }}>
                            <Icon className="w-6 h-6" style={{ color: method.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-900">{method.label}</div>
                            <div className="text-xs text-gray-500">{method.subtitle}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bank Transfer Preview */}
                  {paymentMethod === 'bank' && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Building2 className="w-5 h-5" />
                        <span className="font-bold text-sm">Bank Transfer Details</span>
                      </div>
                      <div className="bg-white rounded-lg border border-blue-100 p-3 space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-semibold">{BANK_DETAILS.bank}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Account Name</span><span className="font-semibold">{BANK_DETAILS.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Account No.</span><span className="font-mono font-bold">{BANK_DETAILS.account}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Branch</span><span className="font-semibold">{BANK_DETAILS.branch}</span></div>
                      </div>
                      <p className="text-xs text-blue-700">Your order number will be your payment reference. Full details shown after placing the order.</p>
                    </div>
                  )}

                  {/* COD Notice */}
                  {paymentMethod === 'cod' && (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                      <div className="flex items-center gap-2 text-yellow-800 mb-2">
                        <Banknote className="w-5 h-5" />
                        <span className="font-bold text-sm">Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-yellow-700">
                        Pay <strong>{formatPrice(grandTotal)}</strong> in cash when your order is delivered. Available within Nairobi. Our team will call to confirm your delivery slot.
                      </p>
                    </div>
                  )}

                  <button onClick={handlePayment} disabled={loading || !paymentMethod}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#b8903a] disabled:opacity-50 disabled:cursor-not-allowed h-13 py-3.5 transition-colors">
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (paymentMethod === 'bank' || paymentMethod === 'cod') ? (
                      <>Confirm & Place Order</>
                    ) : (
                      <>Pay {formatPrice(grandTotal)}</>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Online payments secured by IntaSend
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel — Order Summary */}
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-[#0A0A0A] text-white px-6 py-4">
              <h3 className="font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D4AF37]" /> Order Summary
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      {(item.imageUrl || item.image) ? (
                        <img src={item.imageUrl || item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">No img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.title || item.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatPrice((item.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium text-gray-900">{formatPrice(deliveryFee)}</span>
                </div>
                {deliveryZone === 'nairobi' && (
                  <p className="text-[10px] text-green-600 font-medium">🚛 Flat rate within Nairobi</p>
                )}
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-[#D4AF37]">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
