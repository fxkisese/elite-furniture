import { formatPrice } from '@/lib/utils';

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '254793816450';

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
    msg += `${idx + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}\n`;
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
    message += `${index + 1}. ${item.title || item.name} (x${item.quantity}) - ${formatPrice((item.price || 0) * item.quantity)}\n`;
  });
  message += `\n*Total Estimated Price:* ${formatPrice(cartTotal)}\n\n`;
  message += "Please let me know the availability and delivery options. Thank you!";
  return message;
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
