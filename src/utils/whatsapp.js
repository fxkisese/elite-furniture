import { formatPrice } from '@/lib/utils';

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '254141484249';

/**
 * Format an order into a WhatsApp message for the admin
 */
export function formatOrderForWhatsApp(order) {
  const items = order.items || [];
  
  let msg = `🛋️ *NEW ORDER — #${order.order_number}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  msg += `👤 *Customer Details*\n`;
  msg += `Name: ${order.customer_name}\n`;
  msg += `Phone: ${order.customer_phone}\n`;
  if (order.customer_email) msg += `Email: ${order.customer_email}\n`;
  msg += `\n`;
  
  msg += `📦 *Order Items*\n`;
  items.forEach((item, idx) => {
    const itemImage = item.imageUrl || item.image || "";
    msg += `${idx + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}${itemImage ? `\n   Image: ${itemImage}` : ""}\n`;
  });
  msg += `\n`;
  
  msg += `🚚 *Delivery*\n`;
  msg += `Location: ${order.delivery_location}\n`;
  if (order.delivery_address) msg += `Address: ${order.delivery_address}\n`;
  msg += `Delivery Fee: ${formatPrice(order.delivery_fee)}\n`;
  msg += `\n`;
  
  msg += `💳 *Payment*\n`;
  msg += `Method: ${order.payment_method.toUpperCase()}\n`;
  msg += `Status: ${order.payment_status.toUpperCase()}\n`;
  if (order.payment_reference) msg += `Reference: ${order.payment_reference}\n`;
  msg += `\n`;
  
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Subtotal: ${formatPrice(order.subtotal)}\n`;
  msg += `Delivery: ${formatPrice(order.delivery_fee)}\n`;
  msg += `*TOTAL: ${formatPrice(order.grand_total)}*\n`;
  
  if (order.notes) {
    msg += `\n📝 Notes: ${order.notes}\n`;
  }
  
  return msg;
}

/**
 * Open WhatsApp with the order details for admin
 */
export function sendOrderToAdminWhatsApp(order) {
  const message = formatOrderForWhatsApp(order);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encoded}`;
  window.open(url, '_blank');
  return true;
}

/**
 * Format cart items for a quick WhatsApp checkout (legacy cart flow)
 */
export function formatCartForWhatsApp(cartItems, cartTotal) {
  let message = "Hello! I would like to place an order for the following items:\n\n";
  cartItems.forEach((item, index) => {
    const itemImage = item.imageUrl || item.image || "";
    message += `${index + 1}. ${item.title || item.name} (x${item.quantity}) - ${formatPrice((item.price || 0) * item.quantity)}${itemImage ? `\n   Image: ${itemImage}` : ""}\n`;
  });
  message += `\n*Total Estimated Price:* ${formatPrice(cartTotal)}\n\n`;
  message += "Please let me know the availability and delivery options. Thank you!";
  return message;
}

/**
 * Format a credit record into a detailed WhatsApp payment reminder receipt
 * for the admin to send to the customer.
 */
export function formatCreditReceiptForWhatsApp(record) {
  const balance = (record.total || 0) - (record.paid || 0);
  const dueDate = record.due_date || record.dueDate;
  const isOverdue = dueDate && dueDate < new Date().toISOString().split('T')[0];

  let msg = `🛋️ *ELITE FURNITURE — PAYMENT REMINDER*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `Dear *${record.customer}*,\n\n`;
  msg += `We hope you are enjoying your furniture! This is a friendly reminder regarding your outstanding balance with *Elite Furniture — ${record.branch || 'Nairobi'}* branch.\n\n`;

  msg += `📋 *RECEIPT DETAILS*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 Item(s): ${record.item}\n`;
  msg += `💰 Total Amount: *${formatPrice(record.total)}*\n`;
  msg += `✅ Amount Paid: ${formatPrice(record.paid)}\n`;
  msg += `⚠️ Outstanding Balance: *${formatPrice(balance)}*\n`;
  msg += `📅 Payment Due: *${dueDate || 'As agreed'}*\n`;
  if (record.branch) msg += `🏪 Branch: ${record.branch}\n`;
  msg += `\n`;

  if (isOverdue) {
    msg += `🔴 *OVERDUE NOTICE*\n`;
    msg += `Your payment was due on ${dueDate}. Please settle the outstanding balance of *${formatPrice(balance)}* as soon as possible to avoid further inconvenience.\n\n`;
  } else {
    msg += `We kindly request you to settle the outstanding balance of *${formatPrice(balance)}* by *${dueDate || 'the agreed date'}*.\n\n`;
  }

  msg += `💳 *HOW TO PAY*\n`;
  msg += `• M-PESA: Send to our till/number and quote your name\n`;
  msg += `• Cash: Visit any Elite Furniture branch\n\n`;

  msg += `Thank you for your business and continued trust in Elite Furniture. We look forward to serving you again!\n\n`;
  msg += `📞 For queries, reply to this message.\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Elite Furniture — Quality You Can Sit On_ 🛋️`;

  return msg;
}

/**
 * Open WhatsApp with a credit payment reminder sent directly to the customer's phone
 */
export function sendCreditReminderWhatsApp(record) {
  // Normalise Kenyan phone numbers: strip spaces/dashes, convert 07xx → 2547xx
  let phone = (record.phone || '').replace(/[\s\-()]/g, '');
  if (phone.startsWith('0')) phone = '254' + phone.slice(1);
  if (!phone.startsWith('+')) phone = phone.replace(/^\+/, '');

  const message = formatCreditReceiptForWhatsApp(record);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
  return true;
}

/**
 * Format a brand-new credit sale into a WhatsApp receipt message for the customer.
 * Sent the moment a credit sale is recorded (distinct from the later payment reminder).
 */
export function formatNewCreditReceiptForWhatsApp(record) {
  const balance = (record.total || 0) - (record.paid || 0);
  const dueDate = record.due_date || record.dueDate;

  let msg = `🛋️ *ELITE FURNITURE — CREDIT SALE RECEIPT*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `Dear *${record.customer}*,\n\n`;
  msg += `Thank you for your purchase! This confirms your credit sale with *Elite Furniture — ${record.branch || 'Nairobi'}* branch.\n\n`;

  msg += `📋 *RECEIPT DETAILS*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 Item(s): ${record.item}\n`;
  msg += `💰 Total Amount: *${formatPrice(record.total)}*\n`;
  msg += `✅ Deposit Paid: ${formatPrice(record.paid)}\n`;
  msg += `⚠️ Balance Remaining: *${formatPrice(balance)}*\n`;
  msg += `📅 Balance Due: *${dueDate || 'As agreed'}*\n`;
  if (record.branch) msg += `🏪 Branch: ${record.branch}\n`;
  msg += `\n`;

  msg += `💳 *HOW TO CLEAR YOUR BALANCE*\n`;
  msg += `• M-PESA: Send to our till/number and quote your name\n`;
  msg += `• Cash: Visit any Elite Furniture branch\n\n`;

  msg += `Please keep this message as your receipt. Thank you for choosing Elite Furniture!\n\n`;
  msg += `📞 For queries, reply to this message.\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Elite Furniture — Quality You Can Sit On_ 🛋️`;

  return msg;
}

/**
 * Open WhatsApp with a brand-new credit-sale receipt sent directly to the customer's phone.
 * Call this right after a credit record is successfully saved.
 *
 * Pass `existingWindow` (a tab opened synchronously via window.open('', '_blank')
 * at click-time) so the redirect survives popup blockers even after an `await`.
 */
export function sendNewCreditReceiptWhatsApp(record, existingWindow) {
  // Normalise Kenyan phone numbers: strip spaces/dashes, convert 07xx → 2547xx
  let phone = (record.phone || '').replace(/[\s\-()]/g, '');
  if (phone.startsWith('0')) phone = '254' + phone.slice(1);
  if (!phone.startsWith('+')) phone = phone.replace(/^\+/, '');

  const message = formatNewCreditReceiptForWhatsApp(record);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;

  if (existingWindow && !existingWindow.closed) {
    existingWindow.location.href = url;
  } else {
    window.open(url, '_blank');
  }
  return true;
}

/**
 * Format a completed sale into a WhatsApp receipt for the customer.
 */
export function formatSaleReceiptForWhatsApp(record) {
  let msg = `🛋️ *ELITE FURNITURE — SALE RECEIPT*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `Dear *${record.customer}*,\n\n`;
  msg += `Thank you for your purchase at *Elite Furniture — ${record.branch || 'Nairobi'}* branch! Here is your receipt.\n\n`;

  msg += `🧾 *RECEIPT DETAILS*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 Item(s): ${record.item}\n`;
  msg += `💰 Amount Paid: *${formatPrice(record.amount)}*\n`;
  msg += `💳 Payment Type: ${record.payment}\n`;
  msg += `🏦 Method: ${record.method}\n`;
  msg += `📅 Date: ${record.date}\n`;
  if (record.branch) msg += `🏪 Branch: ${record.branch}\n`;
  msg += `\n`;

  msg += `Please keep this message as your proof of purchase.\n\n`;
  msg += `We look forward to serving you again! 🙏\n`;
  msg += `📞 For queries, reply to this message.\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Elite Furniture — Quality You Can Sit On_ 🛋️`;

  return msg;
}

/**
 * Open WhatsApp with a sale receipt sent to the customer's phone.
 * Pass `existingWindow` (opened synchronously before the await) to bypass popup blockers.
 */
export function sendSaleReceiptWhatsApp(record, existingWindow) {
  // Normalise Kenyan phone numbers: strip spaces/dashes, convert 07xx → 2547xx
  let phone = (record.phone || '').replace(/[\s\-()]/g, '');
  if (phone.startsWith('0')) phone = '254' + phone.slice(1);
  if (!phone.startsWith('+')) phone = phone.replace(/^\+/, '');

  const message = formatSaleReceiptForWhatsApp(record);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;

  if (existingWindow && !existingWindow.closed) {
    existingWindow.location.href = url;
  } else {
    window.open(url, '_blank');
  }
  return true;
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EF-${date}-${rand}`;
}
